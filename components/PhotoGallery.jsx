"use client";
import Image from 'next/image';

export default function PhotoGallery({ weddingData }) {
  // 📸 Jalamos el arreglo real de Supabase (galleryImages)
  const imagenesReales = weddingData?.galleryImages || [];

  // Clases predefinidas para mantener el hermoso grid editorial asimétrico
  const clasesGrid = [
    "col-span-2 row-span-2", // Foto 1 (Grande)
    "col-span-1 row-span-1", // Foto 2
    "col-span-1 row-span-1", // Foto 3
    "col-span-1 row-span-2", // Foto 4 (Larga)
    "col-span-1 row-span-1", // Foto 5
    "col-span-1 row-span-1", // Foto 6 (Por si agregas otra)
  ];

  // Si hay fotos en Supabase, las mapeamos con su clase correspondiente; si no, dejamos placeholders
  const photos = imagenesReales.length > 0 
    ? imagenesReales.map((url, index) => ({
        src: url,
        alt: `Sesión de novios ${index + 1}`,
        gridClass: clasesGrid[index] || "col-span-1 row-span-1" // Clase por defecto si hay más de 5
      }))
    : [
        { src: "/placeholder-boda-1.jpg", alt: "Sesión 1", gridClass: "col-span-2 row-span-2" },
        { src: "/placeholder-boda-2.jpg", alt: "Sesión 2", gridClass: "col-span-1 row-span-1" },
        { src: "/placeholder-boda-3.jpg", alt: "Sesión 3", gridClass: "col-span-1 row-span-1" },
        { src: "/placeholder-boda-4.jpg", alt: "Sesión 4", gridClass: "col-span-1 row-span-2" },
        { src: "/placeholder-boda-5.jpg", alt: "Sesión 5", gridClass: "col-span-1 row-span-1" },
      ];

  return (
    <section className="py-20 px-4 bg-[var(--arena)] rounded-[2rem]">
      <div className="max-w-2xl mx-auto text-center">
        <span className="etiqueta text-[var(--cafe)] block mb-3">
          Nuestra Historia
        </span>
        <h2 className="font-display text-4xl font-light text-[var(--tinta)] mb-3">Galería de Momentos</h2>
        <div className="oro-linea w-24 mx-auto mb-10" aria-hidden="true" />

        {/* Grid estilo editorial / asimétrico premium */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 auto-rows-[150px]">
          {photos.map((photo, index) => (
            <div 
              key={index} 
              className={`tarjeta-foto relative rounded-2xl overflow-hidden shadow-[0_10px_30px_-12px_rgba(67,48,43,0.3)] group border border-[var(--terracota)]/25 ${photo.gridClass}`}
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="(max-w-768px) 100vw, 50vw"
                className="object-cover"
                priority={index === 0} // Prioriza la carga de la primera imagen
              />
              {/* Efecto hover elegante */}
              <div className="absolute inset-0 bg-[var(--tinta)]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}