"use client";
import { useParams, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase'; 
import InvitationHero from '@/components/InvitationHero';
import EventTimeline from '@/components/EventTimeline';
import PhotoGallery from '@/components/PhotoGallery';
import GiftRegistry from '@/components/GiftRegistry';
import RsvpModule from '@/components/RsvpModule';

export default function WeddingInvitationPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  
  // Detectamos si en la URL viene el parámetro ?demo=true (ej: clickypapel.com/bruno-y-brisa?demo=true)
  const esModoDemo = searchParams.get('demo') === 'true' || true; // Puesto en true por defecto para tus pruebas

  const slug = params?.weddingSlug || params?.slug;

  const [weddingData, setWeddingData] = useState(null);
  const [cargando, setCargando] = useState(true);

  // 🎨 Estado local para cambiar el diseño en vivo si es una demo de ClickyPapel
  const [templateActivo, setTemplateActivo] = useState('romantico-clasico');

  useEffect(() => {
    async function jalarDatosBoda() {
      if (!slug) {
        setCargando(false);
        return;
      }

      setCargando(true);
      const slugLimpio = slug.toLowerCase();

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
          mesaRegalos: {
            bankDetails: { banco: data.banco, titular: data.titular, clabe: data.clabe },
            registries: [
              ...(data.amazon_url ? [{ name: "Amazon", url: data.amazon_url, logo: "📦" }] : []),
              ...(data.liverpool_url ? [{ name: "Liverpool", url: data.liverpool_url, logo: "🛍️" }] : [])
            ]
          }
        });

        // Inicializamos el diseño con el que viene de la base de datos
        setTemplateActivo(data.template_id || 'romantico-clasico');
      }
      setCargando(false);
    }

    jalarDatosBoda();
  }, [slug, params]);

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

  // 🛠️ DICCIONARIO DE ESTILOS VISUALES PARA TUS DEMOS
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

  // El diseño activo ahora depende de lo que el usuario pulse en la barra flotante
  const diseño = estilosPorTemplate[templateActivo] || estilosPorTemplate['romantico-clasico'];

  return (
    <main className={`min-h-screen overflow-x-hidden transition-colors duration-500 relative ${diseño.bgGlobal}`}>
      
      {/* 🔮 CONTROLADOR FLOTANTE INTERACTIVO EXCLUSIVO PARA TUS INTERNAUTAS */}
      {esModoDemo && (
        <div className="fixed bottom-6 right-6 z-[100] bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-stone-200 max-w-xs space-y-2 animate-bounce-short">
          <div className="text-left">
            <span className="text-[9px] bg-amber-100 text-amber-800 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Demo Interactiva</span>
            <h4 className="text-xs font-semibold text-stone-900 font-sans mt-1">¡Prueba otro diseño en vivo!</h4>
          </div>
          <div className="flex flex-col gap-1.5 pt-1">
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

      <audio id="bg-boda-audio" src={weddingData.musicUrl} loop />

      {/* Secciones Dinámicas */}
      <InvitationHero weddingData={weddingData} diseño={diseño} />
      <EventTimeline weddingData={weddingData} diseño={diseño} />
      <PhotoGallery weddingData={weddingData} images={weddingData.galleryImages} diseño={diseño} />
      <GiftRegistry weddingData={weddingData} diseño={diseño} />
      <RsvpModule weddingId={weddingData.id} weddingSlug={weddingData.slug} diseño={diseño} />
      
      <footer className="text-center py-12 bg-stone-900 text-stone-500 text-xs">
        Invitación digital premium creada en <span className="text-stone-300">clickypapel.com</span>
      </footer>
    </main>
  );
}