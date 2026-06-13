"use client";
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function NoviosDashboard() {
  const weddingSlug = 'bruno-y-brisa'; // Vinculado de forma automática al evento activo

  // Estados de Control de la App
  const [pasoActivo, setPasoActivo] = useState(2); // Controla qué paso renderizar en el Wizard
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

  // Cargar datos iniciales del evento y la lista de invitados de golpe
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
  }, []); // Arreglo vacío = Se ejecuta una sola vez. Adiós congelamientos.

  // Acción del Botón Principal (Guardar Paso 2)
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
      
      setPasoActivo(3); // Cambia dinámicamente al paso de invitados sin recargar
    } catch (err) {
      console.error(err);
      alert("Hubo un error al guardar los datos del evento.");
    } finally {
      setGuardando(false);
    }
  };

  // Agregar nuevo invitado (Acción Paso 3)
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
      
      // Volvemos a jalar la lista de invitados limpia en caliente
      const { data } = await supabase
        .from('invitados')
        .select('*')
        .eq('boda_slug', weddingSlug)
        .order('nombre_invitado', { ascending: true });
      if (data) setInvitados(data);

    } catch (err) {
      alert("No se pudo registrar al invitado.");
    } finally {
      setGuardando(false);
    }
  };

  // Eliminar un invitado (Acción Paso 3)
  const handleEliminarInvitado = async (id) => {
    if (!confirm("¿Deseas eliminar a este invitado de la lista oficial?")) return;
    try {
      const { error } = await supabase .from('invitados') .delete() .eq('id', id);
      if (error) throw error;
      setInvitados(invitados.filter(inv => inv.id !== id));
    } catch (err) {
      alert("Error al eliminar.");
    }
  };

  // Cálculos de métricas rápidas en vivo para el paso 3
  const totalInvitados = invitados.length;
  const totalPasesAsignados = invitados.reduce((acc, curr) => acc + (curr.pases_totales || 0), 0);
  const totalConfirmados = invitados.reduce((acc, curr) => acc + (curr.pases_confirmados || 0), 0);
  const pendientes = invitados.filter(inv => inv.estado === 'pendiente').length;

  if (cargando) {
    return (
      <div className="min-h-screen bg-[#f1ede6] flex items-center justify-center font-serif text-sm tracking-widest text-stone-500 animate-pulse uppercase">
        Sincronizando panel con Supabase... ✨
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f1ede6] text-stone-800 flex font-sans overflow-x-hidden">
      
      {/* 🧭 SIDEBAR LATERAL IZQUIERDO */}
      <aside className="w-20 bg-white border-r border-stone-200 flex flex-col items-center py-6 gap-8 flex-none select-none">
        <div className="w-10 h-10 bg-amber-700/10 rounded-full flex items-center justify-center font-serif text-amber-800 font-bold">c`p</div>
        <nav className="flex flex-col gap-6 text-center w-full">
          {['Inicio', 'Invitación', 'RSVP', 'Regalos', 'Configuración'].map((item, idx) => (
            <button 
              key={item} 
              type="button"
              onClick={() => idx === 1 ? setPasoActivo(2) : idx === 2 ? setPasoActivo(3) : null}
              className={`flex flex-col items-center gap-1 text-[10px] py-2 font-medium transition-colors cursor-pointer ${
                (idx === 1 && pasoActivo === 2) || (idx === 2 && pasoActivo === 3)
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
        
        {/* Header Superior Dinámico */}
        <div className="flex justify-between items-center text-left">
          <div>
            <h1 className="text-2xl md:text-3xl font-serif font-light text-stone-900">¡Bienvenidos, {groomName || 'Novio'} y {brideName || 'Novia'}!</h1>
            <p className="text-xs text-stone-400 font-light mt-0.5">Configura tu invitación inteligente en unos clicks</p>
          </div>
          <div className="flex items-center gap-3 bg-white/60 px-4 py-2 rounded-full border border-stone-200/60 text-xs font-semibold">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" /> Panel Sincronizado
          </div>
        </div>

        {/* LÍNEA DE PROGRESO (WIZARD) INTERACTIVA */}
        <div className="bg-white/40 p-4 rounded-2xl border border-stone-200/40 flex items-center justify-between text-[11px] font-bold text-stone-400 relative select-none">
          <div className="absolute h-[2px] bg-stone-200 top-1/2 left-8 right-8 -translate-y-1/2 z-0" />
          <div className={`absolute h-[2px] bg-amber-700 top-1/2 left-8 -translate-y-1/2 z-0 transition-all duration-500 ${pasoActivo === 2 ? 'w-[33%]' : 'w-[66%]'}`} />
          
          {[
            { n: '1. Plan & Diseño', done: true },
            { n: '2. Datos del Evento', active: pasoActivo === 2, done: pasoActivo > 2 },
            { n: '3. Invitados & Pases', active: pasoActivo === 3, done: pasoActivo > 3 },
            { n: '4. Música & Galería', done: false }
          ].map((p, i) => (
            <button 
              key={i} 
              type="button"
              disabled={i === 0 || i === 3}
              onClick={() => setPasoActivo(i + 1)}
              className="flex flex-col items-center gap-1.5 relative z-10 bg-[#f1ede6] px-3 cursor-pointer disabled:cursor-not-allowed"
            >
              <span className={`w-6 h-6 rounded-full flex items-center justify-center border font-mono text-xs transition-colors ${p.active ? 'bg-amber-700 border-amber-700 text-white' : p.done ? 'bg-white border-amber-700 text-amber-700' : 'bg-white border-stone-300'}`}>
                {p.done ? '✓' : i + 1}
              </span>
              <span className={p.active ? 'text-stone-900 font-extrabold' : 'text-stone-400 font-medium'}>{p.n}</span>
            </button>
          ))}
        </div>

        {/* 🔀 SWITCH DINÁMICO DE RENDERIZADO POR PASOS */}
        {pasoActivo === 2 ? (
          /* ========================================================
             RENDER PASO 2: FORMULARIO DE DATOS DEL EVENTO 
             ======================================================== */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start animate-fadeIn">
            <div className="lg:col-span-2 bg-white rounded-3xl p-6 md:p-8 border border-stone-200/60 shadow-xs space-y-6 text-left">
              <div className="border-b border-stone-100 pb-3">
                <h3 className="text-lg font-serif font-medium text-stone-900">2. Datos del Evento</h3>
                <p className="text-xs text-stone-400 font-light">Completa la información esencial para tus invitados.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-600">Nombre de la Novia</label>
                  <input type="text" value={brideName} onChange={(e) => setBrideName(e.target.value)} className="w-full px-4 py-3 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-amber-700 transition-all bg-stone-50/50" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-600">Nombre del Novio</label>
                  <input type="text" value={groomName} onChange={(e) => setGroomName(e.target.value)} className="w-full px-4 py-3 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-amber-700 transition-all bg-stone-50/50" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-600">Fecha del Evento</label>
                  <input type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} className="w-full px-4 py-3 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-amber-700 transition-all bg-stone-50/50 text-stone-500" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-600">Ubicación de Ceremonia</label>
                  <input type="text" value={ceremoniaLugar} onChange={(e) => setCeremoniaLugar(e.target.value)} className="w-full px-4 py-3 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-amber-700 transition-all bg-stone-50/50" placeholder="Ej. Parroquia San Juan Bautista" />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-600">Link Google Maps Ceremonia</label>
                  <input type="text" value={ceremoniaMaps} onChange={(e) => setCeremoniaMaps(e.target.value)} className="w-full px-4 py-3 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-amber-700 transition-all bg-stone-50/50" placeholder="maps.google.com/..." />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-stone-600">Link Google Maps Recepción</label>
                  <input type="text" value={recepcionMaps} onChange={(e) => setRecepcionMaps(e.target.value)} className="w-full px-4 py-3 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-amber-700 transition-all bg-stone-50/50" placeholder="maps.google.com/..." />
                </div>
                <div className="space-y-1 md:col-span-2">
                  <label className="text-xs font-semibold text-stone-600">Lugar de la Recepción / Fiesta</label>
                  <input type="text" value={recepcionLugar} onChange={(e) => setRecepcionLugar(e.target.value)} className="w-full px-4 py-3 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-amber-700 transition-all bg-stone-50/50" placeholder="Ej. Quinta Los Arcos" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-stone-200/60 shadow-xs space-y-6 text-left flex flex-col justify-between h-full">
              <div className="space-y-4">
                <div>
                  <h4 className="text-base font-serif font-medium text-stone-900">Resumen del Diseño</h4>
                  <hr className="border-stone-100 mt-2" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">Estilo Visual Activo</label>
                  <select value={templateId} onChange={(e) => setTemplateId(e.target.value)} className="w-full p-3 border border-stone-200 rounded-xl text-xs focus:outline-none cursor-pointer bg-stone-50/50 font-medium">
                    <option value="romantico-clasico">💍 Romántico Clásico</option>
                    <option value="minimal-dark">🖤 Minimalista Dark</option>
                    <option value="boho-rancho">🌿 Boho Chic / Campo</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">Previsualización Rápida</label>
                  <div className="bg-stone-50 rounded-2xl p-4 border border-stone-100 flex items-center justify-center aspect-video relative overflow-hidden">
                    <div className="bg-white border shadow-md w-28 h-40 rounded-md p-2 text-center flex flex-col justify-center space-y-1 select-none transform scale-90 transition-all">
                      <span className="text-[5px] uppercase tracking-widest text-stone-400">Nuestra Boda</span>
                      <h5 className="font-serif text-[10px] leading-tight text-amber-900">{brideName || 'Novia'} & {groomName || 'Novio'}</h5>
                      <span className="text-[4px] text-stone-400 font-mono block">19 . DIC . 2026</span>
                    </div>
                  </div>
                </div>
              </div>
              <button type="button" disabled={guardando} onClick={handleGuardarYContinuar} className="w-full bg-amber-700 hover:bg-amber-800 text-white text-xs uppercase font-bold tracking-widest py-4 rounded-xl shadow-md transition-all cursor-pointer mt-6 disabled:opacity-50 text-center">
                {guardando ? 'Guardando...' : 'Guardar y Continuar ➔'}
              </button>
            </div>
          </div>
        ) : (
          /* ========================================================
             RENDER PASO 3: GESTIÓN DE INVITADOS & PASOS (RSVP)
             ======================================================== */
          <div className="space-y-6 animate-fadeIn">
            {/* Tarjetas de Métricas Rápidas */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { t: "Familias Registradas", v: totalInvitados, i: "✉️" },
                { t: "Total Pases Asignados", v: totalPasesAsignados, i: "🎟️" },
                { t: "Asistencias Confirmadas", v: totalConfirmados, i: "✅", c: "text-emerald-700" },
                { t: "Invitaciones Pendientes", v: pendientes, i: "⏳", c: "text-amber-700" }
              ].map((card, idx) => (
                <div key={idx} className="bg-white p-5 rounded-2xl border border-stone-200/60 shadow-xs text-left flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider block">{card.t}</span>
                    <span className={`text-xl font-mono font-black ${card.c || 'text-stone-900'}`}>{card.v}</span>
                  </div>
                  <span className="text-xl bg-stone-50 p-2 rounded-xl">{card.i}</span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              {/* Formulario Agregar */}
              <div className="bg-white rounded-3xl p-6 border border-stone-200/60 shadow-xs space-y-4 text-left">
                <div>
                  <h3 className="font-serif text-base font-medium text-stone-900">Agregar Invitado</h3>
                  <p className="text-[11px] text-stone-400 font-light">Crea un pases específicos para el buscador del RSVP.</p>
                  <hr className="border-stone-100 mt-2" />
                </div>
                <form onSubmit={handleAgregarInvitado} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-stone-600">Nombre de la Familia o Invitado</label>
                    <input type="text" value={nuevoNombre} onChange={(e) => setNuevoNombre(e.target.value)} placeholder="Ej. Familia Martínez Lucio" required className="w-full px-4 py-3 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-amber-700 transition-all bg-stone-50/50" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-stone-600">Pases Totales Permitidos</label>
                    <select value={nuevosPases} onChange={(e) => setNuevosPases(parseInt(e.target.value))} className="w-full p-3 border border-stone-200 rounded-xl text-xs focus:outline-none cursor-pointer bg-stone-50/50 font-medium text-stone-700">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                        <option key={n} value={n}>{n} {n === 1 ? 'Pase' : 'Pases'}</option>
                      ))}
                    </select>
                  </div>
                  <button type="submit" disabled={guardando} className="w-full bg-stone-900 hover:bg-amber-700 text-white text-xs uppercase font-bold tracking-widest py-3.5 rounded-xl shadow-md transition-all cursor-pointer text-center">
                    {guardando ? 'Agregando...' : '➕ Registrar en Lista'}
                  </button>
                </form>
              </div>

              {/* Tabla de Control Oficial */}
              <div className="lg:col-span-2 bg-white rounded-3xl border border-stone-200/60 shadow-xs overflow-hidden flex flex-col justify-between">
                <div className="p-6 border-b border-stone-100 text-left">
                  <h3 className="font-serif text-base font-medium text-stone-900">Lista Oficial de Asistencia</h3>
                  <p className="text-[11px] text-stone-400 font-light">Resultados vinculados en vivo con las respuestas de tus pases digitales.</p>
                </div>
                <div className="overflow-x-auto w-full">
                  {invitados.length === 0 ? (
                    <div className="p-12 text-center text-xs text-stone-400 italic font-light">La lista está vacía. Registra el primer invitado.</div>
                  ) : (
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-stone-50 border-b border-stone-200/60 text-stone-500 font-semibold select-none">
                          <th className="p-4 pl-6">Nombre del Invitado</th>
                          <th className="p-4 text-center">Pases Totales</th>
                          <th className="p-4 text-center">Confirmados</th>
                          <th className="p-4 text-center">Estado</th>
                          <th className="p-4 text-center pr-6">Acción</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100">
                        {invitados.map((inv) => (
                          <tr key={inv.id} className="hover:bg-stone-50/60 transition-colors">
                            <td className="p-4 pl-6 font-medium text-stone-900 max-w-xs truncate">{inv.nombre_invitado}</td>
                            <td className="p-4 text-center font-mono font-bold text-stone-500">{inv.pases_totales}</td>
                            <td className="p-4 text-center font-mono font-bold text-stone-600">{inv.estado === 'confirmado' ? inv.pases_confirmados : 0}</td>
                            <td className="p-4 text-center">
                              <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md ${
                                inv.estado === 'confirmado' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                                inv.estado === 'declinado' ? 'bg-rose-50 text-rose-700 border border-rose-100' :
                                'bg-amber-50 text-amber-700 border border-amber-100'
                              }`}>
                                {inv.estado === 'confirmado' ? 'Confirmado' : inv.estado === 'declinado' ? 'Declinó' : 'Pendiente'}
                              </span>
                            </td>
                            <td className="p-4 text-center pr-6">
                              <button type="button" onClick={() => handleEliminarInvitado(inv.id)} className="text-stone-400 hover:text-rose-600 p-1.5 transition-colors cursor-pointer">🗑️</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
                <div className="p-4 bg-stone-50 border-t border-stone-100 text-right">
                  <span className="text-[10px] text-stone-400 font-light">ClickyPapel RSVP Engine v1.0</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}