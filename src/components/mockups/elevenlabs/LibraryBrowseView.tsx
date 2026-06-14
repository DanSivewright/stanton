import { Suspense } from 'react'
import type { MockupCollectionSlug } from '@/lib/mockups/navigation'
import { getNavItem } from '@/lib/mockups/navigation'
import { FilterChips } from './FilterChips'
import { ItemRow } from './ItemRow'
import { PageHeader, PrimaryButton } from './PageHeader'
import { PillTabs } from './PillTabs'
import { SearchBar } from './SearchBar'
import {
  docId,
  filterByChip,
  filterBySearch,
  filterLibraryDocs,
  type LibraryTab,
} from './utils'
import styles from './LibraryBrowseView.module.css'

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
        action={<PrimaryButton>+ Add new</PrimaryButton>}
      >
        <div className={styles.toolbar}>
          <Suspense fallback={<div className={styles.tabsFallback} />}>
            <PillTabs />
          </Suspense>
        </div>
        <div className={styles.filters}>
          <Suspense fallback={null}>
            <SearchBar
              placeholder={`Search ${slug === 'assets' ? 'assets' : 'tickets'}…`}
            />
          </Suspense>
        </div>
        <Suspense fallback={null}>
          <FilterChips chips={chips} paramKey={chipLabel} />
        </Suspense>
      </PageHeader>

      <p className={styles.count}>
        {filtered.length} {filtered.length === 1 ? 'item' : 'items'}
      </p>

      {filtered.length === 0 ? (
        <div className={styles.empty}>
          <p>No {slug} match the current filters.</p>
        </div>
      ) : (
        <div className={styles.list}>
          {filtered.map((doc) => (
            <ItemRow key={docId(doc)} slug={slug} doc={doc} />
          ))}
        </div>
      )}
    </div>
  )
}
