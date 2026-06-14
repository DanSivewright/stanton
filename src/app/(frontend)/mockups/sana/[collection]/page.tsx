import { notFound } from 'next/navigation'
import { Shell } from '@/components/mockups/sana/Shell'
import { DataTable } from '@/components/mockups/sana/DataTable'
import { LocationTree } from '@/components/mockups/sana/LocationTree'
import { findCollection, getLocationTree } from '@/lib/mockups/queries'
import { getAllCollectionSlugs, getNavItem, type MockupCollectionSlug } from '@/lib/mockups/navigation'
import type { Location } from '@/payload-types'

type PageProps = {
  params: Promise<{ collection: string }>
}

export async function generateStaticParams() {
  return getAllCollectionSlugs().map((collection) => ({ collection }))
}

export default async function SanaCollectionPage({ params }: PageProps) {
  const { collection } = await params
  const nav = getNavItem(collection)

  if (!nav) notFound()

  const slug = collection as MockupCollectionSlug

  if (slug === 'locations') {
    const locations = await getLocationTree()
    return (
      <Shell
        title={nav.item.label}
        subtitle={`${locations.length} locations · hierarchical view`}
      >
        <LocationTree locations={locations as Location[]} />
      </Shell>
    )
  }

  const result = await findCollection(slug)
  const rows = result.docs as Record<string, unknown>[]

  return (
    <Shell
      title={nav.item.label}
      subtitle={`${result.totalDocs} records · ${nav.item.description}`}
    >
      <DataTable slug={slug} rows={rows} />
    </Shell>
  )
}
