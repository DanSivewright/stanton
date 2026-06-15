import Link from 'next/link'
import { Suspense } from 'react'
import type { MockupCollectionSlug } from '@/lib/mockups/navigation'
import { getNavItem } from '@/lib/mockups/navigation'
import { cellValue, getListColumns } from './collection-fields'
import { PageHeader, PrimaryButton } from './PageHeader'
import { SearchBar } from './SearchBar'
import { detailHref, newHref } from '@/lib/mockups/links'
import * as LinkButton from '@/components/ui/link-button'
import * as Table from '@/components/ui/table'
import { PaginationHint } from '@/components/mockups/shared/PaginationHint'

type CollectionListViewProps = {
  slug: MockupCollectionSlug
  docs: Record<string, unknown>[]
  query?: string
  totalDocs?: number
}

export function CollectionListView({ slug, docs, query, totalDocs }: CollectionListViewProps) {
  const nav = getNavItem(slug)
  const columns = getListColumns(slug)

  const filtered = query
    ? docs.filter((doc) => {
        const q = query.toLowerCase()
        return columns.some((col) => cellValue(slug, doc, col.key).toLowerCase().includes(q))
      })
    : docs

  return (
    <div>
      <PageHeader
        title={nav?.item.label ?? slug}
        description={nav?.item.description}
        action={<PrimaryButton href={newHref('elevenlabs', slug)}>+ Add new</PrimaryButton>}
      >
        <Suspense fallback={null}>
          <SearchBar placeholder={`Search ${nav?.item.label?.toLowerCase() ?? 'items'}…`} />
        </Suspense>
      </PageHeader>

      {filtered.length === 0 ? (
        <div className="rounded-xl border border-dashed border-stroke-soft-200 bg-bg-weak-50 px-6 py-12 text-center">
          <p className="text-paragraph-sm text-text-sub-600">No items match your search.</p>
        </div>
      ) : (
        <Table.Root className="rounded-xl ring-1 ring-inset ring-stroke-soft-200">
          <Table.Header>
            <tr>
              {columns.map((col) => (
                <Table.Head key={col.key}>{col.label}</Table.Head>
              ))}
              <Table.Head className="w-24 text-right">Actions</Table.Head>
            </tr>
          </Table.Header>
          <Table.Body>
            {filtered.map((doc) => (
              <Table.Row key={String(doc.id)}>
                {columns.map((col, i) => (
                  <Table.Cell key={col.key}>
                    {i === 0 ? (
                      <LinkButton.Root variant="black" size="medium" asChild>
                        <Link href={detailHref('elevenlabs', slug, doc)}>
                          {cellValue(slug, doc, col.key)}
                        </Link>
                      </LinkButton.Root>
                    ) : (
                      <span className="text-paragraph-sm text-text-sub-600">
                        {cellValue(slug, doc, col.key)}
                      </span>
                    )}
                  </Table.Cell>
                ))}
                <Table.Cell className="text-right">
                  <LinkButton.Root variant="primary" size="medium" asChild>
                    <Link href={detailHref('elevenlabs', slug, doc)}>View</Link>
                  </LinkButton.Root>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      )}
      {totalDocs != null ? <PaginationHint totalDocs={totalDocs} limit={100} /> : null}
    </div>
  )
}
