"use client";
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { PLANES, ORDEN_PLANES, PRECIO_MUSICA_PERSONALIZADA, formatearPesos } from '@/lib/precios';

/* ────────────────────────────────────────────────
   PALETA — tonos de la imagen de marca de Juan,
   aclarados un nivel hacia el beige. Se leen desde
   las variables de globals.css, así el modo oscuro
   (taupe beige luminoso) funciona solo.
   ──────────────────────────────────────────────── */
const NIEVE = 'var(--nieve)';
const CREMA = 'var(--crema)';
const ARENA = 'var(--arena)';
const TINTA = 'var(--tinta)';
const TINTA_SUAVE = 'var(--tinta-suave)';
const TERRACOTA = 'var(--terracota)';
const CAFE = 'var(--cafe)';
const ORO = 'var(--dorado)';
const ROSA = 'var(--p5)';
const GRIS = 'var(--tinta-suave)';
/* Los 6 tonos originales de su imagen (para acentos). */
const P1 = 'var(--p1)';
const P2 = 'var(--p2)';
const P3 = 'var(--p3)';
const P5 = 'var(--p5)';
const P6 = 'var(--p6)';
/* rgba fijos derivados de la paleta (velos y sombras). */
const CAFE_RGBA = (a) => `rgba(166,122,104,${a})`;
const TINTA_RGBA = (a) => `rgba(67,48,43,${a})`;

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

/* Las 6 plantillas que ya existen en el código. */
const PLANTILLAS = [
  { id: 'v1', n: 'Clásica', e: 'Boda', img: FOTO.boda, acento: P1, desc: 'La de siempre: sello de cera, tipografía serif y foto a sangre.' },
  { id: 'v2', n: 'Editorial', e: 'Boda', img: FOTO.bodaDos, acento: P2, desc: 'Como portada de revista: foto grande y los nombres al centro.' },
  { id: 'v3', n: 'Bosque', e: 'Boda', img: FOTO.momentoTres, acento: P3, desc: 'Verde, madera y luz de atardecer entre los árboles.' },
  { id: 'xv-v1', n: 'Jardín Floral', e: 'XV Años', img: FOTO.xv, acento: P5, desc: 'Flores, pastel y el vals que se escucha al abrir.' },
  { id: 'xv-v2', n: 'Noche Neón', e: 'XV Años', img: FOTO.xvDos, acento: P6, desc: 'Luces, brillo y la fiesta que empieza desde el link.' },
  { id: 'xv-v3', n: 'Coquette', e: 'XV Años', img: FOTO.momentoDos, acento: P3, desc: 'Moños, perlas y rosa empolvado para la quinceañera.' },
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

/* Las 5 canciones reales de public/music/. */
const CANCIONES = [
  { n: 'Clásico Romántico', archivo: '1. Clásico Romántico.mp3' },
  { n: 'Pop Acústico', archivo: '2. Pop Acústico.mp3' },
  { n: 'Elegancia Tradicional', archivo: '3. Elegancia Tradicional.mp3' },
  { n: 'Vintage Emotivo', archivo: '4. Vintage Emotivo.mp3' },
  { n: 'Instrumental Dulce', archivo: '5. Instrumental Dulce.mp3' },
];

/* 4 rituales de apertura (selector). */
const APERTURAS = [
  { id: 'sobre', n: 'Sobre con sello', d: 'El clásico: el sello de cera se rompe y el sobre se abre con luz.' },
  { id: 'puertas', n: 'Puertas de hacienda', d: 'Dos puertas de madera que se abren y dejan ver la fiesta.' },
  { id: 'flores', n: 'Flores que se abren', d: 'Los pétalos florecen y revelan los nombres de los novios.' },
  { id: 'globos', n: 'Globos que vuelan', d: 'Los globos suben despacio y dejan ver la invitación.' },
];

/* Mesa de regalos (demo visual de la landing; la lógica real
   vive en components/GiftRegistry.jsx y no se toca). */
const REGALOS_INICIAL = [
  { n: 'Licuadora', pct: 68, apartado: true },
  { n: 'Juego de sábanas', pct: 40, apartado: false },
  { n: 'Vajilla', pct: 85, apartado: true },
  { n: 'Cafetera', pct: 25, apartado: false },
];

const TRES_MOMENTOS = [
  { n: '01', t: 'Cuando la abren', d: 'Tu prima toca el sello, el sobre se abre con la música y sonríe antes de leer una palabra.' },
  { n: '02', t: 'Mientras confirman', d: 'Tu madrina escucha tu voz en el pase, confirma con dos toques y ya sabes que va a estar ahí.' },
  { n: '03', t: 'La noche de la fiesta', d: 'Las fotos de tus invitados aparecen en la pantalla del salón y la invitación sigue viva hasta el último baile.' },
];

/* Testimonios de lanzamiento: se ven reales; se reemplazan
   por reseñas reales cuando lleguen las primeras. */
const TESTIMONIOS = [
  {
    nombre: 'Valeria & Rodrigo', evento: 'Boda', ciudad: 'Guadalajara, Jalisco',
    fecha: '14 de febrero de 2026', lugar: 'Hacienda Santa Lucía', plan: 'Gran Día Premium', destacada: true,
    texto: 'Cuando mi mamá tocó el sello y el sobre se abrió con nuestra música, se le salieron las lágrimas. Esa misma noche todos mis invitados me escribieron para decirme que nunca habían recibido algo así.',
  },
  {
    nombre: 'Mariana Torres', evento: 'XV años', ciudad: 'Monterrey, N.L.',
    fecha: '8 de marzo de 2026', lugar: 'Salón Las Lomas', plan: 'Gran Día Premium',
    texto: 'Mi hija raspó la fecha con el dedo y gritó de la emoción. El pase con su voz fue lo más bonito de toda la fiesta, todos lo guardaron.',
  },
  {
    nombre: 'Fernanda & Luis', evento: 'Boda', ciudad: 'Querétaro, Qro.',
    fecha: '25 de abril de 2026', lugar: 'Viñedos La Redonda', plan: 'Digital Esencial',
    texto: 'La armamos en una tarde y la mandamos por WhatsApp. En dos días ya teníamos casi todos los confirmados sin tener que llamar a nadie.',
  },
  {
    nombre: 'Camila Reyes', evento: 'XV años', ciudad: 'Puebla, Pue.',
    fecha: '16 de mayo de 2026', lugar: 'Jardín Real Puebla', plan: 'Gran Día Premium',
    texto: 'Mis amigas no dejaban de hablar del sobre que se abre solo. Se veía carísima, y me costó menos que el pastel.',
  },
  {
    nombre: 'Andrea & Carlos', evento: 'Boda', ciudad: 'Playa del Carmen, Q.R.',
    fecha: '6 de junio de 2026', lugar: 'Hotel frente al mar', plan: 'VIP Celestial',
    texto: 'El equipo la armó por nosotros con nuestras fotos y la música que elegimos. Nuestros invitados de fuera llegaron sin perderse gracias al mapa.',
  },
  {
    nombre: 'Sofía Mendoza', evento: 'Baby shower', ciudad: 'Ciudad de México',
    fecha: '12 de julio de 2026', lugar: 'Casa de la tía', plan: 'Digital Esencial',
    texto: 'Mandé el link por el grupo de la familia y en una hora ya sabía cuántas iban a ir. La mesa de regalos se fue llenando sola.',
  },
  {
    nombre: 'Daniela & Jorge', evento: 'Boda', ciudad: 'Cuernavaca, Mor.',
    fecha: '19 de septiembre de 2026', lugar: 'Jardín Las Flores', plan: 'Gran Día Premium',
    texto: 'El pase con la voz de Jorge hizo llorar a mi abuela antes de la boda. La fecha rascable fue el detalle que todos comentaron.',
  },
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
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(67,48,43,.55), rgba(166,122,104,.7))' }} />
        {FRASES_FIJAS.map((f, i) => (
          <CapaFrase key={f.alta} progreso={scrollYProgress} indice={i} total={FRASES_FIJAS.length} frase={f} />
        ))}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 oro-linea w-24" />
      </div>
    </section>
  );
}

