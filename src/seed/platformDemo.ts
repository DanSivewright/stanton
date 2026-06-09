import type { Payload } from 'payload'

export async function seedPlatformDemo(payload: Payload): Promise<void> {
  const company = await ensureCompany(payload)
  if (!company) return

  const companyId = String(company.id)
  const sites = await seedSites(payload, companyId)
  const departments = await seedDepartments(payload, companyId, sites)
  await seedTeams(payload, companyId, departments)
  await enrichEmployeeOrg(payload, sites, departments)
  const products = await seedProducts(payload, companyId)
  await enrichDemoExternalRefs(payload)
  const machines = await seedMachines(payload, sites)
  const moulds = await seedMoulds(payload, products)
  await seedCustomersAndContacts(payload, companyId)
  await seedManufacturing(payload, machines, products, moulds)
  await seedFinance(payload, companyId)
  await seedMaintenance(payload, machines, moulds)
  await seedSales(payload, companyId, departments)
  await seedHr(payload, companyId)
  await seedLlm(payload)
  await seedToolingMouldBridge(payload, moulds)
}

const DEMO_TOOLING_ASSET_NAME = 'Demo Tool — Sample Opportunity'

/** Optional SPD ↔ manufacturing bridge — idempotent; safe to remove if client says different things. */
async function seedToolingMouldBridge(
  payload: Payload,
  moulds: Record<string, string>,
): Promise<void> {
  const mouldId = moulds['MLD-CL-500']
  if (!mouldId) return

  const tooling = await payload.find({
    collection: 'tooling-assets',
    where: { name: { equals: DEMO_TOOLING_ASSET_NAME } },
    limit: 1,
  })
  const asset = tooling.docs[0]
  if (!asset) return

  const currentMouldId =
    asset.relatedMould &&
    (typeof asset.relatedMould === 'object' ? asset.relatedMould.id : asset.relatedMould)

  const needsMouldLink = String(currentMouldId) !== mouldId
  const needsExternalRef = !asset.externalRefs?.length

  if (!needsMouldLink && !needsExternalRef) return

  await payload.update({
    collection: 'tooling-assets',
    id: asset.id,
    data: {
      ...(needsMouldLink ? { relatedMould: mouldId } : {}),
      ...(needsExternalRef
        ? {
            externalRefs: [
              {
                system: 'odoo',
                externalId: 'mrp.tooling/demo-cl-500',
                syncStatus: 'pending',
                notes: 'Demo — shared ref when SPD tooling matches floor mould',
              },
            ],
          }
        : {}),
    },
  })
}

async function ensureCompany(payload: Payload) {
  const existing = await payload.find({
    collection: 'companies',
    where: { code: { equals: 'PIMMS' } },
    limit: 1,
  })
  if (existing.docs[0]) return existing.docs[0]

  return payload.create({
    collection: 'companies',
    data: { name: 'PIMMS Group JHB', code: 'PIMMS', active: true },
  })
}

async function seedSites(payload: Payload, companyId: string) {
  const siteDefs = [
    { name: 'PIMMS Factory A', code: 'SITE-A' },
    { name: 'PIMMS Factory B', code: 'SITE-B' },
    { name: 'PIMMS Factory C', code: 'SITE-C' },
  ]
  const sites: Record<string, string> = {}

  for (const def of siteDefs) {
    const existing = await payload.find({
      collection: 'sites',
      where: { code: { equals: def.code } },
      limit: 1,
    })
    if (existing.docs[0]) {
      sites[def.code] = String(existing.docs[0].id)
    } else {
      const created = await payload.create({
        collection: 'sites',
        data: { ...def, company: companyId, active: true },
      })
      sites[def.code] = String(created.id)
    }
  }
  return sites
}

async function seedDepartments(
  payload: Payload,
  companyId: string,
  sites: Record<string, string>,
) {
  const deptDefs = [
    { name: 'Production', code: 'PROD' },
    { name: 'Sales', code: 'SALES' },
    { name: 'Finance', code: 'FIN' },
  ]
  const departments: Record<string, string> = {}

  for (const def of deptDefs) {
    const existing = await payload.find({
      collection: 'departments',
      where: { name: { equals: def.name } },
      limit: 1,
    })
    if (existing.docs[0]) {
      departments[def.code] = String(existing.docs[0].id)
    } else {
      const created = await payload.create({
        collection: 'departments',
        data: {
          name: def.name,
          company: companyId,
          site: sites['SITE-A'],
          active: true,
        },
      })
      departments[def.code] = String(created.id)
    }
  }
  return departments
}

