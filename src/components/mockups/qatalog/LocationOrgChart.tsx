'use client'

import type { Location } from '@/payload-types'
import { relLabel } from '@/lib/mockups/helpers'
import { RiArrowRightSLine } from '@remixicon/react'
import { cn } from '@/utils/cn'

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
      className={cn(
        'min-w-40 max-w-56 rounded-xl border border-stroke-soft-200 p-4 text-left transition duration-200',
        isGroup ? 'bg-bg-weak-50' : 'bg-bg-white-0',
        onSelect && 'cursor-pointer hover:border-stroke-strong-950 hover:shadow-regular-sm',
      )}
    >
      <div className="text-label-sm font-medium text-text-strong-950">{location.name}</div>
      <div className="mt-1 flex items-center gap-1.5 text-paragraph-xs text-text-sub-600">
        {location.kind ? <span className="capitalize">{location.kind}</span> : null}
        {location.kind ? <span>·</span> : null}
        <span>{isGroup ? 'Group' : 'Leaf'}</span>
      </div>
      <div className="mt-2 text-paragraph-xs text-text-soft-400">{company}</div>
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
      <div className="flex flex-col items-center">
        <LocationBox location={location} onSelect={onSelect} />
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center">
      <LocationBox location={location} onSelect={onSelect} />
      <div className="h-7 w-px bg-stroke-soft-200" />
      <div className="relative flex items-start gap-6">
        {children.length > 1 ? (
          <div className="absolute left-1/2 top-0 h-px w-[calc(100%-4rem)] -translate-x-1/2 bg-stroke-soft-200" />
        ) : null}
        {children.map((child) => (
          <div key={child.id} className="flex flex-col items-center">
            <div className="h-5 w-px bg-stroke-soft-200" />
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
  if (locations.length === 0) {
    return (
      <div className="rounded-xl border border-stroke-soft-200 px-6 py-12 text-center text-paragraph-md text-text-sub-600">
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
    <div className="flex flex-col gap-12">
      {[...byCompany.entries()].map(([companyName, companyLocs]) => {
        const companyRoots = buildTree(companyLocs)
        return (
          <section key={companyName}>
            <div className="mb-8 flex items-center gap-2 text-subheading-xs uppercase tracking-[0.08em] text-text-sub-600">
              <RiArrowRightSLine className="size-4" />
              {companyName}
            </div>
            <div className="overflow-x-auto rounded-2xl bg-bg-weak-50 p-6 pb-4">
              <div className="flex min-w-min justify-center gap-12 px-6">
                {companyRoots.map((root) => (
                  <OrgBranch
                    key={root.id}
                    location={root}
                    allLocations={companyLocs}
                    onSelect={onSelect}
                  />
                ))}
              </div>
            </div>
          </section>
        )
      })}
    </div>
  )
}
