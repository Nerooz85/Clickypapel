"use client";
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase'; 
import InvitationHero from '@/components/InvitationHero';
import EventTimeline from '@/components/EventTimeline';
import PhotoGallery from '@/components/PhotoGallery';
import GiftRegistry from '@/components/GiftRegistry';
import RsvpModule from '@/components/RsvpModule';

export default function WeddingInvitationPage() {
  const params = useParams();
  
  // Forzamos la lectura exacta del parámetro que coincide con tu carpeta [weddingSlug]
  const slug = params?.weddingSlug || params?.slug;

  const [weddingData, setWeddingData] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    // Diagnóstico en consola para monitorear el comportamiento en vivo
    console.log("Parámetros detectados en URL:", params);
    console.log("Buscando en Supabase el slug:", slug);

    async function jalarDatosBoda() {
      if (!slug) {
        setCargando(false);
        return;
      }

      setCargando(true);
      
      // 🔒 Forzamos minúsculas para que no importe si en la URL escriben "Abiel-y-Debanhi" o "abiel-y-debanhi"
      const slugLimpio = slug.toLowerCase();

      const { data, error } = await supabase
        .from('bodas')
        .select('*')
        .eq('slug', slugLimpio)
        .maybeSingle(); // 🚀 Cambiado a maybeSingle() para solucionar el error 406 de objeto JSON

      if (error) {
        console.error("Error de Supabase:", error.message);
        setWeddingData(null);
      } else if (!data) {
        console.warn("No se encontró ningún registro para el slug:", slugLimpio);
        setWeddingData(null);
      } else {
        setWeddingData({
          id: data.id, // 🆔 Guardamos el ID real de la base de datos (ej. 11)
          slug: data.slug, // 🔗 Guardamos el slug oficial
          templateId: data.template_id || 'romantico-clasico', // 🎨 Jalamos el estilo visual de Supabase
          groomName: data.groom_name,
          brideName: data.bride_name,
          eventDate: data.event_date || "2026-12-19T18:00:00", 
          // 📸 Usa la foto de portada guardada en Supabase; si no hay, usa una elegante por defecto
          coverImage: data.cover_image || "https://images.unsplash.com/photo-1519741497674-611481863552", 
          // 🖼️ Arreglo dinámico de la galería
          galleryImages: data.gallery_images || [],
          welcomePhrase: data.welcome_phrase,
          ceremoniaHora: data.ceremonia_hora,
          ceremoniaLugar: data.ceremonia_lugar,
          ceremoniaMapsUrl: data.ceremonia_maps_url,
          recepcionHora: data.recepcion_hora,
          recepcionLugar: data.recepcion_lugar,
          recepcionMapsUrl: data.recepcion_maps_url,
          codigoVestimenta: data.codigo_vestimenta,
          
          // 🎵 Jalamos los campos de música que guardamos en el Dashboard
          musicType: data.music_type || 'default',
          musicUrl: data.music_url || '/music/1-thousand-years.mp3',

          mesaRegalos: {
            bankDetails: {
              banco: data.banco,
              titular: data.titular,
              clabe: data.clabe
            },
            registries: [
              ...(data.amazon_url ? [{ name: "Amazon", url: data.amazon_url, logo: "📦" }] : []),
              ...(data.liverpool_url ? [{ name: "Liverpool", url: data.liverpool_url, logo: "🛍️" }] : [])
            ]
          }
        });
      }
      setCargando(false);
    }

    jalarDatosBoda();
  }, [slug, params]);

  // 1. Pantalla de carga mientras consulta a la base de datos
  if (cargando) {
    return (
      <div className="min-h-screen bg-[#faf9f6] flex items-center justify-center font-serif text-stone-500 animate-pulse text-sm tracking-widest uppercase">
        Abriendo la experiencia... ✨
      </div>
    );
  }

  // 2. Si el slug no existe en la base de datos
  if (!weddingData) {
    return (
      <div className="min-h-screen bg-[#faf9f6] flex flex-col items-center justify-center font-sans text-center p-6 space-y-4">
        <h1 className="font-serif text-2xl text-stone-800 font-light">Invitación No Encontrada</h1>
        <p className="text-stone-400 text-sm font-light max-w-xs">El enlace al que intentas acceder no existe o fue desactivado.</p>
        <p className="text-[11px] text-stone-300 font-mono bg-stone-100 px-3 py-1 rounded-sm">Buscando el slug: "{slug?.toLowerCase() || 'indefinido'}"</p>
        <a href="https://clickypapel.com" className="text-xs bg-stone-900 text-white px-5 py-2.5 rounded-full uppercase tracking-wider mt-2">Ir a Inicio</a>
      </div>
    );
  }

  // 🛠️ 3. DICCIONARIO DE ESTILOS VISUALES PARA TUS DEMOS
  // Puedes usar estas variables dentro de tus componentes hijos si quieres cambiar fuentes, fondos o botones
  const estilosPorTemplate = {
    'romantico-clasico': {
      id: 'romantico-clasico',
      bgGlobal: 'bg-[#faf9f6] text-stone-800',
      fuenteTitulo: 'font-serif text-stone-900',
      colorCard: 'bg-white',
      botonAcento: 'bg-amber-700 hover:bg-amber-800 text-white'
    },
    'minimal-dark': {
      id: 'minimal-dark',
      bgGlobal: 'bg-zinc-950 text-zinc-100 selection:bg-zinc-800',
      fuenteTitulo: 'font-sans tracking-widest text-white uppercase font-light',
      colorCard: 'bg-zinc-900/50 border border-zinc-800',
      botonAcento: 'bg-white text-zinc-950 hover:bg-zinc-200'
    },
    'boho-rancho': {
      id: 'boho-rancho',
      bgGlobal: 'bg-[#f4efe6] text-amber-950',
      fuenteTitulo: 'font-serif italic text-amber-900 font-normal',
      colorCard: 'bg-[#fbf9f4] border border-stone-200',
      botonAcento: 'bg-emerald-800 hover:bg-emerald-950 text-white'
    }
  };

  // Si la base de datos trae un estilo que no tenemos, usamos el tradicional por defecto
  const diseño = estilosPorTemplate[weddingData.templateId] || estilosPorTemplate['romantico-clasico'];

  // 4. Vista final si todo se encuentra en orden
  return (
    <main className={`min-h-screen overflow-x-hidden transition-colors duration-500 ${diseño.bgGlobal}`}>
      
      {/* 🎵 El audio se vuelve dinámico y reproduce el track guardado de la boda */}
      <audio id="bg-boda-audio" src={weddingData.musicUrl} loop />

      {/* 🎨 Le inyectamos el objeto "diseño" a cada sección para modular los colores y fuentes */}
      <InvitationHero weddingData={weddingData} diseño={diseño} />
      <EventTimeline weddingData={weddingData} diseño={diseño} />
      
      {/* 🚀 Pasamos las imágenes reales a tu componente de Galería */}
      <PhotoGallery weddingData={weddingData} images={weddingData.galleryImages} diseño={diseño} />
      
      <GiftRegistry weddingData={weddingData} diseño={diseño} />
      
      {/* 🛠️ Módulo RSVP seguro con ID y Slug */}
      <RsvpModule 
        weddingId={weddingData.id} 
        weddingSlug={weddingData.slug} 
        diseño={diseño}
      />
      
      <footer className="text-center py-12 bg-stone-900 text-stone-500 text-xs">
        Invitación digital premium creada en <span className="text-stone-300">clickypapel.com</span>
      </footer>
    </main>
  );
}