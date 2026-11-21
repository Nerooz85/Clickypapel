"use client";
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function RsvpModule({ weddingId, weddingSlug, diseño }) {
  const [nombreBusqueda, setNombreBusqueda] = useState('');
  const [cargando, setCargando] = useState(false);
  const [familiaEncontrada, setFamiliaEncontrada] = useState(null);
  const [pasesConfirmados, setPasesConfirmados] = useState(1);
  const [mensajeConfirmacion, setMensajeConfirmacion] = useState(false);
  const [error, setError] = useState('');

  const buscarInvitado = async (e) => {
    e.preventDefault();
    if (!nombreBusqueda.trim()) return;

    setCargando(true);
    setError('');
    setFamiliaEncontrada(null);
    setMensajeConfirmacion(false);

    try {
      const { data, error: dbError } = await supabase
        .from('invitados')
        .select('*')
        .eq('boda_slug', weddingSlug)
        .ilike('nombre_invitado', `%${nombreBusqueda.trim()}%`);

      if (dbError) throw dbError;

      if (data && data.length > 0) {
        setFamiliaEncontrada(data[0]);
        setPasesConfirmados(data[0].pases_totales);
      } else {
        setError('❌ No se encontró tu nombre en la lista oficial. Verifica que esté bien escrito.');
      }
    } catch (err) {
      setError('Hubo un problema al buscar en el servidor. Intenta de nuevo.');
    } finally {
      setCargando(false);
    }
  };

  const enviarConfirmacion = async (estadoAsistencia) => {
    setCargando(true);
    try {
      const { error: updateError } = await supabase
        .from('invitados')
        .update({
          estado: estadoAsistencia,
          pases_confirmados: estadoAsistencia === 'confirmado' ? pasesConfirmados : 0
        })
        .eq('id', familiaEncontrada.id);

      if (updateError) throw updateError;
      setMensajeConfirmacion(true);
    } catch (err) {
      alert('Error al guardar tu asistencia.');
    } finally {
      setCargando(false);
    }
  };

  const cardStyle = diseño.id === 'minimal-dark'
    ? 'bg-zinc-900/20 border-zinc-800 text-zinc-300'
    : diseño.id === 'boho-rancho'
    ? 'bg-[#faf7f2] border-amber-900/10 text-amber-950'
    : 'bg-[var(--nieve)] border-[var(--terracota)]/40 text-[var(--tinta)]';

  const inputStyle = diseño.id === 'minimal-dark'
    ? 'bg-zinc-900 border-zinc-800 text-white focus:border-zinc-500'
    : 'bg-[var(--nieve)] border-[var(--terracota)]/40 text-[var(--tinta)] focus:border-[var(--cafe)]';

  return (
    <section className="w-full pt-16 pb-24 px-4 bg-transparent block">
      <div className={`max-w-md mx-auto p-6 md:p-8 rounded-[2rem] border shadow-[0_20px_50px_-20px_rgba(67,48,43,0.35)] transition-all duration-500 ${cardStyle}`}>
        <div className="text-center space-y-3 mb-6">
          <span className={`etiqueta block ${diseño.id === 'minimal-dark' ? 'text-zinc-500' : 'text-[var(--cafe)]'}`}>
            Pases Digitales
          </span>
          <h2 className={`text-3xl font-light ${diseño.fuenteTitulo || 'font-display'}`}>Confirmar Asistencia</h2>
          <div className="oro-linea w-24 mx-auto" aria-hidden="true" />
        </div>

        {!familiaEncontrada ? (
          <form onSubmit={buscarInvitado} className="space-y-4">
            <div className="space-y-1 text-left">
              <label className="etiqueta opacity-60 block pl-1">Busca tu nombre o apellido:</label>
              <input 
                type="text" 
                value={nombreBusqueda}
                onChange={(e) => setNombreBusqueda(e.target.value)}
                placeholder="Ej. Familia Martínez o Alberto Gómez" 
                required
                className={`w-full px-4 py-3 border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[var(--cafe)]/30 transition-all ${inputStyle}`}
              />
            </div>
            <button 
              type="submit" 
              disabled={cargando}
              className={`w-full py-3.5 rounded-full uppercase text-xs tracking-wider font-semibold transition-all cursor-pointer disabled:opacity-60 ${diseño.botonAcento || 'bg-[var(--cafe)] hover:bg-[var(--tinta)] text-[var(--nieve)]'}`}
            >
              {cargando ? 'Buscando pases...' : '🔍 Buscar mi invitación'}
            </button>
            {error && <p className="text-center text-[11px] text-rose-500 font-medium leading-normal pt-1">{error}</p>}
          </form>
        ) : !mensajeConfirmacion ? (
          <div className="space-y-6 text-center animate-fadeIn">
            <div className="bg-[var(--arena)] p-4 rounded-2xl border border-[var(--terracota)]/30">
              <p className="etiqueta opacity-60">Bienvenido(a)</p>
              <h4 className="font-display text-xl font-light mt-0.5">{familiaEncontrada.nombre_invitado}</h4>
              <p className="text-xs text-[var(--tinta-suave)] font-light mt-1">Tienes un total de <span className="font-mono font-bold text-sm text-[var(--tinta)]">{familiaEncontrada.pases_totales}</span> pases asignados.</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5 text-left">
                <label className="etiqueta opacity-60 block pl-1">¿Cuántos pases confirmarás?</label>
                <select 
                  value={pasesConfirmados}
                  onChange={(e) => setPasesConfirmados(parseInt(e.target.value))}
                  className={`w-full p-3 border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-[var(--cafe)]/30 cursor-pointer transition-all ${inputStyle}`}
                >
                  {Array.from({ length: familiaEncontrada.pases_totales }, (_, i) => i + 1).map((num) => (
                    <option key={num} value={num}>{num} {num === 1 ? 'Persona' : 'Personas'}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button 
                  type="button"
                  onClick={() => enviarConfirmacion('confirmado')}
                  disabled={cargando}
                  className={`py-3.5 rounded-full uppercase text-xs tracking-wider font-semibold transition-all cursor-pointer disabled:opacity-60 ${diseño.botonAcento || 'bg-[var(--cafe)] hover:bg-[var(--tinta)] text-[var(--nieve)]'}`}
                >
                  ✅ Sí Asistiré
                </button>
                <button 
                  type="button"
                  onClick={() => enviarConfirmacion('declinado')}
                  disabled={cargando}
                  className="py-3.5 rounded-full uppercase text-xs tracking-wider font-semibold bg-[var(--arena)] hover:bg-[var(--crema)] text-[var(--tinta-suave)] border border-[var(--terracota)]/40 transition-all cursor-pointer disabled:opacity-60"
                >
                  ❌ Declinar
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center space-y-4 py-4 animate-scaleUp">
            <span className="text-3xl block">✨</span>
            <h4 className={`font-display text-2xl font-light ${diseño.fuenteTitulo || ''}`}>¡Respuesta Guardada!</h4>
            <p className="text-xs text-[var(--tinta-suave)] font-light leading-relaxed max-w-xs mx-auto">
              Muchas gracias. Los novios han recibido tu confirmación en vivo en su panel de administración.
            </p>
            <button 
              type="button" 
              onClick={() => { setFamiliaEncontrada(null); setNombreBusqueda(''); setMensajeConfirmacion(false); }}
              className="etiqueta text-[var(--tinta-suave)] hover:text-[var(--cafe)] transition-colors cursor-pointer mt-2"
            >
              ← Regresar / Buscar otro nombre
            </button>
          </div>
        )}
      </div>
    </section>
  );
}