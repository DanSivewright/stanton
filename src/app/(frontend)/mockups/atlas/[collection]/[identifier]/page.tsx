import { notFound } from 'next/navigation'
import Link from 'next/link'
import { PageHeader } from '@/components/mockups/atlas/PageHeader'
import { SplitList, SplitView } from '@/components/mockups/atlas/CollectionList'
import { DetailPanel } from '@/components/mockups/atlas/DetailPanel'
import { DeleteRecordButton } from '@/components/mockups/shared/DeleteRecordButton'
import { getCollectionConfig } from '@/components/mockups/linear/collection-config'
import { getDocTitle } from '@/components/mockups/linear/cell-values'
import { getNavItem } from '@/lib/mockups/navigation'
import { findByIdentifier, findCollection } from '@/lib/mockups/queries'
import { getDocIdentifier } from '@/lib/mockups/identifiers'
import { editHref, listHref } from '@/lib/mockups/links'
import * as Button from '@/components/ui/button'

type PageProps = {
  params: Promise<{ collection: string; identifier: string }>
}

export default async function AtlasDetailPage({ params }: PageProps) {
  const { collection, identifier } = await params
  const nav = getNavItem(collection)
  const config = getCollectionConfig(collection)

  if (!nav || !config) notFound()

  const [doc, listResult] = await Promise.all([
    findByIdentifier(collection as typeof config.slug, identifier),
    findCollection(collection as typeof config.slug, { sort: config.sort, limit: 100 }),
  ])

  if (!doc) notFound()

  const typedDoc = doc as Record<string, unknown>
  const title = getDocTitle(typedDoc, config)
  const docIdentifier = getDocIdentifier(typedDoc, config.slug)

  let authorOptions: { id: string; name: string }[] | undefined
  if (config.slug === 'tickets') {
    const employees = await findCollection('employees', { limit: 50 })
    authorOptions = employees.docs.map((e) => ({
      id: String((e as Record<string, unknown>).id),
      name: String((e as Record<string, unknown>).fullName ?? 'Employee'),
    }))
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <PageHeader
        segments={[
          { label: 'Overview', href: '/mockups/atlas' },
          { label: nav.group.label },
          { label: nav.item.label, href: listHref('atlas', config.slug) },
          { label: title },
        ]}
      />
      <SplitView
        list={
          <SplitList
            config={config}
            docs={listResult.docs as Record<string, unknown>[]}
            activeId={docIdentifier}
            variant="atlas"
          />
        }
        detail={
          <>
            <div className="flex items-center justify-end gap-2 border-b border-stroke-soft-200 px-4 py-3">
              <Button.Root variant="neutral" mode="ghost" size="xxsmall" asChild>
                <Link href={editHref('atlas', config.slug, docIdentifier)}>Edit</Link>
              </Button.Root>
              <DeleteRecordButton variant="atlas" slug={config.slug} identifier={docIdentifier} />
            </div>
            <DetailPanel
              doc={typedDoc}
              config={config}
              identifier={docIdentifier}
              authorOptions={authorOptions}
            />
          </>
        }
      />
    </div>
  )
}
