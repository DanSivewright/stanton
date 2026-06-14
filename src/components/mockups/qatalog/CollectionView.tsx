'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import type { MockupCollectionSlug } from '@/lib/mockups/navigation'
import { getNavItem } from '@/lib/mockups/navigation'
import type { Location, Employee, MaintenanceTeam } from '@/payload-types'
import { qatalogStyles } from './tokens'
import { QatalogTopBar } from './QatalogShell'
import { QButton, Pill } from './ui'
import { DataTable } from './DataTable'
import { LocationOrgChart } from './LocationOrgChart'
import { EmployeeCardGrid } from './EmployeeCardGrid'
import { TeamsTable } from './TeamsTable'
import { CollectionDetailDrawer } from './CollectionDetailDrawer'
import { IconPlus, IconSearch } from './icons'
import { qatalog } from './tokens'
import { useMemo, useState } from 'react'

type Doc = Record<string, unknown> & { id: string }

export function CollectionView({
  slug,
  docs,
  detailDoc,
}: {
  slug: MockupCollectionSlug
  docs: Doc[]
  detailDoc: Doc | null
}) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const detailId = searchParams.get('id')
  const nav = getNavItem(slug)
  const [filter, setFilter] = useState<string>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid')

  const filteredDocs = useMemo(() => {
    if (filter === 'all') return docs
    if (slug === 'locations') {
      if (filter === 'groups') return docs.filter((d) => d.isGroup)
      if (filter === 'leaves') return docs.filter((d) => !d.isGroup)
    }
    if (slug === 'tickets') {
      return docs.filter((d) => d.status === filter)
    }
    return docs
  }, [docs, filter, slug])

  const openDetail = (id: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('id', id)
    router.push(`/mockups/qatalog/${slug}?${params.toString()}`, { scroll: false })
  }

  const closeDetail = () => {
    router.push(`/mockups/qatalog/${slug}`, { scroll: false })
  }

  const filters = getFilters(slug)

  return (
    <>
      <div style={qatalogStyles.content}>
        {nav ? (
          <p style={{ ...qatalogStyles.subtitle, marginTop: 24 }}>{nav.item.description}</p>
        ) : null}

        <QatalogTopBar
          count={filteredDocs.length}
          action={
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              {slug === 'employees' ? (
                <div style={{ display: 'flex', gap: 6 }}>
                  <Pill active={viewMode === 'grid'} onClick={() => setViewMode('grid')}>
                    Cards
                  </Pill>
                  <Pill active={viewMode === 'table'} onClick={() => setViewMode('table')}>
                    Table
                  </Pill>
                </div>
              ) : null}
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '8px 14px',
                  border: `1px solid ${qatalog.border}`,
                  borderRadius: qatalog.radius,
                  color: qatalog.textMuted,
                  fontSize: 14,
                }}
              >
                <IconSearch size={16} />
                Search
              </span>
              <QButton variant="primary">
                <IconPlus size={16} color="#fff" />
                Add new
              </QButton>
            </div>
          }
        />

        {filters.length > 0 ? (
          <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
            {filters.map((f) => (
              <Pill key={f.value} active={filter === f.value} onClick={() => setFilter(f.value)}>
                {f.label}
              </Pill>
            ))}
          </div>
        ) : null}

        {slug === 'locations' ? (
          <LocationOrgChart
            locations={filteredDocs as unknown as (Location & { id: string })[]}
            onSelect={openDetail}
          />
        ) : slug === 'employees' && viewMode === 'grid' ? (
          <EmployeeCardGrid
            employees={filteredDocs as unknown as (Employee & { id: string })[]}
            onSelect={openDetail}
          />
        ) : slug === 'maintenance-teams' ? (
          <TeamsTable
            teams={filteredDocs as unknown as (MaintenanceTeam & { id: string })[]}
            onSelect={openDetail}
          />
        ) : (
          <DataTable slug={slug} docs={filteredDocs} onSelect={openDetail} />
        )}
      </div>

      <CollectionDetailDrawer
        slug={slug}
        doc={detailId && detailDoc ? detailDoc : null}
        open={Boolean(detailId && detailDoc)}
        onClose={closeDetail}
      />
    </>
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
      ]
    default:
      return []
  }
}
