import { notFound } from 'next/navigation'
import Link from 'next/link'
import { RiArrowLeftSLine } from '@remixicon/react'
import { QatalogSectionTabs } from '@/components/mockups/qatalog/QatalogSectionTabs'
import { QatalogShell } from '@/components/mockups/qatalog/QatalogShell'
import { CollectionDetailDrawer } from '@/components/mockups/qatalog/CollectionDetailDrawer'
import { DeleteRecordButton } from '@/components/mockups/shared/DeleteRecordButton'
import { getAllCollectionSlugs, type MockupCollectionSlug } from '@/lib/mockups/navigation'
import { findByIdentifier, findCollection } from '@/lib/mockups/queries'
import { getDocIdentifier } from '@/lib/mockups/identifiers'
import { editHref, listHref } from '@/lib/mockups/links'
import * as Breadcrumb from '@/components/ui/breadcrumb'
import * as Button from '@/components/ui/button'

type PageProps = {
  params: Promise<{ slug: string; identifier: string }>
}

export default async function QatalogDetailPage({ params }: PageProps) {
  const { slug, identifier } = await params
  if (!getAllCollectionSlugs().includes(slug as MockupCollectionSlug)) notFound()

  const collectionSlug = slug as MockupCollectionSlug
  const doc = await findByIdentifier(collectionSlug, identifier)
  if (!doc) notFound()

  const record = doc as Record<string, unknown> & { id: string }
  const docIdentifier = getDocIdentifier(record, collectionSlug)

  let authorOptions: { id: string; name: string }[] | undefined
  if (collectionSlug === 'tickets') {
    const employees = await findCollection('employees', { limit: 50 })
    authorOptions = employees.docs.map((e) => ({
      id: String((e as Record<string, unknown>).id),
      name: String((e as Record<string, unknown>).fullName ?? 'Employee'),
    }))
  }

  return (
    <QatalogShell>
      <QatalogSectionTabs activeSlug={collectionSlug} />
      <div className="px-12 pb-12 pt-6">
        <Breadcrumb.Root className="mb-6">
          <Breadcrumb.Item asChild>
            <Link href={listHref('qatalog', collectionSlug)} className="inline-flex items-center gap-1">
              <RiArrowLeftSLine className="size-5" />
              Back to list
            </Link>
          </Breadcrumb.Item>
        </Breadcrumb.Root>

        <div className="mb-6 flex flex-wrap items-center justify-end gap-3">
          <Link href={editHref('qatalog', collectionSlug, docIdentifier)}>
            <Button.Root variant="neutral" mode="stroke" size="medium">
              Edit
            </Button.Root>
          </Link>
          <DeleteRecordButton variant="qatalog" slug={collectionSlug} identifier={docIdentifier} />
        </div>

        <div className="mx-auto max-w-2xl rounded-2xl border border-stroke-soft-200 bg-bg-white-0 p-8 shadow-regular-xs">
          <CollectionDetailDrawer
            slug={collectionSlug}
            doc={record}
            inline
            identifier={docIdentifier}
            authorOptions={authorOptions}
          />
        </div>
      </div>
    </QatalogShell>
  )
}
