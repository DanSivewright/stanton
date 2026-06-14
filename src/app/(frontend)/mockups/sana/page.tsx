import Link from 'next/link'
import { Shell } from '@/components/mockups/sana/Shell'
import { SearchHero } from '@/components/mockups/sana/SearchHero'
import { StatCard } from '@/components/mockups/sana/StatCard'
import { formatDateTime, priorityColor, relLabel, statusLabel } from '@/lib/mockups/helpers'
import { getDashboardStats, getRecentTickets } from '@/lib/mockups/queries'
import { cardStyle, pillStyle } from '@/components/mockups/sana/tokens'
import styles from '@/components/mockups/sana/sana.module.css'
import type { Ticket } from '@/payload-types'

const BASE = '/mockups/sana'

export default async function SanaDashboardPage() {
  const [stats, recentTickets] = await Promise.all([
    getDashboardStats(),
    getRecentTickets(6),
  ])

  const statCards = [
    { label: 'Companies', value: stats.counts.companies ?? 0, href: `${BASE}/companies` },
    { label: 'Locations', value: stats.counts.locations ?? 0, href: `${BASE}/locations` },
    { label: 'Assets', value: stats.counts.assets ?? 0, href: `${BASE}/assets`, accent: '#6b4ae8' },
    { label: 'Open Tickets', value: stats.openTickets, href: `${BASE}/tickets`, accent: '#d97706' },
    { label: 'Pending Review', value: stats.pendingReview, accent: '#dc2626' },
    { label: 'Teams', value: stats.counts['maintenance-teams'] ?? 0, href: `${BASE}/maintenance-teams` },
  ]

  const quickActions = [
    { label: 'Browse assets', href: `${BASE}/assets`, desc: 'Equipment registry' },
    { label: 'View tickets', href: `${BASE}/tickets`, desc: 'Maintenance requests' },
    { label: 'Location tree', href: `${BASE}/locations`, desc: 'Site hierarchy' },
    { label: 'Movement log', href: `${BASE}/asset-movements`, desc: 'Placement audit' },
  ]

  return (
    <Shell title="Workspace" subtitle="Stanton Asset Management overview">
      <SearchHero />

      <section style={{ marginBottom: 32 }}>
        <h2 style={{ margin: '0 0 16px', fontSize: 14, fontWeight: 600, color: 'var(--sana-text-muted)' }}>
          Overview
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16 }}>
          {statCards.map((s) => (
            <StatCard key={s.label} {...s} />
          ))}
        </div>
      </section>

      <div className={styles.dashboardGrid}>
        <section>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600 }}>Recent tickets</h2>
            <Link href={`${BASE}/tickets`} style={{ fontSize: 13, color: 'var(--sana-accent)', textDecoration: 'none' }}>
              View all →
            </Link>
          </div>
          <div style={{ ...cardStyle, overflow: 'hidden' }}>
            {recentTickets.length === 0 ? (
              <p style={{ padding: 24, margin: 0, color: 'var(--sana-text-subtle)', fontSize: 14 }}>
                No tickets yet. Run{' '}
                <code style={{ background: 'var(--sana-bg-soft)', padding: '2px 6px', borderRadius: 4 }}>
                  POST /api/seed-demo
                </code>{' '}
                to populate demo data.
              </p>
            ) : (
              recentTickets.map((ticket, i) => {
                const t = ticket as Ticket
                const href = `${BASE}/tickets/${t.id}`
                return (
                  <Link
                    key={t.id}
                    href={href}
                    style={{
                      display: 'block',
                      padding: '16px 20px',
                      textDecoration: 'none',
                      color: 'inherit',
                      borderBottom: i < recentTickets.length - 1 ? '1px solid var(--sana-border)' : undefined,
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                      <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--sana-text-subtle)' }}>
                        {t.ticketNumber}
                      </span>
                      <span style={pillStyle(priorityColor(t.priority), `${priorityColor(t.priority)}18`)}>
                        {t.priority}
                      </span>
                      <span style={pillStyle('var(--sana-accent)', 'var(--sana-accent-soft)')}>
                        {statusLabel(t.status)}
                      </span>
                    </div>
                    <p style={{ margin: 0, fontWeight: 500, fontSize: 15 }}>{t.title}</p>
                    <p style={{ margin: '4px 0 0', fontSize: 13, color: 'var(--sana-text-subtle)' }}>
                      {relLabel(t.location)} · {formatDateTime(t.reportedAt)}
                    </p>
                  </Link>
                )
              })
            )}
          </div>
        </section>

        <aside>
          <h2 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 600 }}>Quick actions</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {quickActions.map((action) => (
              <Link
                key={action.href}
                href={action.href}
                style={{
                  ...cardStyle,
                  padding: '16px 18px',
                  textDecoration: 'none',
                  color: 'inherit',
                }}
              >
                <span style={{ fontWeight: 600, fontSize: 14, display: 'block' }}>{action.label}</span>
                <span style={{ fontSize: 12, color: 'var(--sana-text-subtle)', marginTop: 4, display: 'block' }}>
                  {action.desc}
                </span>
              </Link>
            ))}
          </div>
        </aside>
      </div>
    </Shell>
  )
}
