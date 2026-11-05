export const WHATSAPP_NUMBER = '51948060499'

export const waLink = (text: string) => `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`

export const PRICE_NOTE =
  '$42 pago único, menos que una sesión de coaching · envío según tu ciudad, se confirma por WhatsApp'

export const PRICE_NOTE_EDITION =
  '$42 por agenda · el costo de envío varía entre Lima, provincias y otras regiones — se calcula y confirma por WhatsApp'

// Un solo video (combined.mp4 = portada/pasos + caminata + ediciones) y
// un solo <video> en el DOM (Experience.tsx) recorren TODA la
// experiencia, de inicio a fin: portada, los 4 pasos, la caminata y las
// 3 ediciones. Las fracciones se midieron con ffprobe sobre los 3 clips
// fuente antes de unirlos: steps-video 8.042667s, caminata (recortada)
// 6.625s, edicion-video 8.042667s, total combinado 22.625s.
export const COMBINED_VIDEO_SRC = `${import.meta.env.BASE_URL}video/combined.mp4`
export const HERO_VIDEO_FRACTION = 0.053322 // 0 .. acá = portada
export const STEPS_END_FRACTION = 0.355477 // acá = fin de "qué hay adentro"
export const WALK_END_FRACTION = 0.648295 // acá = fin de la caminata, empiezan las ediciones

// Mobile usa un video DISTINTO (vertical 9:16, generado para celular),
// de ~49.7s en vez de 10s — calculado con tiempo de lectura real (180
// palabras/min + piso de 1.8s por tarjeta): con solo 10s era IMPOSIBLE
// leer los 4 pasos completos sin apurar nada. 6 escenas separadas,
// unidas con ffmpeg, cada una con la duración exacta que toma leer su
// texto. El video corre SOLO como película (sin scroll-jacking), el
// texto cambia en sintonía con el TIEMPO real del video.
export const MOBILE_VIDEO_SRC = `${import.meta.env.BASE_URL}video/mobile-hero.mp4`
export const MOBILE_HERO_END_S = 4.0 // 0..4s = portada
export const MOBILE_STEPS_END_S = 39.6667 // 4..39.67s = los 4 pasos (duración = tiempo de lectura de cada uno)
export const MOBILE_WALK_END_S = 42.6667 // 39.67..42.67s = caminata, después empiezan las ediciones

export const HERO = {
  eyebrow: '',
  title: 'No necesitas otra app. Necesitas esto.',
  subtitle: 'Diez minutos para soltar lo que tu cabeza no deja de cargar.',
  ctaPrimary: 'Elige tu edición',
  ctaSecondary: 'Ver qué hay adentro',
  price: PRICE_NOTE,
}

export type Step = {
  id: string
  number: string
  title: string
  copy: string
  pageHeading: string
  pageDetail: string
}

export const STEPS: Step[] = [
  {
    id: 'metas',
    number: '01',
    title: 'Metas',
    copy: 'Escribes algo una sola vez y sabes, sin dudar, el día exacto en que lo cumpliste — se acaba la ansiedad de las metas vagas que nunca se cierran.',
    pageHeading: 'Visión del año',
    pageDetail: '3 áreas prioritarias · cómo quiero sentirme en diciembre · Q1 – Q4',
  },
  {
    id: 'habitos',
    number: '02',
    title: 'Hábitos',
    copy: 'Marcas la casilla con el lápiz en la mano y sientes que avanzaste, literal — esa sensación, siete veces por semana, es lo que te hace volver.',
    pageHeading: 'Ritual semanal',
    pageDetail: 'Cuadrícula de hábitos · "si fallé, ¿por qué?"',
  },
  {
    id: 'calendario',
    number: '03',
    title: 'Calendario',
    copy: 'Pasas de la vista de semana a la de mes y el alivio es inmediato: nada se te escapó, ahí está completo.',
    pageHeading: 'Plan del mes',
    pageDetail: 'Vista mensual simplificada · mi única prioridad este mes',
  },
  {
    id: 'revision',
    number: '04',
    title: 'Revisión',
    copy: 'Domingo en la noche, antes de cerrar: respondes tres preguntas ya impresas y cierras la semana sabiendo qué ajustar, no solo repitiendo.',
    pageHeading: 'Revisión mensual',
    pageDetail: '3 preguntas impresas, con respuestas de ejemplo ya escritas',
  },
]

