import { useLayoutEffect, useRef, useState } from 'react'
import {
  COMBINED_VIDEO_SRC,
  EDITION,
  EDITION_DESCRIPTIONS,
  EDITION_LABELS,
  EDITIONS,
  HERO,
  HERO_VIDEO_FRACTION,
  MOBILE_VIDEO_SRC,
  STEPS,
  STEPS_END_FRACTION,
  WALK_END_FRACTION,
  waLink,
  type EditionName,
} from '../content'
import { gsap, ScrollTrigger } from '../lib/smoothScroll'
import './journey.css'
import './hero.css'
import './fallback.css'

const EDITION_NAMES = Object.keys(EDITIONS) as EditionName[]

// Cortes del video ponderados por la cantidad de palabras de cada paso —
// un paso con más texto tarda más en leerse, así que debe ocupar más
// duración de video. STEP_BOUNDARIES[i] es el punto (0..1) de progreso
// DENTRO de los pasos (no del total) donde empieza el paso i.
const STEP_BOUNDARIES = (() => {
  const counts = STEPS.map((s) => s.copy.trim().split(/\s+/).length)
  const total = counts.reduce((a, b) => a + b, 0)
  const bounds = [0]
  let acc = 0
  counts.forEach((c) => {
    acc += c / total
    bounds.push(acc)
  })
  bounds[bounds.length - 1] = 1
  return bounds
})()

function indexForProgress(boundaries: number[], p: number) {
  for (let i = boundaries.length - 2; i >= 0; i--) {
    if (p >= boundaries[i]) return i
  }
  return 0
}

const EDITION_BOUNDARIES = (() => {
  const bounds = [0]
  for (let i = 1; i <= EDITION_NAMES.length; i++) bounds.push(i / EDITION_NAMES.length)
  return bounds
})()

// Toda la experiencia -- portada, los 4 pasos, la caminata y las 3
// ediciones -- vive en UN SOLO track pineado con UN SOLO <video>. Antes
// eran dos componentes con dos elementos <video> distintos (apuntando al
// mismo archivo, matemáticamente sincronizados) y aun así se notaba un
// corte real entre ambos al cambiar de uno a otro. Con un solo elemento
// no hay nada que cambiar: es la misma cámara, de principio a fin.
const TOTAL_UNITS = 1 + STEPS.length + 1 + EDITION_NAMES.length
const HERO_UNIT_END = 1 / TOTAL_UNITS
const STEPS_UNIT_END = (1 + STEPS.length) / TOTAL_UNITS
const WALK_UNIT_END = (1 + STEPS.length + 1) / TOTAL_UNITS