async function seedTeams(
  payload: Payload,
  companyId: string,
  departments: Record<string, string>,
) {
  const teamDefs = [
    { name: 'Injection Moulding Team 1', dept: 'PROD' },
    { name: 'Regional Sales North', dept: 'SALES' },
  ]

  for (const def of teamDefs) {
    const existing = await payload.find({
      collection: 'teams',
      where: { name: { equals: def.name } },
      limit: 1,
    })
    if (existing.totalDocs > 0) continue

    await payload.create({
      collection: 'teams',
      data: {
        name: def.name,
        company: companyId,
        department: departments[def.dept],
        active: true,
      },
    })
  }
}

async function enrichEmployeeOrg(
  payload: Payload,
  sites: Record<string, string>,
  departments: Record<string, string>,
) {
  const teamRows = await payload.find({ collection: 'teams', limit: 10 })
  const teamByName = Object.fromEntries(teamRows.docs.map((t) => [t.name, String(t.id)]))

  const orgLinks: Record<
    string,
    { site?: string; dept?: string; team?: string; managerEmployeeId?: string }
  > = {
    'EMP-001': { site: 'SITE-A', dept: 'PROD', team: 'Injection Moulding Team 1' },
    'EMP-002': { site: 'SITE-A', dept: 'PROD', managerEmployeeId: 'EMP-001' },
    'EMP-003': { site: 'SITE-A', dept: 'PROD', managerEmployeeId: 'EMP-001' },
    'EMP-004': {
      site: 'SITE-A',
      dept: 'PROD',
      team: 'Injection Moulding Team 1',
      managerEmployeeId: 'EMP-001',
    },
    'EMP-005': { site: 'SITE-A', dept: 'SALES', team: 'Regional Sales North' },
    'EMP-006': { site: 'SITE-A', dept: 'FIN' },
  }

  const managerIds: Record<string, string> = {}
  const allEmployees = await payload.find({ collection: 'employees', limit: 20 })
  for (const emp of allEmployees.docs) {
    managerIds[emp.employeeId] = String(emp.id)
  }

  for (const [employeeId, links] of Object.entries(orgLinks)) {
    const emp = allEmployees.docs.find((e) => e.employeeId === employeeId)
    if (!emp) continue

    const data: Record<string, unknown> = {}
    if (links.site) data.site = sites[links.site]
    if (links.dept) data.department = departments[links.dept]
    if (links.team && teamByName[links.team]) data.team = teamByName[links.team]
    if (links.managerEmployeeId && managerIds[links.managerEmployeeId]) {
      data.manager = managerIds[links.managerEmployeeId]
    }

    if (Object.keys(data).length === 0) continue

    await payload.update({
      collection: 'employees',
      id: emp.id,
      data,
    })
  }
}

async function seedProducts(payload: Payload, companyId: string) {
  const productDefs = [
    { name: 'Widget A', stockCode: 'WGT-A', odooId: 'product.template/1042' },
    { name: 'Widget B', stockCode: 'WGT-B', odooId: 'product.template/1043' },
    { name: 'Container Lid 500ml', stockCode: 'CL-500', odooId: 'product.template/1088' },
    { name: 'Industrial Crate 20L', stockCode: 'IC-20L', odooId: 'product.template/1102' },
  ]
  const products: Record<string, string> = {}

  for (const def of productDefs) {
    const existing = await payload.find({
      collection: 'products',
      where: { stockCode: { equals: def.stockCode } },
      limit: 1,
    })
    if (existing.docs[0]) {
      products[def.stockCode] = String(existing.docs[0].id)
    } else {
      const created = await payload.create({
        collection: 'products',
        data: {
          name: def.name,
          stockCode: def.stockCode,
          company: companyId,
          active: true,
          externalRefs: [
            {
              system: 'odoo',
              externalId: def.odooId,
              syncStatus: 'pending',
              notes: 'Demo — future Odoo product sync',
            },
          ],
        },
      })
      products[def.stockCode] = String(created.id)
    }
  }
  return products
}

