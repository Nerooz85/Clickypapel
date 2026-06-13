"use client";

export default function QuoteBanner({ weddingData, diseño }) {
  // Configuración de Frases, Salmos e Imágenes de Fondo según el estilo seleccionado
  const configuraciónPorEstilo = {
    'romantico-clasico': {
      texto: "«Por encima de todo, vístanse de amor, que es el vínculo perfecto.»",
      autor: "Colosenses 3:14",
      bgImage: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=1200&auto=format&fit=crop", // Flores/textura fina y clara
      overlay: "bg-white/85", // Capa clara para asegurar legibilidad
      textColor: "text-stone-800"
    },
    'minimal-dark': {
      texto: "«TODAVÍA CREO EN LOS MILAGROS, PORQUE TE ENCONTRÉ A TI.»",
      autor: "E.S.",
      bgImage: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1200&auto=format&fit=crop", // Pareja elegante B&N
      overlay: "bg-zinc-950/80", // Capa oscura premium
      textColor: "text-zinc-100"
    },
    'boho-rancho': {
      texto: "«Donde tú vayas, yo iré; donde tú vivas, yo viviré. Tu pueblo será mi pueblo y tu Dios será mi Dios.»",
      autor: "Rut 1:16",
      bgImage: "https://images.unsplash.com/photo-1507504038482-762143431056?q=80&w=1200&auto=format&fit=crop", // Atardecer de campo/pasto dorado
      overlay: "bg-[#f4efe6]/85", // Capa cálida beige
      textColor: "text-amber-950"
    }
  };

  const config = configuraciónPorEstilo[diseño.id] || configuraciónPorEstilo['romantico-clasico'];

  // Validamos si usamos la frase personalizada corta del dashboard o los salmos de catálogo
  const textoFinal = weddingData?.welcomePhrase && weddingData.welcomePhrase.length < 150
    ? `«${weddingData.welcomePhrase}»`
    : config.texto;

  const autorFinal = weddingData?.welcomePhrase && weddingData.welcomePhrase.length < 150 
    ? "" 
    : config.autor;

  return (
    <section 
      className="relative py-32 px-6 my-12 bg-cover bg-center bg-no-attachment bg-no-repeat overflow-hidden border-y border-stone-200/20 shadow-xs transition-all duration-500"
      style={{ backgroundImage: `url('${config.bgImage}')` }}
    >
      {/* 🎨 Capa de color traslúcida (Overlay) para que el texto resalte y no se pierda con la foto */}
      <div className={`absolute inset-0 transition-colors duration-500 ${config.overlay}`} />

      {/* Contenido de la Frase */}
      <div className="relative max-w-xl mx-auto space-y-5 z-10">
        {/* Un adorno sutil flotando */}
        <span className={`text-xl opacity-40 block ${config.textColor}`}>✦</span>
        
        <p className={`text-xl md:text-2xl leading-relaxed tracking-wide font-medium ${diseño.fuenteTitulo} ${config.textColor}`}>
          {textoFinal}
        </p>
        
        {autorFinal && (
          <span className={`text-[10px] uppercase tracking-widest font-bold block opacity-50 ${config.textColor} ${
            diseño.id === 'minimal-dark' ? 'font-sans' : 'font-serif italic'
          }`}>
            — {autorFinal}
          </span>
        )}
      </div>
    </section>
  );
}