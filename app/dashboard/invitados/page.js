"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function InvitadosDashboard() {
  const router = useRouter();

  // 🔐 El slug NUNCA se hardcodea: se resuelve desde la sesión, igual que el
  // dashboard principal — las bodas del usuario, ?slug= o la más reciente.
  // Antes era 'bruno-y-brisa' fijo: cualquier usuario veía y editaba los
  // invitados de la boda demo, nunca los suyos.
  const [weddingSlug, setWeddingSlug] = useState(null);
  const [sinEventos, setSinEventos] = useState(false);

  // Estados del módulo
  const [invitados, setInvitados] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);

  // Estados para el formulario de nuevo invitado
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [nuevosPases, setNuevosPases] = useState(2);

  // Cargar lista de invitados desde Supabase
  const cargarInvitados = async () => {
    if (!weddingSlug) return;
    setCargando(true);
    const { data, error } = await supabase
      .from('invitados')
      .select('*')
      .eq('boda_slug', weddingSlug)
      .order('nombre_invitado', { ascending: true });

    if (data && !error) {
      setInvitados(data);
    }
    setCargando(false);
  };

  // 🔐 Paso 1: sesión → bodas del usuario → slug a gestionar.
  useEffect(() => {
    let activo = true;

    (async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        router.replace('/login');
        return;
      }

      const { data: eventos } = await supabase
        .from('bodas')
        .select('slug')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (!activo) return;

      if (!eventos || eventos.length === 0) {
        setSinEventos(true);
        setCargando(false);
        return;
      }

      // ?slug= permite elegir cuál gestionar cuando tiene más de uno.
      const pedido = new URLSearchParams(window.location.search).get('slug');
      const elegido = eventos.find((e) => e.slug === pedido) || eventos[0];
      setWeddingSlug(elegido.slug);
    })();

    return () => { activo = false; };
  }, [router]);

  // 🔐 Paso 2: cuando ya sabemos el slug, cargamos sus invitados.
  useEffect(() => {
    if (weddingSlug) cargarInvitados();
  }, [weddingSlug]);

  // Agregar un nuevo invitado a la base de datos
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
      await cargarInvitados(); // Refrescar tabla en caliente
    } catch (err) {
      console.error(err);
      alert("Hubo un problema al agregar al invitado.");
    } finally {
      setGuardando(false);
    }
  };

  // Eliminar un invitado
  const handleEliminarInvitado = async (id) => {
    if (!confirm("¿Estás seguro de que deseas eliminar a este invitado de la lista oficial?")) return;

    try {
      const { error } = await supabase
        .from('invitados')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setInvitados(invitados.filter(inv => inv.id !== id));
    } catch (err) {
      alert("No se pudo eliminar al invitado.");
    }
  };

  // Métricas rápidas para las tarjetas superiores
  const totalInvitados = invitados.length;
  const totalPasesAsignados = invitados.reduce((acc, curr) => acc + (curr.pases_totales || 0), 0);
  const totalConfirmados = invitados.reduce((acc, curr) => acc + (curr.pases_confirmados || 0), 0);
  const pendientes = invitados.filter(inv => inv.estado === 'pendiente').length;

  if (sinEventos) {
    return (
      <div className="min-h-screen bg-[var(--nieve)] text-[var(--tinta)] p-6 md:p-12 flex flex-col items-center justify-center gap-4 text-center font-ui">
        <p className="font-display text-2xl font-light">Aún no tienes eventos</p>
        <p className="text-xs text-[var(--tinta-suave)] font-light">Crea tu primera invitación para gestionar su lista de invitados.</p>
        <a href="/dashboard" className="bg-[var(--cafe)] text-white text-xs uppercase font-bold tracking-widest px-5 py-3 rounded-xl">← Volver a mi panel</a>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--nieve)] text-[var(--tinta)] p-6 md:p-12 space-y-8 font-ui">
      <a href="/dashboard" className="text-[11px] uppercase tracking-widest font-bold text-[var(--tinta-suave)] hover:text-[var(--cafe)] transition-colors">← Volver a mi panel</a>
      
      {/* 📊 ENCABEZADO Y MÉTRICAS RÁPIDAS EN VIVO */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-left">
        <div>
          <span className="text-[10px] bg-[var(--crema)] text-[var(--cafe)] border border-[var(--p1)] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider font-mono">Paso 3</span>
          <h1 className="font-display text-2xl md:text-3xl font-light text-[var(--tinta)] mt-1">Control de Pases & RSVP</h1>
          <p className="text-xs text-[var(--tinta-suave)] font-light">Gestiona tu lista oficial y monitorea las confirmaciones en tiempo real.</p>
        </div>
      </div>
      <div className="oro-linea w-24" />

      {/* TARJETAS DE ESTADÍSTICAS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { t: "Familias / Grupos", v: totalInvitados, i: "✉️" },
          { t: "Total Pases Asignados", v: totalPasesAsignados, i: "🎟️" },
          { t: "Asistencias Confirmadas", v: totalConfirmados, i: "✅", c: "text-emerald-700" },
          { t: "Invitaciones Pendientes", v: pendientes, i: "⏳", c: "text-amber-700" }
        ].map((card, idx) => (
          <div key={idx} className="bg-white p-5 rounded-2xl border border-[var(--p1)]/60 shadow-[0_2px_20px_rgba(67,48,43,0.05)] text-left flex items-center justify-between">
            <div className="space-y-1">
              <span className="etiqueta text-[var(--tinta-suave)] block">{card.t}</span>
              <span className={`font-display text-2xl font-light ${card.c || 'text-[var(--tinta)]'}`}>{card.v}</span>
            </div>
            <span className="text-xl bg-[var(--arena)] p-2 rounded-xl">{card.i}</span>
          </div>
        ))}
      </div>

      {/* SECCIÓN DOS COLUMNAS: FORMULARIO Y TABLA */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* 1. FORMULARIO AGREGAR (ANCHO 1) */}
        <div className="bg-white rounded-3xl p-6 border border-[var(--p1)]/60 shadow-[0_2px_20px_rgba(67,48,43,0.05)] space-y-4 text-left">
          <div>
            <h3 className="font-display text-lg font-medium text-[var(--tinta)]">Agregar Invitado</h3>
            <p className="text-[11px] text-[var(--tinta-suave)] font-light">Crea un acceso personalizado para el buscador de la invitación.</p>
            <div className="oro-linea mt-2" />
          </div>

          <form onSubmit={handleAgregarInvitado} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[var(--tinta-suave)]">Nombre de la Familia o Invitado</label>
              <input 
                type="text" 
                value={nuevoNombre}
                onChange={(e) => setNuevoNombre(e.target.value)}
                placeholder="Ej. Familia Martínez Lucio o Alberto Gómez"
                required
                className="w-full px-4 py-3 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-[var(--cafe)] transition-all bg-[var(--arena)]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold uppercase tracking-wider text-[var(--tinta-suave)]">Pases Totales Permitidos</label>
              <select 
                value={nuevosPases}
                onChange={(e) => setNuevosPases(parseInt(e.target.value))}
                className="w-full p-3 border border-stone-200 rounded-xl text-xs focus:outline-none cursor-pointer bg-[var(--arena)] font-medium text-[var(--tinta-suave)]"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                  <option key={n} value={n}>{n} {n === 1 ? 'Pase' : 'Pases'}</option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={guardando}
              className="w-full bg-[var(--cafe)] hover:bg-[var(--tinta)] text-white text-xs uppercase font-bold tracking-widest py-3.5 rounded-xl shadow-md transition-all cursor-pointer text-center disabled:opacity-50"
            >
              {guardando ? 'Agregando...' : '➕ Registrar en Lista'}
            </button>
          </form>
        </div>

        {/* 2. TABLA DE CONTROL DE INVITADOS (ANCHO 2) */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-[var(--p1)]/60 shadow-[0_2px_20px_rgba(67,48,43,0.05)] overflow-hidden flex flex-col justify-between">
          <div className="p-6 border-b border-[var(--p1)]/50 text-left">
            <h3 className="font-display text-lg font-medium text-[var(--tinta)]">Lista Oficial de Asistencia</h3>
            <p className="text-[11px] text-[var(--tinta-suave)] font-light">Resultados vinculados en tiempo real con las respuestas de tus invitados.</p>
          </div>

          <div className="overflow-x-auto w-full">
            {cargando ? (
              <div className="p-12 text-center text-xs text-[var(--tinta-suave)] italic font-light animate-pulse">Sincronizando lista con Supabase...</div>
            ) : invitados.length === 0 ? (
              <div className="p-12 text-center text-xs text-[var(--tinta-suave)] italic font-light">Tu lista de invitados está vacía. Comienza agregando el primero.</div>
            ) : (
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[var(--arena)] border-b border-[var(--p1)]/60 text-[var(--tinta-suave)] font-semibold select-none">
                    <th className="p-4 pl-6">Nombre de la Invitación</th>
                    <th className="p-4 text-center">Pases Totales</th>
                    <th className="p-4 text-center">Confirmados</th>
                    <th className="p-4 text-center">Estado</th>
                    <th className="p-4 text-center pr-6">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--p1)]/50">
                  {invitados.map((inv) => (
                    <tr key={inv.id} className="hover:bg-[var(--arena)]/60 transition-colors">
                      <td className="p-4 pl-6 font-medium text-[var(--tinta)] max-w-xs truncate">{inv.nombre_invitado}</td>
                      <td className="p-4 text-center font-mono font-bold text-[var(--tinta-suave)]">{inv.pases_totales}</td>
                      <td className="p-4 text-center font-mono font-bold text-[var(--tinta-suave)]">{inv.estado === 'confirmado' ? inv.pases_confirmados : 0}</td>
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
                        <button 
                          type="button"
                          onClick={() => handleEliminarInvitado(inv.id)}
                          className="text-stone-400 hover:text-rose-600 p-1.5 transition-colors cursor-pointer"
                          title="Eliminar invitado"
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="p-4 bg-[var(--arena)] border-t border-[var(--p1)]/50 text-right">
            <span className="text-[10px] text-stone-400 font-light">ClickyPapel RSVP Engine v1.0</span>
          </div>
        </div>

      </div>
    </div>
  );
}