async function seedMachines(payload: Payload, sites: Record<string, string>) {
  const machines: Record<string, string> = {}
  let machineNum = 1

  for (const siteCode of ['SITE-A', 'SITE-B', 'SITE-C']) {
    for (let i = 0; i < 3; i++) {
      const code = `MCH-${String(machineNum).padStart(3, '0')}`
      const existing = await payload.find({
        collection: 'machines',
        where: { code: { equals: code } },
        limit: 1,
      })
      if (existing.docs[0]) {
        machines[code] = String(existing.docs[0].id)
      } else {
        const created = await payload.create({
          collection: 'machines',
          data: {
            name: `Machine ${machineNum}`,
            code,
            site: sites[siteCode],
            status: machineNum % 3 === 0 ? 'running' : 'stopped',
            active: true,
          },
        })
        machines[code] = String(created.id)
      }
      machineNum++
    }
  }
  return machines
}

async function seedMoulds(payload: Payload, products: Record<string, string>) {
  const mouldDefs = [
    { name: 'Mould Widget A', code: 'MLD-WGT-A', product: 'WGT-A', shotCount: 12500 },
    { name: 'Mould Widget B', code: 'MLD-WGT-B', product: 'WGT-B', shotCount: 8500 },
    { name: 'Mould Lid 500ml', code: 'MLD-CL-500', product: 'CL-500', shotCount: 19800 },
    { name: 'Mould Crate 20L', code: 'MLD-IC-20L', product: 'IC-20L', shotCount: 4200 },
  ]
  const moulds: Record<string, string> = {}

  for (const def of mouldDefs) {
    const existing = await payload.find({
      collection: 'moulds',
      where: { code: { equals: def.code } },
      limit: 1,
    })
    if (existing.docs[0]) {
      moulds[def.code] = String(existing.docs[0].id)
    } else {
      const created = await payload.create({
        collection: 'moulds',
        data: {
          name: def.name,
          code: def.code,
          product: products[def.product],
          shotCount: def.shotCount,
          active: true,
        },
      })
      moulds[def.code] = String(created.id)
    }
  }
  return moulds
}

async function enrichDemoExternalRefs(payload: Payload): Promise<void> {
  const product = await payload.find({
    collection: 'products',
    where: { stockCode: { equals: 'WGT-A' } },
    limit: 1,
  })
  const wgtA = product.docs[0]
  if (wgtA && !wgtA.externalRefs?.length) {
    await payload.update({
      collection: 'products',
      id: wgtA.id,
      data: {
        externalRefs: [
          {
            system: 'odoo',
            externalId: 'product.template/1042',
            syncStatus: 'pending',
            notes: 'Demo — future Odoo product sync',
          },
        ],
      },
    })
  }

  const salesRep = await payload.find({
    collection: 'employees',
    where: { employeeId: { equals: 'EMP-005' } },
    limit: 1,
  })
  const rep = salesRep.docs[0]
  if (rep && !rep.externalRefs?.length) {
    await payload.update({
      collection: 'employees',
      id: rep.id,
      data: {
        externalRefs: [
          {
            system: 'pipedrive',
            externalId: 'user/8821',
            syncStatus: 'pending',
            notes: 'Sales rep — future Pipedrive sync',
          },
        ],
      },
    })
  }
}

async function seedCustomersAndContacts(payload: Payload, companyId: string) {
  const customerDefs = [
    { name: 'Nestlé Waters SA', code: 'CUST-NESTLE', odooId: 'res.partner/2201' },
    { name: 'Tiger Brands Procurement', code: 'CUST-TIGER', odooId: 'res.partner/2208' },
  ]

  for (const def of customerDefs) {
    const existing = await payload.find({
      collection: 'customers',
      where: { code: { equals: def.code } },
      limit: 1,
    })
    if (existing.totalDocs > 0) continue

    const customer = await payload.create({
      collection: 'customers',
      data: {
        name: def.name,
        code: def.code,
        company: companyId,
        active: true,
        externalRefs: [
          { system: 'odoo', externalId: def.odooId, syncStatus: 'pending' },
          { system: 'pipedrive', externalId: `org/${def.code}`, syncStatus: 'pending' },
        ],
      },
    })

    await payload.create({
      collection: 'contacts',
      data: {
        name: `${def.name} — Procurement Lead`,
        email: `procurement@${def.code.toLowerCase().replace('cust-', '')}.example.com`,
        roleTitle: 'Procurement Manager',
        customer: customer.id,
        company: companyId,
        externalRefs: [{ system: 'pipedrive', externalId: `person/${def.code}`, syncStatus: 'pending' }],
      },
    })
  }
}

