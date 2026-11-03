import { useEffect, useRef, useState } from 'react'

/**
 * Progreso continuo de scroll dentro de un contenedor "pinned" de altura
 * `steps * 100vh`. Devuelve un valor 0..steps que nunca salta — se puede
 * leer en cualquier frame del scroll, hacia adelante o hacia atrás.
 */
export function useScrollProgress(steps: number) {
  const ref = useRef<HTMLDivElement>(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let raf = 0
    const read = () => {
      const el = ref.current
      if (el) {
        const rect = el.getBoundingClientRect()
        const total = rect.height - window.innerHeight
        const traveled = -rect.top
        const p = total > 0 ? THREE_clamp(traveled / total, 0, 1) : 0
        setProgress(p * steps)
      }
      raf = requestAnimationFrame(read)
    }
    raf = requestAnimationFrame(read)
    return () => cancelAnimationFrame(raf)
  }, [steps])

  return { ref, progress }
}

function THREE_clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v))
}

export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mql.matches)
    const onChange = () => setReduced(mql.matches)
    mql.addEventListener('change', onChange)
    return () => mql.removeEventListener('change', onChange)
  }, [])
  return reduced
}

export function useHasWebGL() {
  const [has, setHas] = useState(true)
  useEffect(() => {
    try {
      const canvas = document.createElement('canvas')
      const gl = canvas.getContext('webgl2') || canvas.getContext('webgl')
      setHas(!!gl)
    } catch {
      setHas(false)
    }
  }, [])
  return has
}

export function useNarrowViewport(breakpoint = 760) {
  const [narrow, setNarrow] = useState(
    typeof window !== 'undefined' ? window.innerWidth < breakpoint : false,
  )
  useEffect(() => {
    const onResize = () => setNarrow(window.innerWidth < breakpoint)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [breakpoint])
  return narrow
}
