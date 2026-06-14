import type { CollectionBeforeChangeHook } from 'payload'

export const generateMovementReference: CollectionBeforeChangeHook = async ({
  data,
  operation,
  req,
}) => {
  if (operation !== 'create' || data?.reference) return data

  const { docs } = await req.payload.find({
    collection: 'asset-movements',
    sort: '-createdAt',
    limit: 100,
    overrideAccess: true,
  })

  let max = 0
  for (const doc of docs) {
    const match = typeof doc.reference === 'string' ? doc.reference.match(/^MOV-(\d+)$/) : null
    if (match) max = Math.max(max, Number(match[1]))
  }

  return {
    ...data,
    reference: `MOV-${String(max + 1).padStart(5, '0')}`,
  }
}
