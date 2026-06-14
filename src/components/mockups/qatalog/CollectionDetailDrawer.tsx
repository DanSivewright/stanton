'use client'

import type { MockupCollectionSlug } from '@/lib/mockups/navigation'
import {
  getDetailSubtitle,
  getDetailTitle,
  renderDetailFields,
  type Doc,
} from './collection-config'
import { DetailDrawer, FieldRow, QButton } from './ui'

export function CollectionDetailDrawer({
  slug,
  doc,
  open,
  onClose,
}: {
  slug: MockupCollectionSlug
  doc: Doc | null
  open: boolean
  onClose: () => void
}) {
  if (!doc) return null

  const fields = renderDetailFields(slug, doc)

  return (
    <DetailDrawer
      open={open}
      onClose={onClose}
      title={getDetailTitle(slug, doc)}
      subtitle={getDetailSubtitle(slug, doc)}
    >
      {fields.map((field) => (
        <FieldRow key={field.label} label={field.label} value={field.value} />
      ))}
      <div style={{ marginTop: 32, paddingTop: 24, borderTop: '1px solid #e8e8e8', display: 'flex', gap: 12 }}>
        <QButton variant="primary">Edit record</QButton>
        <QButton variant="ghost" onClick={onClose}>
          Close
        </QButton>
      </div>
    </DetailDrawer>
  )
}
