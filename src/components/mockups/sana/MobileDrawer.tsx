'use client'

import { useEffect } from 'react'
import styles from './sana.module.css'

type MobileDrawerProps = {
  open: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}

export function MobileDrawer({ open, onClose, title, children }: MobileDrawerProps) {
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <>
      <button type="button" className={styles.drawerOverlay} aria-label="Close drawer" onClick={onClose} />
      <aside className={styles.drawer} role="dialog" aria-modal="true" aria-label={title}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 20px',
            borderBottom: '1px solid var(--sana-border)',
            position: 'sticky',
            top: 0,
            background: 'var(--sana-surface)',
          }}
        >
          <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>{title}</h2>
          <button
            type="button"
            onClick={onClose}
            style={{
              border: 'none',
              background: 'var(--sana-bg-soft)',
              borderRadius: 8,
              padding: '6px 12px',
              font: 'inherit',
              fontSize: 13,
              cursor: 'pointer',
              color: 'var(--sana-text-muted)',
            }}
          >
            Close
          </button>
        </div>
        <div style={{ padding: 20 }}>{children}</div>
      </aside>
    </>
  )
}
