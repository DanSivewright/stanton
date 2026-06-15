import Link from 'next/link'
import { notFound } from 'next/navigation'
import { RiArrowLeftLine } from '@remixicon/react'
import type { MockupCollectionSlug, MockupVariantSlug } from '@/lib/mockups/navigation'
import { getNavItem } from '@/lib/mockups/navigation'
import { docToFormValues, getEditableFields } from '@/lib/mockups/form-config'
import { findByIdentifier } from '@/lib/mockups/queries'
import { loadRelationOptions } from '@/lib/mockups/relations'
import { getDocTitle } from '@/lib/mockups/identifiers'
import { detailHref, listHref } from '@/lib/mockups/links'
import { RecordForm } from './RecordForm'
import * as LinkButton from '@/components/ui/link-button'

type MockupFormPageProps = {
  variant: MockupVariantSlug
  slug: MockupCollectionSlug
  mode: 'create' | 'edit'
  identifier?: string
  shell: (children: React.ReactNode, title: string, subtitle?: string) => React.ReactNode
}

export async function MockupFormPage({
  variant,
  slug,
  mode,
  identifier,
  shell,
}: MockupFormPageProps) {
  const nav = getNavItem(slug)
  if (!nav) notFound()

  let initialValues: Record<string, unknown> = {}
  if (mode === 'edit' && identifier) {
    const doc = await findByIdentifier(slug, identifier)
    if (!doc) notFound()
    initialValues = docToFormValues(doc as Record<string, unknown>, slug)
  }

  const [fields, relationOptions] = await Promise.all([
    Promise.resolve(getEditableFields(slug, mode)),
    loadRelationOptions(slug),
  ])

  const title =
    mode === 'create'
      ? `New ${nav.item.label.replace(/s$/, '')}`
      : `Edit ${getDocTitle(initialValues, slug)}`

  const backHref =
    mode === 'edit' && identifier
      ? detailHref(variant, slug, identifier)
      : listHref(variant, slug)

  const isSana = variant === 'sana'

  return shell(
    <>
      <div className={isSana ? 'mb-6' : undefined} style={isSana ? undefined : { marginBottom: 24 }}>
        {isSana ? (
          <LinkButton.Root variant="gray" size="medium" asChild className="mb-3 inline-flex">
            <Link href={backHref}>
              <LinkButton.Icon as={RiArrowLeftLine} />
              Back
            </Link>
          </LinkButton.Root>
        ) : (
          <Link
            href={backHref}
            style={{ fontSize: 13, color: '#64748b', textDecoration: 'none' }}
          >
            ← Back
          </Link>
        )}
        <h1
          className={isSana ? 'text-title-h4 font-bold text-text-strong-950' : undefined}
          style={isSana ? undefined : { margin: '12px 0 0', fontSize: 24, fontWeight: 700 }}
        >
          {title}
        </h1>
      </div>
      <RecordForm
        variant={variant}
        slug={slug}
        mode={mode}
        fields={fields}
        initialValues={initialValues}
        relationOptions={relationOptions}
        identifier={identifier}
      />
    </>,
    nav.item.label,
    mode === 'create' ? 'Create new record' : 'Edit record',
  )
}
