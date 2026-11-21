"use client";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function InvitationHeroXV_V3({ weddingData }) {
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

  return (
    <section className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden bg-[var(--arena)]">
      
      {/* 🌸 FONDO PASTEL Y FOTOGRAFÍA ENMARCADA */}
      <div className="absolute inset-0 z-0 flex items-center justify-center">
        <motion.div 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="w-full h-full md:w-[85%] md:h-[90%] rounded-none md:rounded-[3rem] overflow-hidden relative shadow-2xl"
        >
          <img 
            src={weddingData?.coverImage || 'https://images.unsplash.com/photo-1549476464-37392f717541?auto=format&fit=crop&w=1920&q=80'} 
            alt="Mis XV" 
            className="w-full h-full object-cover opacity-90"
          />
          {/* Overlay suave vintage */}
          <div className="absolute inset-0 bg-[var(--nieve)]/30 mix-blend-overlay" />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--tinta)]/60 via-[var(--tinta)]/10 to-transparent" />
        </motion.div>
      </div>

      {/* ✨ CONTENIDO PRINCIPAL ESTILO COQUETTE */}
      <div className="relative z-10 flex flex-col items-center text-center w-full px-6 mt-[20vh] md:mt-[30vh]">
        
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          <span className="etiqueta text-white/90 drop-shadow-md">
            Mis XV Años
          </span>
        </motion.div>

        {/* Nombre con tipografía cursiva clásica */}
        <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1.2, delay: 0.5 }}
          className="text-7xl md:text-9xl font-script text-white drop-shadow-xl mt-2 mb-4"
        >
          {weddingData?.brideName || "Sofía"}
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="font-display italic text-base md:text-lg text-white/90 max-w-sm drop-shadow-md"
        >
          "{weddingData?.welcomePhrase || 'Celebrando la magia de un nuevo comienzo.'}"
        </motion.p>

        {/* ⏳ CONTADOR ESTILO DELICADO */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="mt-12 flex gap-6 md:gap-10 bg-white/10 backdrop-blur-md border border-white/30 p-6 md:p-8 rounded-[2rem]"
        >
          {[
            { label: 'Días', value: timeLeft.days },
            { label: 'Hrs', value: timeLeft.hours },
            { label: 'Min', value: timeLeft.minutes },
            { label: 'Seg', value: timeLeft.seconds }
          ].map((item, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <span className="font-display text-3xl md:text-4xl font-light text-white drop-shadow-md">
                {item.value < 10 ? `0${item.value}` : item.value}
              </span>
              <span className="etiqueta text-white/80 mt-2 font-light">
                {item.label}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}