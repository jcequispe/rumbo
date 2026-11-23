import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { useContent } from '../content/ContentProvider'
import { bestTotal, formatMoney, savings as calcSavings } from './pricing'

export interface Line {
  editionId: string
  formatId: string
  qty: number
}

interface CartCtx {
  lines: Line[]
  count: number
  total: number
  saved: number
  atMax: boolean
  isOpen: boolean
  toast: string | null
  open: () => void
  close: () => void
  add: (editionId: string, formatId: string) => void
  setQty: (editionId: string, formatId: string, qty: number) => void
  remove: (editionId: string, formatId: string) => void
  checkoutHref: string
  money: (n: number) => string
  unitLabel: (n: number) => string
}

const Ctx = createContext<CartCtx | null>(null)
const STORAGE_KEY = 'aurea-cart-v1'

export function useCart() {
  const c = useContext(Ctx)
  if (!c) throw new Error('useCart fuera de <CartProvider>')
  return c
}

const same = (l: Line, e: string, f: string) => l.editionId === e && l.formatId === f

export function CartProvider({ children }: { children: ReactNode }) {
  const { content, waLink } = useContent()
  const { pricing, cart } = content
  const [lines, setLines] = useState<Line[]>(() => {
    try {
      const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]') as Line[]
      return raw.filter(
        (l) =>
          content.editions.some((e) => e.id === l.editionId) &&
          content.formats.items.some((f) => f.id === l.formatId) &&
          Number.isInteger(l.qty) &&
          l.qty > 0,
      )
    } catch {
      return []
    }
  })
  const [isOpen, setOpen] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const toastTimer = useRef<number>(0)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines))
    } catch {
      /* sin almacenamiento: el carrito vive solo en memoria */
    }
  }, [lines])

  const count = lines.reduce((n, l) => n + l.qty, 0)
  const total = bestTotal(pricing.tiers, count)
  const saved = calcSavings(pricing.tiers, count)
  const atMax = count >= pricing.maxQty

  const labelOf = useCallback(
    (l: Line) => ({
      edition: content.editions.find((e) => e.id === l.editionId)?.label ?? l.editionId,
      format: content.formats.items.find((f) => f.id === l.formatId)?.name ?? l.formatId,
    }),
    [content],
  )

  const add = useCallback(
    (editionId: string, formatId: string) => {
      if (count >= pricing.maxQty) return
      setLines((prev) =>
        prev.some((l) => same(l, editionId, formatId))
          ? prev.map((l) => (same(l, editionId, formatId) ? { ...l, qty: l.qty + 1 } : l))
          : [...prev, { editionId, formatId, qty: 1 }],
      )
      const { edition, format } = labelOf({ editionId, formatId, qty: 1 })
      setToast(cart.added.replace('{edition}', edition).replace('{format}', format))
      window.clearTimeout(toastTimer.current)
      toastTimer.current = window.setTimeout(() => setToast(null), 2600)
    },
    [cart.added, count, labelOf, pricing.maxQty],
  )

  const setQty = useCallback(
    (editionId: string, formatId: string, qty: number) =>
      setLines((prev) => {
        const others = prev.reduce((n, l) => (same(l, editionId, formatId) ? n : n + l.qty), 0)
        const capped = Math.min(qty, pricing.maxQty - others)
        if (capped <= 0) return prev.filter((l) => !same(l, editionId, formatId))
        return prev.some((l) => same(l, editionId, formatId))
          ? prev.map((l) => (same(l, editionId, formatId) ? { ...l, qty: capped } : l))
          : [...prev, { editionId, formatId, qty: capped }]
      }),
    [pricing.maxQty],
  )

  const remove = useCallback((editionId: string, formatId: string) => setLines((prev) => prev.filter((l) => !same(l, editionId, formatId))), [])

  // Espacio que no se parte: evita que el símbolo ('$') quede solo al final de una línea.
  const money = useCallback((n: number) => `${pricing.currency}\u00A0${formatMoney(n)}`, [pricing.currency])
  const unitLabel = useCallback((n: number) => (n === 1 ? pricing.unitOne : pricing.unitMany), [pricing.unitOne, pricing.unitMany])

  // Con el carrito vacío, el pedido por defecto es una agenda: el botón de compra nunca lleva a un mensaje en blanco.
  const checkoutHref = useMemo(() => {
    const order = lines.length ? lines : [{ editionId: content.editions[0].id, formatId: content.formats.items[0].id, qty: 1 }]
    const n = order.reduce((s, l) => s + l.qty, 0)
    const body = order
      .map((l) => {
        const { edition, format } = labelOf(l)
        return cart.messageLine.replace('{qty}', String(l.qty)).replace('{edition}', edition).replace('{format}', format)
      })
      .join('\n')
    const totalLine = cart.messageTotal
      .replace('{total}', money(bestTotal(pricing.tiers, n)).replace(/\u00A0/g, ' '))
      .replace('{count}', String(n))
      .replace('{unit}', unitLabel(n))
    const bonusLine = cart.messageBonus ? `\n${cart.messageBonus}` : ''
    const outro = cart.messageOutro ? `\n\n${cart.messageOutro}` : ''
    return waLink(`${cart.messageIntro}\n${body}\n${totalLine}${bonusLine}${outro}`)
  }, [lines, content, cart, pricing.tiers, labelOf, money, unitLabel, waLink])

  const value: CartCtx = {
    lines,
    count,
    total,
    saved,
    atMax,
    isOpen,
    toast,
    open: () => setOpen(true),
    close: () => setOpen(false),
    add,
    setQty,
    remove,
    checkoutHref,
    money,
    unitLabel,
  }
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}
