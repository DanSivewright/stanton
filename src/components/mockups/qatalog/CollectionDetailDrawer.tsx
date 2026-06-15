'use client'

import Link from 'next/link'
import type { MockupCollectionSlug } from '@/lib/mockups/navigation'
import {
  getDetailSubtitle,
  getDetailTitle,
  renderDetailFields,
  type Doc,
} from './collection-config'
import { editHref } from '@/lib/mockups/links'
import { getDocIdentifier } from '@/lib/mockups/identifiers'
import { TicketActivityComposer } from '@/components/mockups/shared/TicketActivityComposer'
import * as Button from '@/components/ui/button'
import * as Drawer from '@/components/ui/drawer'
import * as Divider from '@/components/ui/divider'

function DetailField({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <dt className="mb-1.5 text-subheading-xs uppercase tracking-wider text-text-soft-400">
        {label}
      </dt>
      <dd className="text-paragraph-md text-text-strong-950">{value ?? '—'}</dd>
    </div>
  )
}

export function CollectionDetailDrawer({
  slug,
  doc,
  open,
  onClose,
  inline,
  identifier,
  authorOptions,
}: {
  slug: MockupCollectionSlug
  doc: Doc | null
  open?: boolean
  onClose?: () => void
  inline?: boolean
  identifier?: string
  authorOptions?: { id: string; name: string }[]
}) {
  if (!doc) return null

  const fields = renderDetailFields(slug, doc)
  const docIdentifier = identifier ?? getDocIdentifier(doc, slug)

  const content = (
    <dl className="grid gap-5">
      {fields.map((field) => (
        <DetailField key={field.label} label={field.label} value={field.value} />
      ))}
      {slug === 'tickets' && docIdentifier ? (
        <div className="pt-2">
          <TicketActivityComposer
            variant="qatalog"
            identifier={docIdentifier}
            authorId={authorOptions?.[0]?.id ?? ''}
            authorOptions={authorOptions}
          />
        </div>
      ) : null}
    </dl>
  )

  const footer = !inline ? (
    <Drawer.Footer className="border-t border-stroke-soft-200">
      <Link href={editHref('qatalog', slug, docIdentifier)}>
        <Button.Root variant="primary" mode="filled" size="medium">
          Edit record
        </Button.Root>
      </Link>
      <Button.Root variant="neutral" mode="stroke" size="medium" onClick={onClose}>
        Close
      </Button.Root>
    </Drawer.Footer>
  ) : null

  if (inline) {
    return (
      <div>
        <h1 className="text-title-h4 tracking-tight text-text-strong-950">
          {getDetailTitle(slug, doc)}
        </h1>
        {getDetailSubtitle(slug, doc) ? (
          <p className="mt-2 text-paragraph-md text-text-sub-600">{getDetailSubtitle(slug, doc)}</p>
        ) : null}
        <Divider.Root className="my-6" />
        {content}
      </div>
    )
  }

  return (
    <Drawer.Root open={open ?? false} onOpenChange={(next) => !next && onClose?.()}>
      <Drawer.Content className="max-w-md">
        <Drawer.Header className="flex-col items-start gap-1 border-b border-stroke-soft-200">
          <Drawer.Title>{getDetailTitle(slug, doc)}</Drawer.Title>
          {getDetailSubtitle(slug, doc) ? (
            <p className="text-paragraph-sm text-text-sub-600">{getDetailSubtitle(slug, doc)}</p>
          ) : null}
        </Drawer.Header>
        <Drawer.Body className="p-5">{content}</Drawer.Body>
        {footer}
      </Drawer.Content>
    </Drawer.Root>
  )
}
