import Link from 'next/link'
import { Shell } from '@/components/mockups/sana/Shell'
import { SearchHero } from '@/components/mockups/sana/SearchHero'
import { StatCard } from '@/components/mockups/sana/StatCard'
import { formatDateTime, relLabel, statusLabel } from '@/lib/mockups/helpers'
import { getDashboardStats, getRecentTickets } from '@/lib/mockups/queries'
import { detailHref } from '@/lib/mockups/links'
import type { Ticket } from '@/payload-types'
import * as Badge from '@/components/ui/badge'
import * as LinkButton from '@/components/ui/link-button'
import { cn } from '@/utils/cn'

const BASE = '/mockups/sana'

export default async function SanaDashboardPage() {
  const [stats, recentTickets] = await Promise.all([
    getDashboardStats(),
    getRecentTickets(6),
  ])

  const statCards = [
    { label: 'Companies', value: stats.counts.companies ?? 0, href: `${BASE}/companies` },
    { label: 'Locations', value: stats.counts.locations ?? 0, href: `${BASE}/locations` },
    {
      label: 'Assets',
      value: stats.counts.assets ?? 0,
      href: `${BASE}/assets`,
      accentClassName: 'text-feature-base',
    },
    {
      label: 'Open Tickets',
      value: stats.openTickets,
      href: `${BASE}/tickets`,
      accentClassName: 'text-warning-base',
    },
    { label: 'Pending Review', value: stats.pendingReview, accentClassName: 'text-error-base' },
    {
      label: 'Teams',
      value: stats.counts['maintenance-teams'] ?? 0,
      href: `${BASE}/maintenance-teams`,
    },
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

      <section className="mb-8">
        <h2 className="mb-4 text-label-sm font-semibold text-text-sub-600">Overview</h2>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(160px,1fr))] gap-4">
          {statCards.map((s) => (
            <StatCard key={s.label} {...s} />
          ))}
        </div>
      </section>

      <div className="grid gap-8 lg:grid-cols-[1fr_280px]">
        <section>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-label-md font-semibold text-text-strong-950">Recent tickets</h2>
            <LinkButton.Root variant="primary" size="medium" asChild>
              <Link href={`${BASE}/tickets`}>View all →</Link>
            </LinkButton.Root>
          </div>
          <div className="overflow-hidden rounded-2xl bg-bg-white-0 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200">
            {recentTickets.length === 0 ? (
              <p className="px-6 py-8 text-paragraph-sm text-text-soft-400">No tickets yet.</p>
            ) : (
              recentTickets.map((ticket, i) => {
                const t = ticket as Ticket
                const href = detailHref('sana', 'tickets', t as unknown as Record<string, unknown>)
                return (
                  <Link
                    key={t.id}
                    href={href}
                    className={cn(
                      'block px-5 py-4 transition hover:bg-bg-weak-50',
                      i < recentTickets.length - 1 && 'border-b border-stroke-soft-200',
                    )}
                  >
                    <div className="mb-1.5 flex flex-wrap items-center gap-2">
                      <span className="text-paragraph-xs font-semibold text-text-soft-400">
                        {t.ticketNumber}
                      </span>
                      <Badge.Root variant="lighter" color="orange" size="small">
                        {t.priority}
                      </Badge.Root>
                      <Badge.Root variant="lighter" color="purple" size="small">
                        {statusLabel(t.status)}
                      </Badge.Root>
                    </div>
                    <p className="text-label-sm font-medium text-text-strong-950">{t.title}</p>
                    <p className="mt-1 text-paragraph-sm text-text-soft-400">
                      {relLabel(t.location)} · {formatDateTime(t.reportedAt)}
                    </p>
                  </Link>
                )
              })
            )}
          </div>
        </section>

        <aside>
          <h2 className="mb-4 text-label-md font-semibold text-text-strong-950">Quick actions</h2>
          <div className="flex flex-col gap-2.5">
            {quickActions.map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className="block rounded-2xl bg-bg-white-0 px-4 py-4 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200 transition hover:-translate-y-0.5 hover:shadow-regular-sm"
              >
                <span className="block text-label-sm font-semibold text-text-strong-950">
                  {action.label}
                </span>
                <span className="mt-1 block text-paragraph-xs text-text-soft-400">{action.desc}</span>
              </Link>
            ))}
          </div>
        </aside>
      </div>
    </Shell>
  )
}
