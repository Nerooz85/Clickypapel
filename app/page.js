"use client";
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { PLANES, ORDEN_PLANES, formatearPesos } from '@/lib/precios';

/* ────────────────────────────────────────────────
   PALETA — blanco luminoso + CEREZA como color firma
   ──────────────────────────────────────────────── */
const NIEVE = '#FDFCFA';
const CREMA = '#F6F1E9';
const CEREZA = '#C41E3A';
const CEREZA_OSCURO = '#8F1229';
const TINTA = '#1A1418';
const ORO = '#C2A15C';
const ROSA = '#EBC9C5';
const GRIS = '#6B6169';

/* ⚠️ PARA CAMBIAR LAS FOTOS: edita solo este bloque.
   Cuando tengas fotos de bodas reales, sustitúyelas aquí. */
const FOTO = {
  hero: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1600',
  portada: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?q=80&w=1600',
  frase: 'https://images.unsplash.com/photo-1542042161784-26ab9e041e89?q=80&w=1600',
  momentoUno: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?q=80&w=1400',
  momentoDos: 'https://images.unsplash.com/photo-1542042161784-26ab9e041e89?q=80&w=1400',
  momentoTres: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=1400',
  papeleria: 'https://images.unsplash.com/photo-1607190074257-dd4b7af0309f?q=80&w=1200',
  boda: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=900',
  bodaDos: 'https://images.unsplash.com/photo-1542042161784-26ab9e041e89?q=80&w=900',
  xv: 'https://images.unsplash.com/photo-1549417229-aa67d3263c09?q=80&w=900',
  xvDos: 'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?q=80&w=900',
  baby: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=900',
  bautizo: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=900',
  despedida: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=900',
};

const FRASES_FIJAS = [
  { alta: 'Un año planeando.', baja: 'Un link para contarlo.' },
  { alta: 'Nadie olvida', baja: 'cómo se enteró.' },
  { alta: 'Que la espera', baja: 'también sea bonita.' },
];

const MOMENTOS = [
  { img: FOTO.momentoUno, frase: 'La primera vez que lo ves', linea: 'Antes de eso hay meses de espera. Que también sean bonitos.' },
  { img: FOTO.momentoDos, frase: 'Cuando por fin dicen sí', linea: 'Ese día ya lo tienes resuelto. Lo de antes, nosotros.' },
  { img: FOTO.momentoTres, frase: 'La canción que era de ustedes', linea: 'Suena desde el primer segundo que abren su invitación.' },
];

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

/* ═══════ Aparece al entrar en pantalla ═══════ */
function Reveal({ children, delay = 0, y = 34, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-70px' }}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >{children}</motion.div>
  );
}

/* ═══════ Foto que se mueve más lento que la página ═══════ */
function FotoParallax({ src, alt, className = '', fuerza = 90 }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'], layoutEffect: false });
  const y = useTransform(scrollYProgress, [0, 1], [-fuerza, fuerza]);
  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.img src={src} alt={alt} style={{ y, scale: 1.22 }} className="absolute inset-0 w-full h-full object-cover" />
    </div>
  );
}

/* ═══════ Una frase de la sección fijada ═══════ */
function CapaFrase({ progreso, indice, total, frase }) {
  const paso = 1 / total;
  const inicio = indice * paso;
  // Los cuatro puntos deben ir siempre de menor a mayor, o framer-motion truena.
  const a = Math.max(0, inicio - 0.05);
  const b = Math.min(1, a + 0.06);
  const d = Math.min(1, Math.max(b + 0.02, inicio + paso - 0.05));
  const e = Math.min(1, Math.max(d + 0.02, inicio + paso + 0.05));
  const opacity = useTransform(progreso, [a, b, d, e], [0, 1, 1, 0]);
  const y = useTransform(progreso, [a, e], [50, -50]);
  return (
    <motion.div style={{ opacity, y }} className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
      <span className="font-display font-light text-white leading-[1.05] text-4xl sm:text-6xl md:text-7xl">{frase.alta}</span>
      <span className="font-script leading-tight mt-3 text-5xl sm:text-6xl md:text-7xl" style={{ color: ROSA }}>{frase.baja}</span>
    </motion.div>
  );
}

/* ═══════ Sección de frases fijada al scroll ═══════ */
function FrasesFijas() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'], layoutEffect: false });
  const escala = useTransform(scrollYProgress, [0, 1], [1.18, 1.32]);
  return (
    <section ref={ref} className="relative" style={{ height: '280vh' }}>
      <div className="sticky top-0 h-screen overflow-hidden flex items-center justify-center">
        <motion.img src={FOTO.frase} alt="" aria-hidden="true" style={{ scale: escala }} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(26,20,24,.55), rgba(143,18,41,.7))' }} />
        {FRASES_FIJAS.map((f, i) => (
          <CapaFrase key={f.alta} progreso={scrollYProgress} indice={i} total={FRASES_FIJAS.length} frase={f} />
        ))}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 oro-linea w-24" />
      </div>
    </section>
  );
}

