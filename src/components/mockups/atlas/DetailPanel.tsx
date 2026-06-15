import Link from 'next/link'
import type { CollectionConfig } from '@/components/mockups/linear/collection-config'
import { getDetailValue, getDocTitle } from '@/components/mockups/linear/cell-values'
import { PriorityIndicator, StatusPill } from '@/components/mockups/linear/Pills'
import { formatDateTime, initials, relLabel, statusLabel } from '@/lib/mockups/helpers'
import { detailHref } from '@/lib/mockups/links'
import { TicketActivityComposer } from '@/components/mockups/shared/TicketActivityComposer'
import * as Divider from '@/components/ui/divider'

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
    <article className="p-6">
      <header className="mb-6">
        {config.isIssueStyle && typeof doc.priority === 'string' && (
          <div className="mb-2 flex items-center gap-2">
            <PriorityIndicator priority={doc.priority} />
            <span className="text-label-xs text-text-soft-400">
              {statusLabel(doc.priority)} priority
            </span>
          </div>
        )}
        <h1 className="text-title-h5 text-text-strong-950">{title}</h1>
        {idValue != null ? (
          <p className="mt-1 font-mono text-label-sm text-text-soft-400">{String(idValue)}</p>
        ) : null}
        {config.isIssueStyle && (
          <div className="mt-3 flex flex-wrap gap-2">
            {typeof doc.status === 'string' ? <StatusPill status={doc.status} /> : null}
            {typeof doc.reviewStatus === 'string' ? (
              <StatusPill status={doc.reviewStatus} />
            ) : null}
          </div>
        )}
      </header>

      <dl className="grid gap-4 sm:grid-cols-2">
        {config.detailFields.map((field) => {
          const { display, linkId } = getDetailValue(doc, field.key, field.relation)
          return (
            <div key={field.key} className="rounded-xl border border-stroke-soft-200 bg-bg-weak-50 px-4 py-3">
              <dt className="text-subheading-2xs uppercase tracking-wider text-text-soft-400">
                {field.label}
              </dt>
              <dd
                className={`mt-1 text-label-sm text-text-strong-950 ${field.mono ? 'font-mono' : ''}`}
              >
                {linkId && field.relation ? (
                  <Link
                    href={detailHref('atlas', field.relation, linkId)}
                    className="text-stable-base underline underline-offset-2 hover:text-stable-dark"
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

      {config.descriptionField && Boolean(doc[config.descriptionField]) && (
        <div className="mt-6">
          <Divider.Root variant="line-text">Description</Divider.Root>
          <p className="mt-4 text-paragraph-sm text-text-sub-600">
            {String(doc[config.descriptionField])}
          </p>
        </div>
      )}

      {config.slug === 'maintenance-teams' && Array.isArray(doc.members) && (
        <div className="mt-6">
          <Divider.Root variant="line-text">Members</Divider.Root>
          <div className="mt-4 flex flex-wrap gap-2">
            {(doc.members as unknown[]).map((m, i) => (
              <span
                key={i}
                className="rounded-full bg-bg-weak-50 px-3 py-1 text-label-xs text-text-sub-600 ring-1 ring-inset ring-stroke-soft-200"
              >
                {relLabel(m as never)}
              </span>
            ))}
          </div>
        </div>
      )}

      {config.slug === 'tickets' && (
        <div className="mt-6">
          <Divider.Root variant="line-text">Activity</Divider.Root>
          <div className="mt-4 space-y-4">
            {Array.isArray(doc.activity) && doc.activity.length > 0 ? (
              (doc.activity as Record<string, unknown>[]).map((entry, i) => {
                const author = relLabel(entry.author as never, 'Unknown')
                return (
                  <div key={i} className="flex gap-3">
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-stable-lighter text-label-xs text-stable-dark">
                      {initials(author)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="text-label-xs text-text-soft-400">
                        {author} · {statusLabel(String(entry.kind ?? 'update'))} ·{' '}
                        {formatDateTime(entry.createdAt as string)}
                      </div>
                      {entry.body != null && entry.body !== '' && (
                        <div className="mt-1 text-paragraph-sm text-text-sub-600">
                          {String(entry.body)}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })
            ) : (
              <p className="text-paragraph-sm text-text-soft-400">No activity yet.</p>
            )}
            {identifier ? (
              <TicketActivityComposer
                variant="atlas"
                identifier={identifier}
                authorId={authorOptions?.[0]?.id ?? ''}
                authorOptions={authorOptions}
                styles={{ button: { background: '#0d9488' } }}
              />
            ) : null}
          </div>
        </div>
      )}

      {config.slug === 'locations' && doc.notes != null && doc.notes !== '' && (
        <div className="mt-6">
          <Divider.Root variant="line-text">Notes</Divider.Root>
          <p className="mt-4 text-paragraph-sm text-text-sub-600">{String(doc.notes)}</p>
        </div>
      )}
    </article>
  )
}
