'use client'

import Link from 'next/link'
import { RiAddLine, RiSearchLine } from '@remixicon/react'
import * as Badge from '@/components/ui/badge'
import * as Breadcrumb from '@/components/ui/breadcrumb'
import * as Button from '@/components/ui/button'
import * as Kbd from '@/components/ui/kbd'
import { useAtlasCommandPalette } from './AtlasProvider'

type PageHeaderProps = {
  segments: { label: string; href?: string }[]
  count?: number
  newHref?: string
  description?: string
}

export function PageHeader({ segments, count, newHref: createHref, description }: PageHeaderProps) {
  const { setOpen } = useAtlasCommandPalette()

  return (
    <header className="sticky top-0 z-10 shrink-0 border-b border-stroke-soft-200 bg-bg-white-0/95 px-6 py-4 backdrop-blur-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <Breadcrumb.Root className="mb-2">
            {segments.map((seg, i) => (
              <span key={`${seg.label}-${i}`} className="flex items-center gap-1.5">
                {i > 0 ? <Breadcrumb.ArrowIcon /> : null}
                <Breadcrumb.Item active={!seg.href && i === segments.length - 1}>
                  {seg.href ? (
                    <Link href={seg.href} className="text-text-soft-400 hover:text-text-sub-600">
                      {seg.label}
                    </Link>
                  ) : (
                    seg.label
                  )}
                </Breadcrumb.Item>
              </span>
            ))}
          </Breadcrumb.Root>
          <div className="flex items-center gap-3">
            <h1 className="truncate text-title-h5 text-text-strong-950">
              {segments[segments.length - 1]?.label}
            </h1>
            {count != null ? (
              <Badge.Root variant="lighter" color="gray" size="small">
                {count}
              </Badge.Root>
            ) : null}
          </div>
          {description ? (
            <p className="mt-1 text-paragraph-sm text-text-soft-400">{description}</p>
          ) : null}
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Button.Root
            variant="neutral"
            mode="stroke"
            size="xsmall"
            type="button"
            onClick={() => setOpen(true)}
            className="gap-2"
          >
            <Button.Icon as={RiSearchLine} />
            Search
            <Kbd.Root className="hidden sm:flex">⌘K</Kbd.Root>
          </Button.Root>
          {createHref ? (
            <Button.Root variant="primary" mode="filled" size="xsmall" asChild>
              <Link href={createHref}>
                <Button.Icon as={RiAddLine} />
                New
              </Link>
            </Button.Root>
          ) : null}
        </div>
      </div>
    </header>
  )
}
