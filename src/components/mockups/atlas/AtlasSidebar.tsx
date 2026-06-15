'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  RiArrowLeftLine,
  RiCompass3Line,
  RiDashboardLine,
  RiSearchLine,
} from '@remixicon/react'
import * as Kbd from '@/components/ui/kbd'
import { MOCKUP_NAV } from '@/lib/mockups/navigation'
import type { MockupCollectionSlug } from '@/lib/mockups/navigation'
import { listHref } from '@/lib/mockups/links'
import { cn } from '@/utils/cn'
import { NAV_ICONS } from '@/components/mockups/linear/collection-config'
import { useAtlasCommandPalette } from './AtlasProvider'

export function AtlasSidebar() {
  const pathname = usePathname()
  const { setOpen } = useAtlasCommandPalette()

  const activeSlug = pathname.match(/\/mockups\/atlas\/([^/]+)/)?.[1] as
    | MockupCollectionSlug
    | undefined

  return (
    <aside className="flex w-[240px] shrink-0 flex-col border-r border-stroke-soft-200 bg-bg-white-0">
      <div className="border-b border-stroke-soft-200 px-4 py-4">
        <Link href="/mockups/atlas" className="flex items-center gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-stable-base text-static-white shadow-regular-xs">
            <RiCompass3Line className="size-5" />
          </span>
          <div className="min-w-0">
            <div className="truncate text-label-md text-text-strong-950">Atlas</div>
            <div className="truncate text-paragraph-xs text-text-soft-400">Stanton Ops</div>
          </div>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Main navigation">
        <div className="mb-5">
          <Link
            href="/mockups/atlas"
            className={cn(
              'flex items-center gap-2.5 rounded-xl px-3 py-2 text-label-sm transition duration-200',
              pathname === '/mockups/atlas'
                ? 'bg-stable-lighter text-stable-dark ring-1 ring-inset ring-stable-light'
                : 'text-text-sub-600 hover:bg-bg-weak-50 hover:text-text-strong-950',
            )}
          >
            <RiDashboardLine className="size-4 shrink-0" />
            Overview
          </Link>
        </div>

        {MOCKUP_NAV.map((group) => (
          <div key={group.label} className="mb-5">
            <div className="mb-1.5 px-3 text-subheading-2xs uppercase tracking-wider text-text-soft-400">
              {group.label}
            </div>
            {group.items.map((item) => (
              <Link
                key={item.slug}
                href={listHref('atlas', item.slug)}
                className={cn(
                  'flex items-center gap-2.5 rounded-xl px-3 py-2 text-label-sm transition duration-200',
                  activeSlug === item.slug
                    ? 'bg-stable-lighter text-stable-dark ring-1 ring-inset ring-stable-light'
                    : 'text-text-sub-600 hover:bg-bg-weak-50 hover:text-text-strong-950',
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

      <div className="space-y-2 border-t border-stroke-soft-200 px-3 py-4">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex w-full items-center justify-between rounded-xl border border-stroke-soft-200 bg-bg-weak-50 px-3 py-2.5 text-label-sm text-text-sub-600 transition duration-200 hover:bg-bg-white-0 hover:text-text-strong-950"
        >
          <span className="flex items-center gap-2">
            <RiSearchLine className="size-4" />
            Quick search
          </span>
          <Kbd.Root>⌘K</Kbd.Root>
        </button>
        <Link
          href="/mockups"
          className="flex items-center gap-2 px-3 py-2 text-label-sm text-text-soft-400 transition duration-200 hover:text-text-sub-600"
        >
          <RiArrowLeftLine className="size-4" />
          All mockups
        </Link>
      </div>
    </aside>
  )
}
