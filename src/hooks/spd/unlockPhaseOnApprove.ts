import type { CollectionAfterChangeHook } from 'payload'

import type { SpdPhase } from '@/lib/spd/constants'
import { findPhaseIdForGate, getNextPhaseId } from '@/lib/spd/phaseUtils'

type ProcessSnapshot = {
  phases?: SpdPhase[] | null
}

export const unlockPhaseOnApprove: CollectionAfterChangeHook = async ({
  doc,
  operation,
  req,
  context,
}) => {
  if (operation !== 'create' || context.skipPhaseUnlock) {
    return doc
  }

  if (doc.decision !== 'approved') {
    return doc
  }

  const projectId =
    typeof doc.project === 'object' && doc.project !== null ? doc.project.id : doc.project

  if (!projectId) {
    return doc
  }

  const project = await req.payload.findByID({
    collection: 'spd-projects',
    id: projectId,
    depth: 0,
    req,
  })

  const snapshot = project.processSnapshot as ProcessSnapshot | undefined
  const phases = snapshot?.phases

  if (!phases?.length || !doc.gateId) {
    return doc
  }

  const gatePhaseId = findPhaseIdForGate(phases, doc.gateId)

  if (!gatePhaseId || gatePhaseId !== project.currentPhase) {
    return doc
  }

  const nextPhaseId = getNextPhaseId(phases, gatePhaseId)

  if (!nextPhaseId || nextPhaseId === gatePhaseId) {
    return doc
  }

  await req.payload.update({
    collection: 'spd-projects',
    id: projectId,
    data: {
      currentPhase: nextPhaseId,
    },
    context: { skipPhaseUnlock: true },
    req,
  })

  return doc
}
