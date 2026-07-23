"use client";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function InvitationHeroXV({ weddingData }) {
  if (!weddingData) return null;

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

  const floatAnimation = {
    y: [0, -15, 0],
    transition: { duration: 4, repeat: Infinity, ease: "easeInOut" }
  };

  return (
    <section className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden bg-rose-50">
      
      {/* 🌸 FONDO JUVENIL (Imagen + Degradado Rose Gold) */}
      <div className="absolute inset-0 z-0">
        <img 
          src={weddingData?.coverImage || 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7'} 
          alt="Mis XV" 
          className="w-full h-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-rose-400/40 via-pink-900/40 to-purple-900/60 mix-blend-overlay" />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* ✨ CONTENIDO PRINCIPAL */}
      <div className="relative z-10 flex flex-col items-center text-center w-full px-6">
        
        <motion.div animate={floatAnimation} className="mb-4">
          <span className="text-[12px] md:text-[14px] tracking-[0.5em] text-rose-200 uppercase font-bold drop-shadow-md">
            Mis XV Años
          </span>
        </motion.div>

        {/* El nombre toma protagonismo absoluto (Con fallback seguro) */}
        <motion.h1 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="text-7xl md:text-9xl font-script text-white drop-shadow-[0_5px_15px_rgba(255,192,203,0.5)] my-2"
        >
          {weddingData?.brideName || "Sofía"}
        </motion.h1>

        {/* 👇 FRASE CONECTADA AL DASHBOARD CON VALOR POR DEFECTO DE XV */}
        <p className="font-sans font-light tracking-widest text-xs md:text-sm text-white/90 mt-6 max-w-sm uppercase drop-shadow-md">
          "{weddingData?.welcomePhrase || 'Hay momentos inolvidables que se guardan en el corazón para siempre.'}"
        </p>

        {/* ⏳ CONTADOR ESTILO "GLAMOUR" */}
        <motion.div 
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="mt-12 flex gap-4 md:gap-8 bg-white/20 backdrop-blur-lg border border-white/30 p-6 md:p-8 rounded-[2rem] shadow-[0_10px_30px_rgba(0,0,0,0.2)]"
        >
          {[
            { label: 'Días', value: timeLeft.days },
            { label: 'Hrs', value: timeLeft.hours },
            { label: 'Min', value: timeLeft.minutes },
            { label: 'Seg', value: timeLeft.seconds }
          ].map((item, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <span className="text-3xl md:text-5xl font-serif text-white font-light drop-shadow-md">
                {item.value < 10 ? `0${item.value}` : item.value}
              </span>
              <span className="text-[9px] md:text-[10px] tracking-widest text-rose-200 uppercase mt-2 font-bold">
                {item.label}
              </span>
            </div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}