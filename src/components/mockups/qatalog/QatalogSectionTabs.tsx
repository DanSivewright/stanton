'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { getNavItem, MOCKUP_NAV, type MockupCollectionSlug } from '@/lib/mockups/navigation'
import { qatalog, qatalogStyles } from './tokens'

export function QatalogSectionTabs({ activeSlug }: { activeSlug?: MockupCollectionSlug }) {
  const pathname = usePathname()
  const slugFromPath = pathname.split('/').pop()
  const slug = activeSlug ?? (slugFromPath as MockupCollectionSlug)
  const nav = getNavItem(slug)

  if (!nav) return null

  const { group } = nav

  return (
    <header style={{ padding: '40px 48px 0', borderBottom: `1px solid ${qatalog.border}` }}>
      <p
        style={{
          margin: '0 0 20px',
          fontSize: 13,
          color: qatalog.textMuted,
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          fontWeight: 500,
        }}
      >
        {group.label}
      </p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 32px', marginBottom: -1 }}>
        {group.items.map((item) => {
          const active = item.slug === slug
          return (
            <Link
              key={item.slug}
              href={`/mockups/qatalog/${item.slug}`}
              style={{
                textDecoration: 'none',
                color: active ? qatalog.text : qatalog.textMuted,
                fontSize: 42,
                fontWeight: 400,
                letterSpacing: '-0.03em',
                lineHeight: 1.1,
                paddingBottom: 16,
                borderBottom: active ? `2px solid ${qatalog.text}` : '2px solid transparent',
                transition: 'color 0.15s',
              }}
            >
              {item.label}
            </Link>
          )
        })}
      </div>
    </header>
  )
}

export function QatalogPageHeader({
  title,
  description,
  hideTabs,
  activeSlug,
}: {
  title?: string
  description?: string
  hideTabs?: boolean
  activeSlug?: MockupCollectionSlug
}) {
  if (hideTabs) {
    return (
      <header style={{ padding: '40px 48px 0' }}>
        <h1 style={qatalogStyles.sectionTitle}>{title}</h1>
        {description ? <p style={qatalogStyles.subtitle}>{description}</p> : null}
      </header>
    )
  }

  return <QatalogSectionTabs activeSlug={activeSlug} />
}

export function getGroupForSlug(slug: string) {
  return MOCKUP_NAV.find((g) => g.items.some((i) => i.slug === slug))
}
