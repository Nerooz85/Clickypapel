// components/InvitationHero.jsx
import { useState, useEffect } from 'react';

export default function InvitationHero({ weddingData }) {
  // weddingData vendrá de tu base de datos (Supabase/Firebase) con los nombres y la fecha
  const { groomName, brideName, eventDate, coverImage, welcomePhrase } = weddingData;

  // Estado para la cuenta regresiva
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const targetDate = new Date(eventDate).getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference < 0) {
        clearInterval(interval);
      } else {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [eventDate]);

  return (
    <section className="relative h-screen w-full flex flex-col items-center justify-center text-center px-4 overflow-hidden">
      {/* Imagen de fondo premium con un overlay oscuro para que el texto resalte */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0 scale-105 transition-transform duration-10000 ease-out"
        style={{ backgroundImage: `url(${coverImage || '/placeholder-wedding.jpg'})` }}
      />
      <div className="absolute inset-0 bg-black/40 z-10" />

      {/* Contenido Emocional de la Invitación */}
      <div className="relative z-20 text-white max-w-2xl flex flex-col items-center">
        <span className="font-serif tracking-widest text-xs uppercase mb-4 text-amber-200/90">
          ¡Nos Casamos!
        </span>
        
        {/* Nombres con tipografía manuscrita/elegante */}
        <h1 className="text-5xl md:text-7xl font-serif font-light my-2 tracking-wide">
          {brideName} <span className="text-amber-300 font-normal">&</span> {groomName}
        </h1>
        
        <p className="font-light italic text-sm md:text-base text-gray-200/90 mt-4 max-w-md px-4">
          "{welcomePhrase || 'El amor todo lo cree, todo lo espera, todo lo soporta.'}"
        </p>

        {/* Bloque de la Cuenta Regresiva (Innovación Visual) */}
        <div className="mt-12 grid grid-cols-4 gap-4 md:gap-6 bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl max-w-md w-full">
          <div className="flex flex-col">
            <span className="text-3xl md:text-4xl font-serif font-light text-amber-200">{timeLeft.days}</span>
            <span className="text-[10px] uppercase tracking-wider text-gray-300 mt-1">Días</span>
          </div>
          <div className="flex flex-col">
            <span className="text-3xl md:text-4xl font-serif font-light text-amber-200">{timeLeft.hours}</span>
            <span className="text-[10px] uppercase tracking-wider text-gray-300 mt-1">Horas</span>
          </div>
          <div className="flex flex-col">
            <span className="text-3xl md:text-4xl font-serif font-light text-amber-200">{timeLeft.minutes}</span>
            <span className="text-[10px] uppercase tracking-wider text-gray-300 mt-1">Min</span>
          </div>
          <div className="flex flex-col">
            <span className="text-3xl md:text-4xl font-serif font-light text-amber-200">{timeLeft.seconds}</span>
            <span className="text-[10px] uppercase tracking-wider text-gray-300 mt-1">Seg</span>
          </div>
        </div>
      </div>

      {/* Indicador de scroll sutil */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 animate-bounce">
        <span className="text-xs tracking-widest uppercase text-gray-300 font-light">Desliza para ver más</span>
      </div>
    </section>
  );
}