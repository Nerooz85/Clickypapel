"use client";
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase'; // IMPORTAMOS TU CONEXIÓN DE SUPABASE
import InvitationHero from '@/components/InvitationHero';
import EventTimeline from '@/components/EventTimeline';
import PhotoGallery from '@/components/PhotoGallery';
import GiftRegistry from '@/components/GiftRegistry';
import RsvpModule from '@/components/RsvpModule';

export default function WeddingInvitationPage() {
  const params = useParams();
  // Capturamos el slug de la URL. (Nota: Si tu carpeta se llama [slug], usa 'slug', si se llama [weddingSlug], déjalo como 'weddingSlug')
  const slug = params.slug || params.weddingSlug;

  const [weddingData, setWeddingData] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    async function jalarDatosBoda() {
      if (!slug) return;

      setCargando(true);
      const { data, error } = await supabase
        .from('bodas')
        .select('*')
        .eq('slug', slug)
        .single(); // Trae la boda que coincida con la URL

      if (error || !data) {
        console.error("No se encontró la boda o hubo un error:", error?.message);
        setWeddingData(null);
      } else {
        // Modelamos los datos que vienen de Supabase para que encajen EXACTAMENTE con tus componentes actuales
        setWeddingData({
          groomName: data.groom_name,
          brideName: data.bride_name,
          eventDate: data.event_date || "2026-12-19T18:00:00", // Si no hay fecha, usa una por defecto
          coverImage: "https://images.unsplash.com/photo-1519741497674-611481863552", // Puedes hacer este campo dinámico después
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
  }, [slug]);

  // 1. Pantalla de carga elegante mientras consulta a Supabase
  if (cargando) {
    return (
      <div className="min-h-screen bg-[#faf9f6] flex items-center justify-center font-serif text-stone-500 animate-pulse text-sm tracking-widest uppercase">
        Abriendo la experiencia... ✨
      </div>
    );
  }

  // 2. Si la URL no existe en la base de datos, mostramos un error limpio
  if (!weddingData) {
    return (
      <div className="min-h-screen bg-[#faf9f6] flex flex-col items-center justify-center font-sans text-center p-6 space-y-4">
        <h1 className="font-serif text-2xl text-stone-800 font-light">Invitación No Encontrada</h1>
        <p className="text-stone-400 text-sm font-light max-w-xs">El enlace al que intentas acceder no existe o fue desactivado.</p>
        <a href="https://clickypapel.com" className="text-xs bg-stone-900 text-white px-5 py-2.5 rounded-full uppercase tracking-wider">Ir a Inicio</a>
      </div>
    );
  }

  // 3. Si todo está bien, pintamos tus hermosos componentes con los datos REALES
  return (
    <main className="min-h-screen bg-stone-50 overflow-x-hidden">
      {/* 1. Portada y Cuenta Regresiva */}
      <InvitationHero weddingData={weddingData} />
      
      {/* 2. Itinerario y Mapas */}
      <EventTimeline weddingData={weddingData} />
      
      {/* 3. Galería de Fotos */}
      <PhotoGallery weddingData={weddingData} />
      
      {/* 4. Mesa de Regalos */}
      <GiftRegistry weddingData={weddingData} />
      
      {/* 5. Módulo RSVP inteligente (le pasamos el slug real para registrar los invitados de esta boda) */}
      <RsvpModule weddingId={slug} />
      
      <footer className="text-center py-12 bg-stone-900 text-stone-500 text-xs">
        Invitación digital premium creada en <span className="text-stone-300">clickypapel.com</span>
      </footer>
    </main>
  );
}