'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { MOCKUP_NAV } from '@/lib/mockups/navigation'
import { qatalog } from './tokens'
import { getGroupIcon, IconHome } from './icons'

export function QatalogSidebar() {
  const pathname = usePathname()
  const isHome = pathname === '/mockups/qatalog'

  return (
    <nav
      aria-label="Main"
      style={{
        width: qatalog.sidebarWidth,
        borderRight: `1px solid ${qatalog.border}`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '16px 0',
        gap: 4,
        flexShrink: 0,
        background: qatalog.bg,
      }}
    >
      <Link
        href="/mockups/qatalog"
        title="Overview"
        style={{
          ...iconLinkStyle,
          background: isHome ? qatalog.bgHover : 'transparent',
        }}
      >
        <IconHome size={20} />
      </Link>

      <div style={{ width: 24, height: 1, background: qatalog.border, margin: '8px 0' }} />

      {MOCKUP_NAV.map((group) => {
        const Icon = getGroupIcon(group.label)
        const firstSlug = group.items[0].slug
        const active = group.items.some((item) => pathname.includes(`/mockups/qatalog/${item.slug}`))

        return (
          <Link
            key={group.label}
            href={`/mockups/qatalog/${firstSlug}`}
            title={group.label}
            style={{
              ...iconLinkStyle,
              background: active ? qatalog.bgHover : 'transparent',
              color: active ? qatalog.text : qatalog.textMuted,
            }}
          >
            <Icon size={20} />
          </Link>
        )
      })}

      <div style={{ flex: 1 }} />

      <Link
        href="/mockups"
        title="All mockups"
        style={{
          ...iconLinkStyle,
          fontSize: 10,
          fontWeight: 600,
          color: qatalog.textMuted,
          letterSpacing: '0.02em',
        }}
      >
        ←
      </Link>
    </nav>
  )
}

const iconLinkStyle: React.CSSProperties = {
  width: 40,
  height: 40,
  borderRadius: qatalog.radius,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  textDecoration: 'none',
  color: qatalog.textSecondary,
  transition: 'background 0.15s',
}
