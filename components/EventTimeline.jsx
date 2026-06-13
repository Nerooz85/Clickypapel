"use client";

export default function EventTimeline({ weddingData, diseño }) {
  // Clases dinámicas para las tarjetas de logística según el diseño
  const cardStyle = diseño.id === 'minimal-dark' 
    ? 'bg-zinc-950/40 border-zinc-800 text-zinc-300' 
    : diseño.id === 'boho-rancho'
    ? 'bg-[#faf7f2] border-amber-900/10 text-amber-950'
    : 'bg-white border-stone-200 text-stone-700';

  const labelStyle = diseño.id === 'minimal-dark' ? 'text-zinc-500' : 'text-stone-400';

  // Sincronización en caliente con el Paso 6 del Dashboard
  const horaMisa = weddingData?.itinerarioMisa || weddingData?.ceremoniaHora || "17:00 HRS";
  const horaFiesta = weddingData?.itinerarioFiesta || weddingData?.recepcionHora || "19:30 HRS";
  const textoPaleta = weddingData?.paletaColores || "Tonos terracota, beige, verde olivo";

  // Mapeo automático de burbujas de color según la plantilla contratada
  const coloresMuestra = diseño.id === 'minimal-dark' 
    ? ['#18181b', '#27272a', '#52525b', '#71717a', '#a1a1aa']
    : diseño.id === 'boho-rancho'
    ? ['#8c6239', '#bf9b7a', '#dfd3c3', '#7d8a7c', '#c2baa6']
    : ['#78350f', '#b45309', '#f59e0b', '#fef3c7', '#d97706']; // Clásico

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
            <p><strong className="font-semibold">Hora:</strong> {horaMisa}</p>
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
            <p><strong className="font-semibold">Hora:</strong> {horaFiesta}</p>
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

      {/* 👔 EXCLUSIVO MODULO: CÓDIGO DE VESTIMENTA & PALETA DE INSPIRACIÓN INTERACTIVA */}
      <div className={`p-6 rounded-3xl text-center border max-w-sm mx-auto transition-colors duration-500 space-y-4 ${cardStyle}`}>
        <div className="space-y-1">
          <span className={`text-[10px] uppercase tracking-widest font-bold block ${labelStyle}`}>Código de Vestimenta</span>
          <p className="text-sm font-medium tracking-wide capitalize">✨ {weddingData.codigoVestimenta || "Formal / Gala"}</p>
        </div>

        {/* Círculos fluidos de paletas cromáticas */}
        <div className="pt-3 border-t border-stone-200/50 border-dashed space-y-2.5">
          <span className={`text-[9px] uppercase tracking-wider font-bold block ${labelStyle}`}>Paleta de Inspiración</span>
          <div className="flex justify-center items-center gap-1.5">
            {coloresMuestra.map((hex, i) => (
              <div 
                key={i} 
                style={{ backgroundColor: hex }} 
                className="w-6 h-6 rounded-full shadow-2xs border border-white hover:scale-110 transition-transform cursor-help"
                title={hex}
              />
            ))}
          </div>
          <p className="text-[11px] italic opacity-70 font-light px-2 leading-relaxed">
            "{textoPaleta}"
          </p>
        </div>
      </div>
    </section>
  );
}