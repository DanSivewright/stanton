'use client'

import Link from 'next/link'
import { RiAddLine, RiSearchLine } from '@remixicon/react'
import * as Button from '@/components/ui/button'
import * as Kbd from '@/components/ui/kbd'
import { useCommandPalette } from './LinearProvider'

type TopBarProps = {
  segments: { label: string; href?: string }[]
  count?: number
  newHref?: string
}

export function TopBar({ segments, count, newHref: createHref }: TopBarProps) {
  const { setOpen } = useCommandPalette()

  return (
    <header className="sticky top-0 z-10 flex h-11 shrink-0 items-center justify-between border-b border-stroke-soft-200 bg-bg-strong-950/95 px-4 backdrop-blur-sm">
      <nav className="flex min-w-0 items-center gap-1.5 text-label-sm" aria-label="Breadcrumb">
        {segments.map((seg, i) => (
          <span key={`${seg.label}-${i}`} className="flex min-w-0 items-center gap-1.5">
            {i > 0 ? <span className="text-text-soft-400">/</span> : null}
            {seg.href ? (
              <Link
                href={seg.href}
                className="truncate text-text-sub-600 transition duration-200 hover:text-text-white-0"
              >
                {seg.label}
              </Link>
            ) : (
              <span className="truncate text-text-white-0">{seg.label}</span>
            )}
          </span>
        ))}
      </nav>

      <div className="flex shrink-0 items-center gap-2">
        {count != null ? (
          <span className="rounded-md bg-bg-white-0/10 px-2 py-0.5 text-label-xs text-text-sub-600">
            {count}
          </span>
        ) : null}
        {createHref ? (
          <Button.Root variant="primary" mode="filled" size="xxsmall" asChild>
            <Link href={createHref}>
              <Button.Icon as={RiAddLine} />
              New
            </Link>
          </Button.Root>
        ) : null}
        <Button.Root
          variant="neutral"
          mode="stroke"
          size="xxsmall"
          type="button"
          onClick={() => setOpen(true)}
          className="gap-2"
        >
          <Button.Icon as={RiSearchLine} />
          Search
          <Kbd.Root className="hidden sm:flex">⌘K</Kbd.Root>
        </Button.Root>
      </div>
    </header>
  )
}
