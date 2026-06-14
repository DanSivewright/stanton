import type { CollectionBeforeChangeHook } from 'payload'

export const generateTicketNumber: CollectionBeforeChangeHook = async ({
  data,
  operation,
  req,
}) => {
  if (operation !== 'create' || data?.ticketNumber) return data

  const { totalDocs } = await req.payload.count({
    collection: 'tickets',
    req,
  })

  return {
    ...data,
    ticketNumber: `TKT-${String(totalDocs + 1).padStart(5, '0')}`,
  }
}
