"use client";
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function SuccessContent() {
  const searchParams = useSearchParams();
  const slug = searchParams.get('slug') || '';

  return (
    <div className="bg-white rounded-3xl border border-stone-200/60 shadow-2xl max-w-md w-full p-8 text-center space-y-6">
      <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto text-2xl border border-emerald-100 shadow-3xs">
        🎉
      </div>

      <div className="space-y-2">
        <h1 className="font-serif text-xl text-stone-900 font-medium">¡Felicidades, Pago Confirmado!</h1>
        <p className="text-xs text-stone-400 font-light leading-relaxed">
          Tu pasarela y tu espacio digital han sido desbloqueados con éxito. Su invitación ya está lista para ser configurada.
        </p>
      </div>

      <div className="bg-stone-50 rounded-2xl p-4 text-center border border-stone-100 text-xs">
        <span className="text-stone-500 block mb-1">Tu enlace oficial:</span>
        <strong className="text-amber-800 font-mono text-sm block">tugrandia.icu/{slug}</strong>
      </div>

      <a
        href={`/dashboard?slug=${slug}`}
        className="w-full bg-stone-950 hover:bg-amber-700 text-white text-xs uppercase font-bold tracking-widest py-4 rounded-xl transition-colors shadow-md text-center block cursor-pointer"
      >
        Ingresar a mi Dashboard ➔
      </a>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <div className="min-h-screen bg-[#f1ede6] text-stone-800 flex items-center justify-center p-4 font-sans antialiased">
      <Suspense fallback={<div className="text-xs uppercase font-mono animate-pulse text-stone-400">Cargando confirmación... ✨</div>}>
        <SuccessContent />
      </Suspense>
    </div>
  );
}