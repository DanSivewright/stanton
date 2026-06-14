import Link from 'next/link'
import { getDashboardStats, getRecentTickets } from '@/lib/mockups/queries'
import { MOCKUP_NAV } from '@/lib/mockups/navigation'
import { formatDateTime, relLabel, statusLabel } from '@/lib/mockups/helpers'
import { QatalogPageHeader } from '@/components/mockups/qatalog/QatalogSectionTabs'
import { QButton } from '@/components/mockups/qatalog/ui'
import { qatalog, qatalogStyles } from '@/components/mockups/qatalog/tokens'
const EMPTY_STATS = {
  counts: {} as Record<string, number>,
  openTickets: 0,
  pendingReview: 0,
}

export default async function QatalogHomePage() {
  let stats = EMPTY_STATS
  let recentTickets: Awaited<ReturnType<typeof getRecentTickets>> = []

  try {
    ;[stats, recentTickets] = await Promise.all([getDashboardStats(), getRecentTickets(6)])
  } catch {
    // DB may be unavailable before seed — show empty overview
  }

  const firstSlug = MOCKUP_NAV[0].items[0].slug

  return (
    <>
      <QatalogPageHeader
        hideTabs
        title="Stanton"
        description="Asset registry and maintenance — Qatalog-style directory mockup connected to Payload demo data."
      />

      <div style={qatalogStyles.content}>
        <div style={{ display: 'flex', gap: 12, marginBottom: 40 }}>
          <QButton href={`/mockups/qatalog/${firstSlug}`} variant="primary">
            Browse directory
          </QButton>
          <QButton href="/mockups" variant="ghost">
            All variants
          </QButton>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: 16,
            marginBottom: 48,
          }}
        >
          {[
            { label: 'Companies', key: 'companies', href: '/mockups/qatalog/companies' },
            { label: 'Locations', key: 'locations', href: '/mockups/qatalog/locations' },
            { label: 'Assets', key: 'assets', href: '/mockups/qatalog/assets' },
            { label: 'Tickets', key: 'tickets', href: '/mockups/qatalog/tickets' },
            { label: 'Employees', key: 'employees', href: '/mockups/qatalog/employees' },
            { label: 'Teams', key: 'maintenance-teams', href: '/mockups/qatalog/maintenance-teams' },
          ].map((item) => (
            <Link
              key={item.key}
              href={item.href}
              style={{
                padding: 20,
                border: `1px solid ${qatalog.border}`,
                borderRadius: 12,
                textDecoration: 'none',
                color: qatalog.text,
              }}
            >
              <div style={{ fontSize: 28, fontWeight: 400, letterSpacing: '-0.02em' }}>
                {stats.counts[item.key] ?? 0}
              </div>
              <div style={{ fontSize: 13, color: qatalog.textSecondary, marginTop: 4 }}>{item.label}</div>
            </Link>
          ))}
        </div>

        <section>
          <h2 style={{ fontSize: 24, fontWeight: 400, margin: '0 0 8px', letterSpacing: '-0.02em' }}>
            Recent tickets
          </h2>
          <p style={{ fontSize: 14, color: qatalog.textSecondary, margin: '0 0 20px' }}>
            {stats.openTickets} open · {stats.pendingReview} pending review
          </p>

          <div style={{ border: `1px solid ${qatalog.border}`, borderRadius: 12, overflow: 'hidden' }}>
            {recentTickets.length === 0 ? (
              <p style={{ padding: 32, textAlign: 'center', color: qatalog.textSecondary, margin: 0 }}>
                No tickets yet. Run{' '}
                <code style={{ fontSize: 13 }}>curl -X POST http://localhost:3000/api/seed-demo</code>
              </p>
            ) : (
              recentTickets.map((ticket, i) => (
                <Link
                  key={ticket.id}
                  href={`/mockups/qatalog/tickets?id=${ticket.id}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '16px 20px',
                    borderBottom: i < recentTickets.length - 1 ? `1px solid ${qatalog.border}` : undefined,
                    textDecoration: 'none',
                    color: qatalog.text,
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 500 }}>{ticket.title}</div>
                    <div style={{ fontSize: 13, color: qatalog.textSecondary, marginTop: 4 }}>
                      {ticket.ticketNumber} · {relLabel(ticket.location)}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', fontSize: 13, color: qatalog.textSecondary }}>
                    <div style={{ textTransform: 'capitalize' }}>{statusLabel(ticket.status)}</div>
                    <div style={{ marginTop: 4 }}>{formatDateTime(ticket.reportedAt)}</div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </section>

        <nav style={{ marginTop: 48 }}>
          <h2 style={{ fontSize: 24, fontWeight: 400, margin: '0 0 20px', letterSpacing: '-0.02em' }}>
            Directory sections
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {MOCKUP_NAV.map((group) => (
              <div key={group.label}>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 500,
                    color: qatalog.textMuted,
                    textTransform: 'uppercase',
                    letterSpacing: '0.08em',
                    marginBottom: 12,
                  }}
                >
                  {group.label}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 24px' }}>
                  {group.items.map((item) => (
                    <Link
                      key={item.slug}
                      href={`/mockups/qatalog/${item.slug}`}
                      style={{
                        fontSize: 20,
                        color: qatalog.text,
                        textDecoration: 'none',
                        letterSpacing: '-0.02em',
                      }}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </nav>
      </div>
    </>
  )
}
