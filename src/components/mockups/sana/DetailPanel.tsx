'use client'

import Link from 'next/link'
import { useState } from 'react'
import { RiArrowLeftLine } from '@remixicon/react'
import type { MockupCollectionSlug, MockupVariantSlug } from '@/lib/mockups/navigation'
import { statusLabel } from '@/lib/mockups/helpers'
import { getDetailFields, getMetaFields } from './detail-config'
import { TicketActivityLog } from './TicketActivityLog'
import * as Badge from '@/components/ui/badge'
import * as Button from '@/components/ui/button'
import * as Drawer from '@/components/ui/drawer'
import * as LinkButton from '@/components/ui/link-button'
import type { Ticket } from '@/payload-types'

type DetailPanelProps = {
  slug: MockupCollectionSlug
  doc: Record<string, unknown>
  backHref: string
  title: string
  variant?: MockupVariantSlug
  identifier?: string
  authorOptions?: { id: string; name: string }[]
}

export function DetailPanel({
  slug,
  doc,
  backHref,
  title,
  variant = 'sana',
  identifier,
  authorOptions,
}: DetailPanelProps) {
  const fields = getDetailFields(slug, doc)
  const meta = getMetaFields(doc)
  const [drawerOpen, setDrawerOpen] = useState(false)

  const statusFields = ['status', 'priority', 'reviewStatus'] as const

  return (
    <>
      <div className="mb-6">
        <LinkButton.Root variant="gray" size="medium" asChild className="mb-4 inline-flex">
          <Link href={backHref}>
            <LinkButton.Icon as={RiArrowLeftLine} />
            Back to list
          </Link>
        </LinkButton.Root>

        <div className="flex flex-wrap items-start justify-between gap-4">
          <h1 className="text-title-h4 font-bold text-text-strong-950">{title}</h1>
          <div className="flex flex-wrap gap-2">
            {slug === 'tickets' &&
              statusFields.map((key) => {
                const val = doc[key] as string | undefined
                if (!val) return null
                const isPriority = key === 'priority'
                const color = isPriority
                  ? val === 'critical'
                    ? 'red'
                    : val === 'high'
                      ? 'orange'
                      : val === 'medium'
                        ? 'yellow'
                        : 'gray'
                  : 'purple'
                return (
                  <Badge.Root key={key} variant="lighter" color={color} size="medium">
                    {key === 'status' || key === 'reviewStatus' ? statusLabel(val) : val}
                  </Badge.Root>
                )
              })}
          </div>
        </div>
      </div>

      <div className="grid gap-6">
        <div className="rounded-2xl bg-bg-white-0 p-6 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200">
          <h2 className="mb-5 text-label-md font-semibold text-text-strong-950">Details</h2>
          <dl className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-x-8 gap-y-5">
            {[...fields, ...meta].map((field) => (
              <div key={field.label} className={field.wide ? 'col-span-full' : undefined}>
                <dt className="text-subheading-2xs uppercase tracking-wide text-text-soft-400">
                  {field.label}
                </dt>
                <dd className="mt-1.5 text-paragraph-sm leading-relaxed text-text-strong-950 whitespace-pre-wrap">
                  {field.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {slug === 'tickets' && identifier ? (
          <TicketActivityLog
            activity={(doc as unknown as Ticket).activity}
            variant={variant}
            identifier={identifier}
            authorOptions={authorOptions}
          />
        ) : null}
      </div>

      <div className="fixed bottom-6 right-6 lg:hidden">
        <Button.Root
          type="button"
          variant="primary"
          mode="filled"
          size="medium"
          className="rounded-full shadow-regular-md"
          onClick={() => setDrawerOpen(true)}
        >
          Quick view
        </Button.Root>
      </div>

      <Drawer.Root open={drawerOpen} onOpenChange={setDrawerOpen}>
        <Drawer.Content>
          <Drawer.Header>
            <Drawer.Title>{title}</Drawer.Title>
          </Drawer.Header>
          <Drawer.Body className="px-5 pb-6">
            <dl className="flex flex-col gap-4">
              {fields.map((field) => (
                <div key={field.label}>
                  <dt className="text-subheading-2xs uppercase text-text-soft-400">{field.label}</dt>
                  <dd className="mt-1 text-paragraph-sm text-text-strong-950">{field.value}</dd>
                </div>
              ))}
            </dl>
          </Drawer.Body>
        </Drawer.Content>
      </Drawer.Root>
    </>
  )
}
