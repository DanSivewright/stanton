import { notFound } from 'next/navigation'
import { Shell } from '@/components/mockups/sana/Shell'
import { MockupFormPage } from '@/components/mockups/shared/MockupFormPage'
import { getNavItem, type MockupCollectionSlug } from '@/lib/mockups/navigation'

type PageProps = {
  params: Promise<{ collection: string; identifier: string }>
}

export default async function SanaEditPage({ params }: PageProps) {
  const { collection, identifier } = await params
  if (!getNavItem(collection)) notFound()

  return MockupFormPage({
    variant: 'sana',
    slug: collection as MockupCollectionSlug,
    mode: 'edit',
    identifier,
    shell: (children, title, subtitle) => (
      <Shell title={title} subtitle={subtitle}>
        {children}
      </Shell>
    ),
  })
}
