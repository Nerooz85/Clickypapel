"use client";
import { motion } from 'framer-motion';

export default function EventTimeline({ weddingData, diseño }) {
  if (!weddingData) return null;

  // Clases dinámicas para las tarjetas de logística según el diseño
  const cardStyle = diseño?.colorCard || 'bg-[var(--nieve)] border-[var(--terracota)]/40 shadow-[0_20px_50px_-20px_rgba(67,48,43,0.35)] text-[var(--tinta)]';
  const labelStyle = diseño?.textAcento || 'text-[var(--cafe)]';
  const btnStyle = diseño?.btn || 'bg-[var(--cafe)] hover:bg-[var(--tinta)] text-[var(--nieve)]';

  // 👇 Sincronización en caliente con el Paso 6 del Dashboard (LAS 5 HORAS)
  const horaMisa = weddingData?.ceremoniaHora || "17:00 hrs";
  const horaFiesta = weddingData?.recepcionHora || "19:30 hrs";
  const horaBaile = weddingData?.horaBaile || "21:00 hrs"; // 👈 CONECTADO
  const horaShow = weddingData?.horaShow || "22:00 hrs";   // 👈 CONECTADO
  const horaFin = weddingData?.horaFin || "02:00 am";      // 👈 CONECTADO
  const textoPaleta = weddingData?.paletaColores || "Tonos terracota, beige, verde olivo";

  // Mapeo automático de burbujas de color según la paleta activa
  const coloresMuestra = diseño?.id === 'obsidian' 
    ? ['#18181b', '#27272a', '#52525b', '#71717a', '#a1a1aa']
    : diseño?.id === 'terracota'
    ? ['#8c6239', '#bf9b7a', '#dfd3c3', '#7d8a7c', '#c2baa6']
    : ['#78350f', '#b45309', '#f59e0b', '#fef3c7', '#d97706']; // Clásico

  // 👇 DATOS DEL ITINERARIO CONECTADOS
  const itinerario = [
    { time: horaMisa, title: 'Ceremonia religiosa', icon: '⛪' },
    { time: horaFiesta, title: 'Recepción', icon: '🥂' },
    { time: horaBaile, title: 'Baile / Vals', icon: '✨' },
    { time: horaShow, title: 'Fiesta', icon: '🎉' },
    { time: horaFin, title: 'Fin de fiesta', icon: '🕛' } 
  ];

  return (
    <section className="py-20 px-4 max-w-4xl mx-auto space-y-24">
      
      {/* ================= SECCIÓN 1: MAPAS Y UBICACIONES ================= */}
      <div className="space-y-12">
        <div className="text-center space-y-3">
          <span className={`etiqueta ${labelStyle}`}>
            Logística del Evento
          </span>
          <h2 className="font-display text-4xl font-light text-[var(--tinta)]">Horarios y Ubicaciones</h2>
          <div className="oro-linea w-24 mx-auto" aria-hidden="true" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* TARJETA CEREMONIA */}
          <div className={`p-8 rounded-[2rem] border space-y-4 transition-colors duration-500 ${cardStyle}`}>
            <div className="space-y-1">
              <span className="text-2xl block">⛪</span>
              <h3 className="font-display text-2xl font-light">Ceremonia Religiosa</h3>
            </div>
            <div className="text-sm space-y-2 font-light text-[var(--tinta-suave)]">
              <p><strong className="font-semibold text-[var(--tinta)]">Lugar:</strong> {weddingData?.ceremoniaLugar || "Templo del Evento"}</p>
            </div>
            
            {(weddingData?.ceremoniaMapsUrl && weddingData.ceremoniaMapsUrl !== '#' && weddingData.ceremoniaMapsUrl !== '') && (
              <a 
                href={weddingData.ceremoniaMapsUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className={`inline-block w-full text-center py-3 rounded-full etiqueta transition-all shadow-sm mt-2 ${btnStyle}`}
              >
                📍 Ver Mapa GPS
              </a>
            )}
          </div>

          {/* TARJETA RECEPCIÓN */}
          <div className={`p-8 rounded-[2rem] border space-y-4 transition-colors duration-500 ${cardStyle}`}>
            <div className="space-y-1">
              <span className="text-2xl block">🥂</span>
              <h3 className="font-display text-2xl font-light">Recepción / Fiesta</h3>
            </div>
            <div className="text-sm space-y-2 font-light text-[var(--tinta-suave)]">
              <p><strong className="font-semibold text-[var(--tinta)]">Lugar:</strong> {weddingData?.recepcionLugar || "Salón de Eventos"}</p>
            </div>
            
            {(weddingData?.recepcionMapsUrl && weddingData.recepcionMapsUrl !== '#' && weddingData.recepcionMapsUrl !== '') && (
              <a 
                href={weddingData.recepcionMapsUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className={`inline-block w-full text-center py-3 rounded-full etiqueta transition-all shadow-sm mt-2 ${btnStyle}`}
              >
                📍 Ver Mapa GPS
              </a>
            )}
          </div>
        </div>
      </div>

      {/* ================= SECCIÓN 2: ITINERARIO VERTICAL (NUEVO) ================= */}
      <div className="max-w-md mx-auto relative pt-4 pb-4">
        <div className="text-center mb-16 space-y-3">
          <h2 className="font-display text-4xl font-light text-[var(--tinta)] drop-shadow-sm">
            Itinerario
          </h2>
          <div className="oro-linea w-24 mx-auto" aria-hidden="true" />
        </div>

        <div className="relative">
          {/* Línea central */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-[2px] h-full bg-[var(--terracota)]/60"></div>

          <div className="space-y-12">
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
                  {/* Nodo central */}
                  <div className={`absolute left-1/2 transform -translate-x-1/2 w-3.5 h-3.5 rounded-full border-4 shadow-sm z-10 ${diseño?.id === 'obsidian' ? 'bg-stone-400 border-stone-800' : 'bg-[var(--dorado)] border-[var(--nieve)]'}`}></div>

                  {/* Lado Izquierdo */}
                  <div className={`w-5/12 flex ${isLeft ? 'justify-end pr-4 md:pr-8' : 'justify-start pl-4 md:pl-8 opacity-0'}`}>
                    {isLeft && (
                      <div className="flex items-center gap-3 text-right">
                        {item.icon && <span className="text-2xl opacity-70">{item.icon}</span>}
                        <div>
                          <p className="font-display text-base md:text-lg text-[var(--tinta)]">{item.time}</p>
                          <p className="font-display text-sm md:text-base font-light italic text-[var(--tinta-suave)] mt-0.5">{item.title}</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Lado Derecho */}
                  <div className={`w-5/12 flex ${!isLeft ? 'justify-start pl-4 md:pl-8' : 'justify-end pr-4 md:pr-8 opacity-0'}`}>
                    {!isLeft && (
                      <div className="flex items-center gap-3 text-left">
                        <div>
                          <p className="font-display text-base md:text-lg text-[var(--tinta)]">{item.time}</p>
                          <p className="font-display text-sm md:text-base font-light italic text-[var(--tinta-suave)] mt-0.5">{item.title}</p>
                        </div>
                        {item.icon && <span className="text-2xl opacity-70">{item.icon}</span>}
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ================= SECCIÓN 3: CÓDIGO DE VESTIMENTA ================= */}
      <div className={`p-6 rounded-[2rem] text-center border max-w-sm mx-auto transition-colors duration-500 space-y-4 ${cardStyle}`}>
        <div className="space-y-1">
          <span className={`etiqueta block ${labelStyle}`}>Código de Vestimenta</span>
          <p className="font-display text-lg tracking-wide capitalize">✨ {weddingData?.codigoVestimenta || "Formal / Gala"}</p>
        </div>

        {/* Círculos fluidos de paletas cromáticas */}
        <div className="pt-3 border-t border-[var(--crema)] border-dashed space-y-2.5">
          <span className={`etiqueta block ${labelStyle}`}>Paleta de Inspiración</span>
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