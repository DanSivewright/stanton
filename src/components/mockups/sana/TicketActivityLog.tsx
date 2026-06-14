import { formatDateTime, initials, relLabel } from '@/lib/mockups/helpers'
import type { Ticket } from '@/payload-types'
import { cardStyle } from './tokens'

type ActivityEntry = NonNullable<Ticket['activity']>[number]

const KIND_LABELS: Record<string, string> = {
  comment: 'Comment',
  photo: 'Photo',
  completion: 'Work completed',
  review: 'Review',
}

const KIND_COLORS: Record<string, string> = {
  comment: '#7c5cfc',
  photo: '#2563eb',
  completion: '#059669',
  review: '#d97706',
}

type TicketActivityLogProps = {
  activity: ActivityEntry[] | null | undefined
}

export function TicketActivityLog({ activity }: TicketActivityLogProps) {
  const entries = [...(activity ?? [])].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )

  if (entries.length === 0) {
    return (
      <div style={{ ...cardStyle, padding: 24, color: 'var(--sana-text-subtle)', fontSize: 14 }}>
        No activity yet on this ticket.
      </div>
    )
  }

  return (
    <div style={{ ...cardStyle, padding: 0, overflow: 'hidden' }}>
      <div
        style={{
          padding: '16px 20px',
          borderBottom: '1px solid var(--sana-border)',
          fontWeight: 600,
          fontSize: 15,
        }}
      >
        Activity log
      </div>
      <div style={{ padding: '8px 0' }}>
        {entries.map((entry, i) => {
          const authorName = relLabel(entry.author as Parameters<typeof relLabel>[0])
          const kindColor = KIND_COLORS[entry.kind] ?? '#6b6578'
          return (
            <div
              key={entry.id ?? i}
              style={{
                display: 'flex',
                gap: 14,
                padding: '16px 20px',
                borderBottom: i < entries.length - 1 ? '1px solid var(--sana-border)' : undefined,
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 999,
                  background: 'var(--sana-accent-soft)',
                  color: 'var(--sana-accent)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 13,
                  fontWeight: 600,
                  flexShrink: 0,
                }}
              >
                {initials(authorName)}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <span style={{ fontWeight: 600, fontSize: 14 }}>{authorName}</span>
                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 500,
                      padding: '2px 8px',
                      borderRadius: 999,
                      background: `${kindColor}18`,
                      color: kindColor,
                    }}
                  >
                    {KIND_LABELS[entry.kind] ?? entry.kind}
                  </span>
                  <span style={{ fontSize: 12, color: 'var(--sana-text-subtle)' }}>
                    {formatDateTime(entry.createdAt)}
                  </span>
                </div>
                {entry.body && (
                  <p
                    style={{
                      margin: '8px 0 0',
                      fontSize: 14,
                      lineHeight: 1.55,
                      color: 'var(--sana-text-muted)',
                      whiteSpace: 'pre-wrap',
                    }}
                  >
                    {entry.body}
                  </p>
                )}
                {entry.photos && entry.photos.length > 0 && (
                  <p style={{ margin: '8px 0 0', fontSize: 12, color: 'var(--sana-text-subtle)' }}>
                    {entry.photos.length} photo{entry.photos.length !== 1 ? 's' : ''} attached
                  </p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
