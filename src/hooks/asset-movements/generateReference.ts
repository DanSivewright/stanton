import type { CollectionBeforeChangeHook } from 'payload'

export const generateMovementReference: CollectionBeforeChangeHook = async ({
  data,
  operation,
  req,
}) => {
  if (operation !== 'create' || data?.reference) return data

  const { totalDocs } = await req.payload.count({
    collection: 'asset-movements',
    req,
  })

  return {
    ...data,
    reference: `MOV-${String(totalDocs + 1).padStart(5, '0')}`,
  }
}
