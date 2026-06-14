import Link from 'next/link'
import { MOCKUP_NAV } from '@/lib/mockups/navigation'
import { NAV_ICONS } from './collection-config'
import { CollectionList } from './CollectionList'
import { COLLECTION_CONFIG } from './collection-config'
import styles from './Dashboard.module.css'

type DashboardProps = {
  stats: {
    counts: Record<string, number>
    openTickets: number
    pendingReview: number
  }
  recentTickets: Record<string, unknown>[]
}

export function DashboardView({ stats, recentTickets }: DashboardProps) {
  const ticketConfig = COLLECTION_CONFIG.tickets

  return (
    <div className={styles.dashboard}>
      <div className={styles.hero}>
        <h1 className={styles.heroTitle}>Inbox</h1>
        <p className={styles.heroSubtitle}>
          Maintenance overview across Stanton group companies
        </p>
      </div>

      <div className={styles.alertRow}>
        <div className={styles.alert}>
          <div className={styles.alertValue}>{stats.openTickets}</div>
          <div className={styles.alertLabel}>Open tickets</div>
        </div>
        <div className={styles.alert}>
          <div className={styles.alertValue}>{stats.pendingReview}</div>
          <div className={styles.alertLabel}>Pending review</div>
        </div>
      </div>

      <div className={styles.statsGrid}>
        {[
          { slug: 'assets', label: 'Assets' },
          { slug: 'locations', label: 'Locations' },
          { slug: 'employees', label: 'Employees' },
          { slug: 'maintenance-teams', label: 'Teams' },
          { slug: 'companies', label: 'Companies' },
          { slug: 'asset-movements', label: 'Movements' },
        ].map(({ slug, label }) => (
          <Link key={slug} href={`/mockups/linear/${slug}`} className={styles.statCard}>
            <div className={`${styles.statValue} ${slug === 'tickets' ? styles.statAccent : ''}`}>
              {stats.counts[slug] ?? 0}
            </div>
            <div className={styles.statLabel}>{label}</div>
          </Link>
        ))}
      </div>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Recent tickets</h2>
          <Link href="/mockups/linear/tickets" className={styles.sectionLink}>
            View all →
          </Link>
        </div>
        <CollectionList
          config={ticketConfig}
          docs={recentTickets}
          basePath="/mockups/linear/tickets"
        />
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Collections</h2>
        </div>
        <div className={styles.quickLinks}>
          {MOCKUP_NAV.flatMap((g) =>
            g.items.map((item) => (
              <Link
                key={item.slug}
                href={`/mockups/linear/${item.slug}`}
                className={styles.quickLink}
              >
                <span className={styles.quickLinkIcon}>{NAV_ICONS[item.slug]}</span>
                {item.label}
              </Link>
            )),
          )}
        </div>
      </section>
    </div>
  )
}
