import { notFound } from 'next/navigation'
import { TopBar } from '@/components/mockups/linear/TopBar'
import { SplitList, SplitView } from '@/components/mockups/linear/CollectionList'
import { DetailPanel, DetailToolbar } from '@/components/mockups/linear/DetailPanel'
import { DeleteRecordButton } from '@/components/mockups/shared/DeleteRecordButton'
import { getCollectionConfig } from '@/components/mockups/linear/collection-config'
import { getDocTitle } from '@/components/mockups/linear/cell-values'
import { getNavItem } from '@/lib/mockups/navigation'
import { findByIdentifier, findCollection } from '@/lib/mockups/queries'
import { getDocIdentifier } from '@/lib/mockups/identifiers'
import { editHref, listHref } from '@/lib/mockups/links'

type PageProps = {
  params: Promise<{ collection: string; identifier: string }>
}

export default async function LinearDetailPage({ params }: PageProps) {
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
    <>
      <TopBar
        segments={[
          { label: nav.group.label },
          { label: nav.item.label, href: listHref('linear', config.slug) },
          { label: title },
        ]}
      />
      <div className="flex min-h-[calc(100dvh-2.75rem)] flex-col overflow-hidden">
        <SplitView
        list={
          <SplitList
            config={config}
            docs={listResult.docs as Record<string, unknown>[]}
            activeId={docIdentifier}
            variant="linear"
          />
        }
        detail={
          <>
            <DetailToolbar
              editHref={editHref('linear', config.slug, docIdentifier)}
              deleteButton={
                <DeleteRecordButton variant="linear" slug={config.slug} identifier={docIdentifier} />
              }
            />
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
    </>
  )
}
