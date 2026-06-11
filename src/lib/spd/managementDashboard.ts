import { getGateForPhase } from '@/lib/spd/checklistUtils'
import type { SpdPhase } from '@/lib/spd/constants'

type ProcessSnapshot = {
  phases?: SpdPhase[] | null
}

export type SpdProjectRow = {
  id: string | number
  name: string
  customerName: string
  currentPhaseId: string
  currentPhaseLabel: string
  onTrack: boolean
  gatePending: boolean
  gateLabel: string | null
  lastSignOffDate: string | null
  isActive: boolean
}

export type SpdGateSignOffSummary = {
  projectId: string | number
  gateId: string
  decision: string
  createdAt: string
}

export function isActiveProject(actualEndDate?: string | null): boolean {
  return !actualEndDate
}

export function getPhaseLabel(
  phases: SpdPhase[] | null | undefined,
  phaseId: string | null | undefined,
): string {
  if (!phaseId) return '—'
  const phase = phases?.find((entry) => entry.phaseId === phaseId)
  return phase?.name ?? phaseId
}

export function isGatePendingForProject(
  phases: SpdPhase[] | null | undefined,
  currentPhase: string | null | undefined,
  approvedGateIds: Set<string>,
): { pending: boolean; gateId: string | null; gateName: string | null } {
  if (!currentPhase) {
    return { pending: false, gateId: null, gateName: null }
  }

  const gate = getGateForPhase(phases, currentPhase)
  const gateId = gate?.gateId ?? null

  if (!gateId) {
    return { pending: false, gateId: null, gateName: null }
  }

  const gateName =
    gate && 'name' in gate && typeof gate.name === 'string' ? gate.name : gateId

  return {
    pending: !approvedGateIds.has(gateId),
    gateId,
    gateName,
  }
}

export function getLastSignOffDate(
  signOffs: SpdGateSignOffSummary[],
): string | null {
  if (signOffs.length === 0) return null

  const sorted = [...signOffs].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )

  return sorted[0]?.createdAt ?? null
}

export function buildPhasePipeline(
  projects: Array<{ currentPhase?: string | null; processSnapshot?: ProcessSnapshot | null }>,
): Array<{ phaseId: string; label: string; count: number }> {
  const counts = new Map<string, number>()
  const labels = new Map<string, string>()

  for (const project of projects) {
    const phaseId = project.currentPhase ?? 'unknown'
    counts.set(phaseId, (counts.get(phaseId) ?? 0) + 1)

    if (!labels.has(phaseId)) {
      labels.set(
        phaseId,
        getPhaseLabel(project.processSnapshot?.phases, phaseId),
      )
    }
  }

  return [...counts.entries()]
    .map(([phaseId, count]) => ({
      phaseId,
      label: labels.get(phaseId) ?? phaseId,
      count,
    }))
    .sort((a, b) => a.phaseId.localeCompare(b.phaseId))
}
