import Link from 'next/link'
import { RiPencilLine } from '@remixicon/react'
import * as Avatar from '@/components/ui/avatar'
import * as Button from '@/components/ui/button'
import * as Divider from '@/components/ui/divider'
import type { CollectionConfig } from './collection-config'
import { getDetailValue, getDocTitle } from './cell-values'
import { StatusPill, PriorityIndicator } from './Pills'
import { formatDateTime, initials, relLabel, statusLabel } from '@/lib/mockups/helpers'
import { detailHref } from '@/lib/mockups/links'
import { TicketActivityComposer } from '@/components/mockups/shared/TicketActivityComposer'

type Doc = Record<string, unknown>

type DetailPanelProps = {
  doc: Doc
  config: CollectionConfig
  identifier?: string
  authorOptions?: { id: string; name: string }[]
}

export function DetailPanel({ doc, config, identifier, authorOptions }: DetailPanelProps) {
  const title = getDocTitle(doc, config)
  const idValue = config.idField ? doc[config.idField] : null

  return (
    <article className="px-6 py-5">
      <header className="mb-6">
        {config.isIssueStyle && typeof doc.priority === 'string' ? (
          <div className="mb-2 flex items-center gap-2">
            <PriorityIndicator priority={doc.priority} />
            <span className="text-label-xs text-text-soft-400">
              {statusLabel(doc.priority)} priority
            </span>
          </div>
        ) : null}
        <h1 className="text-title-h5 text-text-white-0">{title}</h1>
        {idValue != null ? (
          <p className="mt-1 font-mono text-label-sm text-text-soft-400">{String(idValue)}</p>
        ) : null}
        {config.isIssueStyle ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {typeof doc.status === 'string' ? <StatusPill status={doc.status} /> : null}
            {typeof doc.reviewStatus === 'string' ? (
              <StatusPill status={doc.reviewStatus} />
            ) : null}
          </div>
        ) : null}
      </header>

      <Divider.Root className="mb-5" />

      <dl className="grid gap-3 sm:grid-cols-2">
        {config.detailFields.map((field) => {
          const { display, linkId } = getDetailValue(doc, field.key, field.relation)
          return (
            <div key={field.key} className="min-w-0">
              <dt className="text-subheading-2xs uppercase tracking-wider text-text-soft-400">
                {field.label}
              </dt>
              <dd
                className={
                  field.mono
                    ? 'mt-0.5 font-mono text-label-sm text-text-white-0'
                    : 'mt-0.5 text-paragraph-sm text-text-sub-600'
                }
              >
                {linkId && field.relation ? (
                  <Link
                    href={detailHref('linear', field.relation, linkId)}
                    className="text-primary-base transition duration-200 hover:text-primary-darker"
                  >
                    {display}
                  </Link>
                ) : (
                  display
                )}
              </dd>
            </div>
          )
        })}
      </dl>

      {config.descriptionField && Boolean(doc[config.descriptionField]) ? (
        <>
          <Divider.Root className="my-5" />
          <div>
            <div className="mb-2 text-subheading-2xs uppercase tracking-wider text-text-soft-400">
              Description
            </div>
            <div className="text-paragraph-sm leading-relaxed text-text-sub-600">
              {String(doc[config.descriptionField])}
            </div>
          </div>
        </>
      ) : null}

      {config.slug === 'maintenance-teams' && Array.isArray(doc.members) ? (
        <>
          <Divider.Root className="my-5" />
          <div>
            <div className="mb-3 text-subheading-2xs uppercase tracking-wider text-text-soft-400">
              Members
            </div>
            <div className="flex flex-wrap gap-2">
              {(doc.members as unknown[]).map((m, i) => (
                <span
                  key={i}
                  className="rounded-md bg-bg-white-0/10 px-2 py-1 text-label-xs text-text-sub-600"
                >
                  {relLabel(m as never)}
                </span>
              ))}
            </div>
          </div>
        </>
      ) : null}

      {config.slug === 'tickets' ? (
        <>
          <Divider.Root className="my-5" />
          <div>
            <div className="mb-3 text-subheading-2xs uppercase tracking-wider text-text-soft-400">
              Activity
            </div>
            {Array.isArray(doc.activity) && doc.activity.length > 0 ? (
              <div className="space-y-4">
                {(doc.activity as Record<string, unknown>[]).map((entry, i) => {
                  const author = relLabel(entry.author as never, 'Unknown')
                  return (
                    <div key={i} className="flex gap-3">
                      <Avatar.Root size="32" color="gray">
                        {initials(author)}
                      </Avatar.Root>
                      <div className="min-w-0 flex-1">
                        <div className="text-label-xs text-text-soft-400">
                          {author} · {statusLabel(String(entry.kind ?? 'update'))} ·{' '}
                          {formatDateTime(entry.createdAt as string)}
                        </div>
                        {entry.body != null && entry.body !== '' ? (
                          <div className="mt-1 text-paragraph-sm text-text-sub-600">
                            {String(entry.body)}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <p className="text-paragraph-sm text-text-soft-400">No activity yet.</p>
            )}
            {identifier ? (
              <TicketActivityComposer
                variant="linear"
                identifier={identifier}
                authorId={authorOptions?.[0]?.id ?? ''}
                authorOptions={authorOptions}
                styles={{
                  wrap: {
                    padding: '16px 0 0',
                    borderTop: '1px solid rgba(255,255,255,0.08)',
                    marginTop: 16,
                  },
                  input: {
                    padding: '8px 12px',
                    borderRadius: 8,
                    border: '1px solid rgba(255,255,255,0.12)',
                    fontSize: 13,
                    fontFamily: 'inherit',
                    background: 'rgba(255,255,255,0.05)',
                    color: '#ececec',
                  },
                  button: { background: '#5e6ad2' },
                }}
              />
            ) : null}
          </div>
        </>
      ) : null}

      {config.slug === 'locations' && doc.notes != null && doc.notes !== '' ? (
        <>
          <Divider.Root className="my-5" />
          <div>
            <div className="mb-2 text-subheading-2xs uppercase tracking-wider text-text-soft-400">
              Notes
            </div>
            <div className="text-paragraph-sm leading-relaxed text-text-sub-600">
              {String(doc.notes)}
            </div>
          </div>
        </>
      ) : null}
    </article>
  )
}

export function DetailToolbar({
  editHref,
  deleteButton,
}: {
  editHref: string
  deleteButton: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-end gap-2 border-b border-stroke-soft-200 px-4 py-2">
      <Button.Root variant="neutral" mode="ghost" size="xxsmall" asChild>
        <Link href={editHref}>
          <Button.Icon as={RiPencilLine} />
          Edit
        </Link>
      </Button.Root>
      {deleteButton}
    </div>
  )
}
