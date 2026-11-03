import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

let lenis: Lenis | null = null
const progressListeners: Array<(p: number) => void> = []

/** Se suscribe al progreso de scroll (0..1) — funciona aunque Lenis aún no esté montado. */
export function onScrollProgress(cb: (p: number) => void) {
  progressListeners.push(cb)
  return () => {
    const i = progressListeners.indexOf(cb)
    if (i >= 0) progressListeners.splice(i, 1)
  }
}

/** Monta Lenis una sola vez a nivel de layout y lo conecta con ScrollTrigger. */
export function initSmoothScroll() {
  if (lenis) return lenis

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduced) return null

  lenis = new Lenis({
    duration: 1.15,
    easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    syncTouch: true,
  })
  lenis.on('scroll', ScrollTrigger.update)
  lenis.on('scroll', ({ scroll, limit }: { scroll: number; limit: number }) => {
    const p = limit > 0 ? scroll / limit : 0
    progressListeners.forEach((fn) => fn(p))
  })
  gsap.ticker.add((time) => lenis?.raf(time * 1000))
  gsap.ticker.lagSmoothing(0)

  // Lenis maneja el scroll por su cuenta — un <a href="#id"> nativo del
  // navegador salta y Lenis lo "pisa" al siguiente frame porque no sabe
  // que pasó. Enganchamos nosotros el click y usamos lenis.scrollTo().
  document.addEventListener('click', (e) => {
    const anchor = (e.target as HTMLElement)?.closest('a[href^="#"]') as HTMLAnchorElement | null
    if (!anchor) return
    const hash = anchor.getAttribute('href')
    if (!hash || hash === '#') return
    const target = document.querySelector(hash)
    if (!target) return
    e.preventDefault()
    lenis?.scrollTo(target as HTMLElement, { offset: -80 })
  })

  return lenis
}

export { gsap, ScrollTrigger }
