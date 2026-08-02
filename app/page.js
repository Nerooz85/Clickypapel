"use client";
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { PLANES, ORDEN_PLANES, formatearPesos } from '@/lib/precios';

/* Paleta ClickyPapel — papelería fina, no plantilla genérica */
const TINTA = '#1C1A24';
const PAPEL = '#FBF9F5';
const LINO = '#EDE7DC';
const SELLO = '#A8324A';
const ORO = '#B08D3F';

const CELEBRACIONES = [
  { id: 'boda', nombre: 'Bodas', linea: 'Pases por familia y mesa de regalos.' },
  { id: 'xvanos', nombre: 'XV años', linea: 'Galería, vals y código de vestimenta.' },
  { id: 'baby', nombre: 'Baby shower', linea: 'Colores suaves y confirmación rápida.' },
  { id: 'bautizo', nombre: 'Bautizos', linea: 'Misa, festejo y ubicación en un link.' },
  { id: 'despedida', nombre: 'Despedidas', linea: 'Para la última fiesta de soltera.' },
];

const PASOS = [
  { n: '01', t: 'Elige tu celebración', d: 'Boda, XV años, baby shower, bautizo o despedida.' },
  { n: '02', t: 'Escribe tus datos', d: 'Nombres, fecha y el estilo que te lata. Tres pantallas.' },
  { n: '03', t: 'Míralo y decide', d: 'Ves tu invitación completa. Pagas solo si la quieres compartir.' },
];

const PREGUNTAS = [
  { q: '¿De verdad es gratis?', a: 'Sí. Armas tu invitación completa y la ves funcionando sin pagar nada. El cobro es solo cuando quieres compartirla con tus invitados.' },
  { q: '¿Mis invitados necesitan instalar algo?', a: 'No. Les mandas un link por WhatsApp y se abre solo en cualquier celular.' },
  { q: '¿Puedo cambiarla después de publicarla?', a: 'Todas las veces que quieras. El link no cambia, así que no tienes que reenviarlo.' },
  { q: '¿Cómo sé quién va a ir?', a: 'Cada invitado confirma desde la misma invitación y tú ves la lista en vivo desde tu panel.' },
  { q: '¿Cuánto tarda?', a: 'Lo básico queda en unos minutos. Los detalles los vas llenando con calma.' },
];

