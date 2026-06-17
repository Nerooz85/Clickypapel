import { useState, useEffect } from 'react';

export default function InvitationHeroV2({ weddingData, diseño }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    if (!weddingData?.eventDate) return;
    
    const target = new Date(weddingData.eventDate).getTime();
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = target - now;
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [weddingData?.eventDate]);

  return (
    // 👇 CAMBIO AQUÍ: justify-start y pt-[15vh] para subir el bloque de cristal
    <section className="relative w-full h-screen flex flex-col items-center justify-start pt-[15vh] overflow-hidden">
      
      {/* Fondo fotográfico a pantalla completa con zoom suave */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-[20s] ease-out scale-100 hover:scale-110"
        style={{ backgroundImage: `url(${weddingData?.coverImage || 'https://images.unsplash.com/photo-1519741497674-611481863552'})` }}
      />
      {/* Filtro oscuro para asegurar que el texto sea legible siempre */}
      <div className="absolute inset-0 bg-stone-900/40 mix-blend-multiply" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-stone-900/20 to-stone-900/90" />

      {/* Tarjeta de Cristal Central (Frosted Glass) */}
      <div className="relative z-10 bg-white/10 backdrop-blur-md border border-white/20 p-8 md:p-12 rounded-3xl text-center text-white shadow-2xl max-w-lg w-[90%] flex flex-col items-center animate-fadeIn">
        <p className="text-[10px] md:text-xs tracking-[0.3em] uppercase mb-4 opacity-80 font-sans">Nuestra Boda</p>
        
        {/* Nombres */}
        <h1 className="text-5xl md:text-7xl mb-1">{weddingData?.brideName || "Novia"}</h1>
        <span className="text-3xl italic opacity-70 my-1 font-serif">&</span>
        <h1 className="text-5xl md:text-7xl mb-4">{weddingData?.groomName || "Novio"}</h1>
        
        {/* 👇 FRASE PERSONALIZADA AÑADIDA AQUÍ */}
        <p className="font-light italic text-sm md:text-base text-gray-200/90 mb-6 max-w-sm px-4 drop-shadow-md">
          "{weddingData?.welcomePhrase || 'El amor todo lo cree, todo lo espera, todo lo soporta.'}"
        </p>

        {/* Fecha y Botón de Agenda */}
        <div className="border-t border-white/30 pt-6 w-full flex flex-col items-center gap-4">
          <p className="text-sm md:text-base tracking-widest uppercase font-sans font-light">
            {weddingData?.eventDate ? new Date(weddingData.eventDate).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }) : "Fecha por definir"}
          </p>
          <button className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/50 text-white text-[10px] uppercase tracking-widest px-6 py-2 rounded-full transition-colors mt-2">
            📅 Agendar
          </button>
        </div>
      </div>

      {/* Contador Minimalista en la parte inferior */}
      <div className="absolute bottom-0 left-0 right-0 pt-20 pb-8 z-20">
        <div className="max-w-md mx-auto flex justify-center gap-6 md:gap-12 text-white text-center">
          {[
            { label: 'Días', value: timeLeft.days },
            { label: 'Hrs', value: timeLeft.hours },
            { label: 'Min', value: timeLeft.minutes },
            { label: 'Seg', value: timeLeft.seconds }
          ].map((item, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <span className="text-3xl md:text-5xl font-light tracking-widest">{item.value < 10 ? `0${item.value}` : item.value}</span>
              <span className="text-[9px] md:text-[10px] tracking-[0.2em] uppercase opacity-60 mt-1 font-sans">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}