export default function Experience() {
  // -1 mientras no corresponde: ningún slide coincide con ese índice, así
  // que las diapositivas quedan ocultas hasta que el scroll entra de
  // verdad en esa fase.
  const [activeStep, setActiveStep] = useState(-1)
  const [activeEditionIndex, setActiveEditionIndex] = useState(-1)
  const [qty, setQty] = useState<Record<EditionName, number>>({ medianoche: 0, arena: 0, terracota: 0 })

  const wrapRef = useRef<HTMLDivElement>(null)
  const pinRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const heroContentRef = useRef<HTMLDivElement>(null)
  const stepsHudRef = useRef<HTMLDivElement>(null)
  const editionsHudRef = useRef<HTMLDivElement>(null)

  const changeQty = (name: EditionName, delta: number) =>
    setQty((q) => ({ ...q, [name]: Math.max(0, q[name] + delta) }))
  const cartItems = EDITION_NAMES.filter((name) => qty[name] > 0)
  const cartTotal = cartItems.reduce((sum, name) => sum + qty[name], 0)
  const cartMessage = `Hola, quiero pedir: ${cartItems
    .map((name) => `${qty[name]} Rumbo ${EDITION_LABELS[name]}`)
    .join(', ')}`
  const activeEdition = EDITION_NAMES[Math.max(activeEditionIndex, 0)]

  useLayoutEffect(() => {
    const mm = gsap.matchMedia()

    // Pin + scrub a pantalla completa en TODOS los anchos (incluido mobile):
    // es una sola cámara, de principio a fin, no una lista de clips. Solo
    // se desactiva con prefers-reduced-motion (accesibilidad, no tamaño de
    // pantalla).
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const cleanups: Array<() => void> = []
      const video = videoRef.current
      // En mobile el scrubbing frame-a-frame se sentía "a saltos" incluso
      // con el video liviano — en vez de clavar el currentTime a la
      // posición del scroll, ahí el video corre SOLO en loop (como un
      // video de verdad) y el scroll únicamente decide qué texto se ve
      // encima. En desktop sigue siendo scrubbing fino sobre combined.mp4.
      const isMobile = window.matchMedia('(max-width: 767px)').matches

      if (isMobile && video) {
        video.loop = true
        video.play?.().catch(() => {})
      }

      // La visibilidad de cada fase se decide siempre (no depende de que
      // el video ya haya cargado) — solo el currentTime del video espera
      // a tener duration, para no desincronizarse una vez cargue.
      const applyFrame = (p: number) => {
        const duration = video?.duration
        const setVideoTime = (desktopFraction: number) => {
          if (isMobile || !video || !duration) return
          video.currentTime = desktopFraction * duration
        }

        if (p < HERO_UNIT_END) {
          const heroProgress = p / HERO_UNIT_END
          gsap.set(heroContentRef.current, {
            opacity: 1 - heroProgress,
            scale: 1 - 0.08 * heroProgress,
            y: -70 * heroProgress,
            pointerEvents: heroProgress > 0.9 ? 'none' : 'auto',
          })
          gsap.set(stepsHudRef.current, { opacity: 0, pointerEvents: 'none' })
          gsap.set(editionsHudRef.current, { opacity: 0, pointerEvents: 'none' })
          setActiveStep(-1)
          setActiveEditionIndex(-1)
          setVideoTime(heroProgress * HERO_VIDEO_FRACTION)
        } else if (p < STEPS_UNIT_END) {
          const stepsProgress = (p - HERO_UNIT_END) / (STEPS_UNIT_END - HERO_UNIT_END)
          gsap.set(heroContentRef.current, { opacity: 0, pointerEvents: 'none' })
          gsap.set(stepsHudRef.current, { opacity: 1, pointerEvents: 'auto' })
          gsap.set(editionsHudRef.current, { opacity: 0, pointerEvents: 'none' })
          setActiveStep(indexForProgress(STEP_BOUNDARIES, stepsProgress))
          setActiveEditionIndex(-1)
          setVideoTime(HERO_VIDEO_FRACTION + stepsProgress * (STEPS_END_FRACTION - HERO_VIDEO_FRACTION))
        } else if (p < WALK_UNIT_END) {
          const walkProgress = (p - STEPS_UNIT_END) / (WALK_UNIT_END - STEPS_UNIT_END)
          gsap.set(heroContentRef.current, { opacity: 0, pointerEvents: 'none' })
          gsap.set(stepsHudRef.current, { opacity: 0, pointerEvents: 'none' })
          gsap.set(editionsHudRef.current, { opacity: 0, pointerEvents: 'none' })
          setActiveStep(-1)
          setActiveEditionIndex(-1)
          setVideoTime(STEPS_END_FRACTION + walkProgress * (WALK_END_FRACTION - STEPS_END_FRACTION))
        } else {
          const editionsProgress = (p - WALK_UNIT_END) / (1 - WALK_UNIT_END)
          gsap.set(heroContentRef.current, { opacity: 0, pointerEvents: 'none' })
          gsap.set(stepsHudRef.current, { opacity: 0, pointerEvents: 'none' })
          gsap.set(editionsHudRef.current, { opacity: 1, pointerEvents: 'auto' })
          setActiveStep(-1)
          setActiveEditionIndex(indexForProgress(EDITION_BOUNDARIES, editionsProgress))
          setVideoTime(WALK_END_FRACTION + editionsProgress * (1 - WALK_END_FRACTION))
        }
      }

      if (wrapRef.current && pinRef.current) {
        const masterTrigger = ScrollTrigger.create({
          trigger: wrapRef.current,
          start: 'top top',
          end: 'bottom bottom',
          pin: pinRef.current,
          scrub: true,
          onUpdate: (self) => applyFrame(self.progress),
        })
        applyFrame(masterTrigger.progress)
        cleanups.push(() => masterTrigger.kill())

        if (video) {
          const onLoaded = () => applyFrame(masterTrigger.progress)
          video.addEventListener('loadedmetadata', onLoaded)
          cleanups.push(() => video.removeEventListener('loadedmetadata', onLoaded))
        }
      }

      return () => cleanups.forEach((fn) => fn())
    })

    // Reduced-motion: sin pin ni scroll-jacking — el video de portada es
    // un banner en loop acotado solo a SU tramo, todo el contenido queda
    // apilado y estático.
    mm.add('(prefers-reduced-motion: reduce)', () => {
      gsap.set(heroContentRef.current, { clearProps: 'all' })
      const video = videoRef.current
      if (!video) return
      // En mobile el video YA es un solo plano corto (ver MOBILE_VIDEO_SRC):
      // se loopea completo. En desktop sigue siendo combined.mp4, así que
      // el loop se acota solo a la portada (HERO_VIDEO_FRACTION).
      const isMobile = window.matchMedia('(max-width: 767px)').matches

      const onLoaded = () => {
        if (video.duration) video.currentTime = 0
      }
      const onTimeUpdate = () => {
        const loopEnd = isMobile ? video.duration : HERO_VIDEO_FRACTION * video.duration
        if (video.duration && video.currentTime >= loopEnd - 0.05) {
          video.currentTime = 0
        }
      }
      video.addEventListener('loadedmetadata', onLoaded)
      video.addEventListener('timeupdate', onTimeUpdate)
      video.play?.().catch(() => {})

      return () => {
        video.removeEventListener('loadedmetadata', onLoaded)
        video.removeEventListener('timeupdate', onTimeUpdate)
      }
    })

    return () => mm.revert()
  }, [])

  return (
    <>
      <section ref={wrapRef} className="cine-wrap" style={{ height: `${TOTAL_UNITS * 100}vh` }} id="hero">
        <span id="recorrido" className="journey-anchor" style={{ top: `${HERO_UNIT_END * 100}%` }} aria-hidden="true" />
        <span id="edicion" className="journey-anchor" style={{ top: `${WALK_UNIT_END * 100}%` }} aria-hidden="true" />

        <div ref={pinRef} className="cine-pin">
          {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
          <video ref={videoRef} className="cine-video" muted playsInline preload="auto">
            <source src={MOBILE_VIDEO_SRC} media="(max-width: 767px)" />
            <source src={COMBINED_VIDEO_SRC} />
          </video>
          <div className="cine-scrim" aria-hidden="true" />

          <div ref={heroContentRef} className="hero-content">
            {HERO.eyebrow && <span className="eyebrow">{HERO.eyebrow}</span>}
            <h1>{HERO.title}</h1>
            <p className="subtitle">{HERO.subtitle}</p>
            <div className="cta-row">
              <a className="cta cta-primary" href="#edicion">
                {HERO.ctaPrimary}
              </a>
              <a className="cta cta-ghost" href="#recorrido">
                {HERO.ctaSecondary}
              </a>
            </div>
          </div>

          <div ref={stepsHudRef} className="cine-hud">
            <h2 className="sr-only">Qué hay adentro</h2>
            <span className="cine-kicker">
              Paso {String(Math.max(activeStep, 0) + 1).padStart(2, '0')} de {String(STEPS.length).padStart(2, '0')}
            </span>
            <div className="cine-progress" aria-hidden="true">
              <span style={{ width: `${STEP_BOUNDARIES[Math.max(activeStep, 0) + 1] * 100}%` }} />
            </div>
          </div>
          <div className="cine-slides">
            {STEPS.map((s, i) => (
              <div key={s.id} className={i === activeStep ? 'cine-slide active' : 'cine-slide'}>
                <span className="cine-slide-num" aria-hidden="true">
                  {s.number}
                </span>
                <h3>{s.title}</h3>
                <p>{s.copy}</p>
              </div>
            ))}
          </div>

          <div ref={editionsHudRef} className="cine-hud">
            <h2 className="sr-only">La Edición</h2>
            <span className="cine-kicker">
              Edición {String(Math.max(activeEditionIndex, 0) + 1).padStart(2, '0')} de{' '}
              {String(EDITION_NAMES.length).padStart(2, '0')}
            </span>
            <div className="cine-progress" aria-hidden="true">
              <span style={{ width: `${EDITION_BOUNDARIES[Math.max(activeEditionIndex, 0) + 1] * 100}%` }} />
            </div>
          </div>
          <div className="cine-slides">
            {EDITION_NAMES.map((name, i) => (
              <div key={name} className={i === activeEditionIndex ? 'cine-slide active' : 'cine-slide'}>
                <span className="cine-slide-dot" style={{ background: EDITIONS[name] }} aria-hidden="true" />
                <h3>{EDITION_LABELS[name]}</h3>
                <p>{EDITION_DESCRIPTIONS[name]}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="fallback-edicion-list">
        <div className="edicion-lead">
          <h2>{EDITION.heading}</h2>
          <p className="edicion-subheading">{EDITION.subheading}</p>
        </div>

        <div className="ed-list">
          {EDITION_NAMES.map((name) => (
            <div className={name === activeEdition ? 'ed-row active' : 'ed-row'} key={name}>
              <button type="button" className="ed-row-main" onClick={() => setActiveEditionIndex(EDITION_NAMES.indexOf(name))}>
                <span className="ed-row-dot" style={{ background: EDITIONS[name] }} aria-hidden="true" />
                <span className="ed-row-text">
                  <span className="ed-name">{EDITION_LABELS[name]}</span>
                  <span className="ed-desc">{EDITION_DESCRIPTIONS[name]}</span>
                </span>
              </button>

              <div className="ed-qty">
                <button
                  type="button"
                  disabled={qty[name] === 0}
                  onClick={() => changeQty(name, -1)}
                  aria-label={`Reducir cantidad de ${EDITION_LABELS[name]}`}
                >
                  –
                </button>
                <span>{qty[name]}</span>
                <button type="button" onClick={() => changeQty(name, 1)} aria-label={`Aumentar cantidad de ${EDITION_LABELS[name]}`}>
                  +
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className={cartTotal > 0 ? 'ed-cart has-items' : 'ed-cart'}>
          <div className="ed-cart-summary">
            {cartTotal === 0 ? (
              <span className="ed-cart-empty">Elige cantidad de cada edición que quieras llevar.</span>
            ) : (
              <>
                {cartItems.map((name) => (
                  <span className="ed-cart-chip" key={name}>
                    {EDITION_LABELS[name]} × {qty[name]}
                  </span>
                ))}
                <span className="ed-cart-total">
                  {cartTotal} {cartTotal === 1 ? 'agenda' : 'agendas'} en total
                </span>
              </>
            )}
          </div>
          <a
            className="ed-cart-cta"
            href={cartTotal > 0 ? waLink(cartMessage) : undefined}
            target="_blank"
            rel="noreferrer"
            aria-disabled={cartTotal === 0}
            onClick={(e) => {
              if (cartTotal === 0) e.preventDefault()
            }}
          >
            Pedir por WhatsApp
          </a>
        </div>
      </div>
    </>
  )
}
