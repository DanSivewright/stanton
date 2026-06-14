'use client'

import type { MockupCollectionSlug } from '@/lib/mockups/navigation'
import { qatalog } from './tokens'
import { COLLECTION_COLUMNS } from './collection-config'
import { Avatar, AvatarStack } from './ui'
import { IconChevronRight } from './icons'
import { relLabel } from '@/lib/mockups/helpers'

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
      <div style={{ padding: 48, textAlign: 'center', color: qatalog.textSecondary }}>
        No records yet. Seed demo data to populate this view.
      </div>
    )
  }

  return (
    <div style={{ border: `1px solid ${qatalog.border}`, borderRadius: 12, overflow: 'hidden' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
        <thead>
          <tr style={{ background: qatalog.bgMuted, borderBottom: `1px solid ${qatalog.border}` }}>
            {showAvatars ? (
              <th style={{ width: 100, padding: '12px 20px' }} />
            ) : null}
            {columns.map((col) => (
              <th
                key={col.key}
                style={{
                  textAlign: 'left',
                  padding: '12px 20px',
                  fontWeight: 500,
                  fontSize: 12,
                  color: qatalog.textMuted,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                }}
              >
                {col.label}
              </th>
            ))}
            <th style={{ width: 40, padding: '12px 20px' }} />
          </tr>
        </thead>
        <tbody>
          {docs.map((doc, rowIndex) => {
            const avatarNames = getAvatarNames(slug, doc)
            const primaryName =
              slug === 'employees'
                ? String(doc.fullName ?? '')
                : slug === 'users'
                  ? relLabel(doc.employee as Parameters<typeof relLabel>[0], String(doc.email ?? ''))
                  : String(doc.name ?? doc.title ?? '')

            return (
              <tr
                key={doc.id}
                onClick={() => onSelect?.(doc.id)}
                style={{
                  borderBottom: `1px solid ${qatalog.border}`,
                  cursor: onSelect ? 'pointer' : 'default',
                  transition: 'background 0.12s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = qatalog.bgHover
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent'
                }}
              >
                {showAvatars ? (
                  <td style={{ padding: '14px 20px' }}>
                    {avatarNames ? (
                      <AvatarStack names={avatarNames} size={28} />
                    ) : primaryName ? (
                      <Avatar name={primaryName} size={28} index={rowIndex} />
                    ) : null}
                  </td>
                ) : null}
                {columns.map((col) => (
                  <td
                    key={col.key}
                    style={{
                      padding: '14px 20px',
                      color: col.key === 'name' || col.key === 'fullName' || col.key === 'title' ? qatalog.text : qatalog.textSecondary,
                      fontWeight: col.key === 'name' || col.key === 'fullName' || col.key === 'title' ? 500 : 400,
                    }}
                  >
                    {col.render(doc)}
                  </td>
                ))}
                <td style={{ padding: '14px 20px', color: qatalog.textMuted }}>
                  <IconChevronRight size={16} />
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
