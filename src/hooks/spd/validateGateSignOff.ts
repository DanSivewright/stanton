import type { CollectionBeforeChangeHook } from 'payload'

import {
  gateBelongsToPhase,
  getGateForPhase,
  getIncompleteChecklistItems,
  type ChecklistCompletionEntry,
} from '@/lib/spd/checklistUtils'
import type { SpdPhase } from '@/lib/spd/constants'

type ProcessSnapshot = {
  phases?: SpdPhase[] | null
}

export const validateGateSignOff: CollectionBeforeChangeHook = async ({
  data,
  operation,
  req,
}) => {
  if (operation !== 'create' || data?.decision !== 'approved') {
    return data
  }

  const projectId =
    typeof data.project === 'object' && data.project !== null
      ? data.project.id
      : data.project

  if (!projectId || !data.gateId) {
    throw new Error('Gate sign-off requires a project and gate ID.')
  }

  const project = await req.payload.findByID({
    collection: 'spd-projects',
    id: projectId,
    depth: 0,
    req,
  })

  const snapshot = project.processSnapshot as ProcessSnapshot | undefined
  const phases = snapshot?.phases
  const currentPhase = project.currentPhase

  if (!currentPhase) {
    throw new Error('Project has no active phase.')
  }

  if (!gateBelongsToPhase(phases, data.gateId, currentPhase)) {
    throw new Error(
      `Gate "${data.gateId}" is not the checkpoint for the current phase (${currentPhase}).`,
    )
  }

  const existingApproval = await req.payload.find({
    collection: 'spd-gate-sign-offs',
    where: {
      and: [
        { project: { equals: projectId } },
        { gateId: { equals: data.gateId } },
        { decision: { equals: 'approved' } },
      ],
    },
    limit: 1,
    req,
  })

  if (existingApproval.totalDocs > 0) {
    throw new Error(`Gate "${data.gateId}" already has an approved sign-off.`)
  }

  const incomplete = getIncompleteChecklistItems(
    phases,
    currentPhase,
    project.checklistCompletion as ChecklistCompletionEntry[] | null | undefined,
  )

  if (incomplete.length > 0) {
    const summary = incomplete
      .slice(0, 3)
      .map((item) => `${item.stageId}[${item.itemIndex}]`)
      .join(', ')
    throw new Error(
      `Cannot approve gate sign-off: ${incomplete.length} checklist item(s) incomplete in ${currentPhase} (${summary}${incomplete.length > 3 ? '…' : ''}).`,
    )
  }

  const gate = getGateForPhase(phases, currentPhase)
  const requiredRoles = gate?.requiredRoles ?? []

  if (requiredRoles.length > 0 && data.role && !requiredRoles.includes(data.role)) {
    throw new Error(
      `Approver role "${data.role}" is not authorized for this gate. Required: ${requiredRoles.join(', ')}.`,
    )
  }

  return data
}
