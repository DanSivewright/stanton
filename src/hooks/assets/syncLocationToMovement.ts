import type { CollectionAfterChangeHook } from 'payload'
import { getRelationshipId } from '../../lib/relationships'
import { SKIP_MOVEMENT_SYNC } from '../../lib/constants/sync-context'

export const syncLocationToMovement: CollectionAfterChangeHook = async ({
  doc,
  previousDoc,
  req,
  context,
  operation,
}) => {
  if (context[SKIP_MOVEMENT_SYNC]) return
  if (operation !== 'update') return

  const prevLocationId = getRelationshipId(previousDoc?.location)
  const newLocationId = getRelationshipId(doc.location)

  if (!newLocationId || prevLocationId === newLocationId) return

  const companyId = getRelationshipId(doc.company)
  if (!companyId) return

  await req.payload.create({
    collection: 'asset-movements',
    data: {
      asset: doc.id,
      company: companyId,
      fromLocation: prevLocationId ?? undefined,
      toLocation: newLocationId,
      movedAt: new Date().toISOString(),
      reason: 'Location updated via asset edit',
    },
    context: { ...context, [SKIP_MOVEMENT_SYNC]: true },
    req,
  })
}
