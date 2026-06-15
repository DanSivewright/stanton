import Link from 'next/link'
import type { MockupCollectionSlug, MockupVariantSlug } from '@/lib/mockups/navigation'
import { detailHref } from '@/lib/mockups/links'
import { relId, relLabel } from '@/lib/mockups/helpers'

type RelationLinkProps = {
  variant: MockupVariantSlug
  slug: MockupCollectionSlug
  value: unknown
  fallback?: string
  style?: React.CSSProperties
}

export function RelationLink({
  variant,
  slug,
  value,
  fallback = '—',
  style,
}: RelationLinkProps) {
  const label = relLabel(value as Parameters<typeof relLabel>[0], fallback)
  const id = relId(value as Parameters<typeof relId>[0])

  if (!id || label === fallback) {
    return <span style={style}>{label}</span>
  }

  return (
    <Link
      href={detailHref(variant, slug, id)}
      style={{
        color: 'inherit',
        textDecoration: 'underline',
        textUnderlineOffset: 2,
        ...style,
      }}
    >
      {label}
    </Link>
  )
}
