import Link from 'next/link'
import { MOCKUP_NAV } from '@/lib/mockups/navigation'
import { NAV_ICONS } from './collection-config'
import { CollectionList } from './CollectionList'
import { COLLECTION_CONFIG } from './collection-config'
import { cn } from '@/utils/cn'

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
    <div className="px-6 py-6">
      <div className="mb-8">
        <h1 className="text-title-h4 text-text-white-0">Inbox</h1>
        <p className="mt-1 text-paragraph-sm text-text-soft-400">
          Maintenance overview across Stanton group companies
        </p>
      </div>

      <div className="mb-6 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-stroke-soft-200 bg-bg-white-0/5 p-4">
          <div className="text-title-h5 text-primary-base">{stats.openTickets}</div>
          <div className="mt-1 text-label-sm text-text-soft-400">Open tickets</div>
        </div>
        <div className="rounded-xl border border-stroke-soft-200 bg-bg-white-0/5 p-4">
          <div className="text-title-h5 text-warning-base">{stats.pendingReview}</div>
          <div className="mt-1 text-label-sm text-text-soft-400">Pending review</div>
        </div>
      </div>

      <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {[
          { slug: 'assets', label: 'Assets' },
          { slug: 'locations', label: 'Locations' },
          { slug: 'employees', label: 'Employees' },
          { slug: 'maintenance-teams', label: 'Teams' },
          { slug: 'companies', label: 'Companies' },
          { slug: 'asset-movements', label: 'Movements' },
        ].map(({ slug, label }) => (
          <Link
            key={slug}
            href={`/mockups/linear/${slug}`}
            className="rounded-xl border border-stroke-soft-200 bg-bg-white-0/5 p-3 transition duration-200 hover:border-stroke-sub-300 hover:bg-bg-white-0/10"
          >
            <div className="text-title-h5 text-text-white-0">{stats.counts[slug] ?? 0}</div>
            <div className="mt-0.5 text-label-xs text-text-soft-400">{label}</div>
          </Link>
        ))}
      </div>

      <section className="mb-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-label-sm font-medium text-text-white-0">Recent tickets</h2>
          <Link
            href="/mockups/linear/tickets"
            className="text-label-xs text-primary-base transition duration-200 hover:text-primary-darker"
          >
            View all →
          </Link>
        </div>
        <div className="overflow-hidden rounded-xl border border-stroke-soft-200">
          <CollectionList config={ticketConfig} docs={recentTickets} variant="linear" compact />
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-label-sm font-medium text-text-white-0">Collections</h2>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {MOCKUP_NAV.flatMap((g) =>
            g.items.map((item) => (
              <Link
                key={item.slug}
                href={`/mockups/linear/${item.slug}`}
                className={cn(
                  'flex items-center gap-2 rounded-lg border border-stroke-soft-200 bg-bg-white-0/5 px-3 py-2.5',
                  'text-label-sm text-text-sub-600 transition duration-200',
                  'hover:border-stroke-sub-300 hover:bg-bg-white-0/10 hover:text-text-white-0',
                )}
              >
                <span className="w-4 shrink-0 text-center text-subheading-xs text-text-soft-400">
                  {NAV_ICONS[item.slug]}
                </span>
                {item.label}
              </Link>
            )),
          )}
        </div>
      </section>
    </div>
  )
}
