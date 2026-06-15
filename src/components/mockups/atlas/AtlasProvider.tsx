'use client'

import { createContext, use, useEffect, useState, type ReactNode } from 'react'
import { AtlasCommandPalette } from './AtlasCommandPalette'

type CommandPaletteContextValue = {
  open: boolean
  setOpen: (open: boolean) => void
}

const CommandPaletteContext = createContext<CommandPaletteContextValue | null>(null)

export function AtlasProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen((v) => !v)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <CommandPaletteContext value={{ open, setOpen }}>
      {children}
      <AtlasCommandPalette open={open} onClose={() => setOpen(false)} />
    </CommandPaletteContext>
  )
}

export function useAtlasCommandPalette() {
  const ctx = use(CommandPaletteContext)
  if (!ctx) throw new Error('useAtlasCommandPalette must be used within AtlasProvider')
  return ctx
}
