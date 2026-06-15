import Link from 'next/link'
import { RiArrowRightSLine } from '@remixicon/react'
import { getDashboardStats, getRecentTickets } from '@/lib/mockups/queries'
import { MOCKUP_NAV } from '@/lib/mockups/navigation'
import { formatDateTime, relLabel, statusLabel } from '@/lib/mockups/helpers'
import { detailHref } from '@/lib/mockups/links'
import { getDocIdentifier } from '@/lib/mockups/identifiers'
import { QatalogPageHeader } from '@/components/mockups/qatalog/QatalogSectionTabs'
import { QatalogShell } from '@/components/mockups/qatalog/QatalogShell'
import * as Button from '@/components/ui/button'
import * as StatusBadge from '@/components/ui/status-badge'

const EMPTY_STATS = {
  counts: {} as Record<string, number>,
  openTickets: 0,
  pendingReview: 0,
}

const QUICK_LINKS = [
  { label: 'Companies', key: 'companies', href: '/mockups/qatalog/companies' },
  { label: 'Locations', key: 'locations', href: '/mockups/qatalog/locations' },
  { label: 'Assets', key: 'assets', href: '/mockups/qatalog/assets' },
  { label: 'Tickets', key: 'tickets', href: '/mockups/qatalog/tickets' },
  { label: 'Employees', key: 'employees', href: '/mockups/qatalog/employees' },
  { label: 'Teams', key: 'maintenance-teams', href: '/mockups/qatalog/maintenance-teams' },
]

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
    <QatalogShell>
      <QatalogPageHeader
        hideTabs
        title="Stanton"
        description="Asset registry and maintenance — Qatalog-style directory mockup connected to Payload demo data."
      />

      <div className="px-12 pb-12 pt-6">
        <div className="mb-10 flex flex-wrap gap-3">
          <Link href={`/mockups/qatalog/${firstSlug}`}>
            <Button.Root variant="primary" mode="filled" size="medium">
              Browse directory
            </Button.Root>
          </Link>
          <Link href="/mockups">
            <Button.Root variant="neutral" mode="stroke" size="medium">
              All variants
            </Button.Root>
          </Link>
        </div>

        <div className="mb-12 grid grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-4">
          {QUICK_LINKS.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className="rounded-xl border border-stroke-soft-200 p-5 transition duration-200 hover:border-stroke-strong-950 hover:shadow-regular-sm"
            >
              <div className="text-title-h4 tracking-tight text-text-strong-950">
                {stats.counts[item.key] ?? 0}
              </div>
              <div className="mt-1 text-paragraph-sm text-text-sub-600">{item.label}</div>
            </Link>
          ))}
        </div>

        <section>
          <h2 className="text-title-h5 tracking-tight text-text-strong-950">Recent tickets</h2>
          <p className="mt-2 text-paragraph-sm text-text-sub-600">
            {stats.openTickets} open · {stats.pendingReview} pending review
          </p>

          <div className="mt-5 overflow-hidden rounded-xl ring-1 ring-stroke-soft-200">
            {recentTickets.length === 0 ? (
              <p className="px-6 py-10 text-center text-paragraph-md text-text-sub-600">
                No tickets yet. Run{' '}
                <code className="rounded-md bg-bg-weak-50 px-1.5 py-0.5 text-paragraph-sm">
                  curl -X POST http://localhost:3000/api/seed-demo
                </code>
              </p>
            ) : (
              recentTickets.map((ticket) => (
                <Link
                  key={ticket.id}
                  href={detailHref(
                    'qatalog',
                    'tickets',
                    getDocIdentifier(ticket as unknown as Record<string, unknown>, 'tickets'),
                  )}
                  className="flex items-center justify-between gap-4 border-b border-stroke-soft-200 px-5 py-4 transition duration-200 last:border-b-0 hover:bg-bg-weak-50"
                >
                  <div>
                    <div className="text-label-sm font-medium text-text-strong-950">{ticket.title}</div>
                    <div className="mt-1 text-paragraph-sm text-text-sub-600">
                      {ticket.ticketNumber} · {relLabel(ticket.location)}
                    </div>
                  </div>
                  <div className="text-right">
                    <StatusBadge.Root variant="light" status="pending">
                      <StatusBadge.Dot />
                      {statusLabel(ticket.status)}
                    </StatusBadge.Root>
                    <div className="mt-2 text-paragraph-xs text-text-soft-400">
                      {formatDateTime(ticket.reportedAt)}
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </section>

        <nav className="mt-12">
          <h2 className="text-title-h5 tracking-tight text-text-strong-950">Directory sections</h2>
          <div className="mt-5 flex flex-col gap-6">
            {MOCKUP_NAV.map((group) => (
              <div key={group.label}>
                <div className="mb-3 text-subheading-xs uppercase tracking-[0.08em] text-text-soft-400">
                  {group.label}
                </div>
                <div className="flex flex-wrap gap-x-6 gap-y-2">
                  {group.items.map((item) => (
                    <Link
                      key={item.slug}
                      href={`/mockups/qatalog/${item.slug}`}
                      className="inline-flex items-center gap-1 text-label-lg text-text-strong-950 transition hover:text-primary-base"
                    >
                      {item.label}
                      <RiArrowRightSLine className="size-4 text-text-soft-400" />
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </nav>
      </div>
    </QatalogShell>
  )
}
