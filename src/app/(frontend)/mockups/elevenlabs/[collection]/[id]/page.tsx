import { notFound } from 'next/navigation'
import { DetailView } from '@/components/mockups/elevenlabs/DetailView'
import {
  getAllCollectionSlugs,
  getNavItem,
  type MockupCollectionSlug,
} from '@/lib/mockups/navigation'
import { findById } from '@/lib/mockups/queries'

type PageProps = {
  params: Promise<{ collection: string; id: string }>
}

function isValidSlug(slug: string): slug is MockupCollectionSlug {
  return getAllCollectionSlugs().includes(slug as MockupCollectionSlug)
}

export async function generateMetadata({ params }: PageProps) {
  const { collection, id } = await params
  if (!isValidSlug(collection)) return { title: 'Not found' }

  const doc = await findById(collection, id)
  const nav = getNavItem(collection)
  if (!doc) return { title: 'Not found' }

  const title =
    (doc as Record<string, unknown>).name ??
    (doc as Record<string, unknown>).title ??
    (doc as Record<string, unknown>).fullName ??
    (doc as Record<string, unknown>).email

  return {
    title: `${title ?? 'Detail'} — ${nav?.item.label ?? collection}`,
  }
}

export default async function DetailPage({ params }: PageProps) {
  const { collection, id } = await params

  if (!isValidSlug(collection)) notFound()

  const doc = await findById(collection, id)
  if (!doc) notFound()

  return <DetailView slug={collection} doc={doc as Record<string, unknown>} />
}
