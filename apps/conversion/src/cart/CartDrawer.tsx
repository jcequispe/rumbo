import { useEffect, useRef } from 'react'
import { useContent } from '../content/ContentProvider'
import { useCart } from './CartProvider'

export function CartDrawer() {
  const { content, media } = useContent()
  const { cart } = content
  const c = useCart()
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const d = ref.current
    if (!d) return
    if (c.isOpen && !d.open) {
      d.showModal()
      document.documentElement.classList.add('no-scroll')
    } else if (!c.isOpen && d.open) {
      d.close()
    }
    if (!c.isOpen) document.documentElement.classList.remove('no-scroll')
  }, [c.isOpen])

  useEffect(() => () => document.documentElement.classList.remove('no-scroll'), [])

  return (
    <dialog
      ref={ref}
      className="cart"
      aria-labelledby="cart-title"
      onCancel={(e) => {
        e.preventDefault()
        c.close()
      }}
      onClick={(e) => {
        if (e.target === ref.current) c.close()
      }}
    >
      <div className="cart-panel">
        <header className="cart-head">
          <h2 id="cart-title">{cart.title}</h2>
          <button type="button" className="icon-btn" onClick={c.close} aria-label={cart.close}>
            <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
              <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </header>

        {c.lines.length === 0 ? (
          <div className="cart-empty">
            <p className="cart-empty-title">{cart.empty}</p>
            <p>{cart.emptyHint}</p>
            <a
              className="btn btn-primary"
              href="#elige"
              onClick={() => c.close()}
            >
              {cart.emptyCta}
            </a>
          </div>
        ) : (
          <>
            <ul className="cart-lines">
              {c.lines.map((l) => {
                const ed = content.editions.find((e) => e.id === l.editionId)
                const fm = content.formats.items.find((f) => f.id === l.formatId)
                if (!ed || !fm) return null
                return (
                  <li className="cart-line" key={`${l.editionId}-${l.formatId}`}>
                    <img src={media(ed.image)} alt="" width={72} height={72} />
                    <div className="cart-line-info">
                      <strong>{ed.label}</strong>
                      <span>{fm.name}</span>
                      <button type="button" className="text-btn" onClick={() => c.remove(l.editionId, l.formatId)}>
                        {cart.remove}
                      </button>
                    </div>
                    <div className="qty" role="group" aria-label={`${ed.label} · ${fm.name}`}>
                      <button type="button" onClick={() => c.setQty(l.editionId, l.formatId, l.qty - 1)} aria-label={cart.decrease}>
                        −
                      </button>
                      <output aria-live="polite">{l.qty}</output>
                      <button type="button" onClick={() => c.setQty(l.editionId, l.formatId, l.qty + 1)} aria-label={cart.increase} disabled={c.atMax}>
                        +
                      </button>
                    </div>
                  </li>
                )
              })}
            </ul>

            <footer className="cart-foot">
              {c.atMax && <p className="cart-max">{cart.max.replace('{max}', String(content.pricing.maxQty))}</p>}
              {c.saved > 0 && <p className="cart-savings">{cart.savings.replace('{amount}', c.money(c.saved))}</p>}
              <p className="cart-total">
                <span>
                  {cart.total} · {c.count} {c.unitLabel(c.count)}
                </span>
                <strong>{c.money(c.total)}</strong>
              </p>
              <a className="btn btn-primary btn-large btn-wa" href={c.checkoutHref} target="_blank" rel="noreferrer">
                <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden="true" fill="currentColor">
                  <path d="M12.04 2a9.9 9.9 0 0 0-8.4 15.1L2 22l5-1.6A9.9 9.9 0 1 0 12.04 2Zm5.8 14c-.25.7-1.4 1.3-1.95 1.35-.5.05-1.1.07-1.8-.12a14 14 0 0 1-4.3-2.4 8.5 8.5 0 0 1-2.2-3c-.45-1.1-.2-1.9.2-2.4.35-.4.9-.55 1.2-.5h.4c.15 0 .3.05.5.5l.7 1.7c.05.15.1.3 0 .45-.2.35-.4.5-.55.7-.15.15-.3.3-.12.6a7 7 0 0 0 3.2 2.75c.3.15.5.1.65-.1l.8-1c.2-.25.4-.2.65-.1l1.65.8c.25.12.4.2.5.3.1.2.1.8-.15 1.5Z" />
                </svg>
                {cart.checkout}
              </a>
              <button type="button" className="text-btn text-btn-center" onClick={c.close}>
                {cart.keepShopping}
              </button>
              <p className="cart-note">{cart.note}</p>
            </footer>
          </>
        )}
      </div>
    </dialog>
  )
}

export function CartToast() {
  const { content } = useContent()
  const c = useCart()
  return (
    <div className={c.toast ? 'toast show' : 'toast'} role="status" aria-live="polite">
      <span>{c.toast}</span>
      {c.toast && (
        <button type="button" className="toast-action" onClick={c.open}>
          {content.cart.viewCart}
        </button>
      )}
    </div>
  )
}
