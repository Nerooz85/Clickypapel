"use client";
import { useParams } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase'; 
import { motion, AnimatePresence } from 'framer-motion';

// 🧩 IMPORTACIÓN COMPONENTES V1 (Clásicos)
import InvitationHero from '@/components/InvitationHero';
import EventTimeline from '@/components/EventTimeline';

// 💎 IMPORTACIÓN COMPONENTES V2 (Editorial)
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

export default function InvitacionFinalCliente() {
  const params = useParams();
  const slug = params?.weddingSlug || params?.slug;

  const [weddingData, setWeddingData] = useState(null);
  const [cargando, setCargando] = useState(true);
  
  // ✉️ ESTADOS DE INTERACCIÓN DEL INVITADO
  const [sobreAbierto, setSobreAbierto] = useState(false);
  const [musicaSonando, setMusicaSonando] = useState(false);
  const audioRef = useRef(null);

  // 🎨 ESTADOS DE DISEÑO ASIGNADOS (Se bloquean con lo guardado en Supabase)
  const [plantillaActiva, setPlantillaActiva] = useState('v1'); 
  const [paletaActiva, setPaletaActiva] = useState('cashmere');       
  const [fuenteActiva, setFuenteActiva] = useState('clasica');     

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

      if (error || !data) {
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
          musicUrl: data.music_url || '/music/1. Clásico Romántico.mp3',
          albumCompartidoActivo: data.album_compartido_activo || false,
          codigoVestimenta: data.codigo_vestimenta,
          paletaColores: data.paleta_colores,
        });

        // 🧠 Sincronización Automática con la Configuración guardada del usuario
        setPlantillaActiva(data.template_id || 'v1');
        setPaletaActiva(data.paleta_colores || 'cashmere');
        setFuenteActiva(data.estilo_texto || 'clasica');
      }
      setCargando(false);
    }

    jalarDatosBoda();
  }, [slug, params]);

  // ✉️ REPRODUCCIÓN AL INTERACTUAR CON EL SOBRE
  const abrirSobre = () => {
    setSobreAbierto(true);
    if (audioRef.current) {
      audioRef.current.play().catch(e => console.log("Audio bloqueado por navegador:", e));
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

  // 🎨 DICCIONARIO DE ESTILOS FIJOS
  const listadoPaletas = {
    cashmere: { bgGlobal: 'bg-[#f5f0ea] text-[#4a3f35]', textAcento: 'text-[#9a7b5c]', btn: 'bg-[#9a7b5c] text-white' },
    matcha: { bgGlobal: 'bg-[#eef2eb] text-[#1f3022]', textAcento: 'text-[#3f6345]', btn: 'bg-[#3f6345] text-white' },
    terracota: { bgGlobal: 'bg-[#fbf1ea] text-[#5c2a1a]', textAcento: 'text-[#c85a3a]', btn: 'bg-[#c85a3a] text-white' },
    celestial: { bgGlobal: 'bg-[#eef2f6] text-[#1e3246]', textAcento: 'text-[#466a8e]', btn: 'bg-[#466a8e] text-white' },
    obsidian: { bgGlobal: 'bg-[#121214] text-[#f4f4f5]', textAcento: 'text-[#d4d4d8]', btn: 'bg-[#f4f4f5] text-[#121214]' }
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

  if (cargando) {
    return (
      <div className="min-h-screen bg-[#faf9f6] flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-[#9a7b5c] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!weddingData) {
    return (
      <div className="min-h-screen bg-[#faf9f6] flex flex-col items-center justify-center text-center p-6 space-y-2">
        <h1 className="font-serif text-xl text-stone-800">Invitación No Encontrada</h1>
        <p className="text-stone-400 text-xs font-light">Verifica que el enlace sea el correcto.</p>
      </div>
    );
  }

  return (
    <main className={`min-h-screen overflow-x-hidden relative ${diseño.bgGlobal} ${claseFuente}`}>
      
      {/* 🚀 INYECCIÓN DE FUENTES DE ALTA GAMA */}
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,400&family=Great+Vibes&family=Jost:wght@300;400;500&family=Lora:ital,wght@0,400;1,400&display=swap');
        .font-clasica { font-family: 'Cormorant Garamond', serif; }
        .font-cursiva { font-family: 'Great Vibes', cursive; }
        .font-editorial { font-family: 'Cinzel', serif; letter-spacing: 0.15em; text-transform: uppercase; }
        .font-minimalista { font-family: 'Jost', sans-serif; font-weight: 300; }
        .font-boho { font-family: 'Lora', serif; font-style: italic; }
      `}} />

      {weddingData?.musicUrl && <audio ref={audioRef} src={weddingData.musicUrl} loop />}

      {/* ✉️ ANIMACIÓN DE ENTRADA DEL SOBRE PREMIUM */}
      <AnimatePresence>
        {!sobreAbierto && (
          <motion.div 
            key="sobreMaster"
            className="fixed inset-0 z-[999] flex flex-col items-center justify-center overflow-hidden bg-[#e8e4de]"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: "easeInOut", delay: 0.2 }}
          >
            {/* Tapa Superior */}
            <motion.div 
              className="absolute top-0 left-0 right-0 h-1/2 bg-[#e8e4de] border-b border-[#d8caba] shadow-md origin-top"
              exit={{ y: '-100%' }}
              transition={{ duration: 0.75, ease: [0.76, 0, 0.24, 1] }}
            />

            {/* Tapa Inferior */}
            <motion.div 
              className="absolute bottom-0 left-0 right-0 h-1/2 bg-[#e8e4de] border-t border-white/40 origin-bottom"
              exit={{ y: '100%' }}
              transition={{ duration: 0.75, ease: [0.76, 0, 0.24, 1] }}
            />

            {/* Lacre / Sello de Apertura */}
            <motion.button
              onClick={abrirSobre}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.35 }}
              className="relative z-10 flex flex-col items-center gap-4 cursor-pointer group select-none"
            >
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#ba9f83] to-[#8a6b4c] shadow-2xl border-4 border-[#e8e4de] flex items-center justify-center relative overflow-hidden group-hover:scale-105 transition-transform duration-500">
                <div className="absolute inset-0 bg-white/20 rounded-full animate-ping opacity-75"></div>
                <span className="text-white font-serif text-2xl font-light relative z-10 tracking-wider">
                  {weddingData.brideName?.charAt(0)}&{weddingData.groomName?.charAt(0)}
                </span>
              </div>
              <span className="text-[#8a6b4c] text-[10px] uppercase tracking-[0.3em] font-bold animate-pulse">
                Toca para abrir
              </span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ✨ RENDERIZADO LIMPIO DE LA INVITACIÓN */}
      <div className={`transition-opacity duration-1000 delay-300 w-full ${sobreAbierto ? 'opacity-100' : 'opacity-0 h-screen overflow-hidden pointer-events-none'}`}>
        
        {/* CONTROL DE AUDIO TOTALMENTE INTEGRADO */}
        <button type="button" onClick={toggleMusicaFlotante} className="fixed bottom-6 left-6 z-[150] bg-white/90 text-stone-900 backdrop-blur-md border border-stone-200/80 p-3 rounded-full shadow-xl text-xs cursor-pointer">
          {musicaSonando ? '🎵 ⏸️' : '🔇 ▶️'}
        </button>

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

          {weddingData.galleryImages && weddingData.galleryImages.length > 0 && (
            <ScrollReveal>
              <PhotoGallery weddingData={weddingData} images={weddingData.galleryImages} diseño={diseño} />
            </ScrollReveal>
          )}
          
          {weddingData.albumCompartidoActivo && (
            <ScrollReveal>
              <section className="max-w-md mx-auto px-6 py-6 text-center font-sans">
                <div className="bg-gradient-to-br from-[#9a7b5c] to-[#7a5c43] text-white p-6 rounded-3xl shadow-xl space-y-4 text-left">
                  <h4 className="font-serif text-lg font-light">Álbum Colectivo en Vivo 📸</h4>
                  <p className="text-xs text-white/80 font-light leading-relaxed">Sube tus fotos directamente para el recuerdo de los novios.</p>
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

        {/* PIE DE PÁGINA LIMPIO Y DISCRETO */}
        <footer className="text-center py-12 bg-transparent text-stone-400 text-[9px] select-none font-sans tracking-widest uppercase">
          Creado en <a href="https://clickypapel.com" target="_blank" className="font-bold hover:text-[#9a7b5c] transition-colors">ClickyPapel</a>
        </footer>
      </div>
    </main>
  );
}