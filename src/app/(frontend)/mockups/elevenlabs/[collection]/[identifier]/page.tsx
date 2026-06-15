import { notFound } from 'next/navigation'
import Link from 'next/link'
import { DetailView } from '@/components/mockups/elevenlabs/DetailView'
import { DeleteRecordButton } from '@/components/mockups/shared/DeleteRecordButton'
import { getAllCollectionSlugs, type MockupCollectionSlug } from '@/lib/mockups/navigation'
import { findByIdentifier, findCollection } from '@/lib/mockups/queries'
import { getDocIdentifier } from '@/lib/mockups/identifiers'
import { editHref, listHref } from '@/lib/mockups/links'
import * as LinkButton from '@/components/ui/link-button'

type PageProps = {
  params: Promise<{ collection: string; identifier: string }>
}

export default async function ElevenLabsDetailPage({ params }: PageProps) {
  const { collection, identifier } = await params
  if (!getAllCollectionSlugs().includes(collection as MockupCollectionSlug)) notFound()

  const slug = collection as MockupCollectionSlug
  const doc = await findByIdentifier(slug, identifier)
  if (!doc) notFound()

  const record = doc as Record<string, unknown>
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
    <>
      <div className="mb-6 flex flex-wrap items-center justify-end gap-3">
        <LinkButton.Root variant="gray" size="medium" asChild>
          <Link href={editHref('elevenlabs', slug, docIdentifier)}>Edit</Link>
        </LinkButton.Root>
        <DeleteRecordButton variant="elevenlabs" slug={slug} identifier={docIdentifier} />
      </div>
      <DetailView
        slug={slug}
        doc={record}
        identifier={docIdentifier}
        authorOptions={authorOptions}
        backHref={listHref('elevenlabs', slug)}
      />
    </>
  )
}
