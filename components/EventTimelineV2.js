"use client";
import { motion } from 'framer-motion';

export default function EventTimelineV2({ weddingData, diseño }) {
  if (!weddingData) return null;

  // 📸 Enlaces blindados: Si el cliente no tiene foto, usamos estas de alta calidad
  const imgCeremonia = weddingData?.ceremoniaFoto || "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1000&q=80";
  const imgRecepcion = weddingData?.recepcionFoto || "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1000&q=80";

  // Colores de diseño seguros
  const textAcento = diseño?.textAcento || 'text-[var(--cafe)]';
  const btnStyle = diseño?.btn || 'bg-[var(--cafe)] text-[var(--nieve)] hover:bg-[var(--tinta)]';
  const cardStyle = diseño?.colorCard || 'bg-[var(--nieve)] border-[var(--terracota)]/40 shadow-[0_20px_50px_-20px_rgba(67,48,43,0.35)] text-[var(--tinta)]';

  // 👇 Sincronización de horarios y datos (YA SIN LA PALABRA 'HRS' FIJA)
  const horaMisa = weddingData?.ceremoniaHora || "17:00 hrs";
  const horaFiesta = weddingData?.recepcionHora || "19:30 hrs";
  const horaBaile = weddingData?.horaBaile || "21:00 hrs";
  const horaShow = weddingData?.horaShow || "22:00 hrs";   
  const horaFin = weddingData?.horaFin || "02:00 am";      
  const textoPaleta = weddingData?.paletaColores || "Tonos terracota, beige, verde olivo";
  const codigoVestimenta = weddingData?.codigoVestimenta || "Formal / Gala";

  // Paletas de color dinámicas
  const coloresMuestra = diseño?.id === 'obsidian' 
    ? ['#18181b', '#27272a', '#52525b', '#71717a', '#a1a1aa']
    : diseño?.id === 'terracota'
    ? ['#8c6239', '#bf9b7a', '#dfd3c3', '#7d8a7c', '#c2baa6']
    : ['#78350f', '#b45309', '#f59e0b', '#fef3c7', '#d97706'];

  // 📝 DATOS DEL ITINERARIO CONECTADOS A LOS NUEVOS HORARIOS
  const itinerario = [
    { time: horaMisa, title: 'Ceremonia religiosa', icon: '⛪' },
    { time: horaFiesta, title: 'Recepción', icon: '🥂' },
    { time: horaBaile, title: 'Baile / Vals', icon: '✨' }, 
    { time: horaShow, title: 'Fiesta', icon: '🎉' },  
    { time: horaFin, title: 'Fin de fiesta', icon: '🕛' } 
  ];

  return (
    <section className="py-24 px-6 max-w-6xl mx-auto flex flex-col gap-24 items-center">
      
      {/* Título de Sección Principal */}
      <div className="text-center space-y-3 mb-4">
        <h2 className={`font-display text-4xl md:text-5xl font-light ${textAcento}`}>Dónde & Cuándo</h2>
        <p className="etiqueta opacity-60">Ubicaciones y Horarios</p>
        <div className="oro-linea w-24 mx-auto" aria-hidden="true" />
      </div>

      {/* ================= SECCIÓN 1: LOCACIONES ESTILO EDITORIAL (ZIGZAG) ================= */}
      <div className="w-full flex flex-col gap-24">
        {/* 📍 LOCACIÓN 1: CEREMONIA */}
        <div className="w-full flex flex-col lg:flex-row gap-10 items-center">
          <div className="w-full lg:w-1/2 overflow-hidden rounded-[2rem] shadow-[0_20px_50px_-20px_rgba(67,48,43,0.35)] relative group bg-[var(--crema)] tarjeta-foto">
            <img 
              src={imgCeremonia} 
              alt="Ceremonia" 
              className="w-full h-[450px] object-cover group-hover:scale-105 transition-transform duration-1000 ease-in-out" 
            />
            <div className="absolute top-6 left-6 bg-[var(--nieve)]/90 backdrop-blur-md px-4 py-2 rounded-2xl shadow-lg">
              <span className={`etiqueta ${textAcento}`}>
                {horaMisa}
              </span>
            </div>
          </div>
          
          <div className="w-full lg:w-1/2 flex flex-col justify-center text-center lg:text-left space-y-5 lg:pl-10">
            <span className="etiqueta opacity-60">01. Ceremonia</span>
            <h3 className="font-display text-4xl font-light text-[var(--tinta)]">{weddingData?.ceremoniaLugar || "Parroquia San José"}</h3>
            <p className="text-sm text-[var(--tinta-suave)] leading-relaxed max-w-md mx-auto lg:mx-0 font-ui">
              {weddingData?.ceremoniaDireccion || "Te esperamos con mucha emoción para dar inicio a nuestra historia."}
            </p>
            
            <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              {(weddingData?.ceremoniaMapsUrl && weddingData.ceremoniaMapsUrl !== '#' && weddingData.ceremoniaMapsUrl !== '') && (
                <a 
                  href={weddingData.ceremoniaMapsUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`px-8 py-3.5 rounded-full etiqueta text-center shadow-md hover:scale-105 transition-transform ${btnStyle}`}
                >
                  📍 Ver en Mapa
                </a>
              )}
            </div>
          </div>
        </div>

        {/* 📍 LOCACIÓN 2: RECEPCIÓN */}
        <div className="w-full flex flex-col lg:flex-row-reverse gap-10 items-center">
          <div className="w-full lg:w-1/2 overflow-hidden rounded-[2rem] shadow-[0_20px_50px_-20px_rgba(67,48,43,0.35)] relative group bg-[var(--crema)] tarjeta-foto">
            <img 
              src={imgRecepcion} 
              alt="Recepción" 
              className="w-full h-[450px] object-cover group-hover:scale-105 transition-transform duration-1000 ease-in-out" 
            />
            <div className="absolute top-6 right-6 bg-[var(--nieve)]/90 backdrop-blur-md px-4 py-2 rounded-2xl shadow-lg">
              <span className={`etiqueta ${textAcento}`}>
                {horaFiesta}
              </span>
            </div>
          </div>
          
          <div className="w-full lg:w-1/2 flex flex-col justify-center text-center lg:text-right space-y-5 lg:pr-10">
            <span className="etiqueta opacity-60">02. Celebración</span>
            <h3 className="font-display text-4xl font-light text-[var(--tinta)]">{weddingData?.recepcionLugar || "Hacienda Los Arcángeles"}</h3>
            <p className="text-sm text-[var(--tinta-suave)] leading-relaxed max-w-md mx-auto lg:ml-auto lg:mr-0 font-ui">
              {weddingData?.recepcionDireccion || "Prepárate para una noche llena de cena, bebida y mucho baile."}
            </p>
            
            <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center lg:justify-end">
              {(weddingData?.recepcionMapsUrl && weddingData.recepcionMapsUrl !== '#' && weddingData.recepcionMapsUrl !== '') && (
                <a 
                  href={weddingData.recepcionMapsUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`px-8 py-3.5 rounded-full etiqueta text-center shadow-md hover:scale-105 transition-transform ${btnStyle}`}
                >
                  📍 Ver en Mapa
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ================= SECCIÓN 2: ITINERARIO ANIMADO (NUEVO PARA V2) ================= */}
      <div className="w-full max-w-xl mx-auto pt-16">
        <div className="text-center mb-16 space-y-3">
          <h2 className="font-display text-4xl font-light text-[var(--tinta)] drop-shadow-sm">El Itinerario</h2>
          <div className="oro-linea w-24 mx-auto" aria-hidden="true" />
        </div>

        <div className="relative">
          {/* Línea central elegante */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-[1px] h-full bg-[var(--terracota)]/70"></div>

          <div className="space-y-16">
            {itinerario.map((item, index) => {
              const isLeft = index % 2 === 0;
              return (
                <motion.div 
                  key={index} 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="relative flex items-center justify-between w-full"
                >
                  {/* Nodo central estilo V2 */}
                  <div className={`absolute left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full border-[3px] shadow-sm z-10 bg-[var(--nieve)] ${diseño?.id === 'obsidian' ? 'border-stone-700' : 'border-[var(--dorado)]'}`}></div>

                  {/* Lado Izquierdo */}
                  <div className={`w-5/12 flex ${isLeft ? 'justify-end pr-4 md:pr-10' : 'justify-start pl-4 md:pl-10 opacity-0'}`}>
                    {isLeft && (
                      <div className="flex items-center gap-4 text-right">
                        {item.icon && <span className="text-2xl md:text-3xl opacity-70">{item.icon}</span>}
                        <div>
                          <p className="font-display text-base md:text-xl text-[var(--tinta)]">{item.time}</p>
                          <p className="font-display text-sm md:text-base font-light italic text-[var(--tinta-suave)] mt-1">{item.title}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Lado Derecho */}
                  <div className={`w-5/12 flex ${!isLeft ? 'justify-start pl-4 md:pl-10' : 'justify-end pr-4 md:pr-10 opacity-0'}`}>
                    {!isLeft && (
                      <div className="flex items-center gap-4 text-left">
                        <div>
                          <p className="font-display text-base md:text-xl text-[var(--tinta)]">{item.time}</p>
                          <p className="font-display text-sm md:text-base font-light italic text-[var(--tinta-suave)] mt-1">{item.title}</p>
                        </div>
                        {item.icon && <span className="text-2xl md:text-3xl opacity-70">{item.icon}</span>}
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ================= SECCIÓN 3: CÓDIGO DE VESTIMENTA EDITORIAL ================= */}
      <div className={`w-full max-w-lg p-10 rounded-[2rem] border text-center transition-colors duration-500 space-y-6 mt-8 ${cardStyle}`}>
        <div className="space-y-2">
          <span className={`etiqueta block ${textAcento}`}>Código de Vestimenta</span>
          <p className="font-display text-xl tracking-wide capitalize">✨ {codigoVestimenta}</p>
        </div>

        {/* Círculos fluidos de paletas cromáticas */}
        <div className="pt-6 border-t border-[var(--crema)] space-y-4">
          <span className={`etiqueta block ${textAcento}`}>Paleta de Inspiración</span>
          <div className="flex justify-center items-center gap-2">
            {coloresMuestra.map((hex, i) => (
              <div 
                key={i} 
                style={{ backgroundColor: hex }} 
                className="w-8 h-8 rounded-full shadow-md border-2 border-[var(--nieve)] hover:scale-110 transition-transform cursor-help"
                title={hex}
              />
            ))}
          </div>
          <p className="font-display text-sm italic opacity-70 font-light px-2 mt-2 leading-relaxed">
            "{textoPaleta}"
          </p>
        </div>
      </div>

    </section>
  );
}