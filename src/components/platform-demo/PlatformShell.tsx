'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

import { platformNav } from '@/lib/platform-demo/mock-data'

export function PlatformShell({
  children,
  title,
  subtitle,
  actions,
  tvMode = false,
}: {
  children: React.ReactNode
  title: string
  subtitle?: string
  actions?: React.ReactNode
  tvMode?: boolean
}) {
  const pathname = usePathname()

  return (
    <div className={`platform ${tvMode ? 'platform--tv' : ''}`}>
      {!tvMode && (
        <aside className="platform__sidebar">
          <Link href="/platform" className="platform__brand">
            <span className="platform__brand-mark">P</span>
            <span className="platform__brand-text">
              <strong>PIMMS Platform</strong>
              <em>Stanton Group · Unified Demo</em>
            </span>
          </Link>

          <nav className="platform__nav">
            <div className="platform__nav-section">Modules</div>
            {platformNav.map((item) => {
              const nested = 'nested' in item && item.nested
              const active =
                item.href === '/platform'
                  ? pathname === '/platform'
                  : pathname === item.href || pathname.startsWith(`${item.href}/`)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`${active ? 'is-active' : ''} ${nested ? 'is-nested' : ''}`}
                >
                  <span className="platform__nav-icon">{item.icon}</span>
                  {item.label}
                </Link>
              )
            })}
          </nav>

          <div className="platform__sidebar-footer">
            UI demonstration only · No live data
            <br />
            Employee ID links all modules
          </div>
        </aside>
      )}

      <div className="platform__main">
        <header className="platform__header">
          <div>
            <h1>{title}</h1>
            {subtitle && <div className="platform__header-meta">{subtitle}</div>}
          </div>
          <div className="platform__header-actions">
            {actions}
            {!tvMode && (
              <span className="platform__header-meta">
                {new Date().toLocaleDateString('en-ZA', {
                  weekday: 'short',
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </span>
            )}
          </div>
        </header>
        <div className="platform__content">{children}</div>
      </div>
    </div>
  )
}

export function StatusBadge({ status }: { status: string }) {
  const normalized = status.toLowerCase().replace(/\s+/g, '_')
  return <span className={`p-badge p-badge--${normalized}`}>{status.replace(/_/g, ' ')}</span>
}

export function OeeBar({ value }: { value: number }) {
  const color = value >= 70 ? 'good' : value >= 60 ? 'warn' : 'bad'
  return (
    <div className="p-oee-bar">
      <div
        className={`p-oee-bar__fill p-oee-bar__fill--${color}`}
        style={{ width: `${Math.min(value, 100)}%` }}
      />
    </div>
  )
}
