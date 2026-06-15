'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import {
  RiArrowDownSLine,
  RiArrowRightSLine,
  RiHome5Line,
  RiMenuLine,
  RiSparkling2Line,
} from '@remixicon/react'
import { MOCKUP_NAV } from '@/lib/mockups/navigation'
import * as Button from '@/components/ui/button'
import * as CompactButton from '@/components/ui/compact-button'
import { cn } from '@/utils/cn'

const BASE = '/mockups/sana'

export function Sidebar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({})

  const isHome = pathname === BASE
  const activeSlug = pathname.startsWith(`${BASE}/`) ? pathname.split('/')[3] : null

  function toggleGroup(label: string) {
    setCollapsed((prev) => ({ ...prev, [label]: !prev[label] }))
  }

  const navContent = (
    <>
      <div className="border-b border-stroke-soft-200 px-5 py-5">
        <p className="text-subheading-2xs uppercase tracking-wider text-text-soft-400">Stanton</p>
        <p className="mt-1 text-label-sm font-semibold text-text-strong-950">Asset Management</p>
      </div>

      <div className="px-3 py-3">
        <Button.Root
          variant="neutral"
          mode={isHome ? 'lighter' : 'ghost'}
          size="small"
          className={cn('w-full justify-start', isHome && 'bg-feature-lighter text-feature-base')}
          asChild
        >
          <Link href={BASE} onClick={() => setMobileOpen(false)}>
            <Button.Icon as={RiHome5Line} />
            Workspace
          </Link>
        </Button.Root>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 pb-4">
        {MOCKUP_NAV.map((group) => {
          const isCollapsed = collapsed[group.label]
          return (
            <div key={group.label} className="mb-2">
              <button
                type="button"
                onClick={() => toggleGroup(group.label)}
                className="flex w-full items-center justify-between rounded-lg px-2 py-2 text-left text-subheading-xs uppercase tracking-wide text-text-soft-400 transition hover:bg-bg-weak-50"
                aria-expanded={!isCollapsed}
              >
                {group.label}
                {isCollapsed ? (
                  <RiArrowRightSLine className="size-4" />
                ) : (
                  <RiArrowDownSLine className="size-4" />
                )}
              </button>
              {!isCollapsed ? (
                <div className="mt-1 flex flex-col gap-0.5">
                  {group.items.map((item) => {
                    const href = `${BASE}/${item.slug}`
                    const active = activeSlug === item.slug
                    return (
                      <Link
                        key={item.slug}
                        href={href}
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          'rounded-xl px-3 py-2.5 transition duration-200',
                          active
                            ? 'bg-feature-lighter text-feature-base ring-1 ring-inset ring-feature-light'
                            : 'text-text-sub-600 hover:bg-bg-weak-50 hover:text-text-strong-950',
                        )}
                      >
                        <span className="block text-label-sm font-medium">{item.label}</span>
                        <span className="mt-0.5 block text-paragraph-xs text-text-soft-400">
                          {item.description}
                        </span>
                      </Link>
                    )
                  })}
                </div>
              ) : null}
            </div>
          )
        })}
      </nav>

      <div className="border-t border-stroke-soft-200 p-4">
        <div className="flex items-center gap-2 rounded-xl bg-feature-lighter px-3 py-2.5">
          <RiSparkling2Line className="size-4 shrink-0 text-feature-base" />
          <span className="text-paragraph-xs text-feature-dark">Sana AI mockup variant</span>
        </div>
      </div>
    </>
  )

  return (
    <>
      <aside className="hidden w-[260px] shrink-0 flex-col border-r border-stroke-soft-200 bg-bg-white-0 lg:flex">
        {navContent}
      </aside>

      <div className="flex items-center gap-2 border-b border-stroke-soft-200 bg-bg-white-0 px-4 py-3 lg:hidden">
        <CompactButton.Root variant="ghost" size="medium" onClick={() => setMobileOpen(true)}>
          <CompactButton.Icon as={RiMenuLine} />
        </CompactButton.Root>
        <span className="text-label-sm font-semibold">Stanton</span>
      </div>

      {mobileOpen ? (
        <>
          <button
            type="button"
            aria-label="Close navigation"
            className="fixed inset-0 z-40 bg-overlay backdrop-blur-[6px] lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col border-r border-stroke-soft-200 bg-bg-white-0 shadow-regular-md lg:hidden">
            <div className="flex items-center justify-between border-b border-stroke-soft-200 px-4 py-3">
              <span className="text-label-sm font-semibold">Navigation</span>
              <CompactButton.Root variant="ghost" size="medium" onClick={() => setMobileOpen(false)}>
                <CompactButton.Icon as={RiArrowRightSLine} />
              </CompactButton.Root>
            </div>
            {navContent}
          </aside>
        </>
      ) : null}
    </>
  )
}
