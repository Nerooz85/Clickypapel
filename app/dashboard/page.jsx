"use client";
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';

export default function NoviosDashboard() {
  const weddingSlug = 'bruno-y-brisa'; 

  // Estados de Control de la App
  const [pasoActivo, setPasoActivo] = useState(2); // Inicia ordenadamente desde el paso 2
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [subiendoIndex, setSubiendoIndex] = useState(null); // Monitorea cuál foto se está subiendo

  // 🪙 Información de Compra del Cliente
  const [planContratado, setPlanContratatado] = useState('premium'); 
  const [tieneMusicaPersonalizada, setTieneMusicaPersonalizada] = useState(false); 

  // 📝 ESTADOS DEL FORMULARIO BASE (Paso 2)
  const [brideName, setBrideName] = useState('');
  const [groomName, setGroomName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [ceremoniaLugar, setCeremoniaLugar] = useState('');
  const [ceremoniaMaps, setCeremoniaMaps] = useState('');
  const [recepcionLugar, setRecepcionLugar] = useState('');
  const [recepcionMaps, setRecepcionMaps] = useState('');
  const [templateId, setTemplateId] = useState('romantico-clasico');

  // 📊 ESTADOS DE INVITADOS (Paso 3)
  const [invitados, setInvitados] = useState([]);
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [nuevosPases, setNuevosPases] = useState(2);

  // 🎵📸 ESTADOS MULTIMEDIA (Paso 4)
  const [coverImage, setCoverImage] = useState(''); 
  const [musicUrl, setMusicUrl] = useState('/music/1-thousand-years.mp3');
  const [galeriaFotos, setGaleriaFotos] = useState(['', '', '', '', '', '']); 

  const [cancionSonando, setCancionSonando] = useState(null);
  const audioPrevioRef = useRef(null);

  // 💰 ESTADOS DEL PASO 5: MESA DE REGALOS & CUENTA CLABE
  const [banco, setBanco] = useState('');
  const [titular, setTitular] = useState('');
  const [clabe, setClabe] = useState('');
  const [amazonUrl, setAmazonUrl] = useState('');
  const [liverpoolUrl, setLiverpoolUrl] = useState('');

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

  const handleFotoChange = (index, value) => {
    const copias = [...galeriaFotos];
    copias[index] = value;
    setGaleriaFotos(copias);
  };

  // 🚀 FUNCIÓN DE CARGA DIRECTA A SUPABASE STORAGE
  const handleSubirArchivo = async (e, index, esPortada = false) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      if (esPortada) {
        setSubiendoIndex('portada');
      } else {
        setSubiendoIndex(index);
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${weddingSlug}-${esPortada ? 'portada' : `foto-${index}`}-${Date.now()}.${fileExt}`;
      const filePath = `${weddingSlug}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('invitaciones-media')
        .upload(filePath, file, { cacheControl: '3600', upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('invitaciones-media')
        .getPublicUrl(filePath);

      if (esPortada) {
        setCoverImage(publicUrl);
      } else {
        handleFotoChange(index, publicUrl);
      }

      alert("📸 ¡Imagen subida y optimizada con éxito!");

    } catch (err) {
      console.error(err);
      alert("No se pudo subir la imagen. Verifica que el bucket 'invitaciones-media' sea público.");
    } finally {
      setSubiendoIndex(null);
    }
  };

  // Cargar datos de Supabase de golpe al montar el componente
  const cargarTodoElDashboard = async () => {
    try {
      setCargando(true);
      const slugLimpio = weddingSlug ? weddingSlug.toLowerCase().trim() : 'bruno-y-brisa';

      // 1. Datos Generales de la Boda
      const { data: bodaData, error: bodaError } = await supabase
        .from('bodas')
        .select('*')
        .eq('slug', slugLimpio)
        .maybeSingle();

      if (bodaError) throw bodaError;

      if (bodaData) {
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
        
        // Carga de Datos Financieros del Paso 5
        setBanco(bodaData.banco || '');
        setTitular(bodaData.titular || '');
        setClabe(bodaData.clabe || '');
        setAmazonUrl(bodaData.amazon_url || '');
        setLiverpoolUrl(bodaData.liverpool_url || '');

        if (bodaData.gallery_images) {
          const nuevasFotos = ['', '', '', '', '', ''];
          bodaData.gallery_images.forEach((img, i) => { if(i < 6) nuevasFotos[i] = img; });
          setGaleriaFotos(nuevasFotos);
        }
      }

      // 2. Lista de Invitados
      const { data: listaInvitados, error: invitadosError } = await supabase
        .from('invitados')
        .select('*')
        .eq('boda_slug', slugLimpio)
        .order('nombre_invitado', { ascending: true });

      if (invitadosError) throw invitadosError;
      if (listaInvitados) setInvitados(listaInvitados);

    } catch (err) {
      console.error(err);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => { cargarTodoElDashboard(); }, []);

  // Guardar Paso 2 (Datos del Evento)
  const handleGuardarYContinuar = async () => {
    setGuardando(true);
    try {
      const { error } = await supabase
        .from('bodas')
        .update({
          bride_name: brideName,
          groom_name: groomName,
          event_date: eventDate ? `${eventDate}T18:00:00` : null,
          ceremonia_lugar: ceremoniaLugar,
          ceremonia_maps_url: ceremoniaMaps,
          recepcion_lugar: recepcionLugar,
          recepcion_maps_url: recepcionMaps,
          template_id: templateId
        })
        .eq('slug', weddingSlug);

      if (error) throw error;
      setPasoActivo(3); 
    } catch (err) {
      alert("Hubo un error al guardar los datos.");
    } finally {
      setGuardando(false);
    }
  };

  // Guardar Paso 3 (Agregar Invitado)
  const handleAgregarInvitado = async (e) => {
    e.preventDefault();
    if (!nuevoNombre.trim()) return;
    setGuardando(true);
    try {
      const { error } = await supabase
        .from('invitados')
        .insert([{
          boda_slug: weddingSlug,
          nombre_invitado: nuevoNombre.trim(),
          pases_totales: nuevosPases,
          pases_confirmados: 0,
          estado: 'pendiente'
        }]);
      if (error) throw error;
      setNuevoNombre('');
      setNuevosPases(2);
      
      const { data } = await supabase.from('invitados').select('*').eq('boda_slug', weddingSlug).order('nombre_invitado', { ascending: true });
      if (data) setInvitados(data);
    } catch (err) {
      alert("No se pudo registrar al invitado.");
    } finally {
      setGuardando(false);
    }
  };

  const handleEliminarInvitado = async (id) => {
    if (!confirm("¿Deseas eliminar a este invitado?")) return;
    try {
      const { error } = await supabase.from('invitados').delete().eq('id', id);
      if (error) throw error;
      setInvitados(invitados.filter(inv => inv.id !== id));
    } catch (err) {
      alert("Error al eliminar.");
    }
  };

  // Guardar Paso 4 (Multimedia)
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
      setPasoActivo(5); // Pasa automáticamente a la mesa de regalos
    } catch (err) {
      alert("Error al guardar la sección multimedia.");
    } finally {
      setGuardando(false);
    }
  };

  // Guardar Paso 5 (Regalos Financieros)
  const handleGuardarPaso5 = async () => {
    setGuardando(true);
    try {
      const { error } = await supabase
        .from('bodas')
        .update({
          banco: banco.trim(),
          titular: titular.trim(),
          clabe: clabe.trim(),
          amazon_url: amazonUrl.trim(),
          liverpool_url: liverpoolUrl.trim()
        })
        .eq('slug', weddingSlug);

      if (error) throw error;
      alert("🎁 ¡Datos financieros y mesas de regalos sincronizados en vivo con éxito!");
    } catch (err) {
      console.error(err);
      alert("Error al guardar la información de regalos.");
    } finally {
      setGuardando(false);
    }
  };

  const maxFotosPermitidas = planContratado === 'basicos' ? 3 : planContratado === 'premium' ? 6 : 12;
  const totalInvitados = invitados.length;
  const totalPasesAsignados = invitados.reduce((acc, curr) => acc + (curr.pases_totales || 0), 0);
  const totalConfirmados = invitados.reduce((acc, curr) => acc + (curr.pases_confirmados || 0), 0);
  const pendientes = invitados.filter(inv => inv.estado === 'pendiente').length;

  if (cargando) return <div className="min-h-screen bg-[#f1ede6] flex items-center justify-center font-serif text-stone-500 animate-pulse">Sincronizando multimedia... ✨</div>;

  return (
    <div className="min-h-screen bg-[#f1ede6] text-stone-800 flex font-sans overflow-x-hidden">
      <audio ref={audioPrevioRef} loop />

      {/* 🧭 SIDEBAR */}
      <aside className="w-20 bg-white border-r border-stone-200 flex flex-col items-center py-6 gap-8 flex-none select-none">
        <div className="w-10 h-10 bg-amber-700/10 rounded-full flex items-center justify-center font-serif text-amber-800 font-bold">c`p</div>
        <nav className="flex flex-col gap-6 text-center w-full">
          {['Inicio', 'Invitación', 'RSVP', 'Regalos', 'Configuración'].map((item, idx) => (
            <button key={item} type="button" onClick={() => idx === 1 ? setPasoActivo(2) : idx === 2 ? setPasoActivo(3) : null} className={`flex flex-col items-center gap-1 text-[10px] py-2 font-medium cursor-pointer ${(idx===1 && pasoActivo===2) || (idx===1 && pasoActivo===4) || (idx===1 && pasoActivo===5) ? 'text-amber-700 bg-amber-50/60 border-r-2 border-amber-700 font-bold' : 'text-stone-400'}`}>
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

        {/* LÍNEA DE PROGRESO (WIZARD MAESTRO) */}
        <div className="bg-white/40 p-4 rounded-2xl border border-stone-200/40 flex items-center justify-between text-[11px] font-bold text-stone-400 relative select-none">
          <div className="absolute h-[2px] bg-stone-200 top-1/2 left-8 right-8 -translate-y-1/2 z-0" />
          <div className={`absolute h-[2px] bg-amber-700 top-1/2 left-8 -translate-y-1/2 z-0 transition-all duration-500 ${pasoActivo === 2 ? 'w-[20%]' : pasoActivo === 3 ? 'w-[40%]' : pasoActivo === 4 ? 'w-[60%]' : 'w-[80%]'}`} />
          
          {[
            { n: '1. Plan', done: true },
            { n: '2. Datos', active: pasoActivo === 2, done: pasoActivo > 2 },
            { n: '3. Invitados', active: pasoActivo === 3, done: pasoActivo > 3 },
            { n: '4. Multimedia', active: pasoActivo === 4, done: pasoActivo > 4 },
            { n: '5. Regalos', active: pasoActivo === 5, done: false }
          ].map((p, i) => (
            <button key={i} type="button" disabled={i === 0} onClick={() => setPasoActivo(i + 1)} className="flex flex-col items-center gap-1.5 relative z-10 bg-[#f1ede6] px-3 cursor-pointer">
              <span className={`w-6 h-6 rounded-full flex items-center justify-center border font-mono text-xs transition-colors ${p.active ? 'bg-amber-700 border-amber-700 text-white' : p.done ? 'bg-white border-amber-700 text-amber-700' : 'bg-white border-stone-300'}`}>{p.done ? '✓' : i + 1}</span>
              <span className={p.active ? 'text-stone-900 font-extrabold' : 'text-stone-400 font-medium'}>{p.n}</span>
            </button>
          ))}
        </div>

        {/* 🔀 CONTROL DE RENDERS DINÁMICOS POR PASOS */}
        {pasoActivo === 2 ? (
          /* ==========================================
             PASO 2: DATOS GENERALES DEL EVENTO
             ========================================== */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start animate-fadeIn text-left">
            <div className="lg:col-span-2 bg-white rounded-3xl p-6 md:p-8 border border-stone-200/60 shadow-xs space-y-6">
              <div className="border-b border-stone-100 pb-3">
                <h3 className="text-lg font-serif font-medium text-stone-900">2. Datos del Evento</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1"><label className="text-xs font-semibold text-stone-600">Nombre de la Novia</label><input type="text" value={brideName} onChange={(e) => setBrideName(e.target.value)} className="w-full px-4 py-3 border border-stone-200 rounded-xl text-xs bg-stone-50/50" /></div>
                <div className="space-y-1"><label className="text-xs font-semibold text-stone-600">Nombre del Novio</label><input type="text" value={groomName} onChange={(e) => setGroomName(e.target.value)} className="w-full px-4 py-3 border border-stone-200 rounded-xl text-xs bg-stone-50/50" /></div>
                <div className="space-y-1"><label className="text-xs font-semibold text-stone-600">Fecha</label><input type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} className="w-full px-4 py-3 border border-stone-200 rounded-xl text-xs bg-stone-50/50" /></div>
                <div className="space-y-1"><label className="text-xs font-semibold text-stone-600">Lugar Ceremonia</label><input type="text" value={ceremoniaLugar} onChange={(e) => setCeremoniaLugar(e.target.value)} className="w-full px-4 py-3 border border-stone-200 rounded-xl text-xs bg-stone-50/50" /></div>
                <div className="space-y-1"><label className="text-xs font-semibold text-stone-600">Maps Ceremonia</label><input type="text" value={ceremoniaMaps} onChange={(e) => setCeremoniaMaps(e.target.value)} className="w-full px-4 py-3 border border-stone-200 rounded-xl text-xs bg-stone-50/50" /></div>
                <div className="space-y-1"><label className="text-xs font-semibold text-stone-600">Maps Recepción</label><input type="text" value={recepcionMaps} onChange={(e) => setRecepcionMaps(e.target.value)} className="w-full px-4 py-3 border border-stone-200 rounded-xl text-xs bg-stone-50/50" /></div>
                <div className="space-y-1 md:col-span-2"><label className="text-xs font-semibold text-stone-600">Lugar de la Fiesta</label><input type="text" value={recepcionLugar} onChange={(e) => setRecepcionLugar(e.target.value)} className="w-full px-4 py-3 border border-stone-200 rounded-xl text-xs bg-stone-50/50" /></div>
              </div>
            </div>
            <div className="bg-white rounded-3xl p-6 border border-stone-200/60 flex flex-col justify-between text-left space-y-4">
              <div className="space-y-3">
                <h4 className="text-base font-serif font-medium text-stone-900">Resumen</h4>
                <select value={templateId} onChange={(e) => setTemplateId(e.target.value)} className="w-full p-3 border rounded-xl text-xs font-medium"><option value="romantico-clasico">💍 Romántico Clásico</option><option value="minimal-dark">🖤 Minimalista Dark</option><option value="boho-rancho">🌿 Boho Chic / Campo</option></select>
              </div>
              <button type="button" disabled={guardando} onClick={handleGuardarYContinuar} className="w-full bg-amber-700 text-white text-xs uppercase font-bold py-4 rounded-xl shadow-md cursor-pointer">{guardando ? 'Guardando...' : 'Guardar y Continuar ➔'}</button>
            </div>
          </div>
        ) : pasoActivo === 3 ? (
          /* ==========================================
             PASO 3: GESTIÓN DE INVITADOS & RSVP
             ========================================== */
          <div className="space-y-6 animate-fadeIn text-left">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { t: "Familias Registradas", v: totalInvitados, i: "✉️" },
                { t: "Total Pases Asignados", v: totalPasesAsignados, i: "🎟️" },
                { t: "Asistencias Confirmadas", v: totalConfirmados, i: "✅", c: "text-emerald-700" },
                { t: "Invitaciones Pendientes", v: pendientes, i: "⏳", c: "text-amber-700" }
              ].map((card, idx) => (
                <div key={idx} className="bg-white p-5 rounded-2xl border flex items-center justify-between"><div className="space-y-1"><span className="text-[10px] uppercase font-bold text-stone-400 block">{card.t}</span><span className={`text-xl font-mono font-black ${card.c || 'text-stone-900'}`}>{card.v}</span></div><span className="text-xl bg-stone-50 p-2 rounded-xl">{card.i}</span></div>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              <div className="bg-white rounded-3xl p-6 border space-y-4">
                <h3 className="font-serif text-base font-medium">Agregar Invitado</h3>
                <form onSubmit={handleAgregarInvitado} className="space-y-4">
                  <div className="space-y-1"><label className="text-xs font-semibold text-stone-600">Nombre</label><input type="text" value={nuevoNombre} onChange={(e) => setNuevoNombre(e.target.value)} required className="w-full px-4 py-3 border rounded-xl text-xs bg-stone-50/50" /></div>
                  <div className="space-y-1"><label className="text-xs font-semibold text-stone-600">Pases</label><select value={nuevosPases} onChange={(e) => setNuevosPases(parseInt(e.target.value))} className="w-full p-3 border rounded-xl text-xs text-stone-700 bg-stone-50/50">{[1,2,3,4,5,6,7,8,9,10].map(n => <option key={n} value={n}>{n} {n===1?'Pase':'Pases'}</option>)}</select></div>
                  <button type="submit" className="w-full bg-stone-900 text-white text-xs uppercase font-bold py-3.5 rounded-xl cursor-pointer">➕ Registrar</button>
                </form>
              </div>
              <div className="lg:col-span-2 bg-white rounded-3xl border overflow-hidden flex flex-col justify-between">
                <table className="w-full text-left text-xs border-collapse">
                  <thead><tr className="bg-stone-50 border-b text-stone-500 font-semibold"><th className="p-4 pl-6">Nombre</th><th className="p-4 text-center">Pases</th><th className="p-4 text-center">Confirmados</th><th className="p-4 text-center">Estado</th><th className="p-4 text-center pr-6">Acción</th></tr></thead>
                  <tbody className="divide-y divide-stone-100">
                    {invitados.map((inv) => (
                      <tr key={inv.id} className="hover:bg-stone-50/60"><td className="p-4 pl-6 font-medium text-stone-900">{inv.nombre_invitado}</td><td className="p-4 text-center font-mono font-bold text-stone-500">{inv.pases_totales}</td><td className="p-4 text-center font-mono font-bold text-stone-600">{inv.estado === 'confirmado' ? inv.pases_confirmados : 0}</td><td className="p-4 text-center"><span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md ${inv.estado === 'confirmado' ? 'bg-emerald-50 text-emerald-700' : inv.estado === 'declinado' ? 'bg-rose-50 text-rose-700' : 'bg-amber-50 text-amber-700'}`}>{inv.estado}</span></td><td className="p-4 text-center pr-6"><button type="button" onClick={() => handleEliminarInvitado(inv.id)} className="text-stone-400 hover:text-rose-600 transition-colors cursor-pointer">🗑️</button></td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="text-right"><button type="button" onClick={() => setPasoActivo(4)} className="bg-amber-700 text-white text-xs font-bold uppercase tracking-widest px-6 py-3.5 rounded-xl shadow-md cursor-pointer">Avanzar a Multimedia ➔</button></div>
          </div>
        ) : pasoActivo === 4 ? (
          /* ==========================================
             PASO 4: CARGA DE ARCHIVOS MULTIMEDIA
             ========================================== */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start animate-fadeIn text-left">
            <div className="lg:col-span-2 space-y-6">
              
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
                <div className="pt-4 border-t border-stone-100 space-y-3">
                  <div className="flex justify-between items-center">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-purple-900 flex items-center gap-1.5"><span>👑</span> Tu Canción Especial Única</h5>
                    <span className={`text-[9px] font-black uppercase tracking-wildest px-2.5 py-0.5 rounded-full ${(planContratado === 'vip' || tieneMusicaPersonalizada) ? 'bg-purple-100 text-purple-800' : 'bg-stone-100 text-stone-400'}`}>
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
                      <a href={`https://clickypapel.com/checkout/addon-musica?slug=${weddingSlug}`} className="bg-purple-950 hover:bg-purple-900 text-white text-[10px] uppercase tracking-widest font-bold px-4 py-3 rounded-xl transition-colors text-center shadow-xs flex-none w-full sm:w-auto">💳 Obtener por $350</a>
                    </div>
                  )}
                </div>
              </div>

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
                          {foto && <button type="button" onClick={() => handleFotoChange(index, '')} className="text-[10px] text-rose-600 font-semibold hover:underline cursor-pointer">🗑️ Quitar</button>}
                        </div>
                        {foto ? (
                          <div className="w-full h-24 rounded-xl overflow-hidden border border-stone-200 bg-white shadow-xs"><img src={foto} alt={`Miniatura ${index}`} className="w-full h-full object-cover" /></div>
                        ) : (
                          <div className="w-full h-24 border border-dashed border-stone-200 rounded-xl flex items-center justify-center text-stone-300 font-light text-xs italic bg-white select-none">Vacío — Sin archivo</div>
                        )}
                        <label className="w-full bg-white border border-stone-200 hover:bg-stone-50 text-stone-700 text-[10px] uppercase tracking-wider font-bold py-2.5 rounded-xl text-center cursor-pointer block transition-colors shadow-2xs">
                          {subiendoIndex === index ? '⏱️ Cargando...' : foto ? '🔄 Reemplazar' : '📤 Subir Fotografía'}
                          <input type="file" accept="image/*" disabled={estaBloqueado} onChange={(e) => handleSubirArchivo(e, index, false)} className="hidden" />
                        </label>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            <div className="bg-white rounded-3xl p-6 border border-stone-200/60 shadow-xs flex flex-col justify-between h-full space-y-6 sticky top-6">
              <div className="space-y-4">
                <h4 className="text-base font-serif font-medium text-stone-900">Estado de Publicación</h4>
                <hr className="border-stone-100" />
                <div className="space-y-2 text-xs font-light text-stone-500">
                  <div className="flex justify-between border-b pb-1.5 border-stone-50"><span>Plan:</span><strong className="text-stone-700 font-bold uppercase">{planContratado}</strong></div>
                  <div className="flex justify-between border-b pb-1.5 border-stone-50"><span>Imágenes:</span><strong className="text-stone-700 font-bold">{galeriaFotos.filter(u => u.trim()!=='').length} de {maxFotosPermitidas}</strong></div>
                  <div className="flex justify-between"><span>Audio:</span><span className="text-amber-700 font-mono truncate max-w-[120px]">{musicUrl}</span></div>
                </div>
              </div>
              <button type="button" disabled={guardando} onClick={handleGuardarPaso4} className="w-full bg-stone-950 hover:bg-emerald-700 text-white text-xs uppercase font-bold tracking-widest py-4 rounded-xl shadow-md transition-all text-center cursor-pointer">
                {guardando ? 'Sincronizando...' : 'Guardar y Continuar ➔'}
              </button>
            </div>
          </div>
        ) : (
          /* ==========================================
             ✨ PASO 5: MESA DE REGALOS & FINANCE CONTROL
             ========================================== */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start animate-fadeIn text-left">
            <div className="lg:col-span-2 space-y-6">
              
              {/* CUENTA CLABE */}
              <div className="bg-white rounded-3xl p-6 md:p-8 border border-stone-200/60 shadow-xs space-y-4">
                <h3 className="font-serif text-lg font-medium text-stone-900">💰 Lluvia de Sobres / Transferencias</h3>
                <p className="text-xs text-stone-400 font-light -mt-2">Configura los datos para que tus invitados te envíen aportaciones en efectivo directo a tu cuenta.</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-stone-600">Institución Bancaria</label>
                    <input type="text" value={banco} onChange={(e) => setBanco(e.target.value)} placeholder="Ej. BBVA o Banorte" className="w-full px-4 py-3 border rounded-xl text-xs bg-stone-50/50 focus:border-amber-700 focus:outline-none" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-stone-600">Nombre del Titular</label>
                    <input type="text" value={titular} onChange={(e) => setTitular(e.target.value)} placeholder="Ej. Novios S." className="w-full px-4 py-3 border rounded-xl text-xs bg-stone-50/50 focus:border-amber-700 focus:outline-none" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-stone-600">Cuenta CLABE (18 dígitos)</label>
                    <input type="text" maxLength={18} value={clabe} onChange={(e) => setClabe(e.target.value)} placeholder="0121 8001..." className="w-full px-4 py-3 border rounded-xl text-xs bg-stone-50/50 focus:border-amber-700 focus:outline-none font-mono" />
                  </div>
                </div>
              </div>

              {/* ENLACES CORPORATIVOS */}
              <div className="bg-white rounded-3xl p-6 md:p-8 border border-stone-200/60 shadow-xs space-y-4">
                <h3 className="font-serif text-lg font-medium text-stone-900">🛍️ Mesas de Regalos Corporativas</h3>
                <p className="text-xs text-stone-400 font-light -mt-2">Pega los links de tus mesas oficiales para desplegar los accesos en tu tarjeta de regalos.</p>
                
                <div className="space-y-3 pt-1">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-stone-600">Enlace de Mesa Amazon (URL)</label>
                    <input type="text" value={amazonUrl} onChange={(e) => setAmazonUrl(e.target.value)} placeholder="https://amazon.com.mx/baby-reg/..." className="w-full px-4 py-3 border rounded-xl text-xs bg-stone-50/50 focus:border-amber-700 focus:outline-none font-mono" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-stone-600">Enlace de Mesa Liverpool (URL)</label>
                    <input type="text" value={liverpoolUrl} onChange={(e) => setLiverpoolUrl(e.target.value)} placeholder="https://mesaderegalos.liverpool.com.mx/..." className="w-full px-4 py-3 border rounded-xl text-xs bg-stone-50/50 focus:border-amber-700 focus:outline-none font-mono" />
                  </div>
                </div>
              </div>

            </div>

            {/* GUARDADO FINAL DERECHO */}
            <div className="bg-white rounded-3xl p-6 border border-stone-200/60 shadow-xs flex flex-col justify-between h-full space-y-6 sticky top-6">
              <div className="space-y-3">
                <h4 className="text-base font-serif font-medium text-stone-900">Mesa de Regalos Activa</h4>
                <hr className="border-stone-100" />
                <p className="text-xs text-stone-400 font-light leading-relaxed">Los datos bancarios y enlaces de tiendas que guardes en este paso se renderizarán al instante dentro del componente interactivo de regalos de tu invitación.</p>
              </div>
              <button type="button" disabled={guardando} onClick={handleGuardarPaso5} className="w-full bg-stone-950 hover:bg-emerald-700 text-white text-xs uppercase font-bold tracking-widest py-4 rounded-xl shadow-md transition-all text-center cursor-pointer">
                {guardando ? 'Sincronizando...' : '🚀 Publicar Mesa de Regalos'}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}