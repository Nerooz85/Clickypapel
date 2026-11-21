// components/InvitationHero.jsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function InvitationHero({ weddingData }) {
  // Le agregamos el || {} por seguridad para que no marque error mientras carga
  const { groomName, brideName, eventDate, coverImage, welcomePhrase } = weddingData || {};

  // Estado para la cuenta regresiva
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    if (!eventDate) return;
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

  // 🎬 Variantes de animación (Efecto Cascada)
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.3, delayChildren: 0.4 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] } }
  };

  return (
    <section className="relative h-screen w-full flex flex-col items-center justify-start pt-[20vh] text-center px-4 overflow-hidden">
      
      {/* 🌲 Imagen de fondo animada (Zoom out sutil) */}
      <motion.div 
        className="absolute inset-0 z-0"
        initial={{ scale: 1.15 }}
        animate={{ scale: 1 }}
        transition={{ duration: 10, ease: "easeOut" }}
      >
        <div 
          className="w-full h-full bg-cover bg-center"
          style={{ backgroundImage: `url(${coverImage || '/placeholder-wedding.jpg'})` }}
        />
      </motion.div>
      <div className="absolute inset-0 bg-black/40 z-10" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50 z-10" />

      {/* ✨ Contenido Emocional de la Invitación (Animado) */}
      <motion.div 
        className="relative z-20 text-white max-w-2xl flex flex-col items-center w-full"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <motion.span variants={itemVariants} className="etiqueta mb-4 text-[var(--dorado)] drop-shadow-md">
          ¡Nos Casamos!
        </motion.span>
        
        {/* Nombres */}
        <motion.h1 variants={itemVariants} className="font-display text-5xl md:text-7xl font-light my-2 tracking-wide drop-shadow-md">
          {brideName} <span className="font-script text-[var(--dorado)] font-normal">&</span> {groomName}
        </motion.h1>
        
        <motion.p variants={itemVariants} className="font-display font-light italic text-base md:text-lg text-white/90 mt-4 max-w-md px-4 drop-shadow-md">
          "{welcomePhrase || 'El amor todo lo cree, todo lo espera, todo lo soporta.'}"
        </motion.p>

        <motion.div variants={itemVariants} className="oro-linea w-24 mt-8" aria-hidden="true" />

        {/* Bloque de la Cuenta Regresiva */}
        <motion.div variants={itemVariants} className="mt-8 grid grid-cols-4 gap-4 md:gap-6 bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-[2rem] max-w-md w-full shadow-2xl">
          <div className="flex flex-col">
            <span className="font-display text-3xl md:text-4xl font-light text-[var(--dorado)] drop-shadow-md">{timeLeft.days}</span>
            <span className="etiqueta text-white/70 mt-1">Días</span>
          </div>
          <div className="flex flex-col">
            <span className="font-display text-3xl md:text-4xl font-light text-[var(--dorado)] drop-shadow-md">{timeLeft.hours}</span>
            <span className="etiqueta text-white/70 mt-1">Horas</span>
          </div>
          <div className="flex flex-col">
            <span className="font-display text-3xl md:text-4xl font-light text-[var(--dorado)] drop-shadow-md">{timeLeft.minutes}</span>
            <span className="etiqueta text-white/70 mt-1">Min</span>
          </div>
          <div className="flex flex-col">
            <span className="font-display text-3xl md:text-4xl font-light text-[var(--dorado)] drop-shadow-md">{timeLeft.seconds}</span>
            <span className="etiqueta text-white/70 mt-1">Seg</span>
          </div>
        </motion.div>
      </motion.div>

      {/* Indicador de scroll sutil */}
      <motion.div 
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center opacity-70"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7, y: [0, 8, 0] }}
        transition={{ delay: 2, duration: 2, repeat: Infinity }}
      >
        <span className="etiqueta text-white/80 font-light drop-shadow-md mb-2">Desliza para ver más</span>
        <div className="w-px h-6 bg-[var(--dorado)]/70" />
      </motion.div>
    </section>
  );
}