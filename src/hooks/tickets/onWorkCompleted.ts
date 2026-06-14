import type { CollectionBeforeChangeHook } from 'payload'
import { getRelationshipId } from '../../lib/relationships'

export const onWorkCompleted: CollectionBeforeChangeHook = async ({
  data,
  originalDoc,
  req,
}) => {
  const prevStatus = originalDoc?.status
  const newStatus = data?.status ?? prevStatus

  if (newStatus !== 'completed' || prevStatus === 'completed') return data

  const activity = [...(data?.activity ?? originalDoc?.activity ?? [])]
  const reporterId = getRelationshipId(data?.reportedBy ?? originalDoc?.reportedBy)

  activity.push({
    kind: 'completion',
    author: reporterId,
    body: 'Work marked as completed.',
    createdAt: new Date().toISOString(),
  })

  return {
    ...data,
    reviewStatus: 'pending',
    activity,
  }
}
