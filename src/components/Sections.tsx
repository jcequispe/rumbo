import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { CLOSING, FOR_WHOM, TESTIMONIALS } from '../content'
import { Reveal, Stagger, StaggerItem } from './Reveal'
import './sections.css'

const TILTS = [-2.2, 1.8, 1.4, -1.6]

export function Testimonials() {
  return (
    <section className="section" id="testimonios">
      <Reveal>
        <h2 style={{ marginBottom: 36 }}>Lo que dicen quienes ya volvieron.</h2>
      </Reveal>
      <Stagger className="testi-grid">
        {TESTIMONIALS.map((t, i) => (
          <StaggerItem key={t.id}>
            <div className="testi-card" style={{ '--tilt': `${TILTS[i % TILTS.length]}deg` } as CSSProperties}>
              <span className="testi-quote-mark" aria-hidden="true">
                "
              </span>
              <div className="testi-stars" aria-label="5 de 5 estrellas">
                {Array.from({ length: 5 }).map((_, star) => (
                  <svg key={star} width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M12 2.5l2.9 6.6 7.1.6-5.4 4.7 1.7 7-6.3-3.8-6.3 3.8 1.7-7-5.4-4.7 7.1-.6 2.9-6.6z" />
                  </svg>
                ))}
              </div>
              <img className="testi-avatar" src={t.avatar} alt="" loading="lazy" />
              <div className="testi-body">
                <p>"{t.quote}"</p>
                <span>
                  {t.name} · {t.place}
                </span>
              </div>
            </div>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  )
}

export function ForWhom() {
  return (
    <section className="section">
      <Reveal>
        <h2 style={{ marginBottom: 36 }}>{FOR_WHOM.heading}</h2>
      </Reveal>
      <div className="for-whom-grid">
        <div className="for-whom-col">
          <Reveal delay={0.05}>
            <h3>{FOR_WHOM.yes.label}</h3>
          </Reveal>
          <Stagger className="for-whom-list" gap={0.1}>
            {FOR_WHOM.yes.items.map((item) => (
              <StaggerItem key={item}>
                <li>{item}</li>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
        <div className="for-whom-col">
          <Reveal delay={0.1}>
            <h3>{FOR_WHOM.no.label}</h3>
          </Reveal>
          <Stagger className="for-whom-list" gap={0.1}>
            {FOR_WHOM.no.items.map((item) => (
              <StaggerItem key={item}>
                <li>{item}</li>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  )
}

export function Closing() {
  // Sin botón propio a propósito: el nav y la barra fija de abajo ya
  // llevan al carrito en #edicion — un tercer botón amarillo acá era
  // redundante y, peor, abría WhatsApp directo saltándose la elección
  // de color/cantidad (inconsistente con esos otros dos).
  return (
    <section className="section closing-section" id="cierre">
      <Reveal>
        <p className="lead">{CLOSING.text}</p>
      </Reveal>
    </section>
  )
}

export function WhatsAppBar() {
  // mismo criterio que el nav: lleva al carrito en #edicion, no dispara
  // un WhatsApp genérico que se salta la elección de color/cantidad
  const [hidden, setHidden] = useState(false)
  const barRef = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    const target = document.getElementById('edicion')
    if (!target) return

    // Estando parado justo en "La Edición", esta barra repite lo mismo
    // que el "Pedir" del nav — ocupa ~56px fijos de pantalla sin aportar
    // nada. Se esconde solo mientras esa sección está a la vista.
    const observer = new IntersectionObserver(([entry]) => setHidden(entry.isIntersecting), {
      rootMargin: '-40% 0px -40% 0px',
    })
    observer.observe(target)
    return () => observer.disconnect()
  }, [])

  return (
    <a ref={barRef} className={hidden ? 'whatsapp-bar whatsapp-bar-hidden' : 'whatsapp-bar'} href="#edicion">
      Pedir ahora
    </a>
  )
}
