import Link from 'next/link'
import type { MockupCollectionSlug } from '@/lib/mockups/navigation'
import { getNavItem } from '@/lib/mockups/navigation'
import { cellValue, getListColumns } from './collection-fields'
import { PageHeader, PrimaryButton } from './PageHeader'
import { SearchBar } from './SearchBar'
import { docId } from './utils'
import styles from './CollectionListView.module.css'

type CollectionListViewProps = {
  slug: MockupCollectionSlug
  docs: Record<string, unknown>[]
  query?: string
}

export function CollectionListView({ slug, docs, query }: CollectionListViewProps) {
  const nav = getNavItem(slug)
  const columns = getListColumns(slug)

  const filtered = query
    ? docs.filter((doc) => {
        const q = query.toLowerCase()
        return columns.some((col) => cellValue(slug, doc, col.key).toLowerCase().includes(q))
      })
    : docs

  return (
    <div>
      <PageHeader
        title={nav?.item.label ?? slug}
        description={nav?.item.description}
        action={<PrimaryButton>+ Add new</PrimaryButton>}
      >
        <SearchBar placeholder={`Search ${nav?.item.label?.toLowerCase() ?? 'items'}…`} />
      </PageHeader>

      {filtered.length === 0 ? (
        <EmptyState message="No items match your search." />
      ) : (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                {columns.map((col) => (
                  <th key={col.key}>{col.label}</th>
                ))}
                <th aria-label="Actions" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((doc) => (
                <tr key={docId(doc)}>
                  {columns.map((col) => (
                    <td key={col.key}>{cellValue(slug, doc, col.key)}</td>
                  ))}
                  <td className={styles.actionsCell}>
                    <Link href={`/mockups/elevenlabs/${slug}/${docId(doc)}`} className={styles.viewLink}>
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className={styles.empty}>
      <p>{message}</p>
    </div>
  )
}
