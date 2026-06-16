"use client";
import { useState, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

export default function ClickyPapelHome() {
  const [showIntro, setShowIntro] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);

  // 🎨 Estados interactivos
  const [pestanaEsencia, setPestanaEsencia] = useState('mision');
  const [eventoSeleccionado, setEventoSeleccionado] = useState('bodas'); 

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
      priceBefore: "$1,599", 
      price: "$1,199",       
      desc: "El gancho perfecto. Una invitación impecable, automatizada y lista para compartir al instante.",
      features: [
        "URL personalizada (tugrandia.icu/tu-evento)",
        "Cuenta regresiva animada",
        "Itinerario del evento con mapas GPS",
        "Imagen de Portada / Temática elegida",
        "Galería de fotos (Máximo 3 recuerdos)",
        "RSVP estándar por buscador básico"
      ],
      popular: false,
      button: "Comenzar Esencial"
    },
    {
      name: "🌟 Gran Día Premium",
      priceBefore: "$1,999", 
      price: "$1,599",       
      desc: "El Rey de las Ventas. El control absoluto de tu evento e invitados en tiempo real.",
      features: [
        "Todo lo incluido en el Plan Esencial",
        "Galería extendida (Hasta 6 fotografías)",
        "Mesa de Regalos activa o Clabe Efectivo",
        "Música de fondo premium (Temas curados)",
        "Filtro inteligente anti-colados",
        "Control de pases exactos por familia",
        "📊 Panel de confirmaciones en vivo en tu Dashboard"
      ],
      popular: true,
      button: "Elegir Premium"
    },
    {
      name: "👑 VIP Celestial Boutique",
      priceBefore: "$4,599", 
      price: "$3,899",       
      desc: "Experiencia de lujo sin preocupaciones. Nosotros nos encargamos de maquetar tu visión.",
      features: [
        "Todo lo incluido en el Plan Premium",
        "Asesoría 1 a 1 para recabado de información",
        "Maquetación y diseño boutique por nuestro equipo",
        "Galería extendida premium (6 a 12 fotografías)",
        "Música 100% personalizada (Tu canción especial)",
        "Secciones personalizadas a petición del cliente",
        "Soporte prioritario VIP para cambios de último minuto"
      ],
      popular: false,
      button: "Contratar Servicio VIP"
    }
  ];

  const contenidoEsencia = {
    mision: {
      titulo: "Nuestra Misión",
      parrafo: "Diseñar invitaciones únicas y personalizadas para todo tipo de eventos sociales. Nos comprometemos a brindar a nuestros clientes una experiencia profesional creando diseños que reflejen la esencia de cada celebración."
    },
    vision: {
      titulo: "Nuestra Visión",
      parrafo: "Ser la empresa líder y reconocida en el mercado de las invitaciones digitales multi-evento. Buscamos convertirnos en la primera opción de nuestros clientes dando siempre un excelente servicio."
    },
    valores: {
      titulo: "Nuestros Valores",
      lista: [
        { t: "Creatividad", d: "Diseños de invitaciones originales que reflejen la personalidad y esencia de cada evento." },
        { t: "Compromiso", d: "Trabajamos con dedicación y responsabilidad para cumplir y superar las expectativas de nuestros clientes." },
        { t: "Pasión", d: "Amamos formar parte de cada momento especial y dejamos un toque de corazón en cada proyecto." }
      ]
    }
  };

  const nichosMercado = {
    bodas: {
      title: "💍 Bodas & Enlace Civil",
      desc: "La antesala de tu gran día. Diseños sofisticados, control de pases riguroso por familia, itinerarios de iglesia/salón y mesa de regalos integrada para iniciar su nueva vida.",
      img: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800"
    },
    xvaños: {
      title: "👑 XV Años Fest",
      desc: "Modernidad y estilo para tu fiesta. Formatos dinámicos con galerías de fotos de la quinceañera, sección para el libro de firmas digital, código de vestimenta y contador regresivo.",
      img: "https://images.unsplash.com/photo-1549417229-aa67d3263c09?q=80&w=800"
    },
    baby: {
      title: "🍼 Baby Shower & Revelación",
      desc: "¡La dulce espera! Colores pastel u orgánicos, dinámicas lúdicas informativas, mesa de regalos para los pañales o artículos de bebé y confirmación rápida de tus amigas por WhatsApp.",
      img: "https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=800"
    },
    showers: {
      title: "🎉 Despedidas & Bautizos",
      desc: "Para los momentos que unen a la familia y amigos. Simplifica la logística de pases y ubicaciones compartiendo un link elegante y divertido en tus grupos de mensajería.",
      img: "https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=800"
    }
  };

  return (
    <div className="min-h-screen bg-[#faf9f6] font-sans text-stone-800 selection:bg-amber-100 overflow-x-hidden relative">
      <audio ref={audioRef} src="/boda-music.mp3" loop />

      {/* PANTALLA SOBRE PRE-EXPERIENCIA */}
      <AnimatePresence>
        {showIntro && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="fixed inset-0 z-50 bg-stone-900 flex flex-col items-center justify-center p-6 select-none"
          >
            <div className="absolute inset-0 opacity-20 bg-cover bg-center mix-blend-overlay"
                 style={{ backgroundImage: `url('https://images.unsplash.com/photo-1607190074257-dd4b7af0309f')` }} />
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="relative max-w-sm w-full bg-[#fcfbfa] p-10 rounded-2xl shadow-2xl border border-stone-200/50 text-center space-y-8 flex flex-col items-center"
            >
              <div className="absolute inset-4 border border-stone-200/40 rounded-xl pointer-events-none" />
              <div className="space-y-2">
                <span className="font-serif text-amber-800 font-medium italic block text-base">Estás invitado a descubrir</span>
                <h2 className="font-serif text-3xl tracking-widest text-stone-900 font-light uppercase">ClickyPapel</h2>
              </div>

              <motion.button
                onClick={handleOpenExperience}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative w-20 h-20 bg-amber-700 rounded-full flex items-center justify-center shadow-lg text-white font-serif text-2xl transition-colors hover:bg-amber-800 cursor-pointer group"
              >
                <span className="absolute inset-0 rounded-full bg-amber-700/30 animate-ping group-hover:animate-none" />
                ✨
              </motion.button>
              <p className="text-stone-400 font-light text-xs tracking-wider uppercase">Haz click en el sello para abrir la experiencia</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* NAVBAR */}
      <motion.nav initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }} className="fixed top-0 w-full bg-[#faf9f6]/80 backdrop-blur-md border-b border-stone-200/30 z-40 px-6 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link href="/" className="font-serif text-2xl tracking-wide text-stone-900 font-light">
            clicky<span className="font-normal text-amber-700">papel</span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-stone-600">
            <a href="#concept" className="hover:text-stone-900 transition-colors">El Concepto</a>
            <a href="#mercado" className="hover:text-stone-900 transition-colors">Celebraciones</a>
            <a href="#esencia" className="hover:text-stone-900 transition-colors">Saber Más</a>
            <a href="#pricing" className="hover:text-stone-900 transition-colors">Precios</a>
          </div>
          <Link href="/login" className="bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold px-5 py-2.5 rounded-full transition-all uppercase tracking-wider shadow-xs hover:scale-105 transform duration-200">
            Portal de Novios →
          </Link>
        </div>
      </motion.nav>

      {/* HERO SECTION CINEMATOGRÁFICO MULTI-EVENTO */}
      <header className="relative h-screen w-full flex items-center justify-center text-center px-6 overflow-hidden z-10">
        <div className="absolute inset-0 z-0">
          <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?q=80&w=1920')` }} />
          <div className="absolute inset-0 bg-gradient-to-b from-stone-950/50 via-stone-900/40 to-[#faf9f6]" />
        </div>

        <motion.div className="absolute bottom-10 right-6 md:right-12 z-30 flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/20 px-4 py-2.5 rounded-full shadow-lg">
          <div className="flex gap-[3px] items-end h-3 w-4">
            {[1, 2, 3, 4].map((bar) => (
              <motion.span key={bar} animate={isPlaying ? { height: ["20%", "100%", "20%"] } : { height: "30%" }} transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut", delay: bar * 0.15 }} className="w-[2px] bg-amber-400 block rounded-full" />
            ))}
          </div>
          <button onClick={togglePlay} className="text-white text-xs font-medium tracking-wider uppercase hover:text-amber-300 transition-colors cursor-pointer">
            {isPlaying ? "Pausar música" : "Activar música"}
          </button>
        </motion.div>

        <motion.div initial="hidden" animate={!showIntro ? "visible" : "hidden"} variants={containerVariants} className="max-w-4xl mx-auto space-y-6 relative z-20 text-white">
          <motion.span variants={itemVariants} className="text-xs uppercase tracking-widest text-amber-200 font-semibold bg-white/10 backdrop-blur-xs px-4 py-1.5 rounded-full border border-white/20 inline-block shadow-xs">
            Invitaciones Inteligentes para tus Momentos Inolvidables
          </motion.span>
          <motion.h1 variants={itemVariants} className="text-4xl md:text-7xl font-serif font-light leading-tight md:leading-none tracking-tight text-white">
            Toda gran celebración <br className="hidden md:block"/>
            <span className="italic font-normal text-amber-200 block mt-2">comienza con un click.</span>
          </motion.h1>
          <motion.p variants={itemVariants} className="text-stone-200 font-light text-base md:text-xl max-w-xl mx-auto leading-relaxed opacity-90">
            Invitaciones digitales interactivas premium para Bodas, XV Años, Civiles, Baby Showers y aniversarios. Sencillo para tus invitados, perfecto para ti.
          </motion.p>
          <motion.div variants={itemVariants} className="pt-6 flex flex-col sm:flex-row justify-center items-center gap-4">
            <motion.a whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} href="#mercado" className="w-full sm:w-auto bg-amber-600 hover:bg-amber-700 text-white font-medium text-sm px-8 py-3.5 rounded-xl transition-all shadow-md text-center">Ver Tipos de Eventos</motion.a>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }} className="w-full sm:w-auto">
              <Link href="/bruno-y-brisa" target="_blank" className="block w-full bg-white/10 backdrop-blur-md hover:bg-white/20 text-white font-medium text-sm px-8 py-3.5 rounded-xl border border-white/30 transition-all text-center shadow-xs">✨ Probar Demo Interactiva</Link>
            </motion.div>
          </motion.div>
        </motion.div>
      </header>

      {/* SECCIÓN EL CONCEPTO */}
      <section id="concept" className="py-24 px-6 bg-white border-t border-stone-100 relative z-10">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="space-y-6">
            <span className="font-serif text-amber-700 font-medium italic block text-lg">Especialistas en Eventos Sociales</span>
            <h2 className="text-3xl md:text-4xl font-serif font-light text-stone-900 leading-snug">Invitaciones digitales que conectan emociones.</h2>
            <p className="text-stone-500 font-light text-sm md:text-base leading-relaxed">Nuestro objetivo es ayudarte a compartir momentos especiales de una manera única y moderna. Más que una lista de datos, creamos una experiencia digital interactiva que prepara a tus seres queridos para festejar contigo.</p>
            <div className="space-y-4 pt-2">
              {[
                { icon: "🖱️", title: "El Click Inteligente", desc: "Tus seres queridos buscan su nombre, conocen los pases asignados y confirman asistencia en tiempo real. Con mapas GPS directos y mesas virtuales." },
                { icon: "✉️", title: "La Esencia Fina", desc: "Estilos visuales cuidados con tipografía editorial y música esmerilada que se adaptan estéticamente a la atmósfera de tu celebración." }
              ].map((item, index) => (
                <div key={index} className="flex gap-4 p-4 rounded-xl hover:bg-stone-50 transition-colors border border-transparent">
                  <span className="flex-none w-10 h-10 bg-amber-50 text-amber-700 rounded-lg flex items-center justify-center font-medium shadow-xs">{item.icon}</span>
                  <div>
                    <h4 className="font-medium text-stone-800 text-sm md:text-base">{item.title}</h4>
                    <p className="text-stone-400 font-light text-xs md:text-sm mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
          <div className="relative h-[400px] md:h-[500px] bg-stone-100 rounded-3xl overflow-hidden shadow-xl border border-stone-200/40">
            <img src="https://images.unsplash.com/photo-1607190074257-dd4b7af0309f" alt="Papelería fina" className="w-full h-full object-cover opacity-90" />
          </div>
        </div>
      </section>

      {/* SECCIÓN DE EXPANSIÓN DE MERCADO: SELECTOR DE CELEBRACIONES */}
      <section id="mercado" className="py-24 px-6 bg-stone-50 border-t border-stone-200/30 relative z-10">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center space-y-2">
            <span className="font-serif text-amber-700 font-medium italic block text-lg">Un Click para cada Etapa</span>
            <h2 className="text-3xl font-serif font-light text-stone-900 tracking-tight">Cubrimos todas las celebraciones de tu vida</h2>
            <p className="text-stone-500 font-light text-xs md:text-sm max-w-sm mx-auto">Selecciona tu tipo de evento y descubre cómo ClickyPapel lo transforma por completo.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-3xl mx-auto">
            {Object.keys(nichosMercado).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setEventoSeleccionado(key)}
                className={`py-3.5 px-4 rounded-xl text-xs uppercase tracking-wider font-bold transition-all border cursor-pointer ${
                  eventoSeleccionado === key
                    ? 'bg-stone-900 text-white border-stone-900 shadow-md'
                    : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50'
                }`}
              >
                {key === 'bodas' ? '💍 Bodas / Civil' : key === 'xvaños' ? '👑 XV Años' : key === 'baby' ? '🍼 Baby Shower' : '🎉 Showers / Bautizos'}
              </button>
            ))}
          </div>

          <div className="bg-white rounded-3xl border border-stone-200/60 shadow-xl overflow-hidden min-h-[320px] flex flex-col md:flex-row items-stretch">
            <div className="p-8 md:p-12 flex-1 flex flex-col justify-center space-y-4 text-left">
              <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-3 py-1 rounded-full uppercase tracking-wider font-mono self-start">Plataforma Lista</span>
              <h3 className="font-serif text-2xl text-stone-950 font-medium">{nichosMercado[eventoSeleccionado].title}</h3>
              <p className="text-stone-500 font-light text-sm md:text-base leading-relaxed">{nichosMercado[eventoSeleccionado].desc}</p>
              <div className="pt-2">
                <a href="#pricing" className="text-xs text-amber-700 font-bold tracking-wider uppercase hover:text-amber-800 transition-colors">Ver paquetes disponibles ➔</a>
              </div>
            </div>
            <div className="w-full md:w-[380px] h-[240px] md:h-auto relative bg-stone-100 flex-none">
              <AnimatePresence mode="wait">
                <motion.img 
                  key={eventoSeleccionado}
                  initial={{ opacity: 0, scale: 1.02 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  src={nichosMercado[eventoSeleccionado].img} 
                  alt={nichosMercado[eventoSeleccionado].title}
                  className="w-full h-full object-cover"
                />
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN SOBRE NOSOTROS */}
      <section id="esencia" className="py-24 px-6 bg-white border-t border-stone-100/80 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          <div className="space-y-2">
            <span className="font-serif text-amber-700 font-medium italic block text-lg">Sobre Nosotros</span>
            <h2 className="text-3xl font-serif font-light text-stone-900 tracking-tight">Conoce el corazón detrás de ClickyPapel</h2>
          </div>

          <div className="flex justify-center border-b border-stone-200 max-w-sm mx-auto">
            {Object.keys(contenidoEsencia).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setPestanaEsencia(tab)}
                className={`flex-1 pb-3 text-xs uppercase tracking-wider font-bold transition-all cursor-pointer ${
                  pestanaEsencia === tab ? 'text-amber-700 border-b-2 border-amber-600 font-extrabold' : 'text-stone-400 hover:text-stone-600'
                }`}
              >
                {tab === 'mision' ? 'Misión' : tab === 'vision' ? 'Visión' : 'Valores'}
              </button>
            ))}
          </div>

          <div className="min-h-[160px] flex items-center justify-center px-4">
            <AnimatePresence mode="wait">
              <motion.div key={pestanaEsencia} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }} className="max-w-2xl mx-auto">
                {pestanaEsencia === 'valores' ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
                    {contenidoEsencia.valores.lista.map((v, i) => (
                      <div key={i} className="p-5 bg-stone-50 rounded-2xl border border-stone-200/40 space-y-1">
                        <h4 className="font-serif text-base font-medium text-amber-900">{v.t}</h4>
                        <p className="text-xs text-stone-500 font-light leading-relaxed">{v.d}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    <h3 className="font-serif text-xl font-light text-stone-900 italic">{contenidoEsencia[pestanaEsencia].titulo}</h3>
                    <p className="text-sm md:text-base text-stone-500 font-light leading-relaxed max-w-xl mx-auto">{contenidoEsencia[pestanaEsencia].parrafo}</p>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="pt-6 max-w-xl mx-auto">
            <p className="font-serif text-base md:text-lg text-stone-900 italic font-medium opacity-95 text-center leading-relaxed">
              “Click y Papel transformamos momentos especiales en recuerdos inolvidables comenzando con una invitación única”
            </p>
          </div>
        </div>
      </section>

      {/* SECCIÓN PLANES Y PRECIOS */}
      <section id="pricing" className="py-24 px-6 bg-stone-50 border-t border-stone-200/40 relative z-10">
        <div className="max-w-6xl mx-auto text-center">
          <span className="font-serif text-amber-700 font-medium italic block text-lg mb-2">Nuestros Planes</span>
          <h2 className="text-3xl md:text-4xl font-serif font-light text-stone-900 mb-4">Diseñado para cada estilo de celebración</h2>
          <p className="text-stone-500 font-light text-sm md:text-base max-w-md mx-auto mb-16">Precios especiales por temporada. Contrata hoy y congela tu tarifa sin cargos ocultos.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
            {planes.map((plan, index) => (
              <motion.div 
                key={index} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.1 }} whileHover={{ y: -8 }} 
                className={`relative bg-white rounded-3xl p-8 border flex flex-col justify-between shadow-xs transition-all ${plan.popular ? 'border-amber-500 ring-2 ring-amber-500/20' : 'border-stone-200/60'}`}
              >
                {plan.popular && <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-600 text-white text-[10px] uppercase font-semibold tracking-widest px-3 py-1 rounded-full shadow-xs">¡El Más Recomendado!</span>}
                <div className="space-y-4 text-left">
                  <h4 className="font-serif text-xl text-stone-900 font-light">{plan.name}</h4>
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
                  <Link href={`/registro?plan=${plan.name.includes('Premium') ? 'premium' : plan.name.includes('Esencial') ? 'basicos' : 'vip'}`} className={`block w-full text-center font-medium text-xs py-3 rounded-xl transition-all uppercase tracking-wider ${plan.popular ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-sm' : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border border-stone-200'}`}>
                    {plan.button}
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-stone-900 py-12 text-center text-xs text-stone-500 font-light relative z-10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="font-serif text-lg text-white font-light tracking-wide">clicky<span className="text-amber-500">papel</span></p>
          <p>© 2026 clickypapel.com - Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
}