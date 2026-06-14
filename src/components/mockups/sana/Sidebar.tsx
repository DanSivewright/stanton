'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { MOCKUP_NAV } from '@/lib/mockups/navigation'
import { IconChevron, IconHome, IconMenu, IconSparkle } from './icons'
import styles from './sana.module.css'

const BASE = '/mockups/sana'

export function Sidebar() {
  const pathname = usePathname()
  const [navOpen, setNavOpen] = useState(false)
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({})

  const isHome = pathname === BASE
  const activeSlug = pathname.startsWith(`${BASE}/`) ? pathname.split('/')[3] : null

  function toggleGroup(label: string) {
    setCollapsed((prev) => ({ ...prev, [label]: !prev[label] }))
  }

  return (
    <>
      <aside className={styles.iconRail}>
        <Link
          href={BASE}
          className={`${styles.iconBtn} ${isHome ? styles.iconBtnActive : ''}`}
          title="Home"
        >
          <IconHome size={22} />
        </Link>
        <button
          type="button"
          className={`${styles.iconBtn} ${styles.menuToggle}`}
          onClick={() => setNavOpen((o) => !o)}
          title="Browse collections"
          aria-label="Toggle navigation"
        >
          <IconMenu size={22} />
        </button>
        <div style={{ flex: 1 }} />
        <span
          className={styles.iconBtn}
          style={{ cursor: 'default', background: 'var(--sana-accent-soft)' }}
          title="Sana AI variant"
        >
          <IconSparkle size={20} color="var(--sana-accent)" />
        </span>
      </aside>

      <nav className={`${styles.navPanel} ${navOpen ? styles.navPanelOpen : ''}`}>
        <div style={{ padding: '20px 20px 8px' }}>
          <p style={{ margin: 0, fontSize: 11, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--sana-text-subtle)' }}>
            Stanton
          </p>
          <p style={{ margin: '4px 0 0', fontSize: 15, fontWeight: 600 }}>Asset Management</p>
        </div>

        {MOCKUP_NAV.map((group) => {
          const isCollapsed = collapsed[group.label]
          return (
            <div key={group.label} className={styles.navGroup}>
              <button
                type="button"
                className={styles.navGroupHeader}
                onClick={() => toggleGroup(group.label)}
                aria-expanded={!isCollapsed}
              >
                {group.label}
                <IconChevron direction={isCollapsed ? 'right' : 'down'} />
              </button>
              <div className={isCollapsed ? styles.collapsed : styles.navItems}>
                {group.items.map((item) => {
                  const href = `${BASE}/${item.slug}`
                  const active = activeSlug === item.slug
                  return (
                    <Link
                      key={item.slug}
                      href={href}
                      className={`${styles.navItem} ${active ? styles.navItemActive : ''}`}
                      onClick={() => setNavOpen(false)}
                    >
                      {item.label}
                      <span className={styles.navItemDesc}>{item.description}</span>
                    </Link>
                  )
                })}
              </div>
            </div>
          )
        })}
      </nav>

      {navOpen && (
        <button
          type="button"
          className={`${styles.drawerOverlay} ${styles.navOverlay}`}
          aria-label="Close navigation"
          onClick={() => setNavOpen(false)}
          style={{ display: 'none' }}
        />
      )}
    </>
  )
}