async function seedManufacturing(
  payload: Payload,
  machines: Record<string, string>,
  products: Record<string, string>,
  moulds: Record<string, string>,
) {
  const moDefs = [
    {
      moNumber: 'MO-DEMO-001',
      machine: 'MCH-001',
      product: 'WGT-A',
      mould: 'MLD-WGT-A',
      orderQty: 50000,
      remainQty: 42000,
      cycleTimePlanned: 45,
      status: 'active' as const,
    },
    {
      moNumber: 'MO-DEMO-002',
      machine: 'MCH-002',
      product: 'WGT-B',
      mould: 'MLD-WGT-B',
      orderQty: 30000,
      remainQty: 28500,
      cycleTimePlanned: 52,
      status: 'active' as const,
    },
    {
      moNumber: 'MO-DEMO-003',
      machine: 'MCH-004',
      product: 'CL-500',
      mould: 'MLD-CL-500',
      orderQty: 80000,
      remainQty: 76000,
      cycleTimePlanned: 38,
      status: 'active' as const,
    },
  ]

  const moIds: Record<string, string> = {}
  for (const def of moDefs) {
    const existing = await payload.find({
      collection: 'manufacturing-orders',
      where: { moNumber: { equals: def.moNumber } },
      limit: 1,
    })
    if (existing.docs[0]) {
      moIds[def.moNumber] = String(existing.docs[0].id)
    } else {
      const mo = await payload.create({
        collection: 'manufacturing-orders',
        data: {
          moNumber: def.moNumber,
          machine: machines[def.machine],
          product: products[def.product],
          mould: moulds[def.mould],
          orderQty: def.orderQty,
          remainQty: def.remainQty,
          cycleTimePlanned: def.cycleTimePlanned,
          status: def.status,
        },
      })
      moIds[def.moNumber] = String(mo.id)
    }
  }

  const lineManager = await payload.find({
    collection: 'employees',
    where: { employeeId: { equals: 'EMP-004' } },
    limit: 1,
  })
  const employee = lineManager.docs[0] ?? (
    await payload.find({
      collection: 'employees',
      where: { employeeId: { equals: 'EMP-001' } },
      limit: 1,
    })
  ).docs[0]
  if (!employee) return

  const snapshotDefs = [
    {
      key: 'snap-mch001-round1',
      machine: 'MCH-001',
      mo: 'MO-DEMO-001',
      cycleTime: 47,
      units: 120,
      rejects: 2,
      stoppage: false,
    },
    {
      key: 'snap-mch001-round2',
      machine: 'MCH-001',
      mo: 'MO-DEMO-001',
      cycleTime: 46,
      units: 135,
      rejects: 1,
      stoppage: false,
    },
    {
      key: 'snap-mch002-round1',
      machine: 'MCH-002',
      mo: 'MO-DEMO-002',
      cycleTime: 55,
      units: 98,
      rejects: 5,
      stoppage: true,
      stoppageReason: 'Material feed jam',
      stoppageMinutes: 18,
    },
    {
      key: 'snap-mch004-round1',
      machine: 'MCH-004',
      mo: 'MO-DEMO-003',
      cycleTime: 39,
      units: 200,
      rejects: 0,
      stoppage: false,
    },
  ]

  for (const snap of snapshotDefs) {
    const existing = await payload.find({
      collection: 'production-snapshots',
      where: { notes: { equals: snap.key } },
      limit: 1,
    })
    if (existing.totalDocs > 0) continue

    await payload.create({
      collection: 'production-snapshots',
      data: {
        machine: machines[snap.machine],
        manufacturingOrder: moIds[snap.mo],
        employee: String(employee.id),
        employeeId: employee.employeeId,
        status: 'submitted',
        actualCycleTime: snap.cycleTime,
        unitsProduced: snap.units,
        rejects: snap.rejects,
        stoppage: snap.stoppage
          ? {
              occurred: true,
              reason: snap.stoppageReason,
              durationMinutes: snap.stoppageMinutes,
            }
          : { occurred: false },
        notes: snap.key,
      },
    })
  }
}

