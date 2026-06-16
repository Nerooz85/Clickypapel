export default function EventTimelineV2({ weddingData, diseño }) {
  // Fotos de locaciones por defecto (por si el cliente aún no sube fotos de su iglesia/salón)
  const imgCeremonia = weddingData?.ceremonia_foto || "https://images.unsplash.com/photo-1548625361-ec853c032658?q=80&w=800&auto=format&fit=crop";
  const imgRecepcion = weddingData?.recepcion_foto || "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800&auto=format&fit=crop";

  return (
    <section className="py-24 px-6 max-w-6xl mx-auto flex flex-col gap-24 items-center">
      
      {/* Título de Sección */}
      <div className="text-center space-y-4 mb-4">
        <h2 className={`text-4xl md:text-5xl font-light ${diseño.textAcento}`}>Dónde & Cuándo</h2>
        <p className="text-[10px] md:text-xs uppercase tracking-[0.3em] opacity-50 font-sans font-bold">El Itinerario</p>
      </div>

      {/* 📍 LOCACIÓN 1: CEREMONIA */}
      <div className="w-full flex flex-col lg:flex-row gap-10 items-center">
        {/* Foto Grande */}
        <div className="w-full lg:w-1/2 overflow-hidden rounded-[2rem] shadow-xl relative group">
          <img 
            src={imgCeremonia} 
            alt="Ceremonia" 
            className="w-full h-[450px] object-cover group-hover:scale-105 transition-transform duration-1000 ease-in-out" 
          />
          {/* Badge de hora flotante sobre la foto */}
          <div className="absolute top-6 left-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl shadow-lg">
            <span className={`text-xs font-bold tracking-widest uppercase ${diseño.textAcento}`}>
              {weddingData?.ceremoniaHora || "16:00 HRS"}
            </span>
          </div>
        </div>
        
        {/* Detalles */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center text-center lg:text-left space-y-5 lg:pl-10">
          <span className="text-[10px] tracking-[0.2em] uppercase opacity-50 font-sans font-bold">01. Ceremonia</span>
          <h3 className="text-4xl font-light">{weddingData?.ceremoniaLugar || "Parroquia San José"}</h3>
          <p className="text-sm opacity-70 leading-relaxed max-w-md mx-auto lg:mx-0 font-sans">
            {weddingData?.ceremoniaDireccion || "Av. Las Rosas 123, Colonia Centro. Te esperamos con mucha emoción para dar inicio a nuestra historia."}
          </p>
          
          <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
            {weddingData?.ceremoniaMapsUrl && (
              <a 
                href={weddingData.ceremoniaMapsUrl} 
                target="_blank" 
                rel="noreferrer"
                className={`px-8 py-3.5 rounded-full text-[10px] uppercase tracking-widest font-bold text-center font-sans ${diseño.btn}`}
              >
                📍 Ver en Mapa
              </a>
            )}
          </div>
        </div>
      </div>

      {/* 📍 LOCACIÓN 2: RECEPCIÓN (Invertido en pantallas grandes) */}
      <div className="w-full flex flex-col lg:flex-row-reverse gap-10 items-center">
        {/* Foto Grande */}
        <div className="w-full lg:w-1/2 overflow-hidden rounded-[2rem] shadow-xl relative group">
          <img 
            src={imgRecepcion} 
            alt="Recepción" 
            className="w-full h-[450px] object-cover group-hover:scale-105 transition-transform duration-1000 ease-in-out" 
          />
          {/* Badge de hora flotante */}
          <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl shadow-lg">
            <span className={`text-xs font-bold tracking-widest uppercase ${diseño.textAcento}`}>
              {weddingData?.recepcionHora || "19:00 HRS"}
            </span>
          </div>
        </div>
        
        {/* Detalles */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center text-center lg:text-right space-y-5 lg:pr-10">
          <span className="text-[10px] tracking-[0.2em] uppercase opacity-50 font-sans font-bold">02. Celebración</span>
          <h3 className="text-4xl font-light">{weddingData?.recepcionLugar || "Hacienda Los Arcángeles"}</h3>
          <p className="text-sm opacity-70 leading-relaxed max-w-md mx-auto lg:ml-auto lg:mr-0 font-sans">
            {weddingData?.recepcionDireccion || "Carretera Nacional Km 24. Prepárate para una noche llena de cena, bebida y mucho baile."}
          </p>
          
          <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center lg:justify-end">
            {weddingData?.recepcionMapsUrl && (
              <a 
                href={weddingData.recepcionMapsUrl} 
                target="_blank" 
                rel="noreferrer"
                className={`px-8 py-3.5 rounded-full text-[10px] uppercase tracking-widest font-bold text-center font-sans ${diseño.btn}`}
              >
                📍 Ver en Mapa
              </a>
            )}
          </div>
        </div>
      </div>

    </section>
  );
}