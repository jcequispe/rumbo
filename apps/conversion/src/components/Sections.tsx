import { useEffect, useRef, useState, type ReactNode } from 'react'
import { useCart } from '../cart/CartProvider'
import { useContent } from '../content/ContentProvider'
import { useSelection } from '../selection'
import { InteriorScrub, PenWrittenTitle, ScrollProgress, TierNudge, TransformSequence, usePerDay } from './Experience'

export { SelectionProvider } from '../selection'

export function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll<HTMLElement>('.reveal')
    if (!('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches) {
      els.forEach((e) => e.classList.add('in'))
      return
    }
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in')
            io.unobserve(e.target)
          }
        }),
      { threshold: 0.12 },
    )
    els.forEach((e) => io.observe(e))
    return () => io.disconnect()
  }, [])
}

function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="eyebrow">{children}</p>
}

export function TopBanner() {
  const { content } = useContent()
  if (!content.topBanner) return null
  return <div className="top-banner">{content.topBanner}</div>
}

function CartIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="9" cy="20" r="1.4" fill="currentColor" stroke="none" />
      <circle cx="18" cy="20" r="1.4" fill="currentColor" stroke="none" />
      <path d="M2.5 3h2.6l2.1 12.1a2 2 0 0 0 2 1.65h8.47a2 2 0 0 0 1.97-1.64L21 8H6.1" />
    </svg>
  )
}

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
      {open ? (
        <path d="M5 5l14 14M19 5L5 19" />
      ) : (
        <>
          <path d="M3 6h18" />
          <path d="M3 12h18" />
          <path d="M3 18h18" />
        </>
      )}
    </svg>
  )
}

export function Nav() {
  const { content, media } = useContent()
  const cart = useCart()
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    if (!menuOpen) return
    const close = () => setMenuOpen(false)
    window.addEventListener('hashchange', close)
    const mq = matchMedia('(min-width: 820px)')
    mq.addEventListener('change', close)
    return () => {
      window.removeEventListener('hashchange', close)
      mq.removeEventListener('change', close)
    }
  }, [menuOpen])

  return (
    <header className="nav">
      <div className="container nav-inner">
        <a className="nav-wordmark" href="#inicio" aria-label={content.brand.wordmark}>
          {content.brand.logo ? <img src={media(content.brand.logo)} alt={content.brand.wordmark} className="nav-logo" /> : content.brand.wordmark}
        </a>
        <button
          type="button"
          className="nav-toggle"
          aria-expanded={menuOpen}
          aria-controls="nav-links"
          aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <MenuIcon open={menuOpen} />
        </button>
        <nav id="nav-links" className={menuOpen ? 'nav-links mobile-open' : 'nav-links'} aria-label="Principal">
          {content.nav.links.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setMenuOpen(false)}>
              {l.label}
            </a>
          ))}
        </nav>
        <button type="button" className="cart-btn" onClick={cart.open} aria-label={`${content.cart.open} (${cart.count})`}>
          <CartIcon />
          {cart.count > 0 && (
            <span className="cart-badge" key={cart.count}>
              {cart.count}
            </span>
          )}
        </button>
      </div>
      <ScrollProgress />
    </header>
  )
}

function minPerUnit(tiers: { qty: number; total: number; perUnit?: number }[]) {
  return Math.min(...tiers.map((t) => t.perUnit ?? t.total / t.qty))
}

