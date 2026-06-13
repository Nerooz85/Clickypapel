"use client";
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function NoviosDashboard() {
  const weddingSlug = 'bruno-y-brisa'; 

  // Estados de Control de la App
  const [pasoActivo, setPasoActivo] = useState(2); 
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);

  // 📝 ESTADOS DEL PASO 2: DATOS DEL EVENTO
  const [brideName, setBrideName] = useState('');
  const [groomName, setGroomName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [ceremoniaLugar, setCeremoniaLugar] = useState('');
  const [ceremoniaMaps, setCeremoniaMaps] = useState('');
  const [recepcionLugar, setRecepcionLugar] = useState('');
  const [recepcionMaps, setRecepcionMaps] = useState('');
  const [templateId, setTemplateId] = useState('romantico-clasico');

  // 📊 ESTADOS DEL PASO 3: GESTIÓN DE INVITADOS (RSVP)
  const [invitados, setInvitados] = useState([]);
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [nuevosPases, setNuevosPases] = useState(2);

  // 🎵📸 ESTADOS DEL PASO 4: MÚSICA & GALERÍA
  const [musicUrl, setMusicUrl] = useState('');
  const [imgUrl1, setImgUrl1] = useState('');
  const [imgUrl2, setImgUrl2] = useState('');
  const [imgUrl3, setImgUrl3] = useState('');

  // Cargar todos los datos del evento de golpe
  const cargarTodoElDashboard = async () => {
    try {
      setCargando(true);
      const slugLimpio = weddingSlug ? weddingSlug.toLowerCase().trim() : 'bruno-y-brisa';

      // 1. Jalar información general del evento
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
        setMusicUrl(bodaData.music_url || '');
        
        // Mapeamos las imágenes del arreglo de la galería de Supabase si existen
        if (bodaData.gallery_images && bodaData.gallery_images.length > 0) {
          setImgUrl1(bodaData.gallery_images[0] || '');
          setImgUrl2(bodaData.gallery_images[1] || '');
          setImgUrl3(bodaData.gallery_images[2] || '');
        }
      }

      // 2. Jalar la lista de invitados oficiales
      const { data: listaInvitados, error: invitadosError } = await supabase
        .from('invitados')
        .select('*')
        .eq('boda_slug', slugLimpio)
        .order('nombre_invitado', { ascending: true });

      if (invitadosError) throw invitadosError;
      if (listaInvitados) setInvitados(listaInvitados);

    } catch (err) {
      console.error("Error crítico de sincronización en el Dashboard:", err.message);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarTodoElDashboard();
  }, []);

  // Guardar Paso 2 (Datos)
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

  // Guardar Paso 4 (Música y Galería de Fotos)
  const handleGuardarPaso4 = async () => {
    setGuardando(true);
    try {
      // Creamos el arreglo con los enlaces de fotos limpias que no estén vacías
      const fotosArreglo = [imgUrl1, imgUrl2, imgUrl3].filter(url => url.trim() !== '');

      const { error } = await supabase
        .from('bodas')
        .update({
          music_url: musicUrl.trim(),
          gallery_images: fotosArreglo
        })
        .eq('slug', weddingSlug);

      if (error) throw error;
      alert("✨ ¡Invitación configurada al 100%! Música y galería publicadas en vivo.");
    } catch (err) {
      console.error(err);
      alert("Error al guardar la multimedia.");
    } finally {
      setGuardando(false);
    }
  };

  // Agregar nuevo invitado (Paso 3)
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

  // Eliminar invitado (Paso 3)
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

  const totalInvitados = invitados.length;
  const totalPasesAsignados = invitados.reduce((acc, curr) => acc + (curr.pases_totales || 0), 0);
  const totalConfirmados = invitados.reduce((acc, curr) => acc + (curr.pases_confirmados || 0), 0);
  const pendientes = invitados.filter(inv => inv.estado === 'pendiente').length;

  if (cargando) {
    return <div className="min-h-screen bg-[#f1ede6] flex items-center justify-center font-serif text-sm tracking-widest text-stone-500 animate-pulse uppercase">Sincronizando panel con Supabase... ✨</div>;
  }

  return (
    <div className="min-h-screen bg-[#f1ede6] text-stone-800 flex font-sans overflow-x-hidden">
      
      {/* 🧭 SIDEBAR */}
      <aside className="w-20 bg-white border-r border-stone-200 flex flex-col items-center py-6 gap-8 flex-none select-none">
        <div className="w-10 h-10 bg-amber-700/10 rounded-full flex items-center justify-center font-serif text-amber-800 font-bold">c`p</div>
        <nav className="flex flex-col gap-6 text-center w-full">
          {['Inicio', 'Invitación', 'RSVP', 'Regalos', 'Configuración'].map((item, idx) => (
            <button 
              key={item} 
              type="button"
              onClick={() => idx === 1 ? setPasoActivo(2) : idx === 2 ? setPasoActivo(3) : null}
              className={`flex flex-col items-center gap-1 text-[10px] py-2 font-medium transition-colors cursor-pointer ${
                (idx === 1 && pasoActivo === 2) || (idx === 2 && pasoActivo === 3) || (idx === 1 && pasoActivo === 4)
                  ? 'text-amber-700 bg-amber-50/60 border-r-2 border-amber-700 font-bold' 
                  : 'text-stone-400 hover:text-stone-800'
              }`}
            >
              <span className="text-base">{idx === 0 ? '🏠' : idx === 1 ? '✉️' : idx === 2 ? '📝' : idx === 3 ? '🎁' : '⚙️'}</span>
              {item}
            </button>
          ))}
        </nav>
      </aside>

      {/* 💻 CONTENIDO PRINCIPAL */}
      <main className="flex-1 p-6 md:p-12 space-y-8 overflow-y-auto max-w-7xl mx-auto w-full">
        
        <div className="flex justify-between items-center text-left">
          <div>
            <h1 className="text-2xl md:text-3xl font-serif font-light text-stone-900">¡Bienvenidos, {groomName || 'Novio'} y {brideName || 'Novia'}!</h1>
            <p className="text-xs text-stone-400 font-light mt-0.5">Configura tu invitación inteligente en unos clicks</p>
          </div>
          <div className="flex items-center gap-3 bg-white/60 px-4 py-2 rounded-full border border-stone-200/60 text-xs font-semibold">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" /> Panel Sincronizado
          </div>
        </div>

        {/* LÍNEA DE PROGRESO (WIZARD) DESBLOQUEADA */}
        <div className="bg-white/40 p-4 rounded-2xl border border-stone-200/40 flex items-center justify-between text-[11px] font-bold text-stone-400 relative select-none">
          <div className="absolute h-[2px] bg-stone-200 top-1/2 left-8 right-8 -translate-y-1/2 z-0" />
          <div className={`absolute h-[2px] bg-amber-700 top-1/2 left-8 -translate-y-1/2 z-0 transition-all duration-500 ${pasoActivo === 2 ? 'w-[25%]' : pasoActivo === 3 ? 'w-[50%]' : 'w-[75%]'}`} />
          
          {[
            { n: '1. Plan & Diseño', done: true },
            { n: '2. Datos del Evento', active: pasoActivo === 2, done: pasoActivo > 2 },
            { n: '3. Invitados & Pases', active: pasoActivo === 3, done: pasoActivo > 3 },
            { n: '4. Música & Galería', active: pasoActivo === 4, done: false }
          ].map((p, i) => (
            <button 
              key={i} 
              type="button"
              disabled={i === 0}
              onClick={() => setPasoActivo(i + 1)}
              className="flex flex-col items-center gap-1.5 relative z-10 bg-[#f1ede6] px-3 cursor-pointer"
            >
              <span className={`w-6 h-6 rounded-full flex items-center justify-center border font-mono text-xs transition-colors ${p.active ? 'bg-amber-700 border-amber-700 text-white' : p.done ? 'bg-white border-amber-700 text-amber-700' : 'bg-white border-stone-300'}`}>
                {p.done ? '✓' : i + 1}
              </span>
              <span className={p.active ? 'text-stone-900 font-extrabold' : 'text-stone-400 font-medium'}>{p.n}</span>
            </button>
          ))}
        </div>

        {/* 🔀 CONTROL DE RENDERIZADO */}
        {pasoActivo === 2 ? (
          /* PASO 2 */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start animate-fadeIn">
            <div className="lg:col-span-2 bg-white rounded-3xl p-6 md:p-8 border border-stone-200/60 shadow-xs space-y-6 text-left">
              <div className="border-b border-stone-100 pb-3">
                <h3 className="text-lg font-serif font-medium text-stone-900">2. Datos del Evento</h3>
                <p className="text-xs text-stone-400 font-light">Completa la información esencial para tus invitados.</p>
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
            <div className="bg-white rounded-3xl p-6 border border-stone-200/60 flex flex-col justify-between h-full text-left space-y-4">
              <div className="space-y-3">
                <h4 className="text-base font-serif font-medium text-stone-900">Resumen</h4>
                <select value={templateId} onChange={(e) => setTemplateId(e.target.value)} className="w-full p-3 border rounded-xl text-xs font-medium">
                  <option value="romantico-clasico">💍 Romántico Clásico</option>
                  <option value="minimal-dark">🖤 Minimalista Dark</option>
                  <option value="boho-rancho">🌿 Boho Chic / Campo</option>
                </select>
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
        ) : (
          /* ========================================================
             ✨ NUEVO RENDER PASO 4: MÚSICA & GALERÍA DE FOTOS
             ======================================================== */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start animate-fadeIn text-left">
            <div className="lg:col-span-2 bg-white rounded-3xl p-6 md:p-8 border border-stone-200/60 shadow-xs space-y-6">
              <div className="border-b border-stone-100 pb-3">
                <h3 className="text-lg font-serif font-medium text-stone-900">4. Música & Galería de Recuerdos</h3>
                <p className="text-xs text-stone-400 font-light">Ambienta tu invitación con audio y tus mejores fotografías.</p>
              </div>

              {/* Caja de Música */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase text-amber-800 tracking-wider">🎵 Banda Sonora de la Invitación</h4>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-600">Enlace del Archivo de Audio (.mp3)</label>
                  <input 
                    type="text" 
                    value={musicUrl} 
                    onChange={(e) => setMusicUrl(e.target.value)} 
                    placeholder="Ej. /music/1-thousand-years.mp3 o un enlace directo web"
                    className="w-full px-4 py-3 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-amber-700 bg-stone-50/50" 
                  />
                  <span className="text-[10px] text-stone-400 block pl-1">Puedes dejar el archivo predeterminado o meter una URL directa de tu servidor/bucket.</span>
                </div>
              </div>

              {/* Caja de Galería */}
              <div className="space-y-4 pt-2">
                <h4 className="text-xs font-bold uppercase text-amber-800 tracking-wider">📸 Galería Fotográfica (Enlaces Unsplash o Cloudinary)</h4>
                <p className="text-[11px] text-stone-400 font-light -mt-2">Pega los enlaces directos de las fotos que lucirán en tu carrete interactivo.</p>
                
                <div className="grid grid-cols-1 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-stone-600">Fotografía Principal 1 (URL)</label>
                    <input type="text" value={imgUrl1} onChange={(e) => setImgUrl1(e.target.value)} placeholder="https://images.unsplash.com/photo-..." className="w-full px-4 py-3 border border-stone-200 rounded-xl text-xs bg-stone-50/50 focus:border-amber-700 focus:outline-none" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-stone-600">Fotografía 2 (URL)</label>
                    <input type="text" value={imgUrl2} onChange={(e) => setImgUrl2(e.target.value)} placeholder="https://images.unsplash.com/photo-..." className="w-full px-4 py-3 border border-stone-200 rounded-xl text-xs bg-stone-50/50 focus:border-amber-700 focus:outline-none" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-stone-600">Fotografía 3 (URL)</label>
                    <input type="text" value={imgUrl3} onChange={(e) => setImgUrl3(e.target.value)} placeholder="https://images.unsplash.com/photo-..." className="w-full px-4 py-3 border border-stone-200 rounded-xl text-xs bg-stone-50/50 focus:border-amber-700 focus:outline-none" />
                  </div>
                </div>
              </div>
            </div>

            {/* Guardar Paso 4 */}
            <div className="bg-white rounded-3xl p-6 border border-stone-200/60 shadow-xs flex flex-col justify-between h-full space-y-6">
              <div className="space-y-3">
                <h4 className="text-base font-serif font-medium text-stone-900">Estado de Publicación</h4>
                <hr className="border-stone-100" />
                <p className="text-xs text-stone-400 font-light leading-relaxed">Al guardar este paso, los archivos de música e imágenes se vincularán automáticamente en el carrete de fotos de tu invitación activa.</p>
              </div>
              <button 
                type="button" 
                disabled={guardando} 
                onClick={handleGuardarPaso4} 
                className="w-full bg-stone-950 hover:bg-emerald-700 text-white text-xs uppercase font-bold tracking-widest py-4 rounded-xl shadow-md cursor-pointer transition-all disabled:opacity-50 text-center"
              >
                {guardando ? 'Publicando...' : '🚀 Finalizar e Integrar en Vivo'}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}