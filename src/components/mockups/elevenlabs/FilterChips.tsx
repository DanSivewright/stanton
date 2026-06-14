'use client'

import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import styles from './FilterChips.module.css'

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
    <div className={styles.row} role="group" aria-label="Filters">
      <AllChip pathname={pathname} searchParams={searchParams} paramKey={paramKey} active={!active} />
      {chips.map((chip) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set(paramKey, chip.id)
        const href = `${pathname}?${params.toString()}`
        return (
          <Link
            key={chip.id}
            href={href}
            className={`${styles.chip} ${active === chip.id ? styles.active : ''}`}
          >
            {chip.label}
          </Link>
        )
      })}
    </div>
  )
}

function AllChip({
  pathname,
  searchParams,
  paramKey,
  active,
}: {
  pathname: string
  searchParams: URLSearchParams
  paramKey: string
  active: boolean
}) {
  const params = new URLSearchParams(searchParams.toString())
  params.delete(paramKey)
  const href = params.toString() ? `${pathname}?${params.toString()}` : pathname

  return (
    <Link href={href} className={`${styles.chip} ${active ? styles.active : ''}`}>
      All
    </Link>
  )
}
