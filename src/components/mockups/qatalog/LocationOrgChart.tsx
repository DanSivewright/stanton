'use client'

import type { Location } from '@/payload-types'
import { relLabel } from '@/lib/mockups/helpers'
import { qatalog } from './tokens'
import { IconChevronRight } from './icons'

type LocationDoc = Location & { id: string }

function buildTree(locations: LocationDoc[]): LocationDoc[] {
  const byId = new Map(locations.map((l) => [l.id, l]))
  const roots: LocationDoc[] = []

  for (const loc of locations) {
    const parentId =
      typeof loc.parent === 'object' && loc.parent ? loc.parent.id : loc.parent
    if (!parentId || !byId.has(String(parentId))) {
      roots.push(loc)
    }
  }

  return roots.sort((a, b) => a.name.localeCompare(b.name))
}

function getChildren(locations: LocationDoc[], parentId: string): LocationDoc[] {
  return locations
    .filter((l) => {
      const pid = typeof l.parent === 'object' && l.parent ? l.parent.id : l.parent
      return String(pid) === parentId
    })
    .sort((a, b) => a.name.localeCompare(b.name))
}

function LocationBox({
  location,
  onSelect,
}: {
  location: LocationDoc
  onSelect?: (id: string) => void
}) {
  const company = relLabel(location.company)
  const isGroup = location.isGroup

  return (
    <button
      type="button"
      onClick={() => onSelect?.(location.id)}
      style={{
        padding: '14px 18px',
        minWidth: 160,
        maxWidth: 220,
        border: `1px solid ${qatalog.border}`,
        borderRadius: qatalog.radius,
        background: isGroup ? qatalog.bgMuted : qatalog.bg,
        cursor: onSelect ? 'pointer' : 'default',
        textAlign: 'left',
        fontFamily: 'inherit',
        transition: 'border-color 0.15s, box-shadow 0.15s',
      }}
      onMouseEnter={(e) => {
        if (onSelect) {
          e.currentTarget.style.borderColor = qatalog.borderStrong
          e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)'
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = qatalog.border
        e.currentTarget.style.boxShadow = 'none'
      }}
    >
      <div style={{ fontSize: 14, fontWeight: 500, marginBottom: 4 }}>{location.name}</div>
      <div style={{ fontSize: 12, color: qatalog.textSecondary, display: 'flex', gap: 6, alignItems: 'center' }}>
        {location.kind ? <span style={{ textTransform: 'capitalize' }}>{location.kind}</span> : null}
        {location.kind ? <span>·</span> : null}
        <span>{isGroup ? 'Group' : 'Leaf'}</span>
      </div>
      <div style={{ fontSize: 11, color: qatalog.textMuted, marginTop: 6 }}>{company}</div>
    </button>
  )
}

function OrgBranch({
  location,
  allLocations,
  onSelect,
}: {
  location: LocationDoc
  allLocations: LocationDoc[]
  onSelect?: (id: string) => void
}) {
  const children = getChildren(allLocations, location.id)

  if (children.length === 0) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <LocationBox location={location} onSelect={onSelect} />
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <LocationBox location={location} onSelect={onSelect} />
      <div style={{ width: 1, height: 28, background: qatalog.borderStrong }} />
      <div style={{ position: 'relative', display: 'flex', gap: 24, alignItems: 'flex-start' }}>
        {children.length > 1 && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: '50%',
              transform: 'translateX(-50%)',
              height: 1,
              width: `calc(100% - ${160 / children.length}px)`,
              background: qatalog.borderStrong,
            }}
          />
        )}
        {children.map((child) => (
          <div key={child.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: 1, height: 20, background: qatalog.borderStrong }} />
            <OrgBranch location={child} allLocations={allLocations} onSelect={onSelect} />
          </div>
        ))}
      </div>
    </div>
  )
}

export function LocationOrgChart({
  locations,
  onSelect,
}: {
  locations: LocationDoc[]
  onSelect?: (id: string) => void
}) {
  const roots = buildTree(locations)

  if (locations.length === 0) {
    return (
      <div style={{ padding: 48, textAlign: 'center', color: qatalog.textSecondary }}>
        No locations yet. Seed demo data to populate the org chart.
      </div>
    )
  }

  const byCompany = new Map<string, LocationDoc[]>()
  for (const loc of locations) {
    const companyName = relLabel(loc.company)
    const list = byCompany.get(companyName) ?? []
    list.push(loc)
    byCompany.set(companyName, list)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>
      {[...byCompany.entries()].map(([companyName, companyLocs]) => {
        const companyRoots = buildTree(companyLocs)
        return (
          <section key={companyName}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                marginBottom: 32,
                fontSize: 13,
                fontWeight: 500,
                color: qatalog.textSecondary,
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
              }}
            >
              <IconChevronRight size={14} />
              {companyName}
            </div>
            <div
              style={{
                overflowX: 'auto',
                paddingBottom: 16,
              }}
            >
              <div style={{ display: 'flex', gap: 48, justifyContent: 'center', minWidth: 'min-content', padding: '0 24px' }}>
                {companyRoots.map((root) => (
                  <OrgBranch key={root.id} location={root} allLocations={companyLocs} onSelect={onSelect} />
                ))}
              </div>
            </div>
          </section>
        )
      })}
    </div>
  )
}
