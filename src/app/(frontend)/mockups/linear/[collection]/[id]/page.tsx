import { notFound } from 'next/navigation'
import { TopBar } from '@/components/mockups/linear/TopBar'
import { SplitList, SplitView } from '@/components/mockups/linear/CollectionList'
import { DetailPanel } from '@/components/mockups/linear/DetailPanel'
import { getCollectionConfig } from '@/components/mockups/linear/collection-config'
import { getDocTitle } from '@/components/mockups/linear/cell-values'
import { getNavItem } from '@/lib/mockups/navigation'
import { findById, findCollection } from '@/lib/mockups/queries'

type PageProps = {
  params: Promise<{ collection: string; id: string }>
}

export async function generateMetadata({ params }: PageProps) {
  const { collection, id } = await params
  const config = getCollectionConfig(collection)
  if (!config) return { title: 'Linear mockup' }

  const doc = await findById(collection as typeof config.slug, id)
  if (!doc) return { title: 'Not found — Linear mockup' }

  return {
    title: `${getDocTitle(doc as Record<string, unknown>, config)} — Linear mockup`,
  }
}

export default async function LinearDetailPage({ params }: PageProps) {
  const { collection, id } = await params
  const nav = getNavItem(collection)
  const config = getCollectionConfig(collection)

  if (!nav || !config) notFound()

  const [doc, listResult] = await Promise.all([
    findById(collection as typeof config.slug, id),
    findCollection(collection as typeof config.slug, { sort: config.sort, limit: 100 }),
  ])

  if (!doc) notFound()

  const typedDoc = doc as Record<string, unknown>
  const title = getDocTitle(typedDoc, config)

  return (
    <>
      <TopBar
        segments={[
          { label: nav.group.label, href: `/mockups/linear/${collection}` },
          { label: nav.item.label, href: `/mockups/linear/${collection}` },
          { label: title },
        ]}
      />
      <SplitView
        list={
          <SplitList
            config={config}
            docs={listResult.docs as Record<string, unknown>[]}
            activeId={id}
            basePath={`/mockups/linear/${collection}`}
          />
        }
        detail={<DetailPanel doc={typedDoc} config={config} />}
      />
    </>
  )
}
