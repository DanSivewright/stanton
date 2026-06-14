'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { MOCKUP_NAV } from '@/lib/mockups/navigation'
import styles from './Sidebar.module.css'

const BASE = '/mockups/elevenlabs'

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className={styles.sidebar}>
      <div className={styles.brand}>
        <span className={styles.logoMark}>S</span>
        <div>
          <span className={styles.brandName}>Stanton</span>
          <span className={styles.brandSub}>Asset Management</span>
        </div>
      </div>

      <nav className={styles.nav}>
        <Link
          href={BASE}
          className={`${styles.navItem} ${pathname === BASE ? styles.active : ''}`}
        >
          <HomeIcon />
          Home
        </Link>

        {MOCKUP_NAV.map((group) => (
          <div key={group.label} className={styles.group}>
            <span className={styles.groupLabel}>{group.label}</span>
            {group.items.map((item) => {
              const href = `${BASE}/${item.slug}`
              const active = pathname === href || pathname.startsWith(`${href}/`)
              return (
                <Link
                  key={item.slug}
                  href={href}
                  className={`${styles.navItem} ${active ? styles.active : ''}`}
                  title={item.description}
                >
                  <NavDot />
                  {item.label}
                </Link>
              )
            })}
          </div>
        ))}
      </nav>

      <div className={styles.footer}>
        <div className={styles.profile}>
          <span className={styles.profileAvatar}>DK</span>
          <div className={styles.profileInfo}>
            <span className={styles.profileName}>Demo Admin</span>
            <span className={styles.profileEmail}>admin@stanton-demo.local</span>
          </div>
        </div>
      </div>
    </aside>
  )
}

function HomeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <path
        d="M2 6.5L8 2l6 4.5V14a1 1 0 01-1 1H3a1 1 0 01-1-1V6.5z"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
      <path d="M6 15V9h4v6" stroke="currentColor" strokeWidth="1.25" strokeLinejoin="round" />
    </svg>
  )
}

function NavDot() {
  return <span className={styles.dot} aria-hidden />
}
