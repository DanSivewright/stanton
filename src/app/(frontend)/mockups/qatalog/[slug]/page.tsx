import { notFound } from 'next/navigation'
import {
  getAllCollectionSlugs,
  getNavItem,
  type MockupCollectionSlug,
} from '@/lib/mockups/navigation'
import { findCollection } from '@/lib/mockups/queries'
import { QatalogSectionTabs } from '@/components/mockups/qatalog/QatalogSectionTabs'
import { QatalogShell } from '@/components/mockups/qatalog/QatalogShell'
import { CollectionView } from '@/components/mockups/qatalog/CollectionView'

type PageProps = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return getAllCollectionSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const nav = getNavItem(slug)
  return {
    title: nav ? `${nav.item.label} · Qatalog · Stanton` : 'Qatalog · Stanton',
  }
}

export default async function QatalogCollectionPage({ params }: PageProps) {
  const { slug } = await params

  if (!getAllCollectionSlugs().includes(slug as MockupCollectionSlug)) {
    notFound()
  }

  const collectionSlug = slug as MockupCollectionSlug
  const result = await findCollection(collectionSlug, {
    limit: 200,
    sort: collectionSlug === 'locations' ? 'name' : '-updatedAt',
  })

  return (
    <QatalogShell>
      <QatalogSectionTabs activeSlug={collectionSlug} />
      <CollectionView
        slug={collectionSlug}
        docs={result.docs as unknown as (Record<string, unknown> & { id: string })[]}
        totalDocs={result.totalDocs}
      />
    </QatalogShell>
  )
}
