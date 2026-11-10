import { useEffect, useMemo, useRef, useState } from 'react'
import { useCart } from '../cart/CartProvider'
import { useContent } from '../content/ContentProvider'
import { useSelection } from '../selection'

const reduceMotion = () => typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches

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

/* ---------- Test «Encuentra tu portada» ---------- */
export function Finder() {
  const { content, media } = useContent()
  const { finder, editions } = content
  const { setEditionId } = useSelection()
  const [step, setStep] = useState(0)
  const [tags, setTags] = useState<string[]>([])
  const [done, setDone] = useState(false)
  const headRef = useRef<HTMLHeadingElement>(null)
  const total = finder.questions.length

  const ranked = useMemo(() => {
    const score = (e: (typeof editions)[number]) => (e.tags ?? []).reduce((n, t) => n + tags.filter((x) => x === t).length, 0)
    return editions.map((e, i) => ({ e, i, s: score(e) })).sort((a, b) => b.s - a.s || a.i - b.i)
  }, [editions, tags])

  useEffect(() => {
    if (done) headRef.current?.focus({ preventScroll: true })
  }, [done])

  const answer = (t: string[]) => {
    const next = [...tags, ...t]
    setTags(next)
    if (step + 1 >= total) setDone(true)
    else setStep(step + 1)
  }
  const restart = () => {
    setStep(0)
    setTags([])
    setDone(false)
  }
  const choose = (id: string) => {
    setEditionId(id)
    document.getElementById('elige')?.scrollIntoView({ behavior: reduceMotion() ? 'auto' : 'smooth' })
  }
  const top = ranked[0].e
  const q = finder.questions[step]

  return (
    <section className="section finder" id="encuentra">
      <div className="container narrow">
        <div className="section-head reveal">
          <p className="eyebrow">{finder.eyebrow}</p>
          <h2>{finder.title}</h2>
          <p className="lead">{finder.sub}</p>
        </div>
        <div className="finder-card reveal">
          {!done ? (
            <div key={step} className="finder-step">
              <div className="finder-progress" aria-hidden="true">
                {finder.questions.map((_, i) => (
                  <span key={i} className={i <= step ? 'on' : ''} />
                ))}
              </div>
              <p className="finder-count">{finder.step.replace('{n}', String(step + 1)).replace('{total}', String(total))}</p>
              <h3 className="finder-q">{q.q}</h3>
              <div className="finder-options">
                {q.options.map((o) => (
                  <button type="button" key={o.label} className="finder-option" onClick={() => answer(o.tags)}>
                    {o.label}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="finder-result" aria-live="polite">
              <p className="eyebrow">{finder.resultEyebrow}</p>
              <div className="finder-hit">
                <img src={media(top.image)} alt={`Portada ${top.label}`} width={1024} height={640} loading="lazy" />
                <div>
                  <h3 tabIndex={-1} ref={headRef}>
                    {top.label}
                  </h3>
                  <span className="finder-swatch" style={{ background: top.color }} aria-hidden="true" />
                  <button type="button" className="btn btn-primary" onClick={() => choose(top.id)}>
                    {finder.resultCta.replace('{label}', top.label)}
                  </button>
                </div>
              </div>
              <p className="field-label">{finder.alsoLike}</p>
              <div className="finder-also">
                {ranked.slice(1, 3).map(({ e }) => (
                  <button type="button" key={e.id} className="swatch" onClick={() => choose(e.id)}>
                    <span className="swatch-dot" style={{ background: e.color }} />
                    <span className="swatch-label">{e.label}</span>
                  </button>
                ))}
              </div>
              <button type="button" className="text-btn" onClick={restart}>
                {finder.restart}
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
