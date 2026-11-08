import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import yaml from 'js-yaml'
import type { Content } from './types'

const SITE = 'conversion'
const BASE = (import.meta.env.VITE_CONTENT_BASE_URL ?? 'https://jcequispe.github.io/agenda-aurea-content').replace(/\/$/, '')

interface Ctx {
  content: Content
  media: (path: string) => string
  waLink: (text: string) => string
}

const ContentContext = createContext<Ctx | null>(null)

export function useContent(): Ctx {
  const ctx = useContext(ContentContext)
  if (!ctx) throw new Error('useContent fuera de <ContentProvider>')
  return ctx
}

export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<Content | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [attempt, setAttempt] = useState(0)

  useEffect(() => {
    const ctrl = new AbortController()
    fetch(`${BASE}/sites/${SITE}/content.yml`, { signal: ctrl.signal, cache: 'no-cache' })
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.text()
      })
      .then((text) => setContent(yaml.load(text) as Content))
      .catch((e: unknown) => {
        if (!ctrl.signal.aborted) setError(e instanceof Error ? e.message : String(e))
      })
    return () => ctrl.abort()
  }, [attempt])

  const media = useCallback((path: string) => `${BASE}/media/${path}`, [])
  const value = useMemo<Ctx | null>(
    () =>
      content && {
        content,
        media,
        waLink: (text) => `https://wa.me/${content.whatsapp.number}?text=${encodeURIComponent(text)}`,
      },
    [content, media],
  )

  if (value) return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>

  if (error) {
    return (
      <div className="content-status" role="alert">
        <p>No pudimos cargar la página.</p>
        <button
          type="button"
          onClick={() => {
            setError(null)
            setAttempt((n) => n + 1)
          }}
        >
          Reintentar
        </button>
      </div>
    )
  }
  return <div className="content-status" aria-busy="true" />
}
