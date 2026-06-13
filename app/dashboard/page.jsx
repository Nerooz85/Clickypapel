"use client";
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';

export default function NoviosDashboard() {
  const weddingSlug = 'bruno-y-brisa'; 

  // Estados de Control de la App
  const [pasoActivo, setPasoActivo] = useState(4); 
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [subiendoIndex, setSubiendoIndex] = useState(null);

  // 🪙 Información de Compra
  const [planContratado, setPlanContratatado] = useState('premium'); 
  const [tieneMusicaPersonalizada, setTieneMusicaPersonalizada] = useState(false); 

  // 📸✨ ESTADOS EXCLUSIVOS DEL ÁLBUM COMPARTIDO PREMIUM
  const [albumActivado, setAlbumActivado] = useState(false);
  const [codigoMesaUrl, setCodigoMesaUrl] = useState('');
  const [fotosDelEvento, setFotosDelEvento] = useState([]); 

  // 📝 ESTADOS PASO 2
  const [brideName, setBrideName] = useState('');
  const [groomName, setGroomName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [ceremoniaLugar, setCeremoniaLugar] = useState('');
  const [ceremoniaMaps, setCeremoniaMaps] = useState('');
  const [recepcionLugar, setRecepcionLugar] = useState('');
  const [recepcionMaps, setRecepcionMaps] = useState('');
  const [templateId, setTemplateId] = useState('romantico-clasico');

  // 📊 ESTADOS PASO 3
  const [invitados, setInvitados] = useState([]);
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [nuevosPases, setNuevosPases] = useState(2);
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

  // 🗓️🎨 ESTADOS DEL NUEVO PASO 6: CRONOGRAMA & PROTOCOLOS VISUALES
  const [itinerarioMisa, setItinerarioMisa] = useState('');
  const [itinerarioFiesta, setItinerarioFiesta] = useState('');
  const [codigoVestimentaText, setCodigoVestimentaText] = useState('formal'); 
  const [paletaColores, setPaletaColores] = useState('');

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

  const cargarFotosDelAlbumCompartido = async () => {
    try {
      const { data, error } = await supabase.storage
        .from('invitaciones-media')
        .list(`${weddingSlug}/album-fiesta/`, { limit: 20, order: { column: 'created_at', ascending: false } });
      
      if (data && !error) {
        const urlsPublicas = data.map(file => {
          const { data: { publicUrl } } = supabase.storage
            .from('invitaciones-media')
            .getPublicUrl(`${weddingSlug}/album-fiesta/${file.name}`);
          return publicUrl;
        });
        setFotosDelEvento(urlsPublicas);
      }
    } catch (e) { console.error(e); }
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

      alert("📸 ¡Imagen subida al instante!");
    } catch (err) {
      alert("Error al cargar archivo.");
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
        
        // Cargar nuevos datos de logística del paso 6
        setItinerarioMisa(bodaData.itinerario_misa || '');
        setItinerarioFiesta(bodaData.itinerario_fiesta || '');
        setCodigoVestimentaText(bodaData.codigo_vestimenta || 'formal');
        setPaletaColores(bodaData.paleta_colores || '');

        setAlbumActivado(bodaData.album_compartido_activo || false);
        
        // ✨ CONFIGURACIÓN ESTRATÉGICA: Apunta el enlace de mesas a tugrandia.icu
        setCodigoMesaUrl(`https://tugrandia.icu/${slugLimpio}/compartir`);

        if (bodaData.gallery_images) {
          const nuevasFotos = ['', '', '', '', '', ''];
          bodaData.gallery_images.forEach((img, i) => { if(i < 6) nuevasFotos[i] = img; });
          setGaleriaFotos(nuevasFotos);
        }
      }

      const { data: listaInvitados } = await supabase.from('invitados').select('*').eq('boda_slug', slugLimpio).order('nombre_invitado', { ascending: true });
      if (listaInvitados) setInvitados(listaInvitados);

      if (bodaData?.plan_tipo !== 'basicos') {
        await cargarFotosDelAlbumCompartido();
      }

    } catch (err) {
      console.error(err);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => { cargarTodoElDashboard(); }, []);

  const toggleAlbumCompartido = async () => {
    const nuevoEstado = !albumActivado;
    setAlbumActivado(nuevoEstado);
    try {
      await supabase.from('bodas').update({ album_compartido_activo: nuevoEstado }).eq('slug', weddingSlug);
    } catch (e) { console.error(e); }
  };

  const handleGuardarYContinuar = async () => {
    setGuardando(true);
    try {
      await supabase.from('bodas').update({ bride_name: brideName, groom_name: groomName, event_date: eventDate ? `${eventDate}T18:00:00` : null, ceremonia_lugar: ceremoniaLugar, ceremonia_maps_url: ceremoniaMaps, recepcion_lugar: recepcionLugar, recepcion_maps_url: recepcionMaps, template_id: templateId }).eq('slug', weddingSlug);
      setPasoActivo(3); 
    } catch (err) { alert("Error"); } finally { setGuardando(false); }
  };

  const handleAgregarInvitado = async (e) => {
    e.preventDefault(); if (!nuevoNombre.trim()) return; setGuardando(true);
    try {
      await supabase.from('invitados').insert([{ boda_slug: weddingSlug, nombre_invitado: nuevoNombre.trim(), pases_totales: nuevosPases, pases_confirmados: 0, estado: 'pendiente' }]);
      setNuevoNombre(''); setNuevosPases(2);
      const { data } = await supabase.from('invitados').select('*').eq('boda_slug', weddingSlug).order('nombre_invitado', { ascending: true });
      if (data) setInvitados(data);
    } catch (err) { alert("Error"); } finally { setGuardando(false); }
  };

  const handleEliminarInvitado = async (id) => {
    if (!confirm("¿Eliminar?")) return;
    try { await supabase.from('invitados').delete().eq('id', id); setInvitados(invitados.filter(inv => inv.id !== id)); } catch (e) { alert("Error"); }
  };

  const handleGuardarPaso4 = async () => {
    setGuardando(true);
    try {
      const fotosLimpias = galeriaFotos.filter(url => url.trim() !== '');
      await supabase.from('bodas').update({ cover_image: coverImage.trim(), music_url: musicUrl, gallery_images: fotosLimpias }).eq('slug', weddingSlug);
      setPasoActivo(5); 
    } catch (err) { alert("Error"); } finally { setGuardando(false); }
  };

  const handleGuardarPaso5 = async () => {
    setGuardando(true);
    try {
      await supabase.from('bodas').update({ banco: banco.trim(), titular: titular.trim(), clabe: clabe.trim(), amazon_url: amazonUrl.trim(), liverpool_url: liverpoolUrl.trim() }).eq('slug', weddingSlug);
      setPasoActivo(6); 
    } catch (err) { alert("Error"); } finally { setGuardando(false); }
  };

  const handleGuardarPaso6 = async () => {
    setGuardando(true);
    try {
      await supabase.from('bodas').update({
        itinerario_misa: itinerarioMisa.trim(),
        itinerario_fiesta: itinerarioFiesta.trim(),
        codigo_vestimenta: codigoVestimentaText,
        paleta_colores: paletaColores.trim()
      }).eq('slug', weddingSlug);
      alert("🗓️ ¡Línea de tiempo, protocolos y paleta publicados con éxito!");
    } catch (err) { alert("Error al guardar logística."); } finally { setGuardando(false); }
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
          {['Inicio', 'Invitación', 'RSVP', 'Regalos', 'Logística'].map((item, idx) => (
            <button key={item} type="button" onClick={() => idx === 1 ? setPasoActivo(2) : idx === 2 ? setPasoActivo(3) : null} className={`flex flex-col items-center gap-1 text-[10px] py-2 font-medium cursor-pointer ${(idx===1 && pasoActivo===2) || (idx===1 && pasoActivo===4) || (idx===1 && pasoActivo===5) || (idx===1 && pasoActivo===6) || (idx===2 && pasoActivo===3) ? 'text-amber-700 bg-amber-50/60 border-r-2 border-amber-700 font-bold' : 'text-stone-400'}`}>
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
            <p className="text-[11px] text-stone-400 font-light">Manejas el control operativo y los beneficios exclusivos de tu plan.</p>
          </div>
          <span className="text-[10px] bg-stone-900 text-white font-mono font-bold px-3 py-1 rounded-full">Slug: {weddingSlug}</span>
        </div>

        {/* WIZARD RECALCULADO A 6 PASOS */}
        <div className="bg-white/40 p-4 rounded-2xl border border-stone-200/40 flex items-center justify-between text-[11px] font-bold text-stone-400 relative select-none">
          <div className="absolute h-[2px] bg-stone-200 top-1/2 left-8 right-8 -translate-y-1/2 z-0" />
          <div className={`absolute h-[2px] bg-amber-700 top-1/2 left-8 -translate-y-1/2 z-0 transition-all duration-500 ${pasoActivo === 2 ? 'w-[16%]' : pasoActivo === 3 ? 'w-[32%]' : pasoActivo === 4 ? 'w-[48%]' : pasoActivo === 5 ? 'w-[64%]' : 'w-[80%]'}`} />
          
          {[
            { n: '1. Plan', done: true },
            { n: '2. Datos', active: pasoActivo === 2, done: pasoActivo > 2 },
            { n: '3. Invitados', active: pasoActivo === 3, done: pasoActivo > 3 },
            { n: '4. Media', active: pasoActivo === 4, done: pasoActivo > 4 },
            { n: '5. Regalos', active: pasoActivo === 5, done: pasoActivo > 5 },
            { n: '6. Logística', active: pasoActivo === 6, done: false }
          ].map((p, i) => (
            <button key={i} type="button" disabled={i === 0} onClick={() => setPasoActivo(i + 1)} className="flex flex-col items-center gap-1.5 relative z-10 bg-[#f1ede6] px-3 cursor-pointer">
              <span className={`w-6 h-6 rounded-full flex items-center justify-center border font-mono text-xs transition-colors ${p.active ? 'bg-amber-700 border-amber-700 text-white' : p.done ? 'bg-white border-amber-700 text-amber-700' : 'bg-white border-stone-300'}`}>{p.done ? '✓' : i + 1}</span>
              <span className={p.active ? 'text-stone-900 font-extrabold text-[10px]' : 'text-stone-400 font-medium text-[10px]'}>{p.n}</span>
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
          /* PASO 3 */
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
                        <td className="p-4 text-center"><span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md ${inv.estado === 'confirmado' ? 'bg-emerald-50 text-emerald-700' : inv.estado === 'declinado' ? 'bg-rose-50 text-rose-700' : 'bg-amber-50 text-amber-700'}`}>{inv.estado}</span></td>
                        <td className="p-4 text-center pr-6 flex items-center justify-center gap-3">
                          <button type="button" onClick={() => setInvitadoSeleccionado(inv)} className="bg-amber-50 text-amber-900 border text-[10px] font-bold uppercase px-2.5 py-1.5 rounded-lg">🎟️ Diseñar Pase QR</button>
                          <button type="button" onClick={() => handleEliminarInvitado(inv.id)} className="text-stone-300 hover:text-rose-600 text-sm">🗑️</button>
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
              
              <div className="bg-gradient-to-br from-purple-900 to-indigo-950 text-white rounded-3xl p-6 md:p-8 border border-purple-950 shadow-xl space-y-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 transform translate-x-8 -translate-y-6 text-9xl text-white/5 font-serif select-none pointer-events-none">✨</div>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="space-y-1">
                    <span className="text-[9px] bg-purple-500/30 text-purple-300 border border-purple-500/40 font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider font-mono">Beneficio Exclusivo Premium</span>
                    <h3 className="font-serif text-lg font-light text-white">📸 Álbum Digital Colectivo en Vivo</h3>
                    <p className="text-xs text-purple-200/70 font-light">Permite que tus invitados suban capturas el día del evento escaneando un QR de mesa.</p>
                  </div>
                  <button type="button" onClick={toggleAlbumCompartido} className={`px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider font-bold transition-all shadow-md cursor-pointer ${albumActivado ? 'bg-emerald-600 text-white' : 'bg-white text-purple-900'}`}>{albumActivado ? '🟢 Álbum Activo' : '🔒 Activar Función'}</button>
                </div>
                {albumActivado && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-white/10 border-dashed items-center animate-fadeIn">
                    <div className="md:col-span-2 space-y-2">
                      <p className="text-xs font-semibold text-purple-200">🖨️ Código QR Oficial para Imprimir en tus Mesas:</p>
                      <input type="text" readOnly value={codigoMesaUrl} className="w-full px-3 py-2 rounded-xl text-xs bg-black/20 border border-white/10 font-mono text-purple-300" />
                    </div>
                    {/* ✨ CONFIGURACIÓN ESTRATÉGICA: Código QR de Mesas codificado para tugrandia.icu */}
                    <div className="bg-white p-2 rounded-2xl w-28 h-28 mx-auto shadow-md flex items-center justify-center">
                      <img src={`https://chart.googleapis.com/chart?cht=qr&chs=120x120&chl=${codigoMesaUrl}`} alt="QR" className="w-full h-full" />
                    </div>
                  </div>
                )}
                {albumActivado && (
                  <div className="pt-4 border-t border-white/10 space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-purple-300">Carrete en Vivo de la Fiesta ({fotosDelEvento.length} capturas)</h4>
                    {fotosDelEvento.length === 0 ? <div className="text-xs text-purple-200/50 italic bg-black/10 border rounded-xl p-6">El carrete colectivo está listo...</div> : <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 max-h-40 overflow-y-auto">{fotosDelEvento.map((url, i) => <div key={i} className="aspect-square bg-black/20 rounded-xl overflow-hidden"><img src={url} className="w-full h-full object-cover" /></div>)}</div>}
                  </div>
                )}
              </div>

              <div className="bg-white rounded-3xl p-6 md:p-8 border space-y-4">
                <h3 className="font-serif text-lg font-medium">🖼️ Fotografía de Portada</h3>
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <input type="text" value={coverImage} readOnly placeholder="Sin archivo..." className="w-full px-4 py-3 border rounded-xl text-xs bg-stone-50/50 font-mono" />
                  <label className="bg-stone-900 text-white text-xs font-bold px-5 py-3.5 rounded-xl cursor-pointer">📸 Cargar<input type="file" accept="image/*" onChange={(e) => handleSubirArchivo(e, null, true)} className="hidden" /></label>
                </div>
              </div>

              <div className="bg-white rounded-3xl p-6 md:p-8 border space-y-6">
                <h3 className="font-serif text-lg font-medium">🎵 Banda Sonora</h3>
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

              <div className="bg-white rounded-3xl p-6 md:p-8 border space-y-4">
                <h3 className="font-serif text-lg font-medium">📸 Carrete Fotográfico Base</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {galeriaFotos.map((foto, index) => (
                    <div key={index} className="bg-stone-50/60 p-4 rounded-xl border space-y-2">
                      <span className="text-xs font-bold text-stone-600">Imagen {index+1}</span>
                      {foto && <div className="w-full h-20 rounded-lg overflow-hidden border mb-1"><img src={foto} className="w-full h-full object-cover" /></div>}
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
        ) : pasoActivo === 5 ? (
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
              <button type="button" disabled={guardando} onClick={handleGuardarPaso5} className="w-full bg-stone-950 text-white text-xs uppercase font-bold py-4 rounded-xl shadow-md cursor-pointer">{guardando ? 'Sincronizando...' : 'Guardar y Continuar ➔'}</button>
            </div>
          </div>
        ) : (
          /* PASO 6 */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start animate-fadeIn text-left">
            <div className="lg:col-span-2 space-y-6">
              
              {/* CRONOGRAMA */}
              <div className="bg-white rounded-3xl p-6 md:p-8 border border-stone-200/60 shadow-xs space-y-4">
                <h3 className="font-serif text-lg font-medium text-stone-900">🗓️ Cronograma de Horarios</h3>
                <p className="text-xs text-stone-400 font-light -mt-2">Establece los horarios clave para guiar a tus invitados durante el protocolo.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-stone-600">Hora de la Ceremonia (Misa)</label>
                    <input type="text" value={itinerarioMisa} onChange={(e) => setItinerarioMisa(e.target.value)} placeholder="Ej. 18:00 hrs" className="w-full px-4 py-3 border rounded-xl text-xs bg-stone-50/50" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-stone-600">Hora de la Fiesta (Banquete)</label>
                    <input type="text" value={itinerarioFiesta} onChange={(e) => setItinerarioFiesta(e.target.value)} placeholder="Ej. 20:30 hrs" className="w-full px-4 py-3 border rounded-xl text-xs bg-stone-50/50" />
                  </div>
                </div>
              </div>

              {/* DRESS CODE */}
              <div className="bg-white rounded-3xl p-6 md:p-8 border border-stone-200/60 shadow-xs space-y-4">
                <h3 className="font-serif text-lg font-medium text-stone-900">👔 Código de Vestimenta & Paleta</h3>
                <p className="text-xs text-stone-400 font-light -mt-2">Comunícale a tus amigos qué tipo de vestuario se requiere y sugiéreles colores.</p>
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-stone-600">Protocolo de Vestimenta</label>
                    <select value={codigoVestimentaText} onChange={(e) => setCodigoVestimentaText(e.target.value)} className="w-full p-3 border rounded-xl text-xs bg-stone-50/50 cursor-pointer font-medium text-stone-700">
                      <option value="formal">Gala / Etiqueta Formal</option>
                      <option value="coctel">Vestimenta de Cóctel</option>
                      <option value="guayabera">Guayabera / Playa Chic</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-stone-600">Paleta de Colores Sugerida (Texto descriptivo)</label>
                    <input type="text" value={paletaColores} onChange={(e) => setPaletaColores(e.target.value)} placeholder="Ej. Tonos terracota, beige, verde olivo" className="w-full px-4 py-3 border rounded-xl text-xs bg-stone-50/50 focus:border-amber-700 focus:outline-none" />
                  </div>
                </div>
              </div>

            </div>

            {/* GUARDAR LOGÍSTICA */}
            <div className="bg-white rounded-3xl p-6 border border-stone-200/60 shadow-xs flex flex-col justify-between h-full space-y-6 sticky top-6">
              <div className="space-y-3">
                <h4 className="text-base font-serif font-medium text-stone-900">Logística de Evento</h4>
                <hr className="border-stone-100" />
                <p className="text-xs text-stone-400 font-light leading-relaxed">Guardar este paso inyectará los datos de protocolo de vestimenta y cronograma dentro de los componentes de tu invitación.</p>
              </div>
              <button 
                type="button" 
                disabled={guardando} 
                onClick={handleGuardarPaso6} 
                className="w-full bg-stone-950 hover:bg-emerald-700 text-white text-xs uppercase font-bold tracking-widest py-4 rounded-xl shadow-md transition-all text-center cursor-pointer"
              >
                {guardando ? 'Sincronizando...' : '🚀 Lanzar Logística en Vivo'}
              </button>
            </div>
          </div>
        )}
      </main>

      {/* MODAL DEL PASE QR */}
      {invitadoSeleccionado && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 text-center space-y-6 max-w-sm w-full shadow-2xl">
            <h4 className="font-serif text-base font-medium">Tarjeta de Acceso Oficial</h4>
            <div className="bg-[#fcfbfa] border-2 border-dashed border-stone-200 rounded-2xl p-5 space-y-4">
              <h5 className="font-serif text-lg">{brideName} & {groomName}</h5>
              
              {/* ✨ CONFIGURACIÓN ESTRATÉGICA: Código QR Individual mapeado para tugrandia.icu */}
              <div className="w-36 h-36 mx-auto bg-white p-2.5 rounded-xl border flex items-center justify-center">
                <img src={`https://chart.googleapis.com/chart?cht=qr&chs=150x150&chl=https://tugrandia.icu/${weddingSlug}/rsvp?id=${invitadoSeleccionado.id}`} alt="QR" className="w-full h-full" />
              </div>
              
              <p className="text-xs font-bold">{invitadoSeleccionado.nombre_invitado}</p>
              <div className="bg-stone-900 text-white text-[9px] uppercase px-3 py-1 rounded-full">🎟️ {invitadoSeleccionado.pases_totales} Pases</div>
            </div>
            <button type="button" onClick={() => setInvitadoSeleccionado(null)} className="w-full bg-stone-100 text-stone-700 text-xs font-bold uppercase py-3 rounded-xl">✕ Cerrar</button>
          </div>
        </div>
      )}

    </div>
  );
}