export default function Home() {
  const [abierto, setAbierto] = useState(false);
  const [sonando, setSonando] = useState(false);
  const [restante, setRestante] = useState(null);
  const [preguntaAbierta, setPreguntaAbierta] = useState(null);
  const audioRef = useRef(null);
  const sinMovimiento = useReducedMotion();

  /* Contador del sobre demo. Se calcula en el navegador para no pelearse con el render del servidor. */
  useEffect(() => {
    const objetivo = new Date();
    objetivo.setDate(objetivo.getDate() + 128);

    const tick = () => {
      const diff = objetivo - new Date();
      setRestante({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff / 3600000) % 24),
        m: Math.floor((diff / 60000) % 60),
        s: Math.floor((diff / 1000) % 60),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const abrirSobre = () => {
    setAbierto(true);
    if (audioRef.current) {
      audioRef.current.volume = 0.5;
      audioRef.current.play().then(() => setSonando(true)).catch(() => {});
    }
  };

  const alternarMusica = () => {
    if (!audioRef.current) return;
    if (sonando) audioRef.current.pause();
    else audioRef.current.play().catch(() => {});
    setSonando(!sonando);
  };

  return (
    <div style={{ backgroundColor: PAPEL, color: TINTA }} className="min-h-screen font-ui antialiased overflow-x-hidden">
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Jost:wght@300;400;500;600&display=swap');
        .font-display { font-family: 'Cormorant Garamond', Georgia, serif; }
        .font-ui { font-family: 'Jost', system-ui, sans-serif; }
        .etiqueta { font-size: 10px; letter-spacing: 0.22em; text-transform: uppercase; font-weight: 600; }
        .regla-oro { height: 1px; background: linear-gradient(90deg, transparent, ${ORO}, transparent); }
        a:focus-visible, button:focus-visible { outline: 2px solid ${SELLO}; outline-offset: 3px; border-radius: 4px; }
        @media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation-duration: .01ms !important; transition-duration: .01ms !important; } }
      `}} />

      <audio ref={audioRef} src="/boda-music.mp3" loop preload="none" />

      {/* ---------------------------------------------------- NAV */}
      <nav className="sticky top-0 z-50 backdrop-blur-md border-b" style={{ backgroundColor: 'rgba(251,249,245,.88)', borderColor: LINO }}>
        <div className="max-w-6xl mx-auto px-5 h-16 flex items-center justify-between">
          <Link href="/" className="font-display text-2xl tracking-wide" style={{ color: TINTA }}>
            clicky<span style={{ color: SELLO }}>papel</span>
          </Link>

          <div className="hidden md:flex items-center gap-9 etiqueta" style={{ color: '#6B6577' }}>
            <a href="#celebraciones" className="hover:opacity-60 transition-opacity">Celebraciones</a>
            <a href="#como" className="hover:opacity-60 transition-opacity">Cómo funciona</a>
            <a href="#precios" className="hover:opacity-60 transition-opacity">Precios</a>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/login" className="etiqueta hover:opacity-60 transition-opacity hidden sm:block" style={{ color: '#6B6577' }}>
              Entrar
            </Link>
            <Link href="/crear" className="etiqueta text-white px-5 py-2.5 rounded-full transition-transform hover:scale-[1.03]" style={{ backgroundColor: TINTA }}>
              Crear gratis
            </Link>
          </div>
        </div>
      </nav>

      {/* ---------------------------------------------------- HERO */}
      <header style={{ backgroundColor: TINTA }} className="relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.06] pointer-events-none"
          style={{ backgroundImage: `radial-gradient(${ORO} 1px, transparent 1px)`, backgroundSize: '28px 28px' }}
        />

        <div className="relative max-w-6xl mx-auto px-5 pt-16 pb-20 md:pt-24 md:pb-28 grid md:grid-cols-[1fr_auto] gap-14 md:gap-16 items-center">

          <div className="space-y-7 text-center md:text-left">
            <span className="etiqueta inline-block px-4 py-2 rounded-full border" style={{ color: ORO, borderColor: 'rgba(176,141,63,.35)' }}>
              Gratis hasta que la publiques
            </span>

            <h1 className="font-display font-light leading-[0.95] text-[3.25rem] sm:text-6xl md:text-7xl" style={{ color: PAPEL }}>
              Se abre,<br />suena<br />
              <span className="italic" style={{ color: ORO }}>y confirma sola.</span>
            </h1>

            <p className="text-base md:text-lg font-light leading-relaxed max-w-md mx-auto md:mx-0" style={{ color: '#B5AFC0' }}>
              Tus invitados tocan el sello, escuchan su canción y apartan su lugar.
              Tú ves quién viene sin perseguir a nadie por WhatsApp.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-3 pt-1 justify-center md:justify-start">
              <Link
                href="/crear"
                className="w-full sm:w-auto text-center etiqueta text-white px-9 py-4 rounded-full transition-transform hover:scale-[1.03]"
                style={{ backgroundColor: SELLO }}
              >
                Crear la mía gratis
              </Link>
              <span className="text-xs font-light" style={{ color: '#7A7488' }}>
                Sin tarjeta · Lista hoy
              </span>
            </div>
          </div>

          {/* ---- FIRMA: el sobre que se abre ---- */}
          <div className="flex flex-col items-center gap-5">
            <div className="relative w-[280px] sm:w-[320px] h-[380px] sm:h-[420px]">

              <AnimatePresence>
                {!abierto && (
                  <motion.button
                    type="button"
                    onClick={abrirSobre}
                    exit={{ opacity: 0, scale: 0.94 }}
                    transition={{ duration: 0.5 }}
                    aria-label="Abrir el sobre de ejemplo"
                    className="absolute inset-0 rounded-sm cursor-pointer group"
                    style={{ backgroundColor: LINO, boxShadow: '0 30px 60px -20px rgba(0,0,0,.55)' }}
                  >
                    <div
                      className="absolute top-0 left-0 right-0 origin-top"
                      style={{
                        height: '52%',
                        backgroundColor: '#E3DCCE',
                        clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
                      }}
                    />
                    <div className="absolute inset-3 border pointer-events-none" style={{ borderColor: 'rgba(176,141,63,.3)' }} />

                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-5">
                      <div
                        className="w-20 h-20 rounded-full flex items-center justify-center transition-transform duration-500 group-hover:scale-105"
                        style={{ backgroundColor: SELLO, boxShadow: '0 8px 20px -6px rgba(168,50,74,.7)' }}
                      >
                        <span className="font-display text-2xl" style={{ color: '#F3D9A0' }}>C</span>
                      </div>
                      {!sinMovimiento && (
                        <motion.span
                          animate={{ opacity: [0.45, 1, 0.45] }}
                          transition={{ duration: 2.4, repeat: Infinity }}
                          className="etiqueta"
                          style={{ color: '#8A8070' }}
                        >
                          Toca el sello
                        </motion.span>
                      )}
                    </div>
                  </motion.button>
                )}
              </AnimatePresence>

              {abierto && (
                <motion.div
                  initial={{ opacity: 0, y: 26 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0 flex flex-col items-center justify-center text-center px-7 rounded-sm"
                  style={{ backgroundColor: PAPEL, boxShadow: '0 30px 60px -20px rgba(0,0,0,.55)' }}
                >
                  <div className="absolute inset-3 border pointer-events-none" style={{ borderColor: 'rgba(176,141,63,.35)' }} />

                  <span className="etiqueta" style={{ color: ORO }}>Nos casamos</span>
                  <p className="font-display text-5xl font-light leading-tight mt-4" style={{ color: TINTA }}>
                    Brisa<br /><span className="italic text-3xl" style={{ color: SELLO }}>y</span><br />Bruno
                  </p>

                  <div className="regla-oro w-20 my-6" />

                  {restante && (
                    <div className="flex gap-4">
                      {[['d', restante.d], ['h', restante.h], ['m', restante.m], ['s', restante.s]].map(([k, v]) => (
                        <div key={k} className="flex flex-col items-center">
                          <span className="font-display text-2xl" style={{ color: TINTA }}>
                            {String(v).padStart(2, '0')}
                          </span>
                          <span className="etiqueta" style={{ color: '#9A93A5', fontSize: 9 }}>{k}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <p className="text-[11px] font-light mt-7" style={{ color: '#9A93A5' }}>
                    Así se ve una invitación de verdad
                  </p>
                </motion.div>
              )}
            </div>

            {abierto && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={alternarMusica}
                  className="etiqueta flex items-center gap-2 hover:opacity-70 transition-opacity"
                  style={{ color: ORO }}
                >
                  <span className="flex gap-[2px] items-end h-3 w-4" aria-hidden="true">
                    {[0, 1, 2, 3].map((b) => (
                      <motion.span
                        key={b}
                        animate={sonando && !sinMovimiento ? { height: ['25%', '100%', '25%'] } : { height: '30%' }}
                        transition={{ duration: 0.7, repeat: Infinity, delay: b * 0.14 }}
                        className="w-[2px] block rounded-full"
                        style={{ backgroundColor: ORO }}
                      />
                    ))}
                  </span>
                  {sonando ? 'Pausar música' : 'Reanudar música'}
                </button>

                <Link href="/bruno-y-brisa" className="etiqueta hover:opacity-70 transition-opacity" style={{ color: '#7A7488' }}>
                  Ver completa →
                </Link>
              </motion.div>
            )}
          </div>
        </div>
      </header>

      {/* ---------------------------------------------------- DIFERENCIA */}
      <section className="max-w-6xl mx-auto px-5 py-20 md:py-28">
        <div className="max-w-xl space-y-3 mb-14">
          <span className="etiqueta" style={{ color: SELLO }}>La diferencia</span>
          <h2 className="font-display text-4xl md:text-5xl font-light leading-tight">
            Un PDF se ve bonito.<br />Esto además trabaja.
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-10 md:gap-8">
          {[
            { et: 'El sobre', t: 'Se abre frente a ellos', d: 'La animación y la música arrancan cuando tocan el sello. Nadie recuerda un archivo adjunto; esto sí lo enseñan.' },
            { et: 'La lista', t: 'Cada quien busca su nombre', d: 'Ven cuántos lugares les tocan y confirman ahí mismo. Se acabó el "oye, ¿al final sí vienen?".' },
            { et: 'El día', t: 'Llegan sin llamarte', d: 'Mapa directo, horarios, código de vestimenta y mesa de regalos. Todo en el mismo link.' },
          ].map((f) => (
            <div key={f.et} className="space-y-3">
              <div className="regla-oro w-full" />
              <span className="etiqueta block pt-1" style={{ color: ORO }}>{f.et}</span>
              <h3 className="font-display text-2xl font-light">{f.t}</h3>
              <p className="text-sm font-light leading-relaxed" style={{ color: '#5F5A6B' }}>{f.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------------------------------------------- CELEBRACIONES */}
      <section id="celebraciones" className="py-20 md:py-28" style={{ backgroundColor: LINO }}>
        <div className="max-w-6xl mx-auto px-5">
          <div className="max-w-xl space-y-3 mb-12">
            <span className="etiqueta" style={{ color: SELLO }}>Celebraciones</span>
            <h2 className="font-display text-4xl md:text-5xl font-light leading-tight">
              Cada fiesta pide lo suyo.
            </h2>
          </div>

          <div className="divide-y" style={{ borderColor: 'rgba(28,26,36,.12)' }}>
            {CELEBRACIONES.map((c) => (
              <Link
                key={c.id}
                href={`/crear?evento=${c.id}`}
                className="group flex items-center justify-between gap-6 py-6 transition-opacity hover:opacity-60"
                style={{ borderColor: 'rgba(28,26,36,.12)' }}
              >
                <div className="min-w-0">
                  <h3 className="font-display text-3xl md:text-4xl font-light">{c.nombre}</h3>
                  <p className="text-sm font-light mt-1" style={{ color: '#5F5A6B' }}>{c.linea}</p>
                </div>
                <span className="font-display text-3xl shrink-0 transition-transform group-hover:translate-x-1" style={{ color: SELLO }}>→</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- CÓMO FUNCIONA */}
      <section id="como" className="max-w-6xl mx-auto px-5 py-20 md:py-28">
        <div className="max-w-xl space-y-3 mb-14">
          <span className="etiqueta" style={{ color: SELLO }}>Cómo funciona</span>
          <h2 className="font-display text-4xl md:text-5xl font-light leading-tight">
            Tres pantallas y ya la estás viendo.
          </h2>
        </div>

        <ol className="grid md:grid-cols-3 gap-10 md:gap-8">
          {PASOS.map((p) => (
            <li key={p.n} className="space-y-3">
              <span className="font-display text-5xl font-light" style={{ color: 'rgba(28,26,36,.18)' }}>{p.n}</span>
              <h3 className="font-display text-2xl font-light">{p.t}</h3>
              <p className="text-sm font-light leading-relaxed" style={{ color: '#5F5A6B' }}>{p.d}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* ---------------------------------------------------- PRECIOS */}
      <section id="precios" className="py-20 md:py-28" style={{ backgroundColor: TINTA }}>
        <div className="max-w-6xl mx-auto px-5">
          <div className="max-w-xl space-y-3 mb-14">
            <span className="etiqueta" style={{ color: ORO }}>Precios</span>
            <h2 className="font-display text-4xl md:text-5xl font-light leading-tight" style={{ color: PAPEL }}>
              Un solo pago. Sin mensualidades.
            </h2>
            <p className="text-sm font-light" style={{ color: '#8A8397' }}>
              Armas tu invitación completa gratis. Pagas cuando decidas compartirla.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {ORDEN_PLANES.map((id) => {
              const p = PLANES[id];
              const destacado = !!p.destacado;
              return (
                <div
                  key={id}
                  className="relative rounded-sm p-8 flex flex-col justify-between border"
                  style={{
                    backgroundColor: destacado ? PAPEL : 'rgba(255,255,255,.04)',
                    borderColor: destacado ? SELLO : 'rgba(255,255,255,.12)',
                    color: destacado ? TINTA : PAPEL,
                  }}
                >
                  {destacado && (
                    <span className="etiqueta absolute -top-3 left-8 px-3 py-1.5 rounded-full text-white" style={{ backgroundColor: SELLO }}>
                      El más elegido
                    </span>
                  )}

                  <div className="space-y-5">
                    <h3 className="font-display text-2xl font-light">{p.nombre}</h3>

                    <div>
                      <span className="text-xs line-through" style={{ color: destacado ? '#9A93A5' : '#6F6980' }}>
                        {formatearPesos(p.precioAntes)}
                      </span>
                      <div className="font-display text-5xl font-light leading-none mt-1">
                        {formatearPesos(p.precio)}
                        <span className="etiqueta ml-2" style={{ color: destacado ? '#9A93A5' : '#6F6980' }}>mxn</span>
                      </div>
                    </div>

                    <p className="text-sm font-light leading-relaxed" style={{ color: destacado ? '#5F5A6B' : '#A49DB2' }}>
                      {p.resumen}
                    </p>

                    <div className="regla-oro w-full" />

                    <ul className="space-y-2.5">
                      {p.incluye.map((f) => (
                        <li key={f} className="flex gap-2.5 text-sm font-light leading-snug">
                          <span style={{ color: ORO }}>·</span>
                          <span style={{ color: destacado ? '#3D3849' : '#BDB7C7' }}>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Link
                    href={`/crear?plan=${id}`}
                    className="etiqueta text-center mt-9 py-4 rounded-full transition-transform hover:scale-[1.02]"
                    style={{
                      backgroundColor: destacado ? SELLO : 'transparent',
                      color: destacado ? '#fff' : PAPEL,
                      border: destacado ? 'none' : '1px solid rgba(255,255,255,.28)',
                    }}
                  >
                    Empezar gratis
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------- PREGUNTAS */}
      <section className="max-w-3xl mx-auto px-5 py-20 md:py-28">
        <div className="space-y-3 mb-12">
          <span className="etiqueta" style={{ color: SELLO }}>Preguntas</span>
          <h2 className="font-display text-4xl md:text-5xl font-light leading-tight">Lo que más nos preguntan.</h2>
        </div>

        <div className="divide-y" style={{ borderColor: 'rgba(28,26,36,.12)' }}>
          {PREGUNTAS.map((p, i) => (
            <div key={p.q} style={{ borderColor: 'rgba(28,26,36,.12)' }}>
              <button
                type="button"
                onClick={() => setPreguntaAbierta(preguntaAbierta === i ? null : i)}
                aria-expanded={preguntaAbierta === i}
                className="w-full flex items-center justify-between gap-6 py-5 text-left cursor-pointer"
              >
                <span className="font-display text-xl md:text-2xl font-light">{p.q}</span>
                <span
                  className="text-2xl font-light shrink-0 transition-transform duration-300"
                  style={{ color: SELLO, transform: preguntaAbierta === i ? 'rotate(45deg)' : 'none' }}
                  aria-hidden="true"
                >
                  +
                </span>
              </button>
              <AnimatePresence initial={false}>
                {preguntaAbierta === i && (
                  <motion.p
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.28 }}
                    className="overflow-hidden text-sm font-light leading-relaxed pb-6 pr-10"
                    style={{ color: '#5F5A6B' }}
                  >
                    {p.a}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------------------------------------------- CIERRE */}
      <section className="py-20 md:py-28 text-center px-5" style={{ backgroundColor: LINO }}>
        <div className="max-w-xl mx-auto space-y-7">
          <div className="regla-oro w-24 mx-auto" />
          <h2 className="font-display text-4xl md:text-5xl font-light leading-tight">
            Ábrela tú primero.<br />
            <span className="italic" style={{ color: SELLO }}>Decides después.</span>
          </h2>
          <p className="text-sm font-light" style={{ color: '#5F5A6B' }}>
            No pedimos tarjeta. Solo pagas si te enamora.
          </p>
          <Link
            href="/crear"
            className="inline-block etiqueta text-white px-10 py-4 rounded-full transition-transform hover:scale-[1.03]"
            style={{ backgroundColor: TINTA }}
          >
            Crear mi invitación
          </Link>
        </div>
      </section>

      {/* ---------------------------------------------------- PIE */}
      <footer style={{ backgroundColor: TINTA, color: '#8A8397' }} className="py-14">
        <div className="max-w-6xl mx-auto px-5 grid sm:grid-cols-2 gap-10">
          <div className="space-y-3">
            <span className="font-display text-2xl" style={{ color: PAPEL }}>
              clicky<span style={{ color: ORO }}>papel</span>
            </span>
            <p className="text-xs font-light max-w-xs">
              Invitaciones digitales para las celebraciones que sí se recuerdan.
            </p>
          </div>

          <div className="flex flex-col sm:items-end gap-3 etiqueta">
            <Link href="/crear" className="hover:opacity-70 transition-opacity">Crear invitación</Link>
            <Link href="/login" className="hover:opacity-70 transition-opacity">Entrar a mi panel</Link>
            <Link href="/privacidad" className="hover:opacity-70 transition-opacity">Aviso de privacidad</Link>
            <Link href="/terminos" className="hover:opacity-70 transition-opacity">Términos</Link>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-5 mt-12 pt-6 border-t text-[11px] font-light" style={{ borderColor: 'rgba(255,255,255,.1)' }}>
          © {new Date().getFullYear()} ClickyPapel · Hecho en México
        </div>
      </footer>
    </div>
  );
}
