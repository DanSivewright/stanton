'use client'

import { createContext, use, useEffect, useState, type ReactNode } from 'react'
import { CommandPalette } from './CommandPalette'

type CommandPaletteContextValue = {
  open: boolean
  setOpen: (open: boolean) => void
}

const CommandPaletteContext = createContext<CommandPaletteContextValue | null>(null)

export function LinearProvider({ children }: { children: ReactNode }) {
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
      <CommandPalette open={open} onClose={() => setOpen(false)} />
    </CommandPaletteContext>
  )
}

export function useCommandPalette() {
  const ctx = use(CommandPaletteContext)
  if (!ctx) throw new Error('useCommandPalette must be used within LinearProvider')
  return ctx
}
