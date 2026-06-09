"use client";
import { useParams } from 'next/navigation';
import InvitationHero from '@/components/InvitationHero';
import EventTimeline from '@/components/EventTimeline';
import PhotoGallery from '@/components/PhotoGallery';
import GiftRegistry from '@/components/GiftRegistry';
import RsvpModule from '@/components/RsvpModule';

export default function WeddingInvitationPage() {
  const params = useParams();
  const { weddingSlug } = params;

  // Simulando los datos que vendrían de tu base de datos para este slug
  const weddingData = {
    groomName: "Abiel",
    brideName: "Debanhi",
    eventDate: "2026-12-19T18:00:00", // Cambia esto por la fecha real de la boda
    coverImage: "https://images.unsplash.com/photo-1519741497674-611481863552", // URL de foto de novios
    welcomePhrase: "El amor todo lo cree, todo lo espera, todo lo soporta. Decidimos unir nuestras vidas para siempre.",
    ceremoniaHora: "17:00 HRS",
    ceremoniaLugar: "Parroquia de San Pedro",
    ceremoniaMapsUrl: "https://maps.google.com",
    recepcionHora: "19:30 HRS",
    recepcionLugar: "Jardín de Eventos Premium",
    recepcionMapsUrl: "https://maps.google.com",
    codigoVestimenta: "Formal / Gala",
    mesaRegalos: {
      bankDetails: {
        banco: "BBVA",
        titular: "Abiel y Debanhi",
        clabe: "0123 4567 8901 2345 67"
      },
      registries: [
        { name: "Amazon", url: "https://amazon.com", logo: "📦" },
        { name: "Liverpool", url: "https://liverpool.com.mx", logo: "🛍️" }
      ]
    }
  };

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
      
      {/* 5. Módulo RSVP inteligente */}
      <RsvpModule weddingId={weddingSlug} />
      
      <footer className="text-center py-12 bg-stone-900 text-stone-500 text-xs">
        Invitación digital premium creada en <span className="text-stone-300">tugrandia.icu</span>
      </footer>
    </main>
  );
}