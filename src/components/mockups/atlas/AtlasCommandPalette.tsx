'use client'

import { useEffect, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { RiFileListLine, RiSearchLine } from '@remixicon/react'
import * as CommandMenu from '@/components/ui/command-menu'
import * as Kbd from '@/components/ui/kbd'
import { MOCKUP_NAV } from '@/lib/mockups/navigation'
import { searchMockupRecords } from '@/lib/mockups/actions'
import { detailHref, listHref } from '@/lib/mockups/links'
import { getDocTitle } from '@/lib/mockups/identifiers'
import type { SearchHit } from '@/lib/mockups/queries'
import { NAV_ICONS } from '@/components/mockups/linear/collection-config'

type AtlasCommandPaletteProps = {
  open: boolean
  onClose: () => void
}

export function AtlasCommandPalette({ open, onClose }: AtlasCommandPaletteProps) {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [records, setRecords] = useState<SearchHit[]>([])
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    if (!open) {
      setQuery('')
      setRecords([])
    }
  }, [open])

  useEffect(() => {
    if (!query.trim()) {
      setRecords([])
      return
    }
    const timer = setTimeout(() => {
      startTransition(async () => {
        const hits = await searchMockupRecords(query)
        setRecords(hits)
      })
    }, 200)
    return () => clearTimeout(timer)
  }, [query])

  const q = query.toLowerCase()
  const collections = MOCKUP_NAV.flatMap((group) =>
    group.items
      .filter(
        (item) =>
          !q ||
          item.label.toLowerCase().includes(q) ||
          item.slug.includes(q) ||
          group.label.toLowerCase().includes(q),
      )
      .map((item) => ({
        href: listHref('atlas', item.slug),
        label: item.label,
        meta: group.label,
        icon: NAV_ICONS[item.slug],
      })),
  )

  function navigate(href: string) {
    onClose()
    router.push(href)
  }

  return (
    <CommandMenu.Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <div className="group/cmd-input flex items-center gap-3 border-b border-stroke-soft-200 px-5 py-4">
        <RiSearchLine className="size-5 shrink-0 text-text-soft-400" />
        <CommandMenu.Input
          placeholder="Search collections and records…"
          value={query}
          onValueChange={setQuery}
        />
        <Kbd.Root>esc</Kbd.Root>
      </div>

      <CommandMenu.List className="max-h-[min(420px,60vh)]">
        {collections.length === 0 && records.length === 0 && !isPending ? (
          <div className="px-5 py-8 text-center text-paragraph-sm text-text-soft-400">
            No results
          </div>
        ) : null}

        {collections.length > 0 ? (
          <CommandMenu.Group heading="Collections">
            {collections.map((item) => (
              <CommandMenu.Item
                key={item.href}
                value={`${item.label} ${item.meta}`}
                onSelect={() => navigate(item.href)}
              >
                <CommandMenu.ItemIcon className="text-subheading-xs">{item.icon}</CommandMenu.ItemIcon>
                <span className="flex-1">{item.label}</span>
                <span className="text-label-xs text-text-soft-400">{item.meta}</span>
              </CommandMenu.Item>
            ))}
          </CommandMenu.Group>
        ) : null}

        {records.length > 0 ? (
          <CommandMenu.Group heading="Records">
            {records.map(({ slug, doc }) => {
              const href = detailHref('atlas', slug, doc)
              return (
                <CommandMenu.Item
                  key={href}
                  value={`${getDocTitle(doc, slug)} ${slug}`}
                  onSelect={() => navigate(href)}
                >
                  <CommandMenu.ItemIcon as={RiFileListLine} />
                  <span className="flex-1 truncate">{getDocTitle(doc, slug)}</span>
                  <span className="text-label-xs text-text-soft-400">
                    {slug.replace(/-/g, ' ')}
                  </span>
                </CommandMenu.Item>
              )
            })}
          </CommandMenu.Group>
        ) : null}

        {isPending ? (
          <div className="px-5 py-3 text-paragraph-sm text-text-soft-400">Searching…</div>
        ) : null}
      </CommandMenu.List>

      <CommandMenu.Footer className="border-t border-stroke-soft-200 text-label-xs text-text-soft-400">
        <span className="flex items-center gap-1.5">
          <Kbd.Root>↑↓</Kbd.Root> navigate
        </span>
        <span className="flex items-center gap-1.5">
          <Kbd.Root>↵</Kbd.Root> open
        </span>
        <span className="flex items-center gap-1.5">
          <Kbd.Root>esc</Kbd.Root> close
        </span>
      </CommandMenu.Footer>
    </CommandMenu.Dialog>
  )
}
