import type { CollectionBeforeChangeHook } from 'payload'
import { getRelationshipId } from '../../lib/relationships'

export const inheritCompanyFromLocation: CollectionBeforeChangeHook = async ({
  data,
  operation,
  req,
}) => {
  if (operation !== 'create') return data
  if (getRelationshipId(data?.asset)) return data
  if (data?.company) return data

  const locationId = getRelationshipId(data?.location)
  if (!locationId) return data

  const location = await req.payload.findByID({
    collection: 'locations',
    id: locationId,
    depth: 0,
    req,
  })

  const companyId = getRelationshipId(location.company)
  if (!companyId) return data

  return {
    ...data,
    company: companyId,
  }
}
