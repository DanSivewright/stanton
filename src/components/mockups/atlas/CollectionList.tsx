import Link from 'next/link'
import * as Button from '@/components/ui/button'
import * as Table from '@/components/ui/table'
import type { MockupVariantSlug } from '@/lib/mockups/navigation'
import type { CollectionConfig } from '@/components/mockups/linear/collection-config'
import { getCellValue } from '@/components/mockups/linear/cell-values'
import { detailHref, newHref } from '@/lib/mockups/links'
import { getDocIdentifier } from '@/lib/mockups/identifiers'
import { PaginationHint } from '@/components/mockups/shared/PaginationHint'
import { cn } from '@/utils/cn'

type Doc = Record<string, unknown>

type CollectionListProps = {
  config: CollectionConfig
  docs: Doc[]
  activeId?: string
  variant?: MockupVariantSlug
  compact?: boolean
  totalDocs?: number
  limit?: number
}

export function CollectionList({
  config,
  docs,
  activeId,
  variant = 'atlas',
  compact,
  totalDocs,
  limit = 100,
}: CollectionListProps) {
  if (docs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
        <p className="text-label-sm text-text-sub-600">No records yet</p>
        <Button.Root variant="primary" mode="filled" size="xsmall" asChild>
          <Link href={newHref(variant, config.slug)}>Create the first record</Link>
        </Button.Root>
      </div>
    )
  }

  return (
    <>
      {!compact ? (
        <div className="flex justify-end px-4 py-2">
          <Button.Root variant="neutral" mode="ghost" size="xxsmall" asChild>
            <Link href={newHref(variant, config.slug)}>+ New</Link>
          </Button.Root>
        </div>
      ) : null}

      <Table.Root className={compact ? 'px-0' : 'px-2'}>
        {!compact ? (
          <Table.Header>
            <tr>
              {config.columns.map((col) => (
                <Table.Head
                  key={col.key}
                  className={cn(
                    'h-8 bg-bg-weak-50 py-1 text-subheading-2xs uppercase tracking-wider text-text-soft-400',
                    col.mono && 'font-mono',
                  )}
                >
                  {col.label}
                </Table.Head>
              ))}
            </tr>
          </Table.Header>
        ) : null}
        <Table.Body spacing={compact ? 0 : 4}>
          {docs.map((doc) => {
            const id = getDocIdentifier(doc, config.slug)
            const isActive = activeId === id
            return (
              <Table.Row key={String(doc.id)}>
                {config.columns.map((col) => (
                  <Table.Cell
                    key={col.key}
                    className={cn(
                      'h-10 px-3 py-0 text-paragraph-sm',
                      compact && 'first:rounded-l-lg last:rounded-r-lg',
                      isActive && 'bg-stable-lighter',
                      col.mono && 'font-mono text-label-xs',
                      col.secondary ? 'text-text-soft-400' : 'text-text-strong-950',
                    )}
                  >
                    <Link
                      href={detailHref(variant, config.slug, doc)}
                      className="flex h-full items-center"
                    >
                      {getCellValue(doc, col.key, config)}
                    </Link>
                  </Table.Cell>
                ))}
              </Table.Row>
            )
          })}
        </Table.Body>
      </Table.Root>

      {!compact && totalDocs != null ? (
        <PaginationHint totalDocs={totalDocs} limit={limit} style={{ padding: '12px 16px' }} />
      ) : null}
    </>
  )
}

export function SplitList(props: CollectionListProps) {
  return (
    <div className="border-r border-stroke-soft-200 bg-bg-white-0">
      <CollectionList {...props} compact />
    </div>
  )
}

export function SplitView({
  list,
  detail,
}: {
  list: React.ReactNode
  detail: React.ReactNode
}) {
  return (
    <div className="grid min-h-0 flex-1 grid-cols-[minmax(300px,38%)_1fr]">
      <div className="min-h-0 overflow-y-auto">{list}</div>
      <div className="min-h-0 overflow-y-auto bg-bg-white-0">{detail}</div>
    </div>
  )
}
