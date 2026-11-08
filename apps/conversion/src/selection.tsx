import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { useContent } from './content/ContentProvider'

interface Selection {
  editionId: string
  setEditionId: (id: string) => void
  formatId: string
  setFormatId: (id: string) => void
}
const SelectionContext = createContext<Selection | null>(null)

export function SelectionProvider({ children }: { children: ReactNode }) {
  const { content } = useContent()
  const [editionId, setEditionId] = useState(content.editions[0].id)
  const [formatId, setFormatId] = useState(content.formats.items[0].id)

  // La página entera se tiñe con la portada elegida (--ed): barra de progreso, escenario, brillo del cierre.
  useEffect(() => {
    const color = content.editions.find((e) => e.id === editionId)?.color
    if (color) document.documentElement.style.setProperty('--ed', color)
  }, [content.editions, editionId])

  return <SelectionContext.Provider value={{ editionId, setEditionId, formatId, setFormatId }}>{children}</SelectionContext.Provider>
}

export function useSelection() {
  const s = useContext(SelectionContext)
  if (!s) throw new Error('useSelection fuera de <SelectionProvider>')
  return s
}
