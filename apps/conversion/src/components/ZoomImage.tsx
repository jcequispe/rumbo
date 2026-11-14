import { useEffect, useLayoutEffect, useRef, useState } from 'react'

/* ---------- Visor de imagen con zoom ----------
   Las fotos de la página se recortan (object-fit: cover) para encajar en su
   tarjeta, y en las páginas interiores de la agenda eso corta texto. Este botón
   se pone encima de la foto y abre la imagen COMPLETA a pantalla completa:
   - Pellizcar con dos dedos acerca/aleja (1× a 5×).
   - Doble toque (o doble clic) alterna entre 1× y 2.5×.
   - Arrastrar mueve la imagen cuando está ampliada (scroll nativo del contenedor).
   - Botones − / + para quien no pueda pellizcar; Esc o ✕ cierran. */

const MIN = 1
const MAX = 5
const DOUBLE_TAP_ZOOM = 2.5
const STEP = 0.75
const clamp = (n: number) => Math.min(MAX, Math.max(MIN, n))

const LABELS = {
  open: 'Ver imagen completa y ampliar',
  hint: 'Ampliar',
  close: 'Cerrar',
  zoomIn: 'Acercar',
  zoomOut: 'Alejar',
  helper: 'Pellizca o toca dos veces para acercar',
}

export function ZoomImage({ src, alt }: { src: string; alt: string }) {
  const ref = useRef<HTMLDialogElement>(null)
  const scroller = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const [zoom, setZoom] = useState(MIN)

  // Fracción del contenido que está en el centro del visor antes de cambiar el zoom,
  // para mantener ese punto centrado al acercar o alejar.
  const focus = useRef({ x: 0.5, y: 0.5 })
  const remember = () => {
    const s = scroller.current
    if (!s) return
    focus.current = {
      x: (s.scrollLeft + s.clientWidth / 2) / s.scrollWidth,
      y: (s.scrollTop + s.clientHeight / 2) / s.scrollHeight,
    }
  }
  const apply = (next: number) => {
    remember()
    setZoom(clamp(next))
  }

  useLayoutEffect(() => {
    const s = scroller.current
    if (!s) return
    s.scrollLeft = focus.current.x * s.scrollWidth - s.clientWidth / 2
    s.scrollTop = focus.current.y * s.scrollHeight - s.clientHeight / 2
  }, [zoom])

  useEffect(() => {
    const d = ref.current
    if (!d) return
    if (open && !d.open) {
      d.showModal()
      document.documentElement.classList.add('no-scroll')
    } else if (!open && d.open) {
      d.close()
    }
    if (!open) document.documentElement.classList.remove('no-scroll')
  }, [open])

  useEffect(() => () => document.documentElement.classList.remove('no-scroll'), [])

  const close = () => {
    setOpen(false)
    setZoom(MIN)
  }

  // Pellizco con dos punteros + doble toque con uno.
  const pointers = useRef(new Map<number, { x: number; y: number }>())
  const pinch = useRef<{ dist: number; zoom: number } | null>(null)
  const lastTap = useRef(0)
  const moved = useRef(false)

  const dist = () => {
    const [a, b] = [...pointers.current.values()]
    return Math.hypot(a.x - b.x, a.y - b.y)
  }

  const onPointerDown = (e: React.PointerEvent) => {
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY })
    moved.current = false
    if (pointers.current.size === 2) pinch.current = { dist: dist(), zoom }
  }
  const onPointerMove = (e: React.PointerEvent) => {
    if (!pointers.current.has(e.pointerId)) return
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY })
    moved.current = true
    if (pointers.current.size === 2 && pinch.current) {
      apply(pinch.current.zoom * (dist() / pinch.current.dist))
    }
  }
  const onPointerUp = (e: React.PointerEvent) => {
    const wasSingle = pointers.current.size === 1
    pointers.current.delete(e.pointerId)
    if (pointers.current.size < 2) pinch.current = null
    if (wasSingle && !moved.current) {
      const now = Date.now()
      if (now - lastTap.current < 300) {
        apply(zoom > MIN ? MIN : DOUBLE_TAP_ZOOM)
        lastTap.current = 0
      } else {
        lastTap.current = now
      }
    }
  }

  return (
    <>
      <button type="button" className="zoom-trigger" onClick={() => setOpen(true)} aria-label={`${LABELS.open}: ${alt}`}>
        <span className="zoom-badge" aria-hidden="true">
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="8.5" cy="8.5" r="5.5" />
            <path d="M13 13l4.5 4.5M8.5 6v5M6 8.5h5" />
          </svg>
          {LABELS.hint}
        </span>
      </button>

      <dialog
        ref={ref}
        className="lightbox"
        aria-label={alt}
        onCancel={(e) => {
          e.preventDefault()
          close()
        }}
      >
        <div className="lightbox-bar">
          <span className="lightbox-helper">{LABELS.helper}</span>
          <div className="lightbox-actions">
            <button type="button" onClick={() => apply(zoom - STEP)} disabled={zoom <= MIN} aria-label={LABELS.zoomOut}>
              −
            </button>
            <button type="button" onClick={() => apply(zoom + STEP)} disabled={zoom >= MAX} aria-label={LABELS.zoomIn}>
              +
            </button>
            <button type="button" onClick={close} aria-label={LABELS.close}>
              <svg width="18" height="18" viewBox="0 0 20 20" aria-hidden="true">
                <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        </div>
        <div
          className="lightbox-scroll"
          ref={scroller}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          {open && <img src={src} alt={alt} draggable={false} style={{ width: `${zoom * 100}%` }} />}
        </div>
      </dialog>
    </>
  )
}
