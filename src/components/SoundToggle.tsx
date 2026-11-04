import { useRef, useState } from 'react'
import { AMBIENT_AUDIO_SRC } from '../content'
import './soundToggle.css'

// Audio ambiental opcional, nunca encendido por defecto: los navegadores
// bloquean el autoplay con sonido de todas formas, y aunque no lo
// bloquearan, forzarlo sería invasivo (muchos navegan en silencio). Un
// solo botón fijo, el usuario decide.
export default function SoundToggle() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [on, setOn] = useState(false)

  const toggle = () => {
    const audio = audioRef.current
    if (!audio) return
    if (on) {
      audio.pause()
    } else {
      audio.volume = 0.5
      audio.play().catch(() => {})
    }
    setOn(!on)
  }

  return (
    <>
      {/* eslint-disable-next-line jsx-a11y/media-has-caption */}
      <audio ref={audioRef} src={AMBIENT_AUDIO_SRC} loop preload="none" />
      <button
        type="button"
        className={on ? 'sound-toggle on' : 'sound-toggle'}
        onClick={toggle}
        aria-pressed={on}
        aria-label={on ? 'Silenciar sonido ambiental' : 'Activar sonido ambiental'}
      >
        {on ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M4 9v6h4l5 5V4L8 9H4z" fill="currentColor" />
            <path d="M16 8.5a5 5 0 0 1 0 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            <path d="M18.5 6a9 9 0 0 1 0 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M4 9v6h4l5 5V4L8 9H4z" fill="currentColor" />
            <path d="M16 9.5l5 5M21 9.5l-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        )}
      </button>
    </>
  )
}
