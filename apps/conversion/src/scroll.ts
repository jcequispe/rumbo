import { useEffect } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

gsap.registerPlugin(ScrollTrigger)

/**
 * Motor de scroll del sitio: Lenis (inercia suave) sincronizado con el
 * ticker de GSAP, para que ScrollTrigger lea la misma posición "suavizada"
 * en vez de pelear con dos sistemas de scroll distintos.
 *
 * Se desactiva por completo con prefers-reduced-motion: el scroll nativo
 * del navegador (instantáneo) es la versión accesible, no un extra.
 */
export function useScrollEngine() {
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const lenis = new Lenis({ duration: 1.05, smoothWheel: true })
    lenis.on('scroll', ScrollTrigger.update)

    const tick = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    // Lenis "posee" el scroll (anima hacia su propio destino cada frame), así
    // que un salto de ancla nativo (clic en <a href="#...">) se revertía solo:
    // el navegador movía scrollY una vez, pero el RAF de Lenis lo regresaba a
    // donde él creía que estaba. Hay que pedírselo a Lenis directamente.
    const onAnchorClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest('a[href^="#"]')
      if (!a) return
      const id = a.getAttribute('href')!.slice(1)
      const el = document.getElementById(id)
      if (!el) return
      e.preventDefault()
      // --switcher-h solo existe (32px) mientras la barra de revisión interna
      // está montada (desarrollo); en producción es 0. Se lee en vivo en vez
      // de asumir un valor fijo para que el salto de ancla no se desalinee
      // según el entorno. El +72 es el mismo margen que scroll-padding-top.
      const switcherH = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--switcher-h')) || 0
      lenis.scrollTo(el, { offset: -(switcherH + 72) })
    }
    document.addEventListener('click', onAnchorClick)

    return () => {
      document.removeEventListener('click', onAnchorClick)
      gsap.ticker.remove(tick)
      lenis.destroy()
      ScrollTrigger.getAll().forEach((t) => t.kill())
    }
  }, [])
}

export { gsap, ScrollTrigger }
