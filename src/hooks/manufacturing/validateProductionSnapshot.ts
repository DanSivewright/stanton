import type { CollectionBeforeChangeHook } from 'payload'

export const validateProductionSnapshot: CollectionBeforeChangeHook = async ({
  data,
  operation,
  originalDoc,
  req,
}) => {
  if (operation === 'update' && originalDoc?.status === 'submitted') {
    throw new Error('Submitted production snapshots cannot be edited.')
  }

  if (data?.employee && !data.employeeId) {
    const employeeId =
      typeof data.employee === 'object' ? data.employee.id : data.employee

    const employee = await req.payload.findByID({
      collection: 'employees',
      id: employeeId,
      depth: 0,
      req,
    })

    data.employeeId = employee.employeeId
  }

  if (data?.status === 'submitted' && operation === 'create') {
    await incrementMouldShotCount(data, req)
  }

  if (data?.status === 'submitted' && operation === 'update' && originalDoc?.status === 'draft') {
    await incrementMouldShotCount(data, req)
  }

  return data
}

async function incrementMouldShotCount(
  data: Record<string, unknown>,
  req: Parameters<CollectionBeforeChangeHook>[0]['req'],
): Promise<void> {
  const moId =
    typeof data.manufacturingOrder === 'object'
      ? (data.manufacturingOrder as { id: string }).id
      : data.manufacturingOrder

  if (!moId) return

  const mo = await req.payload.findByID({
    collection: 'manufacturing-orders',
    id: moId as string,
    depth: 0,
    req,
  })

  const mouldId = typeof mo.mould === 'object' ? mo.mould?.id : mo.mould
  if (!mouldId) return

  const units = Number(data.unitsProduced ?? 0)
  if (units <= 0) return

  const mould = await req.payload.findByID({
    collection: 'moulds',
    id: mouldId,
    depth: 0,
    req,
  })

  await req.payload.update({
    collection: 'moulds',
    id: mouldId,
    data: { shotCount: (mould.shotCount ?? 0) + units },
    req,
  })
}
