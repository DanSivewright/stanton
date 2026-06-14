import Link from 'next/link'
import type { CollectionConfig } from './collection-config'
import { getDetailValue, getDocTitle } from './cell-values'
import { StatusPill, PriorityIndicator } from './Pills'
import { formatDateTime, initials, relLabel, statusLabel } from '@/lib/mockups/helpers'
import styles from './DetailPanel.module.css'

type Doc = Record<string, unknown>

type DetailPanelProps = {
  doc: Doc
  config: CollectionConfig
}

export function DetailPanel({ doc, config }: DetailPanelProps) {
  const title = getDocTitle(doc, config)
  const idValue = config.idField ? doc[config.idField] : null

  return (
    <article className={styles.panel}>
      <header className={styles.header}>
        {config.isIssueStyle && typeof doc.priority === 'string' && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <PriorityIndicator priority={doc.priority} />
            <span style={{ fontSize: 12, color: 'var(--linear-text-secondary)' }}>
              {statusLabel(doc.priority)} priority
            </span>
          </div>
        )}
        <h1 className={styles.title}>{title}</h1>
        {idValue != null && (
          <p className={styles.subtitle}>{String(idValue)}</p>
        )}
        {config.isIssueStyle && (
          <div className={styles.metaRow}>
            {typeof doc.status === 'string' && <StatusPill status={doc.status} />}
            {typeof doc.reviewStatus === 'string' && (
              <StatusPill status={doc.reviewStatus} />
            )}
          </div>
        )}
      </header>

      <dl className={styles.properties}>
        {config.detailFields.map((field) => {
          const { display, linkId } = getDetailValue(doc, field.key, field.relation)
          return (
            <div key={field.key} className={styles.property}>
              <dt className={styles.propertyLabel}>{field.label}</dt>
              <dd
                className={
                  field.mono ? styles.propertyValueMono : styles.propertyValue
                }
              >
                {linkId && field.relation ? (
                  <Link
                    href={`/mockups/linear/${field.relation}/${linkId}`}
                    className={styles.propertyLink}
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
        <div className={styles.description}>
          <div className={styles.descriptionLabel}>Description</div>
          <div className={styles.descriptionBody}>
            {String(doc[config.descriptionField])}
          </div>
        </div>
      )}

      {config.slug === 'maintenance-teams' && Array.isArray(doc.members) && (
        <div className={styles.activity}>
          <div className={styles.activityTitle}>Members</div>
          <div className={styles.membersList}>
            {(doc.members as unknown[]).map((m, i) => (
              <span key={i} className={styles.memberChip}>
                {relLabel(m as never)}
              </span>
            ))}
          </div>
        </div>
      )}

      {config.slug === 'tickets' && Array.isArray(doc.activity) && doc.activity.length > 0 && (
        <div className={styles.activity}>
          <div className={styles.activityTitle}>Activity</div>
          {(doc.activity as Record<string, unknown>[]).map((entry, i) => {
            const author = relLabel(entry.author as never, 'Unknown')
            return (
              <div key={i} className={styles.activityItem}>
                <span className={styles.activityAvatar}>{initials(author)}</span>
                <div className={styles.activityContent}>
                  <div className={styles.activityMeta}>
                    {author} · {statusLabel(String(entry.kind ?? 'update'))} ·{' '}
                    {formatDateTime(entry.createdAt as string)}
                  </div>
                  {entry.body != null && entry.body !== '' && (
                    <div className={styles.activityBody}>{String(entry.body)}</div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {config.slug === 'locations' && doc.notes != null && doc.notes !== '' && (
        <div className={styles.description}>
          <div className={styles.descriptionLabel}>Notes</div>
          <div className={styles.descriptionBody}>{String(doc.notes)}</div>
        </div>
      )}
    </article>
  )
}
