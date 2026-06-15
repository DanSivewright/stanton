import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Shell } from '@/components/mockups/sana/Shell'
import { DetailPanel } from '@/components/mockups/sana/DetailPanel'
import { DeleteRecordButton } from '@/components/mockups/shared/DeleteRecordButton'
import { getRowTitle } from '@/components/mockups/sana/columns'
import { findByIdentifier, findCollection } from '@/lib/mockups/queries'
import { getNavItem, type MockupCollectionSlug } from '@/lib/mockups/navigation'
import { getDocIdentifier } from '@/lib/mockups/identifiers'
import { editHref, listHref } from '@/lib/mockups/links'
import * as Button from '@/components/ui/button'

type PageProps = {
  params: Promise<{ collection: string; identifier: string }>
}

export default async function SanaDetailPage({ params }: PageProps) {
  const { collection, identifier } = await params
  const nav = getNavItem(collection)

  if (!nav) notFound()

  const slug = collection as MockupCollectionSlug
  const doc = await findByIdentifier(slug, identifier)

  if (!doc) notFound()

  const record = doc as Record<string, unknown>
  const title = getRowTitle(slug, record)
  const docIdentifier = getDocIdentifier(record, slug)

  let authorOptions: { id: string; name: string }[] | undefined
  if (slug === 'tickets') {
    const employees = await findCollection('employees', { limit: 50 })
    authorOptions = employees.docs.map((e) => ({
      id: String((e as Record<string, unknown>).id),
      name: String((e as Record<string, unknown>).fullName ?? 'Employee'),
    }))
  }

  return (
    <Shell title={nav.item.label} subtitle="Record detail">
      <div className="mb-4 flex justify-end gap-3">
        <Button.Root variant="neutral" mode="stroke" size="small" asChild>
          <Link href={editHref('sana', slug, docIdentifier)}>Edit</Link>
        </Button.Root>
        <DeleteRecordButton variant="sana" slug={slug} identifier={docIdentifier} useAlignUI />
      </div>
      <DetailPanel
        slug={slug}
        doc={record}
        backHref={listHref('sana', slug)}
        title={title}
        variant="sana"
        identifier={docIdentifier}
        authorOptions={authorOptions}
      />
    </Shell>
  )
}
