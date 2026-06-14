import { notFound } from 'next/navigation'
import { TopBar } from '@/components/mockups/linear/TopBar'
import { CollectionList } from '@/components/mockups/linear/CollectionList'
import { getCollectionConfig } from '@/components/mockups/linear/collection-config'
import { getNavItem } from '@/lib/mockups/navigation'
import { findCollection } from '@/lib/mockups/queries'

type PageProps = {
  params: Promise<{ collection: string }>
}

export async function generateMetadata({ params }: PageProps) {
  const { collection } = await params
  const nav = getNavItem(collection)
  return {
    title: nav ? `${nav.item.label} — Linear mockup` : 'Linear mockup',
  }
}

export default async function LinearCollectionPage({ params }: PageProps) {
  const { collection } = await params
  const nav = getNavItem(collection)
  const config = getCollectionConfig(collection)

  if (!nav || !config) notFound()

  const result = await findCollection(collection as typeof config.slug, {
    sort: config.sort,
    limit: 100,
  })

  return (
    <>
      <TopBar
        segments={[
          { label: nav.group.label },
          { label: nav.item.label },
        ]}
        count={result.totalDocs}
      />
      <CollectionList
        config={config}
        docs={result.docs as Record<string, unknown>[]}
        basePath={`/mockups/linear/${collection}`}
      />
    </>
  )
}
