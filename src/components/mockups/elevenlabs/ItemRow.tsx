import Link from 'next/link'
import type { MockupCollectionSlug } from '@/lib/mockups/navigation'
import { Avatar } from './Avatar'
import { docId, itemMeta, itemSubtitle, itemTitle } from './utils'
import styles from './ItemRow.module.css'

type ItemRowProps = {
  slug: MockupCollectionSlug
  doc: Record<string, unknown>
  basePath?: string
  showActions?: boolean
}

export function ItemRow({ slug, doc, basePath = '/mockups/elevenlabs', showActions = true }: ItemRowProps) {
  const id = docId(doc)
  const title = itemTitle(slug, doc)
  const subtitle = itemSubtitle(slug, doc)
  const meta = itemMeta(slug, doc)
  const href = `${basePath}/${slug}/${id}`

  return (
    <article className={styles.row}>
      <Link href={href} className={styles.main}>
        <Avatar name={title} seed={id} size="md" />
        <div className={styles.text}>
          <span className={styles.title}>{title}</span>
          <span className={styles.subtitle}>{subtitle}</span>
        </div>
        {meta && <span className={styles.badge}>{meta}</span>}
      </Link>
      {showActions && (
        <div className={styles.actions}>
          <button type="button" className={styles.addBtn} aria-label={`Add related to ${title}`}>
            + Add
          </button>
          <Link href={href} className={styles.viewBtn}>
            View
          </Link>
        </div>
      )}
    </article>
  )
}
