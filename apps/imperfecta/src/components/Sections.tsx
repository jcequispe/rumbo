import { useState } from 'react'
import { useContent } from '../content/ContentProvider'

export function TopBanner() {
  const { content } = useContent()
  if (!content.topBanner) return null
  return <div className="top-banner">{content.topBanner}</div>
}

export function Nav() {
  const { content } = useContent()
  return (
    <header className="nav">
      <span className="nav-wordmark">{content.brand.wordmark}</span>
    </header>
  )
}

export function Hero() {
  const { content, media } = useContent()
  const { hero } = content
  return (
    <section className="hero">
      <div className="hero-media" aria-hidden="true">
        {hero.video ? (
          <video autoPlay muted loop playsInline poster={media(hero.video.poster)}>
            {hero.video.srcWebm && <source src={media(hero.video.srcWebm)} type="video/webm" />}
            <source src={media(hero.video.src)} type="video/mp4" />
          </video>
        ) : (
          <img src={media(hero.image)} alt="" loading="eager" />
        )}
      </div>
      <a className="cta cta-primary hero-cta" href="#pedido">
        {hero.ctaPrimary}
      </a>
    </section>
  )
}

export function Marquee() {
  const { content } = useContent()
  const items = content.marquee
  return (
    <div className="marquee" aria-hidden="true">
      <div className="marquee-track">
        {[...items, ...items, ...items, ...items].map((item, i) => (
          <span className="marquee-item" key={i}>
            {item} <span className="marquee-dot">✦</span>
          </span>
        ))}
      </div>
    </div>
  )
}

export function EditionPicker() {
  const { content, media } = useContent()
  const editions = content.editions
  const [activeId, setActiveId] = useState(editions[0].id)
  const idx = Math.max(0, editions.findIndex((e) => e.id === activeId))
  const active = editions[idx]
  return (
    <section className="section edition-picker">
      <div className="edition-hero-media" aria-hidden="true">
        <span className="edition-ghost-word">{active.label}</span>
        <img src={media(active.image)} alt="" />
      </div>
      <div className="edition-title-row">
        <h2>{active.label}</h2>
        <span className="edition-index">{String(idx + 1).padStart(2, '0')}</span>
      </div>
      <a className="cta cta-primary" href="#pedido">
        {content.ui.editionCta.replace('{label}', active.label)}
      </a>
      <div className="edition-grid">
        {editions.map((e) => (
          <button
            type="button"
            key={e.id}
            className={e.id === active.id ? 'edition-swatch active' : 'edition-swatch'}
            onClick={() => setActiveId(e.id)}
          >
            <span className="edition-swatch-thumb" style={{ background: e.color }} />
            <span className="edition-swatch-label">{e.label}</span>
          </button>
        ))}
      </div>
    </section>
  )
}

export function SocialProof() {
  const { content } = useContent()
  const SOCIAL_PROOF = content.socialProof
  return (
    <section className="section social-proof">
      <span className="social-proof-eyebrow">{SOCIAL_PROOF.eyebrow}</span>
      <div className="social-proof-stat">
        <span className="social-proof-plus">+</span>
        {SOCIAL_PROOF.stat}
      </div>
      <p className="social-proof-text">{SOCIAL_PROOF.text}</p>
    </section>
  )
}

