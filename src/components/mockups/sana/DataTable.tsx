import Link from 'next/link'
import type { MockupCollectionSlug } from '@/lib/mockups/navigation'
import { priorityColor, statusLabel } from '@/lib/mockups/helpers'
import { COLLECTION_COLUMNS, type ColumnDef } from './columns'
import styles from './sana.module.css'
import { pillStyle } from './tokens'

type DataTableProps = {
  slug: MockupCollectionSlug
  rows: Record<string, unknown>[]
  basePath?: string
}

function StatusPill({ value }: { value: string }) {
  const colors: Record<string, { fg: string; bg: string }> = {
    open: { fg: '#6b4ae8', bg: '#ede9fe' },
    in_progress: { fg: '#2563eb', bg: '#dbeafe' },
    completed: { fg: '#059669', bg: '#d1fae5' },
    cancelled: { fg: '#64748b', bg: '#f1f5f9' },
  }
  const c = colors[value] ?? { fg: '#6b6578', bg: '#f3f2f7' }
  return <span style={pillStyle(c.fg, c.bg)}>{statusLabel(value)}</span>
}

function PriorityPill({ value }: { value: string }) {
  const color = priorityColor(value)
  return <span style={pillStyle(color, `${color}18`)}>{value}</span>
}

function renderCell(col: ColumnDef, row: Record<string, unknown>) {
  if (col.render) return col.render(row)
  const val = row[col.key]
  if (col.key === 'status' && typeof val === 'string') return <StatusPill value={val} />
  if (col.key === 'priority' && typeof val === 'string') return <PriorityPill value={val} />
  return String(val ?? '—')
}

export function DataTable({ slug, rows, basePath = '/mockups/sana' }: DataTableProps) {
  const columns = COLLECTION_COLUMNS[slug]

  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key} style={col.width ? { width: col.width } : undefined}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} style={{ textAlign: 'center', color: 'var(--sana-text-subtle)', padding: 32 }}>
                No records found. Seed demo data to populate this view.
              </td>
            </tr>
          ) : (
            rows.map((row) => {
              const id = String(row.id)
              const href = `${basePath}/${slug}/${id}`
              return (
                <tr key={id} className={styles.tableRow}>
                  {columns.map((col, i) => (
                    <td key={col.key}>
                      {i === 0 ? (
                        <Link
                          href={href}
                          style={{
                            color: 'var(--sana-text)',
                            textDecoration: 'none',
                            fontWeight: 500,
                          }}
                        >
                          {renderCell(col, row)}
                        </Link>
                      ) : (
                        renderCell(col, row)
                      )}
                    </td>
                  ))}
                </tr>
              )
            })
          )}
        </tbody>
      </table>
    </div>
  )
}
