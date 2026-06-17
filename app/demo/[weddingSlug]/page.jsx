"use client";
import { useParams, useSearchParams } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase'; 
import { motion, AnimatePresence } from 'framer-motion';

import InvitationHero from '@/components/InvitationHero';
import EventTimeline from '@/components/EventTimeline';
import InvitationHeroV2 from '@/components/InvitationHeroV2';
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

export default function WeddingDemoPage() {
  const params = useParams();
  const slug = params?.weddingSlug || params?.slug;

  const [weddingData, setWeddingData] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [categoriaAbierta, setCategoriaAbierta] = useState(null); 
  const [musicaSonando, setMusicaSonando] = useState(false);

  const [plantillaActiva, setPlantillaActiva] = useState('v1'); 
  const [paletaActiva, setPaletaActiva] = useState('cashmere');       
  const [fuenteActiva, setFuenteActiva] = useState('clasica');     

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
      if (!slug) { setCargando(false); return; }
      setCargando(true);
      const slugLimpio = slug.toLowerCase().trim();
      const { data, error } = await supabase.from('bodas').select('*').eq('slug', slugLimpio).maybeSingle();

      if (error || !data) {
        setWeddingData({
          id: 'demo-id', slug: slugLimpio, groomName: 'Bruno', brideName: 'Brisa',
          eventDate: "2026-12-19T18:00:00", coverImage: "https://images.unsplash.com/photo-1519741497674-611481863552", 
          galleryImages: [], musicUrl: '/music/1. Clásico Romántico.mp3', albumCompartidoActivo: true,
          ceremoniaLugar: 'Parroquia de Nuestra Señora', recepcionLugar: 'Quinta Gran Jardín',
        });
      } else {
        setWeddingData({
          id: data.id, slug: data.slug, groomName: data.groom_name, brideName: data.bride_name,
          eventDate: data.event_date || "2026-12-19T18:00:00", coverImage: data.cover_image || "https://images.unsplash.com/photo-1519741497674-611481863552", 
          galleryImages: data.gallery_images || [], welcomePhrase: data.welcome_phrase, ceremoniaHora: data.ceremonia_hora,
          ceremoniaLugar: data.ceremonia_lugar, ceremoniaMapsUrl: data.ceremonia_maps_url, recepcionHora: data.recepcion_hora,
          recepcionLugar: data.recepcion_lugar, recepcionMapsUrl: data.recepcion_maps_url, musicUrl: data.music_url || '/music/1. Clásico Romántico.mp3',
          albumCompartidoActivo: data.album_compartido_activo || false,
        });
        if (data.template_id === 'v2') setPlantillaActiva('v2');
        if (data.template_id === 'minimal-dark') setPaletaActiva('obsidian');
        else if (data.template_id === 'boho-rancho') setPaletaActiva('terracota');
      }
      setCargando(false);
    }
    jalarDatosBoda();
  }, [slug, params]);

  const toggleMusicaFlotante = () => {
    if (audioRef.current) {
      if (musicaSonando) audioRef.current.pause();
      else audioRef.current.play().catch(e => console.log(e));
      setMusicaSonando(!musicaSonando);
    }
  };

  const listadoPaletas = {
    cashmere: { bgGlobal: 'bg-[#f5f0ea] text-[#4a3f35]', colorCard: 'bg-white/90 border-[#e3d5c8]', textAcento: 'text-[#9a7b5c]', btn: 'bg-[#9a7b5c] text-white' },
    matcha: { bgGlobal: 'bg-[#eef2eb] text-[#1f3022]', colorCard: 'bg-white/90 border-[#c9d6c3]', textAcento: 'text-[#3f6345]', btn: 'bg-[#3f6345] text-white' },
    terracota: { bgGlobal: 'bg-[#fbf1ea] text-[#5c2a1a]', colorCard: 'bg-white/90 border-[#f0d4c3]', textAcento: 'text-[#c85a3a]', btn: 'bg-[#c85a3a] text-white' },
    celestial: { bgGlobal: 'bg-[#eef2f6] text-[#1e3246]', colorCard: 'bg-white/90 border-[#c6d4e1]', textAcento: 'text-[#466a8e]', btn: 'bg-[#466a8e] text-white' },
    obsidian: { bgGlobal: 'bg-[#121214] text-[#f4f4f5]', colorCard: 'bg-[#1e1e20] border-[#3f3f46]', textAcento: 'text-[#d4d4d8]', btn: 'bg-[#f4f4f5] text-[#121214]' }
  };

  const listadoFuentes = {
    clasica: 'font-clasica leading-relaxed', cursiva: 'font-cursiva leading-loose text-[1.25em]', 
    editorial: 'font-editorial leading-loose', minimalista: 'font-minimalista leading-relaxed', boho: 'font-boho leading-loose text-[1.1em]'  
  };

  const diseño = listadoPaletas[paletaActiva] || listadoPaletas.cashmere;
  const claseFuente = listadoFuentes[fuenteActiva] || listadoFuentes.clasica;
  const precioTotal = { basicos: 890, premium: 1490, vip: 2490 }[planSeleccionado] + (planSeleccionado !== 'basicos' && agregaMusicaExtra ? 350 : 0);

  if (cargando) return <div className="min-h-screen bg-[#faf9f6] flex items-center justify-center animate-pulse text-xs tracking-widest uppercase text-stone-500">Abriendo catálogo... ✨</div>;

  return (
    <main className={`min-h-screen overflow-x-hidden relative ${diseño.bgGlobal} ${claseFuente} pt-32 md:pt-20`}>
      <style dangerouslySetInnerHTML={{__html: `@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,400&family=Great+Vibes&family=Jost:wght@300;400;500&family=Lora:ital,wght@0,400;1,400&display=swap'); .font-clasica { font-family: 'Cormorant Garamond', serif; } .font-cursiva { font-family: 'Great Vibes', cursive; } .font-editorial { font-family: 'Cinzel', serif; letter-spacing: 0.15em; text-transform: uppercase; } .font-minimalista { font-family: 'Jost', sans-serif; font-weight: 300; letter-spacing: 0.05em; } .font-boho { font-family: 'Lora', serif; font-style: italic; }`}} />
      {weddingData?.musicUrl && <audio ref={audioRef} src={weddingData.musicUrl} loop />}

      <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md border-b border-stone-200/80 px-4 md:px-8 py-3 flex flex-col lg:flex-row items-center justify-between gap-4 z-[200] font-sans">
        <a href="https://clickypapel.com" className="flex items-center gap-1 group select-none shrink-0"><span className="font-serif text-base tracking-wider font-light text-stone-900 group-hover:text-[#9a7b5c] transition-colors">clicky<span className="font-normal text-[#9a7b5c]">papel</span>.com</span></a>
        <nav className="flex items-center gap-1 overflow-x-auto max-w-full no-scrollbar py-1 shrink-0 px-2">
          {Object.keys(catalogo25Demos).map((categoria) => (
            <div key={categoria} className="relative shrink-0">
              <button type="button" onClick={() => setCategoriaAbierta(categoriaAbierta === categoria ? null : categoria)} className={`text-[11px] font-black tracking-wider uppercase px-3 py-2 rounded-xl transition-all flex items-center gap-1 ${categoriaAbierta === categoria ? 'bg-stone-950 text-white' : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'}`}>{categoria} <span>{categoriaAbierta === categoria ? '▲' : '▼'}</span></button>
              {categoriaAbierta === categoria && (
                <div className="absolute top-11 left-1/2 -translate-x-1/2 w-48 bg-white border border-stone-200/90 rounded-2xl shadow-xl p-1.5 space-y-0.5 z-[210]">
                  {catalogo25Demos[categoria].map((demo) => <a key={demo.slug} href={`/demo/${demo.slug}`} className="block text-left text-[11px] px-3 py-2 rounded-xl font-semibold text-stone-600 hover:bg-stone-50">{demo.nombre}</a>)}
                </div>
              )}
            </div>
          ))}
        </nav>
        <button type="button" onClick={() => setModalContratarAbierto(true)} className="bg-stone-950 hover:bg-[#9a7b5c] text-white text-[11px] uppercase tracking-widest font-bold px-5 py-2.5 rounded-xl shrink-0">✨ Quiero esta invitación ➔</button>
      </header>

      <div className="fixed bottom-6 right-6 z-[100] bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-2xl border border-stone-200/80 max-w-xs w-64 space-y-3.5 text-left text-stone-800 font-sans">
        <span className="text-[9px] bg-[#e3d5c8] text-[#4a3f35] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider font-mono">Prueba de Diseño</span>
        <select value={plantillaActiva} onChange={(e) => setPlantillaActiva(e.target.value)} className="w-full text-xs p-2 rounded-xl border bg-stone-50 font-bold"><option value="v1">V1: Clásica Minimalista</option><option value="v2">V2: Editorial Alta Costura</option></select>
        <div className="grid grid-cols-5 gap-1.5">{Object.keys(listadoPaletas).map((key) => <button key={key} type="button" onClick={() => setPaletaActiva(key)} className={`h-7 rounded-lg border text-[10px] ${paletaActiva === key ? 'border-stone-950 ring-2 scale-105 bg-stone-100' : 'border-stone-200 bg-stone-50'}`}>{key === 'cashmere' ? '🕊️' : key === 'matcha' ? '🍵' : key === 'terracota' ? '🏺' : key === 'celestial' ? '☁️' : '🖤'}</button>)}</div>
        <select value={fuenteActiva} onChange={(e) => setFuenteActiva(e.target.value)} className="w-full text-xs p-2 rounded-xl border bg-white font-medium"><option value="clasica">Clásica Atemporal</option><option value="cursiva">Cursiva Elegante</option><option value="editorial">Alta Costura</option><option value="minimalista">Minimalista</option><option value="boho">Boho Chic</option></select>
      </div>

      <button type="button" onClick={toggleMusicaFlotante} className="fixed bottom-6 left-6 z-[150] bg-white/90 border border-stone-200 p-3 rounded-full shadow-xl text-xs">{musicaSonando ? '🎵 ⏸️' : '🔇 ▶️'}</button>

      {modalContratarAbierto && (
        <div className="fixed inset-0 bg-stone-900/60 flex items-center justify-center z-[300] p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full relative font-sans">
            <button type="button" onClick={() => setModalContratarAbierto(false)} className="absolute top-4 right-4 text-stone-400 bg-stone-100 w-8 h-8 rounded-full">✕</button>
            <h3 className="font-serif text-xl font-medium mb-4">Total a pagar: ${precioTotal} MXN</h3>
            <button type="button" className="bg-stone-950 text-white w-full py-3 rounded-xl font-bold">Proceder ➔</button>
          </div>
        </div>
      )}

      <div className="space-y-12 pb-16">
        <ScrollReveal>{plantillaActiva === 'v2' ? <InvitationHeroV2 weddingData={weddingData} diseño={diseño} /> : <InvitationHero weddingData={weddingData} diseño={diseño} />}</ScrollReveal>
        <ScrollReveal>{plantillaActiva === 'v2' ? <EventTimelineV2 weddingData={weddingData} diseño={diseño} /> : <EventTimeline weddingData={weddingData} diseño={diseño} />}</ScrollReveal>
        <ScrollReveal><PhotoGallery weddingData={weddingData} images={weddingData?.galleryImages || []} diseño={diseño} /></ScrollReveal>
        <ScrollReveal><GiftRegistry weddingData={weddingData} diseño={diseño} /></ScrollReveal>
        <ScrollReveal><QuoteBanner weddingData={weddingData} diseño={diseño} /></ScrollReveal>
        <ScrollReveal><RsvpModule weddingId={weddingData?.id} weddingSlug={weddingData?.slug} diseño={diseño} /></ScrollReveal>
      </div>
      <footer className="text-center py-12 bg-[#121214] text-zinc-500 text-xs font-sans">Invitación creada en clickypapel.com</footer>
    </main>
  );
}