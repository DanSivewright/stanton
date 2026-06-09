import type { SpdPhase } from './constants'
import { findPhaseIdForGate } from './phaseUtils'

export type ChecklistCompletionEntry = {
  stageId?: string | null
  itemIndex?: number | null
  done?: boolean | null
}

type StageWithChecklist = {
  stageId: string
  checklistItems?: Array<{ item?: string | null }> | null
}

export function getStagePhaseId(
  phases: SpdPhase[] | null | undefined,
  stageId: string,
): string | undefined {
  if (!phases?.length) return undefined

  for (const phase of phases) {
    for (const stage of phase.stages ?? []) {
      if (stage.stageId === stageId) {
        return phase.phaseId
      }
    }
  }

  return undefined
}

export function getStagesForPhase(
  phases: SpdPhase[] | null | undefined,
  phaseId: string,
): StageWithChecklist[] {
  if (!phases?.length) return []

  const phase = phases.find((p) => p.phaseId === phaseId)
  return (phase?.stages ?? []) as StageWithChecklist[]
}

export function getIncompleteChecklistItems(
  phases: SpdPhase[] | null | undefined,
  phaseId: string,
  completion: ChecklistCompletionEntry[] | null | undefined,
): Array<{ stageId: string; itemIndex: number; item: string }> {
  const stages = getStagesForPhase(phases, phaseId)
  const incomplete: Array<{ stageId: string; itemIndex: number; item: string }> = []

  for (const stage of stages) {
    const items = stage.checklistItems ?? []
    for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
      const entry = completion?.find(
        (c) => c.stageId === stage.stageId && c.itemIndex === itemIndex,
      )
      if (!entry?.done) {
        incomplete.push({
          stageId: stage.stageId,
          itemIndex,
          item: items[itemIndex]?.item ?? `Item ${itemIndex + 1}`,
        })
      }
    }
  }

  return incomplete
}

export function getGateForPhase(
  phases: SpdPhase[] | null | undefined,
  phaseId: string,
): { gateId?: string | null; requiredRoles?: string[] | null } | undefined {
  if (!phases?.length) return undefined

  for (const phase of phases) {
    if (phase.phaseId !== phaseId) continue

    for (const stage of phase.stages ?? []) {
      if (stage.gate?.gateId) {
        return stage.gate as { gateId?: string | null; requiredRoles?: string[] | null }
      }
    }
  }

  return undefined
}

export function gateBelongsToPhase(
  phases: SpdPhase[] | null | undefined,
  gateId: string,
  phaseId: string,
): boolean {
  return findPhaseIdForGate(phases, gateId) === phaseId
}
