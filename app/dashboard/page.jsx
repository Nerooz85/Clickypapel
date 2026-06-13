"use client";
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';

export default function NoviosDashboard() {
  const weddingSlug = 'bruno-y-brisa'; 

  // Estados de Control de la App
  const [pasoActivo, setPasoActivo] = useState(3); // Lo dejamos en el paso 3 para visualizar la tabla de pases
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [subiendoIndex, setSubiendoIndex] = useState(null);

  // 🪙 Información de Compra
  const [planContratado, setPlanContratatado] = useState('premium'); 
  const [tieneMusicaPersonalizada, setTieneMusicaPersonalizada] = useState(false); 

  // 📝 ESTADOS PASO 2
  const [brideName, setBrideName] = useState('');
  const [groomName, setGroomName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [ceremoniaLugar, setCeremoniaLugar] = useState('');
  const [ceremoniaMaps, setCeremoniaMaps] = useState('');
  const [recepcionLugar, setRecepcionLugar] = useState('');
  const [recepcionMaps, setRecepcionMaps] = useState('');
  const [templateId, setTemplateId] = useState('romantico-clasico');

  // 📊 ESTADOS PASO 3 (Invitados)
  const [invitados, setInvitados] = useState([]);
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [nuevosPases, setNuevosPases] = useState(2);

  // 🎫 ESTADO PARA EL MODAL DEL PASE QR
  const [invitadoSeleccionado, setInvitadoSeleccionado] = useState(null);

  // 🎵📸 ESTADOS PASO 4
  const [coverImage, setCoverImage] = useState(''); 
  const [musicUrl, setMusicUrl] = useState('/music/1-thousand-years.mp3');
  const [galeriaFotos, setGaleriaFotos] = useState(['', '', '', '', '', '']); 

  const [cancionSonando, setCancionSonando] = useState(null);
  const audioPrevioRef = useRef(null);

  // 💰 ESTADOS PASO 5
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

  const handleSubirArchivo = async (e, index, esPortada = false) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      if (esPortada) setSubiendoIndex('portada');
      else setSubiendoIndex(index);

      const fileExt = file.name.split('.').pop();
      const fileName = `${weddingSlug}-${esPortada ? 'portada' : `foto-${index}`}-${Date.now()}.${fileExt}`;
      const filePath = `${weddingSlug}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('invitaciones-media')
        .upload(filePath, file, { cacheControl: '3600', upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('invitaciones-media').getPublicUrl(filePath);

      if (esPortada) setCoverImage(publicUrl);
      else handleFotoChange(index, publicUrl);

      alert("📸 ¡Imagen subida con éxito!");
    } catch (err) {
      alert("No se pudo subir la imagen.");
    } finally {
      setSubiendoIndex(null);
    }
  };

  const cargarTodoElDashboard = async () => {
    try {
      setCargando(true);
      const slugLimpio = weddingSlug ? weddingSlug.toLowerCase().trim() : 'bruno-y-brisa';

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
      alert("Error al guardar.");
    } finally {
      setGuardando(false);
    }
  };

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
      alert("Error al registrar.");
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

  const handleGuardarPaso4 = async () => {
    setGuardando(true);
    try {
      const fotosLimpias = galeriaFotos.filter(url => url.trim() !== '');
      const { error } = await supabase
        .from('bodas')
        .update({ cover_image: coverImage.trim(), music_url: musicUrl, gallery_images: fotosLimpias })
        .eq('slug', weddingSlug);
      if (error) throw error;
      setPasoActivo(5); 
    } catch (err) {
      alert("Error al guardar multimedia.");
    } finally {
      setGuardando(false);
    }
  };

  const handleGuardarPaso5 = async () => {
    setGuardando(true);
    try {
      const { error } = await supabase
        .from('bodas')
        .update({ banco: banco.trim(), titular: titular.trim(), clabe: clabe.trim(), amazon_url: amazonUrl.trim(), liverpool_url: liverpoolUrl.trim() })
        .eq('slug', weddingSlug);
      if (error) throw error;
      alert("🎁 ¡Mesa de regalos guardada con éxito!");
    } catch (err) {
      alert("Error al guardar regalos.");
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
    <div className="min-h-screen bg-[#f1ede6] text-stone-800 flex font-sans overflow-x-hidden relative">
      <audio ref={audioPrevioRef} loop />

      {/* 🧭 SIDEBAR */}
      <aside className="w-20 bg-white border-r border-stone-200 flex flex-col items-center py-6 gap-8 flex-none select-none">
        <div className="w-10 h-10 bg-amber-700/10 rounded-full flex items-center justify-center font-serif text-amber-800 font-bold">c`p</div>
        <nav className="flex flex-col gap-6 text-center w-full">
          {['Inicio', 'Invitación', 'RSVP', 'Regalos', 'Configuración'].map((item, idx) => (
            <button key={item} type="button" onClick={() => idx === 1 ? setPasoActivo(2) : idx === 2 ? setPasoActivo(3) : null} className={`flex flex-col items-center gap-1 text-[10px] py-2 font-medium cursor-pointer ${(idx===1 && pasoActivo===2) || (idx===1 && pasoActivo===4) || (idx===1 && pasoActivo===5) || (idx===2 && pasoActivo===3) ? 'text-amber-700 bg-amber-50/60 border-r-2 border-amber-700 font-bold' : 'text-stone-400'}`}>
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
            <p className="text-[11px] text-stone-400 font-light">Manejas el control operativo de tu evento.</p>
          </div>
          <span className="text-[10px] bg-stone-900 text-white font-mono font-bold px-3 py-1 rounded-full">Slug: {weddingSlug}</span>
        </div>

        {/* WIZARD */}
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

        {/* RENDERS DINÁMICOS */}
        {pasoActivo === 2 ? (
          /* PASO 2 */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start animate-fadeIn text-left">
            <div className="lg:col-span-2 bg-white rounded-3xl p-6 md:p-8 border border-stone-200/60 shadow-xs space-y-6">
              <div className="border-b border-stone-100 pb-3"><h3 className="text-lg font-serif font-medium text-stone-900">2. Datos del Evento</h3></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1"><label className="text-xs font-semibold text-stone-600">Novia</label><input type="text" value={brideName} onChange={(e) => setBrideName(e.target.value)} className="w-full px-4 py-3 border rounded-xl text-xs bg-stone-50/50" /></div>
                <div className="space-y-1"><label className="text-xs font-semibold text-stone-600">Novio</label><input type="text" value={groomName} onChange={(e) => setGroomName(e.target.value)} className="w-full px-4 py-3 border rounded-xl text-xs bg-stone-50/50" /></div>
                <div className="space-y-1"><label className="text-xs font-semibold text-stone-600">Fecha</label><input type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} className="w-full px-4 py-3 border rounded-xl text-xs bg-stone-50/50" /></div>
                <div className="space-y-1"><label className="text-xs font-semibold text-stone-600">Lugar Ceremonia</label><input type="text" value={ceremoniaLugar} onChange={(e) => setCeremoniaLugar(e.target.value)} className="w-full px-4 py-3 border rounded-xl text-xs bg-stone-50/50" /></div>
                <div className="space-y-1"><label className="text-xs font-semibold text-stone-600">Maps Ceremonia</label><input type="text" value={ceremoniaMaps} onChange={(e) => setCeremoniaMaps(e.target.value)} className="w-full px-4 py-3 border rounded-xl text-xs bg-stone-50/50" /></div>
                <div className="space-y-1"><label className="text-xs font-semibold text-stone-600">Maps Recepción</label><input type="text" value={recepcionMaps} onChange={(e) => setRecepcionMaps(e.target.value)} className="w-full px-4 py-3 border rounded-xl text-xs bg-stone-50/50" /></div>
                <div className="space-y-1 md:col-span-2"><label className="text-xs font-semibold text-stone-600">Lugar Fiesta</label><input type="text" value={recepcionLugar} onChange={(e) => setRecepcionLugar(e.target.value)} className="w-full px-4 py-3 border rounded-xl text-xs bg-stone-50/50" /></div>
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
             PASO 3: LISTA CON GENERADOR DE PASES QR
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
                  <thead><tr className="bg-stone-50 border-b text-stone-500 font-semibold"><th className="p-4 pl-6">Nombre</th><th className="p-4 text-center">Pases</th><th className="p-4 text-center">Estado</th><th className="p-4 text-center pr-6">Acciones Real-Time</th></tr></thead>
                  <tbody className="divide-y divide-stone-100">
                    {invitados.map((inv) => (
                      <tr key={inv.id} className="hover:bg-stone-50/60">
                        <td className="p-4 pl-6 font-medium text-stone-900">{inv.nombre_invitado}</td>
                        <td className="p-4 text-center font-mono font-bold text-stone-500">{inv.pases_totales}</td>
                        <td className="p-4 text-center">
                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md ${inv.estado === 'confirmado' ? 'bg-emerald-50 text-emerald-700' : inv.estado === 'declinado' ? 'bg-rose-50 text-rose-700' : 'bg-amber-50 text-amber-700'}`}>{inv.estado}</span>
                        </td>
                        <td className="p-4 text-center pr-6 flex items-center justify-center gap-3">
                          {/* ✨ BOTÓN INTERACTIVO PARA DISPARAR EL MODAL DEL PASO DIGITAL IMPRIMIBLE */}
                          <button 
                            type="button" 
                            onClick={() => setInvitadoSeleccionado(inv)}
                            className="bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
                          >
                            🎟️ Diseñar Pase QR
                          </button>
                          <button type="button" onClick={() => handleEliminarInvitado(inv.id)} className="text-stone-300 hover:text-rose-600 transition-colors cursor-pointer text-sm">🗑️</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="text-right"><button type="button" onClick={() => setPasoActivo(4)} className="bg-amber-700 text-white text-xs font-bold uppercase tracking-widest px-6 py-3.5 rounded-xl shadow-md cursor-pointer">Avanzar a Multimedia ➔</button></div>
          </div>
        ) : pasoActivo === 4 ? (
          /* PASO 4 */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start animate-fadeIn text-left">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-3xl p-6 border space-y-4">
                <h3 className="font-serif text-lg font-medium">🖼️ Fotografía de Portada</h3>
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <input type="text" value={coverImage} readOnly placeholder="Sin archivo..." className="w-full px-4 py-3 border rounded-xl text-xs bg-stone-50/50 font-mono focus:outline-none" />
                  <label className="bg-stone-900 text-white text-xs font-bold px-5 py-3.5 rounded-xl cursor-pointer select-none">📸 Cargar<input type="file" accept="image/*" onChange={(e) => handleSubirArchivo(e, null, true)} className="hidden" /></label>
                </div>
              </div>
              <div className="bg-white rounded-3xl p-6 border space-y-6">
                <h3 className="font-serif text-lg font-medium">🎵 Catálogo de Audio</h3>
                <div className="space-y-2">
                  {cancionesCatalogo.map((track) => (
                    <div key={track.id} className={`flex items-center justify-between p-3 rounded-xl border ${musicUrl === track.url ? 'border-amber-600 bg-amber-50/10' : 'border-stone-100'}`}>
                      <div className="flex items-center gap-3">
                        <button type="button" onClick={() => escucharCancion(track.url)} className="w-7 h-7 rounded-full bg-white border text-xs">{cancionSonando === track.url ? '⏸️' : '▶️'}</button>
                        <span className="text-xs font-medium">{track.titulo}</span>
                      </div>
                      <input type="radio" name="track" checked={musicUrl === track.url} onChange={() => setMusicUrl(track.url)} className="accent-amber-700" />
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white rounded-3xl p-6 border space-y-4">
                <h3 className="font-serif text-lg font-medium">📸 Carrete Fotográfico</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {galeriaFotos.map((foto, index) => (
                    <div key={index} className="bg-stone-50/60 p-4 rounded-xl border space-y-2">
                      <span className="text-xs font-bold text-stone-600">Imagen {index+1}</span>
                      <label className="w-full bg-white border text-stone-700 text-[10px] font-bold py-2 rounded-xl text-center cursor-pointer block">📤 Subir Foto<input type="file" accept="image/*" onChange={(e) => handleSubirArchivo(e, index, false)} className="hidden" /></label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="bg-white rounded-3xl p-6 border flex flex-col justify-between h-full space-y-6 sticky top-6">
              <button type="button" disabled={guardando} onClick={handleGuardarPaso4} className="w-full bg-stone-950 text-white text-xs uppercase font-bold py-4 rounded-xl shadow-md cursor-pointer">{guardando ? 'Sincronizando...' : 'Guardar y Continuar ➔'}</button>
            </div>
          </div>
        ) : (
          /* PASO 5 */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start animate-fadeIn text-left">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-3xl p-6 border space-y-4">
                <h3 className="font-serif text-lg font-medium">💰 Datos Bancarios</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input type="text" value={banco} onChange={(e) => setBanco(e.target.value)} placeholder="Banco" className="w-full px-4 py-3 border rounded-xl text-xs bg-stone-50/50" />
                  <input type="text" value={titular} onChange={(e) => setTitular(e.target.value)} placeholder="Titular" className="w-full px-4 py-3 border rounded-xl text-xs bg-stone-50/50" />
                  <input type="text" maxLength={18} value={clabe} onChange={(e) => setClabe(e.target.value)} placeholder="CLABE" className="w-full px-4 py-3 border rounded-xl text-xs bg-stone-50/50" />
                </div>
              </div>
              <div className="bg-white rounded-3xl p-6 border space-y-4">
                <h3 className="font-serif text-lg font-medium">🛍️ Mesas de Regalos</h3>
                <input type="text" value={amazonUrl} onChange={(e) => setAmazonUrl(e.target.value)} placeholder="Mesa Amazon URL" className="w-full px-4 py-3 border rounded-xl text-xs bg-stone-50/50 font-mono" />
                <input type="text" value={liverpoolUrl} onChange={(e) => setLiverpoolUrl(e.target.value)} placeholder="Mesa Liverpool URL" className="w-full px-4 py-3 border rounded-xl text-xs bg-stone-50/50 font-mono" />
              </div>
            </div>
            <div className="bg-white rounded-3xl p-6 border flex flex-col justify-between h-full space-y-6 sticky top-6">
              <button type="button" disabled={guardando} onClick={handleGuardarPaso5} className="w-full bg-stone-950 text-white text-xs uppercase font-bold py-4 rounded-xl shadow-md cursor-pointer">{guardando ? 'Sincronizando...' : '🚀 Publicar Todo'}</button>
            </div>
          </div>
        )}
      </main>

      {/* ========================================================
         👑 INTERFAZ MODAL: VENTANA DE PASE IMPRIMIBLE CON CÓDIGO QR
         ======================================================== */}
      {invitadoSeleccionado && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-3xl border border-stone-200 shadow-2xl max-w-sm w-full p-6 text-center space-y-6 relative">
            
            {/* Encabezado del modal */}
            <div className="text-center space-y-1">
              <h4 className="font-serif text-base font-medium text-stone-900">Tarjeta de Acceso Oficial</h4>
              <p className="text-[11px] text-stone-400 font-light">Captura la pantalla y envíala por WhatsApp al invitado.</p>
            </div>

            {/* 🎟️ DISEÑO EXCLUSIVO DEL PASE "CLICKYPAPEL" */}
            <div className="bg-[#fcfbfa] border-2 border-dashed border-stone-200 rounded-2xl p-5 space-y-4 relative overflow-hidden select-none">
              <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-white border-r border-stone-200 rounded-full" />
              <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-white border-l border-stone-200 rounded-full" />

              <div className="text-center space-y-0.5">
                <span className="text-[9px] uppercase tracking-widest text-amber-800 font-bold font-mono">Nuestra Boda</span>
                <h5 className="font-serif text-lg text-stone-900 leading-tight">{brideName || 'Novia'} & {groomName || 'Novio'}</h5>
              </div>

              {/* Generación en caliente del Código QR de Google Charts API */}
              <div className="w-36 h-36 mx-auto bg-white p-2.5 rounded-xl border border-stone-100 shadow-2xs flex items-center justify-center">
                <img 
                  src={`https://chart.googleapis.com/chart?cht=qr&chs=150x150&chl=https://clickypapel.com/${weddingSlug}/rsvp?id=${invitadoSeleccionado.id}`} 
                  alt="Código QR de Acceso Exclusivo" 
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="text-center space-y-1 pt-1 border-t border-stone-100 border-dashed">
                <p className="text-xs font-bold text-stone-900 truncate max-w-[240px] mx-auto">{invitadoSeleccionado.nombre_invitado}</p>
                <div className="inline-block bg-stone-900 text-white text-[9px] uppercase font-mono font-black px-3 py-1 rounded-full tracking-wider">
                  🎟️ {invitadoSeleccionado.pases_totales} {invitadoSeleccionado.pases_totales === 1 ? 'Pase Autorizado' : 'Pases Autorizados'}
                </div>
              </div>
            </div>

            {/* Acciones de cierre del modal */}
            <div className="grid grid-cols-1 gap-2">
              <button 
                type="button" 
                onClick={() => setInvitadoSeleccionado(null)}
                className="w-full bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold uppercase tracking-wider py-3 rounded-xl transition-colors cursor-pointer"
              >
                ✕ Cerrar Vista de Tarjeta
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}