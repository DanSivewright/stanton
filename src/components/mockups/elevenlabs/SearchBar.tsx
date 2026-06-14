'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useTransition } from 'react'
import styles from './SearchBar.module.css'

type SearchBarProps = {
  placeholder?: string
}

export function SearchBar({ placeholder = 'Search…' }: SearchBarProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [, startTransition] = useTransition()
  const value = searchParams.get('q') ?? ''

  const updateQuery = useCallback(
    (next: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (next) {
        params.set('q', next)
      } else {
        params.delete('q')
      }
      startTransition(() => {
        router.replace(`${pathname}?${params.toString()}`, { scroll: false })
      })
    },
    [pathname, router, searchParams],
  )

  return (
    <div className={styles.wrap}>
      <SearchIcon />
      <input
        type="search"
        className={styles.input}
        placeholder={placeholder}
        defaultValue={value}
        onChange={(e) => updateQuery(e.target.value)}
        aria-label="Search"
      />
    </div>
  )
}

function SearchIcon() {
  return (
    <svg className={styles.icon} width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
      <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.25" />
      <path d="M10.5 10.5L14 14" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" />
    </svg>
  )
}
