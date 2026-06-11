"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ImageUploader from '@/components/ImageUploader';
import { motion, AnimatePresence } from 'framer-motion';
// 1. IMPORTAMOS TU CONEXIÓN SEGURA DE SUPABASE
import { supabase } from '@/lib/supabase'; 
export const dynamic = 'force-dynamic';

export default function DashboardNovios() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('basicos');
  const [guardando, setGuardando] = useState(false);
  const [cargandoInvitados, setCargandoInvitados] = useState(false);
  const [verificandoSesion, setVerificandoSesion] = useState(true);
  
  // Estado para almacenar los datos del usuario logueado en Supabase
  const [usuarioActivo, setUsuarioActivo] = useState(null);

  // 💎 Selector Piloto de Planes: 'basicos' | 'premium' | 'vip'
  const [planType, setPlanType] = useState('premium'); 

  // 📸 Estados independientes para multimedia e invitados
  const [coverImage, setCoverImage] = useState('');
  const [galleryImages, setGalleryImages] = useState([]); 
  const [listaInvitados, setListaInvitados] = useState([]);

  // 🎵 ESTADOS INDEPENDIENTES PARA LA MÚSICA DE FONDO
  const [tipoMusica, setTipoMusica] = useState('default'); // 'default' o 'custom'
  const [cancionElegida, setCancionElegida] = useState('/music/1-thousand-years.mp3');
  const [archivoMp3, setArchivoMp3] = useState(null);
  const [errorMusica, setErrorMusica] = useState('');

  // Estados para el mini-formulario de agregar invitados de los novios
  const [nuevoInvitado, setNuevoInvitado] = useState('');
  const [pasesAsignados, setPasesAsignados] = useState(2);
  
  // Estado que recolecta toda la información de la boda
  const [formData, setFormData] = useState({
    groomName: '', brideName: '', eventDate: '', welcomePhrase: '',
    ceremoniaHora: '', ceremoniaLugar: '', ceremoniaMapsUrl: '',
    recepcionHora: '', recepcionLugar: '', recepcionMapsUrl: '',
    codigoVestimenta: 'Formal / Gala',
    banco: '', titular: '', clabe: '', amazonUrl: '', liverpoolUrl: ''
  });

  // 📐 Reglas de negocio automatizadas por plan
  const limitesPorPlan = {
    basicos: { maxFotos: 3, permiteRegalos: false, permiteInvitados: false, nombre: "💍 Plan Digital Básico" },
    premium: { maxFotos: 6, permiteRegalos: true, permiteInvitados: true, nombre: "🌟 Gran Día Premium" },
    vip: { maxFotos: 10, permiteRegalos: true, permiteInvitados: true, nombre: "👑 Clickypapel VIP Celestial" }
  };

  const planActual = limitesPorPlan[planType];
  const slugUrl = `${formData.groomName.toLowerCase()}-y-${formData.brideName.toLowerCase()}`.replace(/\s+/g, '-');

  // 🔐 CONTROL DE ACCESO SEGURIZADO: Validar sesión del usuario al cargar la página
  useEffect(() => {
    const revisarSesion = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error || !user) {
        // Si no hay una sesión activa, expulsamos al intruso al login de inmediato
        router.push('/login');
      } else {
        setUsuarioActivo(user);
        setVerificandoSesion(false);
      }
    };
    revisarSesion();
  }, [router]);

  // Jalar la lista de invitados en tiempo real cuando se abra la pestaña correspondiente
  useEffect(() => {
    if (!verificandoSesion && activeTab === 'invitados' && planActual.permiteInvitados && formData.groomName && formData.brideName) {
      jalarListaInvitados();
    }
  }, [activeTab, planType, verificandoSesion]);

  const jalarListaInvitados = async () => {
    setCargandoInvitados(true);
    const { data, error } = await supabase
      .from('invitados')
      .select('*')
      .eq('boda_slug', slugUrl)
      .eq('user_id', usuarioActivo?.id) // Traemos solo los invitados vinculados a este usuario
      .order('id', { ascending: false });

    if (!error && data) {
      setListaInvitados(data);
    }
    setCargandoInvitados(false);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddGalleryImage = (url) => {
    if (galleryImages.length >= planActual.maxFotos) return;
    setGalleryImages((prev) => [...prev, url]);
  };

  // 🚪 Función para cerrar sesión con seguridad de Supabase Auth
  const handleCerrarSesion = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  // 🔒 Candado de validación estricta de archivo .mp3
  const handleSubirMp3 = (e) => {
    const file = e.target.files[0];
    setErrorMusica('');

    if (!file) return;

    if (file.type !== "audio/mpeg" && !file.name.endsWith('.mp3')) {
      setErrorMusica("❌ Error: El archivo debe ser estrictamente formato .MP3");
      setArchivoMp3(null);
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      setErrorMusica("❌ El archivo es muy pesado. Máximo 8MB.");
      setArchivoMp3(null);
      return;
    }

    setArchivoMp3(file);
  };

  // ➕ Guardar un nuevo invitado amarrado al usuario de forma privada
  const handleAgregarInvitado = async (e) => {
    e.preventDefault();
    if (!nuevoInvitado.trim()) return;
    if (!formData.groomName || !formData.brideName) {
      alert("Por favor, llena primero los nombres de los novios en la pestaña de Datos Básicos.");
      setActiveTab('basicos');
      return;
    }

    const { data, error } = await supabase
      .from('invitados')
      .insert([
        {
          boda_slug: slugUrl,
          nombre_invitado: nuevoInvitado.trim(),
          pases_totales: parseInt(pasesAsignados),
          estado: 'pendiente',
          user_id: usuarioActivo.id // 🔒 Inyectamos la firma única del dueño
        }
      ]);

    if (error) {
      alert("Error al guardar invitado: " + error.message);
    } else {
      setNuevoInvitado('');
      setPasesAsignados(2);
      jalarListaInvitados(); // Refrescar la tabla al instante
    }
  };

  // 🔒 GUARDADO GLOBAL DE LA BODA CON FILTRADO POR USUARIO
  const handleSubmit = async (e) => {
    e.preventDefault();
    setGuardando(true);
    setErrorMusica('');

    let finalMusicUrl = cancionElegida;

    try {
      // 🚀 SUBIDA DINÁMICA DEL AUDIO SI ES PREMIUM/VIP Y HAY ARCHIVO PERSONALIZADO
      if (planType !== 'basicos' && tipoMusica === 'custom' && archivoMp3) {
        const nombreArchivo = `music-${Date.now()}.mp3`;
        const rutaStorage = `${slugUrl}/musica/${nombreArchivo}`;

        const { data: storageData, error: storageError } = await supabase.storage
          .from('invitaciones')
          .upload(rutaStorage, archivoMp3, { cacheControl: '3600', upsert: true });

        if (storageError) throw new Error(`Error subiendo música: ${storageError.message}`);

        const { data: urlData } = supabase.storage
          .from('invitaciones')
          .getPublicUrl(rutaStorage);

        finalMusicUrl = urlData.publicUrl;
      }

      // Estructura final que va directo a PostgreSQL
      const { data, error } = await supabase
        .from('bodas') 
        .insert([
          {
            groom_name: formData.groomName,
            bride_name: formData.brideName,
            event_date: formData.eventDate,
            welcome_phrase: formData.welcomePhrase,
            ceremonia_hora: formData.ceremoniaHora,
            ceremonia_lugar: formData.ceremoniaLugar,
            ceremonia_maps_url: planType !== 'basicos' ? formData.ceremoniaMapsUrl : null,
            recepcion_hora: formData.recepcionHora,
            recepcion_lugar: formData.recepcionLugar,
            recepcion_maps_url: planType !== 'basicos' ? formData.recepcionMapsUrl : null,
            codigo_vestimenta: formData.codigoVestimenta,
            banco: planActual.permiteRegalos ? formData.banco : null,
            titular: planActual.permiteRegalos ? formData.titular : null,
            clabe: planActual.permiteRegalos ? formData.clabe : null,
            amazon_url: planActual.permiteRegalos ? formData.amazonUrl : null,
            liverpool_url: planActual.permiteRegalos ? formData.liverpoolUrl : null,
            slug: slugUrl,
            cover_image: coverImage, 
            gallery_images: galleryImages,
            plan_type: planType,
            user_id: usuarioActivo.id, // 🔒 El registro queda atado únicamente a este perfil
            
            // 🎵 NUEVOS CAMPOS ADICIONALES DE MÚSICA SINCRO CON BASE DE DATOS
            music_type: planType !== 'basicos' ? tipoMusica : 'default',
            music_url: planType !== 'basicos' ? finalMusicUrl : '/music/1-thousand-years.mp3'
          }
        ]);

      if (error) throw new Error(error.message);

      alert(`¡Felicidades! Tu invitación bajo el ${planActual.nombre} ha sido activada en: tugrandia.icu/${slugUrl}`);

    } catch (err) {
      console.error("Error al procesar la operación:", err.message);
      alert(`Hubo un error al activar la invitación: ${err.message}`);
    } finally {
      setGuardando(false);
    }
  };

  // Estructura de pestañas dinámicas
  const tabs = [
    { id: 'basicos', label: '💍 Datos Básicos' },
    { id: 'logistica', label: '⛪ Lugar y Hora' },
    ...(planActual.permiteRegalos ? [{ id: 'regalos', label: '🎁 Regalos' }] : []),
    ...(planActual.permiteInvitados ? [{ id: 'invitados', label: '📊 Lista de Invitados' }] : [])
  ];

  const tempSlug = `${formData.groomName || 'boda'}-${formData.brideName || 'nueva'}`.toLowerCase().replace(/\s+/g, '-');

  // Mientras se valida el token de sesión con el servidor, pintamos un estado de carga elegante
  if (verificandoSesion) {
    return (
      <div className="min-h-screen bg-stone-50 font-sans flex items-center justify-center flex-col gap-2">
        <p className="text-sm font-serif tracking-widest text-stone-900 animate-pulse">clicky<span className="text-amber-600 font-normal">papel</span>.com</p>
        <p className="text-[10px] uppercase font-bold tracking-wider text-stone-400">Verificando Credenciales de Acceso...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-800 flex flex-col">
      
      {/* HEADER PRINCIPAL CON CIERRE DE SESIÓN */}
      <header className="w-full bg-white border-b border-stone-200/80 px-6 py-4 flex items-center justify-between shadow-xs sticky top-0 z-50">
        <a href="https://clickypapel.com" className="flex items-center gap-2 group">
          <span className="font-serif text-lg tracking-wider font-light text-stone-900 group-hover:text-amber-700 transition-colors">
            clicky<span className="font-normal text-amber-600">papel</span>.com
          </span>
        </a>
        
        <div className="flex items-center gap-4">
          {/* Selector de Plan para Pruebas */}
          <div className="hidden sm:flex items-center gap-2 bg-stone-100 p-1 rounded-xl border border-stone-200">
            <span className="text-[10px] uppercase font-bold text-stone-400 pl-2">Plan Piloto:</span>
            <select 
              value={planType} 
              onChange={(e) => { setPlanType(e.target.value); setActiveTab('basicos'); }}
              className="text-xs font-semibold bg-white text-stone-700 px-2 py-1 rounded-lg border-none focus:outline-none cursor-pointer"
            >
              <option value="basicos">Básico</option>
              <option value="premium">Premium</option>
              <option value="vip">VIP Celestial</option>
            </select>
          </div>

          {/* Botón Profesional de Salida */}
          <button 
            type="button"
            onClick={handleCerrarSesion}
            className="text-xs font-medium text-stone-500 hover:text-rose-700 bg-stone-100 hover:bg-rose-50 px-4 py-2 rounded-full transition-all uppercase tracking-wider border border-transparent hover:border-rose-200 cursor-pointer"
          >
            Cerrar Sesión ✕
          </button>
        </div>
      </header>

      {/* Contenedor del Dashboard */}
      <div className="flex-1 py-12 px-4 max-w-3xl w-full mx-auto">
        <div className="bg-white border border-stone-200/60 rounded-3xl shadow-xs overflow-hidden relative">
          
          {activeTab !== 'basicos' && (
            <button
              type="button"
              onClick={() => setActiveTab(activeTab === 'invitados' ? (planActual.permiteRegalos ? 'regalos' : 'logistica') : activeTab === 'regalos' ? 'logistica' : 'basicos')}
              className="absolute top-6 left-6 text-stone-400 hover:text-white transition-colors text-xs flex items-center gap-1.5 z-10 bg-stone-800/40 px-3 py-1.5 rounded-full backdrop-blur-xs border border-stone-700/30 cursor-pointer"
            >
              ← Paso anterior
            </button>
          )}

          {/* Encabezado con Distintivo de Plan */}
          <div className="bg-stone-900 p-8 text-white text-center space-y-2 pt-14 md:pt-8">
            <span className="text-[10px] bg-amber-600/20 text-amber-400 border border-amber-500/30 px-3 py-1 rounded-full uppercase tracking-widest font-semibold">
              {planActual.nombre}
            </span>
            <h1 className="font-serif text-2xl md:text-3xl font-light tracking-wide pt-1">Configura Tu Gran Día</h1>
            <p className="text-stone-500 font-mono text-[10px]">{usuarioActivo?.email}</p>
          </div>

          {/* Pestañas de Navegación */}
          <div className="flex border-b border-stone-100 bg-stone-50/50">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-4 text-xs md:text-sm font-medium transition-all relative ${
                  activeTab === tab.id ? 'text-amber-700' : 'text-stone-400 hover:text-stone-600'
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <motion.div layoutId="activeDashboardTab" className="absolute bottom-0 left-0 right-0 h-[2px] bg-amber-600" />
                )}
              </button>
            ))}
          </div>

          {/* Formulario */}
          <form onSubmit={handleSubmit} className="p-6 md:p-10 space-y-8">
            <AnimatePresence mode="wait">
              
              {/* PESTAÑA 1: DATOS BÁSICOS */}
              {activeTab === 'basicos' && (
                <motion.div key="basicos" initial={{ opacity: 1, x: 0 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-semibold uppercase tracking-wider text-stone-500">Nombre del Novio</label>
                      <input type="text" name="groomName" value={formData.groomName} onChange={handleChange} placeholder="Ej. Abiel" required className="w-full px-4 py-3 border border-stone-200 rounded-xl text-sm focus:outline-none" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-semibold uppercase tracking-wider text-stone-500">Nombre de la Novia</label>
                      <input type="text" name="brideName" value={formData.brideName} onChange={handleChange} placeholder="Ej. Debanhi" required className="w-full px-4 py-3 border border-stone-200 rounded-xl text-sm focus:outline-none" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-stone-500">Fecha y Hora del Evento</label>
                    <input type="datetime-local" name="eventDate" value={formData.eventDate} onChange={handleChange} className="w-full px-4 py-3 border border-stone-200 rounded-xl text-sm focus:outline-none text-stone-600" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-stone-500">Frase de Bienvenida / Versículo</label>
                    <textarea name="welcomePhrase" rows="3" value={formData.welcomePhrase} onChange={handleChange} placeholder="Una dedicatoria que abrirá la invitación..." className="w-full px-4 py-3 border border-stone-200 rounded-xl text-sm focus:outline-none" />
                  </div>

                  {/* 🎵 MÓDULO INTERACTIVO DE MÚSICA DE FONDO INTEGRADO DE FORMA PROFESIONAL */}
                  <div className="p-5 bg-stone-50/70 border border-stone-200/80 rounded-2xl space-y-4">
                    <div>
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-700">🎵 Banda Sonora de la Invitación</h4>
                      <p className="text-stone-400 text-[11px] font-light">Establece la melodía de fondo para cuando abran el sobre digital.</p>
                    </div>

                    {planType === 'basicos' ? (
                      /* Caso Plan Básico: Música Fija */
                      <div className="bg-amber-50/50 border border-amber-200/50 p-3 rounded-xl text-[11px] text-amber-800">
                        🔒 El Plan Básico reproduce **Clásico Romántico** por defecto. Sube de categoría a Premium o VIP para seleccionar temas musicales o subir tu propio track personalizado.
                      </div>
                    ) : (
                      /* Caso Plan Premium / VIP: Selector y Uploader */
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${tipoMusica === 'default' ? 'border-amber-500 bg-amber-50/10' : 'border-stone-200 bg-white'}`}>
                            <input type="radio" name="dashboard_music_type" checked={tipoMusica === 'default'} onChange={() => { setTipoMusica('default'); setErrorMusica(''); }} className="accent-amber-700" />
                            <div className="text-left">
                              <span className="text-xs font-semibold block text-stone-800">Opciones Gratis</span>
                              <span className="text-[10px] text-stone-400 font-light">5 tracks finos incluidos.</span>
                            </div>
                          </label>

                          <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${tipoMusica === 'custom' ? 'border-amber-500 bg-amber-50/10' : 'border-stone-200 bg-white'}`}>
                            <input type="radio" name="dashboard_music_type" checked={tipoMusica === 'custom'} onChange={() => { setTipoMusica('custom'); setErrorMusica(''); }} className="accent-amber-700" />
                            <div className="text-left">
                              <span className="text-xs font-semibold block text-amber-950">Música Personalizada 👑</span>
                              <span className="text-amber-700 font-mono text-[10px] font-bold bg-amber-100/50 px-1 rounded-xs">+ $350 MXN</span>
                            </div>
                          </label>
                        </div>

                        {tipoMusica === 'default' ? (
                          <div className="space-y-1.5 text-left">
                            <label className="text-[10px] font-bold text-stone-400 uppercase">Selecciona tu melodía:</label>
                            <select value={cancionElegida} onChange={(e) => setCancionElegida(e.target.value)} className="w-full text-xs p-3 border border-stone-200 bg-white rounded-xl focus:outline-none cursor-pointer">
                              <option value="/music/1-thousand-years.mp3">1. Clásico Romántico (A Thousand Years - Piano & Cello)</option>
                              <option value="/music/2-perfect-acoustic.mp3">2. Pop Acústico (Perfect - Guitarra)</option>
                              <option value="/music/3-canon-in-d.mp3">3. Elegancia Tradicional (Canon en Re - Cuerdas)</option>
                              <option value="/music/4-can-help-falling.mp3">4. Vintage Emotivo (Can't Help Falling in Love - Elvis)</option>
                              <option value="/music/5-marry-me.mp3">5. Instrumental Dulce (Marry Me - Piano)</option>
                            </select>
                          </div>
                        ) : (
                          <div className="p-4 bg-white border border-dashed border-stone-300 rounded-xl space-y-2 text-left">
                            <label className="text-[10px] font-bold text-stone-500 uppercase block">Sube tu archivo .MP3:</label>
                            <input type="file" accept=".mp3,audio/mpeg" onChange={handleSubirMp3} className="text-xs text-stone-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-semibold file:bg-amber-100 file:text-amber-800 hover:file:bg-amber-200 cursor-pointer w-full" />
                            
                            {archivoMp3 && <p className="text-emerald-600 text-[11px] font-medium">✓ Audio cargado: {archivoMp3.name}</p>}
                            {errorMusica && <p className="text-rose-600 text-[11px] font-medium">{errorMusica}</p>}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Multimedia */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <ImageUploader folderSlug={tempSlug} onUploadComplete={(url) => setCoverImage(url)} label="Foto de Portada (Banner Principal)" />

                    {galleryImages.length < planActual.maxFotos ? (
                      <ImageUploader folderSlug={`${tempSlug}/galeria`} onUploadComplete={handleAddGalleryImage} label={`Añadir Foto a la Galería (Máx ${planActual.maxFotos})`} />
                    ) : (
                      <div className="border border-dashed border-amber-200 bg-amber-50/40 p-4 rounded-xl flex flex-col items-center justify-center text-center">
                        <p className="text-[11px] text-amber-800 font-semibold uppercase tracking-wider">Límite Alcanzado ({planActual.maxFotos})</p>
                      </div>
                    )}
                  </div>

                  {galleryImages.length > 0 && (
                    <div className="bg-stone-50 p-3 rounded-xl border border-stone-100 flex flex-wrap gap-2 justify-center">
                      {galleryImages.map((img, i) => (
                        <div key={i} className="w-10 h-10 rounded-md overflow-hidden bg-stone-200 border border-stone-300">
                          <img src={img} className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="pt-4 border-t border-stone-100 flex justify-end">
                    <button type="button" onClick={() => setActiveTab('logistica')} className="bg-amber-700 hover:bg-amber-800 text-white font-medium text-xs md:text-sm px-6 py-3 rounded-xl transition-all cursor-pointer">Siguiente step ➔</button>
                  </div>
                </motion.div>
              )}

              {/* PESTAÑA 2: LOGÍSTICA */}
              {activeTab === 'logistica' && (
                <motion.div key="logistica" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-6">
                  <div className="p-4 bg-stone-50 rounded-2xl border border-stone-100 space-y-4">
                    <h3 className="font-serif text-stone-800 font-medium text-base">⛪ Ceremonia Religiosa</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="col-span-1 space-y-1">
                        <label className="text-[10px] font-semibold text-stone-400 uppercase">Hora</label>
                        <input type="text" name="ceremoniaHora" value={formData.ceremoniaHora} onChange={handleChange} placeholder="17:00 HRS" className="w-full px-3 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none" />
                      </div>
                      <div className="col-span-2 space-y-1">
                        <label className="text-[10px] font-semibold text-stone-400 uppercase">Lugar / Templo</label>
                        <input type="text" name="ceremoniaLugar" value={formData.ceremoniaLugar} onChange={handleChange} placeholder="Nombre de la Iglesia" className="w-full px-3 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none" />
                      </div>
                    </div>
                    {planType !== 'basicos' ? (
                      <input type="text" name="ceremoniaMapsUrl" value={formData.ceremoniaMapsUrl} onChange={handleChange} placeholder="Enlace de Google Maps de la Ceremonia" className="w-full px-4 py-2.5 border border-stone-200 rounded-xl text-xs focus:outline-none" />
                    ) : (
                      <p className="text-[10px] text-amber-700 bg-amber-50 px-3 py-2 rounded-lg font-medium">📍 Los mapas GPS interactivos requieren el Plan Premium o VIP.</p>
                    )}
                  </div>

                  <div className="p-4 bg-stone-50 rounded-2xl border border-stone-100 space-y-4">
                    <h3 className="font-serif text-stone-800 font-medium text-base">🥂 Recepción / Fiesta</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="col-span-1 space-y-1">
                        <label className="text-[10px] font-semibold text-stone-400 uppercase">Hora</label>
                        <input type="text" name="recepcionHora" value={formData.recepcionHora} onChange={handleChange} placeholder="19:30 HRS" className="w-full px-3 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none" />
                      </div>
                      <div className="col-span-2 space-y-1">
                        <label className="text-[10px] font-semibold text-stone-400 uppercase">Salón / Quinta</label>
                        <input type="text" name="recepcionLugar" value={formData.recepcionLugar} onChange={handleChange} placeholder="Nombre del Salón de Eventos" className="w-full px-3 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none" />
                      </div>
                    </div>
                    {planType !== 'basicos' && (
                      <input type="text" name="recepcionMapsUrl" value={formData.recepcionMapsUrl} onChange={handleChange} placeholder="Enlace de Google Maps de la Recepción" className="w-full px-4 py-2.5 border border-stone-200 rounded-xl text-xs focus:outline-none" />
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-stone-500">Código de Vestimenta</label>
                    <select name="codigoVestimenta" value={formData.codigoVestimenta} onChange={handleChange} className="w-full px-4 py-3 border border-stone-200 rounded-xl text-sm bg-white focus:outline-none">
                      <option value="Formal / Gala">Formal / Gala</option>
                      <option value="Formal Playa / Guayabera">Formal Playa / Guayabera</option>
                      <option value="Cocktail">Cocktail</option>
                    </select>
                  </div>

                  <div className="pt-4 border-t border-stone-100 flex justify-between gap-4">
                    <button type="button" onClick={() => setActiveTab('basicos')} className="border border-stone-300 text-stone-600 hover:bg-stone-50 font-medium text-xs md:text-sm px-5 py-3 rounded-xl transition-all cursor-pointer">⬅ Atrás</button>
                    {planActual.permiteRegalos ? (
                      <button type="button" onClick={() => setActiveTab('regalos')} className="bg-amber-700 hover:bg-amber-800 text-white font-medium text-xs md:text-sm px-6 py-3 rounded-xl transition-all cursor-pointer">Siguiente step ➔</button>
                    ) : (
                      <button type="submit" disabled={guardando} className="bg-stone-900 hover:bg-stone-800 text-white font-medium text-xs md:text-sm px-8 py-3.5 rounded-xl transition-all shadow-sm cursor-pointer">{guardando ? "Guardando..." : "🔒 Activar Invitación Básica"}</button>
                    )}
                  </div>
                </motion.div>
              )}

              {/* PESTAÑA 3: REGALOS */}
              {activeTab === 'regalos' && planActual.permiteRegalos && (
                <motion.div key="regalos" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-6">
                  <div className="p-4 bg-stone-50 rounded-2xl border border-stone-100 space-y-4">
                    <h3 className="font-serif text-stone-800 font-medium text-base">✉️ Transferencia (Lluvia de Sobres)</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <input type="text" name="banco" value={formData.banco} onChange={handleChange} placeholder="Banco (ej. BBVA)" className="w-full px-3 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none" />
                      <input type="text" name="titular" value={formData.titular} onChange={handleChange} placeholder="Nombre del Titular" className="w-full px-3 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none" />
                    </div>
                    <input type="text" name="clabe" value={formData.clabe} onChange={handleChange} placeholder="CLABE Interbancaria (18 dígitos)" className="w-full px-4 py-2.5 border border-stone-200 rounded-xl text-sm tracking-wider font-mono focus:outline-none" />
                  </div>

                  <div className="p-4 bg-stone-50 rounded-2xl border border-stone-100 space-y-4">
                    <h3 className="font-serif text-stone-800 font-medium text-base">🛍️ Tiendas Online (Links de Mesas)</h3>
                    <input type="text" name="amazonUrl" value={formData.amazonUrl} onChange={handleChange} placeholder="Enlace a Mesa de Regalos de Amazon" className="w-full px-4 py-2.5 border border-stone-200 rounded-xl text-xs focus:outline-none" />
                    <input type="text" name="liverpoolUrl" value={formData.liverpoolUrl} onChange={handleChange} placeholder="Enlace a Mesa de Regalos de Liverpool" className="w-full px-4 py-2.5 border border-stone-200 rounded-xl text-xs focus:outline-none" />
                  </div>

                  <div className="pt-4 border-t border-stone-100 flex justify-between gap-4">
                    <button type="button" onClick={() => setActiveTab('logistica')} className="border border-stone-300 text-stone-600 hover:bg-stone-50 font-medium text-xs md:text-sm px-5 py-3 rounded-xl transition-all cursor-pointer">⬅ Atrás</button>
                    {planActual.permiteInvitados ? (
                      <button type="button" onClick={() => setActiveTab('invitados')} className="bg-amber-700 hover:bg-amber-800 text-white font-medium text-xs md:text-sm px-6 py-3 rounded-xl transition-all cursor-pointer">Siguiente: Invitados ➔</button>
                    ) : (
                      <button type="submit" disabled={guardando} className="bg-stone-900 hover:bg-stone-800 text-white font-medium text-xs md:text-sm px-8 py-3.5 rounded-xl transition-all shadow-sm cursor-pointer">{guardando ? "Guardando..." : "🔒 Activar Invitación Premium"}</button>
                    )}
                  </div>
                </motion.div>
              )}

              {/* PESTAÑA 4: LISTA DE INVITADOS EN TIEMPO REAL */}
              {activeTab === 'invitados' && planActual.permiteInvitados && (
                <motion.div key="invitados" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-6">
                  
                  {/* Mini Formulario Interno para Agregar Invitados */}
                  <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200/60 space-y-4">
                    <h3 className="font-serif text-stone-800 font-medium text-sm uppercase tracking-wider">➕ Registrar Nuevo Invitado</h3>
                    <div className="grid grid-cols-3 gap-4 items-end">
                      <div className="col-span-2 space-y-1">
                        <label className="text-[10px] font-bold text-stone-400 uppercase">Nombre / Familia</label>
                        <input type="text" value={nuevoInvitado} onChange={(e) => setNuevoInvitado(e.target.value)} placeholder="Ej: Familia Martínez Pérez o Sr. Alberto" className="w-full px-3 py-2 border border-stone-200 rounded-xl text-sm focus:outline-none bg-white" />
                      </div>
                      <div className="col-span-1 space-y-1">
                        <label className="text-[10px] font-bold text-stone-400 uppercase">Pases</label>
                        <input type="number" min="1" max="20" value={pasesAsignados} onChange={(e) => setPasesAsignados(e.target.value)} className="w-full px-3 py-2 border border-stone-200 rounded-xl text-sm focus:outline-none bg-white" />
                      </div>
                    </div>
                    <button type="button" onClick={handleAgregarInvitado} className="w-full bg-amber-700 hover:bg-amber-800 text-white font-medium text-xs py-2.5 rounded-xl transition-all uppercase tracking-wider cursor-pointer">Agregar a la base de datos</button>
                  </div>

                  {/* Tabla Viva en Tiempo Real */}
                  <div className="space-y-2">
                    <h3 className="font-serif text-stone-800 font-medium text-base">📊 Estatus de Asistencia en Vivo</h3>
                    
                    {cargandoInvitados ? (
                      <p className="text-xs text-stone-400 text-center py-4 animate-pulse">Sincronizando con Supabase... ⏳</p>
                    ) : listaInvitados.length === 0 ? (
                      <p className="text-xs text-stone-400 text-center py-6 border border-dashed border-stone-200 rounded-xl bg-stone-50/50">Aún no has registrado invitados. Usa el formulario de arriba para armar tu lista.</p>
                    ) : (
                      <div className="overflow-x-auto rounded-xl border border-stone-200">
                        <table className="w-full text-left border-collapse bg-white text-xs">
                          <thead>
                            <tr className="bg-stone-900 text-white font-mono uppercase text-[10px] tracking-wider">
                              <th className="p-3">Invitado</th>
                              <th className="p-3 text-center">Asignados</th>
                              <th className="p-3 text-center">Confirmados</th>
                              <th className="p-3 text-center">Estatus</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-stone-100 text-stone-600">
                            {listaInvitados.map((inv) => (
                              <tr key={inv.id} className="hover:bg-stone-50/80 transition-colors">
                                <td className="p-3 font-medium text-stone-800">{inv.nombre_invitado}</td>
                                <td className="p-3 text-center font-mono">{inv.pases_totales} pases</td>
                                <td className="p-3 text-center font-mono">{inv.estado === 'confirmado' ? `${inv.pases_confirmados} pases` : '-'}</td>
                                <td className="p-3 text-center">
                                  <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wide ${
                                    inv.estado === 'confirmado' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' :
                                    inv.estado === 'declinado' ? 'bg-rose-50 text-rose-700 border border-rose-200' :
                                    'bg-amber-50 text-amber-700 border border-amber-200'
                                  }`}>
                                    {inv.estado === 'pendiente' ? '⏳ Pendiente' : inv.estado === 'confirmado' ? '✅ Asistirá' : '❌ Declinó'}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>

                  {/* BOTONES FINALES DE LA ÚLTIMA PESTAÑA */}
                  <div className="pt-4 border-t border-stone-100 flex justify-between gap-4">
                    <button type="button" onClick={() => setActiveTab('regalos')} className="border border-stone-300 text-stone-600 hover:bg-stone-50 font-medium text-xs md:text-sm px-5 py-3 rounded-xl transition-all cursor-pointer">⬅ Atrás</button>
                    <button type="submit" disabled={guardando} className="bg-stone-900 hover:bg-stone-800 text-white font-medium text-xs md:text-sm px-8 py-3.5 rounded-xl transition-all shadow-sm transform hover:scale-102 cursor-pointer">
                      {guardando ? "Activando sistema..." : "🔒 Guardar y Activar Invitación"}
                    </button>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </form>
        </div>
      </div>
    </div>
  );
}