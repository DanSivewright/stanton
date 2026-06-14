'use client'

import Link from 'next/link'
import { useState } from 'react'
import { relLabel } from '@/lib/mockups/helpers'
import type { Location } from '@/payload-types'
import { IconChevron, IconMapPin } from './icons'
import { cardStyle } from './tokens'

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
    <div style={{ marginLeft: depth > 0 ? 20 : 0 }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '10px 12px',
          borderRadius: 10,
          marginBottom: 4,
          background: depth === 0 ? 'var(--sana-surface-hover)' : 'transparent',
        }}
      >
        {hasChildren ? (
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            style={{
              border: 'none',
              background: 'transparent',
              padding: 0,
              cursor: 'pointer',
              display: 'flex',
            }}
            aria-expanded={open}
          >
            <IconChevron direction={open ? 'down' : 'right'} />
          </button>
        ) : (
          <span style={{ width: 16 }} />
        )}
        <IconMapPin size={16} color={node.isGroup ? 'var(--sana-accent)' : 'var(--sana-text-subtle)'} />
        <Link
          href={`${basePath}/locations/${node.id}`}
          style={{
            flex: 1,
            textDecoration: 'none',
            color: 'var(--sana-text)',
            fontWeight: node.isGroup ? 600 : 400,
            fontSize: 14,
          }}
        >
          {node.name}
        </Link>
        {node.kind && (
          <span
            style={{
              fontSize: 11,
              padding: '2px 8px',
              borderRadius: 999,
              background: 'var(--sana-accent-soft)',
              color: 'var(--sana-accent)',
              textTransform: 'capitalize',
            }}
          >
            {node.kind}
          </span>
        )}
        {node.isGroup && (
          <span style={{ fontSize: 11, color: 'var(--sana-text-subtle)' }}>Group</span>
        )}
        <span style={{ fontSize: 12, color: 'var(--sana-text-subtle)' }}>
          {relLabel(node.company)}
        </span>
      </div>
      {open &&
        hasChildren &&
        node.children.map((child) => (
          <TreeNode key={child.id} node={child} depth={depth + 1} basePath={basePath} />
        ))}
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
      <div style={{ ...cardStyle, padding: 32, textAlign: 'center', color: 'var(--sana-text-subtle)' }}>
        No locations found.
      </div>
    )
  }

  return (
    <div style={{ ...cardStyle, padding: 16 }}>
      {roots.map((root) => (
        <TreeNode key={root.id} node={root} basePath={basePath} />
      ))}
    </div>
  )
}
