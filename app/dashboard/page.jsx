"use client";
import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';

function NoviosDashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 🔐 El evento que se edita sale de la sesión, no de una constante.
  const [usuario, setUsuario] = useState(null);
  const [weddingSlug, setWeddingSlug] = useState(null);
  const [misEventos, setMisEventos] = useState([]);
  const [sinEventos, setSinEventos] = useState(false);

  // 📂 CATÁLOGO INTELIGENTE DE PLANTILLAS
  const catalogos = {
    boda: [
      { id: 'v1', nombre: '💍 Minimalista Clásica' },
      { id: 'v2', nombre: '✨ Alta Costura Editorial' },
      { id: 'v3', nombre: '🌿 Botánica Orgánica' },
      { id: 'v4', nombre: '🌑 Noir Modernista' },
      { id: 'v5', nombre: '🏛️ Imperial Vintage' }
    ],
    xvanos: [
      { id: 'v1', nombre: '👑 Real Clásica' },
      { id: 'v2', nombre: '✨ Glamour Editorial' },
      { id: 'v3', nombre: '🌸 Jardín Encantado' },
      { id: 'v4', nombre: '🌃 Noche Neón' },
      { id: 'v5', nombre: '🎀 Vintage Candy' }
    ],
    baby: [
      { id: 'v1', nombre: '☁️ Nube Minimalista' },
      { id: 'v2', nombre: '🧸 Estilo Editorial' },
      { id: 'v3', nombre: '🌿 Boho Baby' }
    ],
    bautizo: [
      { id: 'v1', nombre: '🕊️ Pureza Clásica' },
      { id: 'v2', nombre: '✨ Divina Editorial' },
      { id: 'v3', nombre: '🌾 Campo Santo' }
    ],
    despedida: [
      { id: 'v1', nombre: '🥂 Minimalista Chic' },
      { id: 'v2', nombre: '💄 Glamour Night' },
      { id: 'v3', nombre: '🌸 Boho Bride' }
    ]
  };

  // 🎛️ Estados de Control
  const [pasoActivo, setPasoActivo] = useState(2); 
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [subiendoIndex, setSubiendoIndex] = useState(null);
  const [subiendoMusica, setSubiendoMusica] = useState(false);

  // 🪙 Información de Compra
  const [planContratado, setPlanContratado] = useState('premium'); 
  const [tieneMusicaPersonalizada, setTieneMusicaPersonalizada] = useState(false); 
  const [tipoEvento, setTipoEvento] = useState('boda'); 

  // 📸✨ ESTADOS ÁLBUM COLECTIVO
  const [albumActivado, setAlbumActivado] = useState(false);
  const [codigoMesaUrl, setCodigoMesaUrl] = useState('');
  const [fotosDelEvento, setFotosDelEvento] = useState([]); 

  // 📝 ESTADOS PASO 2
  const [brideName, setBrideName] = useState('');
  const [groomName, setGroomName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [welcomePhrase, setWelcomePhrase] = useState('');
  const [ceremoniaLugar, setCeremoniaLugar] = useState('');
  const [ceremoniaMaps, setCeremoniaMaps] = useState('');
  const [recepcionLugar, setRecepcionLugar] = useState('');
  const [recepcionMaps, setRecepcionMaps] = useState('');
  const [templateId, setTemplateId] = useState('v2');

  // 📊 ESTADOS PASO 3
  const [invitados, setInvitados] = useState([]);
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [nuevosPases, setNuevosPases] = useState(2);
  const [invitadoSeleccionado, setInvitadoSeleccionado] = useState(null);

  // 🎵📸 ESTADOS PASO 4
  const [coverImage, setCoverImage] = useState(''); 
  const [musicUrl, setMusicUrl] = useState('/music/1-thousand-years.mp3');
  const [galeriaFotos, setGaleriaFotos] = useState(['', '', '', '', '', '']); 
  const [ceremoniaFoto, setCeremoniaFoto] = useState('');
  const [recepcionFoto, setRecepcionFoto] = useState('');
  const [cancionSonando, setCancionSonando] = useState(null);
  const audioPrevioRef = useRef(null);

  // 💰 ESTADOS PASO 5
  const [banco, setBanco] = useState('');
  const [titular, setTitular] = useState('');
  const [clabe, setClabe] = useState('');
  const [amazonUrl, setAmazonUrl] = useState('');
  const [liverpoolUrl, setLiverpoolUrl] = useState('');

  // 🗓️🎨 ESTADOS PASO 6
  const [itinerarioMisa, setItinerarioMisa] = useState('');
  const [itinerarioFiesta, setItinerarioFiesta] = useState('');
  const [horaBaile, setHoraBaile] = useState('');
  const [horaShow, setHoraShow] = useState('');   
  const [horaFin, setHoraFin] = useState('');     
  const [codigoVestimentaText, setCodigoVestimentaText] = useState('formal'); 
  const [paletaColores, setPaletaColores] = useState('');

  const cancionesCatalogo = [
    { id: '1', titulo: "Clásico Romántico", url: "/music/1. Clásico Romántico.mp3", bpm: "69 BPM" },
    { id: '2', titulo: "Pop Acústico", url: "/music/2. Pop Acústico.mp3", bpm: "95 BPM" },
    { id: '3', titulo: "Elegancia Tradicional", url: "/music/3. Elegancia Tradicional.mp3", bpm: "88 BPM" },
    { id: '4', titulo: "Vintage Emotivo", url: "/music/4. Vintage Emotivo.mp3", bpm: "72 BPM" },
    { id: '5', titulo: "Instrumental Dulce", url: "/music/5. Instrumental Dulce.mp3", bpm: "65 BPM" }
  ];

  const manejarUpgrade = (tipo) => {
    const precio = tipo === 'musica' ? '$299 MXN' : '$599 MXN';
    const producto = tipo === 'musica' ? 'Canción Personalizada' : 'Álbum Colectivo Premium';
    alert(`🚀 Redirigiendo a pasarela de pago segura para agregar [${producto}] por ${precio}. Al pagar, la función se desbloqueará de inmediato.`);
  };

  const handleSubirMusica = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setSubiendoMusica(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${weddingSlug}-custom-music-${Date.now()}.${fileExt}`;
      const filePath = `${weddingSlug}/${fileName}`;
      
      const { error: uploadError } = await supabase.storage.from('invitaciones-media').upload(filePath, file, { cacheControl: '3600', upsert: true });
      if (uploadError) throw uploadError;
      
      const { data: { publicUrl } } = supabase.storage.from('invitaciones-media').getPublicUrl(filePath);
      setMusicUrl(publicUrl);
      alert("🎵 ¡Tu canción se ha subido y procesado con éxito!");
    } catch (err) { alert("Error al cargar el archivo de audio."); } finally { setSubiendoMusica(false); }
  };

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

  const handleFotoChange = (index, value) => {
    const copias = [...galeriaFotos];
    while(copias.length <= index) copias.push(''); 
    copias[index] = value;
    setGaleriaFotos(copias);
  };

  const cargarFotosDelAlbumCompartido = async () => {
    try {
      const { data, error } = await supabase.storage.from('invitaciones-media').list(`${weddingSlug}/album-fiesta/`, { limit: 50, order: { column: 'created_at', ascending: false } });
      if (data && !error) {
        const urlsPublicas = data.map(file => supabase.storage.from('invitaciones-media').getPublicUrl(`${weddingSlug}/album-fiesta/${file.name}`).data.publicUrl);
        setFotosDelEvento(urlsPublicas);
      }
    } catch (e) { console.error(e); }
  };

  const handleSubirArchivo = async (e, index, tipoDoc = 'galeria') => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setSubiendoIndex(tipoDoc === 'galeria' ? index : tipoDoc);
      const fileExt = file.name.split('.').pop();
      const fileName = `${weddingSlug}-${tipoDoc}${index !== null ? `-${index}` : ''}-${Date.now()}.${fileExt}`;
      const filePath = `${weddingSlug}/${fileName}`;
      
      const { error: uploadError } = await supabase.storage.from('invitaciones-media').upload(filePath, file, { cacheControl: '3600', upsert: true });
      if (uploadError) throw uploadError;
      
      const { data: { publicUrl } } = supabase.storage.from('invitaciones-media').getPublicUrl(filePath);
      
      if (tipoDoc === 'portada') setCoverImage(publicUrl);
      else if (tipoDoc === 'ceremonia') setCeremoniaFoto(publicUrl);
      else if (tipoDoc === 'recepcion') setRecepcionFoto(publicUrl);
      else handleFotoChange(index, publicUrl);
      
    } catch (err) { alert("Error al cargar archivo."); } finally { setSubiendoIndex(null); }
  };

  const descargarQR = async (urlQr, nombreArchivo) => {
    try {
      const respuesta = await fetch(urlQr);
      const blob = await respuesta.blob();
      const urlBlob = window.URL.createObjectURL(blob);
      const enlace = document.createElement('a');
      enlace.href = urlBlob;
      enlace.download = `${nombreArchivo}.png`;
      document.body.appendChild(enlace);
      enlace.click();
      document.body.removeChild(enlace);
      window.URL.revokeObjectURL(urlBlob);
    } catch (error) { window.open(urlQr, '_blank'); }
  };

  const cargarTodoElDashboard = async () => {
    if (!weddingSlug) return;
    try {
      setCargando(true);
      const slugLimpio = weddingSlug.toLowerCase().trim();

      const { data: bodaData } = await supabase.from('bodas').select('*').eq('slug', slugLimpio).maybeSingle();

      if (bodaData) {
        setBrideName(bodaData.bride_name || ''); 
        setGroomName(bodaData.groom_name || '');
        setEventDate(bodaData.event_date ? bodaData.event_date.substring(0, 10) : '');
        setWelcomePhrase(bodaData.welcome_phrase || ''); 
        setCeremoniaLugar(bodaData.ceremonia_lugar || ''); 
        setCeremoniaMaps(bodaData.ceremonia_maps_url || '');
        setRecepcionLugar(bodaData.recepcion_lugar || ''); 
        setRecepcionMaps(bodaData.recepcion_maps_url || '');
        setTemplateId(bodaData.template_id || 'v2'); 
        setTipoEvento(bodaData.tipo_evento || 'boda'); 
        setCoverImage(bodaData.cover_image || '');
        setMusicUrl(bodaData.music_url || '/music/1-thousand-years.mp3');
        setPlanContratado(bodaData.plan_tipo || 'premium'); 
        setTieneMusicaPersonalizada(bodaData.musica_extra || false);
        setBanco(bodaData.banco || ''); 
        setTitular(bodaData.titular || ''); 
        setClabe(bodaData.clabe || '');
        setAmazonUrl(bodaData.amazon_url || ''); 
        setLiverpoolUrl(bodaData.liverpool_url || '');
        
        setItinerarioMisa(bodaData.itinerario_misa || ''); 
        setItinerarioFiesta(bodaData.itinerario_fiesta || '');
        setHoraBaile(bodaData.hora_baile || ''); 
        setHoraShow(bodaData.hora_show || '');   
        setHoraFin(bodaData.hora_fin || '');     
        
        setCodigoVestimentaText(bodaData.codigo_vestimenta || 'formal'); 
        setPaletaColores(bodaData.paleta_colores || '');
        setCodigoMesaUrl(`https://tugrandia.icu/${slugLimpio}/compartir`);
        setAlbumActivado(bodaData.album_compartido_activo || false);
        setCeremoniaFoto(bodaData.ceremonia_foto || '');
        setRecepcionFoto(bodaData.recepcion_foto || '');

        if (bodaData.gallery_images) {
          const limite = bodaData.plan_tipo === 'basicos' ? 3 : bodaData.plan_tipo === 'vip' ? 12 : 6;
          const nuevasFotos = Array(limite).fill('');
          bodaData.gallery_images.forEach((img, i) => { if(i < limite) nuevasFotos[i] = img; });
          setGaleriaFotos(nuevasFotos);
        }
      }
      // Ya no creamos bodas solas: solo existen las que el usuario aparta en /registro.

      const { data: listaInvitados } = await supabase.from('invitados').select('*').eq('boda_slug', slugLimpio).order('nombre_invitado', { ascending: true });
      if (listaInvitados) setInvitados(listaInvitados);
      if (bodaData?.plan_tipo !== 'basicos') await cargarFotosDelAlbumCompartido();
      
    } catch (err) { console.error("Error", err); } finally { setCargando(false); }
  };

  // 🔐 Paso 1: verificar sesión y averiguar qué evento le toca editar.
  useEffect(() => {
    let activo = true;

    (async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        router.replace('/login');
        return;
      }
      if (!activo) return;
      setUsuario(session.user);

      const { data: eventos } = await supabase
        .from('bodas')
        .select('slug, bride_name, groom_name, tipo_evento')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (!activo) return;
      setMisEventos(eventos || []);

      if (!eventos || eventos.length === 0) {
        setSinEventos(true);
        setCargando(false);
        return;
      }

      // ?slug= permite elegir cuál editar cuando tiene más de uno.
      const pedido = searchParams.get('slug');
      const elegido = eventos.find((e) => e.slug === pedido) || eventos[0];
      setWeddingSlug(elegido.slug);
    })();

    return () => { activo = false; };
  }, [router, searchParams]);

  // 🔐 Paso 2: cuando ya sabemos el slug, cargamos todo.
  useEffect(() => { if (weddingSlug) cargarTodoElDashboard(); }, [weddingSlug]);

  const cerrarSesion = async () => {
    await supabase.auth.signOut();
    router.replace('/login');
  };

  const toggleAlbumCompartido = async () => {
    const nuevoEstado = !albumActivado; 
    setAlbumActivado(nuevoEstado);
    try { await supabase.from('bodas').update({ album_compartido_activo: nuevoEstado }).eq('slug', weddingSlug); } catch (e) {}
  };

  const handleGuardarYContinuar = async () => {
    setGuardando(true);
    try { 
      await supabase.from('bodas').update({ 
        bride_name: brideName, 
        groom_name: groomName, 
        event_date: eventDate ? `${eventDate}T18:00:00` : null, 
        welcome_phrase: welcomePhrase.trim(),
        ceremonia_lugar: ceremoniaLugar, 
        ceremonia_maps_url: ceremoniaMaps, 
        recepcion_lugar: recepcionLugar, 
        recepcion_maps_url: recepcionMaps, 
        template_id: templateId,
        tipo_evento: tipoEvento 
      }).eq('slug', weddingSlug); 
      setPasoActivo(3); 
    } catch (err) { alert("Error"); } finally { setGuardando(false); }
  };

  const handleAgregarInvitado = async (e) => {
    e.preventDefault(); if (!nuevoNombre.trim()) return; setGuardando(true);
    try { await supabase.from('invitados').insert([{ boda_slug: weddingSlug, nombre_invitado: nuevoNombre.trim(), pases_totales: nuevosPases, pases_confirmados: 0, estado: 'pendiente' }]); setNuevoNombre(''); setNuevosPases(2); const { data } = await supabase.from('invitados').select('*').eq('boda_slug', weddingSlug).order('nombre_invitado', { ascending: true }); if (data) setInvitados(data); } catch (err) { alert("Error"); } finally { setGuardando(false); }
  };

  const handleEliminarInvitado = async (id) => {
    if (!confirm("¿Eliminar?")) return;
    try { await supabase.from('invitados').delete().eq('id', id); setInvitados(invitados.filter(inv => inv.id !== id)); } catch (e) { alert("Error"); }
  };

  const handleGuardarPaso4 = async () => {
    setGuardando(true);
    try {
      const fotosLimpias = galeriaFotos.filter(url => url.trim() !== '');
      await supabase.from('bodas').update({ 
        cover_image: coverImage.trim(), music_url: musicUrl, gallery_images: fotosLimpias,
        ceremonia_foto: ceremoniaFoto.trim(), recepcion_foto: recepcionFoto.trim()
      }).eq('slug', weddingSlug);
      setPasoActivo(5); 
    } catch (err) { alert("Error"); } finally { setGuardando(false); }
  };

  const handleGuardarPaso5 = async () => {
    setGuardando(true);
    try { await supabase.from('bodas').update({ banco: banco.trim(), titular: titular.trim(), clabe: clabe.trim(), amazon_url: amazonUrl.trim(), liverpool_url: liverpoolUrl.trim() }).eq('slug', weddingSlug); setPasoActivo(6); } catch (err) { alert("Error"); } finally { setGuardando(false); }
  };

  const handleGuardarPaso6 = async () => {
    setGuardando(true);
    try { 
      await supabase.from('bodas').update({ 
        itinerario_misa: itinerarioMisa.trim(), 
        itinerario_fiesta: itinerarioFiesta.trim(),
        hora_baile: horaBaile.trim(),
        hora_show: horaShow.trim(),
        hora_fin: horaFin.trim(),
        codigo_vestimenta: codigoVestimentaText, 
        paleta_colores: paletaColores.trim() 
      }).eq('slug', weddingSlug); 
      alert("✅ Configuración guardada y en línea."); 
    } catch (err) { alert("Error al guardar."); } finally { setGuardando(false); }
  };

  const totalInvitados = invitados.length;
  const totalPasesAsignados = invitados.reduce((acc, curr) => acc + (curr.pases_totales || 0), 0);
  const totalConfirmados = invitados.reduce((acc, curr) => acc + (curr.pases_confirmados || 0), 0);
  const pendientes = invitados.filter(inv => inv.estado === 'pendiente').length;

  if (cargando) return (
    <div className="min-h-screen bg-[#fcfbfa] flex flex-col items-center justify-center space-y-4">
      <div className="w-12 h-12 border-2 border-[#9a7b5c] border-t-transparent rounded-full animate-spin" />
      <p className="font-serif text-[#9a7b5c] tracking-widest uppercase text-xs">Cargando tu espacio...</p>
    </div>
  );

  // Tiene cuenta pero todavía no aparta ningún evento.
  if (sinEventos) return (
    <div className="min-h-screen bg-[#fcfbfa] flex flex-col items-center justify-center px-6 text-center font-sans">
      <div className="max-w-sm space-y-5">
        <span className="text-4xl block">✉️</span>
        <h1 className="font-serif text-2xl text-stone-900 font-light">Todavía no tienes un evento</h1>
        <p className="text-sm text-stone-500 font-light leading-relaxed">
          Aparta tu enlace y aquí mismo vas a poder llenar los datos, subir fotos y llevar el control de tus invitados.
        </p>
        <a
          href="/registro"
          className="inline-block bg-stone-900 hover:bg-[#9a7b5c] text-white text-xs uppercase font-bold tracking-widest px-8 py-3.5 rounded-xl transition-colors"
        >
          Crear mi evento
        </a>
        <button
          type="button"
          onClick={cerrarSesion}
          className="block mx-auto text-[10px] uppercase tracking-widest text-stone-400 underline cursor-pointer"
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  );

  const steps = [
    { id: 2, icon: '📋', name: 'Datos Base' },
    { id: 3, icon: '👥', name: 'Invitados' },
    { id: 4, icon: '📸', name: 'Multimedia' },
    { id: 5, icon: '🎁', name: 'Regalos' },
    { id: 6, icon: '⏱️', name: 'Logística' }
  ];

  return (
    <div className="min-h-screen bg-[#fcfbfa] text-stone-800 flex font-sans overflow-hidden">
      <audio ref={audioPrevioRef} loop />

      {/* 🧭 SIDEBAR ELITE */}
      <aside className="hidden lg:flex w-64 bg-stone-950 text-stone-300 flex-col py-8 px-6 border-r border-stone-800 relative z-20 shadow-2xl">
        <div className="font-serif text-2xl tracking-widest font-light text-white mb-12">
          clicky<span className="font-normal text-[#9a7b5c]">papel</span>
        </div>
        
        <div className="mb-8">
          <p className="text-[10px] uppercase tracking-widest text-stone-500 font-bold mb-2">Tu Evento</p>
          <div className="bg-stone-900 border border-stone-800 p-3 rounded-xl flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#9a7b5c]/20 flex items-center justify-center text-[#9a7b5c] font-serif">
              {brideName ? brideName.charAt(0) : 'E'}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm text-white font-medium truncate">{brideName || 'Festejado'} & {groomName || 'Invitados'}</p>
              <p className="text-[10px] text-stone-400 font-mono truncate">/{weddingSlug}</p>
            </div>
          </div>
        </div>

        <nav className="flex flex-col gap-2 w-full">
          {steps.map((step) => (
            <button 
              key={step.id} 
              onClick={() => setPasoActivo(step.id)} 
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                pasoActivo === step.id 
                  ? 'bg-[#9a7b5c] text-white shadow-lg' 
                  : 'text-stone-400 hover:bg-stone-900 hover:text-stone-200'
              }`}
            >
              <span className="text-base">{step.icon}</span>
              {step.name}
            </button>
          ))}
        </nav>

        <div className="mt-auto">
          <a href={`https://tugrandia.icu/${weddingSlug}`} target="_blank" className="flex items-center justify-center gap-2 w-full bg-white text-stone-950 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-stone-200 transition-colors">
            Ver Invitación ➔
          </a>
        </div>
      </aside>

      {/* 🚀 CONTENIDO PRINCIPAL */}
      <main className="flex-1 h-screen overflow-y-auto bg-[#fcfbfa] relative">
        <div className="lg:hidden bg-stone-950 p-4 flex justify-between items-center text-white sticky top-0 z-30">
          <div className="font-serif text-lg tracking-widest">clicky<span className="text-[#9a7b5c]">papel</span></div>
          <a href={`https://tugrandia.icu/${weddingSlug}`} target="_blank" className="text-[10px] bg-[#9a7b5c] px-3 py-1.5 rounded-full uppercase font-bold">Ver Web</a>
        </div>

        <div className="max-w-5xl mx-auto p-6 md:p-12 space-y-8">
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-stone-200 pb-6">
            <div>
              <h1 className="text-3xl font-serif text-stone-900 font-light">
                {steps.find(s => s.id === pasoActivo)?.name || 'Panel'}
              </h1>
              <p className="text-sm text-stone-500 font-light mt-1">Configura cada detalle de tu experiencia digital.</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold tracking-widest text-stone-400">Plan actual:</span>
              <span className="text-[10px] bg-[#e3d5c8] text-[#7a5c43] px-3 py-1 rounded-full font-bold uppercase tracking-wider border border-[#d4c3b3]">
                {planContratado === 'basicos' ? '💍 Esencial' : planContratado === 'premium' ? '🌟 Premium' : '👑 VIP'}
              </span>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={pasoActivo} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }}>
              
              {pasoActivo === 2 && (
                /* ---------------- PASO 2: DATOS BASE ---------------- */
                <div className="bg-white rounded-[2rem] p-8 border border-stone-100 shadow-sm space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-stone-500 ml-1">Festejado 1 / Novia</label>
                      <input type="text" value={brideName} onChange={(e) => setBrideName(e.target.value)} className="w-full px-4 py-3 border border-stone-200 rounded-xl text-sm bg-stone-50 focus:outline-none focus:ring-2 focus:ring-[#9a7b5c]/30 focus:border-[#9a7b5c] transition-all" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-stone-500 ml-1">Festejado 2 / Novio</label>
                      <input type="text" value={groomName} onChange={(e) => setGroomName(e.target.value)} className="w-full px-4 py-3 border border-stone-200 rounded-xl text-sm bg-stone-50 focus:outline-none focus:ring-2 focus:ring-[#9a7b5c]/30 focus:border-[#9a7b5c] transition-all" />
                    </div>
                    
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-stone-500 ml-1">Fecha del Evento</label>
                      <input type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} className="w-full px-4 py-3 border border-stone-200 rounded-xl text-sm bg-stone-50 focus:outline-none focus:ring-2 focus:ring-[#9a7b5c]/30 focus:border-[#9a7b5c] transition-all" />
                    </div>

                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-stone-500 ml-1">Frase del Banner (Portada)</label>
                      <input type="text" value={welcomePhrase} onChange={(e) => setWelcomePhrase(e.target.value)} placeholder="Ej. El amor todo lo cree, todo lo espera, todo lo soporta." className="w-full px-4 py-3 border border-stone-200 rounded-xl text-sm bg-stone-50 focus:outline-none focus:ring-2 focus:ring-[#9a7b5c]/30 focus:border-[#9a7b5c] transition-all" />
                    </div>
                    
                    <div className="col-span-1 md:col-span-2 pt-4 border-t border-stone-100">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-stone-500 ml-1 block mb-3">
                        Selecciona el Diseño de tu Invitación
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <button type="button" onClick={() => setTemplateId('v1')} className={`p-5 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-3 relative overflow-hidden group cursor-pointer ${templateId === 'v1' ? 'border-[#9a7b5c] bg-[#9a7b5c]/5 shadow-md' : 'border-stone-200 bg-white hover:border-[#9a7b5c]/50'}`}>
                          {templateId === 'v1' && <div className="absolute top-2 right-2 text-xs">✅</div>}
                          <span className="text-3xl filter drop-shadow-sm group-hover:scale-110 transition-transform">✨</span>
                          <div className="text-center">
                            <span className={`text-[10px] font-bold uppercase tracking-wider block ${templateId === 'v1' ? 'text-[#9a7b5c]' : 'text-stone-700'}`}>V1: Minimalista</span>
                            <span className="text-[9px] text-stone-400 font-light tracking-wide">Clásica y limpia</span>
                          </div>
                        </button>
                        <button type="button" onClick={() => setTemplateId('v2')} className={`p-5 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-3 relative overflow-hidden group cursor-pointer ${templateId === 'v2' ? 'border-[#9a7b5c] bg-[#9a7b5c]/5 shadow-md' : 'border-stone-200 bg-white hover:border-[#9a7b5c]/50'}`}>
                          {templateId === 'v2' && <div className="absolute top-2 right-2 text-xs">✅</div>}
                          <span className="text-3xl filter drop-shadow-sm group-hover:scale-110 transition-transform">💎</span>
                          <div className="text-center">
                            <span className={`text-[10px] font-bold uppercase tracking-wider block ${templateId === 'v2' ? 'text-[#9a7b5c]' : 'text-stone-700'}`}>V2: Editorial</span>
                            <span className="text-[9px] text-stone-400 font-light tracking-wide">Elegante con cristal</span>
                          </div>
                        </button>
                        <button type="button" onClick={() => setTemplateId('v3')} className={`p-5 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-3 relative overflow-hidden group cursor-pointer ${templateId === 'v3' ? 'border-[#9a7b5c] bg-[#9a7b5c]/5 shadow-md' : 'border-stone-200 bg-white hover:border-[#9a7b5c]/50'}`}>
                          {templateId === 'v3' && <div className="absolute top-2 right-2 text-xs">✅</div>}
                          <span className="text-3xl filter drop-shadow-sm group-hover:scale-110 transition-transform">🌲</span>
                          <div className="text-center">
                            <span className={`text-[10px] font-bold uppercase tracking-wider block ${templateId === 'v3' ? 'text-[#9a7b5c]' : 'text-stone-700'}`}>V3: Naturaleza</span>
                            <span className="text-[9px] text-stone-400 font-light tracking-wide">Animación inmersiva</span>
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>

                  <hr className="border-stone-100" />
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-stone-500 ml-1">Nombre de la Ceremonia</label>
                      <input type="text" value={ceremoniaLugar} onChange={(e) => setCeremoniaLugar(e.target.value)} className="w-full px-4 py-3 border border-stone-200 rounded-xl text-sm bg-stone-50 focus:outline-none focus:ring-2 focus:ring-[#9a7b5c]/30" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-stone-500 ml-1">Link de Google Maps (Ceremonia)</label>
                      <input type="text" value={ceremoniaMaps} onChange={(e) => setCeremoniaMaps(e.target.value)} className="w-full px-4 py-3 border border-stone-200 rounded-xl text-sm bg-stone-50 font-mono text-stone-500 focus:outline-none focus:ring-2 focus:ring-[#9a7b5c]/30" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-stone-500 ml-1">Nombre de la Recepción</label>
                      <input type="text" value={recepcionLugar} onChange={(e) => setRecepcionLugar(e.target.value)} className="w-full px-4 py-3 border border-stone-200 rounded-xl text-sm bg-stone-50 focus:outline-none focus:ring-2 focus:ring-[#9a7b5c]/30" />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-stone-500 ml-1">Link de Google Maps (Recepción)</label>
                      <input type="text" value={recepcionMaps} onChange={(e) => setRecepcionMaps(e.target.value)} className="w-full px-4 py-3 border border-stone-200 rounded-xl text-sm bg-stone-50 font-mono text-stone-500 focus:outline-none focus:ring-2 focus:ring-[#9a7b5c]/30" />
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <button type="button" disabled={guardando} onClick={handleGuardarYContinuar} className="bg-stone-900 hover:bg-[#9a7b5c] text-white px-8 py-3.5 rounded-xl text-xs uppercase tracking-widest font-bold transition-all shadow-md cursor-pointer">
                      {guardando ? 'Guardando...' : 'Guardar y Continuar ➔'}
                    </button>
                  </div>
                </div>
              )}

              {pasoActivo === 3 && (
                /* ---------------- PASO 3: INVITADOS ---------------- */
                <div className="space-y-8">
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                      { t: "Familias", v: totalInvitados, c: "bg-white" },
                      { t: "Pases Dados", v: totalPasesAsignados, c: "bg-white" },
                      { t: "Confirmados", v: totalConfirmados, c: "bg-emerald-50 border-emerald-100 text-emerald-800" },
                      { t: "Pendientes", v: pendientes, c: "bg-amber-50 border-amber-100 text-amber-800" }
                    ].map((card, idx) => (
                      <div key={idx} className={`${card.c} p-5 rounded-2xl border border-stone-100 shadow-sm flex flex-col justify-center`}>
                        <span className="text-[10px] uppercase font-bold text-stone-400 mb-1">{card.t}</span>
                        <span className="text-3xl font-light font-serif">{card.v}</span>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    <div className="bg-white rounded-[2rem] p-6 border border-stone-100 shadow-sm space-y-4">
                      <h3 className="font-serif text-lg font-medium text-stone-900">Nuevo Pase</h3>
                      <form onSubmit={handleAgregarInvitado} className="space-y-4">
                        <div className="space-y-1.5">
                          <label className="text-[11px] font-bold uppercase tracking-wider text-stone-500">Nombre (Familia o Persona)</label>
                          <input type="text" value={nuevoNombre} onChange={(e) => setNuevoNombre(e.target.value)} required className="w-full px-4 py-3 border border-stone-200 rounded-xl text-sm bg-stone-50 focus:outline-none focus:border-[#9a7b5c]" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[11px] font-bold uppercase tracking-wider text-stone-500">Número de Pases</label>
                          <select value={nuevosPases} onChange={(e) => setNuevosPases(parseInt(e.target.value))} className="w-full px-4 py-3 border border-stone-200 rounded-xl text-sm bg-stone-50 focus:outline-none font-medium">
                            {[1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={n}>{n} {n===1?'Persona':'Personas'}</option>)}
                          </select>
                        </div>
                        <button type="submit" className="w-full bg-stone-900 text-white text-xs uppercase tracking-widest font-bold py-3.5 rounded-xl transition-colors hover:bg-[#9a7b5c] cursor-pointer">
                          Agregar a la Lista
                        </button>
                      </form>
                    </div>

                    <div className="lg:col-span-2 bg-white rounded-[2rem] border border-stone-100 shadow-sm overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm border-collapse">
                          <thead>
                            <tr className="bg-stone-50 border-b border-stone-100 text-[10px] uppercase tracking-widest text-stone-400 font-bold">
                              <th className="p-4 pl-6 font-medium">Invitado</th>
                              <th className="p-4 text-center font-medium">Pases</th>
                              <th className="p-4 text-center font-medium">Status</th>
                              <th className="p-4 text-center pr-6 font-medium">Acción</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-stone-100">
                            {invitados.map((inv) => (
                              <tr key={inv.id} className="hover:bg-stone-50/50 transition-colors">
                                <td className="p-4 pl-6 font-medium text-stone-800">{inv.nombre_invitado}</td>
                                <td className="p-4 text-center font-mono text-stone-500">{inv.pases_totales}</td>
                                <td className="p-4 text-center">
                                  <span className={`text-[9px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${inv.estado === 'confirmado' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : inv.estado === 'declinado' ? 'bg-rose-50 text-rose-700 border-rose-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                                    {inv.estado}
                                  </span>
                                </td>
                                <td className="p-4 text-center pr-6 flex items-center justify-center gap-2">
                                  <button type="button" onClick={() => setInvitadoSeleccionado(inv)} className="bg-white border border-stone-200 text-stone-600 hover:text-[#9a7b5c] hover:border-[#9a7b5c] text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-lg transition-all shadow-sm cursor-pointer">
                                    Generar QR
                                  </button>
                                  <button type="button" onClick={() => handleEliminarInvitado(inv.id)} className="text-stone-300 hover:text-rose-500 p-1 transition-colors cursor-pointer">✕</button>
                                </td>
                              </tr>
                            ))}
                            {invitados.length === 0 && <tr><td colSpan="4" className="p-8 text-center text-stone-400 text-sm font-light italic">Tu lista de invitados está vacía.</td></tr>}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {pasoActivo === 4 && (
                /* ---------------- PASO 4: MULTIMEDIA & AUDIO STUDIO ---------------- */
                <div className="space-y-8">
                  
                  {/* ✨ ÁLBUM PREMIUM BLINDADO Y UPSELL ✨ */}
                  <div className="bg-stone-950 text-white rounded-[2rem] p-8 border border-stone-800 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-[#9a7b5c]/20 blur-3xl rounded-full pointer-events-none transform translate-x-1/2 -translate-y-1/2"></div>
                    
                    {planContratado === 'basicos' ? (
                      <div className="relative z-10 flex flex-col md:flex-row items-center text-center md:text-left gap-6">
                        <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center text-4xl shrink-0">🔒</div>
                        <div className="space-y-3">
                          <span className="text-[9px] bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold px-3 py-1 rounded-full uppercase tracking-widest font-mono">Función Premium</span>
                          <h3 className="font-serif text-3xl font-light">Álbum Colectivo Bloqueado</h3>
                          <p className="text-sm text-stone-400 font-light leading-relaxed max-w-lg">
                            Tu plan actual (Esencial) no incluye la cámara en vivo para tus invitados. Desbloquea esta función y permite que todos suban fotos de tu fiesta escaneando un QR.
                          </p>
                          <button type="button" onClick={() => manejarUpgrade('album')} className="mt-2 bg-amber-600 hover:bg-amber-500 text-white px-6 py-3 rounded-xl text-xs uppercase tracking-widest font-bold transition-all shadow-lg cursor-pointer">
                            Desbloquear por $599 MXN
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="relative z-10">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                          <div className="space-y-2 max-w-xl">
                            <span className="text-[9px] bg-[#9a7b5c]/20 text-[#e3d5c8] border border-[#9a7b5c]/40 font-bold px-3 py-1 rounded-full uppercase tracking-widest font-mono">Alta Costura Funcional</span>
                            <h3 className="font-serif text-3xl font-light">Álbum Colectivo en Vivo</h3>
                            <p className="text-sm text-stone-400 font-light leading-relaxed">Coloca este código QR en las mesas de tu evento. Tus invitados escanearán y subirán sus fotos directamente a este carrete digital que quedará para la historia.</p>
                          </div>
                          <button type="button" onClick={toggleAlbumCompartido} className={`shrink-0 px-6 py-3 rounded-xl text-xs uppercase tracking-widest font-bold transition-all shadow-lg cursor-pointer border ${albumActivado ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-white text-stone-900 border-white hover:bg-stone-200'}`}>
                            {albumActivado ? '✅ Función Activada' : 'Activar Carrete'}
                          </button>
                        </div>

                        {albumActivado && (
                          <div className="mt-8 pt-8 border-t border-stone-800 flex flex-col md:flex-row gap-8 items-center md:items-start">
                            <div className="flex flex-col items-center gap-3 shrink-0">
                              <div className="bg-white p-3 rounded-2xl shadow-xl w-32 h-32 flex items-center justify-center">
                                 <img 
                                   src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(codigoMesaUrl)}&margin=10`} 
                                   alt="QR Mesas" 
                                   className="w-full h-full object-contain mix-blend-multiply" 
                                 />
                              </div>
                              <button 
                                type="button"
                                onClick={() => descargarQR(`https://api.qrserver.com/v1/create-qr-code/?size=600x600&data=${encodeURIComponent(codigoMesaUrl)}&margin=15`, `QR-Mesas-${weddingSlug}`)}
                                className="bg-white/10 hover:bg-white/20 text-white text-[9px] uppercase tracking-widest font-bold px-4 py-2 rounded-xl transition-all border border-white/10 flex items-center gap-1.5 cursor-pointer select-none"
                              >
                                📥 Descargar PNG
                              </button>
                            </div>

                            <div className="w-full text-left">
                              <h4 className="text-[10px] font-bold uppercase tracking-widest text-stone-500 mb-4">Capturas del Evento ({fotosDelEvento.length})</h4>
                              {fotosDelEvento.length === 0 ? (
                                <div className="w-full h-24 border border-dashed border-stone-800 rounded-xl flex items-center justify-center text-xs text-stone-500 font-light">Esperando la primera foto de tus invitados...</div>
                              ) : (
                                <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
                                  {fotosDelEvento.map((url, i) => <div key={i} className="w-20 h-20 shrink-0 bg-stone-800 rounded-xl overflow-hidden border border-stone-700"><img src={url} className="w-full h-full object-cover" /></div>)}
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* LÓGICA CONDICIONAL V2 */}
                  {templateId === 'v2' && (
                    <div className="bg-white rounded-[2rem] p-8 border border-[#9a7b5c]/30 shadow-sm space-y-6 bg-gradient-to-br from-white to-[#f5f0ea]/30">
                      <div className="space-y-1">
                        <span className="text-[9px] bg-[#9a7b5c] text-white font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider font-mono">Requisito V2 Editorial</span>
                        <h3 className="font-serif text-2xl font-light text-stone-900">Fotografías de las Locaciones</h3>
                        <p className="text-xs text-stone-500 font-light">Como elegiste el diseño de Alta Costura, sube las fotos de tu iglesia y salón para que luzcan a pantalla dividida en el itinerario.</p>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-3">
                          <label className="text-[11px] font-bold uppercase tracking-wider text-stone-500">Foto Ceremonia / Misa</label>
                          <div className="relative w-full aspect-video bg-stone-100 rounded-xl overflow-hidden border border-stone-200 flex items-center justify-center group">
                            {ceremoniaFoto ? (
                              <img src={ceremoniaFoto} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                            ) : (
                              <span className="text-stone-400 font-light text-xs">Sin imagen</span>
                            )}
                            <label className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm text-stone-900 text-[9px] uppercase tracking-widest font-bold px-3 py-1.5 rounded-full shadow-lg cursor-pointer hover:bg-white transition-colors">
                              {subiendoIndex === 'ceremonia' ? 'Cargando...' : 'Subir Foto'}
                              <input type="file" accept="image/*" onChange={(e) => handleSubirArchivo(e, null, 'ceremonia')} className="hidden" />
                            </label>
                          </div>
                        </div>
                        <div className="space-y-3">
                          <label className="text-[11px] font-bold uppercase tracking-wider text-stone-500">Foto Recepción / Banquete</label>
                          <div className="relative w-full aspect-video bg-stone-100 rounded-xl overflow-hidden border border-stone-200 flex items-center justify-center group">
                            {recepcionFoto ? (
                              <img src={recepcionFoto} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                            ) : (
                              <span className="text-stone-400 font-light text-xs">Sin imagen</span>
                            )}
                            <label className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm text-stone-900 text-[9px] uppercase tracking-widest font-bold px-3 py-1.5 rounded-full shadow-lg cursor-pointer hover:bg-white transition-colors">
                              {subiendoIndex === 'recepcion' ? 'Cargando...' : 'Subir Foto'}
                              <input type="file" accept="image/*" onChange={(e) => handleSubirArchivo(e, null, 'recepcion')} className="hidden" />
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* ✨ AUDIO STUDIO CON UPSELL DE MÚSICA ✨ */}
                    <div className="bg-white rounded-[2rem] p-8 border border-stone-100 shadow-sm space-y-6">
                      <div className="space-y-1">
                        <h3 className="font-serif text-2xl font-light text-stone-900">Diseño Sonoro</h3>
                        <p className="text-xs font-light text-stone-500">Selecciona la pista de audio que acompañará la lectura de tu invitación.</p>
                      </div>
                      
                      <div className="space-y-3">
                        {cancionesCatalogo.map((track) => (
                          <div key={track.id} className={`group flex items-center justify-between p-4 rounded-xl border transition-all ${musicUrl === track.url ? 'border-[#9a7b5c] bg-[#faf9f6]' : 'border-stone-100 hover:border-stone-300'}`}>
                            <div className="flex items-center gap-4">
                              <button type="button" onClick={() => escucharCancion(track.url)} className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors cursor-pointer ${cancionSonando === track.url ? 'bg-[#9a7b5c] text-white shadow-md' : 'bg-stone-100 text-stone-500 group-hover:bg-stone-200'}`}>
                                {cancionSonando === track.url ? '⏸' : '▶'}
                              </button>
                              <div>
                                <p className="text-sm font-medium text-stone-800">{track.titulo}</p>
                                <p className="text-[10px] text-stone-400 font-mono mt-0.5">{track.bpm} • Stereo Mix</p>
                              </div>
                            </div>
                            <input type="radio" name="audioTrack" checked={musicUrl === track.url} onChange={() => setMusicUrl(track.url)} className="w-4 h-4 accent-[#9a7b5c] cursor-pointer" />
                          </div>
                        ))}
                      </div>

                      {/* ZONA DE CANCIÓN PERSONALIZADA ($299) */}
                      <div className="mt-6 pt-6 border-t border-stone-100">
                        {tieneMusicaPersonalizada ? (
                          <div className="space-y-3">
                            <label className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 block">✨ Tu Canción MP3 Personalizada</label>
                            <label className="flex items-center justify-center w-full p-4 border-2 border-dashed border-[#9a7b5c] rounded-xl cursor-pointer hover:bg-[#faf9f6] transition-colors">
                              <span className="text-xs font-bold text-[#9a7b5c] uppercase tracking-widest">
                                {subiendoMusica ? 'Subiendo audio...' : '📤 Cargar archivo .mp3'}
                              </span>
                              <input type="file" accept="audio/mp3,audio/mpeg" onChange={handleSubirMusica} className="hidden" />
                            </label>
                          </div>
                        ) : (
                          <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 text-center space-y-3">
                            <p className="text-xs text-stone-500 font-medium">¿Tienes una canción especial que significa mucho para ustedes?</p>
                            <button type="button" onClick={() => manejarUpgrade('musica')} className="bg-stone-900 text-white px-6 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-[#9a7b5c] transition-colors cursor-pointer shadow-md">
                              Subir mi propia canción (+$299 MXN)
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Portada */}
                    <div className="bg-white rounded-[2rem] p-8 border border-stone-100 shadow-sm space-y-6">
                      <h3 className="font-serif text-2xl font-light text-stone-900">Fotografía Principal</h3>
                      <div className="relative w-full aspect-[4/3] bg-stone-100 rounded-2xl overflow-hidden border border-stone-200 group flex items-center justify-center">
                        {coverImage ? (
                          <img src={coverImage} alt="Portada" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                        ) : (
                          <span className="text-stone-400 font-light text-sm">Sin imagen de portada</span>
                        )}
                        <label className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm text-stone-900 text-[10px] uppercase tracking-widest font-bold px-4 py-2 rounded-full shadow-lg cursor-pointer hover:bg-white transition-colors">
                          {subiendoIndex === 'portada' ? 'Cargando...' : 'Cambiar Foto'}
                          <input type="file" accept="image/*" onChange={(e) => handleSubirArchivo(e, null, 'portada')} className="hidden" />
                        </label>
                      </div>
                    </div>
                    
                    {/* GALERÍA DINÁMICA */}
                    <div className="lg:col-span-2 bg-white rounded-[2rem] p-8 border border-stone-100 shadow-sm space-y-6">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4">
                        <div className="space-y-1">
                          <h3 className="font-serif text-2xl font-light text-stone-900">Galería Fotográfica Base</h3>
                          <p className="text-xs font-light text-stone-500">Estas fotos aparecerán en la cuadrícula de tu invitación.</p>
                        </div>
                        <span className="text-[10px] bg-stone-100 text-stone-500 px-3 py-1.5 rounded-full font-bold uppercase tracking-widest shrink-0">
                          {fotosSubidasCount} de {maxFotosPermitidas} Fotos
                        </span>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {Array.from({ length: maxFotosPermitidas }).map((_, index) => (
                          <div key={index} className="relative aspect-[4/5] bg-stone-50 rounded-xl overflow-hidden border border-stone-200 group flex flex-col items-center justify-center">
                            {galeriaFotos[index] ? (
                              <>
                                <img src={galeriaFotos[index]} alt={`Galeria ${index + 1}`} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                <label className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm text-stone-900 text-[9px] uppercase tracking-widest font-bold px-3 py-1.5 rounded-full shadow-lg cursor-pointer hover:bg-white transition-colors">
                                  {subiendoIndex === index ? '...' : 'Editar'}
                                  <input type="file" accept="image/*" onChange={(e) => handleSubirArchivo(e, index, 'galeria')} className="hidden" />
                                </label>
                              </>
                            ) : (
                              <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer hover:bg-stone-100 transition-colors">
                                <span className="text-2xl mb-2 opacity-20">📷</span>
                                <span className="text-[9px] uppercase font-bold text-stone-400 tracking-widest">
                                  {subiendoIndex === index ? 'Subiendo...' : 'Agregar Foto'}
                                </span>
                                <input type="file" accept="image/*" onChange={(e) => handleSubirArchivo(e, index, 'galeria')} className="hidden" />
                              </label>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <button type="button" disabled={guardando} onClick={handleGuardarPaso4} className="bg-stone-900 hover:bg-[#9a7b5c] text-white px-8 py-3.5 rounded-xl text-xs uppercase tracking-widest font-bold transition-all shadow-md cursor-pointer">
                       Guardar y Avanzar ➔
                    </button>
                  </div>

                </div>
              )}

              {pasoActivo === 5 && (
                /* ---------------- PASO 5: REGALOS ---------------- */
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-white rounded-[2rem] p-8 border border-stone-100 shadow-sm space-y-6">
                    <h3 className="font-serif text-2xl font-light text-stone-900">Transferencias / Efectivo</h3>
                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-stone-500 ml-1">Institución Bancaria</label>
                        <input type="text" value={banco} onChange={(e) => setBanco(e.target.value)} placeholder="Ej. BBVA o Santander" className="w-full px-4 py-3 border border-stone-200 rounded-xl text-sm bg-stone-50 focus:outline-none focus:ring-2 focus:ring-[#9a7b5c]/30" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-stone-500 ml-1">Nombre del Titular</label>
                        <input type="text" value={titular} onChange={(e) => setTitular(e.target.value)} className="w-full px-4 py-3 border border-stone-200 rounded-xl text-sm bg-stone-50 focus:outline-none focus:ring-2 focus:ring-[#9a7b5c]/30" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-stone-500 ml-1">CLABE Interbancaria (18 dígitos)</label>
                        <input type="text" maxLength={18} value={clabe} onChange={(e) => setClabe(e.target.value)} className="w-full px-4 py-3 border border-stone-200 rounded-xl text-sm bg-stone-50 font-mono focus:outline-none focus:ring-2 focus:ring-[#9a7b5c]/30" />
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-[2rem] p-8 border border-stone-100 shadow-sm space-y-6 flex flex-col">
                    <h3 className="font-serif text-2xl font-light text-stone-900">Mesas de Regalos Online</h3>
                    <div className="space-y-4 flex-1">
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-stone-500 ml-1">Enlace Mesa Amazon</label>
                        <input type="url" value={amazonUrl} onChange={(e) => setAmazonUrl(e.target.value)} placeholder="https://amazon.com.mx/..." className="w-full px-4 py-3 border border-stone-200 rounded-xl text-sm bg-stone-50 font-mono text-stone-500 focus:outline-none focus:ring-2 focus:ring-[#9a7b5c]/30" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold uppercase tracking-wider text-stone-500 ml-1">Enlace Mesa Liverpool / Palacio</label>
                        <input type="url" value={liverpoolUrl} onChange={(e) => setLiverpoolUrl(e.target.value)} placeholder="https://liverpool.com.mx/..." className="w-full px-4 py-3 border border-stone-200 rounded-xl text-sm bg-stone-50 font-mono text-stone-500 focus:outline-none focus:ring-2 focus:ring-[#9a7b5c]/30" />
                      </div>
                    </div>
                    
                    <div className="flex justify-end pt-4">
                      <button type="button" disabled={guardando} onClick={handleGuardarPaso5} className="bg-stone-900 hover:bg-[#9a7b5c] text-white px-8 py-3.5 rounded-xl text-xs uppercase tracking-widest font-bold transition-all shadow-md cursor-pointer">
                         Guardar Regalos ➔
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {pasoActivo === 6 && (
                /* 👇 AQUÍ ESTÁN POR FIN LAS 5 HORAS COMPLETAS EN PANTALLA 👇 */
                <div className="bg-white rounded-[2rem] p-8 border border-stone-100 shadow-sm space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <h3 className="font-serif text-2xl font-light text-stone-900">Cronograma</h3>
                        <p className="text-xs text-stone-500 font-light">Establece los horarios clave para guiar a tus invitados.</p>
                      </div>
                      <div className="space-y-4">
                        <div className="space-y-1.5">
                          <label className="text-[11px] font-bold uppercase tracking-wider text-stone-500 ml-1">⛪ Hora de la Ceremonia (Misa)</label>
                          <input type="text" value={itinerarioMisa} onChange={(e) => setItinerarioMisa(e.target.value)} placeholder="Ej. 17:00 hrs" className="w-full px-4 py-3 border border-stone-200 rounded-xl text-sm bg-stone-50 focus:outline-none focus:ring-2 focus:ring-[#9a7b5c]/30" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[11px] font-bold uppercase tracking-wider text-stone-500 ml-1">🥂 Hora de la Recepción (Banquete)</label>
                          <input type="text" value={itinerarioFiesta} onChange={(e) => setItinerarioFiesta(e.target.value)} placeholder="Ej. 19:30 hrs" className="w-full px-4 py-3 border border-stone-200 rounded-xl text-sm bg-stone-50 focus:outline-none focus:ring-2 focus:ring-[#9a7b5c]/30" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[11px] font-bold uppercase tracking-wider text-stone-500 ml-1">✨ Baile / Vals</label>
                          <input type="text" value={horaBaile} onChange={(e) => setHoraBaile(e.target.value)} placeholder="Ej. 21:00 hrs" className="w-full px-4 py-3 border border-stone-200 rounded-xl text-sm bg-stone-50 focus:outline-none focus:ring-2 focus:ring-[#9a7b5c]/30" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[11px] font-bold uppercase tracking-wider text-stone-500 ml-1">🎉 Fiesta</label>
                          <input type="text" value={horaShow} onChange={(e) => setHoraShow(e.target.value)} placeholder="Ej. 22:00 hrs" className="w-full px-4 py-3 border border-stone-200 rounded-xl text-sm bg-stone-50 focus:outline-none focus:ring-2 focus:ring-[#9a7b5c]/30" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[11px] font-bold uppercase tracking-wider text-stone-500 ml-1">🕛 Fin de fiesta</label>
                          <input type="text" value={horaFin} onChange={(e) => setHoraFin(e.target.value)} placeholder="Ej. 02:00 am" className="w-full px-4 py-3 border border-stone-200 rounded-xl text-sm bg-stone-50 focus:outline-none focus:ring-2 focus:ring-[#9a7b5c]/30" />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="space-y-2">
                        <h3 className="font-serif text-2xl font-light text-stone-900">Protocolo</h3>
                        <p className="text-xs text-stone-500 font-light">Comunica el vestuario y la paleta de colores del evento.</p>
                      </div>
                      <div className="space-y-4">
                        <div className="space-y-1.5">
                          <label className="text-[11px] font-bold uppercase tracking-wider text-stone-500 ml-1">Código de Vestimenta</label>
                          <select value={codigoVestimentaText} onChange={(e) => setCodigoVestimentaText(e.target.value)} className="w-full px-4 py-3 border border-stone-200 rounded-xl text-sm bg-stone-50 focus:outline-none focus:ring-2 focus:ring-[#9a7b5c]/30 font-medium text-stone-700 cursor-pointer">
                            <option value="formal">Gala / Etiqueta Formal</option>
                            <option value="coctel">Vestimenta de Cóctel</option>
                            <option value="guayabera">Guayabera / Playa Chic</option>
                          </select>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[11px] font-bold uppercase tracking-wider text-stone-500 ml-1">Paleta de Colores Sugerida</label>
                          <input type="text" value={paletaColores} onChange={(e) => setPaletaColores(e.target.value)} placeholder="Ej. Tonos terracota y verde olivo" className="w-full px-4 py-3 border border-stone-200 rounded-xl text-sm bg-stone-50 focus:outline-none focus:ring-2 focus:ring-[#9a7b5c]/30" />
                        </div>
                      </div>
                    </div>

                  </div>

                  <hr className="border-stone-100" />
                  
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-2">
                    <p className="text-xs text-stone-400 font-light">Al guardar, los cambios se reflejarán instantáneamente en la invitación en vivo.</p>
                    <button type="button" disabled={guardando} onClick={handleGuardarPaso6} className="w-full sm:w-auto bg-[#9a7b5c] hover:bg-stone-900 text-white px-8 py-4 rounded-xl text-xs uppercase tracking-widest font-bold transition-all shadow-lg cursor-pointer">
                      {guardando ? 'Sincronizando...' : '🚀 Publicar Cambios'}
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* MODAL DEL PASE QR */}
      <AnimatePresence>
        {invitadoSeleccionado && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-stone-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 20 }} className="bg-white rounded-[2rem] p-8 text-center space-y-6 max-w-sm w-full shadow-2xl border border-stone-100">
              <h4 className="font-serif text-xl font-light text-stone-900">Tarjeta de Acceso</h4>
              <div className="bg-[#fcfbfa] border border-stone-200 rounded-2xl p-6 space-y-5 shadow-inner">
                <h5 className="font-serif text-lg text-[#9a7b5c]">{brideName || 'Evento'} & {groomName}</h5>
                <div className="w-40 h-40 mx-auto bg-white p-3 rounded-2xl border shadow-sm flex items-center justify-center">
                  <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(`https://tugrandia.icu/${weddingSlug}/rsvp?id=${invitadoSeleccionado.id}`)}&margin=10`} 
                    alt="QR Pase" 
                    className="w-full h-full object-contain mix-blend-multiply" 
                  />
                </div>
                <div>
                  <p className="text-sm font-bold text-stone-800">{invitadoSeleccionado.nombre_invitado}</p>
                  <p className="text-[10px] uppercase tracking-widest text-stone-500 mt-1">
                    Pases Autorizados: <span className="font-bold text-stone-900">{invitadoSeleccionado.pases_totales}</span>
                  </p>
                </div>
              </div>
              <button type="button" onClick={() => setInvitadoSeleccionado(null)} className="w-full bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold uppercase tracking-widest py-3.5 rounded-xl transition-colors cursor-pointer">
                Cerrar Boleto
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// useSearchParams necesita una frontera de Suspense en el App Router.
export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#fcfbfa] flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-[#9a7b5c] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <NoviosDashboard />
    </Suspense>
  );
}
