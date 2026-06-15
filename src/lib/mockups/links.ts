import type { MockupCollectionSlug, MockupVariantSlug } from './navigation'
import { getDocIdentifier } from './identifiers'

function basePath(variant: MockupVariantSlug, slug: MockupCollectionSlug): string {
  if (variant === 'qatalog') return `/mockups/qatalog/${slug}`
  return `/mockups/${variant}/${slug}`
}

export function listHref(variant: MockupVariantSlug, slug: MockupCollectionSlug): string {
  return basePath(variant, slug)
}

export function detailHref(
  variant: MockupVariantSlug,
  slug: MockupCollectionSlug,
  docOrId: Record<string, unknown> | string,
): string {
  const identifier =
    typeof docOrId === 'string' ? docOrId : getDocIdentifier(docOrId, slug)
  return `${basePath(variant, slug)}/${encodeURIComponent(identifier)}`
}

export function editHref(
  variant: MockupVariantSlug,
  slug: MockupCollectionSlug,
  docOrId: Record<string, unknown> | string,
): string {
  return `${detailHref(variant, slug, docOrId)}/edit`
}

export function newHref(variant: MockupVariantSlug, slug: MockupCollectionSlug): string {
  return `${basePath(variant, slug)}/new`
}
