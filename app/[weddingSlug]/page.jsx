"use client";
import { useParams } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase'; 
import { motion, AnimatePresence } from 'framer-motion';

import InvitationHero from '@/components/InvitationHero';
import EventTimeline from '@/components/EventTimeline';
import InvitationHeroV2 from '@/components/InvitationHeroV2';
import InvitationHeroV3 from '@/components/InvitationHeroV3'; 
import InvitationHeroXV from '@/components/InvitationHeroXV'; 
// 👇 NUEVAS IMPORTACIONES DE XV AÑOS 👇
import InvitationHeroXV_V2 from '@/components/InvitationHeroXV_V2'; 
import InvitationHeroXV_V3 from '@/components/InvitationHeroXV_V3'; 

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
    <div ref={ref} className={`transition-all duration-[1200ms] ease-out transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-16'}`}>
      {children}
    </div>
  );
};

export default function PaginaMaestraInvitacion() {
  const params = useParams();
  const slug = params?.weddingSlug || params?.slug || '';

  const [weddingData, setWeddingData] = useState(null);
  const [cargando, setCargando] = useState(true);
  
  // 🕵️ DETECTOR DE DOMINIO Y VENTAS
  const [esModoVentas, setEsModoVentas] = useState(false);

  // ✉️ ESTADOS DE INTERACCIÓN
  const [sobreAbierto, setSobreAbierto] = useState(false);
  const [musicaSonando, setMusicaSonando] = useState(false);
  const audioRef = useRef(null);

  // 🎨 ESTADOS DE DISEÑO INTERACTIVO (Configurador en vivo)
  const [plantillaActiva, setPlantillaActiva] = useState('v1'); 
  const [paletaActiva, setPaletaActiva] = useState('cashmere');       
  const [fuenteActiva, setFuenteActiva] = useState('clasica');     
  const [tipoEventoGlobal, setTipoEventoGlobal] = useState('boda'); 

  // 👇 CATÁLOGO CATEGORÍAS
  const categoriasDemos = ['Bodas 💍', 'XV Años 👑', 'Baby Shower 🍼', 'Bautizos 🕊️', 'Despedida 🥂'];

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
      const esXV = slugLimpio.includes('xv');
      setTipoEventoGlobal(esXV ? 'xvanos' : 'boda');

      const { data, error } = await supabase.from('bodas').select('*').eq('slug', slugLimpio).maybeSingle();

      if (error || !data) {
        let templateFallback = esXV ? 'xv-v1' : 'v1';
        if (slugLimpio.includes('boda-v2')) templateFallback = 'v2';
        if (slugLimpio.includes('boda-v3')) templateFallback = 'v3';

        setWeddingData({
          id: 'demo-id', slug: slugLimpio, 
          groomName: esXV ? '' : 'Bruno',
          brideName: esXV ? 'Sofía' : 'Brisa',
          eventDate: "2026-12-19T18:00:00", 
          coverImage: esXV ? "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7" : "https://images.unsplash.com/photo-1519741497674-611481863552", 
          galleryImages: [], musicUrl: '/music/1. Clásico Romántico.mp3', albumCompartidoActivo: true,
          ceremoniaLugar: 'Parroquia de Nuestra Señora', recepcionLugar: 'Quinta Gran Jardín',
          banco: 'BBVA', titular: esXV ? 'Familia de Sofía' : 'Bruno y Brisa', clabe: '012345678901234567',
        });
        setPlantillaActiva(templateFallback);
      } else {
        setWeddingData({
          id: data.id, 
          slug: data.slug, 
          groomName: data.groom_name, 
          brideName: data.bride_name,
          eventDate: data.event_date || "2026-12-19T18:00:00", 
          coverImage: data.cover_image, 
          galleryImages: data.gallery_images || [], 
          welcomePhrase: data.welcome_phrase, 
          ceremoniaLugar: data.ceremonia_lugar, 
          ceremoniaMapsUrl: data.ceremonia_maps_url, 
          recepcionLugar: data.recepcion_lugar, 
          recepcionMapsUrl: data.recepcion_maps_url, 
          musicUrl: data.music_url || '/music/1. Clásico Romántico.mp3',
          albumCompartidoActivo: data.album_compartido_activo || false,
          banco: data.banco, 
          titular: data.titular, 
          clabe: data.clabe, 
          amazonUrl: data.amazon_url, 
          liverpoolUrl: data.liverpool_url,
          
          ceremoniaHora: data.itinerario_misa,
          recepcionHora: data.itinerario_fiesta,
          horaBaile: data.hora_baile,
          horaShow: data.hora_show,
          horaFin: data.hora_fin,
          codigoVestimenta: data.codigo_vestimenta,
          paletaColores: data.paleta_colores
        });
        
        setPlantillaActiva(data.template_id || (esXV ? 'xv-v1' : 'v1'));
        setPaletaActiva(data.paleta_colores_ui || 'cashmere'); 
        setFuenteActiva(data.estilo_texto || 'clasica');
        setTipoEventoGlobal(data.tipo_evento || (esXV ? 'xvanos' : 'boda'));
      }
      setCargando(false);
    }
    jalarDatosBoda();
  }, [slug]);

  const handleCambioCategoria = (categoria) => {
    if (!weddingData) return;

    if (categoria.includes('XV')) {
      setTipoEventoGlobal('xvanos');
      setPlantillaActiva('xv-v1');
      setPaletaActiva('rosegold'); 
      setWeddingData({
        ...weddingData,
        brideName: 'Sofía',
        groomName: '',
        coverImage: "https://images.unsplash.com/photo-1518831959646-742c3a14ebf7",
        titular: 'Familia de Sofía',
        welcomePhrase: 'Hay momentos inolvidables que se guardan en el corazón para siempre.'
      });
      setSobreAbierto(false); 
    } else if (categoria.includes('Bodas')) {
      setTipoEventoGlobal('boda');
      setPlantillaActiva('v1');
      setPaletaActiva('cashmere');
      setWeddingData({
        ...weddingData,
        brideName: 'Brisa',
        groomName: 'Bruno',
        coverImage: "https://images.unsplash.com/photo-1519741497674-611481863552",
        titular: 'Bruno y Brisa',
        welcomePhrase: 'El amor todo lo cree, todo lo espera, todo lo soporta.'
      });
      setSobreAbierto(false); 
    } else {
      alert(`Las plantillas para ${categoria} estarán disponibles en la próxima actualización ✨`);
    }
  };

  const abrirSobre = () => {
    setSobreAbierto(true);
    if (audioRef.current) { audioRef.current.play().catch(e => console.log(e)); setMusicaSonando(true); }
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
    rosegold: { bgGlobal: 'bg-rose-50 text-stone-800', textAcento: 'text-rose-400', btn: 'bg-rose-400 text-white' }
  };

  const coloresVisuales = { cashmere: '#e6dfd5', matcha: '#dfe8da', terracota: '#eedad1', celestial: '#dbe4ed', obsidian: '#1f1f22', rosegold: '#fce7eb' };

  const listadoFuentes = {
    clasica: 'font-clasica leading-relaxed', cursiva: 'font-cursiva leading-loose text-[1.25em]', 
    editorial: 'font-editorial leading-loose', minimalista: 'font-minimalista leading-relaxed', boho: 'font-boho leading-loose text-[1.1em]'  
  };

  const diseño = listadoPaletas[paletaActiva] || listadoPaletas.cashmere;
  const claseFuente = listadoFuentes[fuenteActiva] || listadoFuentes.clasica;

  const procesarCompra = () => {
    alert(`Redirigiendo al checkout...\n\nEvento: ${tipoEventoGlobal}\nDiseño elegido: ${plantillaActiva}\nColor: ${paletaActiva}\nFuente: ${fuenteActiva}`);
  };

  if (cargando) return <div className="min-h-screen bg-[#faf9f6] flex items-center justify-center"><div className="w-10 h-10 border-2 border-[#9a7b5c] border-t-transparent rounded-full animate-spin" /></div>;
  if (!weddingData) return <div className="min-h-screen flex items-center justify-center text-stone-400 font-sans">Invitación no encontrada</div>;

  return (
    <main className={`min-h-screen overflow-x-hidden relative ${diseño.bgGlobal} ${claseFuente} ${esModoVentas ? 'pt-24 md:pt-16' : ''}`}>
      <style dangerouslySetInnerHTML={{__html: `@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,400&family=Great+Vibes&family=Jost:wght@300;400;500&family=Lora:ital,wght@0,400;1,400&display=swap'); .font-clasica { font-family: 'Cormorant Garamond', serif; } .font-cursiva { font-family: 'Great Vibes', cursive; } .font-editorial { font-family: 'Cinzel', serif; letter-spacing: 0.15em; text-transform: uppercase; } .font-minimalista { font-family: 'Jost', sans-serif; font-weight: 300; } .font-boho { font-family: 'Lora', serif; font-style: italic; }`}} />
      
      {weddingData?.musicUrl && <audio ref={audioRef} src={weddingData.musicUrl} loop />}

      {/* 🚀 HEADER TIPO TABS (PESTAÑAS) */}
      {esModoVentas && (
        <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md border-b border-stone-200 px-6 py-2 flex items-center justify-between z-[200] font-sans shadow-sm">
          
          <a href="https://clickypapel.com" className="font-serif text-lg tracking-widest text-stone-900 hidden md:block shrink-0">
            clicky<span className="text-[#9a7b5c]">papel</span>
          </a>

          {/* Menú de categorías Inteligente (TABS) */}
          <nav className="flex items-center gap-6 md:gap-10 overflow-x-auto no-scrollbar w-full md:w-auto justify-start md:justify-center">
            {categoriasDemos.map((categoria) => {
              const isActive = (tipoEventoGlobal === 'boda' && categoria.includes('Bodas')) || 
                               (tipoEventoGlobal === 'xvanos' && categoria.includes('XV'));
              return (
                <button 
                  key={categoria} 
                  onClick={() => handleCambioCategoria(categoria)}
                  className={`text-[9px] md:text-[10px] font-black tracking-widest uppercase transition-all py-3 border-b-[3px] shrink-0 flex items-center gap-1 ${
                    isActive 
                      ? 'text-stone-900 border-[#9a7b5c]' 
                      : 'text-stone-400 border-transparent hover:text-stone-700'
                  }`}
                >
                  {categoria}
                </button>
              );
            })}
          </nav>

          <button onClick={procesarCompra} className="hidden md:flex bg-stone-950 hover:bg-stone-800 text-white text-[10px] uppercase tracking-widest font-bold px-6 py-2.5 rounded-full transition-colors shadow-lg items-center gap-2 shrink-0">
            ✨ Quiero esta
          </button>
        </header>
      )}

      {/* 🎛️ CONFIGURADOR FLOTANTE TIPO DOCK DE APPLE */}
      {esModoVentas && sobreAbierto && (
        <motion.div 
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] bg-white/95 backdrop-blur-xl px-6 py-3.5 rounded-full shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-stone-200/80 flex items-center gap-6 font-sans w-[90%] md:w-auto overflow-x-auto no-scrollbar"
        >
          {/* Selector de Plantilla Visual */}
          <div className="flex items-center gap-3 border-r border-stone-200 pr-6 shrink-0">
            <span className="text-[8px] uppercase font-bold text-stone-400 tracking-widest">Diseño</span>
            {tipoEventoGlobal === 'boda' ? (
              <div className="flex gap-2">
                <button onClick={() => setPlantillaActiva('v1')} className={`text-xl transition-transform hover:scale-110 ${plantillaActiva === 'v1' ? 'filter drop-shadow-md scale-110' : 'opacity-40 grayscale'}`} title="Clásica">✨</button>
                <button onClick={() => setPlantillaActiva('v2')} className={`text-xl transition-transform hover:scale-110 ${plantillaActiva === 'v2' ? 'filter drop-shadow-md scale-110' : 'opacity-40 grayscale'}`} title="Editorial">💎</button>
                <button onClick={() => setPlantillaActiva('v3')} className={`text-xl transition-transform hover:scale-110 ${plantillaActiva === 'v3' ? 'filter drop-shadow-md scale-110' : 'opacity-40 grayscale'}`} title="Bosque">🌲</button>
              </div>
            ) : (
               // 👇 NUEVOS BOTONES DE SELECCIÓN PARA XV AÑOS 👇
               <div className="flex gap-2">
                 <button onClick={() => setPlantillaActiva('xv-v1')} className={`text-xl transition-transform hover:scale-110 ${plantillaActiva === 'xv-v1' ? 'filter drop-shadow-md scale-110' : 'opacity-40 grayscale'}`} title="Jardín Floral">🌸</button>
                 <button onClick={() => setPlantillaActiva('xv-v2')} className={`text-xl transition-transform hover:scale-110 ${plantillaActiva === 'xv-v2' ? 'filter drop-shadow-md scale-110' : 'opacity-40 grayscale'}`} title="Noche Neón">🌃</button>
                 <button onClick={() => setPlantillaActiva('xv-v3')} className={`text-xl transition-transform hover:scale-110 ${plantillaActiva === 'xv-v3' ? 'filter drop-shadow-md scale-110' : 'opacity-40 grayscale'}`} title="Coquette">🎀</button>
               </div>
            )}
          </div>

          {/* Selector de Color en Círculos */}
          <div className="flex items-center gap-2 border-r border-stone-200 pr-6 shrink-0">
             <span className="text-[8px] uppercase font-bold text-stone-400 tracking-widest mr-1">Color</span>
             {Object.keys(coloresVisuales).map((key) => (
               <button 
                 key={key} 
                 onClick={() => setPaletaActiva(key)} 
                 title={key}
                 className={`w-5 h-5 rounded-full border transition-all ${paletaActiva === key ? 'border-stone-900 scale-125 shadow-sm' : 'border-stone-200 hover:scale-110'}`}
                 style={{ backgroundColor: coloresVisuales[key] }}
               />
             ))}
          </div>

          {/* Selector de Tipografía Simple */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[8px] uppercase font-bold text-stone-400 tracking-widest">Letra</span>
            <select value={fuenteActiva} onChange={(e) => setFuenteActiva(e.target.value)} className="bg-stone-100/80 border border-stone-200 text-[10px] font-bold text-stone-600 rounded-lg px-2 py-1 outline-none cursor-pointer">
              <option value="clasica">Clásica</option>
              <option value="cursiva">Cursiva</option>
              <option value="editorial">Editorial</option>
              <option value="minimalista">Moderna</option>
              <option value="boho">Boho</option>
            </select>
          </div>
          
          {/* Botón comprar móvil */}
          <button onClick={procesarCompra} className="md:hidden bg-stone-950 text-white text-[9px] uppercase tracking-widest font-bold px-4 py-2 rounded-full shrink-0 ml-2">
            Comprar
          </button>
        </motion.div>
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
        
        <button type="button" onClick={toggleMusicaFlotante} className="fixed bottom-24 md:bottom-6 left-6 z-[150] bg-white/90 text-stone-900 backdrop-blur-md border border-stone-200 p-3 rounded-full shadow-xl text-xs pointer-events-auto">{musicaSonando ? '🎵 ⏸️' : '🔇 ▶️'}</button>

        <div className="space-y-12 pb-24 md:pb-16">
          
          {/* 👇 INTEGRACIÓN DEL RENDERIZADO DE LAS NUEVAS PORTADAS XV 👇 */}
          <ScrollReveal>
            {plantillaActiva === 'v3' ? <InvitationHeroV3 weddingData={weddingData} diseño={diseño} /> 
            : plantillaActiva === 'v2' ? <InvitationHeroV2 weddingData={weddingData} diseño={diseño} /> 
            : plantillaActiva === 'xv-v3' ? <InvitationHeroXV_V3 weddingData={weddingData} /> 
            : plantillaActiva === 'xv-v2' ? <InvitationHeroXV_V2 weddingData={weddingData} /> 
            : plantillaActiva === 'xv-v1' ? <InvitationHeroXV weddingData={weddingData} diseño={diseño} /> 
            : <InvitationHero weddingData={weddingData} diseño={diseño} />}
          </ScrollReveal>

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