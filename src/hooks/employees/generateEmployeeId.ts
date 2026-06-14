import type { CollectionBeforeChangeHook } from 'payload'

export const generateEmployeeId: CollectionBeforeChangeHook = async ({
  data,
  operation,
  req,
}) => {
  if (operation !== 'create' || data?.employeeId) return data

  const { docs } = await req.payload.find({
    collection: 'employees',
    sort: '-createdAt',
    limit: 100,
    overrideAccess: true,
  })

  let max = 0
  for (const doc of docs) {
    const match = typeof doc.employeeId === 'string' ? doc.employeeId.match(/^EMP-(\d+)$/) : null
    if (match) max = Math.max(max, Number(match[1]))
  }

  return {
    ...data,
    employeeId: `EMP-${String(max + 1).padStart(5, '0')}`,
  }
}
