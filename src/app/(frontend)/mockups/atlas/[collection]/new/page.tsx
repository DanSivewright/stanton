import { notFound } from 'next/navigation'
import { PageHeader } from '@/components/mockups/atlas/PageHeader'
import { MockupFormPage } from '@/components/mockups/shared/MockupFormPage'
import { getCollectionConfig } from '@/components/mockups/linear/collection-config'
import { getNavItem, type MockupCollectionSlug } from '@/lib/mockups/navigation'
import { listHref } from '@/lib/mockups/links'

type PageProps = {
  params: Promise<{ collection: string }>
}

export default async function AtlasNewPage({ params }: PageProps) {
  const { collection } = await params
  const nav = getNavItem(collection)
  const config = getCollectionConfig(collection)
  if (!nav || !config) notFound()

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <PageHeader
        segments={[
          { label: 'Overview', href: '/mockups/atlas' },
          { label: nav.group.label },
          { label: nav.item.label, href: listHref('atlas', config.slug) },
          { label: 'New' },
        ]}
      />
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="mx-auto max-w-2xl rounded-2xl border border-stroke-soft-200 bg-bg-white-0 p-6 shadow-regular-xs">
          <MockupFormPage
            variant="atlas"
            slug={collection as MockupCollectionSlug}
            mode="create"
            shell={(children, title, subtitle) => (
              <>
                <h2 className="text-title-h5 text-text-strong-950">{title}</h2>
                {subtitle ? (
                  <p className="mt-1 mb-6 text-paragraph-sm text-text-soft-400">{subtitle}</p>
                ) : (
                  <div className="mb-6" />
                )}
                {children}
              </>
            )}
          />
        </div>
      </div>
    </div>
  )
}
