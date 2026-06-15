import { notFound } from 'next/navigation'
import Link from 'next/link'
import { MockupFormPage } from '@/components/mockups/shared/MockupFormPage'
import { getAllCollectionSlugs, type MockupCollectionSlug } from '@/lib/mockups/navigation'
import * as LinkButton from '@/components/ui/link-button'

type PageProps = {
  params: Promise<{ collection: string; identifier: string }>
}

export default async function ElevenLabsEditPage({ params }: PageProps) {
  const { collection, identifier } = await params
  if (!getAllCollectionSlugs().includes(collection as MockupCollectionSlug)) notFound()

  return (
    <MockupFormPage
      variant="elevenlabs"
      slug={collection as MockupCollectionSlug}
      mode="edit"
      identifier={identifier}
      shell={(children, title, subtitle) => (
        <div>
          <LinkButton.Root variant="gray" size="medium" asChild className="mb-6 inline-flex">
            <Link href={`/mockups/elevenlabs/${collection}/${encodeURIComponent(identifier)}`}>
              ← Back
            </Link>
          </LinkButton.Root>
          <h1 className="text-title-h4 text-text-strong-950">{title}</h1>
          {subtitle ? <p className="mt-1 text-paragraph-sm text-text-sub-600">{subtitle}</p> : null}
          <div className="mt-8">{children}</div>
        </div>
      )}
    />
  )
}
