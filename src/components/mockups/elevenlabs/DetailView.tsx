import type { MockupCollectionSlug } from '@/lib/mockups/navigation'
import { getNavItem } from '@/lib/mockups/navigation'
import { Avatar } from './Avatar'
import { Breadcrumb } from './Breadcrumb'
import { getDetailFields } from './collection-fields'
import { itemTitle } from './utils'
import styles from './DetailView.module.css'

const BASE = '/mockups/elevenlabs'

type DetailViewProps = {
  slug: MockupCollectionSlug
  doc: Record<string, unknown>
}

export function DetailView({ slug, doc }: DetailViewProps) {
  const nav = getNavItem(slug)
  const title = itemTitle(slug, doc)
  const fields = getDetailFields(slug, doc)

  return (
    <div className={styles.page}>
      <Breadcrumb
        items={[
          { label: nav?.item.label ?? slug, href: `${BASE}/${slug}` },
          { label: title },
        ]}
      />

      <header className={styles.header}>
        <Avatar name={title} seed={String(doc.id)} size="lg" />
        <div>
          <h1 className={styles.title}>{title}</h1>
          {nav?.item.description && (
            <p className={styles.description}>{nav.item.description}</p>
          )}
        </div>
      </header>

      <section className={styles.panel}>
        <h2 className={styles.panelTitle}>Details</h2>
        <dl className={styles.fields}>
          {fields.map((field) => (
            <div key={field.label} className={styles.field}>
              <dt className={styles.label}>{field.label}</dt>
              <dd className={styles.value}>{field.value}</dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  )
}
