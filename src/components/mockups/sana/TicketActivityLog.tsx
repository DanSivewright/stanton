import { formatDateTime, initials, relLabel } from '@/lib/mockups/helpers'
import type { MockupVariantSlug } from '@/lib/mockups/navigation'
import type { Ticket } from '@/payload-types'
import { TicketActivityComposer } from '@/components/mockups/shared/TicketActivityComposer'
import * as Avatar from '@/components/ui/avatar'
import * as Badge from '@/components/ui/badge'
import * as Divider from '@/components/ui/divider'

type ActivityEntry = NonNullable<Ticket['activity']>[number]

const KIND_LABELS: Record<string, string> = {
  comment: 'Comment',
  photo: 'Photo',
  completion: 'Work completed',
  review: 'Review',
}

const KIND_COLORS: Record<string, 'purple' | 'blue' | 'green' | 'orange'> = {
  comment: 'purple',
  photo: 'blue',
  completion: 'green',
  review: 'orange',
}

type TicketActivityLogProps = {
  activity: ActivityEntry[] | null | undefined
  variant?: MockupVariantSlug
  identifier?: string
  authorOptions?: { id: string; name: string }[]
}

export function TicketActivityLog({
  activity,
  variant = 'sana',
  identifier,
  authorOptions,
}: TicketActivityLogProps) {
  const entries = [...(activity ?? [])].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )

  if (entries.length === 0 && !identifier) {
    return (
      <div className="rounded-2xl bg-bg-white-0 px-6 py-8 text-paragraph-sm text-text-soft-400 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200">
        No activity yet on this ticket.
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-2xl bg-bg-white-0 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200">
      <div className="border-b border-stroke-soft-200 px-5 py-4">
        <h2 className="text-label-md font-semibold text-text-strong-950">Activity log</h2>
      </div>

      {entries.length === 0 ? (
        <p className="px-5 py-4 text-paragraph-sm text-text-soft-400">
          No activity yet — add the first comment below.
        </p>
      ) : (
        <div className="py-2">
          {entries.map((entry, i) => {
            const authorName = relLabel(entry.author as Parameters<typeof relLabel>[0])
            const kindColor = KIND_COLORS[entry.kind] ?? 'purple'
            return (
              <div key={entry.id ?? i}>
                <div className="flex gap-3.5 px-5 py-4">
                  <Avatar.Root size="32" color="purple">
                    {initials(authorName)}
                  </Avatar.Root>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-label-sm font-semibold text-text-strong-950">
                        {authorName}
                      </span>
                      <Badge.Root variant="lighter" color={kindColor} size="small">
                        {KIND_LABELS[entry.kind] ?? entry.kind}
                      </Badge.Root>
                      <span className="text-paragraph-xs text-text-soft-400">
                        {formatDateTime(entry.createdAt)}
                      </span>
                    </div>
                    {entry.body ? (
                      <p className="mt-2 whitespace-pre-wrap text-paragraph-sm leading-relaxed text-text-sub-600">
                        {entry.body}
                      </p>
                    ) : null}
                    {entry.photos && entry.photos.length > 0 ? (
                      <p className="mt-2 text-paragraph-xs text-text-soft-400">
                        {entry.photos.length} photo{entry.photos.length !== 1 ? 's' : ''} attached
                      </p>
                    ) : null}
                  </div>
                </div>
                {i < entries.length - 1 ? <Divider.Root className="mx-5" /> : null}
              </div>
            )
          })}
        </div>
      )}

      {identifier ? (
        <TicketActivityComposer
          variant={variant}
          identifier={identifier}
          authorId={authorOptions?.[0]?.id ?? ''}
          authorOptions={authorOptions}
          useAlignUI
        />
      ) : null}
    </div>
  )
}
