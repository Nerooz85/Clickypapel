// components/PhotoGallery.jsx
import Image from 'next/image';

export default function PhotoGallery({ weddingData }) {
  // Array de fotos guardadas en el Storage (Supabase/Firebase) de la sesión de novios
  const photos = weddingData.galeriaFotos || [
    { src: "/placeholder-boda-1.jpg", alt: "Sesión de novios 1", gridClass: "col-span-2 row-span-2" },
    { src: "/placeholder-boda-2.jpg", alt: "Sesión de novios 2", gridClass: "col-span-1 row-span-1" },
    { src: "/placeholder-boda-3.jpg", alt: "Sesión de novios 3", gridClass: "col-span-1 row-span-1" },
    { src: "/placeholder-boda-4.jpg", alt: "Sesión de novios 4", gridClass: "col-span-1 row-span-2" },
    { src: "/placeholder-boda-5.jpg", alt: "Sesión de novios 5", gridClass: "col-span-1 row-span-1" },
  ];

  return (
    <section className="py-16 px-4 bg-stone-50">
      <div className="max-w-2xl mx-auto text-center">
        <span className="font-serif text-amber-600/80 tracking-widest text-xs uppercase block mb-2">
          Nuestra Historia
        </span>
        <h2 className="text-3xl font-serif text-stone-800 mb-10">Galería de Momentos</h2>

        {/* Grid estilo editorial / asimétrico premium */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 auto-rows-[150px]">
          {photos.map((photo, index) => (
            <div 
              key={index} 
              className={`relative rounded-xl overflow-hidden shadow-xs group border border-stone-200/50 ${photo.gridClass}`}
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="(max-w-768px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                priority={index === 0} // Prioriza la carga de la primera imagen
              />
              {/* Efecto hover elegante */}
              <div className="absolute inset-0 bg-stone-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}