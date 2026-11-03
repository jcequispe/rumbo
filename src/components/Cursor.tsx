import { useEffect, useRef } from 'react'
import { gsap } from '../lib/smoothScroll'
import './cursor.css'

const HOVER_SELECTOR = 'a, button, input, [role="button"]'

export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const hoveredRef = useRef(false)

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches
    if (!fine) return

    document.body.classList.add('has-custom-cursor')

    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    const setDot = gsap.quickTo(dot, 'x', { duration: 0.1, ease: 'power3.out' })
    const setDotY = gsap.quickTo(dot, 'y', { duration: 0.1, ease: 'power3.out' })
    const setRing = gsap.quickTo(ring, 'x', { duration: 0.45, ease: 'power3.out' })
    const setRingY = gsap.quickTo(ring, 'y', { duration: 0.45, ease: 'power3.out' })

    const onMove = (e: MouseEvent) => {
      setDot(e.clientX)
      setDotY(e.clientY)
      setRing(e.clientX)
      setRingY(e.clientY)
    }

    // onda tipo "gota en el agua": al entrar a un link, un anillo nace del
    // tamaño del cursor y se expande desvaneciéndose — una sola vez por hover
    const onOver = (e: MouseEvent) => {
      if (!(e.target as HTMLElement)?.closest(HOVER_SELECTOR)) return
      if (hoveredRef.current) return
      hoveredRef.current = true
      ring.classList.add('cursor-ring--hover')

      const splash = document.createElement('div')
      splash.className = 'cursor-splash'
      splash.style.transform = `translate(${gsap.getProperty(ring, 'x')}px, ${gsap.getProperty(ring, 'y')}px) translate(-50%, -50%)`
      document.body.appendChild(splash)
      gsap.fromTo(
        splash,
        { scale: 0.5, opacity: 0.5 },
        { scale: 2.2, opacity: 0, duration: 0.7, ease: 'power2.out', onComplete: () => splash.remove() },
      )
    }
    const onOut = (e: MouseEvent) => {
      if (!(e.target as HTMLElement)?.closest(HOVER_SELECTOR)) return
      hoveredRef.current = false
      ring.classList.remove('cursor-ring--hover')
    }

    window.addEventListener('mousemove', onMove)
    document.addEventListener('mouseover', onOver)
    document.addEventListener('mouseout', onOut)

    return () => {
      document.body.classList.remove('has-custom-cursor')
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseover', onOver)
      document.removeEventListener('mouseout', onOut)
    }
  }, [])

  return (
    <>
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
    </>
  )
}