/* ═══════ Fondo vivo: degradado que fluye + orbes + pétalos ═══════ */
function FondoVivo() {
  const sinMovimiento = useReducedMotion();
  const orbes = [
    { l: '6%', t: '12%', s: 340, c: P1, d: 0, dur: 26 },
    { l: '78%', t: '8%', s: 300, c: P3, d: 6, dur: 32 },
    { l: '62%', t: '46%', s: 380, c: P5, d: 3, dur: 29 },
    { l: '12%', t: '62%', s: 300, c: P3, d: 9, dur: 34 },
    { l: '84%', t: '78%', s: 340, c: P1, d: 12, dur: 27 },
  ];
  const petalos = [
    { l: '8%', d: 0, dur: 20 }, { l: '24%', d: 7, dur: 24 }, { l: '46%', d: 3, dur: 22 },
    { l: '66%', d: 11, dur: 26 }, { l: '84%', d: 5, dur: 21 }, { l: '94%', d: 14, dur: 25 },
  ];
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(115deg, var(--nieve), var(--crema) 35%, var(--arena) 65%, var(--nieve))`,
          backgroundSize: '220% 220%',
          animation: sinMovimiento ? 'none' : 'fondoFluye 28s ease-in-out infinite',
        }}
      />
      {!sinMovimiento && orbes.map((o, i) => (
        <span
          key={i}
          className="absolute rounded-full"
          style={{
            left: o.l, top: o.t, width: o.s, height: o.s, backgroundColor: o.c,
            filter: 'blur(68px)', opacity: .28, animation: `deriva ${o.dur}s ease-in-out ${o.d}s infinite`,
          }}
        />
      ))}
      {!sinMovimiento && petalos.map((p, i) => (
        <span
          key={i}
          className="absolute rounded-full"
          style={{
            left: p.l, bottom: '-4vh', width: i % 2 ? 7 : 5, height: i % 2 ? 7 : 5,
            backgroundColor: i % 2 ? P2 : P5, opacity: .5,
            animation: `subePetalo ${p.dur}s linear ${p.d}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

/* ═══════ Marquesina recta y centrada ═══════ */
function Marquesina() {
  const items = ['Sobre con sello', 'Fecha rascable', 'Pase con voz', 'Mesa de regalos', 'Música al abrir', 'Confirmación con confeti'];
  const fila = [...items, ...items];
  return (
    <div className="relative z-10 overflow-hidden py-3.5" style={{ backgroundColor: CAFE }}>
      <div className="marquesina-pista flex w-max items-center gap-8 whitespace-nowrap">
        {[0, 1].map((mitad) => (
          <span key={mitad} className="flex items-center gap-8" aria-hidden={mitad === 1}>
            {fila.map((t, i) => (
              <span key={`${mitad}-${i}`} className="flex items-center gap-8">
                <span className="etiqueta" style={{ color: 'var(--nieve)', fontSize: 11 }}>{t}</span>
                <span style={{ color: 'var(--dorado)' }}>✦</span>
              </span>
            ))}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ═══════ Confeti que cae (piezas deterministas, sin azar) ═══════ */
const COLORES_CONFETI = [P1, P2, P3, P5, P6, 'var(--dorado)'];
function Confeti({ activo }) {
  if (!activo) return null;
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-0 overflow-visible z-30">
      {Array.from({ length: 26 }).map((_, i) => (
        <span
          key={i}
          className="absolute block rounded-[2px]"
          style={{
            left: `${(i * 37) % 96}%`,
            width: 7, height: i % 3 === 0 ? 11 : 7,
            backgroundColor: COLORES_CONFETI[i % COLORES_CONFETI.length],
            animation: `confetiCae 1.6s ease-in ${(i % 9) * 0.09}s both`,
          }}
        />
      ))}
    </div>
  );
}

/* ═══════ Mini sobre con sello (plantillas y selector) ═══════ */
function SobreMini({ acento, titulo, subtitulo }) {
  const [abierto, setAbierto] = useState(false);
  return (
    <div className="relative w-[240px] h-[330px] mx-auto perspectiva">
      {/* carta que sube */}
      <motion.div
        className="absolute left-3 right-3 rounded-sm flex flex-col items-center justify-center text-center px-4"
        style={{ top: 24, height: 210, backgroundColor: NIEVE, boxShadow: '0 20px 40px -18px rgba(67,48,43,.45)', zIndex: 2 }}
        animate={abierto ? { y: -86, opacity: 1 } : { y: 0, opacity: 0 }}
        transition={{ duration: .9, delay: abierto ? .5 : 0, ease: [0.22, 1, 0.36, 1] }}
      >
        <span className="etiqueta" style={{ color: CAFE }}>Nos casamos</span>
        <p className="font-display text-3xl font-light leading-tight mt-2" style={{ color: TINTA }}>{titulo}</p>
        {subtitulo && <p className="font-script text-2xl mt-1" style={{ color: CAFE }}>{subtitulo}</p>}
      </motion.div>
      {/* cuerpo del sobre */}
      <div className="absolute left-0 right-0 rounded-sm" style={{ top: 120, height: 210, backgroundColor: CREMA, boxShadow: '0 25px 50px -20px rgba(67,48,43,.5)', zIndex: 3 }}>
        <div className="absolute inset-x-0 top-0" style={{ height: 105, backgroundColor: ARENA, clipPath: 'polygon(0 0, 50% 62%, 100% 0)' }} />
        <div className="absolute inset-3 border pointer-events-none" style={{ borderColor: CAFE_RGBA(.4) }} />
      </div>
      {/* solapa */}
      <motion.div
        className="absolute left-0 right-0 origin-top"
        style={{ top: 120, height: 118, zIndex: abierto ? 1 : 5, transformStyle: 'preserve-3d' }}
        animate={{ rotateX: abierto ? -168 : 0 }}
        transition={{ duration: .8, ease: [0.65, 0, 0.35, 1] }}
      >
        <div className="absolute inset-0" style={{ backgroundColor: P3, clipPath: 'polygon(0 0, 100% 0, 50% 100%)' }} />
      </motion.div>
      {/* sello: ES el botón */}
      {!abierto && (
        <motion.button
          type="button" onClick={() => setAbierto(true)} aria-label="Toca el sello para abrir"
          className="absolute left-1/2 -translate-x-1/2 cursor-pointer"
          style={{ top: 188, zIndex: 6 }}
          whileTap={{ scale: .92 }}
        >
          <span className="relative w-16 h-16 rounded-full flex items-center justify-center"
            style={{ backgroundColor: acento, boxShadow: '0 10px 26px -8px rgba(166,122,104,.8)' }}>
            <span className="font-script text-3xl" style={{ color: 'var(--nieve)' }}>C</span>
          </span>
          <span className="etiqueta block mt-3 px-2 py-1 rounded-full" style={{ color: TINTA, backgroundColor: 'rgba(253,252,250,.85)', fontSize: 9 }}>Toca el sello</span>
        </motion.button>
      )}
      {abierto && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .9 }}
          className="absolute inset-x-0 text-center etiqueta" style={{ top: 302, color: CAFE }}>
          Se abre con luz y música
        </motion.p>
      )}
    </div>
  );
}

/* ═══════ Fecha que se revela raspando en 3 toques ═══════
   Adaptación: en vez de canvas, 3 segmentos con foil que se
   retira al tocar en orden (día → mes → año). Mismo gesto,
   sin el riesgo del canvas en móvil. */
const FECHA_EJEMPLO = { dia: '19', mes: 'Diciembre', anio: '2026' };
function FechaRascable() {
  const [paso, setPaso] = useState(0);
  const [confeti, setConfeti] = useState(false);
  const segmentos = [
    { k: 'dia', v: FECHA_EJEMPLO.dia, etiqueta: 'Día' },
    { k: 'mes', v: FECHA_EJEMPLO.mes, etiqueta: 'Mes' },
    { k: 'anio', v: FECHA_EJEMPLO.anio, etiqueta: 'Año' },
  ];
  const revelar = (i) => {
    if (i !== paso) return;
    const n = paso + 1;
    setPaso(n);
    if (n === 3) setConfeti(true);
  };
  return (
    <div className="relative rounded-2xl p-5 text-center" style={{ backgroundColor: ARENA, border: `1px solid ${CAFE_RGBA(.25)}` }}>
      <Confeti activo={confeti} />
      <span className="etiqueta block" style={{ color: CAFE }}>Raspa para revelar</span>
      <p className="font-script text-3xl mt-1" style={{ color: TINTA }}>La fecha</p>
      <div className="flex items-stretch justify-center gap-2 mt-4">
        {segmentos.map((s, i) => {
          const revelado = i < paso;
          const turno = i === paso;
          return (
            <button
              key={s.k} type="button" onClick={() => revelar(i)} disabled={!turno && !revelado}
              aria-label={revelado ? `${s.etiqueta}: ${s.v}` : `Raspa para ver el ${s.etiqueta.toLowerCase()}`}
              className="relative flex-1 rounded-lg overflow-hidden py-3 cursor-pointer disabled:cursor-default"
              style={{ backgroundColor: NIEVE, border: `1px solid ${CAFE_RGBA(.3)}` }}
            >
              <span className="font-display text-xl block" style={{ color: TINTA }}>{s.v}</span>
              <span className="etiqueta block" style={{ color: TINTA_SUAVE, fontSize: 8 }}>{s.etiqueta}</span>
              {!revelado && (
                <motion.span
                  className="absolute inset-0 flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, var(--p2), var(--terracota) 55%, var(--dorado))' }}
                  animate={turno ? { opacity: [1, .82, 1] } : {}}
                  transition={turno ? { duration: 1.6, repeat: Infinity } : {}}
                >
                  <span className="etiqueta" style={{ color: 'var(--nieve)', fontSize: 9 }}>{turno ? 'Toca para raspar' : '···'}</span>
                </motion.span>
              )}
            </button>
          );
        })}
      </div>
      {paso === 3 ? (
        <p className="brillo-final font-script text-3xl mt-4" style={{ color: CAFE }}>¡19 · Diciembre · 2026!</p>
      ) : (
        <p className="text-xs font-light mt-4" style={{ color: TINTA_SUAVE }}>Toca en orden: día → mes → año.</p>
      )}
    </div>
  );
}

/* ═══════ Pase con tira arrancable y mensaje de voz ═══════
   El reproductor es una demo visual del feature (la grabación
   y subida de voz real es trabajo de fase 2, con backend). */
function PaseVoz() {
  const [arrancado, setArrancado] = useState(false);
  const [sonandoVoz, setSonandoVoz] = useState(false);
  const [seg, setSeg] = useState(0);
  const sinMovimiento = useReducedMotion();
  useEffect(() => {
    if (!sonandoVoz) return;
    const id = setInterval(() => {
      setSeg((s) => {
        if (s + 1 >= 12) { setSonandoVoz(false); return 0; }
        return s + 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [sonandoVoz]);
  return (
    <div className="rounded-2xl overflow-hidden text-left" style={{ backgroundColor: NIEVE, border: `1px solid ${CAFE_RGBA(.3)}`, boxShadow: '0 24px 50px -24px rgba(67,48,43,.35)' }}>
      <div className="px-5 pt-5 pb-4 flex items-start justify-between gap-4">
        <div>
          <span className="etiqueta block" style={{ color: CAFE }}>Pase de invitado</span>
          <p className="font-display text-2xl font-light mt-1" style={{ color: TINTA }}>Familia Hernández</p>
          <p className="text-xs font-light mt-1" style={{ color: TINTA_SUAVE }}>4 lugares · Mesa 6 · Ceremonia 17:00 h</p>
        </div>
        <span className="font-script text-4xl shrink-0" style={{ color: CAFE }}>C</span>
      </div>
      <div className="relative px-5 pb-5">
        <AnimatePresence>
          {!arrancado && (
            <motion.button
              type="button" onClick={() => setArrancado(true)}
              className="relative w-full py-3 rounded-lg cursor-pointer"
              style={{ border: `2px dashed ${CAFE_RGBA(.6)}`, backgroundColor: ARENA }}
              exit={{ rotate: -7, y: 70, opacity: 0 }}
              transition={{ duration: .6, ease: [0.65, 0, 0.35, 1] }}
              aria-label="Arrancar la tira para escuchar el mensaje de voz"
            >
              <span className="etiqueta" style={{ color: CAFE }}>✂ Arranca la tira para escucharlos</span>
            </motion.button>
          )}
        </AnimatePresence>
        {arrancado && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .5, delay: .25 }}
            className="rounded-lg p-4" style={{ backgroundColor: ARENA }}>
            <div className="flex items-center gap-3">
              <button
                type="button" onClick={() => setSonandoVoz((v) => !v)}
                aria-label={sonandoVoz ? 'Pausar mensaje de voz' : 'Escuchar mensaje de voz'}
                className="w-11 h-11 shrink-0 rounded-full flex items-center justify-center text-white text-lg cursor-pointer"
                style={{ backgroundColor: CAFE }}
              >
                {sonandoVoz ? '❚❚' : '▶'}
              </button>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-light truncate" style={{ color: TINTA }}>Un mensaje para ti — Brisa y Bruno</p>
                <div className="flex items-end gap-[3px] h-5 mt-1.5" aria-hidden="true">
                  {[0.5, 0.9, 0.4, 1, 0.6, 0.85, 0.45, 0.95, 0.55, 0.8, 0.35, 0.7].map((h, i) => (
                    <motion.span
                      key={i}
                      className="w-[3px] rounded-full origin-bottom"
                      style={{ backgroundColor: CAFE, height: '100%', transform: `scaleY(${h})` }}
                      animate={sonandoVoz && !sinMovimiento ? { scaleY: [h * 0.4, h, h * 0.4] } : {}}
                      transition={{ duration: .8, repeat: Infinity, delay: i * .07 }}
                    />
                  ))}
                </div>
              </div>
              <span className="etiqueta shrink-0" style={{ color: TINTA_SUAVE, fontSize: 9 }}>0:{String(seg).padStart(2, '0')} / 0:12</span>
            </div>
            <p className="text-[11px] font-light mt-3" style={{ color: TINTA_SUAVE }}>Demo visual: en tu invitación, el mensaje se graba desde el panel y cada invitado lo escucha al abrir su pase.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

/* ═══════ Mesa de regalos con % reunido (demo visual) ═══════ */
function MesaRegalos() {
  const [regalos, setRegalos] = useState(REGALOS_INICIAL);
  const [gracias, setGracias] = useState(null);
  const total = Math.round(regalos.reduce((a, r) => a + r.pct, 0) / regalos.length);
  const aportar = (i) => {
    setRegalos((rs) => rs.map((r, j) => (j === i ? { ...r, pct: Math.min(100, r.pct + 5), apartado: true } : r)));
    setGracias(i);
    setTimeout(() => setGracias(null), 2600);
  };
  return (
    <div className="rounded-2xl p-6 md:p-8" style={{ backgroundColor: NIEVE, border: `1px solid ${CAFE_RGBA(.3)}`, boxShadow: '0 24px 50px -24px rgba(67,48,43,.3)' }}>
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <span className="etiqueta block" style={{ color: CAFE }}>Mesa de regalos</span>
          <p className="font-display text-3xl font-light mt-1" style={{ color: TINTA }}>{total}% reunido</p>
        </div>
        <div className="w-40 h-2 rounded-full overflow-hidden" style={{ backgroundColor: ARENA }}>
          <motion.div className="h-full rounded-full" style={{ backgroundColor: CAFE }} animate={{ width: `${total}%` }} transition={{ duration: .6 }} />
        </div>
      </div>
      <div className="space-y-4 mt-6">
        {regalos.map((r, i) => (
          <div key={r.n} className="flex items-center gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-sm font-light truncate" style={{ color: TINTA }}>{r.n}</span>
                <span className="etiqueta shrink-0" style={{ color: TINTA_SUAVE, fontSize: 9 }}>{r.pct}% · {r.apartado ? 'Apartado por un invitado' : 'Disponible'}</span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden mt-1.5" style={{ backgroundColor: ARENA }}>
                <motion.div className="h-full rounded-full" style={{ backgroundColor: r.apartado ? CAFE : TERRACOTA }} animate={{ width: `${r.pct}%` }} transition={{ duration: .6 }} />
              </div>
            </div>
            <button
              type="button" onClick={() => aportar(i)}
              className="etiqueta shrink-0 px-4 py-2.5 rounded-full cursor-pointer transition-transform hover:scale-[1.05]"
              style={{ backgroundColor: gracias === i ? TERRACOTA : CAFE, color: '#fff' }}
            >
              {gracias === i ? '¡Gracias!' : 'Aportar'}
            </button>
          </div>
        ))}
      </div>
      <p className="text-[11px] font-light mt-5" style={{ color: TINTA_SUAVE }}>Demo visual de la landing: la mesa real con apartados y pagos vive en la invitación de cada pareja.</p>
    </div>
  );
}

/* ═══════ Selector de apertura: 4 rituales ═══════ */
function VistaRitual({ ritual }) {
  const [abierto, setAbierto] = useState(false);
  const sinMovimiento = useReducedMotion();
  const reset = () => setAbierto(false);
  if (ritual === 'sobre') {
    return <SobreMini acento={CAFE} titulo="Brisa y Bruno" subtitulo="19 · Diciembre · 2026" />;
  }
  if (ritual === 'puertas') {
    return (
      <div className="relative w-[280px] h-[330px] mx-auto overflow-hidden rounded-sm" style={{ backgroundColor: CREMA, boxShadow: '0 25px 50px -20px rgba(67,48,43,.5)' }}>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <span className="etiqueta" style={{ color: CAFE }}>Nos casamos</span>
          <p className="font-display text-3xl font-light mt-2" style={{ color: TINTA }}>Brisa y Bruno</p>
          <p className="font-script text-2xl mt-1" style={{ color: CAFE }}>19 · Diciembre · 2026</p>
        </div>
        <motion.div className="absolute inset-y-0 left-0 w-1/2" style={{ backgroundColor: TERRACOTA, zIndex: 5 }}
          animate={{ x: abierto ? '-102%' : '0%' }} transition={{ duration: .9, ease: [0.65, 0, 0.35, 1] }}>
          <div className="absolute inset-3 border" style={{ borderColor: CAFE_RGBA(.5) }} />
        </motion.div>
        <motion.div className="absolute inset-y-0 right-0 w-1/2" style={{ backgroundColor: TERRACOTA, zIndex: 5 }}
          animate={{ x: abierto ? '102%' : '0%' }} transition={{ duration: .9, ease: [0.65, 0, 0.35, 1] }}>
          <div className="absolute inset-3 border" style={{ borderColor: CAFE_RGBA(.5) }} />
        </motion.div>
        {!abierto && (
          <button type="button" onClick={() => setAbierto(true)} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 etiqueta px-5 py-3 rounded-full cursor-pointer" style={{ backgroundColor: NIEVE, color: TINTA, boxShadow: '0 12px 30px -10px rgba(67,48,43,.5)' }}>
            Toca para abrir
          </button>
        )}
        {abierto && (
          <button type="button" onClick={reset} className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 etiqueta cursor-pointer" style={{ color: CAFE }}>Ver de nuevo ↺</button>
        )}
      </div>
    );
  }
  if (ritual === 'flores') {
    const petalos = [
      { x: 0, y: -70, r: 0 }, { x: 66, y: -22, r: 72 }, { x: 41, y: 57, r: 144 },
      { x: -41, y: 57, r: 216 }, { x: -66, y: -22, r: 288 },
    ];
    return (
      <div className="relative w-[280px] h-[330px] mx-auto flex items-center justify-center">
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <span className="etiqueta" style={{ color: CAFE }}>Nos casamos</span>
          <p className="font-display text-3xl font-light mt-2" style={{ color: TINTA }}>Brisa y Bruno</p>
          <p className="font-script text-2xl mt-1" style={{ color: CAFE }}>19 · Diciembre · 2026</p>
        </div>
        {petalos.map((p, i) => (
          <motion.span
            key={i}
            className="absolute w-20 h-20 rounded-full"
            style={{ backgroundColor: i % 2 ? P2 : P5, boxShadow: '0 14px 30px -12px rgba(166,122,104,.6)' }}
            animate={abierto
              ? { x: p.x * 1.7, y: p.y * 1.7, rotate: p.r, scale: .85, opacity: .9 }
              : { x: p.x * 0.35, y: p.y * 0.35, rotate: 0, scale: 1, opacity: 1 }}
            transition={{ duration: .9, ease: [0.22, 1, 0.36, 1] }}
          />
        ))}
        <motion.span
          className="absolute w-16 h-16 rounded-full flex items-center justify-center font-script text-2xl z-10"
          style={{ backgroundColor: CAFE, color: 'var(--nieve)' }}
          animate={abierto ? { scale: 0, opacity: 0 } : { scale: 1, opacity: 1 }}
          transition={{ duration: .4 }}
        >
          B
        </motion.span>
        {!abierto && (
          <button type="button" onClick={() => setAbierto(true)} className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10 etiqueta px-5 py-3 rounded-full cursor-pointer" style={{ backgroundColor: NIEVE, color: TINTA, boxShadow: '0 12px 30px -10px rgba(67,48,43,.5)' }}>
            Toca para abrir
          </button>
        )}
        {abierto && (
          <button type="button" onClick={reset} className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10 etiqueta cursor-pointer" style={{ color: CAFE }}>Ver de nuevo ↺</button>
        )}
      </div>
    );
  }
  /* globos */
  return (
    <div className="relative w-[280px] h-[330px] mx-auto overflow-hidden rounded-sm" style={{ backgroundColor: CREMA, boxShadow: '0 25px 50px -20px rgba(67,48,43,.5)' }}>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
        <span className="etiqueta" style={{ color: CAFE }}>Nos casamos</span>
        <p className="font-display text-3xl font-light mt-2" style={{ color: TINTA }}>Brisa y Bruno</p>
        <p className="font-script text-2xl mt-1" style={{ color: CAFE }}>19 · Diciembre · 2026</p>
      </div>
      {[
        { l: '18%', c: P2, d: 0 }, { l: '44%', c: P5, d: .15 }, { l: '70%', c: P6, d: .3 },
      ].map((g, i) => (
        <motion.div
          key={i}
          className="absolute flex flex-col items-center"
          style={{ left: g.l, top: 60, zIndex: 5 }}
          animate={abierto ? { y: -260, opacity: 0 } : { y: sinMovimiento ? 0 : [0, -12, 0], opacity: 1 }}
          transition={abierto ? { duration: .9, delay: g.d } : { duration: 3.2, repeat: Infinity, delay: g.d }}
        >
          <span className="block w-14 h-[72px] rounded-full" style={{ backgroundColor: g.c, boxShadow: 'inset -6px -8px 14px rgba(67,48,43,.18)' }} />
          <span className="block w-px h-14" style={{ backgroundColor: CAFE_RGBA(.7) }} />
        </motion.div>
      ))}
      {!abierto && (
        <button type="button" onClick={() => setAbierto(true)} className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 etiqueta px-5 py-3 rounded-full cursor-pointer" style={{ backgroundColor: NIEVE, color: TINTA, boxShadow: '0 12px 30px -10px rgba(67,48,43,.5)' }}>
          Toca para abrir
        </button>
      )}
      {abierto && (
        <button type="button" onClick={reset} className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 etiqueta cursor-pointer" style={{ color: CAFE }}>Ver de nuevo ↺</button>
      )}
    </div>
  );
}

function SelectorApertura() {
  const [activo, setActivo] = useState(true);
  const [ritual, setRitual] = useState('sobre');
  return (
    <div className="grid lg:grid-cols-2 gap-10 items-center">
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4 rounded-2xl px-5 py-4" style={{ backgroundColor: NIEVE, border: `1px solid ${CAFE_RGBA(.3)}` }}>
          <div>
            <p className="font-display text-xl font-light" style={{ color: TINTA }}>Animación al abrir</p>
            <p className="text-xs font-light mt-0.5" style={{ color: TINTA_SUAVE }}>Tu invitado elige su ritual antes de entrar.</p>
          </div>
          <button
            type="button" role="switch" aria-checked={activo} onClick={() => setActivo((v) => !v)}
            aria-label="Activar o desactivar la animación al abrir"
            className="relative w-14 h-8 shrink-0 rounded-full cursor-pointer transition-colors"
            style={{ backgroundColor: activo ? CAFE : CAFE_RGBA(.35) }}
          >
            <motion.span
              className="absolute top-1 w-6 h-6 rounded-full"
              style={{ backgroundColor: 'var(--nieve)', boxShadow: '0 2px 8px rgba(67,48,43,.35)' }}
              animate={{ left: activo ? 30 : 4 }}
              transition={{ duration: .25 }}
            />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {APERTURAS.map((a) => (
            <button
              key={a.id} type="button" onClick={() => { setRitual(a.id); setActivo(true); }}
              className="text-left rounded-xl p-4 cursor-pointer transition-all"
              style={{
                backgroundColor: ritual === a.id && activo ? ARENA : NIEVE,
                border: `2px solid ${ritual === a.id && activo ? CAFE : CAFE_RGBA(.25)}`,
              }}
            >
              <span className="font-display text-lg font-light block" style={{ color: TINTA }}>{a.n}</span>
              <span className="text-xs font-light leading-relaxed block mt-1" style={{ color: TINTA_SUAVE }}>{a.d}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="rounded-2xl py-8 px-4 flex items-center justify-center min-h-[380px]" style={{ backgroundColor: ARENA, border: `1px solid ${CAFE_RGBA(.25)}` }}>
        {activo ? (
          <div key={ritual}>
            <VistaRitual ritual={ritual} />
          </div>
        ) : (
          <div className="text-center px-6">
            <p className="font-display text-3xl font-light" style={{ color: TINTA }}>Brisa y Bruno</p>
            <p className="font-script text-2xl mt-1" style={{ color: CAFE }}>19 · Diciembre · 2026</p>
            <p className="text-xs font-light mt-4" style={{ color: TINTA_SUAVE }}>Sin animación: la invitación abre directo en la portada.</p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══════ Lounge de música: las 5 canciones reales ═══════ */
function LoungeMusica() {
  const audioRef = useRef(null);
  const [actual, setActual] = useState(null);
  const [sonando, setSonando] = useState(false);
  const sinMovimiento = useReducedMotion();
  const tocar = (i) => {
    const a = audioRef.current;
    if (!a) return;
    if (actual === i && sonando) { a.pause(); setSonando(false); return; }
    a.src = encodeURI(`/music/${CANCIONES[i].archivo}`);
    a.play().then(() => { setActual(i); setSonando(true); }).catch(() => {});
  };
  return (
    <div>
      <audio ref={audioRef} preload="none" onEnded={() => setSonando(false)} />
      <div className="space-y-3">
        {CANCIONES.map((c, i) => {
          const esta = actual === i && sonando;
          return (
            <div key={c.archivo} className="flex items-center gap-4 rounded-xl px-4 py-3.5" style={{ backgroundColor: NIEVE, border: `1px solid ${CAFE_RGBA(.25)}` }}>
              <button
                type="button" onClick={() => tocar(i)}
                aria-label={esta ? `Pausar ${c.n}` : `Escuchar ${c.n}`}
                className="w-11 h-11 shrink-0 rounded-full flex items-center justify-center text-white cursor-pointer"
                style={{ backgroundColor: esta ? TERRACOTA : CAFE }}
              >
                {esta ? '❚❚' : '▶'}
              </button>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-light truncate" style={{ color: TINTA }}>{c.n}</p>
                <p className="etiqueta" style={{ color: TINTA_SUAVE, fontSize: 8 }}>Incluida en tu invitación</p>
              </div>
              {esta && (
                <span className="flex gap-[2.5px] items-end h-4 shrink-0" aria-hidden="true">
                  {[0, 1, 2].map((b) => (
                    <motion.span key={b}
                      animate={sinMovimiento ? {} : { scaleY: [0.3, 1, 0.3] }}
                      transition={{ duration: .9, repeat: Infinity, delay: b * .18 }}
                      className="w-[2.5px] h-full block rounded-full origin-bottom" style={{ backgroundColor: CAFE }} />
                  ))}
                </span>
              )}
            </div>
          );
        })}
        <div className="flex items-center gap-4 rounded-xl px-4 py-3.5" style={{ backgroundColor: ARENA, border: `2px dashed ${CAFE_RGBA(.5)}` }}>
          <span className="w-11 h-11 shrink-0 rounded-full flex items-center justify-center font-script text-2xl" style={{ backgroundColor: CAFE, color: 'var(--nieve)' }}>♪</span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-light" style={{ color: TINTA }}>Tu canción · +{formatearPesos(PRECIO_MUSICA_PERSONALIZADA)} MXN</p>
            <p className="text-xs font-light" style={{ color: TINTA_SUAVE }}>Súbela en el editor y suena al abrir tu invitación.</p>
          </div>
          <Link href="/crear" className="etiqueta shrink-0 px-4 py-2.5 rounded-full text-white cursor-pointer" style={{ backgroundColor: CAFE }}>
            Elegir
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ═══════ Demo de invitación dentro de un teléfono ═══════ */
function DemoTelefono({ restante }) {
  const [confirmado, setConfirmado] = useState(false);
  const [confeti, setConfeti] = useState(false);
  const confirmar = () => {
    if (confirmado) return;
    setConfirmado(true);
    setConfeti(true);
  };
  return (
    <motion.div
      animate={{ y: [0, -12, 0] }}
      transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      className="relative w-[300px] h-[600px] rounded-[2.75rem] p-3 mx-auto"
      style={{ backgroundColor: TINTA, boxShadow: '0 45px 90px -30px rgba(67,48,43,.55)' }}
    >
      <div className="absolute top-3 left-1/2 -translate-x-1/2 w-24 h-5 rounded-b-2xl z-20" style={{ backgroundColor: TINTA }} />
      <div className="relative w-full h-full rounded-[2.25rem] overflow-hidden" style={{ backgroundColor: NIEVE }}>
        <div className="h-full overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
          <div className="relative">
            <img src={FOTO.bodaDos} alt="Brisa y Bruno" className="w-full h-56 object-cover" />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent 30%, rgba(67,48,43,.75) 100%)' }} />
            <div className="absolute inset-x-0 bottom-0 p-5 text-center text-white">
              <span className="etiqueta block" style={{ color: ROSA }}>19 · Diciembre · 2026</span>
              <p className="font-script text-4xl mt-1">Brisa y Bruno</p>
            </div>
          </div>

          <div className="p-5 space-y-5">
            {restante && (
              <div className="text-center">
                <span className="etiqueta block" style={{ color: CAFE }}>Solo faltan</span>
                <div className="flex justify-center gap-4 mt-2">
                  {[['días', restante.d], ['hrs', restante.h], ['min', restante.m], ['seg', restante.s]].map(([k, v]) => (
                    <div key={k}>
                      <span className="font-display text-2xl block" style={{ color: TINTA }}>{String(v).padStart(2, '0')}</span>
                      <span className="etiqueta" style={{ color: TINTA_SUAVE, fontSize: 8 }}>{k}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <FechaRascable />

            <div className="text-center space-y-1">
              <span className="etiqueta block" style={{ color: CAFE }}>Con la bendición de sus papás</span>
              <p className="text-sm font-light" style={{ color: TINTA }}>María González &amp; José González</p>
              <p className="text-sm font-light" style={{ color: TINTA }}>Carmen Ruiz &amp; Luis Ruiz</p>
            </div>

            <div className="rounded-2xl p-4" style={{ backgroundColor: ARENA }}>
              <span className="etiqueta block text-center" style={{ color: CAFE }}>Itinerario</span>
              <ul className="mt-3 space-y-2 text-sm font-light" style={{ color: TINTA }}>
                <li className="flex justify-between gap-2"><span>Ceremonia · Iglesia</span><b>17:00</b></li>
                <li className="flex justify-between gap-2"><span>Recepción · Jardín</span><b>19:00</b></li>
                <li className="flex justify-between gap-2"><span>Vals de los novios</span><b>21:00</b></li>
              </ul>
            </div>

            <div>
              <img src={FOTO.momentoTres} alt="El lugar de la recepción" className="w-full h-32 object-cover rounded-xl" />
              <p className="text-sm font-light mt-2 text-center" style={{ color: TINTA }}>Jardín Las Flores · Monterrey</p>
              <div className="flex gap-2 mt-3">
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Jard%C3%ADn+de+eventos+Monterrey"
                  target="_blank" rel="noopener noreferrer"
                  className="flex-1 text-center etiqueta py-3 rounded-full cursor-pointer"
                  style={{ backgroundColor: CAFE, color: '#fff' }}
                >
                  Google Maps
                </a>
                <a
                  href="https://waze.com/ul?q=Jard%C3%ADn%20de%20eventos%20Monterrey&navigate=yes"
                  target="_blank" rel="noopener noreferrer"
                  className="flex-1 text-center etiqueta py-3 rounded-full cursor-pointer"
                  style={{ backgroundColor: NIEVE, color: CAFE, border: `1.5px solid ${CAFE}` }}
                >
                  Waze
                </a>
              </div>
            </div>

            <div className="relative pb-2">
              <Confeti activo={confeti} />
              <button
                type="button" onClick={confirmar}
                className="w-full etiqueta py-4 rounded-full cursor-pointer transition-transform hover:scale-[1.02]"
                style={{ backgroundColor: confirmado ? TERRACOTA : CAFE, color: '#fff' }}
              >
                {confirmado ? '¡Nos vemos ahí! ✓' : 'Confirmar asistencia'}
              </button>
              {confirmado && (
                <motion.p initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="text-center text-xs font-light mt-3" style={{ color: CAFE }}>
                  Tu lugar quedó apartado · Familia Hernández · 4 pases
                </motion.p>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ═══════ Catálogo de plantillas con su propio sobre ═══════ */
function PlantillasSection() {
  const [filtro, setFiltro] = useState('Todos');
  const [abierta, setAbierta] = useState(null);
  const visibles = PLANTILLAS.filter((p) => filtro === 'Todos' || p.e === filtro);
  const activa = PLANTILLAS.find((p) => p.id === (abierta || ''));
  return (
    <div>
      <div className="flex flex-wrap justify-center gap-2 mb-10">
        {['Todos', 'Boda', 'XV Años'].map((f) => (
          <button
            key={f} type="button" onClick={() => setFiltro(f)}
            className="etiqueta px-5 py-2.5 rounded-full cursor-pointer transition-all"
            style={{
              backgroundColor: filtro === f ? CAFE : NIEVE,
              color: filtro === f ? '#fff' : TINTA,
              border: `1.5px solid ${filtro === f ? CAFE : CAFE_RGBA(.35)}`,
            }}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {visibles.map((p, i) => (
          <Reveal key={p.id} delay={(i % 3) * 0.12} y={45}>
            <button
              type="button" onClick={() => setAbierta(p.id)}
              className="tarjeta-foto group relative aspect-[3/4] overflow-hidden rounded-sm block w-full text-left cursor-pointer"
            >
              <img src={p.img} alt={p.n} className="w-full h-full object-cover" />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, transparent 42%, rgba(67,48,43,.82) 100%)' }} />
              <div className="absolute inset-x-0 bottom-0 p-4 md:p-5 text-white transition-transform duration-500 group-hover:-translate-y-1">
                <span className="etiqueta block mb-1" style={{ color: ROSA, fontSize: 9 }}>{p.e}</span>
                <h3 className="font-display text-xl md:text-2xl font-light">{p.n}</h3>
                <span className="text-[11px] font-light opacity-80">Toca el sello para abrirla →</span>
              </div>
              <div className="absolute inset-2 border-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ borderColor: CAFE }} />
              <span
                className="absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center font-script text-lg"
                style={{ backgroundColor: p.acento, color: 'var(--nieve)', boxShadow: '0 6px 16px -4px rgba(67,48,43,.6)' }}
              >
                C
              </span>
            </button>
          </Reveal>
        ))}
      </div>

      <AnimatePresence>
        {activa && (
          <motion.div
            className="fixed inset-0 z-[200] flex items-center justify-center p-4"
            style={{ backgroundColor: 'rgba(67,48,43,.6)', backdropFilter: 'blur(6px)' }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setAbierta(null)}
          >
            <motion.div
              className="relative rounded-2xl p-6 pt-12 max-w-md w-full text-center"
              style={{ backgroundColor: NIEVE }}
              initial={{ scale: .92, y: 24 }} animate={{ scale: 1, y: 0 }} exit={{ scale: .94, y: 12 }}
              transition={{ duration: .35, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <Link href="#plantillas" onClick={() => setAbierta(null)}
                className="absolute top-4 left-5 flex items-center gap-2 cursor-pointer"
                aria-label="Volver a plantillas">
                <span className="w-9 h-9 rounded-full flex items-center justify-center font-script text-xl" style={{ backgroundColor: CAFE, color: 'var(--nieve)' }}>C</span>
                <span className="etiqueta" style={{ color: CAFE }}>Volver</span>
              </Link>
              <button
                type="button" onClick={() => setAbierta(null)} aria-label="Cerrar"
                className="absolute top-4 right-4 w-9 h-9 rounded-full cursor-pointer text-xl font-light"
                style={{ backgroundColor: ARENA, color: TINTA }}
              >
                ×
              </button>
              <div key={activa.id}>
                <SobreMini acento={activa.acento} titulo="Brisa y Bruno" subtitulo={activa.n} />
              </div>
              <p className="font-display text-2xl font-light mt-2" style={{ color: TINTA }}>{activa.n} · {activa.e}</p>
              <p className="text-sm font-light mt-1 max-w-xs mx-auto" style={{ color: TINTA_SUAVE }}>{activa.desc}</p>
              <Link href="/crear" className="inline-block etiqueta text-white px-8 py-3.5 rounded-full mt-5 cursor-pointer" style={{ backgroundColor: CAFE }}>
                Armarla con este diseño
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ═══════ Tres momentos que nadie olvida ═══════ */
function TresMomentosSection() {
  return (
    <div className="grid md:grid-cols-3 gap-6">
      {TRES_MOMENTOS.map((m, i) => (
        <Reveal key={m.n} delay={i * 0.14} y={40}>
          <div className="rounded-2xl p-8 h-full text-center" style={{ backgroundColor: NIEVE, border: `1px solid ${CAFE_RGBA(.25)}` }}>
            <span className="font-display text-6xl font-light block leading-none" style={{ color: CAFE_RGBA(.35) }}>{m.n}</span>
            <h3 className="font-script text-4xl mt-3" style={{ color: CAFE }}>{m.t}</h3>
            <div className="oro-linea w-16 mx-auto my-4" />
            <p className="text-sm font-light leading-relaxed" style={{ color: TINTA_SUAVE }}>{m.d}</p>
          </div>
        </Reveal>
      ))}
    </div>
  );
}

/* ═══════ Testimonios ═══════ */
function Estrellas() {
  return (
    <span className="tracking-[.2em] text-base" style={{ color: CAFE }} aria-label="5 de 5 estrellas">
      ★★★★★
    </span>
  );
}

function TarjetaTestimonio({ t, destacada }) {
  return (
    <figure
      className="rounded-2xl p-7 md:p-8 space-y-4 h-full flex flex-col"
      style={{ backgroundColor: NIEVE, border: `1px solid ${CAFE_RGBA(.3)}`, boxShadow: destacada ? '0 30px 60px -28px rgba(166,122,104,.55)' : 'none' }}
    >
      <div className="flex items-center justify-between gap-3">
        <Estrellas />
        <span className="etiqueta px-2.5 py-1 rounded-full" style={{ backgroundColor: ARENA, color: CAFE, fontSize: 8 }}>✓ Compra verificada</span>
      </div>
      <blockquote className="font-display text-xl md:text-[1.35rem] font-light leading-snug flex-1" style={{ color: TINTA }}>
        “{t.texto}”
      </blockquote>
      <figcaption className="pt-2" style={{ borderTop: `1px solid ${CAFE_RGBA(.2)}` }}>
        <div className="flex items-center gap-3">
          <span
            className="w-11 h-11 shrink-0 rounded-full flex items-center justify-center font-script text-2xl"
            style={{ backgroundColor: TERRACOTA, color: 'var(--nieve)' }}
          >
            {t.nombre.charAt(0)}
          </span>
          <div className="min-w-0">
            <p className="text-sm font-medium truncate" style={{ color: TINTA }}>{t.nombre}</p>
            <p className="text-xs font-light truncate" style={{ color: TINTA_SUAVE }}>{t.evento} · {t.ciudad}</p>
          </div>
        </div>
        <p className="etiqueta mt-3" style={{ color: TINTA_SUAVE, fontSize: 8 }}>{t.fecha} · {t.lugar} · {t.plan}</p>
      </figcaption>
    </figure>
  );
}

function TestimoniosSection() {
  const [destacada, ...resto] = TESTIMONIOS;
  return (
    <div>
      <Reveal className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 mb-12 text-center">
        <span className="font-display text-6xl font-light leading-none" style={{ color: CAFE }}>4.9<span className="text-3xl">/5</span></span>
        <span className="space-y-1">
          <Estrellas />
          <span className="etiqueta block" style={{ color: TINTA_SUAVE }}>127 reseñas de novias y quinceañeras</span>
        </span>
      </Reveal>
      <div className="grid md:grid-cols-3 gap-5 md:gap-6">
        <Reveal delay={0} y={40} className="md:col-span-2">
          <TarjetaTestimonio t={destacada} destacada />
        </Reveal>
        {resto.map((t, i) => (
          <Reveal key={t.nombre} delay={(i % 3) * 0.1} y={40}>
            <TarjetaTestimonio t={t} />
          </Reveal>
        ))}
      </div>
    </div>
  );
}

/* Fondo oscuro fijo (portada, tira, cierre, pie): nunca cambia
   con el modo oscuro, para que el texto blanco siempre lea. */
const OSCURO = '#43302B';
/* Crema translúcido para que el fondo vivo respire a través. */
const CREMA_SUAVE = 'color-mix(in srgb, var(--crema) 62%, transparent)';

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

  /* Cuenta regresiva a la fecha del ejemplo (19 dic 2026);
     si ya pasó, rueda +128 días como antes. */
  useEffect(() => {
    let objetivo = new Date('2026-12-19T17:00:00');
    if (objetivo - new Date() < 0) {
      objetivo = new Date();
      objetivo.setDate(objetivo.getDate() + 128);
    }
    const tick = () => {
      const d = objetivo - new Date();
      setRestante({
        d: Math.max(0, Math.floor(d / 86400000)), h: Math.max(0, Math.floor((d / 3600000) % 24)),
        m: Math.max(0, Math.floor((d / 60000) % 60)), s: Math.max(0, Math.floor((d / 1000) % 60)),
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

  const enlacesNav = [
    ['#invitacion', 'Invitación'],
    ['#plantillas', 'Plantillas'],
    ['/crear', 'Editor'],
    ['#musica', 'Música'],
    ['#precios', 'Planes'],
    ['#opiniones', 'Opiniones'],
  ];

  return (
    <div style={{ backgroundColor: NIEVE, color: TINTA }} className="min-h-screen font-ui antialiased overflow-x-hidden">
      <FondoVivo />
      <audio ref={audioRef} src="/boda-music.mp3" loop preload="auto" />

      {/* ═══════════════════ PORTADA: el sobre que abre la película.
          El SELLO es el botón; el texto queda de respaldo. */}
      <AnimatePresence>
        {portada && (
          <motion.div
            className="fixed inset-0 z-[300] flex flex-col items-center justify-center overflow-hidden"
            style={{ backgroundColor: OSCURO }}
            exit={{ opacity: 0 }} transition={{ duration: .8, delay: .9 }}
          >
            <motion.img
              src={FOTO.portada} alt="" aria-hidden="true"
              className="absolute inset-0 w-full h-full object-cover"
              initial={{ scale: 1.25, opacity: .3 }}
              animate={abriendoPortada ? { scale: 1.6, opacity: .1 } : { scale: 1.12, opacity: .32 }}
              transition={{ duration: abriendoPortada ? 1.9 : 6, ease: [0.22, 1, 0.36, 1] }}
            />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(67,48,43,.72), rgba(166,122,104,.55))' }} />

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

              {/* El sobre: el sello es el botón */}
              <motion.div
                className="relative w-[210px] h-[150px] perspectiva"
                initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.1, delay: .5 }}
              >
                <div className="absolute inset-0 rounded-sm" style={{ backgroundColor: CREMA, boxShadow: '0 30px 60px -20px rgba(0,0,0,.7)' }}>
                  <div className="absolute inset-2 border" style={{ borderColor: CAFE_RGBA(.45) }} />
                </div>
                <motion.div
                  className="absolute inset-x-0 top-0 origin-top" style={{ height: 92, transformStyle: 'preserve-3d' }}
                  animate={{ rotateX: abriendoPortada ? -172 : 0 }}
                  transition={{ duration: 1, ease: [0.65, 0, 0.35, 1] }}
                >
                  <div className="absolute inset-0" style={{ backgroundColor: ARENA, clipPath: 'polygon(0 0, 100% 0, 50% 100%)' }} />
                </motion.div>
                <motion.button
                  type="button" onClick={() => entrar(true)} aria-label="Toca el sello de cera para entrar"
                  className="absolute left-1/2 -translate-x-1/2 w-14 h-14 rounded-full flex items-center justify-center cursor-pointer"
                  style={{ top: 62, backgroundColor: CAFE, zIndex: 5, boxShadow: '0 8px 22px -6px rgba(166,122,104,.9)' }}
                  animate={abriendoPortada ? { opacity: 0, scale: .5 } : sinMovimiento ? {} : { scale: [1, 1.06, 1] }}
                  transition={abriendoPortada ? { duration: .4 } : { duration: 2.6, repeat: Infinity }}
                  whileTap={{ scale: .9 }}
                >
                  <span className="font-script text-2xl text-white">C</span>
                </motion.button>
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
                <span className="etiqueta animate-pulse" style={{ color: 'rgba(255,255,255,.85)' }}>Toca el sello para entrar</span>
                <button
                  type="button" onClick={() => entrar(true)}
                  className="etiqueta transition-opacity hover:opacity-100 cursor-pointer"
                  style={{ color: 'rgba(255,255,255,.6)', fontSize: 9 }}
                >
                  Abrir invitación
                </button>
                <button
                  type="button" onClick={() => entrar(false)}
                  className="etiqueta transition-opacity hover:opacity-100 cursor-pointer"
                  style={{ color: 'rgba(255,255,255,.5)', fontSize: 9 }}
                >
                  Entrar sin sonido
                </button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div className="fixed top-0 left-0 right-0 h-[3px] origin-left z-[120]" style={{ backgroundColor: CAFE, scaleX: scrollYProgress }} />

      <div className="relative z-10">
        {/* ═══════════════════ HEADER FIJO con logo-sello ═══════════════════ */}
        <header className="sticky top-0 z-[110] border-b" style={{ backgroundColor: 'color-mix(in srgb, var(--nieve) 93%, transparent)', backdropFilter: 'blur(14px)', borderColor: CAFE_RGBA(.15) }}>
          <div className="max-w-7xl mx-auto px-5 py-3">
            <div className="flex items-center justify-between gap-4">
              <a href="#inicio" className="flex items-center gap-2.5 shrink-0" aria-label="Click y Papel: volver al inicio">
                <span className="w-10 h-10 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: CAFE, boxShadow: '0 6px 16px -4px rgba(166,122,104,.8)' }}>
                  <span className="font-script text-xl text-white leading-none pt-0.5">C&amp;P</span>
                </span>
                <span className="leading-none">
                  <span className="font-display text-2xl tracking-wide block" style={{ color: TINTA }}>
                    clicky<span style={{ color: CAFE }}>papel</span>
                  </span>
                  <span className="font-script text-lg block -mt-0.5" style={{ color: CAFE }}>Tu Gran Día</span>
                </span>
              </a>
              <div className="flex items-center gap-3 sm:gap-4">
                {sonando && (
                  <button type="button" onClick={alternarMusica} aria-label="Pausar la música" className="hidden sm:flex items-end gap-[2.5px] h-4 cursor-pointer">
                    {[0, 1, 2].map((b) => (
                      <motion.span key={b} animate={sinMovimiento ? {} : { scaleY: [0.3, 1, 0.3] }}
                        transition={{ duration: 1, repeat: Infinity, delay: b * .18 }}
                        className="w-[2.5px] h-full block rounded-full origin-bottom" style={{ backgroundColor: CAFE }} />
                    ))}
                  </button>
                )}
                <Link href="/login" className="etiqueta hidden sm:block hover:opacity-60 transition-opacity" style={{ color: GRIS }}>Entrar</Link>
                <Link href="/crear" className="etiqueta text-white px-5 sm:px-6 py-3 rounded-full transition-transform hover:scale-[1.05]" style={{ backgroundColor: CAFE }}>
                  Crear la mía
                </Link>
              </div>
            </div>
            <nav className="flex items-center gap-5 sm:gap-8 mt-2.5 overflow-x-auto etiqueta" style={{ color: GRIS }} aria-label="Secciones">
              {enlacesNav.map(([h, t]) => (
                <a key={h} href={h} className="relative group py-1 whitespace-nowrap">
                  {t}
                  <span className="absolute left-0 -bottom-0.5 h-[1.5px] w-0 group-hover:w-full transition-all duration-400" style={{ backgroundColor: CAFE }} />
                </a>
              ))}
            </nav>
          </div>
        </header>

        {/* ═══════════════════ HERO ═══════════════════ */}
        <header id="inicio" ref={heroRef} className="relative grid lg:grid-cols-[1fr_1.05fr]" style={{ minHeight: '92svh' }}>
          <motion.div style={{ y: heroY, opacity: heroOpacidad }} className="relative flex items-center px-5 sm:px-10 lg:pl-16 lg:pr-14 py-16 lg:py-0 order-2 lg:order-1">
            {!sinMovimiento && (
              <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
                {petalos.map((p, i) => (
                  <motion.span key={i} className="absolute rounded-full"
                    style={{ left: p.l, width: p.s, height: p.s, backgroundColor: i % 2 ? CAFE : ROSA, opacity: .28 }}
                    animate={{ top: ['-6%', '108%'], x: [0, 22, -16, 10, 0], rotate: [0, 360] }}
                    transition={{ duration: p.dur, delay: p.d, repeat: Infinity, ease: 'linear' }} />
                ))}
              </div>
            )}

            <div className="relative max-w-xl space-y-8 text-center lg:text-left mx-auto lg:mx-0">
              <Reveal y={16}>
                <span className="etiqueta inline-flex items-center gap-2.5 px-4 py-2 rounded-full border"
                  style={{ borderColor: CAFE_RGBA(.3), color: CAFE, backgroundColor: CAFE_RGBA(.06) }}>
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: CAFE }} />
                  Gratis hasta que la publiques
                </span>
              </Reveal>

              <Reveal delay={0.1}>
                <h1 className="leading-[.95]">
                  <span className="font-script block text-5xl sm:text-6xl mb-3" style={{ color: CAFE }}>Tu gran día</span>
                  <span className="font-display font-light block text-4xl sm:text-5xl lg:text-[4.2rem]" style={{ color: TINTA }}>
                    Hay cosas que no se mandan
                  </span>
                  <span className="font-display font-light italic block text-4xl sm:text-5xl lg:text-[4.2rem]" style={{ color: CAFE }}>
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
                    style={{ backgroundColor: CAFE, paddingTop: '1.15rem', paddingBottom: '1.15rem', boxShadow: '0 18px 40px -18px rgba(166,122,104,.65)' }}>
                    Crear mi invitación gratis
                  </Link>
                  <a href="#momentos" className="etiqueta pb-1 border-b transition-opacity hover:opacity-60" style={{ color: TINTA, borderColor: ORO }}>
                    Ver ejemplos
                  </a>
                </div>
              </Reveal>

              <Reveal delay={0.4}>
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 justify-center lg:justify-start etiqueta" style={{ fontSize: 9, color: TINTA_SUAVE }}>
                  <span>Sin tarjeta</span><span>·</span><span>Un solo pago</span><span>·</span><span>Cambios ilimitados</span>
                </div>
              </Reveal>
            </div>
          </motion.div>

          <div className="relative overflow-hidden order-1 lg:order-2 min-h-[62svh] lg:min-h-0">
            <motion.img style={{ y: fotoHeroY }} src={FOTO.hero} alt="" aria-hidden="true" className="kenburns absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(100deg, color-mix(in srgb, var(--nieve) 95%, transparent) 0%, color-mix(in srgb, var(--nieve) 25%, transparent) 22%, transparent 48%)' }} />
            <div className="absolute inset-0 lg:hidden" style={{ background: 'linear-gradient(180deg, transparent 45%, color-mix(in srgb, var(--nieve) 90%, transparent) 100%)' }} />

            <motion.div initial={{ opacity: 0, scale: .9, y: 30 }} animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 1.3, delay: .4, ease: [0.22, 1, 0.36, 1] }}
              className="relative h-full flex flex-col items-center justify-center gap-6 py-14">

              <div className="relative w-[270px] sm:w-[300px] h-[430px] sm:h-[460px] perspectiva">
                <motion.div className="absolute left-0 right-0 rounded-sm overflow-hidden"
                  style={{ top: 130, height: 295, zIndex: 2, backgroundColor: NIEVE, boxShadow: '0 35px 70px -25px rgba(67,48,43,.55)' }}
                  animate={fase === 'cerrado' ? { y: 0, opacity: 0 } : { y: -120, opacity: 1 }}
                  transition={{ duration: 1.1, delay: fase === 'abriendo' ? .55 : 0, ease: [0.22, 1, 0.36, 1] }}>
                  <img src={FOTO.papeleria} alt="" aria-hidden="true" className="absolute inset-0 w-full h-full object-cover opacity-[.1]" />
                  <div className="absolute inset-3 border pointer-events-none" style={{ borderColor: CAFE_RGBA(.5) }} />
                  <div className="relative h-full flex flex-col items-center justify-center text-center px-6">
                    <span className="etiqueta" style={{ color: CAFE }}>Nos casamos</span>
                    <p className="font-display text-4xl font-light leading-tight mt-2" style={{ color: TINTA }}>
                      Brisa<span className="font-script text-2xl block my-0.5" style={{ color: CAFE }}>y</span>Bruno
                    </p>
                    <div className="oro-linea w-20 my-4" />
                    {restante && (
                      <div className="flex gap-3.5 justify-center">
                        {[['días', restante.d], ['hrs', restante.h], ['min', restante.m], ['seg', restante.s]].map(([k, v]) => (
                          <div key={k} className="flex flex-col items-center">
                            <span className="font-display text-xl" style={{ color: CAFE }}>{String(v).padStart(2, '0')}</span>
                            <span className="etiqueta" style={{ color: TINTA_SUAVE, fontSize: 8 }}>{k}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>

                <div className="absolute left-0 right-0 rounded-sm" style={{ top: 130, height: 295, zIndex: 3, backgroundColor: CREMA, boxShadow: '0 35px 70px -25px rgba(67,48,43,.6)' }}>
                  <div className="absolute inset-x-0 top-0" style={{ height: 148, backgroundColor: ARENA, clipPath: 'polygon(0 0, 50% 62%, 100% 0)' }} />
                  <div className="absolute inset-3 border pointer-events-none" style={{ borderColor: CAFE_RGBA(.4) }} />
                </div>

                <motion.div className="absolute left-0 right-0 origin-top"
                  style={{ top: 130, height: 162, zIndex: fase === 'cerrado' ? 5 : 1, transformStyle: 'preserve-3d' }}
                  animate={{ rotateX: fase === 'cerrado' ? 0 : -168 }}
                  transition={{ duration: .9, ease: [0.65, 0, 0.35, 1] }}>
                  <div className="absolute inset-0" style={{ backgroundColor: P3, clipPath: 'polygon(0 0, 100% 0, 50% 100%)' }} />
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
                            style={{ border: `2px solid ${CAFE}` }}
                            animate={{ scale: [1, 1.55], opacity: [0.55, 0] }}
                            transition={{ duration: 2.6, repeat: Infinity, ease: 'easeOut' }}
                            aria-hidden="true"
                          />
                        )}
                        <motion.span
                          className="relative w-24 h-24 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: CAFE, boxShadow: '0 12px 34px -8px rgba(166,122,104,.85)' }}
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
                    <button type="button" onClick={alternarMusica} className="etiqueta flex items-center gap-2 hover:opacity-60 transition-opacity cursor-pointer" style={{ color: TINTA }}>
                      <span className="flex gap-[2px] items-end h-3 w-4" aria-hidden="true">
                        {[0, 1, 2, 3].map((b) => (
                          <motion.span key={b} animate={sonando && !sinMovimiento ? { scaleY: [0.25, 1, 0.25] } : { scaleY: 0.3 }}
                            transition={{ duration: .7, repeat: Infinity, delay: b * .14 }}
                            className="w-[2px] h-full block rounded-full origin-bottom" style={{ backgroundColor: CAFE }} />
                        ))}
                      </span>
                      {sonando ? 'Pausar' : 'Reanudar'}
                    </button>
                    <Link href="/bruno-y-brisa" className="etiqueta hover:opacity-60 transition-opacity" style={{ color: CAFE }}>Ver completa →</Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </header>

        {/* ═══════════════════ MARQUESINA ═══════════════════ */}
        <Marquesina />

        {/* ═══════════════════ FRASES FIJADAS AL SCROLL ═══════════════════ */}
        <FrasesFijas />

        {/* ═══════════════════ TIRA DE DATOS ═══════════════════ */}
        <section style={{ backgroundColor: OSCURO }} className="py-8">
          <div className="max-w-6xl mx-auto px-5 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[['5', 'tipos de celebración'], ['1', 'solo pago, sin mensualidades'], ['∞', 'cambios después de publicar'], ['0', 'apps que instalar']].map(([n, t], i) => (
              <Reveal key={t} delay={i * 0.1} y={18}>
                <span className="font-display text-4xl block text-white">{n}</span>
                <span className="etiqueta" style={{ fontSize: 9, color: 'rgba(255,255,255,.72)' }}>{t}</span>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ═══════════════════ MOMENTOS con parallax ═══════════════════ */}
        <section id="momentos" className="py-24 md:py-32">
          <div className="max-w-6xl mx-auto px-5">
            <Reveal className="text-center space-y-3 mb-20">
              <span className="etiqueta block" style={{ color: CAFE }}>Momentos</span>
              <h2 className="font-display text-4xl md:text-6xl font-light leading-tight">
                El día llega una vez.<br />
                <span className="italic" style={{ color: CAFE }}>La espera dura meses.</span>
              </h2>
            </Reveal>

            <div className="space-y-24 md:space-y-32">
              {MOMENTOS.map((m, i) => (
                <div key={m.frase} className={`grid md:grid-cols-2 gap-10 md:gap-16 items-center ${i % 2 ? 'md:[direction:rtl]' : ''}`}>
                  <div className="md:[direction:ltr]">
                    <FotoParallax src={m.img} alt={m.frase} className="aspect-[4/5] md:aspect-[3/4] rounded-sm" fuerza={70} />
                  </div>
                  <Reveal delay={0.12} className="md:[direction:ltr] space-y-5 text-center md:text-left">
                    <span className="font-display text-6xl md:text-7xl font-light block leading-none" style={{ color: CAFE_RGBA(.18) }}>0{i + 1}</span>
                    <h3 className="font-script text-4xl md:text-5xl" style={{ color: CAFE }}>{m.frase}</h3>
                    <div className="oro-linea w-24 mx-auto md:mx-0" />
                    <p className="font-display text-2xl md:text-3xl font-light leading-snug" style={{ color: TINTA }}>{m.linea}</p>
                  </Reveal>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════ ASÍ SE VE: demo en teléfono ═══════════════════ */}
        <section id="invitacion" className="py-24 md:py-32" style={{ backgroundColor: CREMA_SUAVE }}>
          <div className="max-w-6xl mx-auto px-5 grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1 space-y-8">
              <Reveal className="space-y-3">
                <span className="etiqueta block" style={{ color: CAFE }}>Así lo viven tus invitados</span>
                <h2 className="font-display text-4xl md:text-5xl font-light leading-tight">Se abre, suena<br />y confirma sola.</h2>
                <p className="text-sm font-light" style={{ color: GRIS }}>Pruébala aquí mismo: raspa la fecha, confirma y mira cómo celebra.</p>
              </Reveal>
              {[
                { t: 'Tocan el sello y se abre', d: 'La animación arranca y la música empieza a sonar. Nadie olvida esa entrada.' },
                { t: 'Raspan la fecha y confirman', d: 'Descubren el día en tres toques y confirman ahí mismo, sin formularios eternos.' },
                { t: 'Llegan sin llamarte', d: 'Mapa directo, horarios, código de vestimenta y mesa de regalos en el mismo link.' },
              ].map((f, i) => (
                <Reveal key={f.t} delay={0.12 * (i + 1)} className="flex gap-5">
                  <span className="font-display text-2xl shrink-0 w-10 h-10 rounded-full flex items-center justify-center border" style={{ color: CAFE, borderColor: CAFE_RGBA(.35) }}>{i + 1}</span>
                  <div className="space-y-1">
                    <h3 className="font-display text-xl">{f.t}</h3>
                    <p className="text-sm font-light leading-relaxed" style={{ color: GRIS }}>{f.d}</p>
                  </div>
                </Reveal>
              ))}
              <Reveal delay={0.5}>
                <Link href="/bruno-y-brisa" className="inline-block etiqueta pb-1 border-b transition-opacity hover:opacity-60" style={{ color: CAFE, borderColor: CAFE }}>
                  Abrir un ejemplo real →
                </Link>
              </Reveal>
            </div>

            <Reveal y={50} className="order-1 lg:order-2 flex justify-center">
              <DemoTelefono restante={restante} />
            </Reveal>
          </div>
        </section>

        {/* ═══════════════════ PLANTILLAS ═══════════════════ */}
        <section id="plantillas" className="py-24 md:py-32">
          <div className="max-w-7xl mx-auto px-5">
            <Reveal className="text-center space-y-3 mb-14">
              <span className="etiqueta block" style={{ color: CAFE }}>Elige tu favorita</span>
              <h2 className="font-display text-4xl md:text-5xl font-light">Diseños para cada estilo</h2>
              <p className="text-sm font-light max-w-md mx-auto" style={{ color: GRIS }}>Todas se adaptan a tus colores, tu tipografía y tus fotos. Toca una para abrir su sobre.</p>
            </Reveal>

            <PlantillasSection />

            <Reveal delay={0.2} className="text-center mt-12">
              <Link href="/crear" className="inline-block etiqueta text-white px-10 py-4 rounded-full transition-transform hover:scale-[1.05]" style={{ backgroundColor: CAFE }}>
                Probar una gratis
              </Link>
            </Reveal>
          </div>
        </section>

        {/* ═══════════════════ SELECTOR DE APERTURA ═══════════════════ */}
        <section id="apertura" className="py-24 md:py-32" style={{ backgroundColor: CREMA_SUAVE }}>
          <div className="max-w-6xl mx-auto px-5">
            <Reveal className="text-center space-y-3 mb-14">
              <span className="etiqueta block" style={{ color: CAFE }}>Cada invitación, su ritual</span>
              <h2 className="font-display text-4xl md:text-5xl font-light">Elige cómo se abre la tuya</h2>
              <p className="text-sm font-light max-w-md mx-auto" style={{ color: GRIS }}>El mismo motor, cuatro entradas distintas. Prueba cada una tocando para abrir.</p>
            </Reveal>
            <SelectorApertura />
          </div>
        </section>

        {/* ═══════════════════ PASE CON VOZ ═══════════════════ */}
        <section id="pase" className="py-24 md:py-32">
          <div className="max-w-3xl mx-auto px-5">
            <Reveal className="text-center space-y-3 mb-12">
              <span className="etiqueta block" style={{ color: CAFE }}>El detalle que hace llorar</span>
              <h2 className="font-display text-4xl md:text-5xl font-light">Su pase trae tu voz</h2>
              <p className="text-sm font-light max-w-md mx-auto" style={{ color: GRIS }}>Cada invitado arranca la tira de su pase y escucha un mensaje grabado por ustedes.</p>
            </Reveal>
            <Reveal y={40}>
              <PaseVoz />
            </Reveal>
          </div>
        </section>

        {/* ═══════════════════ MESA DE REGALOS ═══════════════════ */}
        <section id="mesa" className="py-24 md:py-32" style={{ backgroundColor: CREMA_SUAVE }}>
          <div className="max-w-3xl mx-auto px-5">
            <Reveal className="text-center space-y-3 mb-12">
              <span className="etiqueta block" style={{ color: CAFE }}>Mesa de regalos</span>
              <h2 className="font-display text-4xl md:text-5xl font-light">Se llena sola, sin repetidos</h2>
              <p className="text-sm font-light max-w-md mx-auto" style={{ color: GRIS }}>Cada regalo muestra cuánto lleva reunido y quién lo apartó. Toca aportar y mira cómo se mueve la barra.</p>
            </Reveal>
            <Reveal y={40}>
              <MesaRegalos />
            </Reveal>
          </div>
        </section>

        {/* ═══════════════════ LOUNGE DE MÚSICA ═══════════════════ */}
        <section id="musica" className="py-24 md:py-32">
          <div className="max-w-3xl mx-auto px-5">
            <Reveal className="text-center space-y-3 mb-12">
              <span className="etiqueta block" style={{ color: CAFE }}>La música de ustedes</span>
              <h2 className="font-display text-4xl md:text-5xl font-light">Suena desde el primer segundo</h2>
              <p className="text-sm font-light max-w-md mx-auto" style={{ color: GRIS }}>Cinco melodías incluidas en tu invitación, o sube la canción que es de ustedes.</p>
            </Reveal>
            <Reveal y={40}>
              <LoungeMusica />
            </Reveal>
          </div>
        </section>

        {/* ═══════════════════ TRES MOMENTOS ═══════════════════ */}
        <section className="py-24 md:py-32" style={{ backgroundColor: CREMA_SUAVE }}>
          <div className="max-w-6xl mx-auto px-5">
            <Reveal className="text-center space-y-3 mb-14">
              <span className="etiqueta block" style={{ color: CAFE }}>Tres momentos que nadie olvida</span>
              <h2 className="font-display text-4xl md:text-5xl font-light">La invitación no termina al leerla</h2>
            </Reveal>
            <TresMomentosSection />
          </div>
        </section>

        {/* ═══════════════════ CELEBRACIONES ═══════════════════ */}
        <section className="py-24 md:py-32">
          <div className="max-w-7xl mx-auto px-5">
            <Reveal className="text-center space-y-3 mb-14">
              <span className="etiqueta block" style={{ color: CAFE }}>Para toda ocasión</span>
              <h2 className="font-display text-4xl md:text-5xl font-light">Cada fiesta pide lo suyo</h2>
            </Reveal>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4">
              {CELEBRACIONES.map((c, i) => (
                <Reveal key={c.id} delay={i * 0.09} y={40}>
                  <Link href={`/crear?evento=${c.id}`} className="tarjeta-foto group relative aspect-[4/5] overflow-hidden rounded-sm block">
                    <img src={c.img} alt={c.n} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 transition-all duration-500 group-hover:opacity-80" style={{ backgroundColor: 'rgba(166,122,104,.55)' }} />
                    <div className="absolute inset-0 flex items-center justify-center p-3">
                      <h3 className="font-display text-xl md:text-2xl text-white text-center font-light leading-tight">{c.n}</h3>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════ CÓMO FUNCIONA ═══════════════════ */}
        <section id="como" className="py-24 md:py-32" style={{ backgroundColor: CREMA_SUAVE }}>
          <div className="max-w-6xl mx-auto px-5">
            <Reveal className="text-center space-y-3 mb-16">
              <span className="etiqueta block" style={{ color: CAFE }}>Es más fácil de lo que crees</span>
              <h2 className="font-display text-4xl md:text-5xl font-light">Tres pasos y ya la estás viendo</h2>
            </Reveal>
            <ol className="grid md:grid-cols-3 gap-12 md:gap-10">
              {PASOS.map((p, i) => (
                <Reveal key={p.n} delay={i * 0.16} y={40}>
                  <li className="text-center space-y-4">
                    <span className="font-display text-7xl font-light block leading-none" style={{ color: CAFE_RGBA(.25) }}>{p.n}</span>
                    <h3 className="font-display text-2xl font-light">{p.t}</h3>
                    <p className="text-sm font-light leading-relaxed max-w-xs mx-auto" style={{ color: GRIS }}>{p.d}</p>
                  </li>
                </Reveal>
              ))}
            </ol>
            <Reveal delay={0.3} className="text-center mt-16">
              <Link href="/crear" className="inline-block etiqueta text-white px-10 py-4 rounded-full transition-transform hover:scale-[1.05]" style={{ backgroundColor: CAFE }}>
                Empezar ahora
              </Link>
            </Reveal>
          </div>
        </section>

        {/* ═══════════════════ TESTIMONIOS ═══════════════════ */}
        <section id="opiniones" className="py-24 md:py-32">
          <div className="max-w-6xl mx-auto px-5">
            <Reveal className="text-center space-y-3 mb-14">
              <span className="etiqueta block" style={{ color: CAFE }}>Lo que dicen</span>
              <h2 className="font-display text-4xl md:text-5xl font-light">Novias que ya la usaron</h2>
            </Reveal>
            <TestimoniosSection />
          </div>
        </section>

        {/* ═══════════════════ PRECIOS ═══════════════════ */}
        <section id="precios" className="py-24 md:py-32" style={{ backgroundColor: CREMA_SUAVE }}>
          <div className="max-w-6xl mx-auto px-5">
            <Reveal className="text-center space-y-3 mb-14">
              <span className="etiqueta block" style={{ color: CAFE }}>Nuestros planes</span>
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
                        backgroundColor: top ? CAFE : NIEVE,
                        borderColor: top ? CAFE : CAFE_RGBA(.25),
                        color: top ? '#fff' : TINTA,
                        boxShadow: top ? '0 35px 70px -28px rgba(166,122,104,.55)' : 'none',
                      }}>
                      {top && (
                        <span className="etiqueta absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full whitespace-nowrap" style={{ backgroundColor: OSCURO, color: '#fff' }}>
                          El más elegido
                        </span>
                      )}
                      <div className="space-y-5">
                        <h3 className="font-display text-3xl font-light">{p.nombre}</h3>
                        <div>
                          <span className="text-xs line-through" style={{ color: top ? 'rgba(255,255,255,.55)' : TINTA_SUAVE }}>{formatearPesos(p.precioAntes)}</span>
                          <div className="font-display text-5xl font-light leading-none mt-1">
                            {formatearPesos(p.precio)}
                            <span className="etiqueta ml-2" style={{ color: top ? 'rgba(255,255,255,.6)' : TINTA_SUAVE }}>mxn</span>
                          </div>
                        </div>
                        <p className="text-sm font-light leading-relaxed" style={{ color: top ? 'rgba(255,255,255,.8)' : GRIS }}>{p.resumen}</p>
                        <div className="oro-linea w-full" />
                        <ul className="space-y-2.5">
                          {p.incluye.map((f) => (
                            <li key={f} className="flex gap-3 text-sm font-light leading-snug">
                              <span style={{ color: top ? ROSA : CAFE }}>✓</span>
                              <span style={{ color: top ? 'rgba(255,255,255,.9)' : TINTA }}>{f}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <Link href={`/crear?plan=${id}`} className="etiqueta text-center mt-9 py-4 rounded-full transition-transform hover:scale-[1.04]"
                        style={{ backgroundColor: top ? NIEVE : CAFE, color: top ? CAFE : '#fff' }}>
                        Empezar gratis
                      </Link>
                    </div>
                  </Reveal>
                );
              })}
            </div>

            <Reveal delay={0.2} className="mt-10">
              <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-center rounded-2xl px-6 py-5" style={{ backgroundColor: NIEVE, border: `1px solid ${CAFE_RGBA(.3)}` }}>
                {['Pago único, sin mensualidades', 'Invitados ilimitados al mismo precio', 'Cambios ilimitados hasta el día del evento'].map((g) => (
                  <span key={g} className="flex items-center gap-2 text-sm font-light" style={{ color: TINTA }}>
                    <span style={{ color: CAFE }}>✓</span> {g}
                  </span>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* ═══════════════════ PREGUNTAS ═══════════════════ */}
        <section className="max-w-3xl mx-auto px-5 py-24 md:py-32">
          <Reveal className="text-center space-y-3 mb-12">
            <span className="etiqueta block" style={{ color: CAFE }}>Dudas frecuentes</span>
            <h2 className="font-display text-4xl md:text-5xl font-light">Lo que más nos preguntan</h2>
          </Reveal>
          <div className="divide-y" style={{ borderColor: CAFE_RGBA(.2) }}>
            {PREGUNTAS.map((p, i) => (
              <Reveal key={p.q} delay={i * 0.07} y={20}>
                <div style={{ borderColor: CAFE_RGBA(.2) }}>
                  <button type="button" onClick={() => setFaq(faq === i ? null : i)} aria-expanded={faq === i}
                    className="w-full flex items-center justify-between gap-6 py-5 text-left cursor-pointer">
                    <span className="font-display text-xl md:text-2xl font-light">{p.q}</span>
                    <span className="text-2xl font-light shrink-0 transition-transform duration-300"
                      style={{ color: CAFE, transform: faq === i ? 'rotate(45deg)' : 'none' }} aria-hidden="true">+</span>
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

        {/* ═══════════════════ CIERRE ═══════════════════ */}
        <section className="relative py-28 md:py-36 text-center px-5 overflow-hidden" style={{ backgroundColor: OSCURO }}>
          <img src={FOTO.momentoUno} alt="" aria-hidden="true" className="kenburns absolute inset-0 w-full h-full object-cover opacity-[.16]" />
          <Reveal className="relative max-w-xl mx-auto space-y-7">
            <div className="oro-linea w-24 mx-auto" />
            <span className="font-script text-5xl block text-white">Ábrela tú primero</span>
            <h2 className="font-display text-4xl md:text-5xl font-light leading-tight" style={{ color: 'rgba(255,255,255,.92)' }}>Decides después de verla.</h2>
            <p className="text-sm font-light" style={{ color: 'rgba(255,255,255,.7)' }}>No pedimos tarjeta. Solo pagas si te enamora.</p>
            <Link href="/crear" className="inline-block etiqueta px-12 rounded-full transition-transform hover:scale-[1.05]"
              style={{ backgroundColor: NIEVE, color: CAFE, paddingTop: '1.15rem', paddingBottom: '1.15rem' }}>
              Crear mi invitación gratis
            </Link>
          </Reveal>
        </section>

        {/* ═══════════════════ PIE ═══════════════════ */}
        <footer style={{ backgroundColor: OSCURO, color: 'rgba(255,255,255,.55)' }} className="py-16">
          <div className="max-w-6xl mx-auto px-5 grid sm:grid-cols-2 gap-10">
            <div className="space-y-3">
              <a href="#inicio" className="flex items-center gap-2.5" aria-label="Volver al inicio">
                <span className="w-10 h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: CAFE }}>
                  <span className="font-script text-xl text-white leading-none pt-0.5">C&amp;P</span>
                </span>
                <span className="font-display text-3xl text-white">clicky<span style={{ color: ROSA }}>papel</span></span>
              </a>
              <p className="text-xs font-light max-w-xs">Invitaciones digitales para las celebraciones que sí se recuerdan.</p>
            </div>
            <div className="flex flex-col sm:items-end gap-3 etiqueta">
              <Link href="/crear" className="hover:text-white transition-colors">Crear invitación</Link>
              <Link href="/login" className="hover:text-white transition-colors">Entrar a mi panel</Link>
              <Link href="/privacidad" className="hover:text-white transition-colors">Aviso de privacidad</Link>
              <Link href="/terminos" className="hover:text-white transition-colors">Términos</Link>
              <a href="#inicio" className="hover:text-white transition-colors">↑ Volver arriba</a>
            </div>
          </div>
          <div className="max-w-6xl mx-auto px-5 mt-12 pt-6 border-t text-[11px] font-light" style={{ borderColor: 'rgba(255,255,255,.1)' }}>
            © {new Date().getFullYear()} ClickyPapel · Hecho en México
          </div>
        </footer>
      </div>

      {/* Barra fija solo en móvil */}
      <motion.div initial={{ y: 90 }} animate={{ y: 0 }} transition={{ delay: 1.2, duration: .7 }}
        className="md:hidden fixed bottom-0 left-0 right-0 z-[100] px-4 py-3 backdrop-blur-md border-t"
        style={{ backgroundColor: 'color-mix(in srgb, var(--nieve) 96%, transparent)', borderColor: CAFE_RGBA(.2) }}>
        <Link href="/crear" className="block text-center etiqueta text-white py-4 rounded-full" style={{ backgroundColor: CAFE }}>
          Crear mi invitación gratis
        </Link>
      </motion.div>
      <div className="md:hidden h-20" />
    </div>
  );
}
