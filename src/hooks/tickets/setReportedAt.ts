import type { CollectionBeforeChangeHook } from 'payload'

export const setReportedAt: CollectionBeforeChangeHook = async ({ data, operation }) => {
  if (operation !== 'create' || data?.reportedAt) return data

  return {
    ...data,
    reportedAt: new Date().toISOString(),
  }
}
