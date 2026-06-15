import Link from 'next/link'
import type { MockupCollectionSlug, MockupVariantSlug } from '@/lib/mockups/navigation'
import { statusLabel } from '@/lib/mockups/helpers'
import { detailHref, newHref } from '@/lib/mockups/links'
import { getDocIdentifier } from '@/lib/mockups/identifiers'
import { COLLECTION_COLUMNS, type ColumnDef } from './columns'
import { PaginationHint } from '@/components/mockups/shared/PaginationHint'
import * as Badge from '@/components/ui/badge'
import * as Button from '@/components/ui/button'
import * as Table from '@/components/ui/table'

type DataTableProps = {
  slug: MockupCollectionSlug
  rows: Record<string, unknown>[]
  variant?: MockupVariantSlug
  totalDocs?: number
  limit?: number
}

const STATUS_BADGE_COLOR: Record<string, 'purple' | 'blue' | 'green' | 'gray'> = {
  open: 'purple',
  in_progress: 'blue',
  completed: 'green',
  cancelled: 'gray',
}

function StatusPill({ value }: { value: string }) {
  const color = STATUS_BADGE_COLOR[value] ?? 'gray'
  return (
    <Badge.Root variant="lighter" color={color} size="medium">
      {statusLabel(value)}
    </Badge.Root>
  )
}

function PriorityPill({ value }: { value: string }) {
  const colorMap: Record<string, 'red' | 'orange' | 'yellow' | 'gray'> = {
    critical: 'red',
    high: 'orange',
    medium: 'yellow',
    low: 'gray',
  }
  return (
    <Badge.Root variant="lighter" color={colorMap[value] ?? 'gray'} size="medium">
      {value}
    </Badge.Root>
  )
}

function renderCell(col: ColumnDef, row: Record<string, unknown>) {
  if (col.render) return col.render(row)
  const val = row[col.key]
  if (col.key === 'status' && typeof val === 'string') return <StatusPill value={val} />
  if (col.key === 'priority' && typeof val === 'string') return <PriorityPill value={val} />
  return String(val ?? '—')
}

export function DataTable({ slug, rows, variant = 'sana', totalDocs, limit = 100 }: DataTableProps) {
  const columns = COLLECTION_COLUMNS[slug]

  return (
    <>
      <div className="mb-4 flex justify-end">
        <Button.Root variant="primary" mode="filled" size="small" asChild>
          <Link href={newHref(variant, slug)}>+ New</Link>
        </Button.Root>
      </div>

      <div className="overflow-hidden rounded-2xl bg-bg-white-0 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200">
        <Table.Root>
          <Table.Header>
            <tr>
              {columns.map((col) => (
                <Table.Head key={col.key} style={col.width ? { width: col.width } : undefined}>
                  {col.label}
                </Table.Head>
              ))}
            </tr>
          </Table.Header>
          <Table.Body>
            {rows.length === 0 ? (
              <Table.Row>
                <Table.Cell colSpan={columns.length} className="py-12 text-center text-text-soft-400">
                  No records yet.
                </Table.Cell>
              </Table.Row>
            ) : (
              rows.map((row) => {
                const href = detailHref(variant, slug, getDocIdentifier(row, slug))
                return (
                  <Table.Row key={String(row.id)}>
                    {columns.map((col, i) => (
                      <Table.Cell key={col.key}>
                        {i === 0 ? (
                          <Link
                            href={href}
                            className="font-medium text-text-strong-950 transition hover:text-feature-base"
                          >
                            {renderCell(col, row)}
                          </Link>
                        ) : (
                          renderCell(col, row)
                        )}
                      </Table.Cell>
                    ))}
                  </Table.Row>
                )
              })
            )}
          </Table.Body>
        </Table.Root>
      </div>

      {totalDocs != null ? <PaginationHint totalDocs={totalDocs} limit={limit} /> : null}
    </>
  )
}
