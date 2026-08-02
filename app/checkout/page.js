"use client";
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { obtenerPlan, calcularTotal, formatearPesos, enlaceDePago } from '@/lib/precios';

function CheckoutContent() {
  const searchParams = useSearchParams();
  
  // Capturamos los datos que vienen del embudo de ventas
  const plan = searchParams.get('plan') || 'premium';
  const slug = searchParams.get('slug') || 'tu-boda';
  const musicaExtra = searchParams.get('musica') === 'custom';

  const [procesando, setProcesando] = useState(false);

  // Precios y enlaces de Stripe: todo sale de lib/precios.js
  const planInfo = obtenerPlan(plan);
  const total = calcularTotal(plan, musicaExtra);

  const handleRedireccionStripe = () => {
    setProcesando(true);
    window.location.href = enlaceDePago(plan, slug);
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
        <h1 className="font-serif text-xl text-stone-900 font-medium">Te llevamos al pago seguro</h1>
        <p className="text-xs text-stone-400 font-light leading-relaxed">Stripe procesa el cobro. No cierres esta ventana.</p>
      </div>

      {/* Resumen de Cuenta visual para dar seguridad al cliente */}
      <div className="bg-stone-50 rounded-2xl p-4 text-left border border-stone-100 space-y-2.5 text-xs">
        <div className="flex justify-between font-medium">
          <span className="text-stone-500">Plan contratado:</span>
          <span className="text-stone-900 uppercase font-mono font-bold">
            {planInfo.nombre}
          </span>
        </div>
        
        {/* ✨ CAMBIO DE BRANDING ESTRATÉGICO: El cliente confirma visualmente que su invitación vivirá en tugrandia.icu */}
        <div className="flex justify-between font-medium">
          <span className="text-stone-500">Espacio reservado:</span>
          <span className="text-amber-800 font-mono font-bold">tugrandia.icu/{slug}</span>
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
          <span className="text-xl font-mono font-black text-stone-900">{formatearPesos(total)} MXN</span>
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