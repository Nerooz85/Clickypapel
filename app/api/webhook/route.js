import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Inicializamos un cliente administrativo de Supabase para poder saltar políticas de seguridad de escritura RLS
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // Asegúrate de meter tu llave Service Role en tus variables de Vercel
);

export async function POST(request) {
  try {
    const cuerpo = await request.json();

    // Filtramos solo cuando el evento de Stripe sea un checkout completado exitosamente
    if (cuerpo.type === 'checkout.session.completed') {
      const sesion = cuerpo.data.object;
      
      // Capturamos la referencia que inyectamos en el checkout
      const weddingSlug = sesion.client_reference_id;

      if (weddingSlug) {
        console.log(`💰 ¡Pago verificado en Stripe! Activando el espacio: ${weddingSlug}`);

        // Actualizamos directo en la tabla "bodas" para activar su estatus real
        const { error } = await supabaseAdmin
          .from('bodas')
          .update({ 
            pago_confirmado: true,
            plan_tipo: sesion.amount_total >= 249000 ? 'vip' : sesion.amount_total >= 149000 ? 'premium' : 'basicos'
          })
          .eq('slug', weddingSlug.toLowerCase().trim());

        if (error) throw error;
        
        console.log(`🚀 Espacio ${weddingSlug} desbloqueado al 100% en Supabase.`);
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });

  } catch (err) {
    console.error("❌ Error dentro del Webhook de Stripe:", err.message);
    return NextResponse.json({ error: "Fallo en el procesamiento del Webhook" }, { status: 400 });
  }
}