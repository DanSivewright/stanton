import { getPayload } from 'payload'
import config from '@payload-config'
import type { MockupCollectionSlug } from './navigation'
import { FORM_CONFIG } from './form-config'
import { relLabel } from './helpers'

export type RelationOption = { value: string; label: string }

export async function loadRelationOptions(
  slug: MockupCollectionSlug,
): Promise<Record<string, RelationOption[]>> {
  const payload = await getPayload({ config })
  const formConfig = FORM_CONFIG[slug]
  const relationFields = formConfig.fields.filter((f) => f.type === 'relationship' && f.relationTo)

  const entries = await Promise.all(
    relationFields.map(async (field) => {
      const targetSlug = field.relationTo!
      const result = await payload.find({
        collection: targetSlug,
        limit: 500,
        sort: targetSlug === 'employees' ? 'fullName' : 'name',
        depth: 0,
        overrideAccess: true,
      })

      const options: RelationOption[] = result.docs.map((doc) => ({
        value: String(doc.id),
        label: relLabel(doc as Parameters<typeof relLabel>[0]),
      }))

      return [field.name, options] as const
    }),
  )

  return Object.fromEntries(entries)
}
