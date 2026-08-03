"use client";
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { PLANES, ORDEN_PLANES, formatearPesos } from '@/lib/precios';

/* Paleta: vino profundo, champán y oro. Romántica sin caer en el rosa genérico. */
const VINO = '#5E2233';
const CARBON = '#241A1E';
const CHAMPAN = '#FBF5EF';
const ARENA = '#F2E7DA';
const ORO = '#C0954E';
const ROSA = '#D9A5A0';

const FOTO = {
  hero: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?q=80&w=1920',
  papeleria: 'https://images.unsplash.com/photo-1607190074257-dd4b7af0309f?q=80&w=1200',
  boda: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=900',
  bodaDos: 'https://images.unsplash.com/photo-1542042161784-26ab9e041e89?q=80&w=900',
  xv: 'https://images.unsplash.com/photo-1549417229-aa67d3263c09?q=80&w=900',
  xvDos: 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?q=80&w=900',
  baby: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=900',
  bautizo: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=900',
  despedida: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=900',
};

const PLANTILLAS = [
  { n: 'Jardín Blanco', e: 'Boda', img: FOTO.boda },
  { n: 'Alta Gala', e: 'Boda', img: FOTO.bodaDos },
  { n: 'Corona Real', e: 'XV Años', img: FOTO.xv },
  { n: 'Jardín Encantado', e: 'XV Años', img: FOTO.xvDos },
  { n: 'Nube Suave', e: 'Baby Shower', img: FOTO.baby },
  { n: 'Última Noche', e: 'Despedida', img: FOTO.despedida },
];

const CELEBRACIONES = [
  { id: 'boda', n: 'Bodas', img: FOTO.boda },
  { id: 'xvanos', n: 'XV Años', img: FOTO.xv },
  { id: 'baby', n: 'Baby Shower', img: FOTO.baby },
  { id: 'bautizo', n: 'Bautizos', img: FOTO.bautizo },
  { id: 'despedida', n: 'Despedidas', img: FOTO.despedida },
];

const PASOS = [
  { n: '01', t: 'Elige tu celebración', d: 'Boda, XV años, baby shower, bautizo o despedida.' },
  { n: '02', t: 'Escribe tus datos', d: 'Nombres, fecha y el estilo que te lata. Tres pantallas y ya.' },
  { n: '03', t: 'Míralo y decide', d: 'Ves tu invitación completa. Pagas solo si la quieres compartir.' },
];

const PREGUNTAS = [
  { q: '¿De verdad puedo armarla gratis?', a: 'Sí. La armas completa y la ves funcionando con música y todo, sin pagar nada. El cobro es solo cuando quieres compartirla con tus invitados.' },
  { q: '¿Mis invitados tienen que instalar algo?', a: 'No. Les mandas el link por WhatsApp y se abre solito en cualquier celular.' },
  { q: '¿Puedo cambiarla después de publicarla?', a: 'Las veces que quieras. El link nunca cambia, así que no tienes que reenviarlo.' },
  { q: '¿Cómo sé quién va a ir?', a: 'Cada invitado busca su nombre y confirma desde la misma invitación. Tú ves la lista en vivo desde tu panel.' },
  { q: '¿Puedo poner mi canción?', a: 'Tenemos melodías listas incluidas, y en los planes superiores puedes subir la canción que ustedes elijan.' },
];

