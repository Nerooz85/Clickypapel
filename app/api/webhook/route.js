import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';
import { planPorMontoEnCentavos } from '@/lib/precios';

// Esta ruta nunca se cachea: siempre corre en vivo.
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request) {
  const firma = request.headers.get('stripe-signature');

  // Stripe firma el cuerpo tal cual viaja. Hay que leerlo como texto,
  // sin parsear, o la firma no cuadra.
  const cuerpoCrudo = await request.text();

  const llaveStripe = process.env.STRIPE_SECRET_KEY;
  const secretoWebhook = process.env.STRIPE_WEBHOOK_SECRET;

  if (!llaveStripe || !secretoWebhook) {
    console.error('Faltan STRIPE_SECRET_KEY o STRIPE_WEBHOOK_SECRET.');
    return NextResponse.json({ error: 'Configuración incompleta' }, { status: 500 });
  }

  const stripe = new Stripe(llaveStripe);

  // ─────────────────────────────────────────────────────────
  // Verificación de firma. Sin esto, cualquiera podía mandar
  // un POST inventado y desbloquear una invitación sin pagar.
  // ─────────────────────────────────────────────────────────
  let evento;
  try {
    evento = stripe.webhooks.constructEvent(cuerpoCrudo, firma, secretoWebhook);
  } catch (err) {
    console.error('Firma de Stripe inválida:', err.message);
    return NextResponse.json({ error: 'Firma inválida' }, { status: 400 });
  }

  if (evento.type !== 'checkout.session.completed') {
    return NextResponse.json({ received: true }, { status: 200 });
  }

  try {
    const sesion = evento.data.object;
    const slug = sesion.client_reference_id;

    if (!slug) {
      console.warn('Cobro sin client_reference_id: no sabemos qué evento desbloquear.');
      return NextResponse.json({ received: true }, { status: 200 });
    }

    const urlSupabase = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!urlSupabase || !serviceRole) {
      console.error('Faltan las llaves de Supabase en producción.');
      return NextResponse.json({ error: 'Configuración incompleta' }, { status: 500 });
    }

    // El service role se salta RLS a propósito: este código corre
    // en el servidor y nadie más lo puede llamar sin la firma.
    const supabaseAdmin = createClient(urlSupabase, serviceRole);

    const { error } = await supabaseAdmin
      .from('bodas')
      .update({
        pago_confirmado: true,
        plan_tipo: planPorMontoEnCentavos(sesion.amount_total),
        pagado_en: new Date().toISOString(),
        stripe_session_id: sesion.id,
      })
      .eq('slug', slug.toLowerCase().trim());

    if (error) throw error;

    console.log(`Evento ${slug} desbloqueado.`);
    return NextResponse.json({ received: true }, { status: 200 });
  } catch (err) {
    console.error('Error procesando el webhook:', err.message);
    // 500 hace que Stripe reintente; 400 no. Aquí sí queremos reintento.
    return NextResponse.json({ error: 'Fallo al procesar' }, { status: 500 });
  }
}
