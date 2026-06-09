import type { CollectionBeforeChangeHook } from 'payload'

import { getFirstPhaseId } from '@/lib/spd/phaseUtils'

type ProcessTemplateDoc = {
  id: string | number
  name: string
  version: string
  phases?: unknown
  _status?: 'draft' | 'published' | null
}

export const snapshotOnCreate: CollectionBeforeChangeHook = async ({
  data,
  operation,
  req,
}) => {
  if (operation !== 'create') {
    return data
  }

  let templateId = data?.processTemplate

  if (!templateId) {
    const settings = await req.payload.findGlobal({
      slug: 'spd-settings',
    })

    const defaultTemplate = settings?.defaultTemplate

    if (defaultTemplate) {
      templateId = typeof defaultTemplate === 'object' ? defaultTemplate.id : defaultTemplate
      data.processTemplate = templateId
    }
  }

  if (!templateId) {
    throw new Error('A published process template is required to create an SPD project.')
  }

  const template = (await req.payload.findByID({
    collection: 'spd-process-templates',
    id: templateId,
    depth: 0,
    draft: false,
  })) as ProcessTemplateDoc

  if (template._status !== 'published') {
    throw new Error('Only published process templates can be used for new SPD projects.')
  }

  const phases = structuredClone(template.phases ?? [])

  data.processSnapshot = {
    templateId: String(template.id),
    templateVersion: template.version,
    templateName: template.name,
    phases,
  }

  if (!data.currentPhase) {
    data.currentPhase = getFirstPhaseId(phases as Parameters<typeof getFirstPhaseId>[0])
  }

  return data
}
