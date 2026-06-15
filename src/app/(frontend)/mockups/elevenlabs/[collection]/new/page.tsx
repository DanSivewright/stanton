import { notFound } from 'next/navigation'
import { MockupFormPage } from '@/components/mockups/shared/MockupFormPage'
import { getAllCollectionSlugs, type MockupCollectionSlug } from '@/lib/mockups/navigation'
import * as LinkButton from '@/components/ui/link-button'
import Link from 'next/link'

type PageProps = {
  params: Promise<{ collection: string }>
}

export default async function ElevenLabsNewPage({ params }: PageProps) {
  const { collection } = await params
  if (!getAllCollectionSlugs().includes(collection as MockupCollectionSlug)) notFound()

  return (
    <MockupFormPage
      variant="elevenlabs"
      slug={collection as MockupCollectionSlug}
      mode="create"
      shell={(children, title, subtitle) => (
        <div>
          <LinkButton.Root variant="gray" size="medium" asChild className="mb-6 inline-flex">
            <Link href={`/mockups/elevenlabs/${collection}`}>← Back</Link>
          </LinkButton.Root>
          <h1 className="text-title-h4 text-text-strong-950">{title}</h1>
          {subtitle ? <p className="mt-1 text-paragraph-sm text-text-sub-600">{subtitle}</p> : null}
          <div className="mt-8">{children}</div>
        </div>
      )}
    />
  )
}
