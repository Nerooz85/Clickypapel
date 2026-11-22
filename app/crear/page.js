"use client";
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';

const MUSICA_POR_DEFECTO = '/music/1. Clásico Romántico.mp3';

const EVENTOS = {
  boda: {
    icono: '💍',
    corto: 'Boda',
    titulo: 'Su boda',
    campos: ['Nombre de ella', 'Nombre de él'],
    ejemplos: ['Sofía', 'Alejandro'],
    frase: 'El amor todo lo cree, todo lo espera, todo lo soporta.',
  },
  xvanos: {
    icono: '👑',
    corto: 'XV Años',
    titulo: 'Sus XV años',
    campos: ['Nombre de la quinceañera'],
    ejemplos: ['Valentina'],
    frase: 'Hay momentos que se guardan en el corazón para siempre.',
  },
  baby: {
    icono: '🍼',
    corto: 'Baby Shower',
    titulo: 'El baby shower',
    campos: ['Nombre del bebé', 'Nombre de los papás'],
    ejemplos: ['Leo', 'Ana y Luis'],
    frase: 'Un pequeño gran motivo para celebrar juntos.',
  },
  bautizo: {
    icono: '🕊️',
    corto: 'Bautizo',
    titulo: 'El bautizo',
    campos: ['Nombre del festejado'],
    ejemplos: ['Mateo'],
    frase: 'Un día para agradecer y celebrar en familia.',
  },
  despedida: {
    icono: '🥂',
    corto: 'Despedida',
    titulo: 'La despedida',
    campos: ['Nombre de la novia'],
    ejemplos: ['Mariana'],
    frase: 'El último gran festejo antes del sí, acepto.',
  },
};

const ESTILOS = {
  boda: [
    { id: 'v1', nombre: 'Clásica', desc: 'Serena y atemporal', emoji: '✨' },
    { id: 'v2', nombre: 'Editorial', desc: 'Sofisticada y moderna', emoji: '💎' },
    { id: 'v3', nombre: 'Botánica', desc: 'Natural y orgánica', emoji: '🌿' },
  ],
  xvanos: [
    { id: 'xv-v1', nombre: 'Jardín', desc: 'Floral y romántica', emoji: '🌸' },
    { id: 'xv-v2', nombre: 'Noche', desc: 'Vibrante y actual', emoji: '🌃' },
    { id: 'xv-v3', nombre: 'Coquette', desc: 'Dulce y con listones', emoji: '🎀' },
  ],
};

const PALETAS = [
  { id: 'cashmere', nombre: 'Cashmere', color: '#c9b49a' },
  { id: 'matcha', nombre: 'Matcha', color: '#8aa88f' },
  { id: 'terracota', nombre: 'Terracota', color: '#c98a6e' },
  { id: 'celestial', nombre: 'Celestial', color: '#8fa8c2' },
  { id: 'rosegold', nombre: 'Rosa', color: '#e8a3b0' },
  { id: 'obsidian', nombre: 'Obsidiana', color: '#3a3a3f' },
];

