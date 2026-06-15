import Link from 'next/link'
import { FeaturedBanner } from './FeaturedBanner'
import { ItemRow } from './ItemRow'
import { PageHeader } from './PageHeader'
import { StatsCards } from './StatsCards'
import * as LinkButton from '@/components/ui/link-button'

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
    {
      label: 'Open tickets',
      value: stats.openTickets,
      href: '/mockups/elevenlabs/tickets?tab=active',
      accent: 'var(--color-warning-base)',
    },
    { label: 'Pending review', value: stats.pendingReview, accent: 'var(--color-purple-500)' },
    { label: 'Locations', value: stats.counts.locations ?? 0, href: '/mockups/elevenlabs/locations' },
    { label: 'Employees', value: stats.counts.employees ?? 0, href: '/mockups/elevenlabs/employees' },
    {
      label: 'Teams',
      value: stats.counts['maintenance-teams'] ?? 0,
      href: '/mockups/elevenlabs/maintenance-teams',
    },
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

      <section className="mb-10">
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="text-label-md text-text-strong-950">Recent assets</h2>
          <LinkButton.Root variant="primary" size="medium" asChild>
            <Link href="/mockups/elevenlabs/assets">View all</Link>
          </LinkButton.Root>
        </div>
        <div className="rounded-xl ring-1 ring-inset ring-stroke-soft-200">
          <div className="divide-y divide-stroke-soft-200 px-4">
            {recentAssets.length === 0 ? (
              <p className="py-8 text-center text-paragraph-sm text-text-sub-600">
                No assets yet — seed demo data to populate.
              </p>
            ) : (
              recentAssets.map((doc) => (
                <ItemRow key={String(doc.id)} slug="assets" doc={doc} showActions={false} />
              ))
            )}
          </div>
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 className="text-label-md text-text-strong-950">Recent tickets</h2>
          <LinkButton.Root variant="primary" size="medium" asChild>
            <Link href="/mockups/elevenlabs/tickets">View all</Link>
          </LinkButton.Root>
        </div>
        <div className="rounded-xl ring-1 ring-inset ring-stroke-soft-200">
          <div className="divide-y divide-stroke-soft-200 px-4">
            {recentTickets.length === 0 ? (
              <p className="py-8 text-center text-paragraph-sm text-text-sub-600">
                No tickets yet — seed demo data to populate.
              </p>
            ) : (
              recentTickets.map((doc) => (
                <ItemRow key={String(doc.id)} slug="tickets" doc={doc} showActions={false} />
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
