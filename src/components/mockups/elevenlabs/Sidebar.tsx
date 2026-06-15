'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  RiHome5Line,
  RiStackLine,
} from '@remixicon/react'
import * as Avatar from '@/components/ui/avatar'
import * as Badge from '@/components/ui/badge'
import { cn } from '@/utils/cn'
import { MOCKUP_NAV } from '@/lib/mockups/navigation'

const BASE = '/mockups/elevenlabs'

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="flex w-60 shrink-0 flex-col border-r border-stroke-soft-200 bg-bg-weak-50">
      <div className="flex items-center gap-3 border-b border-stroke-soft-200 px-4 py-5">
        <Avatar.Root size="40" color="gray" className="bg-text-strong-950 text-static-white">
          S
        </Avatar.Root>
        <div className="min-w-0">
          <p className="truncate text-label-md text-text-strong-950">Stanton</p>
          <p className="truncate text-paragraph-xs text-text-sub-600">Asset Management</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <NavLink href={BASE} active={pathname === BASE} icon={<RiHome5Line className="size-4" />}>
          Home
        </NavLink>

        {MOCKUP_NAV.map((group) => (
          <div key={group.label} className="mt-6">
            <p className="mb-2 px-2 text-subheading-2xs uppercase tracking-wide text-text-soft-400">
              {group.label}
            </p>
            <div className="flex flex-col gap-0.5">
              {group.items.map((item) => {
                const href = `${BASE}/${item.slug}`
                const active = pathname === href || pathname.startsWith(`${href}/`)
                return (
                  <NavLink
                    key={item.slug}
                    href={href}
                    active={active}
                    icon={<RiStackLine className="size-4" />}
                    title={item.description}
                  >
                    {item.label}
                  </NavLink>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-stroke-soft-200 p-4">
        <div className="flex items-center gap-3 rounded-xl bg-bg-white-0 p-3 ring-1 ring-inset ring-stroke-soft-200">
          <Avatar.Root size="32" color="purple">
            DK
          </Avatar.Root>
          <div className="min-w-0 flex-1">
            <p className="truncate text-label-sm text-text-strong-950">Demo Admin</p>
            <p className="truncate text-paragraph-xs text-text-sub-600">admin@stanton-demo.local</p>
          </div>
          <Badge.Root size="small" variant="lighter" color="gray">
            Demo
          </Badge.Root>
        </div>
      </div>
    </aside>
  )
}

function NavLink({
  href,
  active,
  icon,
  children,
  title,
}: {
  href: string
  active: boolean
  icon: React.ReactNode
  children: React.ReactNode
  title?: string
}) {
  return (
    <Link
      href={href}
      title={title}
      className={cn(
        'flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-label-sm transition duration-200 ease-out',
        active
          ? 'bg-bg-white-0 text-text-strong-950 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200'
          : 'text-text-sub-600 hover:bg-bg-white-0 hover:text-text-strong-950',
      )}
    >
      <span className={cn(active ? 'text-text-strong-950' : 'text-text-soft-400')}>{icon}</span>
      {children}
    </Link>
  )
}
