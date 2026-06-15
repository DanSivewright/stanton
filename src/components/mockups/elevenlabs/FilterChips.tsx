'use client'

import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import * as Tag from '@/components/ui/tag'
import { cn } from '@/utils/cn'

type Chip = {
  id: string
  label: string
}

type FilterChipsProps = {
  chips: Chip[]
  paramKey?: string
}

export function FilterChips({ chips, paramKey = 'chip' }: FilterChipsProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const active = searchParams.get(paramKey)

  if (chips.length === 0) return null

  return (
    <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filters">
      <FilterChip
        label="All"
        href={buildHref(pathname, searchParams, paramKey, null)}
        active={!active}
      />
      {chips.map((chip) => (
        <FilterChip
          key={chip.id}
          label={chip.label}
          href={buildHref(pathname, searchParams, paramKey, chip.id)}
          active={active === chip.id}
        />
      ))}
    </div>
  )
}

function FilterChip({ label, href, active }: { label: string; href: string; active: boolean }) {
  return (
    <Tag.Root
      variant={active ? 'gray' : 'stroke'}
      asChild
      className={cn(
        active && 'bg-text-strong-950 text-static-white ring-transparent hover:bg-text-strong-950',
      )}
    >
      <Link href={href}>{label}</Link>
    </Tag.Root>
  )
}

function buildHref(
  pathname: string,
  searchParams: URLSearchParams,
  paramKey: string,
  value: string | null,
): string {
  const params = new URLSearchParams(searchParams.toString())
  if (value) {
    params.set(paramKey, value)
  } else {
    params.delete(paramKey)
  }
  return params.toString() ? `${pathname}?${params.toString()}` : pathname
}
