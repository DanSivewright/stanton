'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { MOCKUP_NAV } from '@/lib/mockups/navigation'
import type { MockupCollectionSlug } from '@/lib/mockups/navigation'
import { NAV_ICONS } from './collection-config'
import { useCommandPalette } from './LinearProvider'
import styles from './Sidebar.module.css'
import linearStyles from './linear.module.css'

export function Sidebar() {
  const pathname = usePathname()
  const { setOpen } = useCommandPalette()

  const activeSlug = pathname.match(/\/mockups\/linear\/([^/]+)/)?.[1] as
    | MockupCollectionSlug
    | undefined

  return (
    <>
      <aside className={styles.sidebar}>
        <div className={styles.header}>
          <button type="button" className={styles.workspace} aria-label="Workspace switcher">
            <span className={styles.workspaceIcon}>S</span>
            <span className={styles.workspaceName}>Stanton</span>
            <span className={styles.workspaceChevron}>▾</span>
          </button>
        </div>

        <nav className={styles.nav} aria-label="Main navigation">
          <div className={styles.group}>
            <Link
              href="/mockups/linear"
              className={`${styles.navItem} ${pathname === '/mockups/linear' ? styles.navItemActive : ''}`}
            >
              <span className={styles.navIcon}>▦</span>
              Inbox
            </Link>
          </div>

          {MOCKUP_NAV.map((group) => (
            <div key={group.label} className={styles.group}>
              <div className={styles.groupLabel}>{group.label}</div>
              {group.items.map((item) => (
                <Link
                  key={item.slug}
                  href={`/mockups/linear/${item.slug}`}
                  className={`${styles.navItem} ${activeSlug === item.slug ? styles.navItemActive : ''}`}
                >
                  <span className={styles.navIcon}>{NAV_ICONS[item.slug]}</span>
                  {item.label}
                </Link>
              ))}
            </div>
          ))}
        </nav>

        <div className={styles.footer}>
          <Link href="/mockups" className={styles.footerLink}>
            ← All mockups
          </Link>
          <button
            type="button"
            className={styles.shortcutHint}
            onClick={() => setOpen(true)}
          >
            <span>Quick search</span>
            <span className={linearStyles.kbd}>⌘K</span>
          </button>
        </div>
      </aside>

    </>
  )
}
