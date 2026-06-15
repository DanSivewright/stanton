'use client'

import Link from 'next/link'
import { useState, useTransition } from 'react'
import { RiArrowRightLine, RiSearchLine, RiSparkling2Line } from '@remixicon/react'
import { searchMockupRecords } from '@/lib/mockups/actions'
import { detailHref } from '@/lib/mockups/links'
import { getDocTitle } from '@/lib/mockups/identifiers'
import type { SearchHit } from '@/lib/mockups/queries'
import * as Button from '@/components/ui/button'
import * as Input from '@/components/ui/input'
import { cn } from '@/utils/cn'

type SearchHeroProps = {
  placeholder?: string
  suggestions?: string[]
}

export function SearchHero({
  placeholder = 'Search assets, tickets, employees…',
  suggestions = ['Open tickets', 'Building assets', 'Maintenance teams'],
}: SearchHeroProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchHit[]>([])
  const [isPending, startTransition] = useTransition()

  function runSearch(value: string) {
    setQuery(value)
    if (!value.trim()) {
      setResults([])
      return
    }
    startTransition(async () => {
      const hits = await searchMockupRecords(value)
      setResults(hits)
    })
  }

  return (
    <section className="mb-8 rounded-3xl bg-bg-white-0 p-6 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200 lg:p-8">
      <div className="mb-5 flex items-center gap-2.5">
        <RiSparkling2Line className="size-5 text-feature-base" />
        <span className="text-label-sm text-text-sub-600">What can I help you find?</span>
      </div>

      <Input.Root size="medium" className="rounded-full shadow-regular-xs">
        <Input.Wrapper>
          <Input.Icon as={RiSearchLine} />
          <Input.Input
            type="search"
            placeholder={placeholder}
            aria-label="Search workspace"
            value={query}
            onChange={(e) => runSearch(e.target.value)}
            className="py-3"
          />
          {query.trim() ? (
            <Input.InlineAffix>
              <Button.Root variant="primary" mode="filled" size="xxsmall" className="rounded-full">
                <Button.Icon as={RiArrowRightLine} />
              </Button.Root>
            </Input.InlineAffix>
          ) : null}
        </Input.Wrapper>
      </Input.Root>

      <div className="mt-4 flex flex-wrap gap-2">
        {suggestions.map((s) => (
          <Button.Root
            key={s}
            type="button"
            variant="neutral"
            mode="stroke"
            size="small"
            className="rounded-full"
            onClick={() => runSearch(s)}
          >
            {s}
          </Button.Root>
        ))}
      </div>

      {isPending ? (
        <p className="mt-4 text-paragraph-sm text-text-soft-400">Searching…</p>
      ) : null}

      {results.length > 0 ? (
        <div className="mt-4 overflow-hidden rounded-2xl ring-1 ring-inset ring-stroke-soft-200">
          {results.map(({ slug, doc }, index) => (
            <Link
              key={`${slug}-${doc.id}`}
              href={detailHref('sana', slug, doc)}
              className={cn(
                'block px-4 py-3 transition hover:bg-bg-weak-50',
                index < results.length - 1 && 'border-b border-stroke-soft-200',
              )}
            >
              <span className="text-subheading-2xs uppercase text-feature-base">
                {slug.replace(/-/g, ' ')}
              </span>
              <p className="mt-1 text-label-sm font-medium text-text-strong-950">
                {getDocTitle(doc, slug)}
              </p>
            </Link>
          ))}
        </div>
      ) : query.trim() && !isPending ? (
        <p className="mt-4 text-paragraph-sm text-text-soft-400">No results found.</p>
      ) : null}
    </section>
  )
}
