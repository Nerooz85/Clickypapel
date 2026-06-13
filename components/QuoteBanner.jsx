"use client";

export default function QuoteBanner({ weddingData, diseño }) {
  // Frases o Salmos curados por estilo para darle personalidad a cada demo
  const frasesPorEstilo = {
    'romantico-clasico': {
      texto: "«Por encima de todo, vístanse de amor, que es el vínculo perfecto.»",
      autor: "Colosenses 3:14",
      bgEstilo: "bg-stone-100/50 border-y border-stone-200/60"
    },
    'minimal-dark': {
      texto: "«TODAVÍA CREO EN LOS MILAGROS, PORQUE TE ENCONTRÉ A TI.»",
      autor: "E.S.",
      bgEstilo: "bg-zinc-900/20 border-y border-zinc-900"
    },
    'boho-rancho': {
      texto: "«Donde tú vayas, yo iré; donde tú vivas, yo viviré. Tu pueblo será mi pueblo y tu Dios será mi Dios.»",
      autor: "Rut 1:16",
      bgEstilo: "bg-[#faf7f2] border-y border-amber-900/5"
    }
  };

  const config = frasesPorEstilo[diseño.id] || frasesPorEstilo['romantico-clasico'];

  // Si los novios en el Dashboard escribieron una Frase de Bienvenida muy larga o específica, 
  // podemos usar esa misma para personalizar el banner, o dejar los Salmos fijos por defecto.
  const textoFinal = weddingData?.welcomePhrase && weddingData.welcomePhrase.length < 150
    ? `«${weddingData.welcomePhrase}»`
    : config.texto;

  const autorFinal = weddingData?.welcomePhrase && weddingData.welcomePhrase.length < 150 
    ? "" 
    : config.autor;

  return (
    <section className={`py-24 px-6 my-8 text-center transition-all duration-500 ${config.bgEstilo}`}>
      <div className="max-w-xl mx-auto space-y-4">
        {/* Adorno sutil arriba */}
        <span className="text-xl opacity-40 block">✦</span>
        
        <p className={`text-lg md:text-xl leading-relaxed tracking-wide ${diseño.fuenteTitulo} opacity-90`}>
          {textoFinal}
        </p>
        
        {autorFinal && (
          <span className={`text-[10px] uppercase tracking-widest font-bold block opacity-40 ${
            diseño.id === 'minimal-dark' ? 'font-sans' : 'font-serif italic'
          }`}>
            — {autorFinal}
          </span>
        )}
      </div>
    </section>
  );
}