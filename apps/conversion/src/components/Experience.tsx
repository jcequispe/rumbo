import { useEffect, useRef, useState } from 'react'
import { useCart } from '../cart/CartProvider'
import { useContent } from '../content/ContentProvider'

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
