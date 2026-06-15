'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'
import { RiAddLine, RiSearchLine } from '@remixicon/react'
import type { MockupCollectionSlug } from '@/lib/mockups/navigation'
import { getNavItem } from '@/lib/mockups/navigation'
import type { Location, Employee, MaintenanceTeam } from '@/payload-types'
import { detailHref, newHref } from '@/lib/mockups/links'
import { getDocIdentifier } from '@/lib/mockups/identifiers'
import { DataTable } from './DataTable'
import { LocationOrgChart } from './LocationOrgChart'
import { EmployeeCardGrid } from './EmployeeCardGrid'
import { TeamsTable } from './TeamsTable'
import { PaginationHint } from '@/components/mockups/shared/PaginationHint'
import * as Button from '@/components/ui/button'
import * as Input from '@/components/ui/input'
import * as SegmentedControl from '@/components/ui/segmented-control'
import * as Tag from '@/components/ui/tag'

type Doc = Record<string, unknown> & { id: string }

export function CollectionView({
  slug,
  docs,
  totalDocs,
  limit = 200,
}: {
  slug: MockupCollectionSlug
  docs: Doc[]
  totalDocs?: number
  limit?: number
}) {
  const router = useRouter()
  const nav = getNavItem(slug)
  const [filter, setFilter] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')
  const [search, setSearch] = useState('')

  const filteredDocs = useMemo(() => {
    let result = docs
    if (filter === 'all') {
      // no filter
    } else if (slug === 'locations') {
      if (filter === 'groups') result = result.filter((d) => d.isGroup)
      if (filter === 'leaves') result = result.filter((d) => !d.isGroup)
    } else if (slug === 'tickets') {
      result = result.filter((d) => d.status === filter)
    }
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter((d) =>
        Object.values(d).some((v) => String(v ?? '').toLowerCase().includes(q)),
      )
    }
    return result
  }, [docs, filter, slug, search])

  const openDetail = (doc: Doc) => {
    router.push(detailHref('qatalog', slug, getDocIdentifier(doc, slug)))
  }

  const filters = getFilters(slug)

  return (
    <div className="px-12 pb-12 pt-6">
      {nav ? (
        <p className="mb-6 max-w-2xl text-paragraph-md text-text-sub-600">{nav.item.description}</p>
      ) : null}

      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <span className="text-paragraph-sm text-text-sub-600">
          {filteredDocs.length} {filteredDocs.length === 1 ? 'record' : 'records'}
        </span>
        <div className="flex flex-wrap items-center gap-3">
          {slug === 'employees' ? (
            <SegmentedControl.Root
              value={viewMode}
              onValueChange={(value) => setViewMode(value as 'grid' | 'table')}
            >
              <SegmentedControl.List className="w-auto">
                <SegmentedControl.Trigger value="grid">Cards</SegmentedControl.Trigger>
                <SegmentedControl.Trigger value="table">Table</SegmentedControl.Trigger>
              </SegmentedControl.List>
            </SegmentedControl.Root>
          ) : null}
          <Input.Root size="medium" className="w-48">
            <Input.Wrapper>
              <Input.Icon as={RiSearchLine} />
              <Input.Input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search…"
                aria-label="Search records"
              />
            </Input.Wrapper>
          </Input.Root>
          <Link href={newHref('qatalog', slug)}>
            <Button.Root variant="primary" mode="filled" size="medium">
              <Button.Icon as={RiAddLine} />
              Add new
            </Button.Root>
          </Link>
        </div>
      </div>

      {filters.length > 0 ? (
        <div className="mb-6 flex flex-wrap gap-2">
          {filters.map((f) => (
            <button key={f.value} type="button" onClick={() => setFilter(f.value)}>
              <Tag.Root variant={filter === f.value ? 'gray' : 'stroke'}>
                {f.label}
              </Tag.Root>
            </button>
          ))}
        </div>
      ) : null}

      {slug === 'locations' ? (
        <LocationOrgChart
          locations={filteredDocs as unknown as (Location & { id: string })[]}
          onSelect={(id) => {
            const doc = docs.find((d) => d.id === id)
            if (doc) openDetail(doc)
          }}
        />
      ) : slug === 'employees' && viewMode === 'grid' ? (
        <EmployeeCardGrid
          employees={filteredDocs as unknown as (Employee & { id: string })[]}
          onSelect={(id) => {
            const doc = docs.find((d) => d.id === id)
            if (doc) openDetail(doc)
          }}
        />
      ) : slug === 'maintenance-teams' ? (
        <TeamsTable
          teams={filteredDocs as unknown as (MaintenanceTeam & { id: string })[]}
          onSelect={(id) => {
            const doc = docs.find((d) => d.id === id)
            if (doc) openDetail(doc)
          }}
        />
      ) : (
        <DataTable
          slug={slug}
          docs={filteredDocs}
          onSelect={(id) => {
            const doc = docs.find((d) => d.id === id)
            if (doc) openDetail(doc)
          }}
        />
      )}

      {totalDocs != null ? <PaginationHint totalDocs={totalDocs} limit={limit} /> : null}
    </div>
  )
}

function getFilters(slug: MockupCollectionSlug): { label: string; value: string }[] {
  switch (slug) {
    case 'locations':
      return [
        { label: 'All', value: 'all' },
        { label: 'Groups', value: 'groups' },
        { label: 'Leaves', value: 'leaves' },
      ]
    case 'tickets':
      return [
        { label: 'All', value: 'all' },
        { label: 'Open', value: 'open' },
        { label: 'In progress', value: 'in_progress' },
        { label: 'Completed', value: 'completed' },
        { label: 'Cancelled', value: 'cancelled' },
      ]
    default:
      return []
  }
}
