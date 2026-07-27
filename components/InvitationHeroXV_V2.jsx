"use client";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function InvitationHeroXV_V2({ weddingData }) {
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
    <section className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden bg-zinc-950">
      
      {/* 🌃 FONDO NOCHE NEÓN */}
      <div className="absolute inset-0 z-0">
        <img 
          src={weddingData?.coverImage || 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?auto=format&fit=crop&w=1920&q=80'} 
          alt="Mis XV" 
          className="w-full h-full object-cover opacity-50 grayscale mix-blend-luminosity"
        />
        {/* Degradado urbano con toques fucsia y violeta */}
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/80 via-fuchsia-900/30 to-zinc-950/90 z-0" />
      </div>

      {/* ✨ EFECTOS DE LUCES FLOTANTES */}
      <motion.div 
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }} 
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 left-1/4 w-64 h-64 bg-fuchsia-600/30 rounded-full blur-[100px] z-0 pointer-events-none"
      />
      <motion.div 
        animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.5, 0.2] }} 
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-cyan-600/20 rounded-full blur-[100px] z-0 pointer-events-none"
      />

      {/* 🎤 CONTENIDO PRINCIPAL ESTILO VIP */}
      <div className="relative z-10 flex flex-col items-center text-center w-full px-6 mt-12">
        
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1 }}
          className="border border-fuchsia-500/50 bg-fuchsia-500/10 backdrop-blur-sm px-6 py-2 rounded-full mb-6"
        >
          <span className="text-[10px] md:text-xs tracking-[0.4em] text-fuchsia-200 uppercase font-bold drop-shadow-[0_0_8px_rgba(217,70,239,0.8)]">
            Mis XV Años
          </span>
        </motion.div>

        {/* El nombre con tipografía moderna y brillo */}
        <motion.h1 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="text-7xl md:text-9xl font-bold text-white tracking-tighter uppercase drop-shadow-[0_0_20px_rgba(217,70,239,0.5)]"
        >
          {weddingData?.brideName || "Sofía"}
        </motion.h1>

        <p className="font-sans font-light tracking-widest text-xs md:text-sm text-zinc-300 mt-6 max-w-sm uppercase">
          "{weddingData?.welcomePhrase || 'La mejor noche de mi vida está por comenzar.'}"
        </p>

        {/* ⏳ CONTADOR ESTILO NEÓN */}
        <motion.div 
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="mt-12 flex gap-4 md:gap-8 bg-zinc-900/60 backdrop-blur-xl border border-zinc-700/50 p-6 md:p-8 rounded-3xl shadow-[0_0_30px_rgba(217,70,239,0.15)]"
        >
          {[
            { label: 'Días', value: timeLeft.days },
            { label: 'Hrs', value: timeLeft.hours },
            { label: 'Min', value: timeLeft.minutes },
            { label: 'Seg', value: timeLeft.seconds }
          ].map((item, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <span className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-fuchsia-300">
                {item.value < 10 ? `0${item.value}` : item.value}
              </span>
              <span className="text-[9px] md:text-[10px] tracking-widest text-zinc-400 uppercase mt-2 font-bold">
                {item.label}
              </span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Indicador Scroll */}
      <motion.div 
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-8 flex flex-col items-center opacity-60 z-20"
      >
        <span className="text-[9px] uppercase tracking-widest text-fuchsia-300 mb-2 font-bold">VIP Access</span>
        <div className="w-[1px] h-8 bg-gradient-to-b from-fuchsia-400 to-transparent" />
      </motion.div>
    </section>
  );
}