'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { getNavItem, MOCKUP_NAV, type MockupCollectionSlug } from '@/lib/mockups/navigation'
import { cn } from '@/utils/cn'

export function QatalogSectionTabs({ activeSlug }: { activeSlug?: MockupCollectionSlug }) {
  const pathname = usePathname()
  const slugFromPath = pathname.split('/')[3]
  const slug = activeSlug ?? (slugFromPath as MockupCollectionSlug)
  const nav = getNavItem(slug)

  if (!nav) return null

  const { group } = nav

  return (
    <header className="border-b border-stroke-soft-200 px-12 pb-0 pt-10">
      <p className="mb-5 text-subheading-xs uppercase tracking-[0.1em] text-text-soft-400">
        {group.label}
      </p>
      <div className="-mb-px flex flex-wrap gap-x-8 gap-y-2">
        {group.items.map((item) => {
          const active = item.slug === slug
          return (
            <Link
              key={item.slug}
              href={`/mockups/qatalog/${item.slug}`}
              className={cn(
                'border-b-2 pb-4 text-title-h3 tracking-tight transition-colors duration-200',
                active
                  ? 'border-text-strong-950 text-text-strong-950'
                  : 'border-transparent text-text-soft-400 hover:text-text-sub-600',
              )}
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
      <header className="border-b border-stroke-soft-200 px-12 pb-8 pt-10">
        {title ? <h1 className="text-title-h2 tracking-tight text-text-strong-950">{title}</h1> : null}
        {description ? (
          <p className="mt-3 max-w-2xl text-paragraph-md text-text-sub-600">{description}</p>
        ) : null}
      </header>
    )
  }

  return <QatalogSectionTabs activeSlug={activeSlug} />
}

export function getGroupForSlug(slug: string) {
  return MOCKUP_NAV.find((g) => g.items.some((i) => i.slug === slug))
}
