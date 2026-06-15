"use client";
import { useParams, useSearchParams } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase'; 
import InvitationHero from '@/components/InvitationHero';
import EventTimeline from '@/components/EventTimeline';
import PhotoGallery from '@/components/PhotoGallery';
import GiftRegistry from '@/components/GiftRegistry';
import QuoteBanner from '@/components/QuoteBanner'; 
import RsvpModule from '@/components/RsvpModule';

export default function WeddingInvitationPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  
  // Forzamos el modo demo activo para el catálogo comercial
  const esModoDemo = searchParams.get('demo') === 'true' || true; 

  const slug = params?.weddingSlug || params?.slug;

  const [weddingData, setWeddingData] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [menuDemosAbierto, setMenuDemosAbierto] = useState(false);
  const [musicaSonando, setMusicaSonando] = useState(false);

  // 🎨 ESTADOS DE DISEÑO INTERACTIVO EN VIVO (BARRA DE HERRAMIENTAS)
  const [paletaActiva, setPaletaActiva] = useState('oro');       
  const [fuenteActiva, setFuenteActiva] = useState('serif');     
  const [colorSeleccionado, setColorSeleccionado] = useState(null);
  const [mensajeCopiado, setMensajeCopiado] = useState(false);

  // 🛒 ESTADOS PARA EL MODAL DE CONTRATACIÓN
  const [modalContratarAbierto, setModalContratarAbierto] = useState(false);
  const [planSeleccionado, setPlanSeleccionado] = useState('premium'); 
  const [agregaMusicaExtra, setAgregaMusicaExtra] = useState(false);

  const audioRef = useRef(null);

  // 📋 EL NUEVO MAPA DE 25 DEMOS: 1 DISEÑO POR CATEGORÍA EXPUESTO EN SUS 5 COLORES REALES
  const catalogo25Demos = {
    'Bodas 💍': [
      { slug: 'demo-boda-tradicional', nombre: '✨ Gala Oro Tradicional' },
      { slug: 'demo-boda-industrial', nombre: '🖤 Obsidian Dark' },
      { slug: 'demo-boda-boho', nombre: '🌿 Terracota Orgánico' },
      { slug: 'demo-boda-playa', nombre: '🌸 Romance Rose' },
      { slug: 'demo-boda-vintage', nombre: '🌾 Mostaza / Trigo Chic' }
    ],
    'XV Años 👑': [
      { slug: 'demo-xv-glitter', nombre: '✨ Gala Oro Tradicional' },
      { slug: 'demo-xv-glam', nombre: '🪙 Titanium Minimal' },
      { slug: 'demo-xv-boho', nombre: '🍃 Verde Olivo Silvestre' },
      { slug: 'demo-xv-romantica', nombre: '🌸 Romance Rose' },
      { slug: 'demo-xv-neon', nombre: '🌌 Midnight Navy' }
    ],
    'Boda Civil 🥂': [
      { slug: 'demo-civil-brunch', nombre: '✨ Gala Oro Tradicional' },
      { slug: 'demo-civil-minimal', nombre: '🪙 Titanium Minimal' },
      { slug: 'demo-civil-garden', node: 'olivo', nombre: '🍃 Verde Olivo Silvestre' },
      { slug: 'demo-civil-sunset', nombre: '🌿 Terracota Orgánico' },
      { slug: 'demo-civil-urban', nombre: '🌌 Midnight Navy' }
    ],
    'Baby Shower 🍼': [
      { slug: 'demo-baby-neutral', nombre: '🌾 Mostaza / Trigo Chic' },
      { slug: 'demo-baby-boy', nombre: '🌲 Gala Esmeralda (Menta)' },
      { slug: 'demo-baby-girl', nombre: '🌸 Romance Rose' },
      { slug: 'demo-baby-safari', nombre: '🌿 Terracota Orgánico' },
      { slug: 'demo-baby-reveal', nombre: '🌌 Midnight Navy' }
    ],
    'Bautizos 🕊️': [
      { slug: 'demo-bautizo-clean', nombre: '✨ Gala Oro Tradicional' },
      { slug: 'demo-bautizo-moderno', nombre: '🪙 Titanium Minimal' },
      { slug: 'demo-bautizo-botanico', nombre: '🍃 Verde Olivo Silvestre' },
      { slug: 'demo-bautizo-vintage', nombre: '🌾 Mostaza / Trigo Chic' },
      { slug: 'demo-bautizo-sky', nombre: '🌲 Gala Esmeralda (Menta)' }
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
          musicUrl: data.music_url || '/music/1-thousand-years.mp3',
          albumCompartidoActivo: data.album_compartido_activo || false,
          codigoVestimenta: data.codigo_vestimenta,
          paletaColores: data.paleta_colores,
        });

        // Autodetectar paleta en caliente al cargar el registro para hacer match inmediato
        if (data.template_id === 'minimal-dark') setPaletaActiva('dark');
        else if (data.template_id === 'boho-rancho') setPaletaActiva('boho');
        else setPaletaActiva('oro');
      }
      setCargando(false);
    }

    jalarDatosBoda();
  }, [slug, params]);

  const toggleMusicaFlotante = () => {
    if (audioRef.current) {
      if (musicaSonando) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => console.log("Se requiere interacción", e));
      }
      setMusicaSonando(!musicaSonando);
    }
  };

  const copiarColorHex = (hex) => {
    setColorSeleccionado(hex);
    navigator.clipboard.writeText(hex);
    setMensajeCopiado(true);
    setTimeout(() => setMensajeCopiado(false), 2000);
  };

  // 🎨 CONFIGURACIÓN DE LAS 5 PALETAS DE COLOR DE LA BARRA FLOTANTE
  const listadoPaletas = {
    oro: { bgGlobal: 'bg-[#faf9f6] text-stone-800', colorCard: 'bg-white border-stone-200/60', textAcento: 'text-amber-800', btn: 'bg-amber-700 hover:bg-amber-800 text-white', burbujas: [{hex:'#78350f', n:'Miel'}, {hex:'#b45309', n:'Ámbar'}, {hex:'#f59e0b', n:'Oro Satinado'}, {hex:'#fef3c7', n:'Marfil'}] },
    esmeralda: { bgGlobal: 'bg-[#f4f6f4] text-stone-800', colorCard: 'bg-white border-emerald-900/10', textAcento: 'text-emerald-800', btn: 'bg-emerald-800 hover:bg-emerald-950 text-white', burbujas: [{hex:'#064e3b', n:'Imperial'}, {hex:'#115e59', n:'Teal'}, {hex:'#15803d', n:'Olivo'}, {hex:'#ccfbf1', n:'Menta'}] },
    rose: { bgGlobal: 'bg-[#fdfbfb] text-stone-800', colorCard: 'bg-white border-rose-900/10', textAcento: 'text-rose-700', btn: 'bg-rose-700 hover:bg-rose-800 text-white', burbujas: [{hex:'#4c0519', n:'Vino'}, {hex:'#9d174d', n:'Rosa Viejo'}, {hex:'#fbcfe8', n:'Blush'}, {hex:'#fff1f2', n:'Rosado'}] },
    dark: { bgGlobal: 'bg-zinc-950 text-zinc-200 selection:bg-zinc-800', colorCard: 'bg-zinc-900/40 border-zinc-800 text-zinc-300', textAcento: 'text-white', btn: 'bg-white text-zinc-950 hover:bg-zinc-200', burbujas: [{hex:'#18181b', n:'Charcoal'}, {hex:'#3f3f46', n:'Matte'}, {hex:'#71717a', n:'Smoky'}, {hex:'#a1a1aa', n:'Plata'}] },
    boho: { bgGlobal: 'bg-[#f4efe6] text-amber-950', colorCard: 'bg-[#faf7f2] border-amber-900/10', textAcento: 'text-amber-900', btn: 'bg-amber-900 text-white hover:bg-amber-950', burbujas: [{hex:'#8c6239', n:'Terracota'}, {hex:'#bf9b7a', n:'Arena'}, {hex:'#dfd3c3', n:'Lino'}, {hex:'#7d8a7c', n:'Salvia'}] }
  };

  // 🔤 CONFIGURACIÓN DE LAS 5 TIPOGRAFÍAS DE LA BARRA FLOTANTE
  const listadoFuentes = {
    serif: 'font-serif tracking-normal',             
    sans: 'font-sans tracking-wide antialiased',     
    mono: 'font-mono tracking-tight text-xs',        
    cursive: 'font-serif italic tracking-wide',      
    display: 'font-sans uppercase tracking-widest'   
  };

  const diseño = listadoPaletas[paletaActiva] || listadoPaletas.oro;
  const claseFuente = listadoFuentes[fuenteActiva] || listadoFuentes.serif;
  const coloresMuestra = diseño.burbujas;

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
    <main className={`min-h-screen overflow-x-hidden transition-all duration-500 relative ${diseño.bgGlobal} ${claseFuente} pt-20`}>
      
      {weddingData?.musicUrl && <audio ref={audioRef} src={weddingData.musicUrl} loop />}

      {/* 🧭 HEADER EXPANSIVO: UN MUESTRARIO MASIVO, ESPACIADO Y ORGANIZADO POR COLORES */}
      {esModoDemo && (
        <header className="fixed top-0 left-0 right-0 h-16 bg-white/95 backdrop-blur-md border-b border-stone-200/80 px-4 md:px-8 flex items-center justify-between z-[200] shadow-xs font-sans">
          <a href="https://clickypapel.com" className="flex items-center gap-1 group select-none">
            <span className="font-serif text-base tracking-wider font-light text-stone-900 group-hover:text-amber-700 transition-colors">
              clicky<span className="font-normal text-amber-600">papel</span>.com
            </span>
          </a>

          {/* 📖 El Muestrario de Demos "Más Separado" y Redefinido */}
          <div className="relative">
            <button 
              type="button"
              onClick={() => setMenuDemosAbierto(!menuDemosAbierto)}
              className="text-xs font-bold text-stone-700 hover:text-stone-950 bg-stone-100 px-5 py-2.5 rounded-xl flex items-center gap-2 transition-all cursor-pointer shadow-2xs border border-stone-200/40"
            >
              📖 Catálogo de Muestras <span className="text-[10px] opacity-60">{menuDemosAbierto ? '▲' : '▼'}</span>
            </button>

            {menuDemosAbierto && (
              <div className="absolute top-13 left-1/2 -translate-x-1/2 w-[92vw] md:w-[840px] bg-white border border-stone-200/90 rounded-3xl shadow-2xl p-6 md:p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 z-[210] max-h-[520px] overflow-y-auto animate-fadeIn">
                {Object.keys(catalogo25Demos).map((categoria) => (
                  <div key={categoria} className="space-y-3.5 bg-stone-50/40 p-4 rounded-2xl border border-stone-100">
                    <span className="text-[11px] font-black uppercase tracking-widest text-amber-700 block border-b pb-1.5 border-stone-200/60 select-none">
                      {categoria}
                    </span>
                    <div className="space-y-1">
                      {catalogo25Demos[categoria].map((demo) => (
                        <a 
                          key={demo.slug}
                          href={`/${demo.slug}?demo=true`} 
                          className={`block text-left text-[11px] px-2.5 py-2 rounded-xl font-medium transition-all ${
                            slug === demo.slug 
                              ? 'bg-stone-950 text-white font-bold shadow-sm' 
                              : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
                          }`}
                        >
                          {demo.nombre}
                        </a>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button type="button" onClick={() => setModalContratarAbierto(true)} className="bg-stone-950 hover:bg-amber-700 text-white text-[11px] uppercase tracking-widest font-bold px-5 py-2.5 rounded-xl transition-all shadow-md block whitespace-nowrap cursor-pointer">
            ✨ Crear mi cuenta ➔
          </button>
        </header>
      )}

      {/* 🔮 BARRA FLOTANTE INTERACTIVA DE ESTILOS */}
      <div className="fixed bottom-6 right-6 z-[100] bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-2xl border border-stone-200/80 max-w-xs w-64 space-y-3.5 text-left text-stone-800 font-sans">
        <div>
          <span className="text-[9px] bg-amber-100 text-amber-900 font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider font-mono">Diseño en tiempo real</span>
        </div>

        {/* 1. Selector de las 5 Paletas de Color */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wide block">1. Combinación Cromática (5):</label>
          <div className="grid grid-cols-5 gap-1.5">
            {Object.keys(listadoPaletas).map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => { setPaletaActiva(key); setColorSeleccionado(null); }}
                className={`h-7 rounded-lg border text-[10px] uppercase font-bold transition-all cursor-pointer ${paletaActiva === key ? 'border-stone-950 ring-2 ring-stone-950/20 scale-105' : 'border-stone-200 bg-stone-50 text-stone-500'}`}
              >
                {key === 'oro' ? '👑' : key === 'esmeralda' ? '🌲' : key === 'rose' ? '🌸' : key === 'dark' ? '🖤' : '🌿'}
              </button>
            ))}
          </div>
        </div>

        {/* 2. Selector de las 5 Tipografías Premium */}
        <div className="space-y-1">
          <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wide block">2. Estilo Tipográfico (5):</label>
          <select
            value={fuenteActiva}
            onChange={(e) => setFuenteActiva(e.target.value)}
            className="w-full text-xs p-2 rounded-xl border bg-white text-stone-700 font-medium focus:outline-none cursor-pointer"
          >
            <option value="serif">Classic Romance (Serif)</option>
            <option value="sans">Modern Clean (Sans)</option>
            <option value="mono">Editorial Avant-Garde (Mono)</option>
            <option value="cursive">Romance Script (Italic)</option>
            <option value="display">Minimal Bold (Display)</option>
          </select>
        </div>
      </div>

      {/* 🎧 BOTÓN REPRODUCTOR AUXILIAR */}
      <button type="button" onClick={toggleMusicaFlotante} className="fixed bottom-6 left-6 z-[150] bg-white/90 backdrop-blur-md border border-stone-200/80 p-3 rounded-full shadow-xl text-xs cursor-pointer">
        {musicaSonando ? '🎵 ⏸️' : '🔇 ▶️'}
      </button>

      {/* 🛍️ MODAL ASISTENTE DE CONTRATACIÓN */}
      {modalContratarAbierto && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center z-[300] p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full border border-stone-200 shadow-2xl space-y-6 relative text-stone-800 text-left font-sans">
            <button type="button" onClick={() => setModalContratarAbierto(false)} className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 font-bold text-xs bg-stone-100 w-8 h-8 rounded-full flex items-center justify-center cursor-pointer">✕</button>
            <div className="space-y-1">
              <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider font-mono">Alta Segura</span>
              <h3 className="font-serif text-xl text-stone-950 font-medium">Configura tu Entorno</h3>
              <p className="text-stone-400 text-xs font-light">Se exportará la paleta <strong className="text-stone-700 capitalize">{paletaActiva}</strong> y tipografía <strong className="text-stone-700 capitalize">{fuenteActiva}</strong>.</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex flex-col gap-2">
                {['basicos', 'premium', 'vip'].map((p) => (
                  <label key={p} className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${planSeleccionado === p ? 'border-amber-600 bg-amber-50/20' : 'border-stone-100 bg-stone-50/50'}`}>
                    <div className="flex items-center gap-3">
                      <input type="radio" name="modal_plan" checked={planSeleccionado === p} onChange={() => setPlanSeleccionado(p)} className="accent-amber-700" />
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
              <button type="button" onClick={handleProcederAlPago} className="bg-stone-950 hover:bg-amber-700 text-white text-xs uppercase font-bold tracking-wider px-6 py-3.5 rounded-xl shadow-md cursor-pointer">Proceder ➔</button>
            </div>
          </div>
        </div>
      )}

      {/* 🚀 INYECCIÓN REAL Y BLINDADA DE COMPONENTES ESTRUCTURALES */}
      {weddingData && (
        <>
          <InvitationHero weddingData={weddingData} diseño={diseño} />
          <EventTimeline weddingData={weddingData} diseño={diseño} />

          {/* 👔 MODULO INTERACTIVO DE BURBUJAS DE COLOR */}
          <section className="py-12 px-4 max-w-sm mx-auto text-center space-y-6 font-sans">
            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-widest font-bold block text-stone-400">Código de Vestimenta</span>
              <p className="text-sm font-medium tracking-wide capitalize">✨ {weddingData.codigoVestimenta || "Formal / Gala"}</p>
            </div>

            <div className={`p-6 rounded-3xl border shadow-sm transition-colors duration-500 space-y-4 ${diseño.colorCard}`}>
              <div className="space-y-1">
                <span className="text-[9px] uppercase tracking-wider font-bold block text-stone-400">Paleta de Inspiración Interactiva</span>
                <p className="text-[10px] opacity-50 font-light">Toca una burbuja de color para descubrir su tono o copiarlo:</p>
              </div>

              <div className="flex justify-center items-center gap-2">
                {coloresMuestra.map((color, i) => (
                  <button 
                    key={i} 
                    type="button"
                    style={{ backgroundColor: color.hex }} 
                    onClick={() => copiarColorHex(color.hex)}
                    className={`w-8 h-8 rounded-full shadow-xs border-2 hover:scale-110 transition-all cursor-pointer ${colorSeleccionado === color.hex ? 'border-stone-950 scale-105' : 'border-white'}`}
                  />
                ))}
              </div>

              <div className="h-8 flex items-center justify-center">
                {colorSeleccionado ? (
                  <p className={`text-[11px] font-mono font-medium animate-fadeIn ${diseño.textAcento}`}>
                    {coloresMuestra.find(c => c.hex === colorSeleccionado)?.n} ({colorSeleccionado}) 
                    {mensajeCopiado && <span className="text-emerald-600 ml-1.5 font-sans font-bold">¡Copiado! 📋</span>}
                  </p>
                ) : (
                  <p className="text-[11px] italic opacity-60 font-light">"{weddingData.paletaColores || "Tonos sugeridos para el evento"}"</p>
                )}
              </div>
            </div>
          </section>
          
          <PhotoGallery weddingData={weddingData} images={weddingData?.galleryImages || []} diseño={diseño} />
          
          {weddingData.albumCompartidoActivo && (
            <section className="max-w-md mx-auto px-6 py-6 text-center font-sans">
              <div className="bg-gradient-to-br from-purple-950 to-stone-950 text-white p-6 rounded-3xl shadow-xl space-y-4 text-left border border-purple-900/40">
                <div className="space-y-1">
                  <span className="text-[10px] bg-purple-500/30 text-purple-300 font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider font-mono inline-block">Función Premium</span>
                  <h4 className="font-serif text-lg font-light">Álbum Colectivo en Vivo 📸</h4>
                  <p className="text-xs text-purple-200/70 font-light leading-relaxed">Sube tus fotos directamente para el recuerdo de los novios.</p>
                </div>
                <a href={`https://tugrandia.icu/${weddingData.slug}/compartir`} className="w-full bg-white text-purple-950 font-bold text-center py-3 rounded-xl block text-xs uppercase tracking-wider shadow-md hover:bg-purple-50 transition-colors">📤 Subir Fotos</a>
              </div>
            </section>
          )}

          <GiftRegistry weddingData={weddingData} diseño={diseño} />
          <QuoteBanner weddingData={weddingData} diseño={diseño} />
          <RsvpModule weddingId={weddingData.id} weddingSlug={weddingData.slug} diseño={diseño} />
        </>
      )}

      <footer className="text-center py-12 bg-stone-900 text-stone-500 text-xs select-none font-sans">
        Invitación digital premium creada en <span className="text-stone-300">clickypapel.com</span>
      </footer>
    </main>
  );
}