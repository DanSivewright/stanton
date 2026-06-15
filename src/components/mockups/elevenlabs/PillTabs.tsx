'use client'

import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import * as TabMenuHorizontal from '@/components/ui/tab-menu-horizontal'
import { cn } from '@/utils/cn'
import type { LibraryTab } from './utils'

const TABS: { id: LibraryTab; label: string }[] = [
  { id: 'active', label: 'Active' },
  { id: 'all', label: 'All' },
  { id: 'archived', label: 'Archived' },
]

export function PillTabs() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const current = (searchParams.get('tab') as LibraryTab) || 'active'

  return (
    <div className="flex flex-wrap items-center gap-2">
      {TABS.map((tab) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set('tab', tab.id)
        const href = `${pathname}?${params.toString()}`
        const active = current === tab.id

        return (
          <Link
            key={tab.id}
            href={href}
            role="tab"
            aria-selected={active}
            className={cn(
              'inline-flex h-9 items-center rounded-full px-4 text-label-sm transition duration-200 ease-out',
              active
                ? 'bg-text-strong-950 text-static-white'
                : 'bg-bg-weak-50 text-text-sub-600 ring-1 ring-inset ring-stroke-soft-200 hover:text-text-strong-950',
            )}
          >
            {tab.label}
          </Link>
        )
      })}
    </div>
  )
}

export function SectionTabs({
  tabs,
  paramKey = 'tab',
}: {
  tabs: { id: string; label: string }[]
  paramKey?: string
}) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const current = searchParams.get(paramKey) ?? tabs[0]?.id

  return (
    <TabMenuHorizontal.Root value={current}>
      <TabMenuHorizontal.List wrapperClassName="rounded-none">
        {tabs.map((tab) => {
          const params = new URLSearchParams(searchParams.toString())
          params.set(paramKey, tab.id)
          const href = `${pathname}?${params.toString()}`

          return (
            <TabMenuHorizontal.Trigger key={tab.id} value={tab.id} asChild>
              <Link href={href}>{tab.label}</Link>
            </TabMenuHorizontal.Trigger>
          )
        })}
      </TabMenuHorizontal.List>
    </TabMenuHorizontal.Root>
  )
}
