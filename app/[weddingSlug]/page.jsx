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
  
  const esModoDemo = searchParams.get('demo') === 'true' || true; 
  const slug = params?.weddingSlug || params?.slug;

  const [weddingData, setWeddingData] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [categoriaAbierta, setCategoriaAbierta] = useState(null); 
  const [musicaSonando, setMusicaSonando] = useState(false);

  // 🎨 ESTADOS DE DISEÑO INTERACTIVO (Las 5 Nuevas Tendencias)
  const [paletaActiva, setPaletaActiva] = useState('cashmere');       
  const [fuenteActiva, setFuenteActiva] = useState('serif');     
  const [colorSeleccionado, setColorSeleccionado] = useState(null);
  const [mensajeCopiado, setMensajeCopiado] = useState(false);

  // Burbujas de ropa fijas (Elección de los novios, esto no cambia con la interfaz)
  const [burbujasEvento, setBurbujasEvento] = useState([]);

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

  const obtenerBurbujasPorDemo = (slugDemo, template) => {
    if (slugDemo.includes('dark') || slugDemo.includes('neon') || slugDemo.includes('urban') || slugDemo.includes('glam')) {
      return [{hex:'#18181b', n:'Negro'}, {hex:'#3f3f46', n:'Gris Oscuro'}, {hex:'#71717a', n:'Plata'}, {hex:'#ffffff', n:'Blanco'}];
    } else if (slugDemo.includes('boho') || slugDemo.includes('vintage') || slugDemo.includes('safari') || slugDemo.includes('sunset')) {
      return [{hex:'#8c6239', n:'Terracota'}, {hex:'#bf9b7a', n:'Arena'}, {hex:'#dfd3c3', n:'Lino'}, {hex:'#7d8a7c', n:'Salvia verde'}];
    } else if (slugDemo.includes('boy') || slugDemo.includes('sky')) {
      return [{hex:'#ccfbf1', n:'Menta'}, {hex:'#bae6fd', n:'Cielo'}, {hex:'#e0f2fe', n:'Nube'}, {hex:'#ffffff', n:'Blanco'}];
    } else if (slugDemo.includes('girl') || slugDemo.includes('playa') || slugDemo.includes('romantica')) {
      return [{hex:'#9d174d', n:'Rosa Viejo'}, {hex:'#fbcfe8', n:'Blush'}, {hex:'#fff1f2', n:'Rosado'}, {hex:'#fef3c7', n:'Marfil'}];
    } else {
      return [{hex:'#78350f', n:'Dorado Oscuro'}, {hex:'#b45309', n:'Ámbar'}, {hex:'#f59e0b', n:'Oro'}, {hex:'#fef3c7', n:'Crema'}];
    }
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
          ...data,
          eventDate: data.event_date || "2026-12-19T18:00:00", 
          coverImage: data.cover_image || "https://images.unsplash.com/photo-1519741497674-611481863552", 
          galleryImages: data.gallery_images || [],
          musicUrl: data.music_url || '/music/1-thousand-years.mp3',
          codigoVestimenta: data.codigo_vestimenta,
          paletaColores: data.paleta_colores,
        });

        // Autodetectar el tema tendencia al cargar
        if (data.template_id === 'minimal-dark') setPaletaActiva('obsidian');
        else if (data.template_id === 'boho-rancho') setPaletaActiva('terracota');
        else setPaletaActiva('cashmere');

        setBurbujasEvento(obtenerBurbujasPorDemo(slugLimpio, data.template_id));
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

  const copiarColorHex = (hex) => {
    setColorSeleccionado(hex);
    navigator.clipboard.writeText(hex);
    setMensajeCopiado(true);
    setTimeout(() => setMensajeCopiado(false), 2000);
  };

  // 🎨 CONFIGURACIÓN DE LAS 5 TENDENCIAS DE INTERFAZ 2026
  const listadoPaletas = {
    cashmere: { 
      bgGlobal: 'bg-[#fcfaf8] text-[#3d3733] selection:bg-[#eaddd7]', 
      colorCard: 'bg-white border-stone-200/50 shadow-sm', 
      textAcento: 'text-[#8a7968] font-bold tracking-wide', 
      btn: 'bg-[#8a7968] hover:bg-[#736456] text-white shadow-sm transition-all' 
    },
    matcha: { 
      bgGlobal: 'bg-[#f4f6f0] text-[#2c3d30] selection:bg-[#dbe4d4]', 
      colorCard: 'bg-white border-[#cbd5c0]/50 shadow-sm', 
      textAcento: 'text-[#4a6b4e] font-bold tracking-wide', 
      btn: 'bg-[#4a6b4e] hover:bg-[#365039] text-white shadow-sm transition-all' 
    },
    terracota: { 
      bgGlobal: 'bg-[#fdf8f5] text-[#5c3a21] selection:bg-[#f6e1d5]', 
      colorCard: 'bg-white border-[#f0ddd1]/70 shadow-sm', 
      textAcento: 'text-[#d97757] font-bold tracking-wide', 
      btn: 'bg-[#d97757] hover:bg-[#bd6345] text-white shadow-sm transition-all' 
    },
    celestial: { 
      bgGlobal: 'bg-[#f5f7fa] text-[#2c3e50] selection:bg-[#dce3ea]', 
      colorCard: 'bg-white border-[#dbe1e8]/70 shadow-sm', 
      textAcento: 'text-[#5d7b9d] font-bold tracking-wide', 
      btn: 'bg-[#5d7b9d] hover:bg-[#4a6583] text-white shadow-sm transition-all' 
    },
    obsidian: { 
      bgGlobal: 'bg-zinc-950 text-zinc-200 selection:bg-zinc-800', 
      colorCard: 'bg-zinc-900/60 border-zinc-700/50 backdrop-blur-md', 
      textAcento: 'text-zinc-300 font-bold tracking-wider', 
      btn: 'bg-zinc-200 hover:bg-white text-zinc-950 shadow-sm transition-all' 
    }
  };

  const listadoFuentes = {
    serif: 'font-serif tracking-normal antialiased leading-relaxed',               
    sans: 'font-sans tracking-wide antialiased font-light leading-normal',         
    mono: 'font-mono tracking-tight text-xs antialiased font-medium',              
    cursive: 'font-serif italic tracking-wide antialiased font-light',             
    display: 'font-sans uppercase tracking-widest antialiased font-light text-sm'  
  };

  const diseño = listadoPaletas[paletaActiva] || listadoPaletas.cashmere;
  const claseFuente = listadoFuentes[fuenteActiva] || listadoFuentes.serif;

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
    <main className={`min-h-screen overflow-x-hidden transition-all duration-500 relative ${diseño.bgGlobal} ${claseFuente} pt-32 md:pt-20`}>
      
      {weddingData?.musicUrl && <audio ref={audioRef} src={weddingData.musicUrl} loop />}

      {/* HEADER PREMIUM COMERCIAL */}
      {esModoDemo && (
        <header className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-md border-b border-stone-200/80 px-4 md:px-8 py-3 flex flex-col lg:flex-row items-center justify-between gap-4 z-[200] shadow-xs font-sans">
          
          <a href="https://clickypapel.com" className="flex items-center gap-1 group select-none shrink-0">
            <span className="font-serif text-base tracking-wider font-light text-stone-900 group-hover:text-[#8a7968] transition-colors">
              clicky<span className="font-normal text-[#8a7968]">papel</span>.com
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
                          className={`block text-left text-[11px] px-3 py-2 rounded-xl font-semibold transition-all ${slug === demo.slug ? 'bg-stone-50 text-[#8a7968] font-bold border-l-2 border-[#8a7968]' : 'text-stone-600 hover:bg-stone-50 hover:text-stone-950'}`}
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

          <button type="button" onClick={() => setModalContratarAbierto(true)} className="bg-stone-950 hover:bg-[#8a7968] text-white text-[11px] uppercase tracking-widest font-bold px-5 py-2.5 rounded-xl transition-all shadow-md shrink-0 cursor-pointer">
            ✨ Quiero esta invitación ➔
          </button>
        </header>
      )}

      {/* 🔮 BARRA FLOTANTE INTERACTIVA DE TEMA (Con Nombres e Iconos Actualizados) */}
      <div className="fixed bottom-6 right-6 z-[100] bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-2xl border border-stone-200/80 max-w-xs w-64 space-y-3.5 text-left text-stone-800 font-sans">
        <div>
          <span className="text-[9px] bg-[#eaddd7] text-[#5c4f44] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider font-mono">Diseño de la App</span>
        </div>

        <div className="space-y-1">
          <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wide block">1. Tema y Color UI:</label>
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
          <label className="text-[10px] font-bold text-stone-400 uppercase tracking-wide block">2. Estilo de Textos:</label>
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

      <button type="button" onClick={toggleMusicaFlotante} className="fixed bottom-6 left-6 z-[150] bg-white/90 backdrop-blur-md border border-stone-200/80 p-3 rounded-full shadow-xl text-xs cursor-pointer">
        {musicaSonando ? '🎵 ⏸️' : '🔇 ▶️'}
      </button>

      {/* 🛍️ MODAL ASISTENTE DE CONTRATACIÓN */}
      {modalContratarAbierto && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center z-[300] p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full border border-stone-200 shadow-2xl space-y-6 relative text-stone-800 text-left font-sans">
            <button type="button" onClick={() => setModalContratarAbierto(false)} className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 font-bold text-xs bg-stone-100 w-8 h-8 rounded-full flex items-center justify-center cursor-pointer">✕</button>
            <div className="space-y-1">
              <span className="text-[10px] bg-[#eaddd7] text-[#5c4f44] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider font-mono">Alta Segura</span>
              <h3 className="font-serif text-xl text-stone-950 font-medium">Configura tu Entorno</h3>
              <p className="text-stone-400 text-xs font-light">Se exportará la paleta <strong className="text-stone-700 capitalize">{paletaActiva}</strong> y tipografía <strong className="text-stone-700 capitalize">{fuenteActiva}</strong>.</p>
            </div>
            
            <div className="space-y-2">
              <div className="flex flex-col gap-2">
                {['basicos', 'premium', 'vip'].map((p) => (
                  <label key={p} className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${planSeleccionado === p ? 'border-[#8a7968] bg-[#fcfaf8]' : 'border-stone-100 bg-stone-50/50'}`}>
                    <div className="flex items-center gap-3">
                      <input type="radio" name="modal_plan" checked={planSeleccionado === p} onChange={() => setPlanSeleccionado(p)} className="accent-[#8a7968]" />
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
              <button type="button" onClick={handleProcederAlPago} className="bg-stone-950 hover:bg-[#8a7968] text-white text-xs uppercase font-bold tracking-wider px-6 py-3.5 rounded-xl shadow-md cursor-pointer">Proceder ➔</button>
            </div>
          </div>
        </div>
      )}

      {/* 🚀 INYECCIÓN DE COMPONENTES */}
      {weddingData && (
        <>
          <InvitationHero weddingData={weddingData} diseño={diseño} />
          <EventTimeline weddingData={weddingData} diseño={diseño} />

          {/* 👔 MODULO CÓDIGO DE VESTIMENTA (BURBUJAS FIJAS DE LOS NOVIOS) */}
          <section className="py-12 px-4 max-w-sm mx-auto text-center space-y-6 font-sans">
            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-widest font-bold block text-stone-400">Código de Vestimenta</span>
              <p className="text-sm font-medium tracking-wide capitalize">✨ {weddingData.codigoVestimenta || "Formal / Gala"}</p>
            </div>

            <div className={`p-6 rounded-3xl border shadow-sm transition-colors duration-500 space-y-4 ${diseño.colorCard}`}>
              <div className="space-y-1">
                <span className="text-[9px] uppercase tracking-wider font-bold block text-stone-400">Paleta Sugerida (Elección de los anfitriones)</span>
                <p className="text-[10px] opacity-50 font-light">Toca un color de ropa para descubrir su tono o copiarlo:</p>
              </div>

              <div className="flex justify-center items-center gap-2">
                {burbujasEvento.map((color, i) => (
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
                    {burbujasEvento.find(c => c.hex === colorSeleccionado)?.n} ({colorSeleccionado}) 
                    {mensajeCopiado && <span className="text-emerald-600 ml-1.5 font-sans font-bold">¡Copiado! 📋</span>}
                  </p>
                ) : (
                  <p className="text-[11px] italic opacity-60 font-light">"{weddingData.paletaColores || "Tonos sugeridos para el evento"}"</p>
                )}
              </div>
            </div>
          </section>
          
          <PhotoGallery weddingData={weddingData} images={weddingData?.galleryImages || []} diseño={diseño} />
          
          {weddingData.album_compartido_activo && (
            <section className="max-w-md mx-auto px-6 py-6 text-center font-sans">
              <div className="bg-gradient-to-br from-[#8a7968] to-[#5c4f44] text-white p-6 rounded-3xl shadow-xl space-y-4 text-left border border-white/10">
                <div className="space-y-1">
                  <span className="text-[10px] bg-white/20 text-white font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider font-mono inline-block">Función Premium</span>
                  <h4 className="font-serif text-lg font-light">Álbum Colectivo en Vivo 📸</h4>
                  <p className="text-xs text-white/70 font-light leading-relaxed">Sube tus fotos directamente para el recuerdo de los novios.</p>
                </div>
                <a href={`https://tugrandia.icu/${weddingData.slug}/compartir`} className="w-full bg-white text-[#5c4f44] font-bold text-center py-3 rounded-xl block text-xs uppercase tracking-wider shadow-md hover:bg-stone-50 transition-colors">📤 Subir Fotos</a>
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