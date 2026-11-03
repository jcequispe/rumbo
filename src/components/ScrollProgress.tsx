import { useEffect, useRef } from 'react'
import { onScrollProgress } from '../lib/smoothScroll'
import './scrollProgress.css'

export default function ScrollProgress() {
  const railRef = useRef<HTMLDivElement>(null)
  const thumbRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const apply = (p: number) => {
      const rail = railRef.current
      const thumb = thumbRef.current
      if (!rail || !thumb) return
      const travel = rail.clientHeight - thumb.clientHeight
      thumb.style.transform = `translateY(${Math.max(0, travel) * p}px)`
    }

    apply(0)
    return onScrollProgress(apply)
  }, [])

  return (
    <div ref={railRef} className="scroll-rail" aria-hidden="true">
      <div ref={thumbRef} className="scroll-thumb" />
    </div>
  )
}
