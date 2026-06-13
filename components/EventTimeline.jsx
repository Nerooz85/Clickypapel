"use client";

export default function EventTimeline({ weddingData, diseño }) {
  // Clases dinámicas para las tarjetas de logística según el diseño
  const cardStyle = diseño.id === 'minimal-dark' 
    ? 'bg-zinc-950/40 border-zinc-800 text-zinc-300' 
    : diseño.id === 'boho-rancho'
    ? 'bg-[#faf7f2] border-amber-900/10 text-amber-950'
    : 'bg-white border-stone-200 text-stone-700';

  const labelStyle = diseño.id === 'minimal-dark' ? 'text-zinc-500' : 'text-stone-400';

  return (
    <section className="py-20 px-4 max-w-4xl mx-auto space-y-12">
      <div className="text-center space-y-2">
        <span className={`text-[10px] uppercase tracking-widest font-semibold ${diseño.id === 'minimal-dark' ? 'text-zinc-500' : 'text-amber-700'}`}>
          Logística del Evento
        </span>
        <h2 className={`text-3xl ${diseño.fuenteTitulo}`}>Horarios y Ubicaciones</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* TARJETA CEREMONIA */}
        <div className={`p-8 rounded-3xl border shadow-xs space-y-4 transition-colors duration-500 ${cardStyle}`}>
          <div className="space-y-1">
            <span className="text-2xl block">⛪</span>
            <h3 className={`text-xl ${diseño.fuenteTitulo}`}>Ceremonia Religiosa</h3>
          </div>
          <div className="text-xs space-y-2 font-light">
            <p><strong className="font-semibold">Hora:</strong> {weddingData.ceremoniaHora || "17:00 HRS"}</p>
            <p><strong className="font-semibold">Lugar:</strong> {weddingData.ceremoniaLugar || "Templo del Evento"}</p>
          </div>
          {weddingData.ceremoniaMapsUrl && (
            <a 
              href={weddingData.ceremoniaMapsUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className={`inline-block w-full text-center py-2.5 rounded-xl text-xs uppercase tracking-wider font-semibold transition-all ${diseño.botonAcento}`}
            >
              📍 Ver Mapa GPS
            </a>
          )}
        </div>

        {/* TARJETA RECEPCIÓN */}
        <div className={`p-8 rounded-3xl border shadow-xs space-y-4 transition-colors duration-500 ${cardStyle}`}>
          <div className="space-y-1">
            <span className="text-2xl block">🥂</span>
            <h3 className={`text-xl ${diseño.fuenteTitulo}`}>Recepción / Fiesta</h3>
          </div>
          <div className="text-xs space-y-2 font-light">
            <p><strong className="font-semibold">Hora:</strong> {weddingData.recepcionHora || "19:30 HRS"}</p>
            <p><strong className="font-semibold">Lugar:</strong> {weddingData.recepcionLugar || "Salón de Eventos"}</p>
          </div>
          {weddingData.recepcionMapsUrl && (
            <a 
              href={weddingData.recepcionMapsUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className={`inline-block w-full text-center py-2.5 rounded-xl text-xs uppercase tracking-wider font-semibold transition-all ${diseño.botonAcento}`}
            >
              📍 Ver Mapa GPS
            </a>
          )}
        </div>
      </div>

      {/* CÓDIGO DE VESTIMENTA */}
      <div className={`p-6 rounded-2xl text-center border max-w-sm mx-auto transition-colors duration-500 ${cardStyle}`}>
        <span className={`text-[10px] uppercase tracking-widest font-bold block mb-1 ${labelStyle}`}>Código de Vestimenta</span>
        <p className="text-sm font-medium tracking-wide">✨ {weddingData.codigoVestimenta || "Formal / Gala"}</p>
      </div>
    </section>
  );
}