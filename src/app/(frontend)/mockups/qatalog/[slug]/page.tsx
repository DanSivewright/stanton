import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import {
  getAllCollectionSlugs,
  getNavItem,
  type MockupCollectionSlug,
} from '@/lib/mockups/navigation'
import { findById, findCollection } from '@/lib/mockups/queries'
import { QatalogSectionTabs } from '@/components/mockups/qatalog/QatalogSectionTabs'
import { CollectionView } from '@/components/mockups/qatalog/CollectionView'

type PageProps = {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ id?: string }>
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

export default async function QatalogCollectionPage({ params, searchParams }: PageProps) {
  const { slug } = await params
  const { id: detailId } = await searchParams

  if (!getAllCollectionSlugs().includes(slug as MockupCollectionSlug)) {
    notFound()
  }

  const collectionSlug = slug as MockupCollectionSlug
  const [result, detailDoc] = await Promise.all([
    findCollection(collectionSlug, { limit: 200, sort: collectionSlug === 'locations' ? 'name' : '-updatedAt' }),
    detailId ? findById(collectionSlug, detailId) : Promise.resolve(null),
  ])

  return (
    <>
      <QatalogSectionTabs activeSlug={collectionSlug} />
      <Suspense fallback={null}>
        <CollectionView
          slug={collectionSlug}
          docs={result.docs as unknown as (Record<string, unknown> & { id: string })[]}
          detailDoc={detailDoc as unknown as (Record<string, unknown> & { id: string }) | null}
        />
      </Suspense>
    </>
  )
}
