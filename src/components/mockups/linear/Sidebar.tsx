'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  RiArrowLeftLine,
  RiArrowDownSLine,
  RiDashboardLine,
  RiSearchLine,
} from '@remixicon/react'
import * as CompactButton from '@/components/ui/compact-button'
import * as Kbd from '@/components/ui/kbd'
import { MOCKUP_NAV } from '@/lib/mockups/navigation'
import type { MockupCollectionSlug } from '@/lib/mockups/navigation'
import { cn } from '@/utils/cn'
import { NAV_ICONS } from './collection-config'
import { useCommandPalette } from './LinearProvider'

export function Sidebar() {
  const pathname = usePathname()
  const { setOpen } = useCommandPalette()

  const activeSlug = pathname.match(/\/mockups\/linear\/([^/]+)/)?.[1] as
    | MockupCollectionSlug
    | undefined

  return (
    <aside className="flex w-[220px] shrink-0 flex-col bg-bg-strong-950">
      <div className="border-b border-stroke-soft-200 px-3 py-3">
        <button
          type="button"
          className="flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-left transition duration-200 hover:bg-bg-white-0/5"
          aria-label="Workspace switcher"
        >
          <span className="flex size-6 shrink-0 items-center justify-center rounded-md bg-primary-base text-label-xs text-static-white">
            S
          </span>
          <span className="min-w-0 flex-1 truncate text-label-sm text-text-white-0">Stanton</span>
          <RiArrowDownSLine className="size-4 shrink-0 text-text-soft-400" />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-3" aria-label="Main navigation">
        <div className="mb-4">
          <Link
            href="/mockups/linear"
            className={cn(
              'flex items-center gap-2 rounded-lg px-2 py-1.5 text-label-sm transition duration-200',
              pathname === '/mockups/linear'
                ? 'bg-bg-white-0/10 text-text-white-0'
                : 'text-text-sub-600 hover:bg-bg-white-0/5 hover:text-text-white-0',
            )}
          >
            <RiDashboardLine className="size-4 shrink-0" />
            Inbox
          </Link>
        </div>

        {MOCKUP_NAV.map((group) => (
          <div key={group.label} className="mb-4">
            <div className="mb-1 px-2 text-subheading-2xs uppercase tracking-wider text-text-soft-400">
              {group.label}
            </div>
            {group.items.map((item) => (
              <Link
                key={item.slug}
                href={`/mockups/linear/${item.slug}`}
                className={cn(
                  'flex items-center gap-2 rounded-lg px-2 py-1.5 text-label-sm transition duration-200',
                  activeSlug === item.slug
                    ? 'bg-bg-white-0/10 text-text-white-0'
                    : 'text-text-sub-600 hover:bg-bg-white-0/5 hover:text-text-white-0',
                )}
              >
                <span className="w-4 shrink-0 text-center text-subheading-xs text-text-soft-400">
                  {NAV_ICONS[item.slug]}
                </span>
                {item.label}
              </Link>
            ))}
          </div>
        ))}
      </nav>

      <div className="space-y-2 border-t border-stroke-soft-200 px-3 py-3">
        <Link
          href="/mockups"
          className="flex items-center gap-2 text-label-sm text-text-sub-600 transition duration-200 hover:text-text-white-0"
        >
          <RiArrowLeftLine className="size-4" />
          All mockups
        </Link>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex w-full items-center justify-between rounded-lg border border-stroke-soft-200 bg-bg-white-0/5 px-2.5 py-2 text-label-sm text-text-sub-600 transition duration-200 hover:bg-bg-white-0/10 hover:text-text-white-0"
        >
          <span className="flex items-center gap-2">
            <RiSearchLine className="size-4" />
            Quick search
          </span>
          <Kbd.Root>⌘K</Kbd.Root>
        </button>
      </div>
    </aside>
  )
}
