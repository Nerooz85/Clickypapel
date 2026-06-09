"use client";
import Link from 'next/link';
import Image from 'next/image';

export default function ClickyPapelHome() {
  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-800 selection:bg-amber-100">
      
      {/* 1. MENÚ DE NAVEGACIÓN (NAVBAR) */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-stone-100 z-50 px-6 py-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          {/* Logo de la marca */}
          <Link href="/" className="font-serif text-2xl tracking-wide text-stone-900 font-light">
            clicky<span className="font-normal text-amber-700">papel</span>
          </Link>
          
          {/* Enlaces rápidos */}
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-stone-600">
            <a href="#concept" className="hover:text-stone-900 transition-colors">El Concepto</a>
            <a href="#templates" className="hover:text-stone-900 transition-colors">Plantillas</a>
            <a href="#pricing" className="hover:text-stone-900 transition-colors">Precios</a>
          </div>

          {/* Botón de llamado a la acción */}
          <Link 
            href="/dashboard" 
            className="bg-stone-900 hover:bg-stone-800 text-white text-xs font-medium px-5 py-2.5 rounded-full transition-all tracking-wide shadow-xs"
          >
            Crear Invitación
          </Link>
        </div>
      </nav>

      {/* 2. HERO SECTION (LA PRIMERA IMPRESIÓN EMOCIONAL) */}
      <header className="relative pt-32 pb-20 md:pt-44 md:pb-32 px-6 overflow-hidden bg-gradient-to-b from-stone-100 via-stone-50 to-white">
        <div className="max-w-4xl mx-auto text-center space-y-6 relative z-10">
          <span className="text-xs uppercase tracking-widest text-amber-700/80 font-semibold bg-amber-50 px-3 py-1 rounded-full border border-amber-200/40 inline-block">
            Innovación y Tradición para tu Boda
          </span>
          
          <h1 className="text-4xl md:text-6xl font-serif font-light text-stone-900 leading-tight md:leading-none tracking-tight">
            La antesala del día más <br className="hidden md:block"/>
            <span className="italic font-normal text-stone-800">importante de sus vidas.</span>
          </h1>
          
          <p className="text-stone-500 font-light text-base md:text-lg max-w-xl mx-auto leading-relaxed">
            Invitaciones digitales interactivas premium y papelería fina a juego. Automatiza tus confirmaciones sin perder la elegancia tradicional.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row justify-center items-center gap-4">
            <a 
              href="#concept" 
              className="w-full sm:w-auto bg-stone-900 hover:bg-stone-800 text-white font-medium text-sm px-8 py-3.5 rounded-xl transition-colors shadow-sm text-center"
            >
              Descubrir el concepto
            </a>
            <Link 
              href="/Abiel-y-Debanhi" 
              target="_blank"
              className="w-full sm:w-auto bg-white hover:bg-stone-50 text-stone-700 font-medium text-sm px-8 py-3.5 rounded-xl border border-stone-200 transition-colors text-center shadow-xs"
            >
              ✨ Ver demo en vivo
            </Link>
          </div>
        </div>

        {/* Círculos decorativos sutiles de fondo */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-100/30 rounded-full blur-3xl z-0 pointer-events-none" />
      </header>

      {/* 3. SECCIÓN EL CONCEPTO (CLICK + PAPEL) */}
      <section id="concept" className="py-20 px-6 bg-white border-t border-stone-100">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          
          {/* Bloque de Texto de Marketing */}
          <div className="space-y-6">
            <span className="font-serif text-amber-700 font-medium italic block text-lg">
              ¿Por qué ClickyPapel?
            </span>
            <h2 className="text-3xl md:text-4xl font-serif font-light text-stone-900 leading-snug">
              Uniendo la comodidad digital con el tacto del papel de lujo.
            </h2>
            <p className="text-stone-500 font-light text-sm md:text-base leading-relaxed">
              Sabemos que organizar una boda es estresante. Los invitados tradicionales prefieren un pase físico, mientras que tú necesitas controlar los pases para evitar colados y gestionar alergias de comida. 
            </p>
            
            {/* Los dos pilares en lista */}
            <div className="space-y-4 pt-2">
              <div className="flex gap-4">
                <span className="flex-none w-10 h-10 bg-amber-50 border border-amber-200/50 text-amber-700 rounded-lg flex items-center justify-center font-medium">🖱️</span>
                <div>
                  <h4 className="font-medium text-stone-800 text-sm md:text-base">El Click (Digital Interactivo)</h4>
                  <p className="text-stone-400 font-light text-xs md:text-sm">Tus invitados confirman por nombre en segundos desde su celular en <span className="text-stone-500 font-mono">tugrandia.icu</span>. Cuentas con mapas y mesa de regalos.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <span className="flex-none w-10 h-10 bg-stone-100 text-stone-700 rounded-lg flex items-center justify-center font-medium">✉️</span>
                <div>
                  <h4 className="font-medium text-stone-800 text-sm md:text-base">El Papel (Tradición Premium)</h4>
                  <p className="text-stone-400 font-light text-xs md:text-sm">Te enviamos a domicilio tarjetas físicas finas con un código QR estilizado. Perfecto para entregar en mano a tus familiares más especiales.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Representación Visual / Grid de Imagen decorativo */}
          <div className="relative h-[350px] md:h-[450px] bg-stone-100 rounded-3xl overflow-hidden shadow-xs border border-stone-200/60">
            <Image 
              src="https://images.unsplash.com/photo-1607190074257-dd4b7af0309f" 
              alt="Papelería de boda fina e invitaciones"
              fill
              className="object-cover opacity-90"
              sizes="(max-w-768px) 100vw, 50vw"
            />
            {/* Overlay elegante */}
            <div className="absolute inset-0 bg-linear-to-t from-stone-900/40 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 text-white">
              <p className="font-serif text-lg italic">El balance perfecto para tu evento.</p>
            </div>
          </div>

        </div>
      </section>

      {/* Footer corporativo básico */}
      <footer className="bg-stone-50 border-t border-stone-100 py-8 text-center text-xs text-stone-400 font-light">
        © 2026 clickypapel.com - Todos los derechos reservados.
      </footer>

    </div>
  );
}