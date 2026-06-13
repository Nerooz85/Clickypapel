"use client";

export default function QuoteBanner({ weddingData, diseño }) {
  const configuraciónPorEstilo = {
    'romantico-clasico': {
      texto: "«Por encima de todo, vístanse de amor, que es el vínculo perfecto.»",
      autor: "Colosenses 3:14",
      overlay: "bg-white/85 backdrop-blur-xs",
      textColor: "text-stone-800"
    },
    'minimal-dark': {
      texto: "«TODAVÍA CREO EN LOS MILAGROS, PORQUE TE ENCONTRÉ A TI.»",
      autor: "E.S.",
      overlay: "bg-zinc-950/80 backdrop-blur-xs",
      textColor: "text-zinc-100"
    },
    'boho-rancho': {
      texto: "«Donde tú vayas, yo iré; donde tú vivas, yo viviré. Tu pueblo será mi pueblo y tu Dios será mi Dios.»",
      autor: "Rut 1:16",
      overlay: "bg-[#f4efe6]/85 backdrop-blur-xs",
      textColor: "text-amber-950"
    }
  };

  const config = configuraciónPorEstilo[diseño.id] || configuraciónPorEstilo['romantico-clasico'];

  const textoFinal = weddingData?.welcomePhrase && weddingData.welcomePhrase.length < 150
    ? `«${weddingData.welcomePhrase}»`
    : config.texto;

  const autorFinal = weddingData?.welcomePhrase && weddingData.welcomePhrase.length < 150 
    ? "" 
    : config.autor;

  const imagenFondo = weddingData?.coverImage || "https://images.unsplash.com/photo-1519741497674-611481863552";

  return (
    <section 
      className="w-full py-32 px-6 bg-cover bg-center bg-no-repeat overflow-hidden border-y border-stone-200/10 shadow-xs transition-all duration-500 block"
      style={{ backgroundImage: `url('${imagenFondo}')` }}
    >
      <div className={`absolute inset-0 transition-all duration-500 ${config.overlay}`} />

      <div className="relative max-w-xl mx-auto space-y-5 z-10 text-center">
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