async function seedFinance(payload: Payload, companyId: string) {
  const periodExisting = await payload.find({
    collection: 'finance-reporting-periods',
    where: { label: { equals: 'June 2026' } },
    limit: 1,
  })

  let periodId = periodExisting.docs[0] ? String(periodExisting.docs[0].id) : undefined
  if (!periodId) {
    const period = await payload.create({
      collection: 'finance-reporting-periods',
      data: {
        label: 'June 2026',
        company: companyId,
        periodType: 'monthly',
        periodStart: '2026-06-01',
        periodEnd: '2026-06-30',
        status: 'open',
        sections: [
          { sectionKey: 'profitability', name: 'Profitability', order: 1 },
          { sectionKey: 'debtors-aging', name: 'Debtors Aging', order: 2 },
        ],
      },
    })
    periodId = String(period.id)
  }

  const plLines = [
    { label: 'Revenue', amount: 1250000, prior: 1180000 },
    { label: 'Cost of Goods Sold', amount: 843750, prior: 811640 },
    { label: 'Gross Profit', amount: 406250, prior: 368360 },
    { label: 'Operating Expenses', amount: 287500, prior: 275000 },
    { label: 'Net Profit', amount: 118750, prior: 93360 },
  ]

  for (const line of plLines) {
    const existing = await payload.find({
      collection: 'finance-report-lines',
      where: {
        and: [
          { period: { equals: periodId } },
          { label: { equals: line.label } },
          { sectionKey: { equals: 'profitability' } },
        ],
      },
      limit: 1,
    })
    if (existing.totalDocs > 0) continue

    await payload.create({
      collection: 'finance-report-lines',
      data: {
        period: periodId,
        company: companyId,
        sectionKey: 'profitability',
        lineType: 'standard',
        label: line.label,
        amount: line.amount,
        priorPeriodAmount: line.prior,
        externalRefs: [
          {
            system: 'odoo',
            externalId: `account.report.line/${line.label.toLowerCase().replace(/\s+/g, '-')}`,
            syncStatus: 'pending',
          },
        ],
      },
    })
  }

  const agingLines = [
    { label: 'Nestlé Waters SA', bucket: 'current' as const, amount: 185000 },
    { label: 'Tiger Brands', bucket: '30' as const, amount: 42000 },
    { label: 'Legacy Distributor', bucket: '90' as const, amount: 12800 },
    { label: 'Write-off candidate', bucket: '120plus' as const, amount: 3500 },
  ]

  for (const line of agingLines) {
    const existing = await payload.find({
      collection: 'finance-report-lines',
      where: {
        and: [
          { period: { equals: periodId } },
          { label: { equals: line.label } },
          { lineType: { equals: 'aging' } },
        ],
      },
      limit: 1,
    })
    if (existing.totalDocs > 0) continue

    await payload.create({
      collection: 'finance-report-lines',
      data: {
        period: periodId,
        company: companyId,
        sectionKey: 'debtors-aging',
        lineType: 'aging',
        label: line.label,
        amount: line.amount,
        agingBucket: line.bucket,
      },
    })
  }

  const metrics = [
    { key: 'gross-margin-pct', value: 32.5, prior: 31.2 },
    { key: 'current-ratio', value: 1.85, prior: 1.72 },
    { key: 'debtors-days', value: 42, prior: 45 },
  ]

  for (const metric of metrics) {
    const existing = await payload.find({
      collection: 'financial-metrics',
      where: {
        and: [{ period: { equals: periodId } }, { metricKey: { equals: metric.key } }],
      },
      limit: 1,
    })
    if (existing.totalDocs > 0) continue

    await payload.create({
      collection: 'financial-metrics',
      data: {
        period: periodId,
        company: companyId,
        metricKey: metric.key,
        value: metric.value,
        priorValue: metric.prior,
      },
    })
  }
}

