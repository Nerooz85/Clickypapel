"use client";
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function NoviosDashboard() {
  // Cambiaremos esto dinámicamente cuando el usuario esté logueado, por ahora usamos tu slug insignia
  const weddingSlug = 'bruno-y-brisa'; 

  const [pasoActivo, setPasoActivo] = useState(2); // Basado en la maqueta (Paso 2: Datos)
  const [cargando, setCargando] = useState(false);
  const [guardando, setGuardando] = useState(false);

  // Estados para el formulario (Paso 2)
  const [brideName, setBrideName] = useState('');
  const [groomName, setGroomName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [ceremoniaLugar, setCeremoniaLugar] = useState('');
  const [ceremoniaMaps, setCeremoniaMaps] = useState('');
  const [recepcionLugar, setRecepcionLugar] = useState('');
  const [recepcionMaps, setRecepcionMaps] = useState('');
  const [templateId, setTemplateId] = useState('romantico-clasico');

  // Jalar datos actuales al cargar el panel
  useEffect(() => {
    async function cargarDatos() {
      setCargando(true);
      const { data, error } = await supabase
        .from('bodas')
        .select('*')
        .eq('slug', weddingSlug)
        .maybeSingle();

      if (data && !error) {
        setBrideName(data.bride_name || '');
        setGroomName(data.groom_name || '');
        // Ajustamos la fecha al formato input datetime-local o date
        setEventDate(data.event_date ? data.event_date.substring(0, 10) : '');
        setCeremoniaLugar(data.ceremonia_lugar || '');
        setCeremoniaMaps(data.ceremonia_maps_url || '');
        setRecepcionLugar(data.recepcion_lugar || '');
        setRecepcionMaps(data.recepcion_maps_url || '');
        setTemplateId(data.template_id || 'romantico-clasico');
      }
      setCargando(false);
    }
    cargarDatos();
  }, []);

  // Guardar datos en Supabase (Acción del botón principal)
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
      
      alert("✨ ¡Datos guardados con éxito en tu base de datos! Avanzando al siguiente paso...");
      setPasoActivo(3); // Avanza automáticamente al paso de invitados
    } catch (err) {
      console.error(err);
      alert("Hubo un error al guardar los datos.");
    } finally {
      setGuardando(false);
    }
  };

  if (cargando) {
    return <div className="min-h-screen bg-[#f4efe6] flex items-center justify-center font-light text-stone-500">Cargando tu panel de control...</div>;
  }

  return (
    <div className="min-h-screen bg-[#f1ede6] text-stone-800 flex font-sans">
      
      {/* 🧭 SIDEBAR LATERAL IZQUIERDO */}
      <aside className="w-20 bg-white border-r border-stone-200 flex flex-col items-center py-6 gap-8 flex-none">
        <div className="w-10 h-10 bg-amber-700/10 rounded-full flex items-center justify-center font-serif text-amber-800 font-bold">c`p</div>
        <nav className="flex flex-col gap-6 text-center w-full">
          {['Inicio', 'Invitación', 'RSVP', 'Regalos', 'Configuración'].map((item, idx) => (
            <button key={item} className={`flex flex-col items-center gap-1 text-[10px] py-2 font-medium transition-colors ${idx === 1 ? 'text-amber-700 bg-amber-50/60 border-r-2 border-amber-700' : 'text-stone-400 hover:text-stone-800'}`}>
              <span className="text-base">{idx === 0 ? '🏠' : idx === 1 ? '✉️' : idx === 2 ? '📝' : idx === 3 ? '🎁' : '⚙️'}</span>
              {item}
            </button>
          ))}
        </nav>
      </aside>

      {/* 💻 CONTENIDO PRINCIPAL */}
      <main className="flex-1 p-8 md:p-12 space-y-8 overflow-y-auto">
        {/* Header Superior */}
        <div className="flex justify-between items-center">
          <div className="text-left">
            <h1 className="text-2xl md:text-3xl font-serif font-light text-stone-900">¡Bienvenidos, {groomName} y {brideName}!</h1>
            <p className="text-xs text-stone-400 font-light mt-0.5">Configura tu invitación inteligente en unos clicks</p>
          </div>
          <div className="flex items-center gap-3 bg-white/60 px-4 py-2 rounded-full border border-stone-200/60 text-xs font-semibold">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" /> Panel Activo
          </div>
        </div>

        {/* LÍNEA DE PROGRESO (WIZARD) */}
        <div className="max-w-4xl mx-auto bg-white/40 p-4 rounded-2xl border border-stone-200/40 flex items-center justify-between text-[11px] font-bold text-stone-400 relative">
          <div className="absolute h-[2px] bg-stone-200 top-1/2 left-8 right-8 -translate-y-1/2 z-0" />
          <div className="absolute h-[2px] bg-amber-700 top-1/2 left-8 w-[33%] -translate-y-1/2 z-0 transition-all duration-500" />
          
          {[
            { n: '1. Plan & Diseño', done: true },
            { n: '2. Datos del Evento', active: true },
            { n: '3. Invitados & Pases', done: false },
            { n: '4. Música & Galería', done: false }
          ].map((p, i) => (
            <div key={i} className="flex flex-col items-center gap-1.5 relative z-10 bg-[#f1ede6] px-3">
              <span className={`w-6 h-6 rounded-full flex items-center justify-center border font-mono text-xs ${p.active ? 'bg-amber-700 border-amber-700 text-white' : p.done ? 'bg-white border-amber-700 text-amber-700' : 'bg-white border-stone-300'}`}>
                {p.done ? '✓' : i + 1}
              </span>
              <span className={p.active ? 'text-stone-900' : 'text-stone-400 font-medium'}>{p.n}</span>
            </div>
          ))}
        </div>

        {/* FORMULARIO + PREVISUALIZADOR */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start max-w-6xl mx-auto">
          
          {/* COLUMNA FORMULARIO (ANCHO 2) */}
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

          {/* COLUMNA DERECHA: RESUMEN Y PREVISUALIZADOR */}
          <div className="bg-white rounded-3xl p-6 border border-stone-200/60 shadow-xs space-y-6 text-left flex flex-col justify-between">
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

              {/* Caja miniatura simulando el teléfono */}
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

            <button
              type="button"
              disabled={guardando}
              onClick={handleGuardarYContinuar}
              className="w-full bg-amber-700 hover:bg-amber-800 text-white text-xs uppercase font-bold tracking-widest py-4 rounded-xl shadow-md transition-all cursor-pointer mt-4 text-center disabled:opacity-50"
            >
              {guardando ? 'Guardando datos...' : 'Guardar y Continuar ➔'}
            </button>
          </div>

        </div>
      </main>

    </div>
  );
}