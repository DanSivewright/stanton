import Link from 'next/link'
import {
  RiAlertFill,
  RiArrowRightLine,
  RiBuilding2Line,
  RiExchangeLine,
  RiGroupLine,
  RiMapPinLine,
  RiTicketLine,
  RiToolsLine,
} from '@remixicon/react'
import * as Alert from '@/components/ui/alert'
import * as Badge from '@/components/ui/badge'
import { MOCKUP_NAV } from '@/lib/mockups/navigation'
import { listHref, detailHref } from '@/lib/mockups/links'
import { getDocIdentifier, getDocTitle } from '@/lib/mockups/identifiers'
import { formatDateTime, relLabel, statusLabel } from '@/lib/mockups/helpers'
import { COLLECTION_CONFIG, NAV_ICONS } from '@/components/mockups/linear/collection-config'
import { CollectionList } from './CollectionList'
import { ActivityFeed } from './ActivityFeed'

type DashboardViewProps = {
  stats: {
    counts: Record<string, number>
    openTickets: number
    pendingReview: number
  }
  recentTickets: Record<string, unknown>[]
  recentMovements: Record<string, unknown>[]
}

const KPI_CARDS = [
  { slug: 'assets' as const, label: 'Assets', icon: RiToolsLine, href: listHref('atlas', 'assets') },
  { slug: 'openTickets' as const, label: 'Open tickets', icon: RiTicketLine, href: listHref('atlas', 'tickets'), accent: true },
  { slug: 'locations' as const, label: 'Locations', icon: RiMapPinLine, href: listHref('atlas', 'locations') },
  { slug: 'employees' as const, label: 'Employees', icon: RiGroupLine, href: listHref('atlas', 'employees') },
  { slug: 'companies' as const, label: 'Companies', icon: RiBuilding2Line, href: listHref('atlas', 'companies') },
  { slug: 'asset-movements' as const, label: 'Movements', icon: RiExchangeLine, href: listHref('atlas', 'asset-movements') },
]

export function DashboardView({ stats, recentTickets, recentMovements }: DashboardViewProps) {
  const ticketConfig = COLLECTION_CONFIG.tickets

  return (
    <div className="flex-1 overflow-y-auto px-6 py-6">
      <div className="mx-auto max-w-6xl space-y-8">
        <div>
          <h2 className="text-title-h4 text-text-strong-950">Operations overview</h2>
          <p className="mt-1 text-paragraph-sm text-text-soft-400">
            Asset visibility across Stanton group companies
          </p>
        </div>

        {(stats.openTickets > 0 || stats.pendingReview > 0) && (
          <Alert.Root variant="lighter" status="warning" size="small">
            <Alert.Icon as={RiAlertFill} />
            <div>
              <strong className="text-label-sm">{stats.openTickets} open tickets</strong>
              {stats.pendingReview > 0 ? (
                <span className="text-paragraph-sm text-text-sub-600">
                  {' '}
                  · {stats.pendingReview} pending review
                </span>
              ) : null}
            </div>
          </Alert.Root>
        )}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {KPI_CARDS.map(({ slug, label, icon: Icon, href, accent }) => {
            const value =
              slug === 'openTickets' ? stats.openTickets : (stats.counts[slug] ?? 0)
            return (
              <Link
                key={slug}
                href={href}
                className="group rounded-2xl border border-stroke-soft-200 bg-bg-white-0 p-5 shadow-regular-xs transition duration-200 hover:border-stable-light hover:shadow-regular-sm"
              >
                <div className="mb-4 flex items-center justify-between">
                  <span className="flex size-10 items-center justify-center rounded-xl bg-stable-lighter text-stable-dark">
                    <Icon className="size-5" />
                  </span>
                  <RiArrowRightLine className="size-4 text-text-soft-400 transition duration-200 group-hover:translate-x-0.5 group-hover:text-stable-base" />
                </div>
                <div
                  className={`text-title-h4 ${accent ? 'text-warning-base' : 'text-text-strong-950'}`}
                >
                  {value}
                </div>
                <div className="mt-1 text-label-sm text-text-soft-400">{label}</div>
              </Link>
            )
          })}
        </div>

        <div className="grid gap-6 lg:grid-cols-5">
          <section className="lg:col-span-3">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-label-md text-text-strong-950">Recent tickets</h3>
              <Link
                href={listHref('atlas', 'tickets')}
                className="flex items-center gap-1 text-label-sm text-stable-base hover:underline"
              >
                View all <RiArrowRightLine className="size-4" />
              </Link>
            </div>
            <div className="overflow-hidden rounded-2xl border border-stroke-soft-200 bg-bg-white-0 shadow-regular-xs">
              <CollectionList
                config={ticketConfig}
                docs={recentTickets}
                variant="atlas"
                compact
              />
            </div>
          </section>

          <section className="lg:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-label-md text-text-strong-950">Activity</h3>
              <Link
                href={listHref('atlas', 'asset-movements')}
                className="flex items-center gap-1 text-label-sm text-stable-base hover:underline"
              >
                Movements <RiArrowRightLine className="size-4" />
              </Link>
            </div>
            <ActivityFeed movements={recentMovements} tickets={recentTickets.slice(0, 4)} />
          </section>
        </div>

        <section>
          <h3 className="mb-4 text-label-md text-text-strong-950">All collections</h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {MOCKUP_NAV.flatMap((g) =>
              g.items.map((item) => (
                <Link
                  key={item.slug}
                  href={listHref('atlas', item.slug)}
                  className="flex items-center gap-3 rounded-xl border border-stroke-soft-200 bg-bg-white-0 px-4 py-3 transition duration-200 hover:border-stable-light hover:bg-stable-lighter/30"
                >
                  <span className="text-subheading-sm text-text-soft-400">{NAV_ICONS[item.slug]}</span>
                  <div className="min-w-0 flex-1">
                    <div className="text-label-sm text-text-strong-950">{item.label}</div>
                    <div className="truncate text-paragraph-xs text-text-soft-400">{item.description}</div>
                  </div>
                  <Badge.Root variant="lighter" color="gray" size="small">
                    {stats.counts[item.slug] ?? 0}
                  </Badge.Root>
                </Link>
              )),
            )}
          </div>
        </section>
      </div>
    </div>
  )
}

export function formatActivityMeta(doc: Record<string, unknown>, kind: 'ticket' | 'movement') {
  if (kind === 'ticket') {
    return {
      title: getDocTitle(doc, 'tickets'),
      meta: `${statusLabel(String(doc.status ?? ''))} · ${formatDateTime(doc.reportedAt as string)}`,
      href: detailHref('atlas', 'tickets', getDocIdentifier(doc, 'tickets')),
    }
  }
  return {
    title: relLabel(doc.asset as never, 'Asset'),
    meta: `${relLabel(doc.fromLocation as never, '?')} → ${relLabel(doc.toLocation as never, '?')}`,
    href: detailHref('atlas', 'asset-movements', getDocIdentifier(doc, 'asset-movements')),
  }
}
