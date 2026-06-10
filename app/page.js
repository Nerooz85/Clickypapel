"use client";
import { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

export default function ClickyPapelHome() {
  const [showIntro, setShowIntro] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  // Función mágica para encender la música y entrar al Home
  const handleOpenExperience = () => {
    setShowIntro(false);
    setIsPlaying(true);
    if (audioRef.current) {
      audioRef.current.play().catch(err => console.log("Audio play blocked:", err));
    }
  };

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const planes = [
    {
      name: "💍 Digital Esencial",
      priceBefore: "$1,599", // Precio Bluff (+400)
      price: "$1,199",       // Precio meta real
      desc: "El gancho perfecto. Una invitación impecable, automatizada y lista para compartir al instante.",
      features: [
        "URL personalizada (tugrandia.icu/novios)",
        "Cuenta regresiva animada",
        "Itinerario de Iglesia y Salón con GPS",
        "Imagen de Portada (Banner Principal)",
        "Galería de fotos (Máximo 3 recuerdos)",
        "RSVP estándar por formulario básico"
      ],
      popular: false,
      button: "Comenzar Esencial"
    },
    {
      name: "🌟 Gran Día Premium",
      priceBefore: "$1,999", // Precio Bluff (+700)
      price: "$1,599",       // Precio meta real
      desc: "El Rey de las Ventas. El control absoluto del evento y de tus invitados en tiempo real.",
      features: [
        "Todo lo incluido en el Plan Esencial",
        "Galería extendida (Hasta 6 fotografías)",
        "Mesa de Regalos activa (CLABE, Amazon, etc.)",
        "Música de fondo premium (5 temas a elegir)",
        "Filtro inteligente anti-colados",
        "Control de pases exactos por familia",
        "📊 Panel de confirmaciones en vivo en tu Dashboard"
      ],
      popular: true,
      button: "Elegir Premium"
    },
    {
      name: "👑 VIP Celestial Boutique",
      priceBefore: "$4,599", // Precio Bluff (+700)
      price: "$3,899",       // Precio meta real
      desc: "Experiencia de lujo sin preocupaciones. Nosotros nos encargamos de maquetar tu visión.",
      features: [
        "Todo lo incluido en el Plan Premium",
        "Asesoría 1 a 1 para recabado de información",
        "Maquetación y diseño boutique por nuestro equipo",
        "Galería extendida premium (6 a 12 fotografías)",
        "Música 100% personalizada (Tu canción especial)",
        "Secciones personalizadas a petición de los novios",
        "Soporte prioritario VIP para cambios de último minuto"
      ],
      popular: false,
      button: "Contratar Servicio VIP"
    }
  ];

  return (
    <div className="min-h-screen bg-[#faf9f6] font-sans text-stone-800 selection:bg-amber-100 overflow-x-hidden relative">
      
      {/* Elemento de Audio Nativo */}
      <audio ref={audioRef} src="/boda-music.mp3" loop />

      {/* Pantalla del sobre */}
      <AnimatePresence>
        {showIntro && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="fixed inset-0 z-50 bg-stone-900 flex flex-col items-center justify-center p-6 select-none"
          >
            {/* Imagen de fondo sutil para el sobre */}
            <div className="absolute inset-0 opacity-20 bg-cover bg-center mix-blend-overlay"
                 style={{ backgroundImage: `url('https://images.unsplash.com/photo-1607190074257-dd4b7af0309f')` }} />
            
            {/* El Sobre Físico Estilizado */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="relative max-w-sm w-full bg-[#fcfbfa] p-10 rounded-2xl shadow-2xl border border-stone-200/50 text-center space-y-8 flex flex-col items-center"
            >
              {/* Líneas finas estilo tarjetería clásica */}
              <div className="absolute inset-4 border border-stone-200/40 rounded-xl pointer-events-none" />
              
              <div className="space-y-2">
                <span className="font-serif text-amber-800 font-medium italic block text-base">Estás invitado a descubrir</span>
                <h2 className="font-serif text-3xl tracking-widest text-stone-900 font-light uppercase">ClickyPapel</h2>
              </div>

              {/* El Sello de Lacre de Cera (Botón Interactivo Animado) */}
              <motion.button
                onClick={handleOpenExperience}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative w-20 h-20 bg-amber-700 rounded-full flex items-center justify-center shadow-lg text-white font-serif text-2xl transition-colors hover:bg-amber-800 cursor-pointer group"
              >
                {/* Ondas expansivas del lacre */}
                <span className="absolute inset-0 rounded-full bg-amber-700/30 animate-ping group-hover:animate-none" />
                ✨
              </motion.button>

              <p className="text-stone-400 font-light text-xs tracking-wider uppercase">
                Haz click en el sello para abrir la experiencia
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* VECTORES DE FONDO ANIMADOS (LANDING PAGE) */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <motion.div 
          animate={{ scale: [1, 1.15, 1], x: [0, 30, 0], y: [0, -40, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-amber-100/40 rounded-full blur-3xl"
        />
        <motion.div 
          animate={{ scale: [1, 1.2, 1], x: [0, -20, 0], y: [0, 50, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute top-[40%] left-[-10%] w-[500px] h-[500px] bg-stone-200/50 rounded-full blur-3xl"
        />
        <svg className="absolute top-20 right-10 w-96 h-96 text-stone-200/60 stroke-current font-light" viewBox="0 0 100 100" fill="none">
          <motion.path initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 3, ease: "easeInOut" }} strokeWidth="0.2" d="M10,10 C40,40 20,70 90,90" />
        </svg>
      </div>

      {/* 1. NAVBAR ACTUALIZADO CON LOGIN */}
      <motion.nav 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 w-full bg-[#faf9f6]/80 backdrop-blur-md border-b border-stone-200/30 z-40 px-6 py-4"
      >
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link href="/" className="font-serif text-2xl tracking-wide text-stone-900 font-light">
            clicky<span className="font-normal text-amber-700">papel</span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-stone-600">
            <a href="#concept" className="hover:text-stone-900 transition-colors relative group">El Concepto<span className="absolute bottom-0 left-0 w-0 h-[1px] bg-amber-700 transition-all group-hover:w-full"/></a>
            <a href="#pricing" className="hover:text-stone-900 transition-colors relative group">Precios y Planes<span className="absolute bottom-0 left-0 w-0 h-[1px] bg-amber-700 transition-all group-hover:w-full"/></a>
          </div>
          
          {/* Botón de acceso exclusivo para clientes vinculados */}
          <Link href="/login" className="bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold px-5 py-2.5 rounded-full transition-all uppercase tracking-wider shadow-xs hover:scale-105 transform duration-200">
            Portal de Novios →
          </Link>
        </div>
      </motion.nav>

      {/* 2. HERO SECTION CINEMATOGRÁFICO */}
      <header className="relative h-screen w-full flex items-center justify-center text-center px-6 overflow-hidden z-10">
        <div className="absolute inset-0 z-0">
          <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1920')` }} />
          <div className="absolute inset-0 bg-gradient-to-b from-stone-950/50 via-stone-900/40 to-[#faf9f6]" />
        </div>

        {/* Botón Control de Música en el Home */}
        <motion.div className="absolute bottom-10 right-6 md:right-12 z-30 flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2.5 rounded-full shadow-lg">
          <div className="flex gap-[3px] items-end h-3 w-4">
            {[1, 2, 3, 4].map((bar) => (
              <motion.span
                key={bar}
                animate={isPlaying ? { height: ["20%", "100%", "20%"] } : { height: "30%" }}
                transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut", delay: bar * 0.15 }}
                className="w-[2px] bg-amber-400 block rounded-full"
              />
            ))}
          </div>
          <button onClick={togglePlay} className="text-white text-xs font-medium tracking-wider uppercase hover:text-amber-300 transition-colors cursor-pointer">
            {isPlaying ? "Pausar música" : "Activar música"}
          </button>
        </motion.div>

        <motion.div initial="hidden" animate={!showIntro ? "visible" : "hidden"} variants={containerVariants} className="max-w-4xl mx-auto space-y-6 relative z-20 text-white">
          <motion.span variants={itemVariants} className="text-xs uppercase tracking-widest text-amber-200 font-semibold bg-white/10 backdrop-blur-xs px-4 py-1.5 rounded-full border border-white/20 inline-block shadow-xs">
            Innovación y Tradición para tu Boda
          </motion.span>
          <motion.h1 variants={itemVariants} className="text-4xl md:text-7xl font-serif font-light leading-tight md:leading-none tracking-tight text-white">
            La antesala del día más <br className="hidden md:block"/>
            <span className="italic font-normal text-amber-200 block mt-2">importante de sus vidas.</span>
          </motion.h1>
          <motion.p variants={itemVariants} className="text-stone-200 font-light text-base md:text-xl max-w-xl mx-auto leading-relaxed opacity-90">
            Invitaciones digitales interactivas premium y papelería fina a juego. Automatiza tus confirmaciones sin perder la elegancia tradicional.
          </motion.p>
          <motion.div variants={itemVariants} className="pt-6 flex flex-col sm:flex-row justify-center items-center gap-4">
            <motion.a whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} href="#concept" className="w-full sm:w-auto bg-amber-600 hover:bg-amber-700 text-white font-medium text-sm px-8 py-3.5 rounded-xl transition-all shadow-md text-center">
              Descubrir el concepto
            </motion.a>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} className="w-full sm:w-auto">
              <Link href="/Abiel-y-Debanhi" target="_blank" className="block w-full bg-white/10 backdrop-blur-md hover:bg-white/20 text-white font-medium text-sm px-8 py-3.5 rounded-xl border border-white/30 transition-all text-center shadow-xs">
                ✨ Ver demo en vivo
              </Link>
            </motion.div>
          </motion.div>
        </motion.div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 animate-bounce">
          <span className="text-[10px] tracking-widest uppercase text-stone-300 font-light">Desliza para explorar</span>
        </div>
      </header>

      {/* 3. SECCIÓN EL CONCEPTO */}
      <section id="concept" className="py-24 px-6 bg-white border-t border-stone-100 relative z-10">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8 }} className="space-y-6">
            <span className="font-serif text-amber-700 font-medium italic block text-lg">¿Por qué ClickyPapel?</span>
            <h2 className="text-3xl md:text-4xl font-serif font-light text-stone-900 leading-snug">Uniendo la comodidad digital con el tacto del papel de lujo.</h2>
            <p className="text-stone-500 font-light text-sm md:text-base leading-relaxed">Sabemos que organizar una boda es estresante. Los invitados tradicionales prefieren un pase físico, mientras que tú necesitas controlar los pases de manera inteligente.</p>
            <div className="space-y-4 pt-2">
              {[
                { icon: "🖱️", title: "El Click (Digital Interactivo)", desc: "Tus invitados confirman por nombre en segundos desde su celular en tugrandia.icu. Con mapas en vivo y mesas de regalos." },
                { icon: "✉️", title: "El Papel (Tradición Premium)", desc: "Te enviamos tarjetas físicas de alta gama con un código QR integrado. Perfecto para tus tíos, abuelos o jefes de trabajo." }
              ].map((item, index) => (
                <motion.div key={index} whileHover={{ x: 5 }} className="flex gap-4 p-4 rounded-xl hover:bg-stone-50 transition-colors border border-transparent hover:border-stone-100">
                  <span className="flex-none w-10 h-10 bg-amber-50 text-amber-700 rounded-lg flex items-center justify-center font-medium shadow-xs">{item.icon}</span>
                  <div>
                    <h4 className="font-medium text-stone-800 text-sm md:text-base">{item.title}</h4>
                    <p className="text-stone-400 font-light text-xs md:text-sm mt-0.5">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.95, x: 40 }} whileInView={{ opacity: 1, scale: 1, x: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.8 }} className="relative h-[400px] md:h-[500px] bg-stone-100 rounded-3xl overflow-hidden shadow-xl group border border-stone-200/40">
            <Image src="https://images.unsplash.com/photo-1607190074257-dd4b7af0309f" alt="Papelería de boda fina" fill className="object-cover opacity-90 transition-transform duration-1000 ease-out group-hover:scale-105" sizes="(max-w-768px) 100vw, 50vw" />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-900/50 via-stone-900/10 to-transparent" />
            <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="absolute bottom-6 left-6 right-6 bg-white/90 backdrop-blur-md p-4 rounded-xl border border-white/20 shadow-lg">
              <p className="font-serif text-stone-800 italic text-sm md:text-base">"La fusión perfecta para novios exigentes es invitados tradicionales."</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 4. SECCIÓN DE PRECIOS CON DESCUENTO VISUAL (BLUFF DE VENTA) */}
      <section id="pricing" className="py-24 px-6 bg-stone-50 border-t border-stone-200/40 relative z-10">
        <div className="max-w-6xl mx-auto text-center">
          <span className="font-serif text-amber-700 font-medium italic block text-lg mb-2">Nuestros Planes</span>
          <h2 className="text-3xl md:text-4xl font-serif font-light text-stone-900 mb-4">Diseñado para cada estilo de boda</h2>
          <p className="text-stone-500 font-light text-sm md:text-base max-w-md mx-auto mb-16">Precios especiales por temporada. Contrata hoy y congela tu tarifa sin cargos ocultos.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {planes.map((plan, index) => (
              <motion.div 
                key={index} 
                initial={{ opacity: 0, y: 30 }} 
                whileInView={{ opacity: 1, y: 0 }} 
                viewport={{ once: true }} 
                transition={{ duration: 0.5, delay: index * 0.1 }} 
                whileHover={{ y: -8 }} 
                className={`relative bg-white rounded-3xl p-8 border flex flex-col justify-between shadow-xs transition-all ${plan.popular ? 'border-amber-500 ring-2 ring-amber-500/20' : 'border-stone-200/60'}`}
              >
                {plan.popular && <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-600 text-white text-[10px] uppercase font-semibold tracking-widest px-3 py-1 rounded-full shadow-xs">¡El Más Recomendado!</span>}
                <div className="space-y-4 text-left">
                  <h4 className="font-serif text-xl text-stone-900 font-light">{plan.name}</h4>
                  
                  {/* Bloque de Precios con Descuento Visual */}
                  <div className="space-y-0.5">
                    <p className="text-xs text-stone-400 line-through font-mono tracking-wide">{plan.priceBefore} MXN</p>
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl md:text-4xl font-serif font-medium text-stone-800">{plan.price}</span>
                      <span className="text-[10px] text-amber-700 font-mono font-bold uppercase tracking-wider bg-amber-50 px-1.5 py-0.5 rounded-md">¡Oferta Activa!</span>
                    </div>
                  </div>

                  <p className="text-stone-400 font-light text-xs leading-relaxed min-h-[36px]">{plan.desc}</p>
                  <hr className="border-stone-100 my-2" />
                  <ul className="space-y-3 pt-2">
                    {plan.features.map((feat, fIndex) => (
                      <li key={fIndex} className="flex items-start gap-2 text-xs md:text-sm text-stone-600 font-light">
                        <span className="text-amber-600 text-xs">✓</span> 
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="pt-8">
                  <Link href="/login" className={`block w-full text-center font-medium text-xs py-3 rounded-xl transition-all uppercase tracking-wider ${plan.popular ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-sm' : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border border-stone-200'}`}>
                    {plan.button}
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. FOOTER */}
      <footer className="bg-stone-900 py-12 text-center text-xs text-stone-500 font-light relative z-10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="font-serif text-lg text-white font-light tracking-wide">clicky<span className="text-amber-500">papel</span></p>
          <p>© 2026 clickypapel.com - Todos los derechos reservados.</p>
        </div>
      </footer>

    </div>
  );
}