export function Testimonials() {
  const TESTIMONIALS = useContent().content.testimonials
  return (
    <section className="section testimonials">
      <div className="testi-scroller">
        {TESTIMONIALS.map((t, i) => (
          <div className={`sticky-note sticky-note-${i % 4}`} key={t.name}>
            <p>"{t.quote}"</p>
            <div className="sticky-note-foot">
              <span className="sticky-note-name">
                {t.name} · {t.place}
              </span>
              <span className="sticky-note-tag">{t.tag}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="testi-progress">
        <span>1 de {TESTIMONIALS.length}</span>
        <span className="testi-track">
          <span className="testi-track-fill" />
        </span>
        <span>Desliza →</span>
      </div>
    </section>
  )
}

export function PriceFaqStrip() {
  const PRICE_FAQ = useContent().content.priceFaq
  return (
    <section className="section price-faq">
      <span className="price-faq-eyebrow">{PRICE_FAQ.eyebrow}</span>
      <h2 className="price-faq-question">{PRICE_FAQ.question}</h2>
      <div className="price-faq-answer-row">
        <span className="price-faq-no-crossed">Sí</span>
        <span className="price-faq-yes">No</span>
      </div>
      <p className="price-faq-detail">{PRICE_FAQ.answer}</p>
    </section>
  )
}

export function FormatPicker() {
  const { content, media } = useContent()
  const FORMATS = content.formats.items
  const [active, setActive] = useState(FORMATS[0].id)
  return (
    <section className="section format-picker">
      <span className="section-tag">{content.ui.formatTag}</span>
      <div className="format-media" aria-hidden="true">
        <img src={media(content.formats.image)} alt="" />
      </div>
      <div className="format-tabs">
        {FORMATS.map((f) => (
          <button
            type="button"
            key={f.id}
            className={f.id === active ? 'format-tab active' : 'format-tab'}
            onClick={() => setActive(f.id)}
          >
            <span className="format-tab-name">{f.name}</span>
            <span className="format-tab-detail">{f.detail}</span>
          </button>
        ))}
      </div>
    </section>
  )
}

export function FeatureCarousel() {
  const { content, media } = useContent()
  const FEATURE_SLIDES = content.features
  return (
    <section className="feature-carousel">
      <div className="feature-scroller">
        {FEATURE_SLIDES.map((s) => (
          <div className="feature-slide" key={s.title}>
            <div className="feature-media" aria-hidden="true">
              {s.image && <img src={media(s.image)} alt="" />}
            </div>
            <span className="feature-category">{s.category}</span>
            <h3>{s.title}</h3>
            <p>{s.body}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

export function DetailsCollage() {
  const { content, media } = useContent()
  const DETAILS_HEADING = content.details
  return (
    <section className="section details-collage">
      <span className="section-tag">{DETAILS_HEADING.eyebrow}</span>
      <h2>{DETAILS_HEADING.title}</h2>
      <div className="collage-grid" aria-hidden="true">
        {content.collage.map((src, i) => (
          <div className={`collage-photo collage-photo-${i}`} key={i}>
            <img src={media(src)} alt="" />
          </div>
        ))}
      </div>
    </section>
  )
}

export function MaterialsList() {
  const MATERIALS = useContent().content.details.materials
  return (
    <section className="section materials-list">
      <ol>
        {MATERIALS.map((m, i) => (
          <li key={m.label}>
            <span className="materials-n">{i + 1}</span>
            <span>
              <strong>{m.label}</strong> {m.detail}
            </span>
          </li>
        ))}
      </ol>
    </section>
  )
}

export function SizeSpec() {
  const { content, media } = useContent()
  const SIZE_SPEC = content.sizeSpec
  return (
    <section className="section size-spec">
      <span className="section-tag">{SIZE_SPEC.eyebrow}</span>
      <h2>{SIZE_SPEC.title}</h2>
      <p className="size-detail">{SIZE_SPEC.detail}</p>
      <div className="size-pills">
        {SIZE_SPEC.weights.map((w) => (
          <span className="size-pill" key={w}>
            {w}
          </span>
        ))}
      </div>
      <div className="size-media" aria-hidden="true">
        <img src={media(SIZE_SPEC.image)} alt="" />
      </div>
    </section>
  )
}

export function GiftBonus() {
  const { content, media } = useContent()
  const GIFT_BONUS = content.giftBonus
  return (
    <section className="section gift-bonus">
      <span className="section-tag">{GIFT_BONUS.tag}</span>
      <div className="gift-bonus-card">
        <span className="gift-bonus-stamp">{GIFT_BONUS.stamp}</span>
        <h2>{GIFT_BONUS.title}</h2>
        <p className="gift-bonus-detail">{GIFT_BONUS.detail}</p>
        <div className="gift-bonus-notes">
          <span className="gift-bonus-value">{GIFT_BONUS.valueNote}</span>
          <span>{GIFT_BONUS.multiNote}</span>
        </div>
      </div>
      <div className="gift-bonus-media" aria-hidden="true">
        <img src={media(GIFT_BONUS.image)} alt="" />
      </div>
    </section>
  )
}

export function Unboxing() {
  const { content, media } = useContent()
  const UNBOXING = content.unboxing
  return (
    <section className="section unboxing">
      <div className="unboxing-media" aria-hidden="true">
        <img src={media(UNBOXING.image)} alt="" />
      </div>
      <p className="unboxing-text">{UNBOXING.text}</p>
    </section>
  )
}

export function PricingSelector() {
  const { content, waLink } = useContent()
  const PRICING = content.pricing
  const PRICING_TIERS = PRICING.tiers
  const [active, setActive] = useState(() => Math.max(0, PRICING_TIERS.findIndex((t) => t.qty === PRICING.highlightQty)))
  const tier = PRICING_TIERS[active]
  const one = tier.qty === 1
  const waMessage = content.whatsapp.orderMessage
    .replace('{qty}', String(tier.qty))
    .replace('{product}', one ? PRICING.productOne : PRICING.productMany)

  return (
    <section className="section pricing-selector" id="pedido">
      <span className="section-tag">{PRICING.eyebrow}</span>
      <h2>{PRICING.title}</h2>
      <p className="pricing-deadline">{PRICING.deadlineNote}</p>
      <p className="pricing-after">{PRICING.afterNote}</p>

      <div className="pricing-tiers">
        {PRICING_TIERS.map((t, i) => (
          <button type="button" key={t.qty} className={i === active ? 'pricing-tier active' : 'pricing-tier'} onClick={() => setActive(i)}>
            <span className="pricing-tier-qty">
              {t.qty} {t.qty === 1 ? PRICING.unitOne : PRICING.unitMany}
            </span>
            <span className="pricing-tier-total">
              {PRICING.currency} {t.total}
            </span>
          </button>
        ))}
      </div>

      {tier.perUnit && (
        <p className="pricing-per-unit">
          {PRICING.perUnitLabel}{' '}
          <strong>
            {PRICING.currency} {tier.perUnit}
          </strong>
        </p>
      )}

      <a className="cta cta-primary pricing-cta" href={waLink(waMessage)}>
        {PRICING.buyLabel} {tier.qty} {one ? PRICING.unitOne : PRICING.unitMany} · {PRICING.currency} {tier.total}
      </a>
      <p className="pricing-mix">{PRICING.mixNote}</p>
      <p className="pricing-pay">{PRICING.payNote}</p>
    </section>
  )
}

export function Faq() {
  const { content } = useContent()
  const FAQ_ITEMS = content.faq
  const [open, setOpen] = useState(0)
  return (
    <section className="section faq">
      <span className="section-tag">{content.ui.faqTag}</span>
      <h2>{content.ui.faqTitle}</h2>
      <p className="faq-sub">{content.ui.faqSub}</p>
      <ol className="faq-list">
        {FAQ_ITEMS.map((item, i) => (
          <li key={item.q} className={i === open ? 'faq-item open' : 'faq-item'}>
            <button type="button" className="faq-question" onClick={() => setOpen(i === open ? -1 : i)}>
              <span className="faq-n">{String(i + 1).padStart(2, '0')}</span>
              <span className="faq-q-text">{item.q}</span>
              <span className="faq-toggle" aria-hidden="true">
                {i === open ? '×' : '+'}
              </span>
            </button>
            {i === open && <p className="faq-answer">{item.a}</p>}
          </li>
        ))}
      </ol>
    </section>
  )
}

export function Manifesto() {
  const MANIFESTO = useContent().content.manifesto
  return (
    <section className="section manifesto">
      <span className="section-tag">{MANIFESTO.eyebrow}</span>
      <h2>
        {MANIFESTO.titleTop}
        <br />
        <em>{MANIFESTO.titleBottom}</em>
      </h2>
    </section>
  )
}

export function Footer() {
  const { content } = useContent()
  const FOOTER = { ...content.footer, wordmark: content.brand.wordmark, email: content.brand.email }
  return (
    <footer className="footer">
      <span className="footer-wordmark">{FOOTER.wordmark}</span>
      <nav className="footer-links">
        {FOOTER.links.map((l) => (
          <a key={l} href="#">
            {l}
          </a>
        ))}
      </nav>
      <p className="footer-legal">{FOOTER.legal}</p>
      <p className="footer-legal">
        {FOOTER.address} · <a href={`mailto:${FOOTER.email}`}>{FOOTER.email}</a>
      </p>
    </footer>
  )
}

export function StickyBuyBar() {
  const { pricing } = useContent().content
  const tier = pricing.tiers.find((t) => t.qty === pricing.highlightQty) ?? pricing.tiers[0]
  return (
    <a className="sticky-buy-bar" href="#pedido">
      <span className="sticky-buy-qty">
        {tier.qty} {tier.qty === 1 ? pricing.unitOne : pricing.unitMany} · {pricing.currency} {tier.total}
      </span>
      <span className="sticky-buy-cta">{pricing.buyLabel}</span>
    </a>
  )
}
