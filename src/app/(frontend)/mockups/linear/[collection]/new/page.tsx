import { notFound } from 'next/navigation'
import { TopBar } from '@/components/mockups/linear/TopBar'
import { MockupFormPage } from '@/components/mockups/shared/MockupFormPage'
import { getCollectionConfig } from '@/components/mockups/linear/collection-config'
import { getNavItem, type MockupCollectionSlug } from '@/lib/mockups/navigation'

type PageProps = {
  params: Promise<{ collection: string }>
}

export default async function LinearNewPage({ params }: PageProps) {
  const { collection } = await params
  const nav = getNavItem(collection)
  const config = getCollectionConfig(collection)
  if (!nav || !config) notFound()

  return MockupFormPage({
    variant: 'linear',
    slug: collection as MockupCollectionSlug,
    mode: 'create',
    shell: (children, title) => (
      <>
        <TopBar segments={[{ label: nav.group.label }, { label: nav.item.label, href: `/mockups/linear/${collection}` }, { label: 'New' }]} />
        <div className="mx-auto max-w-2xl px-6 py-6">{children}</div>
      </>
    ),
  })
}
