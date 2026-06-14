'use client'

import Link from 'next/link'
import { useState } from 'react'
import type { MockupCollectionSlug } from '@/lib/mockups/navigation'
import { priorityColor, statusLabel } from '@/lib/mockups/helpers'
import { getDetailFields, getMetaFields } from './detail-config'
import { TicketActivityLog } from './TicketActivityLog'
import { MobileDrawer } from './MobileDrawer'
import { IconArrow } from './icons'
import styles from './sana.module.css'
import { cardStyle, pillStyle } from './tokens'
import type { Ticket } from '@/payload-types'

type DetailPanelProps = {
  slug: MockupCollectionSlug
  doc: Record<string, unknown>
  backHref: string
  title: string
}

export function DetailPanel({ slug, doc, backHref, title }: DetailPanelProps) {
  const fields = getDetailFields(slug, doc)
  const meta = getMetaFields(doc)
  const [drawerOpen, setDrawerOpen] = useState(false)

  const statusFields = ['status', 'priority', 'reviewStatus'] as const

  return (
    <>
      <div style={{ marginBottom: 24 }}>
        <Link
          href={backHref}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            fontSize: 13,
            color: 'var(--sana-text-muted)',
            textDecoration: 'none',
            marginBottom: 16,
          }}
        >
          <IconArrow size={14} />
          Back to list
        </Link>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
          <h1 style={{ margin: 0, fontSize: 28, fontWeight: 700, lineHeight: 1.2 }}>{title}</h1>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {slug === 'tickets' &&
              statusFields.map((key) => {
                const val = doc[key] as string | undefined
                if (!val) return null
                const color = key === 'priority' ? priorityColor(val) : 'var(--sana-accent)'
                const bg = key === 'priority' ? `${color}18` : 'var(--sana-accent-soft)'
                return (
                  <span key={key} style={pillStyle(color, bg)}>
                    {key === 'status' || key === 'reviewStatus' ? statusLabel(val) : val}
                  </span>
                )
              })}
          </div>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: slug === 'tickets' ? '1fr' : '1fr',
          gap: 24,
        }}
      >
        <div style={{ ...cardStyle, padding: 24 }}>
          <h2 style={{ margin: '0 0 20px', fontSize: 15, fontWeight: 600 }}>Details</h2>
          <dl
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
              gap: '20px 32px',
              margin: 0,
            }}
          >
            {[...fields, ...meta].map((field) => (
              <div
                key={field.label}
                style={field.wide ? { gridColumn: '1 / -1' } : undefined}
              >
                <dt
                  style={{
                    margin: 0,
                    fontSize: 11,
                    fontWeight: 600,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    color: 'var(--sana-text-subtle)',
                  }}
                >
                  {field.label}
                </dt>
                <dd
                  style={{
                    margin: '6px 0 0',
                    fontSize: 15,
                    color: 'var(--sana-text)',
                    lineHeight: 1.5,
                    whiteSpace: field.wide ? 'pre-wrap' : undefined,
                  }}
                >
                  {field.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {slug === 'tickets' && (
          <TicketActivityLog activity={(doc as unknown as Ticket).activity} />
        )}
      </div>

      <div className={styles.mobileFab}>
        <button
          type="button"
          onClick={() => setDrawerOpen(true)}
          style={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            padding: '12px 20px',
            borderRadius: 999,
            border: 'none',
            background: 'var(--sana-accent)',
            color: '#fff',
            font: 'inherit',
            fontSize: 14,
            fontWeight: 500,
            boxShadow: 'var(--sana-shadow-lg)',
            cursor: 'pointer',
            zIndex: 50,
          }}
        >
          Quick view
        </button>
      </div>

      <MobileDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} title={title}>
        <dl style={{ margin: 0, display: 'flex', flexDirection: 'column', gap: 16 }}>
          {fields.map((field) => (
            <div key={field.label}>
              <dt style={{ fontSize: 11, fontWeight: 600, textTransform: 'uppercase', color: 'var(--sana-text-subtle)' }}>
                {field.label}
              </dt>
              <dd style={{ margin: '4px 0 0', fontSize: 14 }}>{field.value}</dd>
            </div>
          ))}
        </dl>
      </MobileDrawer>
    </>
  )
}
