import type { CollectionBeforeChangeHook } from 'payload'

import { getStagePhaseId, type ChecklistCompletionEntry } from '@/lib/spd/checklistUtils'
import type { SpdPhase } from '@/lib/spd/constants'

type ProcessSnapshot = {
  phases?: SpdPhase[] | null
}

function checklistChanged(
  previous: ChecklistCompletionEntry[] | null | undefined,
  next: ChecklistCompletionEntry[] | null | undefined,
): boolean {
  if (!next) return false
  if (!previous?.length && !next.length) return false

  const prevMap = new Map(
    (previous ?? []).map((entry) => [`${entry.stageId}:${entry.itemIndex}`, entry.done]),
  )

  for (const entry of next) {
    const key = `${entry.stageId}:${entry.itemIndex}`
    if (prevMap.get(key) !== entry.done) {
      return true
    }
    if (!prevMap.has(key) && entry.done) {
      return true
    }
  }

  return next.length !== (previous?.length ?? 0)
}

export const lockPhaseEdits: CollectionBeforeChangeHook = async ({
  data,
  operation,
  originalDoc,
}) => {
  if (operation !== 'update' || !originalDoc?.currentPhase) {
    return data
  }

  const nextCompletion = data?.checklistCompletion as ChecklistCompletionEntry[] | undefined
  const prevCompletion = originalDoc.checklistCompletion as
    | ChecklistCompletionEntry[]
    | null
    | undefined

  if (!checklistChanged(prevCompletion, nextCompletion)) {
    return data
  }

  const snapshot = (originalDoc.processSnapshot ?? data?.processSnapshot) as
    | ProcessSnapshot
    | undefined
  const phases = snapshot?.phases
  const currentPhase = originalDoc.currentPhase

  for (const entry of nextCompletion ?? []) {
    if (!entry.stageId) continue

    const stagePhase = getStagePhaseId(phases, entry.stageId)
    if (stagePhase && stagePhase !== currentPhase) {
      throw new Error(
        `Checklist edits are locked for phase "${stagePhase}". Active phase is "${currentPhase}" (gate pending).`,
      )
    }
  }

  return data
}
