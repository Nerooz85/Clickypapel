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

  // 3. Vista final si todo se encuentra en orden
  return (
    <main className="min-h-screen bg-stone-50 overflow-x-hidden">
      <InvitationHero weddingData={weddingData} />
      <EventTimeline weddingData={weddingData} />
      
      {/* 🚀 Cambiado para pasar las imágenes reales a tu componente de Galería */}
      <PhotoGallery weddingData={weddingData} images={weddingData.galleryImages} />
      
      <GiftRegistry weddingData={weddingData} />
      
      {/* 🛠️ Le pasamos ambas propiedades para que tu componente RSVP tenga de dónde elegir y no truene */}
      <RsvpModule 
        weddingId={weddingData.id} 
        weddingSlug={weddingData.slug} 
      />
      
      <footer className="text-center py-12 bg-stone-900 text-stone-500 text-xs">
        Invitación digital premium creada en <span className="text-stone-300">clickypapel.com</span>
      </footer>
    </main>
  );
}