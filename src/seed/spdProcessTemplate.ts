import type { Payload } from 'payload'

import {
  SYNTHETIC_TEMPLATE_NAME,
  SYNTHETIC_TEMPLATE_VERSION,
  syntheticSpdPhases,
} from './spdSyntheticTemplate.data'

const DEMO_PROJECT_NAME = 'SPD Demo — Sample Opportunity'
const DEMO_CUSTOMER_CODE = 'SPD-DEMO'

export async function seedSpdProcessTemplate(payload: Payload): Promise<void> {
  const existing = await payload.find({
    collection: 'spd-process-templates',
    where: { version: { equals: SYNTHETIC_TEMPLATE_VERSION } },
    limit: 1,
  })

  let templateId: string

  if (existing.totalDocs > 0) {
    templateId = String(existing.docs[0]!.id)
  } else {
    const created = await payload.create({
      collection: 'spd-process-templates',
      draft: false,
      data: {
        name: SYNTHETIC_TEMPLATE_NAME,
        version: SYNTHETIC_TEMPLATE_VERSION,
        effectiveDate: new Date().toISOString(),
        _status: 'published',
        phases: syntheticSpdPhases,
      },
    })
    templateId = String(created.id)
  }

  const settings = await payload.findGlobal({ slug: 'spd-settings' })
  const currentDefault =
    settings?.defaultTemplate &&
    (typeof settings.defaultTemplate === 'object'
      ? settings.defaultTemplate.id
      : settings.defaultTemplate)

  if (!currentDefault) {
    await payload.updateGlobal({
      slug: 'spd-settings',
      data: { defaultTemplate: templateId },
    })
  }

  await seedDemoProject(payload, templateId)
}

async function seedDemoProject(payload: Payload, templateId: string): Promise<void> {
  const existingProject = await payload.find({
    collection: 'spd-projects',
    where: { name: { equals: DEMO_PROJECT_NAME } },
    limit: 1,
  })

  if (existingProject.totalDocs > 0) {
    await seedDemoChecklistCompletion(payload, String(existingProject.docs[0]!.id))
    return
  }

  const companies = await payload.find({
    collection: 'companies',
    where: { code: { equals: 'PIMMS' } },
    limit: 1,
  })
  const company = companies.docs[0]
  if (!company) {
    return
  }

  let customers = await payload.find({
    collection: 'customers',
    where: { code: { equals: DEMO_CUSTOMER_CODE } },
    limit: 1,
  })

  let customerId = customers.docs[0]?.id
  if (!customerId) {
    const customer = await payload.create({
      collection: 'customers',
      data: {
        name: 'SPD Demo Customer',
        code: DEMO_CUSTOMER_CODE,
        company: company.id,
        active: true,
      },
    })
    customerId = customer.id
  }

  const project = await payload.create({
    collection: 'spd-projects',
    data: {
      name: DEMO_PROJECT_NAME,
      company: company.id,
      customer: customerId,
      processTemplate: templateId,
      onTrack: true,
    },
  })

  const existingTooling = await payload.find({
    collection: 'tooling-assets',
    where: { name: { equals: 'Demo Tool — Sample Opportunity' } },
    limit: 1,
  })

  if (existingTooling.totalDocs === 0) {
    await payload.create({
      collection: 'tooling-assets',
      data: {
        name: 'Demo Tool — Sample Opportunity',
        version: '0.1',
        status: 'active',
        project: project.id,
      },
    })
  }

  await seedDemoChecklistCompletion(payload, String(project.id))
  await seedDemoGateSignOff(payload, String(project.id))
}

async function seedDemoChecklistCompletion(payload: Payload, projectId: string): Promise<void> {
  const project = await payload.findByID({
    collection: 'spd-projects',
    id: projectId,
    depth: 0,
  })
  if (project.checklistCompletion?.length) return

  await payload.update({
    collection: 'spd-projects',
    id: projectId,
    data: {
      checklistCompletion: [
        { stageId: 'stage-1-1', itemIndex: 0, done: true },
        { stageId: 'stage-1-1', itemIndex: 1, done: true },
        { stageId: 'stage-1-1', itemIndex: 2, done: false },
        { stageId: 'stage-1-2', itemIndex: 0, done: true },
        { stageId: 'stage-1-2', itemIndex: 1, done: false },
      ],
    },
  })
}

async function seedDemoGateSignOff(payload: Payload, projectId: string): Promise<void> {
  const existing = await payload.find({
    collection: 'spd-gate-sign-offs',
    where: {
      and: [
        { project: { equals: projectId } },
        { gateId: { equals: 'gate-1' } },
      ],
    },
    limit: 1,
  })

  if (existing.totalDocs > 0) return

  const approvers = await payload.find({
    collection: 'employees',
    where: { employeeId: { equals: 'EMP-001' } },
    limit: 1,
  })
  const approver = approvers.docs[0]
  if (!approver) return

  await payload.create({
    collection: 'spd-gate-sign-offs',
    data: {
      project: projectId,
      gateId: 'gate-1',
      approver: String(approver.id),
      role: 'product-director',
      decision: 'approved',
      comments: 'Demo gate sign-off — synthetic template POC',
    },
  })
}
