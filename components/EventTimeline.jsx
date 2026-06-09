// components/EventTimeline.jsx
export default function EventTimeline({ weddingData }) {
  const { 
    ceremoniaHora, ceremoniaLugar, ceremoniaMapsUrl,
    recepcionHora, recepcionLugar, recepcionMapsUrl,
    codigoVestimenta 
  } = weddingData;

  const events = [
    {
      title: "Ceremonia Religiosa",
      time: ceremoniaHora || "17:00 HRS",
      location: ceremoniaLugar || "Parroquia de Nuestra Señora de Guadalupe",
      mapsUrl: ceremoniaMapsUrl || "https://maps.google.com",
      icon: "⛪"
    },
    {
      title: "Recepción y Fiesta",
      time: recepcionHora || "19:30 HRS",
      location: recepcionLugar || "Jardín de Eventos Los Rosales",
      mapsUrl: recepcionMapsUrl || "https://maps.google.com",
      icon: "🥂"
    }
  ];

  return (
    <section className="py-16 px-4 bg-white text-center">
      <div className="max-w-xl mx-auto">
        <span className="font-serif text-amber-600/80 tracking-widest text-xs uppercase block mb-2">
          ¿Dónde y Cuándo?
        </span>
        <h2 className="text-3xl font-serif text-stone-800 mb-12">Ubicación de los Eventos</h2>

        {/* Línea de tiempo vertical */}
        <div className="relative border-l border-stone-200 mx-auto max-w-md text-left pl-6 space-y-12">
          {events.map((event, index) => (
            <div key={index} className="relative">
              {/* Círculo indicador con icono */}
              <span className="absolute -left-[41px] top-0 bg-stone-100 border border-stone-200 w-8 h-8 rounded-full flex items-center justify-center text-sm shadow-sm">
                {event.icon}
              </span>
              
              {/* Contenido del evento */}
              <div className="space-y-2 animate-fade-in">
                <span className="text-amber-600 font-medium tracking-wide text-sm">
                  {event.time}
                </span>
                <h3 className="text-xl font-serif text-stone-800 font-light">
                  {event.title}
                </h3>
                <p className="text-stone-500 text-sm font-light leading-relaxed">
                  {event.location}
                </p>
                
                {/* Botones de navegación accionables */}
                <div className="pt-2">
                  <a
                    href={event.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-stone-50 hover:bg-stone-100 text-stone-700 text-xs font-medium px-4 py-2 rounded-full border border-stone-200 transition-colors shadow-xs"
                  >
                    📍 Ver en Google Maps
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Código de Vestimenta - Bloque de Innovación Visual */}
        {codigoVestimenta && (
          <div className="mt-16 bg-stone-50 border border-stone-100 rounded-2xl p-6 max-w-sm mx-auto">
            <span className="text-xl mb-1 block">👔👗</span>
            <h4 className="font-serif text-stone-800 text-lg mb-1">Código de Vestimenta</h4>
            <p className="text-amber-700 font-medium text-sm tracking-wide uppercase mb-2">
              {codigoVestimenta}
            </p>
            <p className="text-stone-400 text-xs font-light">
              Nos reservamos el uso del color blanco exclusivamente para la novia.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}