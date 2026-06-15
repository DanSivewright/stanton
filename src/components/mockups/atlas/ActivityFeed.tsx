import Link from 'next/link'
import { RiExchangeLine, RiTicketLine } from '@remixicon/react'
import { formatActivityMeta } from './DashboardView'
import { cn } from '@/utils/cn'

type ActivityFeedProps = {
  movements: Record<string, unknown>[]
  tickets: Record<string, unknown>[]
}

type FeedItem = {
  id: string
  kind: 'ticket' | 'movement'
  title: string
  meta: string
  href: string
  icon: typeof RiTicketLine
}

export function ActivityFeed({ movements, tickets }: ActivityFeedProps) {
  const items: FeedItem[] = [
    ...tickets.map((doc) => {
      const { title, meta, href } = formatActivityMeta(doc, 'ticket')
      return {
        id: `ticket-${doc.id}`,
        kind: 'ticket' as const,
        title,
        meta,
        href,
        icon: RiTicketLine,
      }
    }),
    ...movements.map((doc) => {
      const { title, meta, href } = formatActivityMeta(doc, 'movement')
      return {
        id: `movement-${doc.id}`,
        kind: 'movement' as const,
        title,
        meta,
        href,
        icon: RiExchangeLine,
      }
    }),
  ].slice(0, 8)

  if (items.length === 0) {
    return (
      <div className="rounded-2xl border border-stroke-soft-200 bg-bg-white-0 px-4 py-8 text-center text-paragraph-sm text-text-soft-400 shadow-regular-xs">
        No recent activity
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-stroke-soft-200 bg-bg-white-0 shadow-regular-xs">
      <ul className="divide-y divide-stroke-soft-200">
        {items.map((item, i) => {
          const Icon = item.icon
          return (
            <li key={item.id}>
              <Link
                href={item.href}
                className="flex gap-3 px-4 py-3 transition duration-200 hover:bg-bg-weak-50"
              >
                <span
                  className={cn(
                    'relative mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg',
                    item.kind === 'ticket'
                      ? 'bg-warning-lighter text-warning-base'
                      : 'bg-stable-lighter text-stable-base',
                  )}
                >
                  <Icon className="size-4" />
                  {i < items.length - 1 ? (
                    <span
                      className="absolute left-1/2 top-full h-3 w-px -translate-x-1/2 bg-stroke-soft-200"
                      aria-hidden
                    />
                  ) : null}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-label-sm text-text-strong-950">{item.title}</div>
                  <div className="mt-0.5 truncate text-paragraph-xs text-text-soft-400">{item.meta}</div>
                </div>
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
