"use client";
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';

export default function NoviosDashboard() {
  const weddingSlug = 'bruno-y-brisa'; 

  // Estados de Control de la App
  const [pasoActivo, setPasoActivo] = useState(4); // Forzado en paso 4 para pruebas directas
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);

  // 🪙 Información de Compra del Cliente (Simulado de Supabase)
  const [planContratado, setPlanContratatado] = useState('premium'); // 'basicos' | 'premium' | 'vip'
  const [tieneMusicaPersonalizada, setTieneMusicaPersonalizada] = useState(false); // Add-on de $350

  // 📝 ESTADOS DEL PASO 2 & 3
  const [brideName, setBrideName] = useState('');
  const [groomName, setGroomName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [ceremoniaLugar, setCeremoniaLugar] = useState('');
  const [ceremoniaMaps, setCeremoniaMaps] = useState('');
  const [recepcionLugar, setRecepcionLugar] = useState('');
  const [recepcionMaps, setRecepcionMaps] = useState('');
  const [templateId, setTemplateId] = useState('romantico-clasico');
  const [invitados, setInvitados] = useState([]);
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [nuevosPases, setNuevosPases] = useState(2);

  // 🎵📸 ESTADOS DEL PASO 4: MULTIMEDIA DINÁMICA
  const [coverImage, setCoverImage] = useState(''); // Foto de Banner Principal
  const [musicUrl, setMusicUrl] = useState('/music/1-thousand-years.mp3');
  const [galeriaFotos, setGaleriaFotos] = useState(['', '', '', '', '', '']); // 6 espacios base

  // Estado para el reproductor previo en el dashboard
  const [cancionSonando, setCancionSonando] = useState(null);
  const audioPrevioRef = useRef(null);

  // 🎹 LISTA DE LAS 5 CANCIONES OFICIALES DE TU CATÁLOGO DE CLICKYPAPEL
  const cancionesCatalogo = [
    { id: '1', titulo: "A Thousand Years (Piano Elegante)", url: "/music/1-thousand-years.mp3" },
    { id: '2', titulo: "Perfect - Ed Sheeran (Orquestal)", url: "/music/2-perfect.mp3" },
    { id: '3', titulo: "Marry Me - Train (Acústico Dulce)", url: "/music/3-marry-me.mp3" },
    { id: '4', titulo: "Canon en D - Pachelbel (Clásico Real)", url: "/music/4-canon-in-d.mp3" },
    { id: '5', titulo: "Hasta Mi Final - Il Divo (Voz Emocional)", url: "/music/5-hasta-mi-final.mp3" }
  ];

  // Control del reproductor de prueba en el panel
  const escucharCancion = (url) => {
    if (audioPrevioRef.current) {
      if (cancionSonando === url) {
        audioPrevioRef.current.pause();
        setCancionSonando(null);
      } else {
        audioPrevioRef.current.src = url;
        audioPrevioRef.current.play().catch(e => console.log("Blocked", e));
        setCancionSonando(url);
      }
    }
  };

  // Cargar datos de Supabase
  const cargarTodoElDashboard = async () => {
    try {
      setCargando(true);
      const slugLimpio = weddingSlug ? weddingSlug.toLowerCase().trim() : 'bruno-y-brisa';

      const { data: bodaData, error: bodaError } = await supabase
        .from('bodas')
        .select('*')
        .eq('slug', slugLimpio)
        .maybeSingle();

      if (bodaData && !bodaError) {
        setBrideName(bodaData.bride_name || '');
        setGroomName(bodaData.groom_name || '');
        setEventDate(bodaData.event_date ? bodaData.event_date.substring(0, 10) : '');
        setCeremoniaLugar(bodaData.ceremonia_lugar || '');
        setCeremoniaMaps(bodaData.ceremonia_maps_url || '');
        setRecepcionLugar(bodaData.recepcion_lugar || '');
        setRecepcionMaps(bodaData.recepcion_maps_url || '');
        setTemplateId(bodaData.template_id || 'romantico-clasico');
        setCoverImage(bodaData.cover_image || '');
        setMusicUrl(bodaData.music_url || '/music/1-thousand-years.mp3');
        
        // Cargar plan y extras directo de Supabase (O mapeado por tu checkout)
        setPlanContratatado(bodaData.plan_tipo || 'premium'); // 'basicos' | 'premium' | 'vip'
        setTieneMusicaPersonalizada(bodaData.musica_extra || false);

        if (bodaData.gallery_images) {
          const nuevasFotos = [...galeriaFotos];
          bodaData.gallery_images.forEach((img, i) => { if(i < 6) nuevasFotos[i] = img; });
          setGaleriaFotos(nuevasFotos);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => { cargarTodoElDashboard(); }, []);

  // Guardar Paso 4 (Multimedia validada)
  const handleGuardarPaso4 = async () => {
    setGuardando(true);
    try {
      // Limpiamos urls vacías
      const fotosLimpias = galeriaFotos.filter(url => url.trim() !== '');

      const { error } = await supabase
        .from('bodas')
        .update({
          cover_image: coverImage.trim(),
          music_url: musicUrl,
          gallery_images: fotosLimpias
        })
        .eq('slug', weddingSlug);

      if (error) throw error;
      alert("🚀 ¡Multimedia publicada! Tu música y galería están corriendo en vivo.");
    } catch (err) {
      alert("Error al guardar.");
    } finally {
      setGuardando(false);
    }
  };

  // Manejador para actualizar el array de fotos desde inputs individuales
  const handleFotoChange = (index, value) => {
    const copias = [...galeriaFotos];
    copias[index] = value;
    setGaleriaFotos(copias);
  };

  // 📏 LÍMITES INTELIGENTES SEGÚN EL PLAN CONTRATADO
  const maxFotosPermitidas = planContratado === 'basicos' ? 3 : planContratado === 'premium' ? 6 : 12;

  if (cargando) return <div className="min-h-screen bg-[#f1ede6] flex items-center justify-center font-serif text-stone-500 animate-pulse">Sincronizando multimedia... ✨</div>;

  return (
    <div className="min-h-screen bg-[#f1ede6] text-stone-800 flex font-sans overflow-x-hidden">
      
      {/* Elemento oculto para los plays de prueba */}
      <audio ref={audioPrevioRef} loop />

      {/* 🧭 SIDEBAR */}
      <aside className="w-20 bg-white border-r border-stone-200 flex flex-col items-center py-6 gap-8 flex-none select-none">
        <div className="w-10 h-10 bg-amber-700/10 rounded-full flex items-center justify-center font-serif text-amber-800 font-bold">c`p</div>
        <nav className="flex flex-col gap-6 text-center w-full">
          {['Inicio', 'Invitación', 'RSVP', 'Regalos', 'Configuración'].map((item, idx) => (
            <button key={item} type="button" onClick={() => idx === 1 ? setPasoActivo(2) : idx === 2 ? setPasoActivo(3) : null} className={`flex flex-col items-center gap-1 text-[10px] py-2 font-medium ${(idx===1 && pasoActivo===4) || (idx===1 && pasoActivo===2) ? 'text-amber-700 bg-amber-50/60 border-r-2 border-amber-700 font-bold' : 'text-stone-400'}`}>
              <span className="text-base">{idx === 0 ? '🏠' : idx === 1 ? '✉️' : idx === 2 ? '📝' : idx === 3 ? '🎁' : '⚙️'}</span>
              {item}
            </button>
          ))}
        </nav>
      </aside>

      <main className="flex-1 p-6 md:p-12 space-y-8 overflow-y-auto max-w-7xl mx-auto w-full">
        {/* Banner de Estado del Plan Activo */}
        <div className="bg-white px-6 py-3.5 rounded-2xl border border-stone-200/60 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-left">
          <div>
            <p className="text-xs font-semibold text-stone-800">Paquete de Cuentahabiente: <span className="text-amber-700 uppercase font-bold tracking-wider">{planContratado === 'basicos' ? '💍 Digital Esencial' : planContratado === 'premium' ? '🌟 Gran Día Premium' : '👑 VIP Celestial'}</span></p>
            <p className="text-[11px] text-stone-400 font-light">Tu plan contratado te permite colgar hasta <strong className="text-stone-600 font-bold">{maxFotosPermitidas} recuerdos</strong> en el carrete de fotos.</p>
          </div>
          <span className="text-[10px] bg-stone-900 text-white font-mono font-bold px-3 py-1 rounded-full">ID: {weddingSlug}</span>
        </div>

        {/* 🔀 INTERFAZ PASO 4 MULTIMEDIA */}
        {pasoActivo === 4 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start animate-fadeIn text-left">
            
            {/* COLUMNA PANEL DE CONFIGURACIÓN (ANCHO 2) */}
            <div className="lg:col-span-2 space-y-6">
              
              {/* BRANDING Y BANNER DE PORTADA */}
              <div className="bg-white rounded-3xl p-6 md:p-8 border border-stone-200/60 shadow-xs space-y-4">
                <h3 className="font-serif text-lg font-medium text-stone-900">🖼️ Fotografía de Portada (Hero Banner)</h3>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-600">URL del Banner de Bienvenida</label>
                  <input type="text" value={coverImage} onChange={(e) => setCoverImage(e.target.value)} placeholder="Pega el enlace de tu foto de portada aquí..." className="w-full px-4 py-3 border border-stone-200 rounded-xl text-xs bg-stone-50/50 focus:border-amber-700 focus:outline-none font-mono" />
                </div>
              </div>

              {/* MÓDULO INTERACTIVO DE MÚSICA CON PLAY PREVIO */}
              <div className="bg-white rounded-3xl p-6 md:p-8 border border-stone-200/60 shadow-xs space-y-6">
                <div>
                  <h3 className="font-serif text-lg font-medium text-stone-900">🎵 Banda Sonora de tu Invitación</h3>
                  <p className="text-xs text-stone-400 font-light mt-0.5">Escucha las pistas oficiales de tu catálogo y selecciona tu favorita.</p>
                </div>

                {/* Lista de Reproducción Interna de ClickyPapel */}
                <div className="space-y-2">
                  {cancionesCatalogo.map((track) => (
                    <div 
                      key={track.id} 
                      className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${
                        musicUrl === track.url ? 'border-amber-600 bg-amber-50/20 ring-1 ring-amber-600/30' : 'border-stone-100 bg-stone-50/40 hover:bg-stone-50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {/* Botón de Escucha Previa (Play) */}
                        <button
                          type="button"
                          onClick={() => escucharCancion(track.url)}
                          className={`w-8 h-8 rounded-full flex items-center justify-center shadow-xs font-serif text-xs transition-colors cursor-pointer ${
                            cancionSonando === track.url ? 'bg-amber-700 text-white animate-pulse' : 'bg-white text-stone-700 border border-stone-200'
                          }`}
                        >
                          {cancionSonando === track.url ? '⏸️' : '▶️'}
                        </button>
                        <span className="text-xs font-medium text-stone-800">{track.titulo}</span>
                      </div>
                      
                      {/* Radio para elegirla de forma oficial */}
                      <input 
                        type="radio" 
                        name="wedding_track" 
                        checked={musicUrl === track.url} 
                        onChange={() => setMusicUrl(track.url)} 
                        className="accent-amber-700 w-4 h-4 cursor-pointer" 
                      />
                    </div>
                  ))}
                </div>

                {/* INTEGRACIÓN DEL ADD-ON DE MÚSICA EXTRA COMPRADA ($350) */}
                <div className="pt-4 border-t border-stone-100 space-y-3">
                  <div className="flex justify-between items-center">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-purple-900 flex items-center gap-1.5">
                      <span>👑</span> Opción: Tu Canción Especial Extra
                    </h5>
                    <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full ${
                      (planContratado === 'vip' || tieneMusicaPersonalizada) ? 'bg-purple-100 text-purple-800' : 'bg-stone-100 text-stone-400'
                    }`}>
                      {(planContratado === 'vip' || tieneMusicaPersonalizada) ? '✨ Desbloqueado' : '🔒 Bloqueado'}
                    </span>
                  </div>

                  {(planContratado === 'vip' || tieneMusicaPersonalizada) ? (
                    <div className="space-y-1 animate-fadeIn">
                      <label className="text-xs font-semibold text-purple-950">Enlace de tu Archivo .MP3 Personalizado</label>
                      <input 
                        type="text" 
                        value={musicUrl.startsWith('/music/') ? '' : musicUrl} 
                        onChange={(e) => setMusicUrl(e.target.value)} 
                        placeholder="Pega el link directo (.mp3) de tu canción de boda de almacenamiento externo..."
                        className="w-full px-4 py-3 border border-purple-200 rounded-xl text-xs bg-purple-50/10 focus:border-purple-600 focus:outline-none font-mono text-purple-950" 
                      />
                    </div>
                  ) : (
                    <div className="bg-stone-50 border border-dashed border-stone-200 rounded-xl p-4 text-center">
                      <p className="text-xs text-stone-500 font-light leading-normal">¿Quieres meter una canción única que no esté en nuestro catálogo? Adquiere el add-on de <strong>Música Personalizada por \$350 MXN</strong> desde tu landing o panel.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* CONTROL DE GALERÍA ADAPTADO SEGÚN EL PLAN */}
              <div className="bg-white rounded-3xl p-6 md:p-8 border border-stone-200/60 shadow-xs space-y-4">
                <div>
                  <h3 className="font-serif text-lg font-medium text-stone-900">📸 Carrete de Recuerdos Interactivo</h3>
                  <p className="text-xs text-stone-400 font-light mt-0.5">Sube los enlaces de tus imágenes de compromiso o noviazgo.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {galeriaFotos.map((foto, index) => {
                    const estaBloqueado = index >= maxFotosPermitidas;
                    return (
                      <div key={index} className={`space-y-1 text-left relative ${estaBloqueado ? 'opacity-30 pointer-events-none' : ''}`}>
                        <label className="text-xs font-semibold text-stone-600 flex justify-between">
                          <span>Fotografía {index + 1} {index === 0 && ' (Principal)'}</span>
                          {estaBloqueado && <span className="text-[9px] font-bold text-amber-800">🔒 Requiere Plan Premium</span>}
                        </label>
                        <input 
                          type="text" 
                          value={foto} 
                          disabled={estaBloqueado}
                          onChange={(e) => handleFotoChange(index, e.target.value)}
                          placeholder={estaBloqueado ? "Espacio bloqueado en este plan" : "https://images.unsplash.com/..."} 
                          className="w-full px-4 py-3 border border-stone-200 rounded-xl text-xs bg-stone-50/50 focus:border-amber-700 focus:outline-none font-mono" 
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            {/* BARRA DE PUBLICACIÓN LATERAL DERECHA (ANCHO 1) */}
            <div className="bg-white rounded-3xl p-6 border border-stone-200/60 shadow-xs flex flex-col justify-between h-full space-y-6 sticky top-6">
              <div className="space-y-4">
                <div>
                  <h4 className="text-base font-serif font-medium text-stone-900">Estado de Publicación</h4>
                  <hr className="border-stone-100 mt-2" />
                </div>
                
                <div className="space-y-2 text-xs font-light text-stone-500 leading-relaxed">
                  <div className="flex justify-between border-b pb-1.5 border-stone-50">
                    <span>Plan Activo:</span>
                    <strong className="text-stone-700 font-bold">{planContratado}</strong>
                  </div>
                  <div className="flex justify-between border-b pb-1.5 border-stone-50">
                    <span>Fotos en cola:</span>
                    <strong className="text-stone-700 font-bold">{galeriaFotos.filter(u => u.trim()!=='').length} registradas</strong>
                  </div>
                  <div className="flex justify-between">
                    <span>Música Activa:</span>
                    <span className="text-amber-700 font-mono truncate max-w-[120px]" title={musicUrl}>{musicUrl}</span>
                  </div>
                </div>
              </div>

              <button 
                type="button" 
                disabled={guardando} 
                onClick={handleGuardarPaso4} 
                className="w-full bg-stone-950 hover:bg-emerald-700 text-white text-xs uppercase font-bold tracking-widest py-4 rounded-xl shadow-md transition-all cursor-pointer text-center disabled:opacity-50 mt-6"
              >
                {guardando ? 'Sincronizando...' : '🚀 Lanzar Cambios en Vivo'}
              </button>
            </div>

          </div>
        )}
      </main>
    </div>
  );
}