"use client";
import { useParams, useSearchParams } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase'; 
import { motion, AnimatePresence } from 'framer-motion';

// 🧩 IMPORTACIÓN COMPONENTES V1 (Clásicos)
import InvitationHero from '@/components/InvitationHero';
import EventTimeline from '@/components/EventTimeline';

// 💎 IMPORTACIÓN COMPONENTES V2 (Editorial Tipo Invitio)
import InvitationHeroV2 from '@/components/InvitationHeroV2';
import EventTimelineV2 from '@/components/EventTimelineV2';

import PhotoGallery from '@/components/PhotoGallery';
import GiftRegistry from '@/components/GiftRegistry';
import QuoteBanner from '@/components/QuoteBanner'; 
import RsvpModule from '@/components/RsvpModule';

// ✨ COMPONENTE DE ANIMACIÓN PREMIUM (FADE-UP AL SCROLLEAR)
const ScrollReveal = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target); 
        }
      },
      { threshold: 0.15 } 
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`transition-all duration-[1200ms] ease-out transform ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'
      }`}
    >
      {children}
    </div>
  );
};

export default function WeddingInvitationPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  
  const esModoDemo = searchParams.get('demo') === 'true' || true; 
  const slug = params?.weddingSlug || params?.slug;

  const [weddingData, setWeddingData] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [categoriaAbierta, setCategoriaAbierta] = useState(null); 
  const [musicaSonando, setMusicaSonando] = useState(false);
  
  // ✉️ ESTADO DE LA ANIMACIÓN DE ENTRADA
  const [sobreAbierto, setSobreAbierto] = useState(false);

  // 🎨 ESTADOS DE DISEÑO INTERACTIVO
  const [plantillaActiva, setPlantillaActiva] = useState('v1'); 
  const [paletaActiva, setPaletaActiva] = useState('cashmere');       
  const [fuenteActiva, setFuenteActiva] = useState('clasica');     

  // 🛒 ESTADOS PARA EL MODAL DE CONTRATACIÓN
  const [modalContratarAbierto, setModalContratarAbierto] = useState(false);
  const [planSeleccionado, setPlanSeleccionado] = useState('premium'); 
  const [agregaMusicaExtra, setAgregaMusicaExtra] = useState(false);

  const audioRef = useRef(null);

  const catalogo25Demos = {
    'Bodas 💍': [
      { slug: 'demo-boda-tradicional', nombre: '✨ Gala Cashmere' },
      { slug: 'demo-boda-industrial', nombre: '🖤 Obsidian Dark' },
      { slug: 'demo-boda-boho', nombre: '🏺 Terracota Sunset' },
      { slug: 'demo-boda-playa', nombre: '☁️ Ethereal Celestial' },
      { slug: 'demo-boda-vintage', nombre: '🍵 Matcha Orgánico' }
    ],
    'XV Años 👑': [
      { slug: 'demo-xv-glitter', nombre: '✨ Gala Cashmere' },
      { slug: 'demo-xv-glam', nombre: '🖤 Obsidian Minimal' },
      { slug: 'demo-xv-boho', nombre: '🍵 Matcha Silvestre' },
      { slug: 'demo-xv-romantica', nombre: '☁️ Celestial Perla' },
      { slug: 'demo-xv-neon', nombre: '🖤 Obsidian Night' }
    ],
    'Boda Civil 🥂': [
      { slug: 'demo-civil-brunch', nombre: '✨ Gala Cashmere' },
      { slug: 'demo-civil-minimal', nombre: '🖤 Obsidian Minimal' },
      { slug: 'demo-civil-garden', nombre: '🍵 Matcha Silvestre' },
      { slug: 'demo-civil-sunset', nombre: '🏺 Terracota Sunset' },
      { slug: 'demo-civil-urban', nombre: '🖤 Obsidian Night' }
    ],
    'Baby Shower 🍼': [
      { slug: 'demo-baby-neutral', nombre: '✨ Cashmere Lino' },
      { slug: 'demo-baby-boy', nombre: '☁️ Celestial Baby' },
      { slug: 'demo-baby-girl', nombre: '🏺 Terracota Soft' },
      { slug: 'demo-baby-safari', nombre: '🍵 Matcha Orgánico' },
      { slug: 'demo-baby-reveal', nombre: '🖤 Obsidian Night' }
    ],
    'Bautizos 🕊️': [
      { slug: 'demo-bautizo-clean', nombre: '✨ Gala Cashmere' },
      { slug: 'demo-bautizo-moderno', nombre: '🖤 Obsidian Minimal' },
      { slug: 'demo-bautizo-botanico', nombre: '🍵 Matcha Silvestre' },
      { slug: 'demo-bautizo-vintage', nombre: '🏺 Terracota Sunset' },
      { slug: 'demo-bautizo-sky', nombre: '☁️ Ethereal Celestial' }
    ]
  };

  useEffect(() => {
    async function jalarDatosBoda() {
      if (!slug) {
        setCargando(false);
        return;
      }

      setCargando(true);
      const slugLimpio = slug.toLowerCase().trim();

      const { data, error } = await supabase
        .from('bodas')
        .select('*')
        .eq('slug', slugLimpio)
        .maybeSingle();

      if (error) {
        console.error("Error de Supabase:", error.message);
        setWeddingData(null);
      } else if (!data) {
        setWeddingData(null);
      } else {
        setWeddingData({
          id: data.id,
          slug: data.slug,
          groomName: data.groom_name,
          brideName: data.bride_name,
          eventDate: data.event_date || "2026-12-19T18:00:00", 
          coverImage: data.cover_image || "https://images.unsplash.com/photo-1519741497674-611481863552", 
          galleryImages: data.gallery_images || [],
          welcomePhrase: data.welcome_phrase,
          ceremoniaHora: data.ceremonia_hora,
          ceremoniaLugar: data.ceremonia_lugar,
          ceremoniaMapsUrl: data.ceremonia_maps_url,
          recepcionHora: data.recepcion_hora,
          recepcionLugar: data.recepcion_lugar,
          recepcionMapsUrl: data.recepcion_maps_url,
          musicType: data.music_type || 'default',
          musicUrl: data.music_url || '/music/1. Clásico Romántico.mp3',
          albumCompartidoActivo: data.album_compartido_activo || false,
          codigoVestimenta: data.codigo_vestimenta,
          paletaColores: data.paleta_colores,
        });

        if (data.template_id === 'v2') setPlantillaActiva('v2');
        else setPlantillaActiva('v1');

        if (data.template_id === 'minimal-dark') setPaletaActiva('obsidian');
        else if (data.template_id === 'boho-rancho') setPaletaActiva('terracota');
        else setPaletaActiva('cashmere');
      }
      setCargando(false);
    }

    jalarDatosBoda();
  }, [slug, params]);

  // ✉️ LÓGICA PARA ABRIR SOBRE Y REPRODUCIR AUDIO
  const abrirSobre = () => {
    setSobreAbierto(true);
    if (audioRef.current) {
      audioRef.current.play().catch(e => console.log("Audio bloqueado:", e));
      setMusicaSonando(true);
    }
  };

  const toggleMusicaFlotante = () => {
    if (audioRef.current) {
      if (musicaSonando) audioRef.current.pause();
      else audioRef.current.play().catch(e => console.log(e));
      setMusicaSonando(!musicaSonando);
    }
  };

  // 🎨 MATRIZ DE COLORES
  const listadoPaletas = {
    cashmere: { 
      bgGlobal: 'bg-[#f5f0ea] text-[#4a3f35] selection:bg-[#e3d5c8]', 
      colorCard: 'bg-white/90 border-[#e3d5c8] shadow-md', 
      textAcento: 'text-[#9a7b5c] font-bold tracking-wide', 
      btn: 'bg-[#9a7b5c] hover:bg-[#7a5c43] text-white shadow-md transition-all' 
    },
    matcha: { 
      bgGlobal: 'bg-[#eef2eb] text-[#1f3022] selection:bg-[#c9d6c3]', 
      colorCard: 'bg-white/90 border-[#c9d6c3] shadow-md', 
      textAcento: 'text-[#3f6345] font-bold tracking-wide', 
      btn: 'bg-[#3f6345] hover:bg-[#2c4731] text-white shadow-md transition-all' 
    },
    terracota: { 
      bgGlobal: 'bg-[#fbf1ea] text-[#5c2a1a] selection:bg-[#f0d4c3]', 
      colorCard: 'bg-white/90 border-[#f0d4c3] shadow-md', 
      textAcento: 'text-[#c85a3a] font-bold tracking-wide', 
      btn: 'bg-[#c85a3a] hover:bg-[#a14328] text-white shadow-md transition-all' 
    },
    celestial: { 
      bgGlobal: 'bg-[#eef2f6] text-[#1e3246] selection:bg-[#c6d4e1]', 
      colorCard: 'bg-white/90 border-[#c6d4e1] shadow-md', 
      textAcento: 'text-[#466a8e] font-bold tracking-wide', 
      btn: 'bg-[#466a8e] hover:bg-[#324f6e] text-white shadow-md transition-all' 
    },
    obsidian: { 
      bgGlobal: 'bg-[#121214] text-[#f4f4f5] selection:bg-[#3f3f46]', 
      colorCard: 'bg-[#1e1e20] border-[#3f3f46] shadow-md', 
      textAcento: 'text-[#d4d4d8] font-bold tracking-wider', 
      btn: 'bg-[#f4f4f5] hover:bg-[#a1a1aa] text-[#121214] shadow-md transition-all' 
    }
  };

  const listadoFuentes = {
    clasica: 'font-clasica leading-relaxed antialiased',               
    cursiva: 'font-cursiva leading-loose text-[1.25em] antialiased tracking-wide',         
    editorial: 'font-editorial leading-loose antialiased',              
    minimalista: 'font-minimalista leading-relaxed antialiased',             
    boho: 'font-boho leading-loose text-[1.1em] antialiased'  
  };

  const diseño = listadoPaletas[paletaActiva] || listadoPaletas.cashmere;
  const claseFuente = listadoFuentes[fuenteActiva] || listadoFuentes.clasica;

  const preciosPlanes = { basicos: 890, premium: 1490, vip: 2490 };
  const precioTotal = preciosPlanes[planSeleccionado] + (planSeleccionado !== 'basicos' && agregaMusicaExtra ? 350 : 0);

  const handleProcederAlPago = () => {
    window.location.href = `https://clickypapel.com/registro?plan=${planSeleccionado}&paleta=${paletaActiva}&fuente=${fuenteActiva}&musica=${agregaMusicaExtra ? 'custom' : 'default'}`;
  };

  if (cargando) {
    return <div className="min-h-screen bg-[#faf9f6] flex items-center justify-center font-serif text-stone-500 animate-pulse text-xs tracking-widest uppercase">Abriendo catálogo interactivo... ✨</div>;
  }

  if (!weddingData) {
    return (
      <div className="min-h-screen bg-[#faf9f6] flex flex-col items-center justify-center font-sans text-center p-6 space-y-4">
        <h1 className="font-serif text-2xl text-stone-800 font-light">Invitación No Encontrada</h1>
        <a href="https://clickypapel.com" className="text-xs bg-stone-900 text-white px-5 py-2.5 rounded-full uppercase tracking-wider">Ir a Inicio</a>
      </div>
    );
  }

  return (
    <main className={`min-h-screen overflow-x-hidden relative ${diseño.bgGlobal} ${claseFuente}`}>
      
      {/* 🚀 MOTOR DE FUENTES PREMIUM GOOGLE FONTS INYECTADO */}
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,400&family=Great+Vibes&family=Jost:wght@300;400;500&family=Lora:ital,wght@0,400;1,400&display=swap');
        
        .font-clasica { font-family: 'Cormorant Garamond', serif; }
        .font-cursiva { font-family: 'Great Vibes', cursive; }
        .font-editorial { font-family: 'Cinzel', serif; letter-spacing: 0.15em; text-transform: uppercase; }
        .font-minimalista { font-family: 'Jost', sans-serif; font-weight: 300; letter-spacing: 0.05em; }
        .font-boho { font-family: 'Lora', serif; font-style: italic; }
      `}} />

      {weddingData?.musicUrl && <audio ref={audioRef} src={weddingData.musicUrl} loop />}

      {/* ✉️ ANIMACIÓN DEL SOBRE (Cubre toda la pantalla) */}
      <AnimatePresence>
        {!sobreAbierto && (
          <motion.div 
            key="sobre"
            className="fixed inset-0 z-[999] flex flex-col items-center justify-center overflow-hidden bg-transparent"
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: "easeInOut", delay: 0.3 }}
          >
            {/* Panel Superior del Sobre */}
            <motion.div 
              className="absolute top-0 left-0 right-0 h-1/2 bg-[#e8e4de] border-b border-[#d8caba] shadow-md origin-top"
              exit={{ y: '-100%' }}
              transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
            />

            {/* Panel Inferior del Sobre */}
            <motion.div 
              className="absolute bottom-0 left-0 right-0 h-1/2 bg-[#e8e4de] border-t border-white/50 origin-bottom"
              exit={{ y: '100%' }}
              transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }}
            />

            {/* Sello / Botón Central */}
            <motion.button
              onClick={abrirSobre}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="relative z-10 flex flex-col items-center gap-4 cursor-pointer group"
            >
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#ba9f83] to-[#8a6b4c] shadow-2xl border-4 border-[#e8e4de] flex items-center justify-center relative overflow-hidden group-hover:scale-105 transition-transform duration-500">
                <div className="absolute inset-0 bg-white/20 rounded-full animate-ping opacity-75"></div>
                <span className="text-white font-serif text-3xl font-light relative z-10">
                  {weddingData.brideName?.charAt(0)}&{weddingData.groomName?.charAt(0)}
                </span>
              </div>
              <span className="text-[#8a6b4c] text-[10px] uppercase tracking-[0.3em] font-bold">
                Toca para abrir
              </span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ✨ CONTENIDO DE LA INVITACIÓN 
        Todo tu código original está aquí adentro.
        Si el sobre no está abierto, escondemos la barra de scroll y hacemos que sea invisible.
      */}
      <div className={`transition-opacity duration-1000 delay-300 w-full pt-32 md:pt-20 ${sobreAbierto ? 'opacity-100' : 'opacity-0 h-screen overflow-hidden pointer-events-none'}`}>
        
        {/* HEADER PREMIUM COMERCIAL */}
        {esModoDemo && (
          <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md border-b border-stone-200/80 px-4 md:px-8 py-3 flex flex-col lg:flex-row items-center justify-between gap-4 z-[200] shadow-xs font-sans">
            <a href="https://clickypapel.com" className="flex items-center gap-1 group select-none shrink-0">
              <span className="font-serif text-base tracking-wider font-light text-stone-900 group-hover:text-[#9a7b5c] transition-colors">
                clicky<span className="font-normal text-[#9a7b5c]">papel</span>.com
              </span>
            </a>
            <nav className="flex items-center gap-1 overflow-x-auto max-w-full no-scrollbar py-1 shrink-0 px-2">
              {Object.keys(catalogo25Demos).map((categoria) => {
                const estaAbierto = categoriaAbierta === categoria;
                return (
                  <div key={categoria} className="relative shrink-0">
                    <button
                      type="button"
                      onClick={() => setCategoriaAbierta(estaAbierto ? null : categoria)}
                      className={`text-[11px] font-black tracking-wider uppercase px-3 py-2 rounded-xl transition-all cursor-pointer flex items-center gap-1 select-none ${estaAbierto ? 'bg-stone-950 text-white shadow-xs' : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'}`}
                    >
                      {categoria} <span className="text-[9px] opacity-40">{estaAbierto ? '▲' : '▼'}</span>
                    </button>
                    {estaAbierto && (
                      <div className="absolute top-11 left-1/2 -translate-x-1/2 w-48 bg-white border border-stone-200/90 rounded-2xl shadow-xl p-1.5 space-y-0.5 z-[210] animate-fadeIn">
                        {catalogo25Demos[categoria].map((demo) => (
                          <a 
                            key={demo.slug}
                            href={`/${demo.slug}?demo=true`} 
                            className={`block text-left text-[11px] px-3 py-2 rounded-xl font-semibold transition-all ${slug === demo.slug ? 'bg-stone-50 text-[#9a7b5c] font-bold border-l-2 border-[#9a7b5c]' : 'text-stone-600 hover:bg-stone-50 hover:text-stone-950'}`}
                            onClick={() => setCategoriaAbierta(null)}
                          >
                            {demo.nombre}
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>
            <button type="button" onClick={() => setModalContratarAbierto(true)} className="bg-stone-950 hover:bg-[#9a7b5c] text-white text-[11px] uppercase tracking-widest font-bold px-5 py-2.5 rounded-xl transition-all shadow-md shrink-0 cursor-pointer">
              ✨ Quiero esta invitación ➔
            </button>
          </header>
        )}

        {/* 🔮 BARRA FLOTANTE INTERACTIVA DE TEMA Y TIPOGRAFÍA */}
        <div className="fixed bottom-6 right-6 z-[100] bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-2xl border border-stone-200/80 max-w-xs w-64 space-y-3.5 text-left text-stone-800 font-sans">
          <div>
            <span className="text-[9px] bg-[#e3d5c8] text-[#4a3f35] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider font-mono">Diseño de la App</span>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wide block">1. Estructura Visual:</label>
            <select
              value={plantillaActiva}
              onChange={(e) => setPlantillaActiva(e.target.value)}
              className="w-full text-xs p-2 rounded-xl border bg-stone-50 text-stone-700 font-bold focus:outline-none cursor-pointer"
            >
              <option value="v1">V1: Clásica Minimalista</option>
              <option value="v2">V2: Editorial Alta Costura</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wide block">2. Paleta UI:</label>
            <div className="grid grid-cols-5 gap-1.5">
              {Object.keys(listadoPaletas).map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setPaletaActiva(key)}
                  className={`h-7 rounded-lg border text-[10px] uppercase font-bold transition-all cursor-pointer flex items-center justify-center ${paletaActiva === key ? 'border-stone-950 ring-2 ring-stone-950/20 scale-105 bg-stone-100' : 'border-stone-200 bg-stone-50 text-stone-500'}`}
                  title={`Cambiar a Tema ${key}`}
                >
                  {key === 'cashmere' ? '🕊️' : key === 'matcha' ? '🍵' : key === 'terracota' ? '🏺' : key === 'celestial' ? '☁️' : '🖤'}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wide block">3. Estilo de Textos:</label>
            <select
              value={fuenteActiva}
              onChange={(e) => setFuenteActiva(e.target.value)}
              className="w-full text-xs p-2 rounded-xl border bg-white text-stone-700 font-medium focus:outline-none cursor-pointer"
            >
              <option value="clasica">Clásica Atemporal (Serif)</option>
              <option value="cursiva">Cursiva Elegante (Script)</option>
              <option value="editorial">Alta Costura (Editorial)</option>
              <option value="minimalista">Minimalista Moderna (Sans)</option>
              <option value="boho">Boho Chic Orgánica (Italic)</option>
            </select>
          </div>
        </div>

        <button type="button" onClick={toggleMusicaFlotante} className="fixed bottom-6 left-6 z-[150] bg-white/90 backdrop-blur-md border border-stone-200/80 p-3 rounded-full shadow-xl text-xs cursor-pointer">
          {musicaSonando ? '🎵 ⏸️' : '🔇 ▶️'}
        </button>

        {/* 🛍️ MODAL ASISTENTE DE CONTRATACIÓN */}
        {modalContratarAbierto && (
          <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center z-[300] p-4 pointer-events-auto">
            <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full border border-stone-200 shadow-2xl space-y-6 relative text-stone-800 text-left font-sans">
              <button type="button" onClick={() => setModalContratarAbierto(false)} className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 font-bold text-xs bg-stone-100 w-8 h-8 rounded-full flex items-center justify-center cursor-pointer">✕</button>
              <div className="space-y-1">
                <span className="text-[10px] bg-[#e3d5c8] text-[#4a3f35] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider font-mono">Alta Segura</span>
                <h3 className="font-serif text-xl text-stone-950 font-medium">Configura tu Entorno</h3>
                <p className="text-stone-400 text-xs font-light">Se exportará la paleta <strong className="text-stone-700 capitalize">{paletaActiva}</strong> y tipografía <strong className="text-stone-700 capitalize">{fuenteActiva}</strong>.</p>
              </div>
              <div className="space-y-2">
                <div className="flex flex-col gap-2">
                  {['basicos', 'premium', 'vip'].map((p) => (
                    <label key={p} className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${planSeleccionado === p ? 'border-[#9a7b5c] bg-[#f5f0ea]' : 'border-stone-100 bg-stone-50/50'}`}>
                      <div className="flex items-center gap-3">
                        <input type="radio" name="modal_plan" checked={planSeleccionado === p} onChange={() => setPlanSeleccionado(p)} className="accent-[#9a7b5c]" />
                        <span className="text-xs font-semibold capitalize">{p === 'basicos' ? '💍 Plan Esencial' : p === 'vip' ? '👑 VIP Celestial' : '🌟 Gran Día Premium'}</span>
                      </div>
                      <span className="text-xs font-mono font-bold">${preciosPlanes[p]} MXN</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                <div>
                  <span className="text-[9px] uppercase tracking-wider text-stone-400 block font-semibold">Total:</span>
                  <span className="text-xl font-mono font-black text-stone-900">${precioTotal.toLocaleString('es-MX')} MXN</span>
                </div>
                <button type="button" onClick={handleProcederAlPago} className="bg-stone-950 hover:bg-[#9a7b5c] text-white text-xs uppercase font-bold tracking-wider px-6 py-3.5 rounded-xl shadow-md cursor-pointer">Proceder ➔</button>
              </div>
            </div>
          </div>
        )}

        {/* 🚀 EL ENRUTADOR DINÁMICO */}
        <div className="space-y-12 pb-16">
          <ScrollReveal>
            {plantillaActiva === 'v2' ? (
              <InvitationHeroV2 weddingData={weddingData} diseño={diseño} />
            ) : (
              <InvitationHero weddingData={weddingData} diseño={diseño} />
            )}
          </ScrollReveal>

          <ScrollReveal>
            {plantillaActiva === 'v2' ? (
              <EventTimelineV2 weddingData={weddingData} diseño={diseño} />
            ) : (
              <EventTimeline weddingData={weddingData} diseño={diseño} />
            )}
          </ScrollReveal>

          <ScrollReveal>
            <PhotoGallery weddingData={weddingData} images={weddingData?.galleryImages || []} diseño={diseño} />
          </ScrollReveal>
          
          {weddingData.albumCompartidoActivo && (
            <ScrollReveal>
              <section className="max-w-md mx-auto px-6 py-6 text-center font-sans">
                <div className="bg-gradient-to-br from-[#9a7b5c] to-[#7a5c43] text-white p-6 rounded-3xl shadow-xl space-y-4 text-left border border-white/10">
                  <div className="space-y-1">
                    <span className="text-[10px] bg-white/20 text-white font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider font-mono inline-block">Función Premium</span>
                    <h4 className="font-serif text-lg font-light">Álbum Colectivo en Vivo 📸</h4>
                    <p className="text-xs text-white/80 font-light leading-relaxed">Sube tus fotos directamente para el recuerdo de los novios.</p>
                  </div>
                  <a href={`https://tugrandia.icu/${weddingData.slug}/compartir`} className="w-full bg-white text-[#4a3f35] font-bold text-center py-3 rounded-xl block text-xs uppercase tracking-wider shadow-md hover:bg-stone-50 transition-colors">📤 Subir Fotos</a>
                </div>
              </section>
            </ScrollReveal>
          )}

          <ScrollReveal>
            <GiftRegistry weddingData={weddingData} diseño={diseño} />
          </ScrollReveal>

          <ScrollReveal>
            <QuoteBanner weddingData={weddingData} diseño={diseño} />
          </ScrollReveal>

          <ScrollReveal>
            <RsvpModule weddingId={weddingData.id} weddingSlug={weddingData.slug} diseño={diseño} />
          </ScrollReveal>
        </div>

        <footer className="text-center py-12 bg-[#121214] text-zinc-500 text-xs select-none font-sans">
          Invitación digital premium creada en <span className="text-zinc-300">clickypapel.com</span>
        </footer>
      </div>
    </main>
  );
}