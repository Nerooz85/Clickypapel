"use client";
import { useParams } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase'; 
import { motion, AnimatePresence } from 'framer-motion';

import InvitationHero from '@/components/InvitationHero';
import EventTimeline from '@/components/EventTimeline';
import InvitationHeroV2 from '@/components/InvitationHeroV2';
import InvitationHeroV3 from '@/components/InvitationHeroV3'; 
import InvitationHeroXV from '@/components/InvitationHeroXV'; // 👇 LA NUEVA PLANTILLA XV
import EventTimelineV2 from '@/components/EventTimelineV2';
import PhotoGallery from '@/components/PhotoGallery';
import GiftRegistry from '@/components/GiftRegistry';
import QuoteBanner from '@/components/QuoteBanner'; 
import RsvpModule from '@/components/RsvpModule';

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

export default function PaginaMaestraInvitacion() {
  const params = useParams();
  const slug = params?.weddingSlug || params?.slug || '';

  const [weddingData, setWeddingData] = useState(null);
  const [cargando, setCargando] = useState(true);
  
  // 🕵️ DETECTOR DE DOMINIO
  const [esModoVentas, setEsModoVentas] = useState(false);

  // ✉️ ESTADOS DE INTERACCIÓN
  const [sobreAbierto, setSobreAbierto] = useState(false);
  const [musicaSonando, setMusicaSonando] = useState(false);
  const audioRef = useRef(null);

  // 🎨 ESTADOS DE DISEÑO INTERACTIVO
  const [plantillaActiva, setPlantillaActiva] = useState('v1'); 
  const [paletaActiva, setPaletaActiva] = useState('cashmere');       
  const [fuenteActiva, setFuenteActiva] = useState('clasica');     
  const [tipoEventoGlobal, setTipoEventoGlobal] = useState('boda'); // 👈 NUEVO: Detecta Boda o XV

  // 🛒 ESTADOS COMERCIALES
  const [categoriaAbierta, setCategoriaAbierta] = useState(null); 
  const [modalContratarAbierto, setModalContratarAbierto] = useState(false);
  const [planSeleccionado, setPlanSeleccionado] = useState('premium'); 
  const [agregaMusicaExtra, setAgregaMusicaExtra] = useState(false);

  // 👇 CATÁLOGO ACTUALIZADO
  const catalogo25Demos = {
    'Bodas 💍': [
      { slug: 'demo-boda-v1', nombre: '✨ V1: Minimalista Clásica' },
      { slug: 'demo-boda-v2', nombre: '💎 V2: Editorial Alta Costura' },
      { slug: 'demo-boda-v3', nombre: '🌲 V3: Bosque Místico' }
    ],
    'XV Años 👑': [
      { slug: 'demo-xv-v1', nombre: '🌸 V1: Jardín Encantado' },
      { slug: 'demo-xv-v2', nombre: '🌃 V2: Noche Neón (Próximamente)' }
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
    ],
    'Despedida 🥂': [
      { slug: 'demo-despedida-chic', nombre: '✨ Glamour Night' },
      { slug: 'demo-despedida-boho', nombre: '🏺 Boho Bride' },
      { slug: 'demo-despedida-pool', nombre: '☁️ Pool Party' }
    ]
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      if (hostname.includes('clickypapel') || hostname.includes('localhost')) {
        setEsModoVentas(true);
      }
    }

    async function jalarDatosBoda() {
      if (!slug) { setCargando(false); return; }
      setCargando(true);
      const slugLimpio = slug.toLowerCase().trim();
      
      // Magia: Detectamos si en la URL dice "xv" para cambiar la estructura automáticamente
      const esXV = slugLimpio.includes('xv');
      setTipoEventoGlobal(esXV ? 'xvanos' : 'boda');

      const { data, error } = await supabase.from('bodas').select('*').eq('slug', slugLimpio).maybeSingle();

      if (error || !data) {
        // LÓGICA INTELIGENTE DE DEMOSTRACIÓN (Fallback)
        let templateFallback = esXV ? 'xv-v1' : 'v1';
        if (slugLimpio.includes('boda-v2')) templateFallback = 'v2';
        if (slugLimpio.includes('boda-v3')) templateFallback = 'v3';

        setWeddingData({
          id: 'demo-id', slug: slugLimpio, 
          groomName: esXV ? '' : 'Bruno', // En XV no hay novio
          brideName: esXV ? 'Sofía' : 'Brisa', // Nombre de la quinceañera
          eventDate: "2026-12-19T18:00:00", 
          coverImage: esXV ? "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7" : "https://images.unsplash.com/photo-1519741497674-611481863552", 
          galleryImages: [], musicUrl: '/music/1. Clásico Romántico.mp3', albumCompartidoActivo: true,
          ceremoniaLugar: 'Parroquia de Nuestra Señora', recepcionLugar: 'Quinta Gran Jardín',
          ceremoniaMapsUrl: '#', recepcionMapsUrl: '#',
          banco: 'BBVA', titular: esXV ? 'Familia de Sofía' : 'Bruno y Brisa', clabe: '012345678901234567',
          amazonUrl: '#', liverpoolUrl: '#'
        });
        setPlantillaActiva(templateFallback);
      } else {
        setWeddingData({
          id: data.id, slug: data.slug, groomName: data.groom_name, brideName: data.bride_name,
          eventDate: data.event_date || "2026-12-19T18:00:00", coverImage: data.cover_image, 
          galleryImages: data.gallery_images || [], 
          welcomePhrase: data.welcome_phrase, 
          ceremoniaLugar: data.ceremonia_lugar,
          ceremoniaMapsUrl: data.ceremonia_maps_url, 
          recepcionLugar: data.recepcion_lugar, 
          recepcionMapsUrl: data.recepcion_maps_url, 
          musicUrl: data.music_url || '/music/1. Clásico Romántico.mp3',
          albumCompartidoActivo: data.album_compartido_activo || false,
          banco: data.banco, titular: data.titular, clabe: data.clabe, amazonUrl: data.amazon_url, liverpoolUrl: data.liverpool_url 
        });
        
        setPlantillaActiva(data.template_id || (esXV ? 'xv-v1' : 'v1'));
        setPaletaActiva(data.paleta_colores || 'cashmere');
        setFuenteActiva(data.estilo_texto || 'clasica');
        setTipoEventoGlobal(data.tipo_evento || (esXV ? 'xvanos' : 'boda'));
      }
      setCargando(false);
    }
    jalarDatosBoda();
  }, [slug, params]);

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

  const listadoPaletas = {
    cashmere: { bgGlobal: 'bg-[#f5f0ea] text-[#4a3f35]', textAcento: 'text-[#9a7b5c]', btn: 'bg-[#9a7b5c] text-white' },
    matcha: { bgGlobal: 'bg-[#eef2eb] text-[#1f3022]', textAcento: 'text-[#3f6345]', btn: 'bg-[#3f6345] text-white' },
    terracota: { bgGlobal: 'bg-[#fbf1ea] text-[#5c2a1a]', textAcento: 'text-[#c85a3a]', btn: 'bg-[#c85a3a] text-white' },
    celestial: { bgGlobal: 'bg-[#eef2f6] text-[#1e3246]', textAcento: 'text-[#466a8e]', btn: 'bg-[#466a8e] text-white' },
    obsidian: { bgGlobal: 'bg-[#121214] text-[#f4f4f5]', textAcento: 'text-[#d4d4d8]', btn: 'bg-[#f4f4f5] text-[#121214]' },
    rosegold: { bgGlobal: 'bg-rose-50 text-stone-800', textAcento: 'text-rose-400', btn: 'bg-rose-400 text-white' } // 🌸 Paleta extra para XV
  };

  const listadoFuentes = {
    clasica: 'font-clasica leading-relaxed', cursiva: 'font-cursiva leading-loose text-[1.25em]', 
    editorial: 'font-editorial leading-loose', minimalista: 'font-minimalista leading-relaxed', boho: 'font-boho leading-loose text-[1.1em]'  
  };

  const diseño = listadoPaletas[paletaActiva] || listadoPaletas.cashmere;
  const claseFuente = listadoFuentes[fuenteActiva] || listadoFuentes.clasica;

  if (cargando) return <div className="min-h-screen bg-[#faf9f6] flex items-center justify-center"><div className="w-10 h-10 border-2 border-[#9a7b5c] border-t-transparent rounded-full animate-spin" /></div>;
  if (!weddingData) return <div className="min-h-screen flex items-center justify-center text-stone-400 font-sans">Invitación no encontrada</div>;

  return (
    <main className={`min-h-screen overflow-x-hidden relative ${diseño.bgGlobal} ${claseFuente} ${esModoVentas ? 'pt-32 md:pt-20' : ''}`}>
      <style dangerouslySetInnerHTML={{__html: `@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,400&family=Great+Vibes&family=Jost:wght@300;400;500&family=Lora:ital,wght@0,400;1,400&display=swap'); .font-clasica { font-family: 'Cormorant Garamond', serif; } .font-cursiva { font-family: 'Great Vibes', cursive; } .font-editorial { font-family: 'Cinzel', serif; letter-spacing: 0.15em; text-transform: uppercase; } .font-minimalista { font-family: 'Jost', sans-serif; font-weight: 300; } .font-boho { font-family: 'Lora', serif; font-style: italic; }`}} />
      
      {weddingData?.musicUrl && <audio ref={audioRef} src={weddingData.musicUrl} loop />}

      {/* HEADER EXCLUSIVO MODO VENTAS */}
      {esModoVentas && (
        <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md border-b border-stone-200/80 px-4 md:px-8 py-3 flex flex-col lg:flex-row items-center justify-between gap-4 z-[200] font-sans">
          <a href="https://clickypapel.com" className="flex items-center gap-1 group select-none shrink-0"><span className="font-serif text-base tracking-wider font-light text-stone-900">clicky<span className="font-normal text-[#9a7b5c]">papel</span>.com</span></a>
          <nav className="flex items-center gap-1 overflow-x-auto max-w-full no-scrollbar py-1 shrink-0 px-2">
            {Object.keys(catalogo25Demos).map((categoria) => (
              <div key={categoria} className="relative shrink-0">
                <button type="button" onClick={() => setCategoriaAbierta(categoriaAbierta === categoria ? null : categoria)} className="text-[11px] font-black tracking-wider uppercase px-3 py-2 rounded-xl text-stone-600 hover:bg-stone-100">{categoria}</button>
                {categoriaAbierta === categoria && (
                  <div className="absolute top-11 left-1/2 -translate-x-1/2 w-48 bg-white border border-stone-200/90 rounded-2xl shadow-xl p-1.5 space-y-0.5 z-[210]">
                    {catalogo25Demos[categoria].map((demo) => <a key={demo.slug} href={`/${demo.slug}`} className="block text-left text-[11px] px-3 py-2 rounded-xl font-semibold text-stone-600 hover:bg-stone-50">{demo.nombre}</a>)}
                  </div>
                )}
              </div>
            ))}
          </nav>
          <button type="button" onClick={() => setModalContratarAbierto(true)} className="bg-stone-950 hover:bg-[#9a7b5c] text-white text-[11px] uppercase tracking-widest font-bold px-5 py-2.5 rounded-xl shrink-0">✨ Quiero esta invitación</button>
        </header>
      )}

      {/* ANIMACIÓN DEL SOBRE */}
      <AnimatePresence>
        {!sobreAbierto && (
          <motion.div key="sobreMaster" className="fixed inset-0 z-[999] flex flex-col items-center justify-center overflow-hidden bg-[#e8e4de]" exit={{ opacity: 0 }} transition={{ duration: 0.9, delay: 0.2 }}>
            <motion.div className="absolute top-0 left-0 right-0 h-1/2 bg-[#e8e4de] border-b border-[#d8caba] shadow-md origin-top" exit={{ y: '-100%' }} transition={{ duration: 0.75, ease: [0.76, 0, 0.24, 1] }} />
            <motion.div className="absolute bottom-0 left-0 right-0 h-1/2 bg-[#e8e4de] border-t border-white/40 origin-bottom" exit={{ y: '100%' }} transition={{ duration: 0.75, ease: [0.76, 0, 0.24, 1] }} />
            <motion.button onClick={abrirSobre} exit={{ scale: 0, opacity: 0 }} transition={{ duration: 0.35 }} className="relative z-10 flex flex-col items-center gap-4 group select-none">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#ba9f83] to-[#8a6b4c] shadow-2xl border-4 border-[#e8e4de] flex items-center justify-center relative overflow-hidden group-hover:scale-105 transition-transform duration-500">
                <div className="absolute inset-0 bg-white/20 rounded-full animate-ping opacity-75"></div>
                {/* 👇 EL SOBRE AHORA DICE "XV" SI ES EVENTO DE XV AÑOS */}
                <span className="text-white font-serif text-2xl font-light relative z-10 tracking-wider">
                  {tipoEventoGlobal === 'xvanos' ? 'XV' : `${weddingData.brideName?.charAt(0)}&${weddingData.groomName?.charAt(0)}`}
                </span>
              </div>
              <span className="text-[#8a6b4c] text-[10px] uppercase tracking-[0.3em] font-bold animate-pulse">Toca para abrir</span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className={`transition-opacity duration-1000 delay-300 w-full ${sobreAbierto ? 'opacity-100' : 'opacity-0 h-screen overflow-hidden pointer-events-none'}`}>
        
        {/* PANEL LATERAL EXCLUSIVO MODO VENTAS */}
        {esModoVentas && (
          <div className="fixed bottom-6 right-6 z-[100] bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-2xl border border-stone-200/80 max-w-xs w-64 space-y-3.5 text-left text-stone-800 font-sans pointer-events-auto">
            <span className="text-[9px] bg-[#e3d5c8] text-[#4a3f35] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider font-mono">Prueba de Diseño</span>
            
            {/* 👇 SELECTOR INTELIGENTE: Muestra plantillas de Boda o de XV */}
            <select value={plantillaActiva} onChange={(e) => setPlantillaActiva(e.target.value)} className="w-full text-xs p-2 rounded-xl border bg-stone-50 font-bold">
              {tipoEventoGlobal === 'boda' ? (
                <>
                  <option value="v1">V1: Clásica Minimalista</option>
                  <option value="v2">V2: Editorial Alta Costura</option>
                  <option value="v3">V3: Bosque Místico</option>
                </>
              ) : (
                <>
                  <option value="xv-v1">XV V1: Jardín Encantado</option>
                </>
              )}
            </select>

            <div className="grid grid-cols-6 gap-1.5">{Object.keys(listadoPaletas).map((key) => <button key={key} type="button" onClick={() => setPaletaActiva(key)} className={`h-7 rounded-lg border text-[10px] ${paletaActiva === key ? 'border-stone-950 ring-2 scale-105 bg-stone-100' : 'border-stone-200 bg-stone-50'}`}>{key === 'cashmere' ? '🕊️' : key === 'matcha' ? '🍵' : key === 'terracota' ? '🏺' : key === 'celestial' ? '☁️' : key === 'rosegold' ? '🌸' : '🖤'}</button>)}</div>
            <select value={fuenteActiva} onChange={(e) => setFuenteActiva(e.target.value)} className="w-full text-xs p-2 rounded-xl border bg-white font-medium"><option value="clasica">Clásica Atemporal</option><option value="cursiva">Cursiva Elegante</option><option value="editorial">Alta Costura</option><option value="minimalista">Minimalista</option><option value="boho">Boho Chic</option></select>
          </div>
        )}

        <button type="button" onClick={toggleMusicaFlotante} className="fixed bottom-6 left-6 z-[150] bg-white/90 text-stone-900 backdrop-blur-md border border-stone-200 p-3 rounded-full shadow-xl text-xs pointer-events-auto">{musicaSonando ? '🎵 ⏸️' : '🔇 ▶️'}</button>

        <div className="space-y-12 pb-16">
          
          {/* 👇 AQUÍ RENDERIZAMOS LA PLANTILLA ADECUADA */}
          <ScrollReveal>
            {plantillaActiva === 'v3' ? (
              <InvitationHeroV3 weddingData={weddingData} diseño={diseño} />
            ) : plantillaActiva === 'v2' ? (
              <InvitationHeroV2 weddingData={weddingData} diseño={diseño} />
            ) : plantillaActiva === 'xv-v1' ? (
              <InvitationHeroXV weddingData={weddingData} diseño={diseño} />
            ) : (
              <InvitationHero weddingData={weddingData} diseño={diseño} />
            )}
          </ScrollReveal>

          {/* El resto de componentes se reúsan porque funcionan igual para XV o Boda */}
          <ScrollReveal>{plantillaActiva === 'v2' || plantillaActiva === 'v3' ? <EventTimelineV2 weddingData={weddingData} diseño={diseño} /> : <EventTimeline weddingData={weddingData} diseño={diseño} />}</ScrollReveal>
          {weddingData.galleryImages && weddingData.galleryImages.length > 0 && <ScrollReveal><PhotoGallery weddingData={weddingData} images={weddingData.galleryImages} diseño={diseño} /></ScrollReveal>}
          <ScrollReveal><GiftRegistry weddingData={weddingData} diseño={diseño} /></ScrollReveal>
          <ScrollReveal><QuoteBanner weddingData={weddingData} diseño={diseño} /></ScrollReveal>
          <ScrollReveal><RsvpModule weddingId={weddingData.id} weddingSlug={weddingData.slug} diseño={diseño} /></ScrollReveal>
        </div>
        
        <footer className="text-center py-12 bg-transparent text-stone-400 text-[9px] uppercase tracking-widest font-sans">
          {esModoVentas ? 'Demostración de plataforma interactiva' : <>Creado en <a href="https://clickypapel.com" target="_blank" className="font-bold hover:text-[#9a7b5c]">ClickyPapel</a></>}
        </footer>
      </div>
    </main>
  );
}