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
  
  // Detectamos de forma automática si es una demo de tu catálogo
  const esModoDemo = searchParams.get('demo') === 'true'; 

  const slug = params?.weddingSlug || params?.slug;

  const [weddingData, setWeddingData] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [templateActivo, setTemplateActivo] = useState('romantico-clasico');
  const [menuDemosAbierto, setMenuDemosAbierto] = useState(false);
  const [musicaSonando, setMusicaSonando] = useState(false);

  // 🛒 ESTADOS PARA EL EMBUDO DE VENTA INTERACTIVO (MODAL)
  const [modalContratarAbierto, setModalContratarAbierto] = useState(false);
  const [planSeleccionado, setPlanSeleccionado] = useState('premium'); 
  const [agregaMusicaExtra, setAgregaMusicaExtra] = useState(false);

  const audioRef = useRef(null);

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
          templateId: data.template_id || 'romantico-clasico',
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
          codigoVestimenta: data.codigo_vestimenta,
          musicType: data.music_type || 'default',
          musicUrl: data.music_url || '/music/1-thousand-years.mp3',
          albumCompartidoActivo: data.album_compartido_activo || false,
          mesaRegalos: {
            bankDetails: { banco: data.banco, titular: data.titular, clabe: data.clabe },
            registries: [
              ...(data.amazon_url ? [{ name: "Amazon", url: data.amazon_url, logo: "📦" }] : []),
              ...(data.liverpool_url ? [{ name: "Liverpool", url: data.liverpool_url, logo: "🛍️" }] : [])
            ]
          }
        });

        setTemplateActivo(data.template_id || 'romantico-clasico');
      }
      setCargando(false);
    }

    jalarDatosBoda();
  }, [slug, params]);

  // Manejo del control del reproductor flotante seguro
  const toggleMusicaFlotante = () => {
    if (audioRef.current) {
      if (musicaSonando) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => console.log("Se requiere interacción previa", e));
      }
      setMusicaSonando(!musicaSonando);
    }
  };

  if (cargando) {
    return (
      <div className="min-h-screen bg-[#faf9f6] flex items-center justify-center font-serif text-stone-500 animate-pulse text-sm tracking-widest uppercase">
        Abriendo la experiencia... ✨
      </div>
    );
  }

  if (!weddingData) {
    return (
      <div className="min-h-screen bg-[#faf9f6] flex flex-col items-center justify-center font-sans text-center p-6 space-y-4">
        <h1 className="font-serif text-2xl text-stone-800 font-light">Invitación No Encontrada</h1>
        <a href="https://clickypapel.com" className="text-xs bg-stone-900 text-white px-5 py-2.5 rounded-full uppercase tracking-wider mt-2">Ir a Inicio</a>
      </div>
    );
  }

  const estilosPorTemplate = {
    'romantico-clasico': {
      id: 'romantico-clasico',
      nombre: '💍 Romántico Clásico',
      bgGlobal: 'bg-[#faf9f6] text-stone-800',
      fuenteTitulo: 'font-serif text-stone-900',
      colorCard: 'bg-white',
      botonAcento: 'bg-amber-700 hover:bg-amber-800 text-white'
    },
    'minimal-dark': {
      id: 'minimal-dark',
      nombre: '🖤 Minimalista Dark',
      bgGlobal: 'bg-zinc-950 text-zinc-100 selection:bg-zinc-800',
      fuenteTitulo: 'font-sans tracking-widest text-white uppercase font-light',
      colorCard: 'bg-zinc-900/50 border border-zinc-800',
      botonAcento: 'bg-white text-zinc-950 hover:bg-zinc-200'
    },
    'boho-rancho': {
      id: 'boho-rancho',
      nombre: '🌿 Boho Chic / Campo',
      bgGlobal: 'bg-[#f4efe6] text-amber-950',
      fuenteTitulo: 'font-serif italic text-amber-900 font-normal',
      colorCard: 'bg-[#fbf9f4] border border-stone-200',
      botonAcento: 'bg-emerald-800 hover:bg-emerald-950 text-white'
    }
  };

  const diseño = estilosPorTemplate[templateActivo] || estilosPorTemplate['romantico-clasico'];

  // 💰 PRECIOS DE PLANES
  const preciosPlanes = { basicos: 890, premium: 1490, vip: 2490 };
  const precioBase = preciosPlanes[planSeleccionado];
  const precioMusicaExtra = (planSeleccionado !== 'basicos' && agregaMusicaExtra) ? 350 : 0;
  const precioTotal = precioBase + precioMusicaExtra;

  const handleProcederAlPago = () => {
    const urlCheckout = `https://clickypapel.com/registro?plan=${planSeleccionado}&template=${templateActivo}&musica=${agregaMusicaExtra ? 'custom' : 'default'}`;
    window.location.href = urlCheckout;
  };

  return (
    <main className={`min-h-screen overflow-x-hidden transition-colors duration-500 relative ${diseño.bgGlobal} ${esModoDemo ? 'pt-16' : ''}`}>
      
      {/* 🎵 REPRODUCTOR DE AUDIO DE FONDO CONTROLADO */}
      {weddingData.musicUrl && <audio ref={audioRef} src={weddingData.musicUrl} loop />}

      {/* 🎧 BOTÓN FLOTANTE ESTILIZADO DE AUDIO */}
      <button 
        type="button"
        onClick={toggleMusicaFlotante}
        className="fixed bottom-6 left-6 z-[150] bg-white/90 backdrop-blur-md border border-stone-200/80 p-3 rounded-full shadow-xl text-base cursor-pointer hover:scale-105 transition-transform"
        title="Música de fondo"
      >
        {musicaSonando ? '🎵 ⏸️' : '🔇 ▶️'}
      </button>

      {/* 🧭 HEADER PREMIUM COMERCIAL DE CLICKYPAPEL */}
      {esModoDemo && (
        <header className="fixed top-0 left-0 right-0 h-16 bg-white/95 backdrop-blur-md border-b border-stone-200/80 px-4 md:px-8 flex items-center justify-between z-[200] shadow-xs">
          <a href="https://clickypapel.com" className="flex items-center gap-1 group">
            <span className="font-serif text-base tracking-wider font-light text-stone-900 group-hover:text-amber-700 transition-colors">
              clicky<span className="font-normal text-amber-600">papel</span>.com
            </span>
          </a>

          <div className="relative">
            <button 
              type="button"
              onClick={() => setMenuDemosAbierto(!menuDemosAbierto)}
              className="text-xs font-semibold text-stone-600 hover:text-stone-900 bg-stone-100 px-4 py-2 rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              📖 Catálogo de Demos <span className="text-[10px] opacity-60">{menuDemosAbierto ? '▲' : '▼'}</span>
            </button>

            {menuDemosAbierto && (
              <div className="absolute top-11 left-1/2 -translate-x-1/2 w-56 bg-white border border-stone-200 rounded-xl shadow-lg p-1.5 space-y-1 z-[210]">
                <a href="/bruno-y-brisa?demo=true" className="block text-left text-xs px-3 py-2 rounded-lg hover:bg-stone-50 text-stone-700 font-medium">Demo 1: Bruno y Brisa (Clásica)</a>
                <a href="/demo-minimal-dark?demo=true" className="block text-left text-xs px-3 py-2 rounded-lg hover:bg-stone-50 text-stone-700 font-medium">Demo 2: Damián y Elena (Dark)</a>
                <a href="/demo-xv-boho?demo=true" className="block text-left text-xs px-3 py-2 rounded-lg hover:bg-stone-50 text-stone-700 font-medium">Demo 3: Regina (XV Boho Chic)</a>
              </div>
            )}
          </div>

          <div>
            <button 
              type="button"
              onClick={() => setModalContratarAbierto(true)}
              className="bg-amber-600 hover:bg-amber-700 text-white text-[11px] uppercase tracking-wider font-bold px-4 py-2.5 rounded-full transition-all shadow-md inline-block cursor-pointer"
            >
              ✨ Quiero esta invitación ➔
            </button>
          </div>
        </header>
      )}

      {/* 🔮 INTERFAZ FLOTANTE LATERAL PARA EL CAMBIO DE TEMPLATE */}
      {esModoDemo && (
        <div className="fixed bottom-6 right-6 z-[100] bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-stone-200 max-w-xs space-y-2">
          <div className="text-left">
            <span className="text-[9px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Estilo Visual</span>
          </div>
          <div className="flex flex-col gap-1.5 pt-0.5">
            {Object.values(estilosPorTemplate).map((estilo) => (
              <button
                key={estilo.id}
                type="button"
                onClick={() => setTemplateActivo(estilo.id)}
                className={`w-full text-left text-xs px-3 py-2 rounded-xl border transition-all cursor-pointer font-medium ${
                  templateActivo === estilo.id 
                    ? 'border-amber-600 bg-amber-50 text-amber-900 font-semibold' 
                    : 'border-stone-200 bg-white hover:bg-stone-50 text-stone-700'
                }`}
              >
                {estilo.nombre}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 🛍️ MODAL ASISTENTE DE CONTRATACIÓN */}
      {modalContratarAbierto && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center z-[300] p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full border border-stone-200 shadow-2xl space-y-6 relative text-stone-800 text-left">
            
            <button type="button" onClick={() => setModalContratarAbierto(false)} className="absolute top-4 right-4 text-stone-400 hover:text-stone-700 font-bold text-sm bg-stone-100 w-8 h-8 rounded-full flex items-center justify-center cursor-pointer">✕</button>

            <div className="space-y-1">
              <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider font-mono">Paso Final</span>
              <h3 className="font-serif text-xl text-stone-950 font-medium">Personaliza tu paquete</h3>
              <p className="text-stone-400 text-xs font-light">Elegiste el diseño: <strong className="text-stone-700 font-semibold">{diseño.nombre}</strong></p>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">1. Selecciona tu plan:</label>
              <div className="flex flex-col gap-2">
                <label className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${planSeleccionado === 'basicos' ? 'border-amber-600 bg-amber-50/20' : 'border-stone-100 bg-stone-50/50'}`}>
                  <div className="flex items-center gap-3">
                    <input type="radio" name="modal_plan" checked={planSeleccionado === 'basicos'} onChange={() => { setPlanSeleccionado('basicos'); setAgregaMusicaExtra(false); }} className="accent-amber-700" />
                    <span className="text-xs font-semibold">💍 Plan Básico Digital</span>
                  </div>
                  <span className="text-xs font-mono font-bold">$890 MXN</span>
                </label>
                <label className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${planSeleccionado === 'premium' ? 'border-amber-600 bg-amber-50/20' : 'border-stone-100 bg-stone-50/50'}`}>
                  <div className="flex items-center gap-3">
                    <input type="radio" name="modal_plan" checked={planSeleccionado === 'premium'} onChange={() => setPlanSeleccionado('premium')} className="accent-amber-700" />
                    <span className="text-xs font-semibold text-amber-950">🌟 Gran Día Premium</span>
                  </div>
                  <span className="text-xs font-mono font-bold">$1,490 MXN</span>
                </label>
                <label className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${planSeleccionado === 'vip' ? 'border-amber-600 bg-amber-50/20' : 'border-stone-100 bg-stone-50/50'}`}>
                  <div className="flex items-center gap-3">
                    <input type="radio" name="modal_plan" checked={planSeleccionado === 'vip'} onChange={() => setPlanSeleccionado('vip')} className="accent-amber-700" />
                    <span className="text-xs font-semibold text-purple-950">👑 VIP Celestial</span>
                  </div>
                  <span className="text-xs font-mono font-bold">$2,490 MXN</span>
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">2. Complementos Opcionales:</label>
              {planSeleccionado === 'basicos' ? (
                <p className="text-[10px] text-stone-400 italic bg-stone-50 p-2.5 rounded-lg border border-dashed border-stone-200">
                  ⚠️ Los extras como música personalizada no están disponibles en el Plan Básico. Suba a Premium o VIP.
                </p>
              ) : (
                <label className={`flex items-center justify-between p-3.5 rounded-xl border cursor-pointer transition-all ${agregaMusicaExtra ? 'border-emerald-600 bg-emerald-50/10' : 'border-stone-200 bg-white'}`}>
                  <div className="flex items-center gap-3">
                    <input type="checkbox" checked={agregaMusicaExtra} onChange={(e) => setAgregaMusicaExtra(e.target.checked)} className="accent-emerald-700 cursor-pointer w-4 h-4 rounded-sm" />
                    <div>
                      <span className="text-xs font-bold block text-stone-800">Música Personalizada 🎵</span>
                      <span className="text-[10px] text-stone-400 font-light block">Sube tu propio archivo .MP3 exacto.</span>
                    </div>
                  </div>
                  <span className="text-xs font-mono font-bold text-emerald-700">+$350 MXN</span>
                </label>
              )}
            </div>

            <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
              <div>
                <span className="text-[9px] uppercase tracking-wider text-stone-400 block font-semibold">Total estimado:</span>
                <span className="text-xl font-mono font-black text-stone-900">${precioTotal.toLocaleString('es-MX')} MXN</span>
              </div>
              <button type="button" onClick={handleProcederAlPago} className="bg-stone-950 hover:bg-amber-600 text-white text-xs uppercase font-bold tracking-wider px-6 py-3.5 rounded-xl shadow-md cursor-pointer">Comenzar Diseño ➔</button>
            </div>
          </div>
        </div>
      )}

      {/* 🚀 INYECCIÓN DE TUS COMPONENTES ESTRUCTURALES MAESTROS */}
      <InvitationHero weddingData={weddingData} diseño={diseño} />
      
      <EventTimeline weddingData={weddingData} diseño={diseño} />
      
      <PhotoGallery weddingData={weddingData} images={weddingData.galleryImages} diseño={diseño} />
      
      {/* 📸✨ MODAL O ACCESO AL ÁLBUM COMPARTIDO SI ESTÁ ACTIVADO EN EL PLAN PREMIUM */}
      {weddingData.albumCompartidoActivo && (
        <section className="max-w-md mx-auto px-6 py-6 text-center animate-fadeIn">
          <div className="bg-gradient-to-br from-purple-900 to-indigo-950 text-white p-6 rounded-3xl shadow-xl space-y-4 text-left border border-purple-950">
            <div className="space-y-1">
              <span className="text-[10px] bg-purple-500/30 text-purple-300 border border-purple-500/40 font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider font-mono inline-block">Función de la Fiesta</span>
              <h4 className="font-serif text-lg font-light">¿Tomaste fotos en el evento? 📸</h4>
              <p className="text-xs text-purple-200/70 font-light leading-relaxed">Súbelas directamente al álbum en vivo de los novios para que guarden cada recuerdo.</p>
            </div>
            <a 
              href={`https://clickypapel.com/${weddingData.slug}/compartir`} 
              className="w-full bg-white text-purple-950 font-bold text-center py-3 rounded-xl block text-xs uppercase tracking-wider shadow-md hover:bg-purple-50 transition-colors"
            >
              📤 Subir Fotos al Álbum Colectivo
            </a>
          </div>
        </section>
      )}

      <GiftRegistry weddingData={weddingData} diseño={diseño} />
      
      <QuoteBanner weddingData={weddingData} diseño={diseño} />
      
      <RsvpModule weddingId={weddingData.id} weddingSlug={weddingData.slug} diseño={diseño} />
      
      <footer className="text-center py-12 bg-stone-900 text-stone-500 text-xs select-none">
        Invitación digital premium creada en <span className="text-stone-300">clickypapel.com</span>
      </footer>
    </main>
  );
}