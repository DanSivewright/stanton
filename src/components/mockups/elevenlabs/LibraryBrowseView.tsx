import { Suspense } from 'react'
import type { MockupCollectionSlug } from '@/lib/mockups/navigation'
import { getNavItem } from '@/lib/mockups/navigation'
import { FilterChips } from './FilterChips'
import { ItemRow } from './ItemRow'
import { PageHeader, PrimaryButton } from './PageHeader'
import { PillTabs } from './PillTabs'
import { SearchBar } from './SearchBar'
import { newHref } from '@/lib/mockups/links'
import {
  filterByChip,
  filterBySearch,
  filterLibraryDocs,
  type LibraryTab,
} from './utils'

type Chip = { id: string; label: string }

type LibraryBrowseViewProps = {
  slug: 'assets' | 'tickets'
  docs: Record<string, unknown>[]
  chips: Chip[]
  tab: LibraryTab
  query?: string
  chipId?: string
}

export function LibraryBrowseView({ slug, docs, chips, tab, query, chipId }: LibraryBrowseViewProps) {
  const nav = getNavItem(slug)
  let filtered = filterLibraryDocs(slug, docs, tab)
  filtered = filterByChip(slug, filtered, chipId)
  filtered = filterBySearch(filtered, query ?? '', slug)

  const chipLabel = slug === 'assets' ? 'category' : 'type'

  return (
    <div>
      <PageHeader
        title={nav?.item.label ?? slug}
        description={nav?.item.description}
        action={<PrimaryButton href={newHref('elevenlabs', slug)}>+ Add new</PrimaryButton>}
      >
        <Suspense fallback={<div className="h-9 w-64 animate-pulse rounded-full bg-bg-weak-50" />}>
          <PillTabs />
        </Suspense>
        <Suspense fallback={null}>
          <SearchBar placeholder={`Search ${slug === 'assets' ? 'assets' : 'tickets'}…`} />
        </Suspense>
        <Suspense fallback={null}>
          <FilterChips chips={chips} paramKey={chipLabel} />
        </Suspense>
      </PageHeader>

      <p className="mb-4 text-paragraph-sm text-text-sub-600">
        {filtered.length} {filtered.length === 1 ? 'item' : 'items'}
      </p>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-stroke-soft-200 bg-bg-weak-50 px-6 py-12 text-center">
          <p className="text-paragraph-sm text-text-sub-600">No {slug} match the current filters.</p>
        </div>
      ) : (
        <div className="rounded-xl ring-1 ring-inset ring-stroke-soft-200">
          <div className="divide-y divide-stroke-soft-200 px-4">
            {filtered.map((doc) => (
              <ItemRow key={String(doc.id)} slug={slug} doc={doc} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
