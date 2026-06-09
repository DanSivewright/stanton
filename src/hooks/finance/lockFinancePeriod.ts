import type { CollectionBeforeChangeHook } from 'payload'

export const lockFinancePeriod: CollectionBeforeChangeHook = async ({
  data,
  operation,
  originalDoc,
}) => {
  if (data?.status === 'locked' && (operation === 'create' || originalDoc?.status !== 'locked')) {
    data.lockedAt = data.lockedAt ?? new Date().toISOString()
  }

  return data
}
