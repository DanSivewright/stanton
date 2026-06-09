/**
 * Local API verification for SPD Wave 3 collections (BUI-283–287).
 * Run: pnpm tsx scripts/verify/spd-wave3.ts
 */
import 'dotenv/config'

import { getPayload } from 'payload'

import config from '../../src/payload.config'

async function main() {
  const payload = await getPayload({ config: await config })

  const companies = await payload.find({ collection: 'companies', limit: 1 })
  const companyId = companies.docs[0]?.id
  if (!companyId) throw new Error('No company found — run seed first')

  let customers = await payload.find({ collection: 'customers', limit: 1 })
  let customerId = customers.docs[0]?.id
  if (!customerId) {
    const created = await payload.create({
      collection: 'customers',
      data: {
        name: 'Wave3 Verify Customer',
        code: 'W3-VERIFY',
        company: companyId,
        active: true,
      },
    })
    customerId = created.id
  }

  const employees = await payload.find({ collection: 'employees', limit: 1 })
  const approverId = employees.docs[0]?.id
  if (!approverId) throw new Error('No employee found')

  const template = await payload.create({
    collection: 'spd-process-templates',
    draft: false,
    data: {
      name: 'Wave3 Verify Template',
      version: '1.0-verify',
      _status: 'published',
      phases: [
        {
          phaseId: 'phase-1',
          name: 'Phase 1',
          order: 1,
          stages: [
            {
              stageId: 'stage-1-1',
              name: 'Stage 1',
              order: 1,
              checklistItems: [{ item: 'Complete feasibility review' }],
              gate: {
                gateId: 'gate-1',
                name: 'Gate 1',
                requiredRoles: ['pdm'],
              },
            },
          ],
        },
        {
          phaseId: 'phase-2',
          name: 'Phase 2',
          order: 2,
          stages: [
            {
              stageId: 'stage-2-1',
              name: 'Stage 1',
              order: 1,
              checklistItems: [{ item: 'Future phase task' }],
            },
          ],
        },
      ],
    },
  })

  await payload.updateGlobal({
    slug: 'spd-settings',
    data: { defaultTemplate: template.id },
  })

  const project = await payload.create({
    collection: 'spd-projects',
    data: {
      name: 'Wave3 Verify Project',
      company: companyId,
      customer: customerId,
    },
  })

  const snapshot = project.processSnapshot
  if (!snapshot?.phases?.length || snapshot.templateVersion !== '1.0-verify') {
    throw new Error('Process snapshot not populated on create')
  }
  if (project.currentPhase !== 'phase-1') {
    throw new Error(`Expected currentPhase phase-1, got ${project.currentPhase}`)
  }

  await payload.update({
    collection: 'spd-process-templates',
    id: template.id,
    data: {
      version: '2.0-mutated',
      phases: [{ phaseId: 'mutated', name: 'Mutated', order: 1, stages: [] }],
    },
  })

  const projectAfterTemplateEdit = await payload.findByID({
    collection: 'spd-projects',
    id: project.id,
    depth: 0,
  })
  if (projectAfterTemplateEdit.processSnapshot?.templateVersion !== '1.0-verify') {
    throw new Error('Template edit mutated project snapshot')
  }

  try {
    await payload.create({
      collection: 'spd-gate-sign-offs',
      data: {
        project: project.id,
        gateId: 'gate-1',
        approver: approverId,
        role: 'pdm',
        decision: 'approved',
        comments: 'Should fail — checklist incomplete',
      },
    })
    throw new Error('Sign-off without checklist completion should be blocked')
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    if (!message.includes('checklist')) {
      throw err
    }
  }

  try {
    await payload.update({
      collection: 'spd-projects',
      id: project.id,
      data: {
        checklistCompletion: [{ stageId: 'stage-2-1', itemIndex: 0, done: true }],
      },
    })
    throw new Error('Phase-2 checklist edit should be blocked while on phase-1')
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    if (!message.includes('locked')) {
      throw err
    }
  }

  await payload.update({
    collection: 'spd-projects',
    id: project.id,
    data: {
      checklistCompletion: [{ stageId: 'stage-1-1', itemIndex: 0, done: true }],
    },
  })

  const tooling = await payload.create({
    collection: 'tooling-assets',
    data: {
      name: 'Verify Tool',
      version: '1.0',
      status: 'active',
      project: project.id,
    },
  })

  const inScopeCr = await payload.create({
    collection: 'spd-change-requests',
    data: {
      title: 'In-scope verify CR',
      project: project.id,
      toolingAsset: tooling.id,
      classification: 'in-scope-redo',
      approvalStatus: 'draft',
      impact: 'Minor rework',
    },
  })

  const outOfScopeCr = await payload.create({
    collection: 'spd-change-requests',
    data: {
      title: 'Out-of-scope verify CR',
      project: project.id,
      toolingAsset: tooling.id,
      classification: 'out-of-scope-costed',
      approvalStatus: 'pending-client-sign-off',
      impact: 'Scope expansion',
      costFields: {
        estimatedCost: 5000,
        currency: 'GBP',
        clientSignOffStatus: 'pending',
      },
    },
  })

  const signOff = await payload.create({
    collection: 'spd-gate-sign-offs',
    data: {
      project: project.id,
      gateId: 'gate-1',
      approver: approverId,
      role: 'pdm',
      decision: 'approved',
      comments: 'Wave3 verification',
    },
  })

  const projectAfterSignOff = await payload.findByID({
    collection: 'spd-projects',
    id: project.id,
    depth: 0,
  })
  if (projectAfterSignOff.currentPhase !== 'phase-2') {
    throw new Error(`Expected phase-2 after gate approve, got ${projectAfterSignOff.currentPhase}`)
  }

  try {
    await payload.update({
      collection: 'spd-gate-sign-offs',
      id: signOff.id,
      data: { comments: 'should fail' },
    })
    throw new Error('Sign-off update should be blocked')
  } catch {
    // expected append-only
  }

  console.log('SPD Wave 3 verification passed')
  console.log({
    templateId: template.id,
    projectId: project.id,
    toolingId: tooling.id,
    inScopeCrId: inScopeCr.id,
    outOfScopeCrId: outOfScopeCr.id,
    signOffId: signOff.id,
    finalPhase: projectAfterSignOff.currentPhase,
  })
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
