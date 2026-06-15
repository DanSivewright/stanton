import Link from 'next/link'
import { notFound } from 'next/navigation'
import { RiArrowLeftSLine } from '@remixicon/react'
import { QatalogSectionTabs } from '@/components/mockups/qatalog/QatalogSectionTabs'
import { QatalogShell } from '@/components/mockups/qatalog/QatalogShell'
import { MockupFormPage } from '@/components/mockups/shared/MockupFormPage'
import { getAllCollectionSlugs, type MockupCollectionSlug } from '@/lib/mockups/navigation'
import { detailHref, listHref } from '@/lib/mockups/links'
import * as Breadcrumb from '@/components/ui/breadcrumb'

type PageProps = {
  params: Promise<{ slug: string; identifier: string }>
}

export default async function QatalogEditPage({ params }: PageProps) {
  const { slug, identifier } = await params
  if (!getAllCollectionSlugs().includes(slug as MockupCollectionSlug)) notFound()

  const collectionSlug = slug as MockupCollectionSlug

  return (
    <QatalogShell>
      <QatalogSectionTabs activeSlug={collectionSlug} />
      <div className="px-12 pb-12 pt-6">
        <MockupFormPage
          variant="qatalog"
          slug={collectionSlug}
          mode="edit"
          identifier={identifier}
          shell={(children, title, subtitle) => (
            <>
              <Breadcrumb.Root className="mb-6">
                <Breadcrumb.Item asChild>
                  <Link
                    href={detailHref('qatalog', collectionSlug, identifier)}
                    className="inline-flex items-center gap-1"
                  >
                    <RiArrowLeftSLine className="size-5" />
                    Back
                  </Link>
                </Breadcrumb.Item>
              </Breadcrumb.Root>
              <h1 className="text-title-h4 tracking-tight text-text-strong-950">{title}</h1>
              {subtitle ? (
                <p className="mt-2 text-paragraph-md text-text-sub-600">{subtitle}</p>
              ) : null}
              <div className="mt-8">{children}</div>
            </>
          )}
        />
      </div>
    </QatalogShell>
  )
}