function slugify(texto) {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function CrearContenido() {
  const searchParams = useSearchParams();
  const planPreferido = searchParams.get('plan') || 'premium';

  const [paso, setPaso] = useState(1);
  // El parámetro ?evento= puede venir inventado (p. ej. desde un enlace
  // compartido): solo aceptamos los tipos que existen; el resto cae a 'boda'
  // en vez de romper la página (EVENTOS[tipo] sería undefined).
  const eventoParam = searchParams.get('evento');
  const eventoInicial = eventoParam && EVENTOS[eventoParam] ? eventoParam : 'boda';
  const [tipoEvento, setTipoEvento] = useState(eventoInicial);
  const [nombre1, setNombre1] = useState('');
  const [nombre2, setNombre2] = useState('');
  const [fecha, setFecha] = useState('');
  const [estilo, setEstilo] = useState('v1');
  const [paleta, setPaleta] = useState('cashmere');
  const [slug, setSlug] = useState('');
  const [slugTocado, setSlugTocado] = useState(false);

  const [sesion, setSesion] = useState(null);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');

  const evento = EVENTOS[tipoEvento];
  const estilosDisponibles = ESTILOS[tipoEvento === 'xvanos' ? 'xvanos' : 'boda'];

  // Retomamos la sesión y, si venimos de Google, el borrador guardado.
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSesion(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSesion(s));

    try {
      const borrador = sessionStorage.getItem('clickypapel_borrador');
      if (borrador) {
        const d = JSON.parse(borrador);
        setTipoEvento(d.tipoEvento && EVENTOS[d.tipoEvento] ? d.tipoEvento : 'boda');
        setNombre1(d.nombre1 || '');
        setNombre2(d.nombre2 || '');
        setFecha(d.fecha || '');
        setEstilo(d.estilo || 'v1');
        setPaleta(d.paleta || 'cashmere');
        setSlug(d.slug || '');
        setSlugTocado(true);
        setPaso(3);
      }
    } catch (_) {}

    return () => sub.subscription.unsubscribe();
  }, []);

  // El enlace se arma solo mientras no lo editen a mano.
  useEffect(() => {
    if (slugTocado) return;
    const base = nombre2 ? `${nombre1}-y-${nombre2}` : nombre1;
    setSlug(slugify(base));
  }, [nombre1, nombre2, slugTocado]);

  // Al cambiar de evento, el estilo por defecto tiene que existir.
  useEffect(() => {
    setEstilo(tipoEvento === 'xvanos' ? 'xv-v1' : 'v1');
    if (tipoEvento === 'xvanos') setPaleta('rosegold');
  }, [tipoEvento]);

  const guardarBorrador = () => {
    try {
      sessionStorage.setItem(
        'clickypapel_borrador',
        JSON.stringify({ tipoEvento, nombre1, nombre2, fecha, estilo, paleta, slug })
      );
    } catch (_) {}
  };

  const entrarConGoogle = async () => {
    guardarBorrador();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/crear` },
    });
    if (error) setError('No pudimos conectar con Google. Intenta de nuevo.');
  };

  const publicarBorrador = async () => {
    setError('');

    if (!nombre1.trim()) { setError('Falta el nombre principal.'); return; }
    if (!slug) { setError('Elige el enlace de tu invitación.'); return; }
    if (!sesion) { entrarConGoogle(); return; }

    setGuardando(true);

    try {
      const { data: ocupado } = await supabase
        .from('bodas').select('slug').eq('slug', slug).maybeSingle();

      if (ocupado) {
        setError(`El enlace "${slug}" ya está tomado. Prueba con otro.`);
        setGuardando(false);
        return;
      }

      const { error: errorInsert } = await supabase.from('bodas').insert([{
        user_id: sesion.user.id,
        slug,
        tipo_evento: tipoEvento,
        template_id: estilo,
        paleta_colores_ui: paleta,
        plan_tipo: planPreferido,
        pago_confirmado: false,
        bride_name: nombre1.trim(),
        groom_name: nombre2.trim(),
        event_date: fecha ? `${fecha}T18:00:00` : null,
        welcome_phrase: evento.frase,
        music_url: MUSICA_POR_DEFECTO,
      }]);

      if (errorInsert) throw errorInsert;

      try { sessionStorage.removeItem('clickypapel_borrador'); } catch (_) {}
      window.location.href = `/${slug}`;
    } catch (err) {
      console.error(err);
      setError('No pudimos guardar tu invitación. Intenta otra vez.');
      setGuardando(false);
    }
  };

  const puedeAvanzar = paso === 1 ? true : paso === 2 ? nombre1.trim().length > 0 : true;

  return (
    <div className="min-h-screen bg-[var(--nieve)] font-ui text-[var(--tinta)] flex flex-col">

      {/* Barra superior con progreso */}
      <header className="sticky top-0 z-30 bg-[var(--nieve)]/90 backdrop-blur-md border-b border-[var(--terracota)]/50">
        <div className="max-w-lg mx-auto px-5 py-4 flex items-center justify-between">
          <Link href="/" className="font-display text-xl tracking-wide text-[var(--tinta)]">
            clicky<span className="text-[var(--cafe)]">papel</span>
          </Link>
          <span className="flex items-center gap-2">
            <span className="flex items-center gap-1.5" aria-hidden="true">
              {[1, 2, 3].map((n) => (
                <span
                  key={n}
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: n <= paso ? 'var(--dorado)' : 'var(--terracota)' }}
                />
              ))}
            </span>
            <span className="etiqueta text-[var(--tinta-suave)]">
              Paso {paso} de 3
            </span>
          </span>
        </div>
        <div className="h-[3px] bg-[var(--crema)]">
          <motion.div
            className="h-full"
            style={{ background: 'linear-gradient(90deg, var(--cafe), var(--dorado))' }}
            animate={{ width: `${(paso / 3) * 100}%` }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
        </div>
      </header>

      <main className="flex-1 w-full max-w-lg mx-auto px-5 py-8 pb-32">
        <AnimatePresence mode="wait">

          {/* ---------- PASO 1 ---------- */}
          {paso === 1 && (
            <motion.div
              key="p1"
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
              className="space-y-8"
            >
              <div className="space-y-2">
                <p className="font-script text-3xl leading-none text-[var(--cafe)]">¡Empecemos!</p>
                <h1 className="font-display text-4xl font-light text-[var(--tinta)] leading-snug">
                  ¿Qué vamos a celebrar?
                </h1>
                <p className="text-sm text-[var(--tinta-suave)] font-light">
                  Es gratis. Solo pagas cuando decidas publicarla.
                </p>
                <div className="oro-linea w-24 pt-1" />
              </div>

              <div className="grid grid-cols-1 gap-3">
                {Object.entries(EVENTOS).map(([id, e]) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => { setTipoEvento(id); setPaso(2); }}
                    className={`flex items-center gap-4 p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                      tipoEvento === id
                        ? 'bg-[var(--cafe)] text-white border-[var(--cafe)] shadow-[0_16px_32px_-16px_rgba(166,122,104,.7)]'
                        : 'bg-[var(--nieve)] border-[var(--terracota)]/60 hover:border-[var(--cafe)] hover:bg-[var(--arena)] shadow-sm'
                    }`}
                  >
                    <span className={`w-11 h-11 shrink-0 rounded-full flex items-center justify-center text-2xl ${tipoEvento === id ? 'bg-white/20' : 'bg-[var(--arena)]'}`}>{e.icono}</span>
                    <span className="font-medium text-sm">{e.corto}</span>
                    <span className={`ml-auto text-lg ${tipoEvento === id ? 'text-white/80' : 'text-[var(--dorado)]'}`}>›</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {/* ---------- PASO 2 ---------- */}
          {paso === 2 && (
            <motion.div
              key="p2"
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
              className="space-y-8"
            >
              <div className="space-y-2">
                <span className="w-11 h-11 rounded-full bg-[var(--arena)] flex items-center justify-center text-2xl">{evento.icono}</span>
                <h1 className="font-display text-4xl font-light text-[var(--tinta)] leading-snug">
                  {evento.titulo}
                </h1>
                <p className="font-script text-2xl leading-tight text-[var(--cafe)]">{evento.frase}</p>
                <p className="text-sm text-[var(--tinta-suave)] font-light">
                  Lo básico por ahora. Todo lo demás lo llenas después con calma.
                </p>
                <div className="oro-linea w-24 pt-1" />
              </div>

              <div className="space-y-5">
                <div className="space-y-1.5">
                  <label htmlFor="n1" className="etiqueta text-[var(--tinta-suave)]">
                    {evento.campos[0]}
                  </label>
                  <input
                    id="n1"
                    type="text"
                    value={nombre1}
                    onChange={(e) => setNombre1(e.target.value)}
                    placeholder={evento.ejemplos[0]}
                    className="w-full px-4 py-4 border border-[var(--terracota)]/60 rounded-xl text-base bg-[var(--nieve)] text-[var(--tinta)] placeholder:text-[var(--tinta-suave)]/50 shadow-sm focus:outline-none focus:border-[var(--cafe)] focus:ring-2 focus:ring-[var(--cafe)]/20"
                  />
                </div>

                {evento.campos[1] && (
                  <div className="space-y-1.5">
                    <label htmlFor="n2" className="etiqueta text-[var(--tinta-suave)]">
                      {evento.campos[1]}
                    </label>
                    <input
                      id="n2"
                      type="text"
                      value={nombre2}
                      onChange={(e) => setNombre2(e.target.value)}
                      placeholder={evento.ejemplos[1]}
                      className="w-full px-4 py-4 border border-[var(--terracota)]/60 rounded-xl text-base bg-[var(--nieve)] text-[var(--tinta)] placeholder:text-[var(--tinta-suave)]/50 shadow-sm focus:outline-none focus:border-[var(--cafe)] focus:ring-2 focus:ring-[var(--cafe)]/20"
                    />
                  </div>
                )}

                <div className="space-y-1.5">
                  <label htmlFor="fecha" className="etiqueta text-[var(--tinta-suave)]">
                    Fecha del evento
                  </label>
                  <input
                    id="fecha"
                    type="date"
                    value={fecha}
                    onChange={(e) => setFecha(e.target.value)}
                    className="w-full px-4 py-4 border border-[var(--terracota)]/60 rounded-xl text-base bg-[var(--nieve)] text-[var(--tinta)] shadow-sm focus:outline-none focus:border-[var(--cafe)] focus:ring-2 focus:ring-[var(--cafe)]/20"
                  />
                  <p className="text-[11px] text-[var(--tinta-suave)]/80">La puedes cambiar cuando quieras.</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* ---------- PASO 3 ---------- */}
          {paso === 3 && (
            <motion.div
              key="p3"
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
              className="space-y-8"
            >
              <div className="space-y-2">
                <p className="font-script text-3xl leading-none text-[var(--cafe)]">a tu manera</p>
                <h1 className="font-display text-4xl font-light text-[var(--tinta)] leading-snug">
                  Elige tu estilo
                </h1>
                <p className="text-sm text-[var(--tinta-suave)] font-light">
                  Nada es definitivo: todo se cambia después.
                </p>
                <div className="oro-linea w-24 pt-1" />
              </div>

              <div className="space-y-3">
                {estilosDisponibles.map((e) => (
                  <button
                    key={e.id}
                    type="button"
                    onClick={() => setEstilo(e.id)}
                    className={`w-full flex items-center gap-4 p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                      estilo === e.id
                        ? 'bg-[var(--arena)] border-[var(--cafe)] ring-2 ring-[var(--cafe)]/25 shadow-[0_12px_28px_-14px_rgba(166,122,104,.6)]'
                        : 'bg-[var(--nieve)] border-[var(--terracota)]/60 hover:border-[var(--cafe)] shadow-sm'
                    }`}
                  >
                    <span className="w-11 h-11 shrink-0 rounded-full bg-[var(--crema)] flex items-center justify-center text-2xl">{e.emoji}</span>
                    <span className="flex-1">
                      <span className="block font-display text-lg font-light text-[var(--tinta)]">{e.nombre}</span>
                      <span className="block text-xs text-[var(--tinta-suave)] font-light">{e.desc}</span>
                    </span>
                    {estilo === e.id && <span className="w-7 h-7 shrink-0 rounded-full bg-[var(--cafe)] text-white text-sm flex items-center justify-center">✓</span>}
                  </button>
                ))}
              </div>

              <div className="space-y-3">
                <span className="etiqueta text-[var(--tinta-suave)] block">
                  Color
                </span>
                <div className="flex flex-wrap gap-3">
                  {PALETAS.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setPaleta(p.id)}
                      aria-label={p.nombre}
                      className={`w-11 h-11 rounded-full border-2 transition-all cursor-pointer ${
                        paleta === p.id ? 'border-[var(--tinta)] scale-110 ring-2 ring-[var(--dorado)] ring-offset-2 ring-offset-[var(--nieve)] shadow-md' : 'border-[var(--terracota)]/50 hover:scale-105'
                      }`}
                      style={{ backgroundColor: p.color }}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-1.5 pt-2">
                <label htmlFor="slug" className="etiqueta text-[var(--tinta-suave)]">
                  Tu enlace
                </label>
                <div className="flex items-stretch rounded-xl overflow-hidden border border-[var(--terracota)]/60 bg-[var(--nieve)] shadow-sm focus-within:border-[var(--cafe)] focus-within:ring-2 focus-within:ring-[var(--cafe)]/20">
                  <span className="px-3 flex items-center text-xs text-[var(--tinta-suave)] font-mono bg-[var(--arena)] border-r border-[var(--terracota)]/40 select-none">
                    tugrandia.icu/
                  </span>
                  <input
                    id="slug"
                    type="text"
                    value={slug}
                    onChange={(e) => { setSlugTocado(true); setSlug(slugify(e.target.value)); }}
                    placeholder="tu-evento"
                    className="w-full px-3 py-4 text-sm focus:outline-none font-mono text-[var(--cafe)] placeholder:text-[var(--tinta-suave)]/50"
                  />
                </div>
              </div>

              {error && (
                <div className="bg-[#FBEEE8] border border-[#E5B7A3] text-[#96452E] p-4 rounded-xl text-xs font-medium">
                  {error}
                </div>
              )}

              {!sesion && (
                <p className="text-xs text-[var(--tinta-suave)] font-light leading-relaxed bg-[var(--arena)] border border-[var(--terracota)]/40 rounded-xl p-4">
                  Al guardar te vamos a pedir entrar con Google. Es para que tu invitación
                  no se pierda y puedas volver a editarla cuando quieras.
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Botonera fija abajo: en celular es lo que siempre queda a la mano */}
      <div className="fixed bottom-0 left-0 right-0 bg-[var(--nieve)]/95 backdrop-blur-md border-t border-[var(--terracota)]/50 px-5 py-4">
        <div className="max-w-lg mx-auto flex items-center gap-3">
          {paso > 1 && (
            <button
              type="button"
              onClick={() => setPaso(paso - 1)}
              className="px-5 py-4 rounded-xl border border-[var(--cafe)] text-[var(--cafe)] etiqueta hover:bg-[var(--arena)] transition-colors cursor-pointer"
            >
              Atrás
            </button>
          )}

          {paso < 3 ? (
            <button
              type="button"
              disabled={!puedeAvanzar}
              onClick={() => setPaso(paso + 1)}
              className="flex-1 bg-[var(--cafe)] hover:bg-[var(--tinta)] disabled:bg-[var(--terracota)]/60 disabled:text-white/70 text-white py-4 rounded-xl etiqueta transition-colors cursor-pointer shadow-[0_12px_24px_-12px_rgba(166,122,104,.8)]"
            >
              Continuar
            </button>
          ) : (
            <button
              type="button"
              disabled={guardando}
              onClick={publicarBorrador}
              className="flex-1 bg-[var(--cafe)] hover:bg-[var(--tinta)] disabled:opacity-60 text-white py-4 rounded-xl etiqueta transition-colors cursor-pointer flex items-center justify-center gap-2 shadow-[0_12px_24px_-12px_rgba(166,122,104,.8)]"
            >
              {guardando ? 'Creando…' : sesion ? 'Ver mi invitación' : 'Guardar y ver mi invitación'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CrearPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[var(--nieve)] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[var(--cafe)] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <CrearContenido />
    </Suspense>
  );
}
