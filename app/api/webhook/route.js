import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// 🌟 Parche 1: Le indicamos a Next.js que esta ruta es 100% dinámica (Evita el error en el build de Vercel)
export const dynamic = 'force-dynamic';

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

        // 🌟 Parche 2: Inicialización perezosa (Lazy Init) sólo cuando se ejecuta el POST en vivo
        const urlSupabase = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const serviceRoleSupabase = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!urlSupabase || !serviceRoleSupabase) {
          console.error("⚠️ Error: Faltan las llaves de Supabase en las variables de entorno de producción.");
          return NextResponse.json({ error: "Configuración de entorno incompleta" }, { status: 500 });
        }

        // Inicializamos el cliente administrativo seguro aquí adentro
        const supabaseAdmin = createClient(urlSupabase, serviceRoleSupabase);

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