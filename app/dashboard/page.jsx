"use client";
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';

export default function NoviosDashboard() {
  const weddingSlug = 'bruno-y-brisa'; 

  // Estados de Control de la App
  const [pasoActivo, setPasoActivo] = useState(4); 
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [subiendoIndex, setSubiendoIndex] = useState(null); // Monitorea cuál foto se está subiendo

  // 🪙 Información de Compra del Cliente
  const [planContratado, setPlanContratatado] = useState('premium'); 
  const [tieneMusicaPersonalizada, setTieneMusicaPersonalizada] = useState(false); 

  // 📝 ESTADOS DEL FORMULARIO BASE
  const [brideName, setBrideName] = useState('');
  const [groomName, setGroomName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [ceremoniaLugar, setCeremoniaLugar] = useState('');
  const [ceremoniaMaps, setCeremoniaMaps] = useState('');
  const [recepcionLugar, setRecepcionLugar] = useState('');
  const [recepcionMaps, setRecepcionMaps] = useState('');
  const [templateId, setTemplateId] = useState('romantico-clasico');

  // 🎵📸 ESTADOS MULTIMEDIA
  const [coverImage, setCoverImage] = useState(''); 
  const [musicUrl, setMusicUrl] = useState('/music/1-thousand-years.mp3');
  const [galeriaFotos, setGaleriaFotos] = useState(['', '', '', '', '', '']); 

  const [cancionSonando, setCancionSonando] = useState(null);
  const audioPrevioRef = useRef(null);

  const cancionesCatalogo = [
    { id: '1', titulo: "A Thousand Years (Piano Elegante)", url: "/music/1-thousand-years.mp3" },
    { id: '2', titulo: "Perfect - Ed Sheeran (Orquestal)", url: "/music/2-perfect.mp3" },
    { id: '3', titulo: "Marry Me - Train (Acústico Dulce)", url: "/music/3-marry-me.mp3" },
    { id: '4', titulo: "Canon en D - Pachelbel (Clásico Real)", url: "/music/4-canon-in-d.mp3" },
    { id: '5', titulo: "Hasta Mi Final - Il Divo (Voz Emocional)", url: "/music/5-hasta-mi-final.mp3" }
  ];

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

  // 🚀 FUNCIÓN MÁGICA: SUBIR ARCHIVO REAL A SUPABASE STORAGE
  const handleSubirArchivo = async (e, index, esPortada = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      if (esPortada) {
        setSubiendoIndex('portada');
      } else {
        setSubiendoIndex(index);
      }

      // Creamos un nombre único para el archivo para que no se sobreescriban
      const fileExt = file.name.split('.').pop();
      const fileName = `${weddingSlug}-${esPortada ? 'portada' : `foto-${index}`}-${Date.now()}.${fileExt}`;
      const filePath = `${weddingSlug}/${fileName}`;

      // 1. Subir el archivo real al bucket de Supabase
      const { error: uploadError } = await supabase.storage
        .from('invitaciones-media')
        .upload(filePath, file, { cacheControl: '3600', upsert: true });

      if (uploadError) throw uploadError;

      // 2. Obtener la URL pública del archivo recién subido
      const { data: { publicUrl } } = supabase.storage
        .from('invitaciones-media')
        .getPublicUrl(filePath);

      // 3. Acomodar la URL en su respectivo estado
      if (esPortada) {
        setCoverImage(publicUrl);
      } else {
        const copias = [...galeriaFotos];
        copias[index] = publicUrl;
        setGaleriaFotos(copias);
      }

      alert("📸 ¡Imagen subida y optimizada con éxito!");

    } catch (err) {
      console.error(err);
      alert("No se pudo subir la imagen. Verifica que el bucket 'invitaciones-media' sea público.");
    } finally {
      setSubiendoIndex(null);
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
        setPlanContratatado(bodaData.plan_tipo || 'premium'); 
        setTieneMusicaPersonalizada(bodaData.musica_extra || false);

        if (bodaData.gallery_images) {
          const nuevasFotos = [...galeriaFotos];
          bodaData.gallery_images.forEach((img, i) => { if(i < 6) nuevasFotos[i] = img; });
          setGaleriaFotos(nuevasFotos);
        }
      }
    } catch (err) {
      console.error(err);
    } crystalline {
      setCargando(false);
    }
  };

  useEffect(() => { cargarTodoElDashboard(); }, []);

  const handleGuardarPaso4 = async () => {
    setGuardando(true);
    try {
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
      alert("🚀 ¡Sección multimedia sincronizada en vivo!");
    } catch (err) {
      alert("Error al guardar.");
    } finally {
      setGuardando(false);
    }
  };

  const maxFotosPermitidas = planContratado === 'basicos' ? 3 : planContratado === 'premium' ? 6 : 12;

  if (cargando) return <div className="min-h-screen bg-[#f1ede6] flex items-center justify-center font-serif text-stone-500 animate-pulse">Sincronizando multimedia... ✨</div>;

  return (
    <div className="min-h-screen bg-[#f1ede6] text-stone-800 flex font-sans overflow-x-hidden">
      <audio ref={audioPrevioRef} loop />

      {/* 🧭 SIDEBAR */}
      <aside className="w-20 bg-white border-r border-stone-200 flex flex-col items-center py-6 gap-8 flex-none select-none">
        <div className="w-10 h-10 bg-amber-700/10 rounded-full flex items-center justify-center font-serif text-amber-800 font-bold">c`p</div>
        <nav className="flex flex-col gap-6 text-center w-full">
          {['Inicio', 'Invitación', 'RSVP', 'Regalos', 'Configuración'].map((item, idx) => (
            <button key={item} type="button" className={`flex flex-col items-center gap-1 text-[10px] py-2 font-medium ${idx===1 ? 'text-amber-700 bg-amber-50/60 border-r-2 border-amber-700 font-bold' : 'text-stone-400'}`}>
              <span className="text-base">{idx === 0 ? '🏠' : idx === 1 ? '✉️' : idx === 2 ? '📝' : idx === 3 ? '🎁' : '⚙️'}</span>
              {item}
            </button>
          ))}
        </nav>
      </aside>

      <main className="flex-1 p-6 md:p-12 space-y-8 overflow-y-auto max-w-7xl mx-auto w-full">
        
        {/* BANNER PLAN */}
        <div className="bg-white px-6 py-3.5 rounded-2xl border border-stone-200/60 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-left">
          <div>
            <p className="text-xs font-semibold text-stone-800">Paquete Activo: <span className="text-amber-700 uppercase font-bold tracking-wider">{planContratado === 'basicos' ? '💍 Digital Esencial' : planContratado === 'premium' ? '🌟 Gran Día Premium' : '👑 VIP Celestial'}</span></p>
            <p className="text-[11px] text-stone-400 font-light">Tienes habilitados <strong className="text-stone-600 font-bold">{maxFotosPermitidas} espacios de galería</strong>.</p>
          </div>
          <span className="text-[10px] bg-stone-900 text-white font-mono font-bold px-3 py-1 rounded-full">Slug: {weddingSlug}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start animate-fadeIn text-left">
          
          {/* COLUMNA ENTRADAS */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* 🖼️ CARGA BANNER DE PORTADA REESTILIZADO */}
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-stone-200/60 shadow-xs space-y-4">
              <h3 className="font-serif text-lg font-medium text-stone-900">🖼️ Fotografía de Portada (Hero Banner)</h3>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-1">
                <div className="flex-1">
                  <input type="text" value={coverImage} readOnly placeholder="No has seleccionado ningún archivo..." className="w-full px-4 py-3 border border-stone-200 rounded-xl text-xs bg-stone-50/50 font-mono text-stone-500 focus:outline-none" />
                </div>
                <label className="bg-stone-900 hover:bg-amber-700 text-white text-xs font-bold uppercase tracking-wider px-5 py-3.5 rounded-xl cursor-pointer text-center flex-none transition-colors">
                  {subiendoIndex === 'portada' ? '⏱️ Subiendo...' : '📸 Seleccionar Foto'}
                  <input type="file" accept="image/*" onChange={(e) => handleSubirArchivo(e, null, true)} className="hidden" />
                </label>
              </div>
              {coverImage && (
                <div className="w-32 aspect-video rounded-xl overflow-hidden border border-stone-100 bg-stone-50 mt-2">
                  <img src={coverImage} alt="Miniatura Portada" className="w-full h-full object-cover" />
                </div>
              )}
            </div>

            {/* 🎵 REPRODUCTOR DE CATÁLOGO Y BOTÓN DE OBTENCIÓN EXTRA */}
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-stone-200/60 shadow-xs space-y-6">
              <div>
                <h3 className="font-serif text-lg font-medium text-stone-900">🎵 Banda Sonora de tu Invitación</h3>
                <p className="text-xs text-stone-400 font-light mt-0.5">Escucha las pistas oficiales de tu catálogo y selecciona tu favorita.</p>
              </div>

              <div className="space-y-2">
                {cancionesCatalogo.map((track) => (
                  <div key={track.id} className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${musicUrl === track.url ? 'border-amber-600 bg-amber-50/20' : 'border-stone-100 bg-stone-50/40'}`}>
                    <div className="flex items-center gap-3">
                      <button type="button" onClick={() => escucharCancion(track.url)} className={`w-8 h-8 rounded-full flex items-center justify-center font-serif text-xs bg-white text-stone-700 border border-stone-200 cursor-pointer ${cancionSonando === track.url ? 'bg-amber-700 text-white' : ''}`}>
                        {cancionSonando === track.url ? '⏸️' : '▶️'}
                      </button>
                      <span className="text-xs font-medium text-stone-800">{track.titulo}</span>
                    </div>
                    <input type="radio" name="wedding_track" checked={musicUrl === track.url} onChange={() => setMusicUrl(track.url)} className="accent-amber-700 w-4 h-4 cursor-pointer" />
                  </div>
                ))}
              </div>

              {/* 💸 BOTÓN DE COMPRA DIRECTA PARA EL ADD-ON DE MÚSICA PERSONALIZADA */}
              <div className="pt-4 border-t border-stone-100 space-y-3">
                <div className="flex justify-between items-center">
                  <h5 className="text-xs font-bold uppercase tracking-wider text-purple-900 flex items-center gap-1.5"><span>👑</span> Tu Canción Especial Única</h5>
                  <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-full ${(planContratado === 'vip' || tieneMusicaPersonalizada) ? 'bg-purple-100 text-purple-800' : 'bg-stone-100 text-stone-400'}`}>
                    {(planContratado === 'vip' || tieneMusicaPersonalizada) ? '✨ Desbloqueado' : '🔒 Bloqueado'}
                  </span>
                </div>

                {(planContratado === 'vip' || tieneMusicaPersonalizada) ? (
                  <div className="space-y-1 animate-fadeIn">
                    <label className="text-xs font-semibold text-purple-950">Link de tu archivo .MP3 subido</label>
                    <input type="text" value={musicUrl.startsWith('/music/') ? '' : musicUrl} onChange={(e) => setMusicUrl(e.target.value)} placeholder="Pega la URL de tu canción personalizada..." className="w-full px-4 py-3 border border-purple-200 rounded-xl text-xs bg-purple-50/50 focus:outline-none font-mono text-purple-950" />
                  </div>
                ) : (
                  <div className="bg-purple-50/40 border border-purple-200/50 rounded-2xl p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-left">
                    <p className="text-xs text-purple-950 font-light leading-relaxed max-w-md">¿Quieres meter una canción única que no esté listada en nuestro portafolio básico? Desbloquea la subida de tu propio archivo de audio personalizado.</p>
                    
                    {/* ✨ BOTÓN COMPRAR EN LÍNEA INTEGRADO */}
                    <a 
                      href={`https://clickypapel.com/checkout/addon-musica?slug=${weddingSlug}`} 
                      className="bg-purple-950 hover:bg-purple-900 text-white text-[10px] uppercase tracking-widest font-bold px-4 py-3 rounded-xl transition-colors text-center shadow-xs flex-none w-full sm:w-auto"
                    >
                      💳 Obtener por $350
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* 📸 SUBIDA REAL E INTERACTIVA DE CADA RECUERDO DE LA GALERÍA */}
            <div className="bg-white rounded-3xl p-6 md:p-8 border border-stone-200/60 shadow-xs space-y-4">
              <div>
                <h3 className="font-serif text-lg font-medium text-stone-900">📸 Carrete de Recuerdos Interactivo</h3>
                <p className="text-xs text-stone-400 font-light mt-0.5">Sube, reemplaza o elimina las imágenes de tu galería en tiempo real.</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {galeriaFotos.map((foto, index) => {
                  const estaBloqueado = index >= maxFotosPermitidas;
                  return (
                    <div key={index} className={`bg-stone-50/40 p-4 rounded-2xl border border-stone-100 flex flex-col justify-between gap-3 text-left ${estaBloqueado ? 'opacity-20 pointer-events-none' : ''}`}>
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-stone-700">Foto {index + 1} {index === 0 && ' (Principal)'}</span>
                        {foto && (
                          <button type="button" onClick={() => handleFotoChange(index, '')} className="text-[10px] text-rose-600 font-semibold hover:underline cursor-pointer">🗑️ Quitar</button>
                        )}
                      </div>

                      {/* Vista previa en miniatura de la foto cargada */}
                      {foto ? (
                        <div className="w-full h-24 rounded-xl overflow-hidden border border-stone-200 bg-white shadow-xs">
                          <img src={foto} alt={`Miniatura ${index}`} className="w-full h-full object-cover" />
                        </div>
                      ) : (
                        <div className="w-full h-24 border border-dashed border-stone-200 rounded-xl flex items-center justify-center text-stone-300 font-light text-xs italic bg-white select-none">
                          Vacío — Sin archivo
                        </div>
                      )}

                      {/* Botón nativo de carga por celda */}
                      <label className="w-full bg-white border border-stone-200 hover:bg-stone-50 text-stone-700 text-[10px] uppercase tracking-wider font-bold py-2.5 rounded-xl text-center cursor-pointer block transition-colors shadow-2xs">
                        {subiendoIndex === index ? '⏱️ Cargando...' : foto ? '🔄 Reemplazar Archivo' : '📤 Subir Fotografía'}
                        <input type="file" accept="image/*" disabled={estaBloqueado} onChange={(e) => handleSubirArchivo(e, index, false)} className="hidden" />
                      </label>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* BARRA PUBLICACIÓN */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200/60 shadow-xs flex flex-col justify-between h-full space-y-6 sticky top-6">
            <div className="space-y-4">
              <h4 className="text-base font-serif font-medium text-stone-900">Estado de Publicación</h4>
              <hr className="border-stone-100" />
              <div className="space-y-2 text-xs font-light text-stone-500">
                <div className="flex justify-between border-b pb-1.5 border-stone-50"><span>Plan:</span><strong className="text-stone-700 font-bold uppercase">{planContratado}</strong></div>
                <div className="flex justify-between border-b pb-1.5 border-stone-50"><span>Imágenes listas:</span><strong className="text-stone-700 font-bold">{galeriaFotos.filter(u => u.trim()!=='').length} de {maxFotosPermitidas}</strong></div>
                <div className="flex justify-between"><span>Audio:</span><span className="text-amber-700 font-mono truncate max-w-[120px]">{musicUrl}</span></div>
              </div>
            </div>
            <button type="button" disabled={guardando} onClick={handlePublicarTodo} className="w-full bg-stone-950 hover:bg-emerald-700 text-white text-xs uppercase font-bold tracking-widest py-4 rounded-xl shadow-md transition-all text-center">
              {guardando ? 'Sincronizando...' : '🚀 Lanzar Cambios en Vivo'}
            </button>
          </div>

        </div>
      </main>
    </div>
  );
}