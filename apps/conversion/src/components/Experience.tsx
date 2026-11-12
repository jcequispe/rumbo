import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useCart } from '../cart/CartProvider'
import { useContent } from '../content/ContentProvider'
import { gsap, ScrollTrigger } from '../scroll'

/* ---------- Titular "escrito a pluma" ----------
   El h1 se revela con un trazo dorado, como si la pluma de sus propias
   fotos lo escribiera: clip-path de izquierda a derecha + un nib que viaja
   sobre el texto. Con prefers-reduced-motion aparece completo, sin animar
   (el texto real está siempre en el DOM, nunca se oculta del lector de
   pantalla). Ver PLAN-3D.md, pieza 1. */
export function PenWrittenTitle({ title, accent }: { title: string; accent: string }) {
  const titleRef = useRef<HTMLSpanElement>(null)
  const accentRef = useRef<HTMLSpanElement>(null)
  const nibRef = useRef<HTMLSpanElement>(null)

  useLayoutEffect(() => {
    const lines = [titleRef.current, accentRef.current].filter((e): e is HTMLSpanElement => !!e)
    const nib = nibRef.current
    if (!lines.length || matchMedia('(prefers-reduced-motion: reduce)').matches) return

    gsap.set(lines, { clipPath: 'inset(0 100% 0 0)' })
    if (nib) gsap.set(nib, { opacity: 0 })

    const tl = gsap.timeline({ delay: 0.2 })
    lines.forEach((el, i) => {
      const w = el.getBoundingClientRect().width
      const h = el.getBoundingClientRect().height
      if (nib) {
        tl.set(nib, { x: 0, y: h * 0.78, opacity: 1 }, i === 0 ? 0 : undefined)
        tl.to(nib, { x: w * 0.5, duration: 0.45, ease: 'power1.in' }, '<')
        tl.to(nib, { x: w + 4, duration: 0.45, ease: 'power1.out' }, '<0.45')
      }
      tl.to(el, { clipPath: 'inset(0 0% 0 0)', duration: 0.9, ease: 'power2.inOut' }, i === 0 ? 0 : '-=0.15')
    })
    if (nib) tl.to(nib, { opacity: 0, duration: 0.25 })

    return () => {
      tl.kill()
    }
  }, [title, accent])

  return (
    <h1 aria-label={`${title} ${accent}`}>
      <span className="pen-line" ref={titleRef}>
        {title}
      </span>
      <em className="pen-line" ref={accentRef}>
        {accent}
      </em>
      <span className="pen-nib" ref={nibRef} aria-hidden="true" />
    </h1>
  )
}

/* ---------- "Por dentro": hojeada real controlada por scroll ----------
   Un <video> normal (sin WebGL) cuyo currentTime lo fija el scroll dentro
   de una sección fijada ("pinned"): se siente 3D sin serlo. Con
   prefers-reduced-motion la sección no se fija y el video simplemente se
   reproduce solo una vez (o se ve el poster si falla el autoplay). Ver
   PLAN-3D.md, pieza 2. */
export function InteriorScrub({ src, poster }: { src: string; poster: string }) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  useLayoutEffect(() => {
    const wrap = wrapRef.current
    const video = videoRef.current
    if (!wrap || !video || matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let ready = false
    const onLoaded = () => {
      ready = true
      video.pause()
    }
    video.addEventListener('loadedmetadata', onLoaded)

    const st = ScrollTrigger.create({
      trigger: wrap,
      start: 'top bottom',
      end: 'bottom top',
      scrub: 0.6,
      onUpdate: (self) => {
        if (!ready || !video.duration) return
        video.currentTime = self.progress * video.duration
      },
    })

    return () => {
      video.removeEventListener('loadedmetadata', onLoaded)
      st.kill()
    }
  }, [])

  return (
    <div className="interior-scrub" ref={wrapRef}>
      <video ref={videoRef} src={src} poster={poster} muted playsInline preload="auto" autoPlay={matchMedia('(prefers-reduced-motion: reduce)').matches} loop={matchMedia('(prefers-reduced-motion: reduce)').matches} />
    </div>
  )
}

/* ---------- Progreso de lectura (orientación en el scroll) ---------- */
export function ScrollProgress() {
  const bar = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    let raf = 0
    const update = () => {
      raf = 0
      const max = document.documentElement.scrollHeight - innerHeight
      const p = max > 0 ? Math.min(1, Math.max(0, scrollY / max)) : 0
      if (bar.current) bar.current.style.transform = `scaleX(${p})`
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    addEventListener('scroll', onScroll, { passive: true })
    addEventListener('resize', onScroll)
    return () => {
      removeEventListener('scroll', onScroll)
      removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])
  return (
    <div className="scroll-progress" aria-hidden="true">
      <span ref={bar} />
    </div>
  )
}

/* ---------- Precio como microeconomía honesta ---------- */
export function usePerDay() {
  const { content } = useContent()
  const c = useCart()
  const { pricing, ui } = content
  const single = pricing.tiers.find((t) => t.qty === 1) ?? pricing.tiers[0]
  const unit = c.count > 0 ? c.total / c.count : single.total / single.qty
  const amount = Math.ceil((unit / 365) * 100) / 100
  return ui.perDay.replace('{amount}', `${pricing.currency} ${amount.toFixed(2)}`)
}

