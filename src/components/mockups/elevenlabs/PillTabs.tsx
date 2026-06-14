'use client'

import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import type { LibraryTab } from './utils'
import styles from './PillTabs.module.css'

const TABS: { id: LibraryTab; label: string }[] = [
  { id: 'active', label: 'Active' },
  { id: 'all', label: 'All' },
  { id: 'archived', label: 'Archived' },
]

export function PillTabs() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const current = (searchParams.get('tab') as LibraryTab) || 'active'

  return (
    <div className={styles.tabs} role="tablist">
      {TABS.map((tab) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set('tab', tab.id)
        const href = `${pathname}?${params.toString()}`
        return (
          <Link
            key={tab.id}
            href={href}
            className={`${styles.tab} ${current === tab.id ? styles.active : ''}`}
            role="tab"
            aria-selected={current === tab.id}
          >
            {tab.label}
          </Link>
        )
      })}
    </div>
  )
}
