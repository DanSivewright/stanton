'use client'

import Link from 'next/link'
import { useState } from 'react'
import { RiArrowDownSLine, RiArrowRightSLine, RiMapPinLine } from '@remixicon/react'
import { relLabel } from '@/lib/mockups/helpers'
import type { Location } from '@/payload-types'
import * as Badge from '@/components/ui/badge'
import * as CompactButton from '@/components/ui/compact-button'
import { cn } from '@/utils/cn'

type LocationNode = Location & { id: string }

type TreeNodeData = LocationNode & { children: TreeNodeData[] }

function buildTree(locations: LocationNode[]): TreeNodeData[] {
  const byId = new Map<string, TreeNodeData>()
  const roots: TreeNodeData[] = []

  for (const loc of locations) {
    byId.set(loc.id, { ...loc, children: [] })
  }

  for (const loc of locations) {
    const node = byId.get(loc.id)!
    const parentId =
      typeof loc.parent === 'object' && loc.parent ? loc.parent.id : loc.parent ?? null
    if (parentId && byId.has(String(parentId))) {
      byId.get(String(parentId))!.children.push(node)
    } else {
      roots.push(node)
    }
  }

  return roots
}

function TreeNode({
  node,
  depth = 0,
  basePath,
}: {
  node: TreeNodeData
  depth?: number
  basePath: string
}) {
  const [open, setOpen] = useState(depth < 2)
  const hasChildren = node.children.length > 0

  return (
    <div className={cn(depth > 0 && 'ml-5')}>
      <div
        className={cn(
          'mb-1 flex items-center gap-2 rounded-xl px-3 py-2.5 transition',
          depth === 0 ? 'bg-bg-weak-50' : 'hover:bg-bg-weak-50',
        )}
      >
        {hasChildren ? (
          <CompactButton.Root variant="ghost" size="medium" onClick={() => setOpen((o) => !o)}>
            <CompactButton.Icon as={open ? RiArrowDownSLine : RiArrowRightSLine} />
          </CompactButton.Root>
        ) : (
          <span className="size-8 shrink-0" />
        )}

        <RiMapPinLine
          className={cn('size-4 shrink-0', node.isGroup ? 'text-feature-base' : 'text-text-soft-400')}
        />

        <Link
          href={`${basePath}/locations/${node.id}`}
          className={cn(
            'flex-1 text-label-sm text-text-strong-950 transition hover:text-feature-base',
            node.isGroup && 'font-semibold',
          )}
        >
          {node.name}
        </Link>

        {node.kind ? (
          <Badge.Root variant="lighter" color="purple" size="small">
            {node.kind}
          </Badge.Root>
        ) : null}

        {node.isGroup ? (
          <span className="text-paragraph-xs text-text-soft-400">Group</span>
        ) : null}

        <span className="hidden text-paragraph-xs text-text-soft-400 sm:inline">
          {relLabel(node.company)}
        </span>
      </div>

      {open && hasChildren
        ? node.children.map((child) => (
            <TreeNode key={child.id} node={child} depth={depth + 1} basePath={basePath} />
          ))
        : null}
    </div>
  )
}

type LocationTreeProps = {
  locations: LocationNode[]
  basePath?: string
}

export function LocationTree({ locations, basePath = '/mockups/sana' }: LocationTreeProps) {
  const roots = buildTree(locations)

  if (roots.length === 0) {
    return (
      <div className="rounded-2xl bg-bg-white-0 px-8 py-12 text-center text-paragraph-sm text-text-soft-400 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200">
        No locations found.
      </div>
    )
  }

  return (
    <div className="rounded-2xl bg-bg-white-0 p-4 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200">
      {roots.map((root) => (
        <TreeNode key={root.id} node={root} basePath={basePath} />
      ))}
    </div>
  )
}