export default function Home() {
  const [portada, setPortada] = useState(true);
  const [abriendoPortada, setAbriendoPortada] = useState(false);
  const [fase, setFase] = useState('cerrado');
  const [sonando, setSonando] = useState(false);
  const [restante, setRestante] = useState(null);
  const [faq, setFaq] = useState(null);

  const audioRef = useRef(null);
  const heroRef = useRef(null);
  const fadeRef = useRef(null);
  const sinMovimiento = useReducedMotion();
  const VOLUMEN = 0.42;

  const { scrollYProgress } = useScroll();
  const { scrollYProgress: heroProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'], layoutEffect: false });
  const heroY = useTransform(heroProgress, [0, 1], [0, 110]);
  const heroOpacidad = useTransform(heroProgress, [0, 0.75], [1, 0]);
  const fotoHeroY = useTransform(heroProgress, [0, 1], [0, -70]);

  /* Si ya entró en esta sesión, no repetimos la portada. */
  useEffect(() => {
    try {
      if (sessionStorage.getItem('cp_entro') === '1') setPortada(false);
    } catch (_) {}
  }, []);

  useEffect(() => {
    const objetivo = new Date();
    objetivo.setDate(objetivo.getDate() + 128);
    const tick = () => {
      const d = objetivo - new Date();
      setRestante({
        d: Math.floor(d / 86400000), h: Math.floor((d / 3600000) % 24),
        m: Math.floor((d / 60000) % 60), s: Math.floor((d / 1000) % 60),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => () => clearInterval(fadeRef.current), []);

  /* La música no arranca: aparece. Sube de 0 al volumen final en ~1.5s. */
  const encenderMusica = () => {
    const a = audioRef.current;
    if (!a) return;
    a.muted = false;
    a.volume = 0;
    a.play().then(() => {
      setSonando(true);
      clearInterval(fadeRef.current);
      let v = 0;
      fadeRef.current = setInterval(() => {
        v = Math.min(VOLUMEN, v + 0.015);
        a.volume = v;
        if (v >= VOLUMEN) clearInterval(fadeRef.current);
      }, 45);
    }).catch(() => {});
  };

  const entrar = (conMusica) => {
    if (abriendoPortada) return;
    setAbriendoPortada(true);
    if (conMusica) encenderMusica();
    try { sessionStorage.setItem('cp_entro', '1'); } catch (_) {}
    setTimeout(() => setPortada(false), sinMovimiento ? 100 : 1900);
  };

  const abrirSobre = () => {
    if (fase !== 'cerrado') return;
    setFase('abriendo');
    if (!sonando) encenderMusica();
    setTimeout(() => setFase('abierto'), 900);
  };

  const alternarMusica = () => {
    const a = audioRef.current;
    if (!a) return;
    if (sonando) { a.pause(); setSonando(false); }
    else encenderMusica();
  };

  const petalos = [
    { l: '10%', d: 0, dur: 18, s: 6 }, { l: '26%', d: 5, dur: 22, s: 4 },
    { l: '44%', d: 9, dur: 20, s: 7 }, { l: '62%', d: 3, dur: 24, s: 5 },
    { l: '80%', d: 11, dur: 19, s: 6 }, { l: '92%', d: 7, dur: 23, s: 4 },
  ];

  return (
    <div style={{ backgroundColor: NIEVE, color: TINTA }} className="min-h-screen font-ui antialiased overflow-x-hidden">
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400&family=Great+Vibes&family=Jost:wght@300;400;500;600&display=swap');
        .font-display { font-family: 'Cormorant Garamond', Georgia, serif; }
        .font-script { font-family: 'Great Vibes', cursive; }
        .font-ui { font-family: 'Jost', system-ui, sans-serif; }
        .etiqueta { font-size: 10px; letter-spacing: .26em; text-transform: uppercase; font-weight: 600; }
        .oro-linea { height: 1px; background: linear-gradient(90deg, transparent, ${ORO}, transparent); }
        .tarjeta-foto img { transition: transform 1.2s cubic-bezier(.22,1,.36,1); }
        .tarjeta-foto:hover img { transform: scale(1.08); }
        .perspectiva { perspective: 1500px; }
        @keyframes kenburns { 0% { transform: scale(1) translate(0,0); } 100% { transform: scale(1.13) translate(-1.5%,-1.5%); } }
        .kenburns { animation: kenburns 28s ease-in-out infinite alternate; }
        a:focus-visible, button:focus-visible { outline: 2px solid ${CEREZA}; outline-offset: 3px; border-radius: 4px; }
        @media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation: none !important; transition-duration: .01ms !important; } }
      `}} />

      <audio ref={audioRef} src="/boda-music.mp3" loop preload="auto" />

      {/* ═══════════════════ PORTADA: el sobre que abre la película */}
      <AnimatePresence>
        {portada && (
          <motion.div
            className="fixed inset-0 z-[300] flex flex-col items-center justify-center overflow-hidden"
            style={{ backgroundColor: TINTA }}
            exit={{ opacity: 0 }} transition={{ duration: .8, delay: .9 }}
          >
            <motion.img
              src={FOTO.portada} alt="" aria-hidden="true"
              className="absolute inset-0 w-full h-full object-cover"
              initial={{ scale: 1.25, opacity: .3 }}
              animate={abriendoPortada ? { scale: 1.6, opacity: .1 } : { scale: 1.12, opacity: .32 }}
              transition={{ duration: abriendoPortada ? 1.9 : 6, ease: [0.22, 1, 0.36, 1] }}
            />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(26,20,24,.72), rgba(143,18,41,.55))' }} />

            <motion.div
              className="relative flex flex-col items-center gap-8 px-6 text-center"
              animate={abriendoPortada ? { scale: 1.35, opacity: 0, y: -40 } : {}}
              transition={{ duration: 1.5, ease: [0.65, 0, 0.35, 1] }}
            >
              <motion.span
                className="font-display text-3xl md:text-4xl text-white tracking-wide"
                initial={{ opacity: 0, letterSpacing: '.5em' }} animate={{ opacity: 1, letterSpacing: '.1em' }}
                transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
              >
                clicky<span style={{ color: ROSA }}>papel</span>
              </motion.span>

              {/* El sobre */}
              <motion.div
                className="relative w-[210px] h-[150px] perspectiva"
                initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.1, delay: .5 }}
              >
                <div className="absolute inset-0 rounded-sm" style={{ backgroundColor: CREMA, boxShadow: '0 30px 60px -20px rgba(0,0,0,.7)' }}>
                  <div className="absolute inset-2 border" style={{ borderColor: 'rgba(194,161,92,.45)' }} />
                </div>
                <motion.div
                  className="absolute inset-x-0 top-0 origin-top" style={{ height: 92, transformStyle: 'preserve-3d' }}
                  animate={{ rotateX: abriendoPortada ? -172 : 0 }}
                  transition={{ duration: 1, ease: [0.65, 0, 0.35, 1] }}
                >
                  <div className="absolute inset-0" style={{ backgroundColor: '#EFE8DC', clipPath: 'polygon(0 0, 100% 0, 50% 100%)' }} />
                </motion.div>
                <motion.div
                  className="absolute left-1/2 -translate-x-1/2 w-14 h-14 rounded-full flex items-center justify-center"
                  style={{ top: 62, backgroundColor: CEREZA, zIndex: 5, boxShadow: '0 8px 22px -6px rgba(196,30,58,.9)' }}
                  animate={abriendoPortada ? { opacity: 0, scale: .5 } : sinMovimiento ? {} : { scale: [1, 1.06, 1] }}
                  transition={abriendoPortada ? { duration: .4 } : { duration: 2.6, repeat: Infinity }}
                >
                  <span className="font-script text-2xl text-white">C</span>
                </motion.div>
              </motion.div>

              <motion.p
                className="font-display font-light text-white text-2xl md:text-3xl leading-snug max-w-sm"
                initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, delay: .9 }}
              >
                Hay cosas que no se mandan
                <span className="italic block" style={{ color: ROSA }}>por mensaje.</span>
              </motion.p>

              <motion.div
                className="flex flex-col items-center gap-4"
                initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 1.4 }}
              >
                <button
                  type="button" onClick={() => entrar(true)}
                  className="etiqueta text-white px-10 rounded-full transition-transform hover:scale-[1.06]"
                  style={{ backgroundColor: CEREZA, paddingTop: '1.15rem', paddingBottom: '1.15rem', boxShadow: '0 18px 44px -16px rgba(196,30,58,.9)' }}
                >
                  Empezar mi gran día
                </button>
                <button
                  type="button" onClick={() => entrar(false)}
                  className="etiqueta transition-opacity hover:opacity-100"
                  style={{ color: 'rgba(255,255,255,.5)', fontSize: 9 }}
                >
                  Entrar sin sonido
                </button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div className="fixed top-0 left-0 right-0 h-[3px] origin-left z-[120]" style={{ backgroundColor: CEREZA, scaleX: scrollYProgress }} />

      {/* ═══════════════════ NAV */}
      <nav className="sticky top-0 z-[110] border-b" style={{ backgroundColor: 'rgba(253,252,250,.92)', backdropFilter: 'blur(14px)', borderColor: 'rgba(26,20,24,.08)' }}>
        <div className="max-w-7xl mx-auto px-5 h-[76px] flex items-center justify-between">
          <Link href="/" className="font-display text-3xl tracking-wide" style={{ color: TINTA }}>
            clicky<span style={{ color: CEREZA }}>papel</span>
          </Link>
          <div className="hidden md:flex items-center gap-10 etiqueta" style={{ color: GRIS }}>
            {[['#momentos', 'Momentos'], ['#plantillas', 'Plantillas'], ['#como', 'Cómo funciona'], ['#precios', 'Precios']].map(([h, t]) => (
              <a key={h} href={h} className="relative group py-1">
                {t}
                <span className="absolute left-0 -bottom-0.5 h-[1.5px] w-0 group-hover:w-full transition-all duration-400" style={{ backgroundColor: CEREZA }} />
              </a>
            ))}
          </div>
          <div className="flex items-center gap-4">
            {sonando && (
              <button type="button" onClick={alternarMusica} aria-label="Pausar la música" className="hidden sm:flex items-end gap-[2.5px] h-4">
                {[0, 1, 2].map((b) => (
                  <motion.span key={b} animate={sinMovimiento ? {} : { scaleY: [0.3, 1, 0.3] }}
                    transition={{ duration: 1, repeat: Infinity, delay: b * .18 }}
                    className="w-[2.5px] h-full block rounded-full origin-bottom" style={{ backgroundColor: CEREZA }} />
                ))}
              </button>
            )}
            <Link href="/login" className="etiqueta hidden sm:block hover:opacity-60 transition-opacity" style={{ color: GRIS }}>Entrar</Link>
            <Link href="/crear" className="etiqueta text-white px-6 py-3 rounded-full transition-transform hover:scale-[1.05]" style={{ backgroundColor: CEREZA }}>
              Crear gratis
            </Link>
          </div>
        </div>
      </nav>

      {/* ═══════════════════ HERO */}
      <header ref={heroRef} className="relative grid lg:grid-cols-[1fr_1.05fr]" style={{ minHeight: 'calc(100svh - 76px)', backgroundColor: NIEVE }}>
        <motion.div style={{ y: heroY, opacity: heroOpacidad }} className="relative flex items-center px-5 sm:px-10 lg:pl-16 lg:pr-14 py-16 lg:py-0 order-2 lg:order-1">
          {!sinMovimiento && (
            <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
              {petalos.map((p, i) => (
                <motion.span key={i} className="absolute rounded-full"
                  style={{ left: p.l, width: p.s, height: p.s, backgroundColor: i % 2 ? CEREZA : ROSA, opacity: .28 }}
                  animate={{ top: ['-6%', '108%'], x: [0, 22, -16, 10, 0], rotate: [0, 360] }}
                  transition={{ duration: p.dur, delay: p.d, repeat: Infinity, ease: 'linear' }} />
              ))}
            </div>
          )}

          <div className="relative max-w-xl space-y-8 text-center lg:text-left mx-auto lg:mx-0">
            <Reveal y={16}>
              <span className="etiqueta inline-flex items-center gap-2.5 px-4 py-2 rounded-full border"
                style={{ borderColor: 'rgba(196,30,58,.3)', color: CEREZA, backgroundColor: 'rgba(196,30,58,.05)' }}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: CEREZA }} />
                Gratis hasta que la publiques
              </span>
            </Reveal>

            <Reveal delay={0.1}>
              <h1 className="leading-[.95]">
                <span className="font-script block text-5xl sm:text-6xl mb-3" style={{ color: CEREZA }}>Tu gran día</span>
                <span className="font-display font-light block text-4xl sm:text-5xl lg:text-[4.2rem]" style={{ color: TINTA }}>
                  Hay cosas que no se mandan
                </span>
                <span className="font-display font-light italic block text-4xl sm:text-5xl lg:text-[4.2rem]" style={{ color: CEREZA_OSCURO }}>
                  por mensaje.
                </span>
              </h1>
            </Reveal>

            <Reveal delay={0.2}>
              <p className="text-base md:text-lg font-light leading-relaxed max-w-md mx-auto lg:mx-0" style={{ color: GRIS }}>
                Una invitación que se abre como sobre, suena con su canción
                y confirma a los invitados sola. La armas hoy y decides después.
              </p>
            </Reveal>

            <Reveal delay={0.3}>
              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                <Link href="/crear" className="w-full sm:w-auto text-center etiqueta text-white px-10 rounded-full transition-all hover:scale-[1.05]"
                  style={{ backgroundColor: CEREZA, paddingTop: '1.15rem', paddingBottom: '1.15rem', boxShadow: '0 18px 40px -18px rgba(196,30,58,.65)' }}>
                  Crear mi invitación gratis
                </Link>
                <a href="#momentos" className="etiqueta pb-1 border-b transition-opacity hover:opacity-60" style={{ color: TINTA, borderColor: ORO }}>
                  Ver ejemplos
                </a>
              </div>
            </Reveal>

            <Reveal delay={0.4}>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 justify-center lg:justify-start etiqueta" style={{ fontSize: 9, color: '#A79FA6' }}>
                <span>Sin tarjeta</span><span>·</span><span>Un solo pago</span><span>·</span><span>Cambios ilimitados</span>
              </div>
            </Reveal>
          </div>
        </motion.div>

        <div className="relative overflow-hidden order-1 lg:order-2 min-h-[62svh] lg:min-h-0">
          <motion.img style={{ y: fotoHeroY }} src={FOTO.hero} alt="" aria-hidden="true" className="kenburns absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(100deg, rgba(253,252,250,.95) 0%, rgba(253,252,250,.25) 22%, transparent 48%)' }} />
          <div className="absolute inset-0 lg:hidden" style={{ background: 'linear-gradient(180deg, transparent 45%, rgba(253,252,250,.9) 100%)' }} />

          <motion.div initial={{ opacity: 0, scale: .9, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1.3, delay: .4, ease: [0.22, 1, 0.36, 1] }}
            className="relative h-full flex flex-col items-center justify-center gap-6 py-14">

            <div className="relative w-[270px] sm:w-[300px] h-[430px] sm:h-[460px] perspectiva">
              <motion.div className="absolute left-0 right-0 rounded-sm overflow-hidden"
                style={{ top: 130, height: 295, zIndex: 2, backgroundColor: NIEVE, boxShadow: '0 35px 70px -25px rgba(26,20,24,.55)' }}
                animate={fase === 'cerrado' ? { y: 0, opacity: 0 } : { y: -120, opacity: 1 }}
                transition={{ duration: 1.1, delay: fase === 'abriendo' ? .55 : 0, ease: [0.22, 1, 0.36, 1] }}>
                <img src={FOTO.papeleria} alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover opacity-[.1]" />
                <div className="absolute inset-3 border pointer-events-none" style={{ borderColor: 'rgba(194,161,92,.5)' }} />
                <div className="relative h-full flex flex-col items-center justify-center text-center px-6">
                  <span className="etiqueta" style={{ color: CEREZA }}>Nos casamos</span>
                  <p className="font-display text-4xl font-light leading-tight mt-2" style={{ color: TINTA }}>
                    Brisa<span className="font-script text-2xl block my-0.5" style={{ color: CEREZA }}>y</span>Bruno
                  </p>
                  <div className="oro-linea w-20 my-4" />
                  {restante && (
                    <div className="flex gap-3.5 justify-center">
                      {[['días', restante.d], ['hrs', restante.h], ['min', restante.m], ['seg', restante.s]].map(([k, v]) => (
                        <div key={k} className="flex flex-col items-center">
                          <span className="font-display text-xl" style={{ color: CEREZA_OSCURO }}>{String(v).padStart(2, '0')}</span>
                          <span className="etiqueta" style={{ color: '#A79FA6', fontSize: 8 }}>{k}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>

              <div className="absolute left-0 right-0 rounded-sm" style={{ top: 130, height: 295, zIndex: 3, backgroundColor: CREMA, boxShadow: '0 35px 70px -25px rgba(26,20,24,.6)' }}>
                <div className="absolute inset-x-0 top-0" style={{ height: 148, backgroundColor: '#EFE8DC', clipPath: 'polygon(0 0, 50% 62%, 100% 0)' }} />
                <div className="absolute inset-3 border pointer-events-none" style={{ borderColor: 'rgba(194,161,92,.4)' }} />
              </div>

              <motion.div className="absolute left-0 right-0 origin-top"
                style={{ top: 130, height: 162, zIndex: fase === 'cerrado' ? 5 : 1, transformStyle: 'preserve-3d' }}
                animate={{ rotateX: fase === 'cerrado' ? 0 : -168 }}
                transition={{ duration: .9, ease: [0.65, 0, 0.35, 1] }}>
                <div className="absolute inset-0" style={{ backgroundColor: '#EAE2D4', clipPath: 'polygon(0 0, 100% 0, 50% 100%)' }} />
              </motion.div>

              <AnimatePresence>
                {fase === 'cerrado' && (
                  <motion.button type="button" onClick={abrirSobre} aria-label="Abrir el sobre de ejemplo"
                    className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 cursor-pointer"
                    style={{ top: 228, zIndex: 6 }} exit={{ opacity: 0, scale: .6 }} transition={{ duration: .4 }}>
                    <span className="relative w-24 h-24 flex items-center justify-center">
                      {!sinMovimiento && (
                        <motion.span
                          className="absolute inset-0 rounded-full pointer-events-none"
                          style={{ border: `2px solid ${CEREZA}` }}
                          animate={{ scale: [1, 1.55], opacity: [0.55, 0] }}
                          transition={{ duration: 2.6, repeat: Infinity, ease: 'easeOut' }}
                          aria-hidden="true"
                        />
                      )}
                      <motion.span
                        className="relative w-24 h-24 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: CEREZA, boxShadow: '0 12px 34px -8px rgba(196,30,58,.85)' }}
                        animate={sinMovimiento ? {} : { scale: [1, 1.07, 1] }}
                        transition={{ duration: 2.6, repeat: Infinity }}
                      >
                        <span className="font-script text-4xl text-white">C</span>
                      </motion.span>
                    </span>
                    <span className="etiqueta px-3 py-1.5 rounded-full" style={{ color: TINTA, backgroundColor: 'rgba(253,252,250,.85)' }}>Toca el sello</span>
                  </motion.button>
                )}
              </AnimatePresence>
            </div>

            <AnimatePresence>
              {fase === 'abierto' && (
                <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .4 }}
                  className="flex items-center gap-5 px-4 py-2 rounded-full" style={{ backgroundColor: 'rgba(253,252,250,.9)' }}>
                  <button type="button" onClick={alternarMusica} className="etiqueta flex items-center gap-2 hover:opacity-60 transition-opacity" style={{ color: TINTA }}>
                    <span className="flex gap-[2px] items-end h-3 w-4" aria-hidden="true">
                      {[0, 1, 2, 3].map((b) => (
                        <motion.span key={b} animate={sonando && !sinMovimiento ? { scaleY: [0.25, 1, 0.25] } : { scaleY: 0.3 }}
                          transition={{ duration: .7, repeat: Infinity, delay: b * .14 }}
                          className="w-[2px] h-full block rounded-full origin-bottom" style={{ backgroundColor: CEREZA }} />
                      ))}
                    </span>
                    {sonando ? 'Pausar' : 'Reanudar'}
                  </button>
                  <Link href="/bruno-y-brisa" className="etiqueta hover:opacity-60 transition-opacity" style={{ color: CEREZA }}>Ver completa →</Link>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </header>

      {/* ═══════════════════ FRASES FIJADAS AL SCROLL */}
      <FrasesFijas />

      {/* ═══════════════════ TIRA CEREZA */}
      <section style={{ backgroundColor: CEREZA }} className="py-8">
        <div className="max-w-6xl mx-auto px-5 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[['5', 'tipos de celebración'], ['1', 'solo pago, sin mensualidades'], ['∞', 'cambios después de publicar'], ['0', 'apps que instalar']].map(([n, t], i) => (
            <Reveal key={t} delay={i * 0.1} y={18}>
              <span className="font-display text-4xl block text-white">{n}</span>
              <span className="etiqueta" style={{ fontSize: 9, color: 'rgba(255,255,255,.72)' }}>{t}</span>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ═══════════════════ MOMENTOS con parallax */}
      <section id="momentos" className="py-24 md:py-32">
        <div className="max-w-6xl mx-auto px-5">
          <Reveal className="text-center space-y-3 mb-20">
            <span className="etiqueta block" style={{ color: CEREZA }}>Momentos</span>
            <h2 className="font-display text-4xl md:text-6xl font-light leading-tight">
              El día llega una vez.<br />
              <span className="italic" style={{ color: CEREZA_OSCURO }}>La espera dura meses.</span>
            </h2>
          </Reveal>

          <div className="space-y-24 md:space-y-32">
            {MOMENTOS.map((m, i) => (
              <div key={m.frase} className={`grid md:grid-cols-2 gap-10 md:gap-16 items-center ${i % 2 ? 'md:[direction:rtl]' : ''}`}>
                <div className="md:[direction:ltr]">
                  <FotoParallax src={m.img} alt={m.frase} className="aspect-[4/5] md:aspect-[3/4] rounded-sm" fuerza={70} />
                </div>
                <Reveal delay={0.12} className="md:[direction:ltr] space-y-5 text-center md:text-left">
                  <span className="font-display text-6xl md:text-7xl font-light block leading-none" style={{ color: 'rgba(196,30,58,.16)' }}>0{i + 1}</span>
                  <h3 className="font-script text-4xl md:text-5xl" style={{ color: CEREZA }}>{m.frase}</h3>
                  <div className="oro-linea w-24 mx-auto md:mx-0" />
                  <p className="font-display text-2xl md:text-3xl font-light leading-snug" style={{ color: TINTA }}>{m.linea}</p>
                </Reveal>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ ASÍ SE VE */}
      <section className="py-24 md:py-32" style={{ backgroundColor: CREMA }}>
        <div className="max-w-6xl mx-auto px-5 grid lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1 space-y-8">
            <Reveal className="space-y-3">
              <span className="etiqueta block" style={{ color: CEREZA }}>Así lo viven tus invitados</span>
              <h2 className="font-display text-4xl md:text-5xl font-light leading-tight">Se abre, suena<br />y confirma sola.</h2>
            </Reveal>
            {[
              { t: 'Tocan el sello y se abre', d: 'La animación arranca y la música empieza a sonar. Nadie olvida esa entrada.' },
              { t: 'Buscan su nombre', d: 'Ven cuántos lugares les tocan y confirman ahí mismo, sin formularios eternos.' },
              { t: 'Llegan sin llamarte', d: 'Mapa directo, horarios, código de vestimenta y mesa de regalos en el mismo link.' },
            ].map((f, i) => (
              <Reveal key={f.t} delay={0.12 * (i + 1)} className="flex gap-5">
                <span className="font-display text-2xl shrink-0 w-10 h-10 rounded-full flex items-center justify-center border" style={{ color: CEREZA, borderColor: 'rgba(196,30,58,.35)' }}>{i + 1}</span>
                <div className="space-y-1">
                  <h3 className="font-display text-xl">{f.t}</h3>
                  <p className="text-sm font-light leading-relaxed" style={{ color: GRIS }}>{f.d}</p>
                </div>
              </Reveal>
            ))}
            <Reveal delay={0.5}>
              <Link href="/bruno-y-brisa" className="inline-block etiqueta pb-1 border-b transition-opacity hover:opacity-60" style={{ color: CEREZA, borderColor: CEREZA }}>
                Abrir un ejemplo real →
              </Link>
            </Reveal>
          </div>

          <Reveal y={50} className="order-1 lg:order-2 flex justify-center">
            <motion.div animate={sinMovimiento ? {} : { y: [0, -14, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
              className="relative w-[280px] h-[570px] rounded-[2.75rem] p-3"
              style={{ backgroundColor: TINTA, boxShadow: '0 45px 90px -30px rgba(26,20,24,.5)' }}>
              <div className="absolute top-3 left-1/2 -translate-x-1/2 w-24 h-5 rounded-b-2xl z-20" style={{ backgroundColor: TINTA }} />
              <div className="w-full h-full rounded-[2.25rem] overflow-hidden relative" style={{ backgroundColor: NIEVE }}>
                <img src={FOTO.bodaDos} alt="Invitación digital vista en un celular" className="kenburns absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(26,20,24,.1) 0%, rgba(26,20,24,.6) 60%, rgba(143,18,41,.92) 100%)' }} />
                <div className="absolute inset-x-0 bottom-0 p-6 text-center text-white space-y-4">
                  <span className="etiqueta block" style={{ color: ROSA }}>19 · Diciembre · 2026</span>
                  <p className="font-script text-4xl">Brisa y Bruno</p>
                  <div className="oro-linea w-16 mx-auto" />
                  {restante && (
                    <div className="flex justify-center gap-4">
                      {[['d', restante.d], ['h', restante.h], ['m', restante.m]].map(([k, v]) => (
                        <div key={k}>
                          <span className="font-display text-xl block">{String(v).padStart(2, '0')}</span>
                          <span className="etiqueta" style={{ fontSize: 8, color: 'rgba(255,255,255,.5)' }}>{k}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="rounded-xl py-3 etiqueta" style={{ backgroundColor: NIEVE, color: CEREZA }}>Confirmar asistencia</div>
                </div>
              </div>
            </motion.div>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════ PLANTILLAS */}
      <section id="plantillas" className="py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-5">
          <Reveal className="text-center space-y-3 mb-14">
            <span className="etiqueta block" style={{ color: CEREZA }}>Elige tu favorita</span>
            <h2 className="font-display text-4xl md:text-5xl font-light">Diseños para cada estilo</h2>
            <p className="text-sm font-light max-w-md mx-auto" style={{ color: GRIS }}>Todas se adaptan a tus colores, tu tipografía y tus fotos.</p>
          </Reveal>

          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {PLANTILLAS.map((p, i) => (
              <Reveal key={p.n} delay={(i % 3) * 0.12} y={45}>
                <Link href="/crear" className="tarjeta-foto group relative aspect-[3/4] overflow-hidden rounded-sm block">
                  <img src={p.img} alt={p.n} className="w-full h-full object-cover" />
                  <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent 42%, rgba(26,20,24,.82) 100%)' }} />
                  <div className="absolute inset-x-0 bottom-0 p-4 md:p-5 text-white transition-transform duration-500 group-hover:-translate-y-1">
                    <span className="etiqueta block mb-1" style={{ color: ROSA, fontSize: 9 }}>{p.e}</span>
                    <h3 className="font-display text-xl md:text-2xl font-light">{p.n}</h3>
                  </div>
                  <div className="absolute inset-2 border-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ borderColor: CEREZA }} />
                </Link>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.2} className="text-center mt-12">
            <Link href="/crear" className="inline-block etiqueta text-white px-10 py-4 rounded-full transition-transform hover:scale-[1.05]" style={{ backgroundColor: CEREZA }}>
              Probar una gratis
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════ CELEBRACIONES */}
      <section className="py-24 md:py-32" style={{ backgroundColor: CREMA }}>
        <div className="max-w-7xl mx-auto px-5">
          <Reveal className="text-center space-y-3 mb-14">
            <span className="etiqueta block" style={{ color: CEREZA }}>Para toda ocasión</span>
            <h2 className="font-display text-4xl md:text-5xl font-light">Cada fiesta pide lo suyo</h2>
          </Reveal>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
            {CELEBRACIONES.map((c, i) => (
              <Reveal key={c.id} delay={i * 0.09} y={40}>
                <Link href={`/crear?evento=${c.id}`} className="tarjeta-foto group relative aspect-[4/5] overflow-hidden rounded-sm block">
                  <img src={c.img} alt={c.n} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 transition-all duration-500 group-hover:opacity-80" style={{ backgroundColor: 'rgba(143,18,41,.55)' }} />
                  <div className="absolute inset-0 flex items-center justify-center p-3">
                    <h3 className="font-display text-xl md:text-2xl text-white text-center font-light leading-tight">{c.n}</h3>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ CÓMO FUNCIONA */}
      <section id="como" className="py-24 md:py-32">
        <div className="max-w-6xl mx-auto px-5">
          <Reveal className="text-center space-y-3 mb-16">
            <span className="etiqueta block" style={{ color: CEREZA }}>Es más fácil de lo que crees</span>
            <h2 className="font-display text-4xl md:text-5xl font-light">Tres pasos y ya la estás viendo</h2>
          </Reveal>
          <ol className="grid md:grid-cols-3 gap-12 md:gap-10">
            {PASOS.map((p, i) => (
              <Reveal key={p.n} delay={i * 0.16} y={40}>
                <li className="text-center space-y-4">
                  <span className="font-display text-7xl font-light block leading-none" style={{ color: 'rgba(196,30,58,.2)' }}>{p.n}</span>
                  <h3 className="font-display text-2xl font-light">{p.t}</h3>
                  <p className="text-sm font-light leading-relaxed max-w-xs mx-auto" style={{ color: GRIS }}>{p.d}</p>
                </li>
              </Reveal>
            ))}
          </ol>
          <Reveal delay={0.3} className="text-center mt-16">
            <Link href="/crear" className="inline-block etiqueta text-white px-10 py-4 rounded-full transition-transform hover:scale-[1.05]" style={{ backgroundColor: CEREZA }}>
              Empezar ahora
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════════ RESEÑAS
          ⚠️ REEMPLAZA CON RESEÑAS REALES ANTES DE PUBLICAR. */}
      <section className="py-24 md:py-32" style={{ backgroundColor: CREMA }}>
        <div className="max-w-6xl mx-auto px-5">
          <Reveal className="text-center space-y-3 mb-14">
            <span className="etiqueta block" style={{ color: CEREZA }}>Lo que dicen</span>
            <h2 className="font-display text-4xl md:text-5xl font-light">Novias que ya la usaron</h2>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Reveal key={i} delay={i * 0.13} y={40}>
                <figure className="rounded-sm p-8 space-y-5 h-full" style={{ backgroundColor: NIEVE, border: '1px solid rgba(196,30,58,.16)' }}>
                  <span className="font-script text-5xl block leading-none" style={{ color: CEREZA }}>&ldquo;</span>
                  <blockquote className="text-sm font-light leading-relaxed" style={{ color: GRIS }}>
                    [Pega aquí la reseña real de tu cliente. Si todavía no tienes, borra esta sección
                    y ponla cuando llegue la primera.]
                  </blockquote>
                  <figcaption className="etiqueta" style={{ color: CEREZA, fontSize: 9 }}>[Nombre] · [Ciudad]</figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ PRECIOS */}
      <section id="precios" className="py-24 md:py-32">
        <div className="max-w-6xl mx-auto px-5">
          <Reveal className="text-center space-y-3 mb-14">
            <span className="etiqueta block" style={{ color: CEREZA }}>Nuestros planes</span>
            <h2 className="font-display text-4xl md:text-5xl font-light">Un solo pago, sin mensualidades</h2>
            <p className="text-sm font-light max-w-md mx-auto" style={{ color: GRIS }}>Arma tu invitación completa gratis. Pagas cuando decidas compartirla.</p>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-6 items-stretch">
            {ORDEN_PLANES.map((id, i) => {
              const p = PLANES[id];
              const top = !!p.destacado;
              return (
                <Reveal key={id} delay={i * 0.14} y={45}>
                  <div className="relative rounded-sm p-8 flex flex-col justify-between border-2 h-full transition-transform duration-500 hover:-translate-y-2"
                    style={{
                      backgroundColor: top ? CEREZA : NIEVE,
                      borderColor: top ? CEREZA : 'rgba(26,20,24,.1)',
                      color: top ? '#fff' : TINTA,
                      boxShadow: top ? '0 35px 70px -28px rgba(196,30,58,.55)' : 'none',
                    }}>
                    {top && (
                      <span className="etiqueta absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full whitespace-nowrap" style={{ backgroundColor: TINTA, color: '#fff' }}>
                        El más elegido
                      </span>
                    )}
                    <div className="space-y-5">
                      <h3 className="font-display text-3xl font-light">{p.nombre}</h3>
                      <div>
                        <span className="text-xs line-through" style={{ color: top ? 'rgba(255,255,255,.55)' : '#A79FA6' }}>{formatearPesos(p.precioAntes)}</span>
                        <div className="font-display text-5xl font-light leading-none mt-1">
                          {formatearPesos(p.precio)}
                          <span className="etiqueta ml-2" style={{ color: top ? 'rgba(255,255,255,.6)' : '#A79FA6' }}>mxn</span>
                        </div>
                      </div>
                      <p className="text-sm font-light leading-relaxed" style={{ color: top ? 'rgba(255,255,255,.8)' : GRIS }}>{p.resumen}</p>
                      <div className="oro-linea w-full" />
                      <ul className="space-y-2.5">
                        {p.incluye.map((f) => (
                          <li key={f} className="flex gap-3 text-sm font-light leading-snug">
                            <span style={{ color: top ? ROSA : CEREZA }}>✓</span>
                            <span style={{ color: top ? 'rgba(255,255,255,.9)' : '#4A434A' }}>{f}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <Link href={`/crear?plan=${id}`} className="etiqueta text-center mt-9 py-4 rounded-full transition-transform hover:scale-[1.04]"
                      style={{ backgroundColor: top ? NIEVE : CEREZA, color: top ? CEREZA : '#fff' }}>
                      Empezar gratis
                    </Link>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════ PREGUNTAS */}
      <section className="max-w-3xl mx-auto px-5 py-24 md:py-32">
        <Reveal className="text-center space-y-3 mb-12">
          <span className="etiqueta block" style={{ color: CEREZA }}>Dudas frecuentes</span>
          <h2 className="font-display text-4xl md:text-5xl font-light">Lo que más nos preguntan</h2>
        </Reveal>
        <div className="divide-y" style={{ borderColor: 'rgba(26,20,24,.1)' }}>
          {PREGUNTAS.map((p, i) => (
            <Reveal key={p.q} delay={i * 0.07} y={20}>
              <div style={{ borderColor: 'rgba(26,20,24,.1)' }}>
                <button type="button" onClick={() => setFaq(faq === i ? null : i)} aria-expanded={faq === i}
                  className="w-full flex items-center justify-between gap-6 py-5 text-left cursor-pointer">
                  <span className="font-display text-xl md:text-2xl font-light">{p.q}</span>
                  <span className="text-2xl font-light shrink-0 transition-transform duration-300"
                    style={{ color: CEREZA, transform: faq === i ? 'rotate(45deg)' : 'none' }} aria-hidden="true">+</span>
                </button>
                <AnimatePresence initial={false}>
                  {faq === i && (
                    <motion.p initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: .3 }} className="overflow-hidden text-sm font-light leading-relaxed pb-6 pr-10" style={{ color: GRIS }}>
                      {p.a}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ═══════════════════ CIERRE */}
      <section className="relative py-28 md:py-36 text-center px-5 overflow-hidden" style={{ backgroundColor: CEREZA }}>
        <img src={FOTO.momentoUno} alt="" aria-hidden="true" className="kenburns absolute inset-0 w-full h-full object-cover opacity-[.16]" />
        <Reveal className="relative max-w-xl mx-auto space-y-7">
          <div className="oro-linea w-24 mx-auto" />
          <span className="font-script text-5xl block text-white">Ábrela tú primero</span>
          <h2 className="font-display text-4xl md:text-5xl font-light leading-tight" style={{ color: 'rgba(255,255,255,.92)' }}>Decides después de verla.</h2>
          <p className="text-sm font-light" style={{ color: 'rgba(255,255,255,.7)' }}>No pedimos tarjeta. Solo pagas si te enamora.</p>
          <Link href="/crear" className="inline-block etiqueta px-12 rounded-full transition-transform hover:scale-[1.05]"
            style={{ backgroundColor: NIEVE, color: CEREZA, paddingTop: '1.15rem', paddingBottom: '1.15rem' }}>
            Crear mi invitación gratis
          </Link>
        </Reveal>
      </section>

      {/* ═══════════════════ PIE */}
      <footer style={{ backgroundColor: TINTA, color: 'rgba(255,255,255,.55)' }} className="py-16">
        <div className="max-w-6xl mx-auto px-5 grid sm:grid-cols-2 gap-10">
          <div className="space-y-3">
            <span className="font-display text-3xl text-white">clicky<span style={{ color: ROSA }}>papel</span></span>
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

      <motion.div initial={{ y: 90 }} animate={{ y: 0 }} transition={{ delay: 1.2, duration: .7 }}
        className="md:hidden fixed bottom-0 left-0 right-0 z-[100] px-4 py-3 backdrop-blur-md border-t"
        style={{ backgroundColor: 'rgba(253,252,250,.96)', borderColor: 'rgba(26,20,24,.1)' }}>
        <Link href="/crear" className="block text-center etiqueta text-white py-4 rounded-full" style={{ backgroundColor: CEREZA }}>
          Crear mi invitación gratis
        </Link>
      </motion.div>
      <div className="md:hidden h-20" />
    </div>
  );
}
