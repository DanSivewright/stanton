'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  RiArrowLeftLine,
  RiBox3Line,
  RiBuilding2Line,
  RiHome5Line,
  RiStackLine,
  RiTeamLine,
  RiToolsLine,
} from '@remixicon/react'
import { MOCKUP_NAV } from '@/lib/mockups/navigation'
import * as CompactButton from '@/components/ui/compact-button'
import * as Tooltip from '@/components/ui/tooltip'
import { cn } from '@/utils/cn'

const GROUP_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Organization: RiBuilding2Line,
  Catalog: RiStackLine,
  People: RiTeamLine,
  Assets: RiBox3Line,
  Maintenance: RiToolsLine,
}

function SidebarLink({
  href,
  label,
  active,
  icon: Icon,
}: {
  href: string
  label: string
  active?: boolean
  icon: React.ComponentType<{ className?: string }>
}) {
  return (
    <Tooltip.Root>
      <Tooltip.Trigger asChild>
        <Link href={href} aria-label={label} aria-current={active ? 'page' : undefined}>
          <CompactButton.Root
            variant={active ? 'stroke' : 'ghost'}
            size="large"
            fullRadius
            className={cn('size-10', active && 'bg-bg-weak-50 text-text-strong-950')}
          >
            <CompactButton.Icon as={Icon} />
          </CompactButton.Root>
        </Link>
      </Tooltip.Trigger>
      <Tooltip.Content side="right">{label}</Tooltip.Content>
    </Tooltip.Root>
  )
}

export function QatalogSidebar() {
  const pathname = usePathname()
  const isHome = pathname === '/mockups/qatalog'

  return (
    <nav
      aria-label="Main"
      className="flex w-16 shrink-0 flex-col items-center gap-1 border-r border-stroke-soft-200 bg-bg-white-0 py-4"
    >
      <SidebarLink href="/mockups/qatalog" label="Overview" active={isHome} icon={RiHome5Line} />

      <div className="my-2 h-px w-6 bg-stroke-soft-200" />

      {MOCKUP_NAV.map((group) => {
        const Icon = GROUP_ICONS[group.label] ?? RiStackLine
        const activeItem = group.items.find((item) => pathname.includes(`/mockups/qatalog/${item.slug}`))
        const hrefSlug = activeItem?.slug ?? group.items[0].slug

        return (
          <SidebarLink
            key={group.label}
            href={`/mockups/qatalog/${hrefSlug}`}
            label={group.label}
            active={Boolean(activeItem)}
            icon={Icon}
          />
        )
      })}

      <div className="flex-1" />

      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <Link href="/mockups" aria-label="All mockup variants">
            <CompactButton.Root variant="ghost" size="large" fullRadius className="size-10">
              <CompactButton.Icon as={RiArrowLeftLine} />
            </CompactButton.Root>
          </Link>
        </Tooltip.Trigger>
        <Tooltip.Content side="right">All variants</Tooltip.Content>
      </Tooltip.Root>
    </nav>
  )
}
