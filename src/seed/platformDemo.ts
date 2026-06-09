import type { Payload } from 'payload'

export async function seedPlatformDemo(payload: Payload): Promise<void> {
  const company = await ensureCompany(payload)
  if (!company) return

  const companyId = String(company.id)
  const sites = await seedSites(payload, companyId)
  const departments = await seedDepartments(payload, companyId, sites)
  await seedTeams(payload, companyId, departments)
  const products = await seedProducts(payload, companyId)
  const machines = await seedMachines(payload, sites)
  const moulds = await seedMoulds(payload, products)
  await seedManufacturing(payload, machines, products, moulds)
  await seedFinance(payload, companyId)
  await seedMaintenance(payload, machines, moulds)
  await seedSales(payload, companyId)
  await seedHr(payload, companyId)
  await seedLlm(payload)
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

async function seedProducts(payload: Payload, companyId: string) {
  const productDefs = [
    { name: 'Widget A', stockCode: 'WGT-A' },
    { name: 'Widget B', stockCode: 'WGT-B' },
    { name: 'Container Lid 500ml', stockCode: 'CL-500' },
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
        data: { ...def, company: companyId, active: true },
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

async function seedManufacturing(
  payload: Payload,
  machines: Record<string, string>,
  products: Record<string, string>,
  moulds: Record<string, string>,
) {
  const moExisting = await payload.find({
    collection: 'manufacturing-orders',
    where: { moNumber: { equals: 'MO-DEMO-001' } },
    limit: 1,
  })

  let moId = moExisting.docs[0] ? String(moExisting.docs[0].id) : undefined
  if (!moId) {
    const mo = await payload.create({
      collection: 'manufacturing-orders',
      data: {
        moNumber: 'MO-DEMO-001',
        machine: machines['MCH-001'],
        product: products['WGT-A'],
        mould: moulds['MLD-WGT-A'],
        orderQty: 50000,
        remainQty: 42000,
        cycleTimePlanned: 45,
        status: 'active',
      },
    })
    moId = String(mo.id)
  }

  const employees = await payload.find({
    collection: 'employees',
    where: { employeeId: { equals: 'EMP-001' } },
    limit: 1,
  })
  const employee = employees.docs[0]
  if (!employee) return

  const snapExisting = await payload.find({
    collection: 'production-snapshots',
    where: { manufacturingOrder: { equals: moId } },
    limit: 1,
  })
  if (snapExisting.totalDocs === 0) {
    await payload.create({
      collection: 'production-snapshots',
      data: {
        machine: machines['MCH-001'],
        manufacturingOrder: moId,
        employee: String(employee.id),
        employeeId: employee.employeeId,
        status: 'submitted',
        actualCycleTime: 47,
        unitsProduced: 120,
        rejects: 2,
        stoppage: { occurred: false },
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

    await payload.create({
      collection: 'finance-report-lines',
      data: {
        period: periodId,
        company: companyId,
        sectionKey: 'profitability',
        lineType: 'standard',
        label: 'Revenue',
        amount: 1250000,
        priorPeriodAmount: 1180000,
      },
    })

    await payload.create({
      collection: 'financial-metrics',
      data: {
        period: periodId,
        company: companyId,
        metricKey: 'gross-margin-pct',
        value: 32.5,
        priorValue: 31.2,
      },
    })
  }
}

async function seedMaintenance(
  payload: Payload,
  machines: Record<string, string>,
  moulds: Record<string, string>,
) {
  const partExisting = await payload.find({
    collection: 'parts',
    where: { partNumber: { equals: 'PRT-HEATER-01' } },
    limit: 1,
  })

  let partId = partExisting.docs[0] ? String(partExisting.docs[0].id) : undefined
  if (!partId) {
    const part = await payload.create({
      collection: 'parts',
      data: {
        name: 'Heater Band 45mm',
        partNumber: 'PRT-HEATER-01',
        supplier: 'Industrial Parts Co',
      },
    })
    partId = String(part.id)
  }

  const jobExisting = await payload.find({
    collection: 'maintenance-jobs',
    where: { title: { equals: 'Mould service — Widget A' } },
    limit: 1,
  })
  if (jobExisting.totalDocs === 0) {
    await payload.create({
      collection: 'maintenance-jobs',
      data: {
        title: 'Mould service — Widget A',
        machine: machines['MCH-001'],
        mould: moulds['MLD-WGT-A'],
        status: 'open',
        trigger: 'shot_count',
        partsUsed: [{ part: partId, quantity: 2 }],
      },
    })
  }
}

async function seedSales(payload: Payload, companyId: string) {
  const periodExisting = await payload.find({
    collection: 'sales-performance-periods',
    where: { label: { equals: 'June 2026 Sales' } },
    limit: 1,
  })

  if (periodExisting.totalDocs > 0) return

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

  const employees = await payload.find({ collection: 'employees', limit: 1 })
  const employee = employees.docs[0]
  if (!employee) return

  await payload.create({
    collection: 'sales-targets',
    data: {
      period: String(period.id),
      employee: String(employee.id),
      revenueTarget: 500000,
      newBusinessTarget: 75000,
    },
  })

  await payload.create({
    collection: 'sales-actuals',
    data: {
      period: String(period.id),
      employee: String(employee.id),
      actualAmount: 425000,
      source: 'manual',
    },
  })

  await payload.create({
    collection: 'sales-activities',
    data: {
      period: String(period.id),
      employee: String(employee.id),
      activityType: 'hunt',
      careVisits: 6,
      conversions: 2,
    },
  })
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

  const employees = await payload.find({
    collection: 'employees',
    where: { employeeId: { equals: 'EMP-001' } },
    limit: 1,
  })
  const employee = employees.docs[0]
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
        scores: [{ kpiName: 'Accuracy', score: 2, weight: 1 }],
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
