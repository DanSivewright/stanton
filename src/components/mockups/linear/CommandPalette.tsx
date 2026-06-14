'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { MOCKUP_NAV } from '@/lib/mockups/navigation'
import { NAV_ICONS } from './collection-config'
import styles from './CommandPalette.module.css'
import linearStyles from './linear.module.css'

type CommandPaletteProps = {
  open: boolean
  onClose: () => void
}

export function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState('')

  useEffect(() => {
    if (!open) {
      setQuery('')
      return
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  const q = query.toLowerCase()
  const filtered = MOCKUP_NAV.flatMap((group) =>
    group.items
      .filter(
        (item) =>
          !q ||
          item.label.toLowerCase().includes(q) ||
          item.slug.includes(q) ||
          group.label.toLowerCase().includes(q),
      )
      .map((item) => ({ ...item, group: group.label })),
  )

  return (
    <div className={styles.overlay} onClick={onClose} role="presentation">
      <div
        className={styles.dialog}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-label="Command palette"
      >
        <div className={styles.inputRow}>
          <span className={styles.searchIcon}>⌕</span>
          <input
            className={styles.input}
            placeholder="Search collections, jump to view…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
          <span className={linearStyles.kbd}>esc</span>
        </div>
        <div className={styles.results}>
          {filtered.length === 0 ? (
            <div className={styles.sectionLabel}>No results</div>
          ) : (
            <>
              <div className={styles.sectionLabel}>Collections</div>
              {filtered.map((item) => (
                <Link
                  key={item.slug}
                  href={`/mockups/linear/${item.slug}`}
                  className={styles.resultItem}
                  onClick={onClose}
                >
                  <span className={styles.resultIcon}>{NAV_ICONS[item.slug]}</span>
                  <span>{item.label}</span>
                  <span className={styles.resultMeta}>{item.group}</span>
                </Link>
              ))}
            </>
          )}
        </div>
        <div className={styles.footer}>
          <span className={styles.footerHint}>
            <span className={linearStyles.kbd}>↑↓</span> navigate
          </span>
          <span className={styles.footerHint}>
            <span className={linearStyles.kbd}>↵</span> open
          </span>
          <span className={styles.footerHint}>
            <span className={linearStyles.kbd}>esc</span> close
          </span>
        </div>
      </div>
    </div>
  )
}

