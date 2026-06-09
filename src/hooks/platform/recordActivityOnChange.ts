import type { CollectionAfterChangeHook } from 'payload'

import { recordActivityEvent } from '@/lib/platform/recordActivityEvent'

function relationId(value: unknown): string | undefined {
  if (!value) return undefined
  if (typeof value === 'object' && value !== null && 'id' in value) {
    return String((value as { id: string }).id)
  }
  return String(value)
}

export const activityOnGateSignOff: CollectionAfterChangeHook = async ({
  doc,
  operation,
  req,
}) => {
  if (operation !== 'create') return doc

  const decision = doc.decision === 'approved' ? 'approved' : 'rejected'
  const projectId = relationId(doc.project)

  await recordActivityEvent({
    req,
    summary: `Gate ${doc.gateId} ${decision}`,
    eventType: decision === 'approved' ? 'gate-approved' : 'gate-rejected',
    module: 'spd',
    collectionSlug: 'spd-gate-sign-offs',
    documentId: doc.id,
    metadata: {
      gateId: doc.gateId,
      decision: doc.decision,
      projectId,
      role: doc.role,
    },
  })

  return doc
}

export const activityOnSnapshotSubmit: CollectionAfterChangeHook = async ({
  doc,
  operation,
  previousDoc,
  req,
}) => {
  const justSubmitted =
    doc.status === 'submitted' &&
    (operation === 'create' || previousDoc?.status === 'draft')

  if (!justSubmitted) return doc

  await recordActivityEvent({
    req,
    summary: `Production snapshot submitted (${doc.unitsProduced ?? 0} units)`,
    eventType: 'snapshot-submitted',
    module: 'manufacturing',
    collectionSlug: 'production-snapshots',
    documentId: doc.id,
    metadata: {
      machineId: relationId(doc.machine),
      manufacturingOrderId: relationId(doc.manufacturingOrder),
      unitsProduced: doc.unitsProduced,
      rejects: doc.rejects,
      stoppage: doc.stoppage,
    },
  })

  return doc
}

export const activityOnMaintenanceComplete: CollectionAfterChangeHook = async ({
  doc,
  operation,
  previousDoc,
  req,
}) => {
  const justCompleted =
    doc.status === 'completed' &&
    (operation === 'create' || previousDoc?.status !== 'completed')

  if (!justCompleted) return doc

  await recordActivityEvent({
    req,
    summary: `Maintenance job completed: ${doc.title}`,
    eventType: 'maintenance-completed',
    module: 'maintenance',
    collectionSlug: 'maintenance-jobs',
    documentId: doc.id,
    metadata: {
      machineId: relationId(doc.machine),
      mouldId: relationId(doc.mould),
      downtimeMinutes: doc.downtimeMinutes,
      trigger: doc.trigger,
    },
  })

  return doc
}

export const activityOnPeriodLock: CollectionAfterChangeHook = async ({
  doc,
  operation,
  previousDoc,
  req,
}) => {
  const justLocked =
    doc.status === 'locked' &&
    (operation === 'create' || previousDoc?.status !== 'locked')

  if (!justLocked) return doc

  await recordActivityEvent({
    req,
    summary: `Finance period locked: ${doc.label}`,
    eventType: 'period-locked',
    module: 'finance',
    collectionSlug: 'finance-reporting-periods',
    documentId: doc.id,
    metadata: {
      label: doc.label,
      companyId: relationId(doc.company),
      periodStart: doc.periodStart,
      periodEnd: doc.periodEnd,
    },
  })

  return doc
}

export const activityOnPerformanceContractApproved: CollectionAfterChangeHook = async ({
  doc,
  operation,
  previousDoc,
  req,
}) => {
  const justApproved =
    doc.status === 'approved' &&
    (operation === 'create' || previousDoc?.status !== 'approved')

  if (!justApproved) return doc

  await recordActivityEvent({
    req,
    summary: `Performance contract approved for ${doc.periodLabel}`,
    eventType: 'contract-approved',
    module: 'hr',
    collectionSlug: 'performance-contracts',
    documentId: doc.id,
    metadata: {
      employeeId: relationId(doc.employee),
      periodLabel: doc.periodLabel,
    },
  })

  return doc
}
