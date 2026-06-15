import { notFound } from 'next/navigation'
import { PageHeader } from '@/components/mockups/atlas/PageHeader'
import { CollectionList } from '@/components/mockups/atlas/CollectionList'
import { getCollectionConfig } from '@/components/mockups/linear/collection-config'
import { getAllCollectionSlugs, getNavItem, type MockupCollectionSlug } from '@/lib/mockups/navigation'
import { findCollection } from '@/lib/mockups/queries'
import { newHref } from '@/lib/mockups/links'

type PageProps = {
  params: Promise<{ collection: string }>
}

export async function generateStaticParams() {
  return getAllCollectionSlugs().map((collection) => ({ collection }))
}

export async function generateMetadata({ params }: PageProps) {
  const { collection } = await params
  const nav = getNavItem(collection)
  return {
    title: nav ? `${nav.item.label} · Atlas · Stanton` : 'Atlas · Stanton',
  }
}

export default async function AtlasCollectionPage({ params }: PageProps) {
  const { collection } = await params
  const nav = getNavItem(collection)
  const config = getCollectionConfig(collection)

  if (!nav || !config) notFound()

  const result = await findCollection(collection as MockupCollectionSlug, {
    sort: config.sort,
    limit: 100,
  })

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <PageHeader
        segments={[
          { label: 'Overview', href: '/mockups/atlas' },
          { label: nav.group.label },
          { label: nav.item.label },
        ]}
        count={result.totalDocs}
        newHref={newHref('atlas', config.slug)}
        description={nav.item.description}
      />
      <div className="min-h-0 flex-1 overflow-y-auto bg-bg-white-0">
        <CollectionList
          config={config}
          docs={result.docs as Record<string, unknown>[]}
          variant="atlas"
          totalDocs={result.totalDocs}
        />
      </div>
    </div>
  )
}
