import { notFound } from 'next/navigation'
import { CollectionListView } from '@/components/mockups/elevenlabs/CollectionListView'
import { LibraryBrowseView } from '@/components/mockups/elevenlabs/LibraryBrowseView'
import { isLibraryCollection, type LibraryTab } from '@/components/mockups/elevenlabs/utils'
import {
  getAllCollectionSlugs,
  getNavItem,
  type MockupCollectionSlug,
} from '@/lib/mockups/navigation'
import { findCollection } from '@/lib/mockups/queries'
import { relLabel } from '@/lib/mockups/helpers'

type PageProps = {
  params: Promise<{ collection: string }>
  searchParams: Promise<{ tab?: string; q?: string; category?: string; type?: string }>
}

function isValidSlug(slug: string): slug is MockupCollectionSlug {
  return getAllCollectionSlugs().includes(slug as MockupCollectionSlug)
}

export async function generateMetadata({ params }: PageProps) {
  const { collection } = await params
  const nav = getNavItem(collection)
  return {
    title: nav ? `${nav.item.label} — Stanton ElevenLabs` : 'Collection',
  }
}

export default async function CollectionPage({ params, searchParams }: PageProps) {
  const { collection } = await params
  const sp = await searchParams

  if (!isValidSlug(collection)) notFound()

  const result = await findCollection(collection)
  const docs = result.docs as Record<string, unknown>[]

  if (isLibraryCollection(collection)) {
    const tab = (['active', 'all', 'archived'].includes(sp.tab ?? '')
      ? sp.tab
      : 'active') as LibraryTab

    const chipCollection = collection === 'assets' ? 'asset-categories' : 'ticket-types'
    const chipResult = await findCollection(chipCollection)
    const chips = (chipResult.docs as Record<string, unknown>[]).map((doc) => ({
      id: String(doc.id),
      label: relLabel(doc as never),
    }))

    const chipId = collection === 'assets' ? sp.category : sp.type

    return (
      <LibraryBrowseView
        slug={collection}
        docs={docs}
        chips={chips}
        tab={tab}
        query={sp.q}
        chipId={chipId}
      />
    )
  }

  return <CollectionListView slug={collection} docs={docs} query={sp.q} totalDocs={result.totalDocs} />
}
