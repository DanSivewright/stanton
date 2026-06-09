import type { CollectionAfterChangeHook } from 'payload'

export const flagMaintenanceOnShotThreshold: CollectionAfterChangeHook = async ({
  doc,
  operation,
  req,
  previousDoc,
}) => {
  const justSubmitted =
    doc.status === 'submitted' &&
    (operation === 'create' || previousDoc?.status === 'draft')

  if (!justSubmitted) {
    return doc
  }

  const moId =
    typeof doc.manufacturingOrder === 'object'
      ? doc.manufacturingOrder?.id
      : doc.manufacturingOrder

  if (!moId) return doc

  const mo = await req.payload.findByID({
    collection: 'manufacturing-orders',
    id: moId,
    depth: 0,
    req,
  })

  const mouldId = typeof mo.mould === 'object' ? mo.mould?.id : mo.mould
  const machineId = typeof mo.machine === 'object' ? mo.machine?.id : mo.machine

  if (!mouldId || !machineId) return doc

  const [mould, settings] = await Promise.all([
    req.payload.findByID({ collection: 'moulds', id: mouldId, depth: 0, req }),
    req.payload.findGlobal({ slug: 'maintenance-settings' }),
  ])

  const shotCount = mould.shotCount ?? 0
  const warningThreshold = settings?.warningShotCount ?? 15000
  const serviceThreshold = settings?.serviceIntervalShots ?? 20000

  if (shotCount >= warningThreshold) {
    const chain = settings?.notificationChain?.trim()
    console.log(
      `[maintenance] Mould ${mould.code ?? mouldId} shot count ${shotCount} reached warning threshold (${warningThreshold})${
        chain ? ` — would notify: ${chain}` : ''
      }`,
    )
  }

  if (shotCount < serviceThreshold) {
    return doc
  }

  const existingJob = await req.payload.find({
    collection: 'maintenance-jobs',
    where: {
      and: [
        { machine: { equals: machineId } },
        { mould: { equals: mouldId } },
        { trigger: { equals: 'shot_count' } },
        { status: { in: ['open', 'in_progress'] } },
      ],
    },
    limit: 1,
    req,
  })

  if (existingJob.totalDocs > 0) {
    return doc
  }

  await req.payload.create({
    collection: 'maintenance-jobs',
    data: {
      title: `Shot-count service — ${mould.name ?? mould.code ?? mouldId}`,
      machine: machineId,
      mould: mouldId,
      status: 'open',
      trigger: 'shot_count',
      notes: `Auto-flagged at ${shotCount} shots (service interval: ${serviceThreshold}).`,
    },
    req,
  })

  console.log(
    `[maintenance] Created shot-count maintenance job for mould ${mould.code ?? mouldId} at ${shotCount} shots`,
  )

  return doc
}
