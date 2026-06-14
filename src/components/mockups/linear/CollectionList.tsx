import Link from 'next/link'
import type { CollectionConfig } from './collection-config'
import { getCellValue, getDocId } from './cell-values'
import styles from './ListView.module.css'

type Doc = Record<string, unknown>

type CollectionListProps = {
  config: CollectionConfig
  docs: Doc[]
  activeId?: string
  basePath: string
  compact?: boolean
}

export function CollectionList({ config, docs, activeId, basePath, compact }: CollectionListProps) {
  const gridTemplate = config.columns.map((c) => c.width).join(' ')

  if (docs.length === 0) {
    return (
      <div className={styles.empty}>
        <p className={styles.emptyTitle}>No records yet</p>
        <p>Seed demo data with POST /api/seed-demo</p>
      </div>
    )
  }

  return (
    <>
      {!compact && (
        <div className={styles.listHeader} style={{ gridTemplateColumns: gridTemplate }}>
          {config.columns.map((col) => (
            <span key={col.key}>{col.label}</span>
          ))}
        </div>
      )}
      <div className={styles.listBody}>
        {docs.map((doc) => {
          const id = getDocId(doc)
          const isActive = activeId === id
          return (
            <Link
              key={id}
              href={`${basePath}/${id}`}
              className={`${styles.row} ${isActive ? styles.rowActive : ''}`}
              style={{ gridTemplateColumns: gridTemplate }}
            >
              {config.columns.map((col) => (
                <span
                  key={col.key}
                  className={
                    col.mono
                      ? styles.cellMono
                      : col.secondary
                        ? `${styles.cell} ${styles.cellSecondary}`
                        : styles.cell
                  }
                >
                  {getCellValue(doc, col.key, config)}
                </span>
              ))}
            </Link>
          )
        })}
      </div>
    </>
  )
}

type SplitListProps = CollectionListProps

export function SplitList(props: SplitListProps) {
  return (
    <div className={styles.splitList}>
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
    <div className={styles.splitView}>
      {list}
      <div className={styles.splitDetail}>{detail}</div>
    </div>
  )
}
