import type { SpdPhase } from './constants'

export function getFirstPhaseId(phases: SpdPhase[] | null | undefined): string | undefined {
  if (!phases?.length) return undefined
  const sorted = [...phases].sort((a, b) => a.order - b.order)
  return sorted[0]?.phaseId
}

export function findPhaseIdForGate(
  phases: SpdPhase[] | null | undefined,
  gateId: string,
): string | undefined {
  if (!phases?.length) return undefined

  for (const phase of phases) {
    for (const stage of phase.stages ?? []) {
      if (stage.gate?.gateId === gateId) {
        return phase.phaseId
      }
    }
  }

  return undefined
}

export function getNextPhaseId(
  phases: SpdPhase[] | null | undefined,
  currentPhaseId: string,
): string | undefined {
  if (!phases?.length) return undefined

  const sorted = [...phases].sort((a, b) => a.order - b.order)
  const currentIndex = sorted.findIndex((phase) => phase.phaseId === currentPhaseId)

  if (currentIndex === -1) return undefined

  return sorted[currentIndex + 1]?.phaseId
}
