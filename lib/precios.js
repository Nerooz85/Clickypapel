// ============================================================
// ClickyPapel · Fuente única de precios
// ------------------------------------------------------------
// Todo lo que muestre un precio importa de aquí: la landing,
// el registro, el checkout y el webhook. No dupliques números
// en ningún otro archivo.
//
// ⚠️  El campo `precio` DEBE coincidir con lo que realmente
//     cobra el Payment Link de Stripe. Si cambias uno, cambia
//     el otro el mismo día.
// ============================================================

export const PLANES = {
  basicos: {
    id: 'basicos',
    nombre: 'Digital Esencial',
    emoji: '💍',
    precio: 699,
    precioAntes: 1199,
    limiteFotos: 3,
    resumen: 'Tu invitación lista para compartir hoy mismo.',
    incluye: [
      'Enlace personalizado (tugrandia.icu/tu-evento)',
      'Cuenta regresiva animada',
      'Itinerario con mapas',
      'Portada y tema a elegir',
      'Galería de 3 fotos',
      'Confirmación de asistencia',
    ],
    stripeUrl: 'https://buy.stripe.com/14A28rd9NgZ14jd8jC6J201',
  },

  premium: {
    id: 'premium',
    nombre: 'Gran Día Premium',
    emoji: '🌟',
    precio: 1499,
    precioAntes: 1999,
    limiteFotos: 6,
    resumen: 'Control total de tus invitados en tiempo real.',
    incluye: [
      'Todo lo del plan Esencial',
      'Galería de 6 fotos',
      'Mesa de regalos o transferencia',
      'Música de fondo premium',
      'Pases exactos por familia',
      'Panel de confirmaciones en vivo',
    ],
    stripeUrl: 'https://buy.stripe.com/3cIcN5fhV5gjbLF43m6J200',
    destacado: true,
  },

  vip: {
    id: 'vip',
    nombre: 'VIP Celestial',
    emoji: '👑',
    precio: 3899,
    precioAntes: 4599,
    limiteFotos: 12,
    resumen: 'Nosotros la armamos por ti, de principio a fin.',
    incluye: [
      'Todo lo del plan Premium',
      'Asesoría uno a uno',
      'Maquetación por nuestro equipo',
      'Galería de hasta 12 fotos',
      'Música personalizada',
      'Secciones a la medida',
      'Soporte prioritario',
    ],
    stripeUrl: 'https://buy.stripe.com/fZucN52v98sv8zt9nG6J202',
  },
};

// Complemento opcional
export const PRECIO_MUSICA_PERSONALIZADA = 350;

// Orden en que se muestran en la landing
export const ORDEN_PLANES = ['basicos', 'premium', 'vip'];

export function obtenerPlan(id) {
  return PLANES[id] || PLANES.premium;
}

export function calcularTotal(planId, conMusicaExtra = false) {
  return obtenerPlan(planId).precio + (conMusicaExtra ? PRECIO_MUSICA_PERSONALIZADA : 0);
}

export function limiteFotos(planId) {
  return obtenerPlan(planId).limiteFotos;
}

export function formatearPesos(monto) {
  return `$${monto.toLocaleString('es-MX')}`;
}

// El Payment Link lleva el slug para que el webhook sepa
// qué invitación desbloquear cuando Stripe confirme el cobro.
export function enlaceDePago(planId, slug) {
  return `${obtenerPlan(planId).stripeUrl}?client_reference_id=${encodeURIComponent(slug)}`;
}

// Stripe manda centavos. El webhook usa esto para saber qué
// plan se pagó sin depender de números sueltos.
export function planPorMontoEnCentavos(centavos) {
  const ordenados = ORDEN_PLANES
    .map((id) => PLANES[id])
    .sort((a, b) => b.precio - a.precio);

  const encontrado = ordenados.find((p) => centavos >= p.precio * 100);
  return encontrado ? encontrado.id : 'basicos';
}
