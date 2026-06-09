import type { PayloadRequest } from 'payload'

type ActivityModule =
  | 'spd'
  | 'manufacturing'
  | 'maintenance'
  | 'finance'
  | 'sales'
  | 'hr'
  | 'platform'

type RecordActivityEventArgs = {
  req: PayloadRequest
  summary: string
  eventType: string
  module: ActivityModule
  collectionSlug: string
  documentId: string
  metadata?: Record<string, unknown>
}

const SKIP_CONTEXT_KEY = 'skipActivityEvent'

export async function recordActivityEvent({
  req,
  summary,
  eventType,
  module,
  collectionSlug,
  documentId,
  metadata,
}: RecordActivityEventArgs): Promise<void> {
  if (req.context?.[SKIP_CONTEXT_KEY]) {
    return
  }

  await req.payload.create({
    collection: 'activity-events',
    data: {
      summary,
      eventType,
      module,
      collectionSlug,
      documentId: String(documentId),
      actor: req.user?.id,
      metadata,
    },
    req,
    overrideAccess: true,
    context: { [SKIP_CONTEXT_KEY]: true },
  })
}
