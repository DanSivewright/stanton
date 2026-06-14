'use client'

import Link from 'next/link'
import styles from './TopBar.module.css'
import linearStyles from './linear.module.css'
import { useCommandPalette } from './LinearProvider'

type TopBarProps = {
  segments: { label: string; href?: string }[]
  count?: number
}

export function TopBar({ segments, count }: TopBarProps) {
  const { setOpen } = useCommandPalette()

  return (
    <header className={styles.topBar}>
      <nav className={styles.breadcrumb} aria-label="Breadcrumb">
        {segments.map((seg, i) => (
          <span key={seg.label} style={{ display: 'contents' }}>
            {i > 0 && <span className={styles.separator}>/</span>}
            {seg.href ? (
              <Link href={seg.href} className={styles.breadcrumbSegment}>
                {seg.label}
              </Link>
            ) : (
              <span className={styles.breadcrumbCurrent}>{seg.label}</span>
            )}
          </span>
        ))}
      </nav>
      <div className={styles.actions}>
        {count != null && <span className={styles.countBadge}>{count}</span>}
        <button type="button" className={styles.searchTrigger} onClick={() => setOpen(true)}>
          <span>Search</span>
          <span className={linearStyles.kbd}>⌘K</span>
        </button>
      </div>
    </header>
  )
}
