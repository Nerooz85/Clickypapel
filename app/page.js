"use client";
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { PLANES, ORDEN_PLANES, formatearPesos } from '@/lib/precios';

/* Vino profundo, champán y oro. Romántico sin caer en el rosa genérico. */
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

/* ─────────── Aparece al entrar en pantalla ─────────── */
function Reveal({ children, delay = 0, y = 34, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-70px' }}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ─────────── Titular palabra por palabra ─────────── */
function Titular({ texto, className = '', style, delay = 0 }) {
  return (
    <span className={className} style={style}>
      {texto.split(' ').map((palabra, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom">
          <motion.span
            className="inline-block"
            initial={{ y: '110%' }}
            animate={{ y: 0 }}
            transition={{ duration: 1, delay: delay + i * 0.09, ease: [0.22, 1, 0.36, 1] }}
          >
            {palabra}&nbsp;
          </motion.span>
        </span>
      ))}
    </span>
  );
}

export default function Home() {
  const [velo, setVelo] = useState(true);
  const [fase, setFase] = useState('cerrado'); // cerrado · abriendo · abierto
  const [sonando, setSonando] = useState(false);
  const [restante, setRestante] = useState(null);
  const [faq, setFaq] = useState(null);
  const [scrolleado, setScrolleado] = useState(false);
  const audioRef = useRef(null);
  const heroRef = useRef(null);
  const sinMovimiento = useReducedMotion();

  const { scrollYProgress } = useScroll();
  const { scrollYProgress: heroProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(heroProgress, [0, 1], [0, 120]);
  const heroFade = useTransform(heroProgress, [0, 0.8], [1, 0]);

  /* El velo de entrada se quita solo. Nunca bloquea. */
  useEffect(() => {
    const t = setTimeout(() => setVelo(false), sinMovimiento ? 100 : 1700);
    return () => clearTimeout(t);
  }, [sinMovimiento]);

  useEffect(() => {
    const onScroll = () => setScrolleado(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

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
    if (fase !== 'cerrado') return;
    setFase('abriendo');
    if (audioRef.current) {
      audioRef.current.volume = 0.45;
      audioRef.current.play().then(() => setSonando(true)).catch(() => {});
    }
    setTimeout(() => setFase('abierto'), 900);
  };

  const alternarMusica = () => {
    if (!audioRef.current) return;
    if (sonando) audioRef.current.pause();
    else audioRef.current.play().catch(() => {});
    setSonando(!sonando);
  };

  const petalos = [
    { l: '8%', d: 0, dur: 17, s: 7 }, { l: '22%', d: 4, dur: 21, s: 5 },
    { l: '38%', d: 8, dur: 19, s: 8 }, { l: '55%', d: 2, dur: 23, s: 6 },
    { l: '71%', d: 10, dur: 18, s: 5 }, { l: '86%', d: 6, dur: 22, s: 7 },
    { l: '94%', d: 13, dur: 20, s: 4 },
  ];

  return (
    <div style={{ backgroundColor: CHAMPAN, color: CARBON }} className="min-h-screen font-ui antialiased overflow-x-hidden">
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Great+Vibes&family=Jost:wght@300;400;500;600&display=swap');
        .font-display { font-family: 'Cormorant Garamond', Georgia, serif; }
        .font-script { font-family: 'Great Vibes', cursive; }
        .font-ui { font-family: 'Jost', system-ui, sans-serif; }
        .etiqueta { font-size: 10px; letter-spacing: .24em; text-transform: uppercase; font-weight: 600; }
        .oro-linea { height: 1px; background: linear-gradient(90deg, transparent, ${ORO}, transparent); }
        .tarjeta-foto img { transition: transform 1.2s cubic-bezier(.22,1,.36,1); }
        .tarjeta-foto:hover img { transform: scale(1.08); }
        .perspectiva { perspective: 1400px; }
        @keyframes kenburns { 0% { transform: scale(1) translate(0,0); } 100% { transform: scale(1.14) translate(-1.5%, -1.5%); } }
        .kenburns { animation: kenburns 26s ease-in-out infinite alternate; }
        a:focus-visible, button:focus-visible { outline: 2px solid ${ORO}; outline-offset: 3px; border-radius: 4px; }
        @media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation: none !important; transition-duration: .01ms !important; } }
      `}} />

      <audio ref={audioRef} src="/boda-music.mp3" loop preload="none" />

      {/* ═══════════ VELO DE ENTRADA — se abre solo en 1.7s */}
      <AnimatePresence>
        {velo && !sinMovimiento && (
          <motion.div className="fixed inset-0 z-[200] pointer-events-none" exit={{ opacity: 0 }} transition={{ duration: .5 }}>
            <motion.div
              className="absolute inset-x-0 top-0 h-1/2"
              style={{ backgroundColor: CARBON }}
              initial={{ y: 0 }} exit={{ y: '-100%' }}
              transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
            />
            <motion.div
              className="absolute inset-x-0 bottom-0 h-1/2"
              style={{ backgroundColor: CARBON }}
              initial={{ y: 0 }} exit={{ y: '100%' }}
              transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
            />
            <motion.div
              className="absolute inset-0 flex flex-col items-center justify-center gap-4"
              exit={{ opacity: 0 }} transition={{ duration: .4 }}
            >
              <motion.span
                className="font-display text-4xl md:text-5xl text-white tracking-wide"
                initial={{ opacity: 0, letterSpacing: '.5em' }}
                animate={{ opacity: 1, letterSpacing: '.08em' }}
                transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
              >
                clicky<span style={{ color: ORO }}>papel</span>
              </motion.span>
              <motion.div
                className="h-[1px]" style={{ backgroundColor: ORO }}
                initial={{ width: 0 }} animate={{ width: 120 }} transition={{ duration: 1.3, delay: .3 }}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════════ BARRA DE PROGRESO */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] origin-left z-[120]"
        style={{ backgroundColor: ORO, scaleX: scrollYProgress }}
      />

      {/* ═══════════ NAV — barra propia, separada del hero */}
      <nav
        className="sticky top-0 z-[110] transition-all duration-500"
        style={{
          backgroundColor: scrolleado ? 'rgba(251,245,239,.96)' : CARBON,
          backdropFilter: 'blur(12px)',
          borderBottom: `1px solid ${scrolleado ? 'rgba(192,149,78,.3)' : 'rgba(192,149,78,.45)'}`,
        }}
      >
        <div className="max-w-7xl mx-auto px-5 h-[72px] flex items-center justify-between">
          <Link href="/" className="font-display text-3xl tracking-wide transition-colors duration-500" style={{ color: scrolleado ? CARBON : '#fff' }}>
            clicky<span style={{ color: ORO }}>papel</span>
          </Link>

          <div className="hidden md:flex items-center gap-10 etiqueta transition-colors duration-500" style={{ color: scrolleado ? '#6F6259' : 'rgba(255,255,255,.75)' }}>
            {[['#plantillas', 'Plantillas'], ['#como', 'Cómo funciona'], ['#precios', 'Precios']].map(([h, t]) => (
              <a key={h} href={h} className="relative group py-1">
                {t}
                <span className="absolute left-0 -bottom-0.5 h-[1px] w-0 group-hover:w-full transition-all duration-400" style={{ backgroundColor: ORO }} />
              </a>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <Link href="/login" className="etiqueta hidden sm:block transition-colors duration-500 hover:opacity-70" style={{ color: scrolleado ? '#6F6259' : 'rgba(255,255,255,.75)' }}>
              Entrar
            </Link>
            <Link href="/crear" className="etiqueta text-white px-6 py-3 rounded-full transition-transform hover:scale-[1.05]" style={{ backgroundColor: VINO }}>
              Crear gratis
            </Link>
          </div>
        </div>
      </nav>

      {/* ═══════════ HERO */}
      <header ref={heroRef} className="relative overflow-hidden" style={{ minHeight: 'calc(100svh - 72px)' }}>
        <div className="absolute inset-0 overflow-hidden">
          <img src={FOTO.hero} alt="" aria-hidden="true" className="kenburns absolute inset-0 w-full h-full object-cover" />
        </div>
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(36,26,30,.78) 0%, rgba(36,26,30,.5) 40%, rgba(94,34,51,.85) 100%)' }} />

        {/* Pétalos que caen */}
        {!sinMovimiento && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
            {petalos.map((p, i) => (
              <motion.span
                key={i}
                className="absolute rounded-full"
                style={{ left: p.l, width: p.s, height: p.s, backgroundColor: i % 2 ? ORO : ROSA, opacity: .5 }}
                initial={{ top: '-6%' }}
                animate={{ top: '108%', x: [0, 26, -18, 12, 0], rotate: 360 }}
                transition={{ duration: p.dur, delay: p.d, repeat: Infinity, ease: 'linear' }}
              />
            ))}
          </div>
        )}

        <motion.div
          style={{ y: heroY, opacity: heroFade }}
          className="relative w-full max-w-7xl mx-auto px-5 py-16 md:py-20 grid lg:grid-cols-[1.05fr_auto] gap-14 items-center"
        >
          <div className="space-y-7 text-center lg:text-left">
            <motion.span
              initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .8, delay: 1.9 }}
              className="etiqueta inline-block px-5 py-2.5 rounded-full backdrop-blur-sm border text-white"
              style={{ borderColor: 'rgba(192,149,78,.5)', backgroundColor: 'rgba(192,149,78,.14)' }}
            >
              Gratis hasta que la publiques
            </motion.span>

            <h1 className="text-white leading-[.94]">
              <motion.span
                className="font-script block text-[3.5rem] sm:text-6xl lg:text-7xl mb-2"
                style={{ color: ROSA }}
                initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.4, delay: 2, ease: [0.22, 1, 0.36, 1] }}
              >
                Tu gran día
              </motion.span>
              <Titular
                texto="merece más que un mensaje."
                className="font-display font-light block text-5xl sm:text-6xl lg:text-[5.2rem]"
                delay={2.25}
              />
            </h1>

            <motion.p
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1.2, delay: 2.9 }}
              className="text-base md:text-lg font-light leading-relaxed max-w-lg mx-auto lg:mx-0 text-white/75"
            >
              Una invitación que se abre como sobre, suena con su canción y confirma
              a los invitados sola. Lista en minutos, desde tu celular.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 3.15 }}
              className="flex flex-col sm:flex-row items-center gap-4 pt-2 justify-center lg:justify-start"
            >
              <Link href="/crear" className="w-full sm:w-auto text-center etiqueta text-white px-10 rounded-full transition-transform hover:scale-[1.05] shadow-2xl" style={{ backgroundColor: VINO, paddingTop: '1.15rem', paddingBottom: '1.15rem' }}>
                Crear mi invitación gratis
              </Link>
              <a href="#plantillas" className="etiqueta text-white/85 hover:text-white transition-colors border-b pb-1" style={{ borderColor: 'rgba(255,255,255,.35)' }}>
                Ver plantillas
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 3.4 }}
              className="flex flex-wrap items-center gap-x-7 gap-y-2 justify-center lg:justify-start pt-3 etiqueta text-white/55" style={{ fontSize: 9 }}
            >
              <span>Sin tarjeta</span><span>·</span><span>Un solo pago</span><span>·</span><span>Cambios ilimitados</span>
            </motion.div>
          </div>

          {/* ─────── EL SOBRE: la solapa se abre y la tarjeta sale ─────── */}
          <motion.div
            initial={{ opacity: 0, scale: .9, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1.3, delay: 2.4, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center gap-6"
          >
            <div className="relative w-[280px] sm:w-[310px] h-[440px] sm:h-[470px] perspectiva">

              {/* La tarjeta sube desde dentro */}
              <motion.div
                className="absolute left-0 right-0 rounded-sm overflow-hidden"
                style={{ top: 130, height: 300, zIndex: 2, backgroundColor: CHAMPAN, boxShadow: '0 30px 60px -25px rgba(0,0,0,.6)' }}
                animate={fase === 'cerrado' ? { y: 0, opacity: 0 } : { y: -122, opacity: 1 }}
                transition={{ duration: 1.1, delay: fase === 'abriendo' ? .55 : 0, ease: [0.22, 1, 0.36, 1] }}
              >
                <img src={FOTO.papeleria} alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover opacity-[.12]" />
                <div className="absolute inset-3 border pointer-events-none" style={{ borderColor: 'rgba(192,149,78,.45)' }} />
                <div className="relative h-full flex flex-col items-center justify-center text-center px-6">
                  <span className="etiqueta" style={{ color: ORO }}>Nos casamos</span>
                  <p className="font-display text-4xl font-light leading-tight mt-2" style={{ color: CARBON }}>
                    Brisa<span className="font-script text-2xl block my-0.5" style={{ color: VINO }}>y</span>Bruno
                  </p>
                  <div className="oro-linea w-20 my-4" />
                  {restante && (
                    <div className="flex gap-3.5 justify-center">
                      {[['días', restante.d], ['hrs', restante.h], ['min', restante.m], ['seg', restante.s]].map(([k, v]) => (
                        <div key={k} className="flex flex-col items-center">
                          <span className="font-display text-xl" style={{ color: VINO }}>{String(v).padStart(2, '0')}</span>
                          <span className="etiqueta" style={{ color: '#9C8F84', fontSize: 8 }}>{k}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Bolsa del sobre: tapa la tarjeta hasta que sale */}
              <div
                className="absolute left-0 right-0 rounded-sm"
                style={{ top: 130, height: 300, zIndex: 3, backgroundColor: ARENA, boxShadow: '0 30px 60px -25px rgba(0,0,0,.65)' }}
              >
                <div className="absolute inset-x-0 top-0" style={{ height: 150, backgroundColor: '#EDE0CF', clipPath: 'polygon(0 0, 50% 62%, 100% 0)' }} />
                <div className="absolute inset-3 border pointer-events-none" style={{ borderColor: 'rgba(192,149,78,.35)' }} />
              </div>

              {/* Solapa que se abre hacia atrás */}
              <motion.div
                className="absolute left-0 right-0 origin-top"
                style={{ top: 130, height: 165, zIndex: fase === 'cerrado' ? 5 : 1, transformStyle: 'preserve-3d' }}
                animate={{ rotateX: fase === 'cerrado' ? 0 : -168 }}
                transition={{ duration: .9, ease: [0.65, 0, 0.35, 1] }}
              >
                <div className="absolute inset-0" style={{ backgroundColor: '#E7DACA', clipPath: 'polygon(0 0, 100% 0, 50% 100%)' }} />
              </motion.div>

              {/* Sello */}
              <AnimatePresence>
                {fase === 'cerrado' && (
                  <motion.button
                    type="button" onClick={abrirSobre} aria-label="Abrir el sobre de ejemplo"
                    className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 cursor-pointer"
                    style={{ top: 232, zIndex: 6 }}
                    exit={{ opacity: 0, scale: .6 }} transition={{ duration: .4 }}
                  >
                    <motion.span
                      className="w-24 h-24 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: VINO, boxShadow: `0 10px 30px -8px rgba(94,34,51,.9)` }}
                      animate={sinMovimiento ? {} : { scale: [1, 1.07, 1], boxShadow: [`0 0 0 0 rgba(192,149,78,.5)`, `0 0 0 22px rgba(192,149,78,0)`, `0 0 0 0 rgba(192,149,78,0)`] }}
                      transition={{ duration: 2.6, repeat: Infinity }}
                    >
                      <span className="font-script text-4xl" style={{ color: '#F0D5A0' }}>C</span>
                    </motion.span>
                    <span className="etiqueta text-white/70">Toca el sello</span>
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

            <AnimatePresence>
              {fase === 'abierto' && (
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .4 }} className="flex items-center gap-5">
                  <button type="button" onClick={alternarMusica} className="etiqueta flex items-center gap-2 text-white/80 hover:text-white transition-colors">
                    <span className="flex gap-[2px] items-end h-3 w-4" aria-hidden="true">
                      {[0, 1, 2, 3].map((b) => (
                        <motion.span key={b}
                          animate={sonando && !sinMovimiento ? { height: ['25%', '100%', '25%'] } : { height: '30%' }}
                          transition={{ duration: .7, repeat: Infinity, delay: b * .14 }}
                          className="w-[2px] block rounded-full" style={{ backgroundColor: ORO }} />
                      ))}
                    </span>
                    {sonando ? 'Pausar' : 'Reanudar'}
                  </button>
                  <Link href="/bruno-y-brisa" className="etiqueta text-white/80 hover:text-white transition-colors">Ver completa →</Link>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>

        {/* Indicador de scroll */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3.6 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 hidden md:flex"
        >
          <span className="etiqueta text-white/45" style={{ fontSize: 9 }}>Desliza</span>
          <motion.span
            className="w-[1px] h-10" style={{ background: `linear-gradient(180deg, ${ORO}, transparent)` }}
            animate={sinMovimiento ? {} : { scaleY: [0.3, 1, 0.3], originY: 0 }}
            transition={{ duration: 2.2, repeat: Infinity }}
          />
        </motion.div>
      </header>

      {/* ═══════════ TIRA DE CONFIANZA */}
      <section style={{ backgroundColor: VINO }} className="py-8">
        <div className="max-w-6xl mx-auto px-5 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[['5', 'tipos de celebración'], ['1', 'solo pago, sin mensualidades'], ['∞', 'cambios después de publicar'], ['0', 'apps que instalar']].map(([n, t], i) => (
            <Reveal key={t} delay={i * 0.1} y={18}>
              <span className="font-display text-3xl block" style={{ color: ORO }}>{n}</span>
              <span className="etiqueta text-white/70" style={{ fontSize: 9 }}>{t}</span>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ═══════════ ASÍ SE VE */}
      <section className="py-24 md:py-32">
        <div className="max-w-6xl mx-auto px-5 grid lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1 space-y-8">
            <Reveal className="space-y-3">
              <span className="font-script text-3xl block" style={{ color: VINO }}>Así lo viven tus invitados</span>
              <h2 className="font-display text-4xl md:text-5xl font-light leading-tight">Se abre, suena<br />y confirma sola.</h2>
            </Reveal>

            {[
              { t: 'Tocan el sello y se abre', d: 'La animación arranca y la música empieza a sonar. Nadie olvida esa entrada.' },
              { t: 'Buscan su nombre', d: 'Ven cuántos lugares les tocan y confirman ahí mismo, sin formularios eternos.' },
              { t: 'Llegan sin llamarte', d: 'Mapa directo, horarios, código de vestimenta y mesa de regalos en el mismo link.' },
            ].map((f, i) => (
              <Reveal key={f.t} delay={0.12 * (i + 1)} className="flex gap-5">
                <span className="font-display text-2xl shrink-0 w-10 h-10 rounded-full flex items-center justify-center border" style={{ color: VINO, borderColor: 'rgba(192,149,78,.55)' }}>{i + 1}</span>
                <div className="space-y-1">
                  <h3 className="font-display text-xl">{f.t}</h3>
                  <p className="text-sm font-light leading-relaxed" style={{ color: '#6F6259' }}>{f.d}</p>
                </div>
              </Reveal>
            ))}

            <Reveal delay={0.5}>
              <Link href="/bruno-y-brisa" className="inline-block etiqueta pb-1 border-b transition-opacity hover:opacity-60" style={{ color: VINO, borderColor: ORO }}>
                Abrir un ejemplo real →
              </Link>
            </Reveal>
          </div>

          <Reveal y={50} className="order-1 lg:order-2 flex justify-center">
            <motion.div
              animate={sinMovimiento ? {} : { y: [0, -14, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              className="relative w-[280px] h-[570px] rounded-[2.75rem] p-3"
              style={{ backgroundColor: CARBON, boxShadow: '0 45px 90px -30px rgba(36,26,30,.65)' }}
            >
              <div className="absolute top-3 left-1/2 -translate-x-1/2 w-24 h-5 rounded-b-2xl z-20" style={{ backgroundColor: CARBON }} />
              <div className="w-full h-full rounded-[2.25rem] overflow-hidden relative" style={{ backgroundColor: CHAMPAN }}>
                <img src={FOTO.bodaDos} alt="Invitación digital vista en un celular" className="kenburns absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(36,26,30,.15) 0%, rgba(36,26,30,.72) 65%, rgba(94,34,51,.92) 100%)' }} />
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
                  <div className="rounded-xl py-3 etiqueta" style={{ backgroundColor: 'rgba(255,255,255,.94)', color: VINO }}>Confirmar asistencia</div>
                </div>
              </div>
            </motion.div>
          </Reveal>
        </div>
      </section>

      {/* ═══════════ PLANTILLAS */}
      <section id="plantillas" className="py-24 md:py-32" style={{ backgroundColor: ARENA }}>
        <div className="max-w-7xl mx-auto px-5">
          <Reveal className="text-center space-y-3 mb-14">
            <span className="font-script text-3xl block" style={{ color: VINO }}>Elige tu favorita</span>
            <h2 className="font-display text-4xl md:text-5xl font-light">Diseños para cada estilo</h2>
            <p className="text-sm font-light max-w-md mx-auto" style={{ color: '#6F6259' }}>
              Todas se adaptan a tus colores, tu tipografía y tus fotos.
            </p>
          </Reveal>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {PLANTILLAS.map((p, i) => (
              <Reveal key={p.n} delay={(i % 3) * 0.12} y={45}>
                <Link href="/crear" className="tarjeta-foto group relative aspect-[3/4] overflow-hidden rounded-sm block">
                  <img src={p.img} alt={p.n} className="w-full h-full object-cover" />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent 40%, rgba(36,26,30,.85) 100%)' }} />
                  <div className="absolute inset-x-0 bottom-0 p-4 md:p-5 text-white transition-transform duration-500 group-hover:-translate-y-1">
                    <span className="etiqueta block mb-1" style={{ color: ORO, fontSize: 9 }}>{p.e}</span>
                    <h3 className="font-display text-xl md:text-2xl font-light">{p.n}</h3>
                  </div>
                  <div className="absolute inset-2 border opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ borderColor: 'rgba(255,255,255,.5)' }} />
                </Link>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.2} className="text-center mt-12">
            <Link href="/crear" className="inline-block etiqueta text-white px-10 py-4 rounded-full transition-transform hover:scale-[1.05]" style={{ backgroundColor: VINO }}>
              Probar una gratis
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ═══════════ CELEBRACIONES */}
      <section className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-5">
          <Reveal className="text-center space-y-3 mb-14">
            <span className="font-script text-3xl block" style={{ color: VINO }}>Para toda ocasión</span>
            <h2 className="font-display text-4xl md:text-5xl font-light">Cada fiesta pide lo suyo</h2>
          </Reveal>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
            {CELEBRACIONES.map((c, i) => (
              <Reveal key={c.id} delay={i * 0.09} y={40}>
                <Link href={`/crear?evento=${c.id}`} className="tarjeta-foto group relative aspect-[4/5] overflow-hidden rounded-sm block">
                  <img src={c.img} alt={c.n} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 transition-all duration-500 group-hover:opacity-70" style={{ backgroundColor: 'rgba(94,34,51,.55)' }} />
                  <div className="absolute inset-0 flex items-center justify-center p-3">
                    <h3 className="font-display text-xl md:text-2xl text-white text-center font-light leading-tight">{c.n}</h3>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ CÓMO FUNCIONA */}
      <section id="como" className="py-24 md:py-32 relative overflow-hidden" style={{ backgroundColor: CARBON }}>
        <img src={FOTO.papeleria} alt="" aria-hidden="true" className="kenburns absolute inset-0 w-full h-full object-cover opacity-[.14]" />
        <div className="relative max-w-6xl mx-auto px-5">
          <Reveal className="text-center space-y-3 mb-16">
            <span className="font-script text-3xl block" style={{ color: ROSA }}>Es más fácil de lo que crees</span>
            <h2 className="font-display text-4xl md:text-5xl font-light text-white">Tres pasos y ya la estás viendo</h2>
          </Reveal>

          <ol className="grid md:grid-cols-3 gap-12 md:gap-10">
            {PASOS.map((p, i) => (
              <Reveal key={p.n} delay={i * 0.16} y={40}>
                <li className="text-center space-y-4">
                  <span className="font-display text-6xl font-light block" style={{ color: 'rgba(192,149,78,.55)' }}>{p.n}</span>
                  <h3 className="font-display text-2xl text-white font-light">{p.t}</h3>
                  <p className="text-sm font-light leading-relaxed text-white/60 max-w-xs mx-auto">{p.d}</p>
                </li>
              </Reveal>
            ))}
          </ol>

          <Reveal delay={0.3} className="text-center mt-16">
            <Link href="/crear" className="inline-block etiqueta text-white px-10 py-4 rounded-full transition-transform hover:scale-[1.05]" style={{ backgroundColor: VINO }}>
              Empezar ahora
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ═══════════ RESEÑAS
          ⚠️ REEMPLAZA CON RESEÑAS REALES ANTES DE PUBLICAR.
          Publicar testimonios inventados es engañoso y te puede costar caro. */}
      <section className="py-24 md:py-32" style={{ backgroundColor: ARENA }}>
        <div className="max-w-6xl mx-auto px-5">
          <Reveal className="text-center space-y-3 mb-14">
            <span className="font-script text-3xl block" style={{ color: VINO }}>Lo que dicen</span>
            <h2 className="font-display text-4xl md:text-5xl font-light">Novias que ya la usaron</h2>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Reveal key={i} delay={i * 0.13} y={40}>
                <figure className="bg-white rounded-sm p-8 space-y-5 border h-full" style={{ borderColor: 'rgba(192,149,78,.28)' }}>
                  <span className="font-script text-4xl block" style={{ color: ORO }}>&ldquo;</span>
                  <blockquote className="text-sm font-light leading-relaxed" style={{ color: '#6F6259' }}>
                    [Pega aquí la reseña real de tu cliente. Si todavía no tienes, borra esta sección
                    y ponla cuando llegue la primera.]
                  </blockquote>
                  <figcaption className="etiqueta" style={{ color: VINO, fontSize: 9 }}>[Nombre] · [Ciudad]</figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ PRECIOS */}
      <section id="precios" className="py-24 md:py-32">
        <div className="max-w-6xl mx-auto px-5">
          <Reveal className="text-center space-y-3 mb-14">
            <span className="font-script text-3xl block" style={{ color: VINO }}>Nuestros planes</span>
            <h2 className="font-display text-4xl md:text-5xl font-light">Un solo pago, sin mensualidades</h2>
            <p className="text-sm font-light max-w-md mx-auto" style={{ color: '#6F6259' }}>
              Arma tu invitación completa gratis. Pagas cuando decidas compartirla.
            </p>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-6 items-stretch">
            {ORDEN_PLANES.map((id, i) => {
              const p = PLANES[id];
              const top = !!p.destacado;
              return (
                <Reveal key={id} delay={i * 0.14} y={45}>
                  <div className="relative rounded-sm p-8 flex flex-col justify-between border-2 h-full transition-transform duration-500 hover:-translate-y-2"
                    style={{
                      backgroundColor: top ? VINO : '#fff',
                      borderColor: top ? VINO : 'rgba(192,149,78,.3)',
                      color: top ? '#fff' : CARBON,
                      boxShadow: top ? '0 35px 70px -28px rgba(94,34,51,.6)' : 'none',
                    }}>
                    {top && (
                      <span className="etiqueta absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full whitespace-nowrap" style={{ backgroundColor: ORO, color: CARBON }}>
                        El más elegido
                      </span>
                    )}
                    <div className="space-y-5">
                      <h3 className="font-display text-3xl font-light">{p.nombre}</h3>
                      <div>
                        <span className="text-xs line-through" style={{ color: top ? 'rgba(255,255,255,.5)' : '#A79A8E' }}>{formatearPesos(p.precioAntes)}</span>
                        <div className="font-display text-5xl font-light leading-none mt-1">
                          {formatearPesos(p.precio)}
                          <span className="etiqueta ml-2" style={{ color: top ? 'rgba(255,255,255,.55)' : '#A79A8E' }}>mxn</span>
                        </div>
                      </div>
                      <p className="text-sm font-light leading-relaxed" style={{ color: top ? 'rgba(255,255,255,.75)' : '#6F6259' }}>{p.resumen}</p>
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
                    <Link href={`/crear?plan=${id}`} className="etiqueta text-center mt-9 py-4 rounded-full transition-transform hover:scale-[1.04]"
                      style={{ backgroundColor: top ? ORO : VINO, color: top ? CARBON : '#fff' }}>
                      Empezar gratis
                    </Link>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════ PREGUNTAS */}
      <section className="max-w-3xl mx-auto px-5 py-24 md:py-32">
        <Reveal className="text-center space-y-3 mb-12">
          <span className="font-script text-3xl block" style={{ color: VINO }}>Dudas frecuentes</span>
          <h2 className="font-display text-4xl md:text-5xl font-light">Lo que más nos preguntan</h2>
        </Reveal>

        <div className="divide-y" style={{ borderColor: 'rgba(192,149,78,.3)' }}>
          {PREGUNTAS.map((p, i) => (
            <Reveal key={p.q} delay={i * 0.07} y={20}>
              <div style={{ borderColor: 'rgba(192,149,78,.3)' }}>
                <button type="button" onClick={() => setFaq(faq === i ? null : i)} aria-expanded={faq === i}
                  className="w-full flex items-center justify-between gap-6 py-5 text-left cursor-pointer">
                  <span className="font-display text-xl md:text-2xl font-light">{p.q}</span>
                  <span className="text-2xl font-light shrink-0 transition-transform duration-300"
                    style={{ color: VINO, transform: faq === i ? 'rotate(45deg)' : 'none' }} aria-hidden="true">+</span>
                </button>
                <AnimatePresence initial={false}>
                  {faq === i && (
                    <motion.p initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: .3 }} className="overflow-hidden text-sm font-light leading-relaxed pb-6 pr-10" style={{ color: '#6F6259' }}>
                      {p.a}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ═══════════ CIERRE */}
      <section className="relative py-28 md:py-36 text-center px-5 overflow-hidden">
        <img src={FOTO.boda} alt="" aria-hidden="true" className="kenburns absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(94,34,51,.92), rgba(36,26,30,.95))' }} />
        <Reveal className="relative max-w-xl mx-auto space-y-7">
          <div className="oro-linea w-24 mx-auto" />
          <span className="font-script text-4xl block" style={{ color: ROSA }}>Ábrela tú primero</span>
          <h2 className="font-display text-4xl md:text-5xl font-light text-white leading-tight">Decides después de verla.</h2>
          <p className="text-sm font-light text-white/65">No pedimos tarjeta. Solo pagas si te enamora.</p>
          <Link href="/crear" className="inline-block etiqueta px-12 rounded-full transition-transform hover:scale-[1.05]"
            style={{ backgroundColor: ORO, color: CARBON, paddingTop: '1.15rem', paddingBottom: '1.15rem' }}>
            Crear mi invitación gratis
          </Link>
        </Reveal>
      </section>

      {/* ═══════════ PIE */}
      <footer style={{ backgroundColor: CARBON, color: 'rgba(255,255,255,.55)' }} className="py-16">
        <div className="max-w-6xl mx-auto px-5 grid sm:grid-cols-2 gap-10">
          <div className="space-y-3">
            <span className="font-display text-3xl text-white">clicky<span style={{ color: ORO }}>papel</span></span>
            <p className="text-xs font-light max-w-xs">Invitaciones digitales para las celebraciones que sí se recuerdan.</p>
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

      {/* Barra fija en celular */}
      <motion.div
        initial={{ y: 90 }} animate={{ y: 0 }} transition={{ delay: 3.6, duration: .7 }}
        className="md:hidden fixed bottom-0 left-0 right-0 z-[100] px-4 py-3 backdrop-blur-md border-t"
        style={{ backgroundColor: 'rgba(251,245,239,.95)', borderColor: 'rgba(192,149,78,.35)' }}
      >
        <Link href="/crear" className="block text-center etiqueta text-white py-4 rounded-full" style={{ backgroundColor: VINO }}>
          Crear mi invitación gratis
        </Link>
      </motion.div>
      <div className="md:hidden h-20" />
    </div>
  );
}