export const EDITIONS = {
  medianoche: '#1c2b4a',
  arena: '#c9b896',
  terracota: '#b5694a',
} as const

export type EditionName = keyof typeof EDITIONS
export type EditionKey = EditionName

export const EDITION_LABELS: Record<EditionKey, string> = {
  medianoche: 'Medianoche',
  arena: 'Arena',
  terracota: 'Terracota',
}

export const EDITION_DESCRIPTIONS: Record<EditionKey, string> = {
  medianoche: 'Azul profundo · acabado mate',
  arena: 'Beige cálido · acabado mate',
  terracota: 'Tierra cálida · acabado mate',
}

export const EDITION = {
  heading: 'La Edición',
  subheading: 'Elige cantidad de cada edición y pide todo junto por WhatsApp — ahí confirmamos dirección y envío según tu ciudad.',
  numberNote: 'Cada Rumbo lleva su número de edición — la tuya sería la № 000 de un tiraje limitado.',
  price: PRICE_NOTE_EDITION,
  ctaPrefix: 'Pedir',
}

export const PACKAGING = {
  text: 'Llega envuelta en papel, con un sello y una nota escrita a mano. Antes de abrir la agenda, ya empezaste el ritual.',
}

// Texto corto a propósito: en mobile este mensaje vive dentro de la
// ventana de la caminata del video (~3s, ver MOBILE_WALK_END_S en
// Experience.tsx) — no hay tiempo de leer un párrafo largo ahí.
export const PAUSE = {
  eyebrow: 'Antes de seguir —',
  text: 'Respira. Ya cerraste algo hoy.',
}

// Plantilla de demo — nombres ficticios y fotos de stock (randomuser.me, libres para mockups).
// Reemplazar por testimonios y fotos reales de tus primeros compradores antes de publicar.
export const TESTIMONIALS = [
  {
    id: 1,
    name: 'María Fernanda R.',
    place: 'Lima',
    avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
    quote:
      'Compré tres planners distintos este año y los dejé todos a la mitad. Con Rumbo ya llevo 40 días seguidos — no tengo que decidir nada, solo abrir y escribir.',
  },
  {
    id: 2,
    name: 'Jorge L.',
    place: 'Lima',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    quote: 'El empaque ya me puso de buen humor antes de abrir la agenda. Se siente como un regalo que me hice yo mismo.',
  },
  {
    id: 3,
    name: 'Camila S.',
    place: 'Trujillo',
    avatar: 'https://randomuser.me/api/portraits/women/45.jpg',
    quote: 'La cuadrícula de hábitos es lo que me ha hecho volver cada domingo. Ver las casillas marcadas pesa más que cualquier app.',
  },
  {
    id: 4,
    name: 'Andrés P.',
    place: 'Arequipa',
    avatar: 'https://randomuser.me/api/portraits/men/51.jpg',
    quote: 'Pedí la edición Terracota sin pensarlo. Llegó en una semana a provincia y el envío fue justo lo que me confirmaron por WhatsApp, sin sorpresas.',
  },
]

export const FOR_WHOM = {
  heading: '¿Es para ti?',
  yes: {
    label: 'Es para ti si…',
    items: [
      'Quieres diez minutos de orden, no otra app que abandonar.',
      'Prefieres escribir a mano y sentir el avance.',
      'Ya intentaste planners genéricos y los dejaste a la mitad.',
      'Buscas un ritual simple, no un sistema complicado.',
    ],
  },
  no: {
    label: 'Mejor espera si…',
    items: [
      'Necesitas un sistema 100% digital y sincronizado.',
      'No tienes diez minutos al día para dedicarle.',
      'Buscas algo desechable y barato.',
      'Prefieres que alguien más te organice el día.',
    ],
  },
}

export const CLOSING = {
  text: 'Te escribo yo mismo para confirmar los detalles de tu edición. Respondo personalmente en menos de 2 horas.',
  guarantee: 'Garantía de 30 días.',
}
