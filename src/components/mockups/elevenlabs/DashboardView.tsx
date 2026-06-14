import Link from 'next/link'
import { FeaturedBanner } from './FeaturedBanner'
import { ItemRow } from './ItemRow'
import { PageHeader } from './PageHeader'
import { StatsCards } from './StatsCards'
import styles from './DashboardView.module.css'

type DashboardViewProps = {
  stats: {
    counts: Record<string, number>
    openTickets: number
    pendingReview: number
  }
  recentAssets: Record<string, unknown>[]
  recentTickets: Record<string, unknown>[]
}

export function DashboardView({ stats, recentAssets, recentTickets }: DashboardViewProps) {
  const statCards = [
    { label: 'Assets', value: stats.counts.assets ?? 0, href: '/mockups/elevenlabs/assets' },
    { label: 'Open tickets', value: stats.openTickets, href: '/mockups/elevenlabs/tickets?tab=active', accent: '#f97316' },
    { label: 'Pending review', value: stats.pendingReview, accent: '#6366f1' },
    { label: 'Locations', value: stats.counts.locations ?? 0, href: '/mockups/elevenlabs/locations' },
    { label: 'Employees', value: stats.counts.employees ?? 0, href: '/mockups/elevenlabs/employees' },
    { label: 'Teams', value: stats.counts['maintenance-teams'] ?? 0, href: '/mockups/elevenlabs/maintenance-teams' },
  ]

  return (
    <div>
      <PageHeader
        title="Home"
        description="Overview of your asset registry and maintenance activity."
      />

      <FeaturedBanner
        title="Explore your asset library"
        description="Browse tracked equipment across sites, filter by category, and jump into maintenance tickets — styled like a voice library for quick scanning."
        ctaLabel="Browse assets"
        ctaHref="/mockups/elevenlabs/assets"
        tags={['Injection Machines', 'HVAC', 'Electrical', 'Conveyors']}
      />

      <StatsCards stats={statCards} />

      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <h2 className={styles.sectionTitle}>Recent assets</h2>
          <Link href="/mockups/elevenlabs/assets" className={styles.sectionLink}>
            View all
          </Link>
        </div>
        <div className={styles.list}>
          {recentAssets.length === 0 ? (
            <p className={styles.emptyHint}>No assets yet — seed demo data to populate.</p>
          ) : (
            recentAssets.map((doc) => (
              <ItemRow key={String(doc.id)} slug="assets" doc={doc} showActions={false} />
            ))
          )}
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <h2 className={styles.sectionTitle}>Recent tickets</h2>
          <Link href="/mockups/elevenlabs/tickets" className={styles.sectionLink}>
            View all
          </Link>
        </div>
        <div className={styles.list}>
          {recentTickets.length === 0 ? (
            <p className={styles.emptyHint}>No tickets yet — seed demo data to populate.</p>
          ) : (
            recentTickets.map((doc) => (
              <ItemRow key={String(doc.id)} slug="tickets" doc={doc} showActions={false} />
            ))
          )}
        </div>
      </section>
    </div>
  )
}