async function seedMaintenance(
  payload: Payload,
  machines: Record<string, string>,
  moulds: Record<string, string>,
) {
  const partDefs = [
    { name: 'Heater Band 45mm', partNumber: 'PRT-HEATER-01', supplier: 'Industrial Parts Co' },
    { name: 'Hydraulic Seal Kit', partNumber: 'PRT-HYD-02', supplier: 'FluidTech' },
    { name: 'Nozzle Tip 6mm', partNumber: 'PRT-NOZ-06', supplier: 'MouldTech SA' },
  ]

  const partIds: Record<string, string> = {}
  for (const def of partDefs) {
    const existing = await payload.find({
      collection: 'parts',
      where: { partNumber: { equals: def.partNumber } },
      limit: 1,
    })
    if (existing.docs[0]) {
      partIds[def.partNumber] = String(existing.docs[0].id)
    } else {
      const part = await payload.create({
        collection: 'parts',
        data: def,
      })
      partIds[def.partNumber] = String(part.id)
    }
  }

  const jobDefs = [
    {
      title: 'Mould service — Widget A',
      machine: 'MCH-001',
      mould: 'MLD-WGT-A',
      status: 'open' as const,
      trigger: 'shot_count' as const,
      part: 'PRT-HEATER-01',
    },
    {
      title: 'Hydraulic leak — Machine 2',
      machine: 'MCH-002',
      status: 'in_progress' as const,
      trigger: 'manual' as const,
      part: 'PRT-HYD-02',
    },
    {
      title: 'Nozzle replacement — Machine 4',
      machine: 'MCH-004',
      mould: 'MLD-CL-500',
      status: 'completed' as const,
      trigger: 'manual' as const,
      part: 'PRT-NOZ-06',
    },
  ]

  for (const job of jobDefs) {
    const existing = await payload.find({
      collection: 'maintenance-jobs',
      where: { title: { equals: job.title } },
      limit: 1,
    })
    if (existing.totalDocs > 0) continue

    await payload.create({
      collection: 'maintenance-jobs',
      data: {
        title: job.title,
        machine: machines[job.machine],
        mould: job.mould ? moulds[job.mould] : undefined,
        status: job.status,
        trigger: job.trigger,
        partsUsed: [{ part: partIds[job.part], quantity: job.status === 'completed' ? 1 : 2 }],
        completedAt: job.status === 'completed' ? new Date().toISOString() : undefined,
      },
    })
  }
}

async function seedSales(
  payload: Payload,
  companyId: string,
  departments: Record<string, string>,
) {
  const periodExisting = await payload.find({
    collection: 'sales-performance-periods',
    where: { label: { equals: 'June 2026 Sales' } },
    limit: 1,
  })

  let periodId = periodExisting.docs[0] ? String(periodExisting.docs[0].id) : undefined
  if (!periodId) {
    const period = await payload.create({
      collection: 'sales-performance-periods',
      data: {
        label: 'June 2026 Sales',
        company: companyId,
        month: 6,
        year: 2026,
        status: 'open',
      },
    })
    periodId = String(period.id)
  }

  const salesRep = await payload.find({
    collection: 'employees',
    where: { employeeId: { equals: 'EMP-005' } },
    limit: 1,
  })
  const employee = salesRep.docs[0]
  if (!employee) return

  const employeeId = String(employee.id)
  const salesTeam = await payload.find({
    collection: 'teams',
    where: { name: { equals: 'Regional Sales North' } },
    limit: 1,
  })

  const targetExisting = await payload.find({
    collection: 'sales-targets',
    where: { and: [{ period: { equals: periodId } }, { employee: { equals: employeeId } }] },
    limit: 1,
  })
  if (targetExisting.totalDocs === 0) {
    await payload.create({
      collection: 'sales-targets',
      data: {
        period: periodId,
        employee: employeeId,
        department: departments['SALES'],
        team: salesTeam.docs[0]?.id,
        revenueTarget: 500000,
        newBusinessTarget: 75000,
        huntVisitsTarget: 10,
        careVisitsTarget: 8,
        conversionTargetPercent: 30,
        externalRefs: [
          { system: 'pipedrive', externalId: 'goal/2026-06-emp-005', syncStatus: 'pending' },
        ],
      },
    })
  }

  const actualExisting = await payload.find({
    collection: 'sales-actuals',
    where: { and: [{ period: { equals: periodId } }, { employee: { equals: employeeId } }] },
    limit: 1,
  })
  if (actualExisting.totalDocs === 0) {
    await payload.create({
      collection: 'sales-actuals',
      data: {
        period: periodId,
        employee: employeeId,
        actualAmount: 425000,
        source: 'manual',
        externalRefs: [
          { system: 'odoo', externalId: 'sale.report/2026-06', syncStatus: 'pending' },
        ],
      },
    })
  }

  const activityDefs = [
    { type: 'hunt' as const, careVisits: 0, conversions: 3, notes: 'New business hunting — June' },
    { type: 'care' as const, careVisits: 6, conversions: 2, notes: 'Customer care visits — June' },
  ]

  for (const act of activityDefs) {
    const existing = await payload.find({
      collection: 'sales-activities',
      where: { notes: { equals: act.notes } },
      limit: 1,
    })
    if (existing.totalDocs > 0) continue

    await payload.create({
      collection: 'sales-activities',
      data: {
        period: periodId,
        employee: employeeId,
        activityType: act.type,
        careVisits: act.careVisits,
        conversions: act.conversions,
        satisfactionScore: act.type === 'care' ? 82 : undefined,
        notes: act.notes,
      },
    })
  }
}

