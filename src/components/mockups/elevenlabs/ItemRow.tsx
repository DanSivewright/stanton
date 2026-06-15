import Link from 'next/link'
import * as Avatar from '@/components/ui/avatar'
import * as Button from '@/components/ui/button'
import * as StatusBadge from '@/components/ui/status-badge'
import type { MockupCollectionSlug } from '@/lib/mockups/navigation'
import { detailHref, newHref } from '@/lib/mockups/links'
import { getDocIdentifier } from '@/lib/mockups/identifiers'
import { avatarColor, avatarInitials, itemMeta, itemSubtitle, itemTitle } from './utils'

type ItemRowProps = {
  slug: MockupCollectionSlug
  doc: Record<string, unknown>
  showActions?: boolean
}

export function ItemRow({ slug, doc, showActions = true }: ItemRowProps) {
  const id = getDocIdentifier(doc, slug)
  const title = itemTitle(slug, doc)
  const subtitle = itemSubtitle(slug, doc)
  const meta = itemMeta(slug, doc)
  const href = detailHref('elevenlabs', slug, doc)

  return (
    <article className="group flex items-center gap-4 border-b border-stroke-soft-200 py-4 last:border-b-0">
      <Link href={href} className="flex min-w-0 flex-1 items-center gap-4">
        <Avatar.Root size="40" color={avatarColor(id)}>
          {avatarInitials(title) || '?'}
        </Avatar.Root>
        <div className="min-w-0 flex-1">
          <p className="truncate text-label-md text-text-strong-950">{title}</p>
          <p className="truncate text-paragraph-sm text-text-sub-600">{subtitle}</p>
        </div>
        {meta ? (
          <StatusBadge.Root variant="stroke" status={statusForMeta(meta)}>
            <StatusBadge.Dot />
            {meta}
          </StatusBadge.Root>
        ) : null}
      </Link>
      {showActions ? (
        <div className="flex shrink-0 items-center gap-2 opacity-100 transition duration-200 lg:opacity-0 lg:group-hover:opacity-100">
          <Button.Root variant="neutral" mode="stroke" size="xsmall" asChild>
            <Link href={newHref('elevenlabs', slug)}>+ Add</Link>
          </Button.Root>
          <Button.Root variant="neutral" mode="filled" size="xsmall" asChild>
            <Link href={href}>View</Link>
          </Button.Root>
        </div>
      ) : null}
    </article>
  )
}

function statusForMeta(meta: string): 'completed' | 'pending' | 'failed' | 'disabled' {
  const lower = meta.toLowerCase()
  if (lower.includes('open') || lower.includes('progress') || lower.includes('review')) {
    return 'pending'
  }
  if (lower.includes('disposed') || lower.includes('cancel')) {
    return 'failed'
  }
  if (lower.includes('service') || lower.includes('active')) {
    return 'completed'
  }
  return 'disabled'
}
