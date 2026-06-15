'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useTransition } from 'react'
import { RiSearchLine } from '@remixicon/react'
import * as Input from '@/components/ui/input'

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
    <Input.Root size="medium" className="rounded-xl">
      <Input.Wrapper>
        <Input.Icon as={RiSearchLine} />
        <Input.Input
          type="search"
          placeholder={placeholder}
          value={value}
          onChange={(e) => updateQuery(e.target.value)}
          aria-label="Search"
        />
      </Input.Wrapper>
    </Input.Root>
  )
}
