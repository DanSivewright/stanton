import { notFound } from 'next/navigation'
import { Shell } from '@/components/mockups/sana/Shell'
import { MockupFormPage } from '@/components/mockups/shared/MockupFormPage'
import { getAllCollectionSlugs, getNavItem, type MockupCollectionSlug } from '@/lib/mockups/navigation'

type PageProps = {
  params: Promise<{ collection: string }>
}

export async function generateStaticParams() {
  return getAllCollectionSlugs().map((collection) => ({ collection }))
}

export default async function SanaNewPage({ params }: PageProps) {
  const { collection } = await params
  if (!getNavItem(collection)) notFound()

  return MockupFormPage({
    variant: 'sana',
    slug: collection as MockupCollectionSlug,
    mode: 'create',
    shell: (children, title, subtitle) => (
      <Shell title={title} subtitle={subtitle}>
        {children}
      </Shell>
    ),
  })
}
