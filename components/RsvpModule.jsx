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
        setFamiliaEncontrada(data[0]); // Tomamos la coincidencia principal
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
    : 'bg-white border-stone-200 text-stone-700';

  const inputStyle = diseño.id === 'minimal-dark'
    ? 'bg-zinc-900 border-zinc-800 text-white focus:border-zinc-500'
    : 'bg-white border-stone-200 text-stone-800 focus:border-amber-600';

  return (
    <section className="py-24 px-4 bg-transparent">
      <div className={`max-w-md mx-auto p-6 md:p-8 rounded-3xl border shadow-md transition-all duration-500 ${cardStyle}`}>
        <div className="text-center space-y-2 mb-6">
          <span className={`text-[10px] uppercase tracking-widest font-semibold block ${diseño.id === 'minimal-dark' ? 'text-zinc-500' : 'text-amber-700'}`}>
            Pases Digitales
          </span>
          <h2 className={`text-2xl ${diseño.fuenteTitulo}`}>Confirmar Asistencia</h2>
        </div>

        {!familiaEncontrada ? (
          /* BUSCADOR DE NOMBRE */
          <form onSubmit={buscarInvitado} className="space-y-4">
            <div className="space-y-1 text-left">
              <label className="text-[10px] uppercase tracking-wider opacity-60 font-semibold block pl-1">Busca tu nombre o apellido:</label>
              <input 
                type="text" 
                value={nombreBusqueda}
                onChange={(e) => setNombreBusqueda(e.target.value)}
                placeholder="Ej. Familia Martínez o Alberto Gómez" 
                required
                className={`w-full px-4 py-3 border rounded-xl text-xs focus:outline-none transition-all ${inputStyle}`}
              />
            </div>
            <button 
              type="submit" 
              disabled={cargando}
              className={`w-full py-3.5 rounded-xl uppercase text-xs tracking-wider font-semibold transition-all cursor-pointer ${diseño.botonAcento}`}
            >
              {cargando ? 'Buscando pases...' : '🔍 Buscar mi invitación'}
            </button>
            {error && <p className="text-center text-[11px] text-rose-500 font-medium leading-normal pt-1">{error}</p>}
          </form>
        ) : !mensajeConfirmacion ? (
          /* CONTROL DE ASISTENCIA ENCONTRADA */
          <div className="space-y-6 text-center animate-fadeIn">
            <div className="bg-stone-500/5 p-4 rounded-2xl border border-stone-200/20">
              <p className="text-[10px] uppercase tracking-widest opacity-50">Bienvenido(a)</p>
              <h4 className="font-serif text-lg font-medium mt-0.5">{familiaEncontrada.nombre_invitado}</h4>
              <p className="text-xs opacity-70 font-light mt-1">Tienes un total de <span className="font-mono font-bold text-sm">{familiaEncontrada.pases_totales}</span> pases asignados.</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5 text-left">
                <label className="text-[10px] uppercase tracking-wider opacity-60 font-semibold block pl-1">¿Cuántos pases confirmarás?</label>
                <select 
                  value={pasesConfirmados}
                  onChange={(e) => setPasesConfirmados(parseInt(e.target.value))}
                  className={`w-full p-3 border rounded-xl text-xs focus:outline-none cursor-pointer transition-all ${inputStyle}`}
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
                  className={`py-3.5 rounded-xl uppercase text-xs tracking-wider font-semibold transition-all cursor-pointer ${diseño.botonAcento}`}
                >
                  ✅ Sí Asistiré
                </button>
                <button 
                  type="button"
                  onClick={() => enviarConfirmacion('declinado')}
                  disabled={cargando}
                  className="py-3.5 rounded-xl uppercase text-xs tracking-wider font-semibold bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 transition-all cursor-pointer"
                >
                  ❌ Declinar
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* MENSAJE DE ÉXITO FINAL */
          <div className="text-center space-y-4 py-4 animate-scaleUp">
            <span className="text-3xl block">✨</span>
            <h4 className={`text-xl ${diseño.fuenteTitulo}`}>¡Respuesta Guardada!</h4>
            <p className="text-xs opacity-75 font-light leading-relaxed max-w-xs mx-auto">
              Muchas gracias. Los novios han recibido tu confirmación en vivo en su panel de administración.
            </p>
            <button 
              type="button" 
              onClick={() => { setFamiliaEncontrada(null); setNombreBusqueda(''); setMensajeConfirmacion(false); }}
              className="text-[10px] uppercase font-bold tracking-widest text-stone-400 hover:text-stone-600 transition-colors cursor-pointer mt-2"
            >
              ← Regresar / Buscar otro nombre
            </button>
          </div>
        )}
      </div>
    </section>
  );
}