 "use client";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function InvitationHeroV3({ weddingData, diseño }) {
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

  // Variantes de animación de Framer Motion para lograr el efecto "Bosque"
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.4, delayChildren: 0.5 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] } }
  };

  return (
    <section className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden bg-stone-950">
      
      {/* 🌲 FONDO CON EFECTO PARALLAX/ZOOM LENTO */}
      <motion.div 
        className="absolute inset-0 z-0"
        initial={{ scale: 1.15 }}
        animate={{ scale: 1 }}
        transition={{ duration: 10, ease: "easeOut" }}
      >
        <div 
          className="w-full h-full bg-cover bg-center"
          style={{ backgroundImage: `url(${weddingData?.coverImage || 'https://images.unsplash.com/photo-1519741497674-611481863552'})` }}
        />
      </motion.div>

      {/* OVERLAYS PARA DAR ESE TONO "MOODY" DE BOSQUE */}
      <div className="absolute inset-0 bg-stone-950/50 mix-blend-multiply z-0" />
      <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-transparent to-stone-950/60 z-0" />

      {/* ✨ CONTENIDO ANIMADO ESCALONADO */}
      <motion.div 
        className="relative z-10 flex flex-col items-center text-center w-full px-6"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <motion.span variants={itemVariants} className="text-[9px] md:text-[11px] tracking-[0.4em] text-[#d4af37] uppercase font-light mb-6">
          ¡Nos Casamos!
        </motion.span>

        {/* Nombres con Fallback de seguridad 👇 */}
        <motion.h1 variants={itemVariants} className="text-6xl md:text-8xl font-serif text-white/95 drop-shadow-2xl leading-none">
          {weddingData?.brideName || "Novia"}
        </motion.h1>
        
        <motion.div variants={itemVariants} className="my-2 md:my-4">
          <span className="text-4xl md:text-6xl font-script text-[#d4af37] font-light">&</span>
        </motion.div>
        
        <motion.h1 variants={itemVariants} className="text-6xl md:text-8xl font-serif text-white/95 drop-shadow-2xl leading-none mb-8">
          {weddingData?.groomName || "Novio"}
        </motion.h1>

        {/* Frase Personalizada conectada 👇 */}
        <motion.p variants={itemVariants} className="font-serif italic text-sm md:text-base text-stone-200/80 max-w-md drop-shadow-md tracking-wide">
          "{weddingData?.welcomePhrase || 'El amor todo lo cree, todo lo espera, todo lo soporta.'}"
        </motion.p>

        {/* Línea divisoria elegante */}
        <motion.div variants={itemVariants} className="w-px h-12 md:h-16 bg-gradient-to-b from-transparent via-[#d4af37]/50 to-transparent my-8" />

        {/* ⏳ CONTADOR ESTILO BOSQUE MÍSTICO */}
        <motion.div variants={itemVariants} className="grid grid-cols-4 gap-6 md:gap-10">
          {[
            { label: 'Días', value: timeLeft.days },
            { label: 'Hrs', value: timeLeft.hours },
            { label: 'Min', value: timeLeft.minutes },
            { label: 'Seg', value: timeLeft.seconds }
          ].map((item, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <span className="text-4xl md:text-5xl font-serif text-[#d4af37] drop-shadow-md">
                {item.value < 10 ? `0${item.value}` : item.value}
              </span>
              <span className="text-[8px] md:text-[9px] tracking-[0.3em] text-stone-300 uppercase mt-2 font-light">
                {item.label}
              </span>
            </div>
          ))}
        </motion.div>

      </motion.div>

      {/* Flecha indicadora flotante */}
      <motion.div 
        className="absolute bottom-8 z-10 flex flex-col items-center opacity-60"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.6, y: [0, 10, 0] }}
        transition={{ delay: 2.5, duration: 2, repeat: Infinity }}
      >
        <span className="text-[8px] tracking-[0.3em] uppercase text-stone-300 mb-2 font-light">Ver Más</span>
        <div className="w-px h-6 bg-stone-400" />
      </motion.div>

    </section>
  );
}