async function seedHr(payload: Payload, companyId: string) {
  const templateExisting = await payload.find({
    collection: 'contract-templates',
    where: { name: { equals: 'Standard Performance Contract' } },
    limit: 1,
  })

  let templateId = templateExisting.docs[0] ? String(templateExisting.docs[0].id) : undefined
  if (!templateId) {
    const template = await payload.create({
      collection: 'contract-templates',
      data: {
        name: 'Standard Performance Contract',
        company: companyId,
        active: true,
        kpas: [
          {
            name: 'Operational Excellence',
            weight: 1,
            kpis: [
              { name: 'Accuracy', target: '95%', weight: 1 },
              { name: 'Runs Completed', target: '100%', weight: 1 },
            ],
          },
        ],
      },
    })
    templateId = String(template.id)
  }

  const lineManager = await payload.find({
    collection: 'employees',
    where: { employeeId: { equals: 'EMP-004' } },
    limit: 1,
  })
  const employee = lineManager.docs[0] ?? (
    await payload.find({
      collection: 'employees',
      where: { employeeId: { equals: 'EMP-001' } },
      limit: 1,
    })
  ).docs[0]
  if (!employee) return

  const employeeId = String(employee.id)

  const contractExisting = await payload.find({
    collection: 'performance-contracts',
    where: { employee: { equals: employeeId } },
    limit: 1,
  })
  if (contractExisting.totalDocs === 0) {
    const contract = await payload.create({
      collection: 'performance-contracts',
      data: {
        employee: employeeId,
        template: templateId,
        periodLabel: 'FY2026',
        status: 'approved',
        kpas: [
          {
            name: 'Operational Excellence',
            weight: 1,
            kpis: [
              { name: 'Accuracy', target: '95%', actual: '92%', weight: 1 },
              { name: 'Runs Completed', target: '100%', actual: '88%', weight: 1 },
            ],
          },
        ],
      },
    })

    await payload.create({
      collection: 'quarterly-reviews',
      data: {
        employee: employeeId,
        performanceContract: String(contract.id),
        quarter: 2,
        year: 2026,
        status: 'in_progress',
        scores: [
          { kpiName: 'Accuracy', score: 2, weight: 1 },
          { kpiName: 'Runs Completed', score: 2, weight: 1 },
        ],
        rating: '2',
      },
    })
  }
}

async function seedLlm(payload: Payload) {
  const existing = await payload.find({
    collection: 'llm-prompts',
    where: { name: { equals: 'Cross-module data query' } },
    limit: 1,
  })
  if (existing.totalDocs > 0) return

  await payload.create({
    collection: 'llm-prompts',
    data: {
      name: 'Cross-module data query',
      module: 'cross',
      systemPrompt:
        'You are a helpful assistant for Stanton/PIMMS operations data. Answer only from provided Payload records.',
      userPromptTemplate: 'Query: {{query}}',
      allowedCollections: [
        { slug: 'machines' },
        { slug: 'spd-projects' },
        { slug: 'finance-report-lines' },
      ],
      active: true,
    },
  })
}