export default function Home() {
  const [abierto, setAbierto] = useState(false);
  const [sonando, setSonando] = useState(false);
  const [restante, setRestante] = useState(null);
  const [faq, setFaq] = useState(null);
  const audioRef = useRef(null);

  useEffect(() => {
    const objetivo = new Date();
    objetivo.setDate(objetivo.getDate() + 128);
    const tick = () => {
      const d = objetivo - new Date();
      setRestante({
        d: Math.floor(d / 86400000),
        h: Math.floor((d / 3600000) % 24),
        m: Math.floor((d / 60000) % 60),
        s: Math.floor((d / 1000) % 60),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const abrirSobre = () => {
    setAbierto(true);
    if (audioRef.current) {
      audioRef.current.volume = 0.45;
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
    <div style={{ backgroundColor: CHAMPAN, color: CARBON }} className="min-h-screen font-ui antialiased overflow-x-hidden">
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Great+Vibes&family=Jost:wght@300;400;500;600&display=swap');
        .font-display { font-family: 'Cormorant Garamond', Georgia, serif; }
        .font-script { font-family: 'Great Vibes', cursive; }
        .font-ui { font-family: 'Jost', system-ui, sans-serif; }
        .etiqueta { font-size: 10px; letter-spacing: .24em; text-transform: uppercase; font-weight: 600; }
        .oro-linea { height: 1px; background: linear-gradient(90deg, transparent, ${ORO}, transparent); }
        .tarjeta-foto img { transition: transform 1.1s cubic-bezier(.22,1,.36,1); }
        .tarjeta-foto:hover img { transform: scale(1.07); }
        a:focus-visible, button:focus-visible { outline: 2px solid ${ORO}; outline-offset: 3px; border-radius: 4px; }
        @media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation-duration:.01ms !important; transition-duration:.01ms !important; } }
      `}} />

      <audio ref={audioRef} src="/boda-music.mp3" loop preload="none" />

      {/* ══════════════════════════════ NAV */}
      <nav className="absolute top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-5 h-20 flex items-center justify-between">
          <Link href="/" className="font-display text-3xl tracking-wide text-white">
            clicky<span style={{ color: ORO }}>papel</span>
          </Link>
          <div className="hidden md:flex items-center gap-10 etiqueta text-white/80">
            <a href="#plantillas" className="hover:text-white transition-colors">Plantillas</a>
            <a href="#como" className="hover:text-white transition-colors">Cómo funciona</a>
            <a href="#precios" className="hover:text-white transition-colors">Precios</a>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="etiqueta text-white/80 hover:text-white transition-colors hidden sm:block">Entrar</Link>
            <Link href="/crear" className="etiqueta text-white px-6 py-3 rounded-full transition-transform hover:scale-[1.04]" style={{ backgroundColor: VINO }}>
              Crear gratis
            </Link>
          </div>
        </div>
      </nav>

      {/* ══════════════════════════════ HERO */}
      <header className="relative min-h-[100svh] flex items-center overflow-hidden">
        <img src={FOTO.hero} alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, rgba(36,26,30,.72) 0%, rgba(36,26,30,.55) 45%, rgba(94,34,51,.78) 100%)` }} />

        <div className="relative w-full max-w-7xl mx-auto px-5 pt-28 pb-16 grid lg:grid-cols-[1.05fr_auto] gap-14 items-center">

          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .9 }} className="space-y-7 text-center lg:text-left">
            <span className="etiqueta inline-block px-5 py-2.5 rounded-full backdrop-blur-sm border text-white" style={{ borderColor: 'rgba(192,149,78,.5)', backgroundColor: 'rgba(192,149,78,.14)' }}>
              Gratis hasta que la publiques
            </span>

            <h1 className="text-white leading-[.92]">
              <span className="font-script block text-[3.5rem] sm:text-6xl lg:text-7xl mb-1" style={{ color: ROSA }}>Tu gran día</span>
              <span className="font-display font-light block text-5xl sm:text-6xl lg:text-[5.5rem]">merece más que<br />un mensaje.</span>
            </h1>

            <p className="text-base md:text-lg font-light leading-relaxed max-w-lg mx-auto lg:mx-0 text-white/75">
              Una invitación que se abre como sobre, suena con su canción y confirma
              a los invitados sola. Lista en minutos, desde tu celular.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 pt-2 justify-center lg:justify-start">
              <Link href="/crear" className="w-full sm:w-auto text-center etiqueta text-white px-10 py-4.5 rounded-full transition-transform hover:scale-[1.04] shadow-2xl" style={{ backgroundColor: VINO, paddingTop: '1.1rem', paddingBottom: '1.1rem' }}>
                Crear mi invitación gratis
              </Link>
              <a href="#plantillas" className="etiqueta text-white/85 hover:text-white transition-colors border-b pb-1" style={{ borderColor: 'rgba(255,255,255,.35)' }}>
                Ver plantillas
              </a>
            </div>

            <div className="flex flex-wrap items-center gap-x-7 gap-y-2 justify-center lg:justify-start pt-3 etiqueta text-white/55" style={{ fontSize: 9 }}>
              <span>Sin tarjeta</span><span>·</span><span>Un solo pago</span><span>·</span><span>Cambios ilimitados</span>
            </div>
          </motion.div>

          {/* ── El sobre que se abre ── */}
          <motion.div initial={{ opacity: 0, scale: .93 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: .9, delay: .25 }} className="flex flex-col items-center gap-5">
            <div className="relative w-[270px] sm:w-[310px] h-[370px] sm:h-[420px]">
              <AnimatePresence>
                {!abierto && (
                  <motion.button
                    type="button" onClick={abrirSobre}
                    exit={{ opacity: 0, scale: .94, rotateX: -12 }} transition={{ duration: .55 }}
                    aria-label="Abrir el sobre de ejemplo"
                    className="absolute inset-0 cursor-pointer group rounded-sm"
                    style={{ backgroundColor: ARENA, boxShadow: '0 40px 80px -25px rgba(0,0,0,.75)' }}
                  >
                    <div className="absolute top-0 left-0 right-0 origin-top" style={{ height: '52%', backgroundColor: '#E7DACA', clipPath: 'polygon(0 0, 100% 0, 50% 100%)' }} />
                    <div className="absolute inset-3 border pointer-events-none" style={{ borderColor: 'rgba(192,149,78,.4)' }} />
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-5">
                      <motion.div
                        animate={{ scale: [1, 1.06, 1] }} transition={{ duration: 2.6, repeat: Infinity }}
                        className="w-24 h-24 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: VINO, boxShadow: '0 10px 30px -8px rgba(94,34,51,.85)' }}
                      >
                        <span className="font-script text-4xl" style={{ color: '#F0D5A0' }}>C</span>
                      </motion.div>
                      <span className="etiqueta" style={{ color: '#8A7660' }}>Toca el sello</span>
                    </div>
                  </motion.button>
                )}
              </AnimatePresence>

              {abierto && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .8, ease: [.22, 1, .36, 1] }}
                  className="absolute inset-0 flex flex-col items-center justify-center text-center px-7 rounded-sm overflow-hidden"
                  style={{ backgroundColor: CHAMPAN, boxShadow: '0 40px 80px -25px rgba(0,0,0,.75)' }}
                >
                  <img src={FOTO.papeleria} alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover opacity-[.13]" />
                  <div className="absolute inset-3 border pointer-events-none" style={{ borderColor: 'rgba(192,149,78,.45)' }} />

                  <div className="relative">
                    <span className="etiqueta" style={{ color: ORO }}>Nos casamos</span>
                    <p className="font-display text-5xl font-light leading-tight mt-3" style={{ color: CARBON }}>
                      Brisa<span className="font-script text-3xl block my-1" style={{ color: VINO }}>y</span>Bruno
                    </p>
                    <div className="oro-linea w-24 mx-auto my-5" />
                    {restante && (
                      <div className="flex gap-4 justify-center">
                        {[['días', restante.d], ['hrs', restante.h], ['min', restante.m], ['seg', restante.s]].map(([k, v]) => (
                          <div key={k} className="flex flex-col items-center">
                            <span className="font-display text-2xl" style={{ color: VINO }}>{String(v).padStart(2, '0')}</span>
                            <span className="etiqueta" style={{ color: '#9C8F84', fontSize: 8 }}>{k}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    <p className="text-[11px] font-light mt-6" style={{ color: '#9C8F84' }}>Así se ve una invitación real</p>
                  </div>
                </motion.div>
              )}
            </div>

            {abierto && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .5 }} className="flex items-center gap-5">
                <button type="button" onClick={alternarMusica} className="etiqueta flex items-center gap-2 text-white/80 hover:text-white transition-colors">
                  <span className="flex gap-[2px] items-end h-3 w-4" aria-hidden="true">
                    {[0, 1, 2, 3].map((b) => (
                      <motion.span key={b}
                        animate={sonando ? { height: ['25%', '100%', '25%'] } : { height: '30%' }}
                        transition={{ duration: .7, repeat: Infinity, delay: b * .14 }}
                        className="w-[2px] block rounded-full" style={{ backgroundColor: ORO }} />
                    ))}
                  </span>
                  {sonando ? 'Pausar' : 'Reanudar'}
                </button>
                <Link href="/bruno-y-brisa" className="etiqueta text-white/80 hover:text-white transition-colors">Ver completa →</Link>
              </motion.div>
            )}
          </motion.div>
        </div>
      </header>

      {/* ══════════════════════════════ TIRA DE CONFIANZA */}
      <section style={{ backgroundColor: VINO }} className="py-7">
        <div className="max-w-6xl mx-auto px-5 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            ['5', 'tipos de celebración'],
            ['1', 'solo pago, sin mensualidades'],
            ['∞', 'cambios después de publicar'],
            ['0', 'apps que instalar'],
          ].map(([n, t]) => (
            <div key={t}>
              <span className="font-display text-3xl block" style={{ color: ORO }}>{n}</span>
              <span className="etiqueta text-white/70" style={{ fontSize: 9 }}>{t}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════ ASÍ SE VE (maqueta de celular) */}
      <section className="py-24 md:py-32">
        <div className="max-w-6xl mx-auto px-5 grid lg:grid-cols-2 gap-16 items-center">

          <div className="order-2 lg:order-1 space-y-8">
            <div className="space-y-3">
              <span className="font-script text-3xl" style={{ color: VINO }}>Así lo viven tus invitados</span>
              <h2 className="font-display text-4xl md:text-5xl font-light leading-tight">
                Se abre, suena<br />y confirma sola.
              </h2>
            </div>

            {[
              { t: 'Tocan el sello y se abre', d: 'La animación arranca y la música empieza a sonar. Nadie olvida esa entrada.' },
              { t: 'Buscan su nombre', d: 'Ven cuántos lugares les tocan y confirman ahí mismo, sin formularios eternos.' },
              { t: 'Llegan sin llamarte', d: 'Mapa directo, horarios, código de vestimenta y mesa de regalos en el mismo link.' },
            ].map((f, i) => (
              <div key={f.t} className="flex gap-5">
                <span className="font-display text-2xl shrink-0 w-9 h-9 rounded-full flex items-center justify-center border" style={{ color: VINO, borderColor: 'rgba(192,149,78,.5)' }}>
                  {i + 1}
                </span>
                <div className="space-y-1">
                  <h3 className="font-display text-xl">{f.t}</h3>
                  <p className="text-sm font-light leading-relaxed" style={{ color: '#6F6259' }}>{f.d}</p>
                </div>
              </div>
            ))}

            <Link href="/bruno-y-brisa" className="inline-block etiqueta pb-1 border-b transition-opacity hover:opacity-60" style={{ color: VINO, borderColor: ORO }}>
              Abrir un ejemplo real →
            </Link>
          </div>

          {/* Celular */}
          <div className="order-1 lg:order-2 flex justify-center">
            <div className="relative w-[280px] h-[570px] rounded-[2.75rem] p-3" style={{ backgroundColor: CARBON, boxShadow: '0 40px 80px -30px rgba(36,26,30,.6)' }}>
              <div className="absolute top-3 left-1/2 -translate-x-1/2 w-24 h-5 rounded-b-2xl z-20" style={{ backgroundColor: CARBON }} />
              <div className="w-full h-full rounded-[2.25rem] overflow-hidden relative" style={{ backgroundColor: CHAMPAN }}>
                <img src={FOTO.bodaDos} alt="Invitación digital vista en un celular" className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(36,26,30,.15) 0%, rgba(36,26,30,.72) 65%, rgba(94,34,51,.9) 100%)' }} />

                <div className="absolute inset-x-0 bottom-0 p-6 text-center text-white space-y-4">
                  <span className="etiqueta block" style={{ color: ORO }}>19 · Diciembre · 2026</span>
                  <p className="font-script text-4xl">Brisa y Bruno</p>
                  <div className="oro-linea w-16 mx-auto" />
                  {restante && (
                    <div className="flex justify-center gap-4">
                      {[['d', restante.d], ['h', restante.h], ['m', restante.m]].map(([k, v]) => (
                        <div key={k}>
                          <span className="font-display text-xl block">{String(v).padStart(2, '0')}</span>
                          <span className="etiqueta text-white/50" style={{ fontSize: 8 }}>{k}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="rounded-xl py-3 etiqueta" style={{ backgroundColor: 'rgba(255,255,255,.94)', color: VINO }}>
                    Confirmar asistencia
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════ PLANTILLAS */}
      <section id="plantillas" className="py-24 md:py-32" style={{ backgroundColor: ARENA }}>
        <div className="max-w-7xl mx-auto px-5">
          <div className="text-center space-y-3 mb-14">
            <span className="font-script text-3xl" style={{ color: VINO }}>Elige tu favorita</span>
            <h2 className="font-display text-4xl md:text-5xl font-light">Diseños para cada estilo</h2>
            <p className="text-sm font-light max-w-md mx-auto" style={{ color: '#6F6259' }}>
              Todas se adaptan a tus colores, tu tipografía y tus fotos.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {PLANTILLAS.map((p) => (
              <Link key={p.n} href="/crear" className="tarjeta-foto group relative aspect-[3/4] overflow-hidden rounded-sm block">
                <img src={p.img} alt={p.n} className="w-full h-full object-cover" />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent 40%, rgba(36,26,30,.82) 100%)' }} />
                <div className="absolute inset-x-0 bottom-0 p-4 md:p-5 text-white">
                  <span className="etiqueta block mb-1" style={{ color: ORO, fontSize: 9 }}>{p.e}</span>
                  <h3 className="font-display text-xl md:text-2xl font-light">{p.n}</h3>
                </div>
                <div className="absolute inset-2 border opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ borderColor: 'rgba(255,255,255,.45)' }} />
              </Link>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/crear" className="inline-block etiqueta text-white px-10 py-4 rounded-full transition-transform hover:scale-[1.04]" style={{ backgroundColor: VINO }}>
              Probar una gratis
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════ CELEBRACIONES */}
      <section className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-5">
          <div className="text-center space-y-3 mb-14">
            <span className="font-script text-3xl" style={{ color: VINO }}>Para toda ocasión</span>
            <h2 className="font-display text-4xl md:text-5xl font-light">Cada fiesta pide lo suyo</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
            {CELEBRACIONES.map((c) => (
              <Link key={c.id} href={`/crear?evento=${c.id}`} className="tarjeta-foto group relative aspect-[4/5] overflow-hidden rounded-sm block">
                <img src={c.img} alt={c.n} className="w-full h-full object-cover" />
                <div className="absolute inset-0 transition-colors duration-500" style={{ backgroundColor: 'rgba(94,34,51,.5)' }} />
                <div className="absolute inset-0 flex items-center justify-center p-3">
                  <h3 className="font-display text-xl md:text-2xl text-white text-center font-light leading-tight">{c.n}</h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════ CÓMO FUNCIONA */}
      <section id="como" className="py-24 md:py-32 relative overflow-hidden" style={{ backgroundColor: CARBON }}>
        <img src={FOTO.papeleria} alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover opacity-[.14]" />
        <div className="relative max-w-6xl mx-auto px-5">
          <div className="text-center space-y-3 mb-16">
            <span className="font-script text-3xl" style={{ color: ROSA }}>Es más fácil de lo que crees</span>
            <h2 className="font-display text-4xl md:text-5xl font-light text-white">Tres pasos y ya la estás viendo</h2>
          </div>

          <ol className="grid md:grid-cols-3 gap-12 md:gap-10">
            {PASOS.map((p) => (
              <li key={p.n} className="text-center space-y-4">
                <span className="font-display text-6xl font-light block" style={{ color: 'rgba(192,149,78,.55)' }}>{p.n}</span>
                <h3 className="font-display text-2xl text-white font-light">{p.t}</h3>
                <p className="text-sm font-light leading-relaxed text-white/60 max-w-xs mx-auto">{p.d}</p>
              </li>
            ))}
          </ol>

          <div className="text-center mt-16">
            <Link href="/crear" className="inline-block etiqueta text-white px-10 py-4 rounded-full transition-transform hover:scale-[1.04]" style={{ backgroundColor: VINO }}>
              Empezar ahora
            </Link>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════ RESEÑAS
          ⚠️ REEMPLAZA ESTO CON RESEÑAS REALES DE TUS CLIENTES ANTES DE PUBLICAR.
          Publicar testimonios inventados es engañoso y te puede costar caro. */}
      <section className="py-24 md:py-32" style={{ backgroundColor: ARENA }}>
        <div className="max-w-6xl mx-auto px-5">
          <div className="text-center space-y-3 mb-14">
            <span className="font-script text-3xl" style={{ color: VINO }}>Lo que dicen</span>
            <h2 className="font-display text-4xl md:text-5xl font-light">Novias que ya la usaron</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <figure key={i} className="bg-white rounded-sm p-8 space-y-5 border" style={{ borderColor: 'rgba(192,149,78,.25)' }}>
                <span className="font-script text-4xl block" style={{ color: ORO }}>&ldquo;</span>
                <blockquote className="text-sm font-light leading-relaxed" style={{ color: '#6F6259' }}>
                  [Pega aquí la reseña real de tu cliente. Si todavía no tienes, borra esta sección
                  y ponla cuando llegue la primera.]
                </blockquote>
                <figcaption className="etiqueta" style={{ color: VINO, fontSize: 9 }}>
                  [Nombre] · [Ciudad]
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════ PRECIOS */}
      <section id="precios" className="py-24 md:py-32">
        <div className="max-w-6xl mx-auto px-5">
          <div className="text-center space-y-3 mb-14">
            <span className="font-script text-3xl" style={{ color: VINO }}>Nuestros planes</span>
            <h2 className="font-display text-4xl md:text-5xl font-light">Un solo pago, sin mensualidades</h2>
            <p className="text-sm font-light max-w-md mx-auto" style={{ color: '#6F6259' }}>
              Arma tu invitación completa gratis. Pagas cuando decidas compartirla.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 items-stretch">
            {ORDEN_PLANES.map((id) => {
              const p = PLANES[id];
              const top = !!p.destacado;
              return (
                <div key={id} className="relative rounded-sm p-8 flex flex-col justify-between border-2 transition-transform hover:-translate-y-1"
                  style={{
                    backgroundColor: top ? VINO : '#fff',
                    borderColor: top ? VINO : 'rgba(192,149,78,.3)',
                    color: top ? '#fff' : CARBON,
                    boxShadow: top ? '0 30px 60px -25px rgba(94,34,51,.55)' : 'none',
                  }}>
                  {top && (
                    <span className="etiqueta absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full whitespace-nowrap" style={{ backgroundColor: ORO, color: CARBON }}>
                      El más elegido
                    </span>
                  )}

                  <div className="space-y-5">
                    <h3 className="font-display text-3xl font-light">{p.nombre}</h3>
                    <div>
                      <span className="text-xs line-through" style={{ color: top ? 'rgba(255,255,255,.5)' : '#A79A8E' }}>
                        {formatearPesos(p.precioAntes)}
                      </span>
                      <div className="font-display text-5xl font-light leading-none mt-1">
                        {formatearPesos(p.precio)}
                        <span className="etiqueta ml-2" style={{ color: top ? 'rgba(255,255,255,.55)' : '#A79A8E' }}>mxn</span>
                      </div>
                    </div>
                    <p className="text-sm font-light leading-relaxed" style={{ color: top ? 'rgba(255,255,255,.75)' : '#6F6259' }}>
                      {p.resumen}
                    </p>
                    <div className="oro-linea w-full" />
                    <ul className="space-y-2.5">
                      {p.incluye.map((f) => (
                        <li key={f} className="flex gap-3 text-sm font-light leading-snug">
                          <span style={{ color: ORO }}>✓</span>
                          <span style={{ color: top ? 'rgba(255,255,255,.85)' : '#4E453E' }}>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Link href={`/crear?plan=${id}`} className="etiqueta text-center mt-9 py-4 rounded-full transition-transform hover:scale-[1.03]"
                    style={{
                      backgroundColor: top ? ORO : VINO,
                      color: top ? CARBON : '#fff',
                    }}>
                    Empezar gratis
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════ PREGUNTAS */}
      <section className="max-w-3xl mx-auto px-5 py-24 md:py-32">
        <div className="text-center space-y-3 mb-12">
          <span className="font-script text-3xl" style={{ color: VINO }}>Dudas frecuentes</span>
          <h2 className="font-display text-4xl md:text-5xl font-light">Lo que más nos preguntan</h2>
        </div>

        <div className="divide-y" style={{ borderColor: 'rgba(192,149,78,.3)' }}>
          {PREGUNTAS.map((p, i) => (
            <div key={p.q} style={{ borderColor: 'rgba(192,149,78,.3)' }}>
              <button type="button" onClick={() => setFaq(faq === i ? null : i)} aria-expanded={faq === i}
                className="w-full flex items-center justify-between gap-6 py-5 text-left cursor-pointer">
                <span className="font-display text-xl md:text-2xl font-light">{p.q}</span>
                <span className="text-2xl font-light shrink-0 transition-transform duration-300"
                  style={{ color: VINO, transform: faq === i ? 'rotate(45deg)' : 'none' }} aria-hidden="true">+</span>
              </button>
              <AnimatePresence initial={false}>
                {faq === i && (
                  <motion.p initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: .28 }} className="overflow-hidden text-sm font-light leading-relaxed pb-6 pr-10" style={{ color: '#6F6259' }}>
                    {p.a}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════ CIERRE */}
      <section className="relative py-28 md:py-36 text-center px-5 overflow-hidden">
        <img src={FOTO.boda} alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(94,34,51,.9), rgba(36,26,30,.94))' }} />
        <div className="relative max-w-xl mx-auto space-y-7">
          <div className="oro-linea w-24 mx-auto" />
          <span className="font-script text-4xl block" style={{ color: ROSA }}>Ábrela tú primero</span>
          <h2 className="font-display text-4xl md:text-5xl font-light text-white leading-tight">
            Decides después de verla.
          </h2>
          <p className="text-sm font-light text-white/65">No pedimos tarjeta. Solo pagas si te enamora.</p>
          <Link href="/crear" className="inline-block etiqueta px-12 py-4.5 rounded-full transition-transform hover:scale-[1.04]"
            style={{ backgroundColor: ORO, color: CARBON, paddingTop: '1.1rem', paddingBottom: '1.1rem' }}>
            Crear mi invitación gratis
          </Link>
        </div>
      </section>

      {/* ══════════════════════════════ PIE */}
      <footer style={{ backgroundColor: CARBON, color: 'rgba(255,255,255,.55)' }} className="py-16">
        <div className="max-w-6xl mx-auto px-5 grid sm:grid-cols-2 gap-10">
          <div className="space-y-3">
            <span className="font-display text-3xl text-white">clicky<span style={{ color: ORO }}>papel</span></span>
            <p className="text-xs font-light max-w-xs">
              Invitaciones digitales para las celebraciones que sí se recuerdan.
            </p>
          </div>
          <div className="flex flex-col sm:items-end gap-3 etiqueta">
            <Link href="/crear" className="hover:text-white transition-colors">Crear invitación</Link>
            <Link href="/login" className="hover:text-white transition-colors">Entrar a mi panel</Link>
            <Link href="/privacidad" className="hover:text-white transition-colors">Aviso de privacidad</Link>
            <Link href="/terminos" className="hover:text-white transition-colors">Términos</Link>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-5 mt-12 pt-6 border-t text-[11px] font-light" style={{ borderColor: 'rgba(255,255,255,.1)' }}>
          © {new Date().getFullYear()} ClickyPapel · Hecho en México
        </div>
      </footer>

      {/* Barra fija en celular: el botón nunca se pierde de vista */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 px-4 py-3 backdrop-blur-md border-t"
        style={{ backgroundColor: 'rgba(251,245,239,.95)', borderColor: 'rgba(192,149,78,.3)' }}>
        <Link href="/crear" className="block text-center etiqueta text-white py-4 rounded-full" style={{ backgroundColor: VINO }}>
          Crear mi invitación gratis
        </Link>
      </div>
      <div className="md:hidden h-20" />
    </div>
  );
}
