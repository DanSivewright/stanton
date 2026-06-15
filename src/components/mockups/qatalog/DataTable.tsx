'use client'

import type { MockupCollectionSlug } from '@/lib/mockups/navigation'
import { relLabel, statusLabel } from '@/lib/mockups/helpers'
import { COLLECTION_COLUMNS } from './collection-config'
import { QatalogAvatar } from './QatalogAvatar'
import * as AvatarGroupCompact from '@/components/ui/avatar-group-compact'
import * as StatusBadge from '@/components/ui/status-badge'
import * as Table from '@/components/ui/table'
import { RiArrowRightSLine } from '@remixicon/react'
import { cn } from '@/utils/cn'

type Doc = Record<string, unknown> & { id: string }

function getAvatarNames(slug: MockupCollectionSlug, doc: Doc): string[] | null {
  if (slug === 'maintenance-teams') {
    const members = doc.members as unknown[] | null | undefined
    if (!members?.length) return null
    return members.map((m) => relLabel(m as Parameters<typeof relLabel>[0]))
  }
  if (slug === 'tickets') {
    const names: string[] = []
    const reportedBy = doc.reportedBy
    const assignedTo = doc.assignedTo
    if (reportedBy) names.push(relLabel(reportedBy as Parameters<typeof relLabel>[0]))
    if (assignedTo) names.push(relLabel(assignedTo as Parameters<typeof relLabel>[0]))
    return names.length ? names : null
  }
  return null
}

function ticketStatus(status: string): 'completed' | 'pending' | 'failed' | 'disabled' {
  switch (status) {
    case 'completed':
      return 'completed'
    case 'cancelled':
      return 'disabled'
    case 'in_progress':
      return 'pending'
    default:
      return 'pending'
  }
}

export function DataTable({
  slug,
  docs,
  onSelect,
}: {
  slug: MockupCollectionSlug
  docs: Doc[]
  onSelect?: (id: string) => void
}) {
  const columns = COLLECTION_COLUMNS[slug]
  const showAvatars = slug === 'maintenance-teams' || slug === 'tickets'

  if (docs.length === 0) {
    return (
      <div className="rounded-xl border border-stroke-soft-200 px-6 py-12 text-center text-paragraph-md text-text-sub-600">
        No records yet.
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-xl ring-1 ring-stroke-soft-200">
      <Table.Root>
        <Table.Header>
          <tr>
            {showAvatars ? <Table.Head className="w-24" /> : null}
            {columns.map((col) => (
              <Table.Head key={col.key}>{col.label}</Table.Head>
            ))}
            <Table.Head className="w-10" />
          </tr>
        </Table.Header>
        <Table.Body>
          {docs.map((doc, rowIndex) => {
            const avatarNames = getAvatarNames(slug, doc)
            const primaryName =
              slug === 'employees'
                ? String(doc.fullName ?? '')
                : slug === 'users'
                  ? relLabel(doc.employee as Parameters<typeof relLabel>[0], String(doc.email ?? ''))
                  : String(doc.name ?? doc.title ?? '')

            return (
              <Table.Row
                key={doc.id}
                onClick={() => onSelect?.(doc.id)}
                className={cn(onSelect && 'cursor-pointer')}
              >
                {showAvatars ? (
                  <Table.Cell>
                    {avatarNames ? (
                      <AvatarGroupCompact.Root size="32" variant="stroke">
                        <AvatarGroupCompact.Stack>
                          {avatarNames.slice(0, 4).map((name, i) => (
                            <QatalogAvatar key={`${name}-${i}`} name={name} size="32" index={i} />
                          ))}
                        </AvatarGroupCompact.Stack>
                        {avatarNames.length > 4 ? (
                          <AvatarGroupCompact.Overflow>+{avatarNames.length - 4}</AvatarGroupCompact.Overflow>
                        ) : null}
                      </AvatarGroupCompact.Root>
                    ) : primaryName ? (
                      <QatalogAvatar name={primaryName} size="32" index={rowIndex} />
                    ) : null}
                  </Table.Cell>
                ) : null}
                {columns.map((col) => (
                  <Table.Cell
                    key={col.key}
                    className={cn(
                      col.key === 'name' ||
                        col.key === 'fullName' ||
                        col.key === 'title' ||
                        col.key === 'ticketNumber'
                        ? 'font-medium text-text-strong-950'
                        : 'text-text-sub-600',
                    )}
                  >
                    {col.key === 'status' && slug === 'tickets' ? (
                      <StatusBadge.Root variant="light" status={ticketStatus(String(doc.status ?? ''))}>
                        <StatusBadge.Dot />
                        {statusLabel(String(doc.status ?? ''))}
                      </StatusBadge.Root>
                    ) : (
                      col.render(doc)
                    )}
                  </Table.Cell>
                ))}
                <Table.Cell className="text-text-soft-400">
                  <RiArrowRightSLine className="size-5" />
                </Table.Cell>
                {rowIndex < docs.length - 1 ? <Table.RowDivider /> : null}
              </Table.Row>
            )
          })}
        </Table.Body>
      </Table.Root>
    </div>
  )
}