export function TierNudge() {
  const { content } = useContent()
  const c = useCart()
  const { pricing, ui } = content
  if (c.count === 0) return null
  const tiers = [...pricing.tiers].sort((a, b) => a.qty - b.qty)
  const single = tiers.find((t) => t.qty === 1)
  const next = tiers.find((t) => t.qty > c.count && t.qty <= pricing.maxQty)
  const top = tiers[tiers.length - 1].qty
  const pct = Math.min(100, (c.count / top) * 100)
  let text = ui.nudgeBest
  let save = ''
  if (next) {
    const unit = next.perUnit ?? next.total / next.qty
    text = ui.nudge.replace('{n}', String(next.qty - c.count)).replace('{price}', c.money(unit))
    const diff = single ? single.total * next.qty - next.total : 0
    if (diff > 0) save = ui.nudgeSave.replace('{amount}', c.money(diff))
  }
  return (
    <div className="nudge" role="status">
      <div className="nudge-track" aria-hidden="true">
        <span style={{ width: `${pct}%` }} />
      </div>
      <p>
        {text}
        {save && <small> · {save}</small>}
      </p>
    </div>
  )
}

/* ---------- Demo: «Pruébala antes de comprarla» ---------- */
type DayState = 0 | 1 | 2 // en blanco · hecho · descanso

export function Demo() {
  const { demo } = useContent().content
  const [days, setDays] = useState<DayState[]>(() => Array(7).fill(0))
  const [habits, setHabits] = useState<boolean[][]>(() => demo.habits.map(() => Array(7).fill(false)))
  const done = days.filter((d) => d === 1).length
  const rest = days.filter((d) => d === 2).length
  const moving = done + rest
  const msg = (moving === 0 ? demo.messages.zero : moving === 7 ? demo.messages.all : moving >= 5 ? demo.messages.most : demo.messages.some).replace('{n}', String(moving))
  const R = 44
  const C = 2 * Math.PI * R
  const touched = moving > 0 || habits.some((r) => r.some(Boolean))

  const cycle = (i: number) => setDays((p) => p.map((d, k) => (k === i ? (((d + 1) % 3) as DayState) : d)))
  const toggle = (r: number, d: number) => {
    setHabits((p) => p.map((row, k) => (k === r ? row.map((v, j) => (j === d ? !v : v)) : row)))
    // Marcar un hábito también mueve el día: lo que repites es, literalmente, lo que cuenta.
    setDays((p) => p.map((v, k) => (k === d && v === 0 && !habits[r][d] ? 1 : v)))
  }
  const reset = () => {
    setDays(Array(7).fill(0))
    setHabits(demo.habits.map(() => Array(7).fill(false)))
  }
  const stateName = [demo.states.empty, demo.states.done, demo.states.rest]

  return (
    <section className="section demo" id="pruebala">
      <div className="container">
        <div className="section-head reveal">
          <p className="eyebrow">{demo.eyebrow}</p>
          <h2>{demo.title}</h2>
          <p className="lead">{demo.sub}</p>
        </div>
        <div className="demo-card reveal">
          <div className="demo-board">
            <p className="field-label">{demo.weekLabel}</p>
            <div className="demo-days">
              {demo.days.map((d, i) => (
                <button
                  type="button"
                  key={i}
                  className={`demo-day s${days[i]}`}
                  onClick={() => cycle(i)}
                  aria-label={`${demo.daysLong[i]}: ${stateName[days[i]]}`}
                >
                  <span className="demo-day-l">{d}</span>
                  <span className="demo-day-s" aria-hidden="true">
                    {days[i] === 1 ? '✓' : days[i] === 2 ? '☾' : '+'}
                  </span>
                </button>
              ))}
            </div>
            <ul className="demo-legend" aria-hidden="true">
              <li>
                <i className="s1" /> {demo.states.done}
              </li>
              <li>
                <i className="s2" /> {demo.states.rest}
              </li>
              <li>
                <i className="s0" /> {demo.states.empty}
              </li>
            </ul>

            <p className="field-label demo-habits-label">{demo.habitsLabel}</p>
            <div className="demo-habits">
              {demo.habits.map((h, r) => (
                <div className="demo-habit" key={h}>
                  <span className="demo-habit-name">{h}</span>
                  <span className="demo-habit-dots">
                    {demo.days.map((_, i) => (
                      <button
                        type="button"
                        key={i}
                        className="demo-dot"
                        aria-pressed={habits[r][i]}
                        aria-label={`${h} · ${demo.daysLong[i]}`}
                        onClick={() => toggle(r, i)}
                      />
                    ))}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="demo-result">
            <div className="demo-ring" aria-hidden="true">
              <svg viewBox="0 0 100 100" width="132" height="132">
                <circle cx="50" cy="50" r={R} className="ring-bg" />
                <circle cx="50" cy="50" r={R} className="ring-fg" strokeDasharray={C} strokeDashoffset={C * (1 - moving / 7)} transform="rotate(-90 50 50)" />
              </svg>
              <strong>{moving}/7</strong>
            </div>
            <p className="demo-ring-label">{demo.ringLabel}</p>
            <p className="demo-msg" aria-live="polite">
              {msg}
            </p>
            <a className="btn btn-primary" href="#elige">
              {demo.cta}
            </a>
            <button type="button" className="text-btn text-btn-center" onClick={reset} hidden={!touched}>
              {demo.reset}
            </button>
          </div>
        </div>
        <p className="fine demo-note reveal">{demo.note}</p>
      </div>
    </section>
  )
}
