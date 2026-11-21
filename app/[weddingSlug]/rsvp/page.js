"use client";
import { useState, useEffect, useCallback, Suspense } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';

function RSVPContenido() {
  // ⚠️ La carpeta es [weddingSlug], así que el parámetro se llama weddingSlug.
  // Antes se leía `slug` y siempre venía vacío: por eso nunca encontraba a nadie.
  const params = useParams();
  const slug = (params?.weddingSlug || '').toString().toLowerCase().trim();

  const searchParams = useSearchParams();
  const invitadoId = searchParams.get('id'); // link personalizado por invitado

  const [invitado, setInvitado] = useState(null);
  const [coincidencias, setCoincidencias] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [cargando, setCargando] = useState(false);
  const [buscoAlgo, setBuscoAlgo] = useState(false);
  const [mensaje, setMensaje] = useState(null);
  const [error, setError] = useState('');

  // Si el link trae ?id=, cargamos directo a esa persona.
  useEffect(() => {
    if (!invitadoId) return;
    let activo = true;

    (async () => {
      setCargando(true);
      const { data } = await supabase
        .from('invitados')
        .select('*')
        .eq('id', invitadoId)
        .maybeSingle();

      if (activo && data) setInvitado(data);
      if (activo) setCargando(false);
    })();

    return () => { activo = false; };
  }, [invitadoId]);

  const buscarInvitado = useCallback(async (nombre) => {
    const texto = nombre.trim();
    if (texto.length < 3 || !slug) {
      setCoincidencias([]);
      setBuscoAlgo(false);
      return;
    }

    setCargando(true);
    setError('');

    const { data, error: errorBusqueda } = await supabase
      .from('invitados')
      .select('*')
      .eq('boda_slug', slug)
      .ilike('nombre_invitado', `%${texto}%`)
      .limit(6);

    if (errorBusqueda) setError('No pudimos buscar en la lista. Intenta de nuevo.');

    setCoincidencias(data || []);
    setBuscoAlgo(true);
    setCargando(false);
  }, [slug]);

  // Esperamos a que deje de escribir antes de consultar.
  useEffect(() => {
    const t = setTimeout(() => buscarInvitado(busqueda), 400);
    return () => clearTimeout(t);
  }, [busqueda, buscarInvitado]);

  const confirmarAsistencia = async (estado) => {
    if (!invitado) return;
    setCargando(true);
    setError('');

    const { error: errorUpdate } = await supabase
      .from('invitados')
      .update({
        estado,
        pases_confirmados: estado === 'confirmado' ? invitado.pases_totales : 0,
      })
      .eq('id', invitado.id);

    if (errorUpdate) {
      setError('No pudimos guardar tu respuesta. Intenta otra vez.');
    } else {
      setMensaje(
        estado === 'confirmado'
          ? '¡Gracias! Tu lugar quedó apartado.'
          : 'Recibimos tu respuesta. ¡Te vamos a extrañar!'
      );
    }
    setCargando(false);
  };

  return (
    <main className="min-h-screen bg-[var(--nieve)] flex items-center justify-center p-6 font-ui">
      <div className="max-w-md w-full bg-[var(--nieve)] rounded-[2rem] p-8 shadow-[0_20px_50px_-20px_rgba(67,48,43,0.35)] border border-[var(--terracota)]/40 text-center space-y-8">

        {error && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3 rounded-2xl text-xs font-medium">
            {error}
          </div>
        )}

        {mensaje ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-10 space-y-4">
            <div className="text-4xl">✨</div>
            <p className="font-display text-2xl font-light text-[var(--tinta)]">{mensaje}</p>
            <div className="oro-linea w-24 mx-auto" aria-hidden="true" />
          </motion.div>
        ) : invitado ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
            <p className="font-script text-3xl text-[var(--cafe)]">¡Te esperamos!</p>
            <h2 className="font-display text-2xl font-light text-[var(--tinta)]">¡Hola, {invitado.nombre_invitado}!</h2>
            <p className="text-sm text-[var(--tinta-suave)]">
              Apartamos{' '}
              <span className="font-bold text-[var(--tinta)]">
                {invitado.pases_totales} {invitado.pases_totales === 1 ? 'lugar' : 'lugares'}
              </span>{' '}
              para ustedes.
            </p>

            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={() => confirmarAsistencia('confirmado')}
                disabled={cargando}
                className="w-full bg-[var(--cafe)] hover:bg-[var(--tinta)] text-[var(--nieve)] py-4 rounded-full etiqueta transition-all disabled:opacity-60 cursor-pointer"
              >
                Confirmar asistencia
              </button>
              <button
                type="button"
                onClick={() => confirmarAsistencia('declinado')}
                disabled={cargando}
                className="w-full bg-[var(--arena)] hover:bg-[var(--crema)] text-[var(--tinta-suave)] py-4 rounded-full etiqueta border border-[var(--terracota)]/40 transition-all disabled:opacity-60 cursor-pointer"
              >
                No podré asistir
              </button>
            </div>

            {!invitadoId && (
              <button
                type="button"
                onClick={() => { setInvitado(null); setBusqueda(''); setCoincidencias([]); }}
                className="etiqueta text-[var(--tinta-suave)] hover:text-[var(--cafe)] underline cursor-pointer"
              >
                No soy yo
              </button>
            )}
          </motion.div>
        ) : (
          <div className="space-y-6">
            <p className="font-script text-3xl text-[var(--cafe)]">¡Te esperamos!</p>
            <h1 className="font-display text-3xl font-light text-[var(--tinta)]">Confirmar asistencia</h1>
            <div className="oro-linea w-24 mx-auto" aria-hidden="true" />
            <p className="text-sm text-[var(--tinta-suave)] font-light">
              Escribe tu nombre o el de tu familia para encontrar tu lugar.
            </p>

            <input
              type="text"
              value={busqueda}
              placeholder="Ej. Familia García"
              aria-label="Buscar tu nombre en la lista"
              className="w-full px-5 py-4 border border-[var(--terracota)]/40 rounded-full text-sm bg-[var(--nieve)] text-[var(--tinta)] placeholder:text-[var(--tinta-suave)]/60 focus:outline-none focus:ring-2 focus:ring-[var(--cafe)]/30 focus:border-[var(--cafe)]"
              onChange={(e) => setBusqueda(e.target.value)}
            />

            {cargando && (
              <p className="etiqueta text-[var(--cafe)] animate-pulse">
                Buscando en la lista…
              </p>
            )}

            {coincidencias.length > 0 && (
              <div className="space-y-2 text-left">
                {coincidencias.map((persona) => (
                  <button
                    key={persona.id}
                    type="button"
                    onClick={() => setInvitado(persona)}
                    className="w-full flex items-center justify-between gap-3 px-4 py-3 rounded-2xl border border-[var(--terracota)]/40 hover:border-[var(--cafe)] hover:bg-[var(--arena)] transition-all text-sm cursor-pointer"
                  >
                    <span className="font-medium text-[var(--tinta)]">{persona.nombre_invitado}</span>
                    <span className="etiqueta text-[var(--tinta-suave)]">
                      {persona.pases_totales} {persona.pases_totales === 1 ? 'pase' : 'pases'}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {buscoAlgo && !cargando && coincidencias.length === 0 && (
              <p className="text-xs text-[var(--tinta-suave)] leading-relaxed">
                No encontramos ese nombre en la lista. Revisa cómo viene escrito en tu invitación
                o escríbele directamente a los anfitriones.
              </p>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

export default function RSVPPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[var(--nieve)] flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-[var(--cafe)] border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <RSVPContenido />
    </Suspense>
  );
}
