import { notFound } from 'next/navigation'
import { Shell } from '@/components/mockups/sana/Shell'
import { DetailPanel } from '@/components/mockups/sana/DetailPanel'
import { getRowTitle } from '@/components/mockups/sana/columns'
import { findById } from '@/lib/mockups/queries'
import { getNavItem, type MockupCollectionSlug } from '@/lib/mockups/navigation'

type PageProps = {
  params: Promise<{ collection: string; id: string }>
}

const BASE = '/mockups/sana'

export default async function SanaDetailPage({ params }: PageProps) {
  const { collection, id } = await params
  const nav = getNavItem(collection)

  if (!nav) notFound()

  const slug = collection as MockupCollectionSlug
  const doc = await findById(slug, id)

  if (!doc) notFound()

  const record = doc as Record<string, unknown>
  const title = getRowTitle(slug, record)

  return (
    <Shell title={nav.item.label} subtitle="Record detail">
      <DetailPanel
        slug={slug}
        doc={record}
        backHref={`${BASE}/${slug}`}
        title={title}
      />
    </Shell>
  )
}
