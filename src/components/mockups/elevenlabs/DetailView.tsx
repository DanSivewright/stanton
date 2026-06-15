import type { MockupCollectionSlug } from '@/lib/mockups/navigation'
import { getNavItem } from '@/lib/mockups/navigation'
import { Breadcrumb } from './Breadcrumb'
import { getDetailFields } from './collection-fields'
import { avatarColor, avatarInitials, itemTitle } from './utils'
import { TicketActivityComposer } from '@/components/mockups/shared/TicketActivityComposer'
import { formatDateTime } from '@/lib/mockups/helpers'
import * as Avatar from '@/components/ui/avatar'
import * as Divider from '@/components/ui/divider'

type DetailViewProps = {
  slug: MockupCollectionSlug
  doc: Record<string, unknown>
  identifier?: string
  authorOptions?: { id: string; name: string }[]
  backHref?: string
}

export function DetailView({ slug, doc, identifier, authorOptions, backHref }: DetailViewProps) {
  const nav = getNavItem(slug)
  const title = itemTitle(slug, doc)
  const fields = getDetailFields(slug, doc)
  const listHref = backHref ?? `/mockups/elevenlabs/${slug}`

  return (
    <div>
      <Breadcrumb
        items={[
          { label: nav?.item.label ?? slug, href: listHref },
          { label: title },
        ]}
      />

      <header className="mt-6 flex items-start gap-4">
        <Avatar.Root size="56" color={avatarColor(String(doc.id))}>
          {avatarInitials(title) || '?'}
        </Avatar.Root>
        <div>
          <h1 className="text-title-h4 text-text-strong-950">{title}</h1>
          {nav?.item.description ? (
            <p className="mt-1 text-paragraph-sm text-text-sub-600">{nav.item.description}</p>
          ) : null}
          {doc.updatedAt ? (
            <p className="mt-2 text-paragraph-xs text-text-soft-400">
              Updated {formatDateTime(doc.updatedAt as string)}
            </p>
          ) : null}
        </div>
      </header>

      <Divider.Root className="my-8" />

      <section>
        <h2 className="mb-4 text-label-md text-text-strong-950">Details</h2>
        <dl className="grid gap-4 sm:grid-cols-2">
          {fields.map((field) => (
            <div
              key={field.label}
              className="rounded-xl bg-bg-weak-50 px-4 py-3 ring-1 ring-inset ring-stroke-soft-200"
            >
              <dt className="text-paragraph-xs text-text-soft-400">{field.label}</dt>
              <dd className="mt-1 text-paragraph-sm text-text-strong-950">{field.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      {slug === 'tickets' && identifier ? (
        <>
          <Divider.Root className="my-8" />
          <section>
            <h2 className="mb-4 text-label-md text-text-strong-950">Activity</h2>
            <TicketActivityComposer
              variant="elevenlabs"
              identifier={identifier}
              authorId={authorOptions?.[0]?.id ?? ''}
              authorOptions={authorOptions}
            />
          </section>
        </>
      ) : null}
    </div>
  )
}
