/**
 * Platform smoke check — asserts demo seed records exist across modules.
 * Run: pnpm tsx scripts/verify/platform-smoke.ts
 */
import 'dotenv/config'

import { getPayload, type Where } from 'payload'

import config from '../../src/payload.config'

type Assertion = {
  label: string
  collection: string
  where?: Where
  minDocs?: number
}

const assertions: Assertion[] = [
  { label: 'PIMMS company', collection: 'companies', where: { code: { equals: 'PIMMS' } } },
  { label: 'Demo sites', collection: 'sites', minDocs: 1 },
  { label: 'Demo machines', collection: 'machines', where: { code: { equals: 'MCH-001' } } },
  { label: 'Demo MO', collection: 'manufacturing-orders', where: { moNumber: { equals: 'MO-DEMO-001' } } },
  { label: 'Production snapshot', collection: 'production-snapshots', minDocs: 1 },
  { label: 'Finance period', collection: 'finance-reporting-periods', where: { label: { equals: 'June 2026' } } },
  { label: 'Finance line', collection: 'finance-report-lines', minDocs: 1 },
  { label: 'Maintenance part', collection: 'parts', where: { partNumber: { equals: 'PRT-HEATER-01' } } },
  { label: 'Maintenance job', collection: 'maintenance-jobs', minDocs: 1 },
  { label: 'Sales period', collection: 'sales-performance-periods', where: { label: { equals: 'June 2026 Sales' } } },
  { label: 'Sales target', collection: 'sales-targets', minDocs: 1 },
  { label: 'Sales actual', collection: 'sales-actuals', minDocs: 1 },
  { label: 'HR contract template', collection: 'contract-templates', minDocs: 1 },
  { label: 'Performance contract', collection: 'performance-contracts', minDocs: 1 },
  { label: 'LLM prompt', collection: 'llm-prompts', minDocs: 1 },
  { label: 'SPD process template', collection: 'spd-process-templates', minDocs: 1 },
]

async function verifySpdGateEnforcement(
  payload: Awaited<ReturnType<typeof getPayload>>,
): Promise<void> {
  const companies = await payload.find({ collection: 'companies', limit: 1 })
  const companyId = companies.docs[0]?.id
  if (!companyId) throw new Error('SPD enforcement: no company')

  const customers = await payload.find({ collection: 'customers', limit: 1 })
  const customerId = customers.docs[0]?.id
  if (!customerId) throw new Error('SPD enforcement: no customer')

  const employees = await payload.find({ collection: 'employees', limit: 1 })
  const approverId = employees.docs[0]?.id
  if (!approverId) throw new Error('SPD enforcement: no employee')

  const template = await payload.create({
    collection: 'spd-process-templates',
    draft: false,
    data: {
      name: 'Smoke Gate Enforcement Template',
      version: 'smoke-gate',
      _status: 'published',
      phases: [
        {
          phaseId: 'smoke-phase-1',
          name: 'Smoke Phase 1',
          order: 1,
          stages: [
            {
              stageId: 'smoke-stage-1',
              name: 'Smoke Stage',
              order: 1,
              checklistItems: [{ item: 'Smoke checklist item' }],
              gate: { gateId: 'smoke-gate-1', name: 'Smoke Gate', requiredRoles: ['pdm'] },
            },
          ],
        },
      ],
    },
  })

  const project = await payload.create({
    collection: 'spd-projects',
    data: {
      name: 'Smoke Gate Enforcement Project',
      company: companyId,
      customer: customerId,
      processTemplate: template.id,
    },
  })

  try {
    await payload.create({
      collection: 'spd-gate-sign-offs',
      data: {
        project: project.id,
        gateId: 'smoke-gate-1',
        approver: approverId,
        role: 'pdm',
        decision: 'approved',
      },
    })
    throw new Error('SPD gate sign-off should require checklist completion')
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    if (!message.includes('checklist')) {
      throw err
    }
  }

  console.log('✓ SPD gate checklist enforcement')
}

async function verifyMaintenanceShotTrigger(
  payload: Awaited<ReturnType<typeof getPayload>>,
): Promise<void> {
  const settings = await payload.findGlobal({ slug: 'maintenance-settings' })
  const serviceThreshold = settings?.serviceIntervalShots ?? 20000

  const moulds = await payload.find({
    collection: 'moulds',
    where: { code: { equals: 'MLD-CL-500' } },
    limit: 1,
  })
  const mould = moulds.docs[0]
  if (!mould) throw new Error('Maintenance trigger: MLD-CL-500 mould not found')

  const machines = await payload.find({
    collection: 'machines',
    where: { code: { equals: 'MCH-001' } },
    limit: 1,
  })
  const machine = machines.docs[0]
  if (!machine) throw new Error('Maintenance trigger: MCH-001 machine not found')

  const employees = await payload.find({ collection: 'employees', limit: 1 })
  const employee = employees.docs[0]
  if (!employee) throw new Error('Maintenance trigger: no employee')

  const productId =
    typeof mould.product === 'object' ? mould.product?.id : mould.product
  if (!productId) throw new Error('Maintenance trigger: mould has no product')

  const mo = await payload.create({
    collection: 'manufacturing-orders',
    data: {
      moNumber: `MO-SMOKE-${Date.now()}`,
      machine: machine.id,
      product: productId,
      mould: mould.id,
      orderQty: 1000,
      remainQty: 1000,
      cycleTimePlanned: 45,
      status: 'active',
    },
  })

  const unitsToSubmit = Math.max(1, serviceThreshold - (mould.shotCount ?? 0) + 50)

  await payload.create({
    collection: 'production-snapshots',
    data: {
      machine: machine.id,
      manufacturingOrder: mo.id,
      employee: employee.id,
      employeeId: employee.employeeId,
      status: 'submitted',
      unitsProduced: unitsToSubmit,
    },
  })

  const autoJobs = await payload.find({
    collection: 'maintenance-jobs',
    where: {
      and: [
        { mould: { equals: mould.id } },
        { trigger: { equals: 'shot_count' } },
        { status: { in: ['open', 'in_progress'] } },
      ],
    },
    limit: 5,
  })

  if (autoJobs.totalDocs < 1) {
    throw new Error('Maintenance shot-count trigger did not create a job')
  }

  console.log('✓ Maintenance shot-count auto-job')
}

async function main() {
  const payload = await getPayload({ config: await config })

  const failures: string[] = []

  for (const assertion of assertions) {
    const result = await payload.find({
      collection: assertion.collection as Parameters<typeof payload.find>[0]['collection'],
      where: assertion.where,
      limit: 1,
    })

    const min = assertion.minDocs ?? 1
    if (result.totalDocs < min) {
      failures.push(`${assertion.label} (${assertion.collection}): expected ≥${min}, got ${result.totalDocs}`)
    } else {
      console.log(`✓ ${assertion.label}`)
    }
  }

  if (failures.length > 0) {
    console.error('\nPlatform smoke FAILED:')
    for (const failure of failures) {
      console.error(`  ✗ ${failure}`)
    }
    process.exit(1)
  }

  await verifySpdGateEnforcement(payload)
  await verifyMaintenanceShotTrigger(payload)

  console.log(`\nPlatform smoke passed (${assertions.length + 2} checks).`)
  process.exit(0)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
