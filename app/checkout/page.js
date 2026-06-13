"use client";
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function CheckoutContent() {
  const searchParams = useSearchParams();
  
  // Capturamos los datos que vienen del embudo de ventas
  const plan = searchParams.get('plan') || 'premium';
  const slug = searchParams.get('slug') || 'tu-boda';
  const musicaExtra = searchParams.get('musica') === 'custom';

  const [procesando, setProcesando] = useState(false);

  // Mapeo de Precios Oficiales de ClickyPapel
  const precios = { basicos: 890, premium: 1490, vip: 2490 };
  const precioBase = precios[plan] || 1490;
  const precioMusica = musicaExtra ? 350 : 0;
  const total = precioBase + precioMusica;

  // 🔑 ENLACES REALES DE TU CUENTA DE STRIPE CON EL IDENTIFICADOR DINÁMICO
  const enlacesDePagoStripe = {
    basicos: `https://buy.stripe.com/14A28rd9NgZ14jd8jC6J201?client_reference_id=${slug}`,
    premium: `https://buy.stripe.com/3cIcN5fhV5gjbLF43m6J200?client_reference_id=${slug}`,
    vip: `https://buy.stripe.com/fZucN52v98sv8zt9nG6J202?client_reference_id=${slug}`
  };

  const handleRedireccionStripe = () => {
    setProcesando(true);
    
    // Si el plan es "basicos", "premium" o "vip", usamos el mapeo correspondiente
    const urlDestino = enlacesDePagoStripe[plan] || enlacesDePagoStripe.premium;
    
    // Redirigir al entorno seguro de Stripe
    window.location.href = urlDestino;
  };

  // Disparar la redirección automática tras 2.5 segundos de carga elegante
  useEffect(() => {
    const timer = setTimeout(() => {
      handleRedireccionStripe();
    }, 2500);
    return () => clearTimeout(timer);
  }, [plan, slug]);

  return (
    <div className="bg-white rounded-3xl border border-stone-200/60 shadow-2xl max-w-md w-full p-8 text-center space-y-6">
      
      {/* Indicador de Carga Animado */}
      <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
        <div className="absolute inset-0 border-4 border-stone-100 rounded-full" />
        <div className="absolute inset-0 border-4 border-t-amber-700 rounded-full animate-spin" />
        <span className="text-xl">💳</span>
      </div>

      <div className="space-y-2">
        <h1 className="font-serif text-xl text-stone-900 font-medium">Conectando con la Pasarela de Pago</h1>
        <p className="text-xs text-stone-400 font-light leading-relaxed">Estamos preparando tu entorno de cobro cifrado con Stripe. No cierres ni recargues esta ventana.</p>
      </div>

      {/* Resumen de Cuenta visual para dar seguridad al cliente */}
      <div className="bg-stone-50 rounded-2xl p-4 text-left border border-stone-100 space-y-2.5 text-xs">
        <div className="flex justify-between font-medium">
          <span className="text-stone-500">Plan contratado:</span>
          <span className="text-stone-900 uppercase font-mono font-bold">
            {plan === 'basicos' ? 'Digital Esencial' : plan === 'vip' ? 'VIP Celestial' : 'Gran Día Premium'}
          </span>
        </div>
        <div className="flex justify-between font-medium">
          <span className="text-stone-500">Espacio reservado:</span>
          <span className="text-amber-800 font-mono font-bold">clickypapel.com/{slug}</span>
        </div>
        {musicaExtra && (
          <div className="flex justify-between font-medium text-purple-950">
            <span>Complemento:</span>
            <span>Música Personalizada 🎵</span>
          </div>
        )}
        <hr className="border-stone-200/60 my-1" />
        <div className="flex justify-between items-baseline pt-1">
          <span className="font-bold text-stone-800">Total a liquidar:</span>
          <span className="text-xl font-mono font-black text-stone-900">${total.toLocaleString('es-MX')} MXN</span>
        </div>
      </div>

      <button
        type="button"
        onClick={handleRedireccionStripe}
        disabled={procesando}
        className="w-full bg-stone-950 hover:bg-amber-700 text-white text-xs uppercase font-bold tracking-widest py-3.5 rounded-xl transition-colors shadow-sm cursor-pointer block"
      >
        {procesando ? 'Redirigiendo...' : 'Ir a Stripe de inmediato ➔'}
      </button>

      <span className="text-[10px] text-stone-400 font-mono block">🔒 Conexión segura SSL de 256 bits</span>
    </div>
  );
}

// 👑 COMPONENTE COMPLETO INTEGRADO CON SUSPENSE PARA EVITAR ERRORES EN EL BUILD
export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-[#f1ede6] text-stone-800 flex items-center justify-center p-4 font-sans antialiased">
      <Suspense fallback={
        <div className="text-xs uppercase tracking-widest text-stone-400 font-mono animate-pulse">
          Inicializando pasarela financiera... ✨
        </div>
      }>
        <CheckoutContent />
      </Suspense>
    </div>
  );
}