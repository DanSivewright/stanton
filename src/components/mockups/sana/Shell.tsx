'use client'

import Link from 'next/link'
import { Sidebar } from './Sidebar'
import styles from './sana.module.css'

type ShellProps = {
  title?: string
  subtitle?: string
  children: React.ReactNode
}

export function Shell({ title, subtitle, children }: ShellProps) {
  return (
    <div className={styles.shell}>
      <Sidebar />
      <div className={styles.main}>
        <header className={styles.topBar}>
          <div>
            {title && (
              <h1 style={{ margin: 0, fontSize: 18, fontWeight: 600, lineHeight: 1.3 }}>
                {title}
              </h1>
            )}
            {subtitle && (
              <p style={{ margin: '2px 0 0', fontSize: 13, color: 'var(--sana-text-muted)' }}>
                {subtitle}
              </p>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span
              style={{
                fontSize: 12,
                fontWeight: 500,
                padding: '4px 12px',
                borderRadius: 999,
                background: 'var(--sana-accent-soft)',
                color: 'var(--sana-accent)',
              }}
            >
              Sana AI
            </span>
            <Link
              href="/mockups"
              style={{
                fontSize: 13,
                color: 'var(--sana-text-muted)',
                textDecoration: 'none',
              }}
            >
              ← All variants
            </Link>
          </div>
        </header>
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  )
}