export function Hero() {
  const { content, media } = useContent()
  const { editionId, setEditionId } = useSelection()
  const { hero, pricing, ui } = content
  const from = `${pricing.currency} ${minPerUnit(pricing.tiers)}`
  return (
    <section className="hero" id="inicio">
      <div className="container hero-grid">
        <div className="hero-copy">
          <Eyebrow>{hero.eyebrow}</Eyebrow>
          <PenWrittenTitle title={hero.title} accent={hero.titleAccent} />
          <p className="lead">{hero.sub}</p>
          <div className="hero-actions">
            <a className="btn btn-primary" href="#elige">
              {hero.ctaPrimary}
            </a>
            <a className="link-arrow" href="#detalles">
              {hero.ctaSecondary} <span aria-hidden="true">↓</span>
            </a>
          </div>
          <p className="hero-price">{ui.fromPrice.replace('{price}', from)}</p>
          {content.editions.length > 1 && (
          <div className="hero-pick">
            <span className="field-label">{ui.heroPick}</span>
            <div className="hero-dots">
              {content.editions.map((e) => (
                <a
                  key={e.id}
                  href="#elige"
                  className="hero-dot"
                  style={{ background: e.color }}
                  aria-label={ui.pickOne.replace('{label}', e.label)}
                  aria-current={e.id === editionId ? 'true' : undefined}
                  onClick={() => setEditionId(e.id)}
                />
              ))}
            </div>
          </div>
          )}
          {hero.chips && (
            <ul className="chips" aria-label="Características">
              {hero.chips.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          )}
          <ul className="assurances">
            {hero.assurances.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ul>
        </div>
        <div className="hero-media">
          <img className="parallax-img" src={media(hero.image)} alt="" width={1120} height={1600} fetchPriority="high" />
        </div>
      </div>
    </section>
  )
}

export function TrustBar() {
  const { trustBar } = useContent().content
  if (!trustBar?.items?.length) return null
  return (
    <div className="trust-bar">
      <ul className="container">
        {trustBar.items.map((t) => (
          <li key={t}>
            <span aria-hidden="true">✓</span> {t}
          </li>
        ))}
      </ul>
    </div>
  )
}

export function Problem() {
  const { problem } = useContent().content
  return (
    <section className="section section-dark">
      <div className="container narrow reveal">
        <Eyebrow>{problem.eyebrow}</Eyebrow>
        <h2>{problem.title}</h2>
        <p className="lead">{problem.body}</p>
        <ul className="pain-list">
          {problem.points.map((p, i) => (
            <li key={p}>
              <span className="pain-n">{String(i + 1).padStart(2, '0')}</span>
              {p}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export function Benefits() {
  const { content, media } = useContent()
  const { benefits, problem } = content
  const [first, ...rest] = benefits.items
  return (
    <section className="section" id="metodo">
      <div className="container">
        <div className="section-head reveal">
          <Eyebrow>{benefits.eyebrow}</Eyebrow>
          <h2>{benefits.title}</h2>
        </div>
        {first && (
          <article className="benefit benefit-transform reveal">
            <h3>{first.title}</h3>
            <TransformSequence before={problem.points} after={first.body} />
          </article>
        )}
        <div className="benefit-grid">
          {rest.map((b, i) => (
            <article className="benefit reveal" style={{ transitionDelay: `${i * 80}ms` }} key={b.title}>
              <div className="benefit-media">
                <img className="parallax-img" src={media(b.image)} alt="" loading="lazy" width={640} height={640} />
              </div>
              <h3>{b.title}</h3>
              <p>{b.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export function EditionPicker() {
  const { content, media } = useContent()
  const { editions, editionsSection, formats, cart } = content
  const { editionId, setEditionId, formatId, setFormatId } = useSelection()
  const c = useCart()
  const active = editions.find((e) => e.id === editionId) ?? editions[0]
  const inCart = c.lines.filter((l) => l.editionId === active.id).reduce((n, l) => n + l.qty, 0)
  const perDay = usePerDay()
  const stage = useRef<HTMLDivElement>(null)
  const tilt = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = stage.current
    if (!el || e.pointerType !== 'mouse' || matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const r = el.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5
    const y = (e.clientY - r.top) / r.height - 0.5
    el.style.setProperty('--rx', `${(-y * 6).toFixed(2)}deg`)
    el.style.setProperty('--ry', `${(x * 8).toFixed(2)}deg`)
  }
  const untilt = () => {
    stage.current?.style.setProperty('--rx', '0deg')
    stage.current?.style.setProperty('--ry', '0deg')
  }
  const arrows = (e: React.KeyboardEvent) => {
    const i = editions.findIndex((x) => x.id === active.id)
    const d = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0
    if (!d) return
    e.preventDefault()
    const n = editions[(i + d + editions.length) % editions.length]
    setEditionId(n.id)
    requestAnimationFrame(() => document.querySelector<HTMLElement>(`[data-edition="${n.id}"]`)?.focus())
  }
  return (
    <section className="section section-tint picker" id="elige">
      <div className="container">
        <div className="section-head reveal">
          <Eyebrow>{editionsSection.eyebrow}</Eyebrow>
          <h2>{editionsSection.title}</h2>
          <p className="lead">{editionsSection.sub}</p>
        </div>
        <div className="edition-layout reveal">
          <div className="edition-stage" ref={stage} onPointerMove={tilt} onPointerLeave={untilt}>
            <img key={active.id} src={media(active.image)} alt={`Portada ${active.label}`} width={1055} height={1491} />
            <span className="edition-badge" style={{ background: active.color }} aria-hidden="true" />
          </div>
          <div className="edition-side">
            <h3 className="edition-name" aria-live="polite">
              {active.label}
            </h3>
            {editions.length > 1 && (
              <div className="swatches" role="group" aria-label={editionsSection.title} onKeyDown={arrows}>
                {editions.map((e) => (
                  <button type="button" key={e.id} data-edition={e.id} className="swatch" aria-pressed={e.id === active.id} onClick={() => setEditionId(e.id)}>
                    <span className="swatch-dot" style={{ background: e.color }} />
                    <span className="swatch-label">{e.label}</span>
                  </button>
                ))}
              </div>
            )}
            {formats.items.length > 1 && (
              <>
                <p className="field-label" id="format-label">
                  {formats.eyebrow}
                </p>
                <div className="format-tabs" role="group" aria-labelledby="format-label">
                  {formats.items.map((f) => (
                    <button type="button" key={f.id} className="format-tab" aria-pressed={f.id === formatId} onClick={() => setFormatId(f.id)}>
                      <strong>{f.name}</strong>
                      <span>{f.detail}</span>
                    </button>
                  ))}
                </div>
              </>
            )}
            <button type="button" className="btn btn-primary btn-large btn-block" onClick={() => c.add(active.id, formatId)} disabled={c.atMax}>
              {cart.addCta}
              {inCart > 0 && <span className="btn-count">{inCart}</span>}
            </button>
            {c.atMax && <p className="fine">{cart.max.replace('{max}', String(content.pricing.maxQty))}</p>}
            <p className="per-day">{perDay}</p>
            <TierNudge />
            {editionsSection.reassure && (
              <ul className="reassure">
                {editionsSection.reassure.map((r) => (
                  <li key={r}>{r}</li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export function Details() {
  const { content, media } = useContent()
  const { formats, details } = content
  return (
    <section className="section" id="detalles">
      <div className="container details-grid">
        <div className="details-media reveal">
          {details.video ? (
            <InteriorScrub src={media(details.video)} poster={media(details.image)} />
          ) : (
            <img className="parallax-img" src={media(details.image)} alt="" loading="lazy" width={800} height={800} />
          )}
        </div>
        <div className="reveal">
          <Eyebrow>{details.eyebrow}</Eyebrow>
          <h2>{details.title}</h2>
          <ul className="materials">
            {details.materials.map((m) => (
              <li key={m.label}>
                <strong>{m.label}</strong> {m.detail}
              </li>
            ))}
          </ul>
          {details.size && <p className="size-chip">{details.size}</p>}
          <div className="format-note">
            <h3>{formats.title}</h3>
            <p>{formats.body}</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export function Proof() {
  const { proof } = useContent().content
  if (!proof.verified) return null // sin reseñas reales y autorizadas, no se muestra nada
  return (
    <section className="section section-tint">
      <div className="container">
        <div className="section-head reveal">
          <Eyebrow>{proof.eyebrow}</Eyebrow>
          <h2>{proof.title}</h2>
        </div>
        <div className="quote-grid">
          {proof.testimonials.map((t, i) => (
            <figure className="quote reveal" style={{ transitionDelay: `${i * 80}ms` }} key={t.name}>
              <blockquote>“{t.quote}”</blockquote>
              <figcaption>
                <strong>
                  {t.name}
                  {t.place ? ` · ${t.place}` : ''}
                </strong>
                {t.tag && <span>{t.tag}</span>}
              </figcaption>
            </figure>
          ))}
        </div>
        <p className="proof-stat reveal">
          <strong>+{proof.stat}</strong> {proof.statText}
        </p>
      </div>
    </section>
  )
}

export function Steps() {
  const { steps } = useContent().content
  return (
    <section className="section">
      <div className="container">
        <div className="section-head reveal">
          <Eyebrow>{steps.eyebrow}</Eyebrow>
          <h2>{steps.title}</h2>
        </div>
        <ol className="steps">
          {steps.items.map((s, i) => (
            <li className="step reveal" style={{ transitionDelay: `${i * 80}ms` }} key={s.title}>
              <span className="step-n">{i + 1}</span>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

function useCountdown(deadline?: string) {
  const target = deadline ? Date.parse(deadline) : NaN
  const [now, setNow] = useState(() => Date.now())
  useEffect(() => {
    if (Number.isNaN(target)) return
    const id = setInterval(() => setNow(Date.now()), 30_000)
    return () => clearInterval(id)
  }, [target])
  const ms = target - now
  if (Number.isNaN(target) || ms <= 0) return null
  return { d: Math.floor(ms / 864e5), h: Math.floor((ms % 864e5) / 36e5), m: Math.floor((ms % 36e5) / 6e4) }
}

export function Pricing() {
  const { content, media } = useContent()
  const { pricing, gift, ui, guarantee, cart } = content
  const c = useCart()
  const left = useCountdown(pricing.deadline)
  const single = pricing.tiers.find((t) => t.qty === 1)
  const current = [...pricing.tiers].reverse().find((t) => t.qty <= c.count)

  return (
    <section className="section section-dark" id="pedido">
      <div className="container">
        <div className="section-head reveal">
          <Eyebrow>{pricing.eyebrow}</Eyebrow>
          <h2>{pricing.title}</h2>
          <p className="lead">{pricing.tiersNote}</p>
          {left && (
            <p className="countdown" role="timer">
              {pricing.deadlineLabel}{' '}
              <strong>
                {left.d}
                {ui.daysShort} {left.h}
                {ui.hoursShort} {left.m}
                {ui.minutesShort}
              </strong>
            </p>
          )}
        </div>

        <ul className="tiers reveal">
          {pricing.tiers.map((t) => {
            const saved = single && t.qty > 1 ? single.total * t.qty - t.total : 0
            const here = current?.qty === t.qty
            return (
              <li className="tier" aria-current={here ? 'true' : undefined} key={t.qty}>
                {t.note && <span className="tier-note">{t.note}</span>}
                <span className="tier-qty">
                  {t.qty} {t.qty === 1 ? pricing.unitOne : pricing.unitMany}
                </span>
                <span className="tier-total">{c.money(t.total)}</span>
                <span className="tier-per">{t.perUnit ? `${pricing.perUnitLabel} ${c.money(t.perUnit)}` : '\u00a0'}</span>
                {saved > 0 && <span className="tier-save">{ui.savings.replace('{amount}', c.money(saved))}</span>}
              </li>
            )
          })}
        </ul>

        <div className="order-card reveal">
          {c.lines.length === 0 ? (
            <>
              <p className="order-empty">{cart.empty}</p>
              <a className="btn btn-primary btn-large" href="#elige">
                {cart.emptyCta}
              </a>
            </>
          ) : (
            <>
              <ul className="order-lines">
                {c.lines.map((l) => {
                  const ed = content.editions.find((e) => e.id === l.editionId)
                  const fm = content.formats.items.find((f) => f.id === l.formatId)
                  return (
                    <li key={`${l.editionId}-${l.formatId}`}>
                      <span className="order-dot" style={{ background: ed?.color }} />
                      <span>
                        {l.qty} × {ed?.label} · {fm?.name}
                      </span>
                    </li>
                  )
                })}
              </ul>
              <p className="cart-total order-total">
                <span>
                  {cart.total} · {c.count} {c.unitLabel(c.count)}
                </span>
                <strong>{c.money(c.total)}</strong>
              </p>
              {c.saved > 0 && <p className="cart-savings">{cart.savings.replace('{amount}', c.money(c.saved))}</p>}
              <a className="btn btn-primary btn-large btn-block" href={c.checkoutHref} target="_blank" rel="noreferrer">
                {pricing.buyLabel} · {c.money(c.total)}
              </a>
              <button type="button" className="text-btn text-btn-center text-btn-light" onClick={c.open}>
                {cart.open}
              </button>
            </>
          )}
          <p className="fine fine-light">{pricing.payNote}</p>
        </div>

        {gift && (
        <div className="gift reveal">
          <img src={media(gift.image)} alt="" loading="lazy" width={480} height={480} />
          <div>
            <span className="gift-tag">{gift.tag}</span>
            <h3>{gift.title}</h3>
            <p>{gift.note}</p>
          </div>
        </div>
        )}

        <div className="guarantee reveal">
          <h3>{guarantee.title}</h3>
          <p>{guarantee.body}</p>
        </div>
      </div>
    </section>
  )
}

export function Unboxing() {
  const { content, media } = useContent()
  const { unboxing } = content
  return (
    <section className="section">
      <div className="container details-grid">
        <div className="reveal">
          <h2>{unboxing.title}</h2>
          <p className="lead">{unboxing.body}</p>
        </div>
        <div className="details-media reveal">
          <img className="parallax-img" src={media(unboxing.image)} alt="" loading="lazy" width={800} height={800} />
        </div>
      </div>
    </section>
  )
}

export function Faq() {
  const { content, waLink } = useContent()
  const [open, setOpen] = useState(0)
  return (
    <section className="section section-tint" id="preguntas">
      <div className="container narrow">
        <div className="section-head reveal">
          <Eyebrow>{content.ui.faqEyebrow}</Eyebrow>
          <h2>{content.ui.faqTitle}</h2>
          <p className="lead">{content.ui.faqSub}</p>
        </div>
        <div className="faq-list reveal">
          {content.faq.map((f, i) => (
            <div className="faq-item" key={f.q}>
              <h3>
                <button type="button" aria-expanded={open === i} aria-controls={`faq-${i}`} onClick={() => setOpen(open === i ? -1 : i)}>
                  <span>{f.q}</span>
                  <span aria-hidden="true">{open === i ? '−' : '+'}</span>
                </button>
              </h3>
              <div id={`faq-${i}`} role="region" hidden={open !== i}>
                <p>{f.a}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="faq-wa">
          <a className="link-arrow" href={waLink(content.ui.whatsappCta)} target="_blank" rel="noreferrer">
            {content.ui.whatsappCta} <span aria-hidden="true">→</span>
          </a>
        </p>
      </div>
    </section>
  )
}

export function FinalCta() {
  const { finalCta } = useContent().content
  return (
    <section id="cierre" className="section section-dark final-cta">
      <div className="container narrow reveal">
        <h2>{finalCta.title}</h2>
        <p className="lead">{finalCta.sub}</p>
        <a className="btn btn-primary btn-large" href="#elige">
          {finalCta.cta}
        </a>
      </div>
    </section>
  )
}

export function Footer() {
  const { content } = useContent()
  const { footer, brand } = content
  return (
    <footer id="pie" className="footer">
      <div className="container">
        <span className="footer-wordmark">{brand.wordmark}</span>
        <nav className="footer-links">
          {footer.links.map((l) => (
            <span key={l} className="footer-link-pending">
              {l}
            </span>
          ))}
        </nav>
        {footer.legal && <p>{footer.legal}</p>}
        <p>
          {footer.address ? `${footer.address} · ` : null}
          <a href={`mailto:${brand.email}`}>{brand.email}</a>
        </p>
      </div>
    </footer>
  )
}

export function StickyBar() {
  const { content } = useContent()
  const c = useCart()
  const [show, setShow] = useState(false)

  useEffect(() => {
    const hide = ['inicio', 'elige', 'pedido', 'cierre', 'pie'].map((id) => document.getElementById(id)).filter((e): e is HTMLElement => !!e)
    const visible = new Set<Element>()
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting) visible.add(e.target)
        else visible.delete(e.target)
      }
      setShow(visible.size === 0)
    })
    hide.forEach((e) => io.observe(e))
    return () => io.disconnect()
  }, [])

  const hasItems = c.count > 0
  return (
    <div className={show ? 'sticky-bar show' : 'sticky-bar'} aria-hidden={!show}>
      {hasItems ? (
        <button type="button" className="btn btn-primary" onClick={c.open} tabIndex={show ? 0 : -1}>
          {content.cart.viewCart} · {c.count} {c.unitLabel(c.count)} · {c.money(c.total)}
        </button>
      ) : (
        <a className="btn btn-primary" href="#elige" tabIndex={show ? 0 : -1}>
          {content.ui.stickyCta}
        </a>
      )}
    </div>
  )
}
