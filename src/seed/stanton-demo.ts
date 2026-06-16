import type { Payload } from 'payload'
import { seedManufacturingWorkbook } from './manufacturing-workbook'

const DEMO_MARKER = 'stanton-demo-seed'

type SeedContext = {
  companies: Record<'stanton' | 'pimms', string>
  locations: Record<string, string>
  categories: Record<string, string>
  statuses: Record<string, string>
  ticketTypes: Record<string, string>
  employees: Record<string, string>
  teams: Record<string, string>
}

async function clearDemoData(payload: Payload) {
  await payload.delete({
    collection: 'users',
    where: { email: { contains: '@stanton-demo.local' } },
    overrideAccess: true,
  })

  const demoCompanies = await payload.find({
    collection: 'companies',
    where: { code: { in: ['STN', 'PIMMS'] } },
    limit: 10,
    overrideAccess: true,
  })
  const companyIds = demoCompanies.docs.map((c) => c.id)

  if (companyIds.length > 0) {
    const companyFilter = { company: { in: companyIds } }

    await payload.delete({ collection: 'asset-movements', where: companyFilter, overrideAccess: true })
    await payload.delete({ collection: 'tickets', where: companyFilter, overrideAccess: true })
    await payload.delete({ collection: 'assets', where: companyFilter, overrideAccess: true })
    await payload.delete({ collection: 'maintenance-teams', where: companyFilter, overrideAccess: true })
    await payload.delete({ collection: 'employees', where: companyFilter, overrideAccess: true })
    await payload.delete({ collection: 'locations', where: companyFilter, overrideAccess: true })
  }

  await payload.delete({
    collection: 'employees',
    where: { email: { contains: '@stanton-demo.local' } },
    overrideAccess: true,
  })

  await payload.delete({
    collection: 'ticket-types',
    where: { description: { contains: DEMO_MARKER } },
    overrideAccess: true,
  })
  await payload.delete({
    collection: 'asset-statuses',
    where: { description: { contains: DEMO_MARKER } },
    overrideAccess: true,
  })
  await payload.delete({
    collection: 'asset-categories',
    where: { description: { contains: DEMO_MARKER } },
    overrideAccess: true,
  })
  await payload.delete({
    collection: 'companies',
    where: { code: { in: ['STN', 'PIMMS'] } },
    overrideAccess: true,
  })
}

export async function seedStantonDemo(payload: Payload) {
  await clearDemoData(payload)

  const ctx: SeedContext = {
    companies: {} as SeedContext['companies'],
    locations: {},
    categories: {},
    statuses: {},
    ticketTypes: {},
    employees: {},
    teams: {},
  }

  const stanton = await payload.create({
    collection: 'companies',
    data: { name: 'Stanton Group', code: 'STN' },
    overrideAccess: true,
  })
  ctx.companies.stanton = String(stanton.id)

  const pimms = await payload.create({
    collection: 'companies',
    data: { name: 'PIMMS', code: 'PIMMS', parent: stanton.id },
    overrideAccess: true,
  })
  ctx.companies.pimms = String(pimms.id)

  for (const [key, name] of [
    ['injection', 'Injection Machines'],
    ['hvac', 'HVAC'],
    ['molds', 'Molds'],
    ['electrical', 'Electrical'],
    ['conveyors', 'Conveyors'],
  ] as const) {
    const doc = await payload.create({
      collection: 'asset-categories',
      data: { name, description: DEMO_MARKER },
      overrideAccess: true,
    })
    ctx.categories[key] = String(doc.id)
  }

  for (const [key, name] of [
    ['active', 'Active'],
    ['outOfService', 'Out of Service'],
    ['disposed', 'Disposed'],
  ] as const) {
    const doc = await payload.create({
      collection: 'asset-statuses',
      data: { name, description: DEMO_MARKER },
      overrideAccess: true,
    })
    ctx.statuses[key] = String(doc.id)
  }

  for (const [key, name] of [
    ['breakdown', 'Breakdown'],
    ['inspection', 'Inspection'],
    ['general', 'General'],
  ] as const) {
    const doc = await payload.create({
      collection: 'ticket-types',
      data: { name, description: DEMO_MARKER },
      overrideAccess: true,
    })
    ctx.ticketTypes[key] = String(doc.id)
  }

  const stantonRegion = await payload.create({
    collection: 'locations',
    data: {
      name: 'Gauteng Region',
      company: stanton.id,
      isGroup: true,
      kind: 'region',
      notes: DEMO_MARKER,
    },
    overrideAccess: true,
  })
  ctx.locations.stantonRegion = String(stantonRegion.id)

  const stantonBuilding = await payload.create({
    collection: 'locations',
    data: {
      name: 'Stanton HQ',
      company: stanton.id,
      parent: stantonRegion.id,
      isGroup: true,
      kind: 'building',
      notes: DEMO_MARKER,
    },
    overrideAccess: true,
  })
  ctx.locations.stantonBuilding = String(stantonBuilding.id)

  const stantonFloor = await payload.create({
    collection: 'locations',
    data: {
      name: 'Production Floor A',
      company: stanton.id,
      parent: stantonBuilding.id,
      isGroup: false,
      kind: 'floor',
      notes: DEMO_MARKER,
    },
    overrideAccess: true,
  })
  ctx.locations.stantonFloor = String(stantonFloor.id)

  const stantonWarehouse = await payload.create({
    collection: 'locations',
    data: {
      name: 'Warehouse Bay 3',
      company: stanton.id,
      parent: stantonBuilding.id,
      isGroup: false,
      kind: 'zone',
      notes: DEMO_MARKER,
    },
    overrideAccess: true,
  })
  ctx.locations.stantonWarehouse = String(stantonWarehouse.id)

  const pimmsRegion = await payload.create({
    collection: 'locations',
    data: {
      name: 'Western Cape',
      company: pimms.id,
      isGroup: true,
      kind: 'region',
      notes: DEMO_MARKER,
    },
    overrideAccess: true,
  })
  ctx.locations.pimmsRegion = String(pimmsRegion.id)

  const pimmsPlant = await payload.create({
    collection: 'locations',
    data: {
      name: 'PIMMS Plant 1',
      company: pimms.id,
      parent: pimmsRegion.id,
      isGroup: false,
      kind: 'building',
      notes: DEMO_MARKER,
    },
    overrideAccess: true,
  })
  ctx.locations.pimmsPlant = String(pimmsPlant.id)

  const employeeData = [
    { key: 'sarah', fullName: 'Sarah Ndlovu', company: stanton.id, jobTitle: 'Facilities Manager' },
    { key: 'james', fullName: 'James Mokoena', company: stanton.id, jobTitle: 'Senior Technician' },
    { key: 'lisa', fullName: 'Lisa van der Merwe', company: stanton.id, jobTitle: 'Production Supervisor' },
    { key: 'david', fullName: 'David Pillay', company: pimms.id, jobTitle: 'Maintenance Lead' },
    { key: 'nomsa', fullName: 'Nomsa Dlamini', company: pimms.id, jobTitle: 'Machine Operator' },
    { key: 'andre', fullName: 'André Botha', company: stanton.id, jobTitle: 'HVAC Specialist' },
    { key: 'thabo', fullName: 'Thabo Khumalo', company: stanton.id, jobTitle: 'Electrician' },
    { key: 'priya', fullName: 'Priya Naidoo', company: pimms.id, jobTitle: 'Quality Inspector' },
  ] as const

  for (const emp of employeeData) {
    const doc = await payload.create({
      collection: 'employees',
      data: {
        fullName: emp.fullName,
        company: emp.company,
        jobTitle: emp.jobTitle,
        email: `${emp.key}@stanton-demo.local`,
      },
      overrideAccess: true,
    })
    ctx.employees[emp.key] = String(doc.id)
  }

  const facilitiesTeam = await payload.create({
    collection: 'maintenance-teams',
    data: {
      name: 'Facilities',
      company: stanton.id,
      members: [ctx.employees.sarah, ctx.employees.andre, ctx.employees.james],
    },
    overrideAccess: true,
  })
  ctx.teams.facilities = String(facilitiesTeam.id)

  const machineShop = await payload.create({
    collection: 'maintenance-teams',
    data: {
      name: 'Machine Shop',
      company: stanton.id,
      members: [ctx.employees.james, ctx.employees.thabo, ctx.employees.lisa],
    },
    overrideAccess: true,
  })
  ctx.teams.machineShop = String(machineShop.id)

  const pimmsTeam = await payload.create({
    collection: 'maintenance-teams',
    data: {
      name: 'PIMMS Maintenance',
      company: pimms.id,
      members: [ctx.employees.david, ctx.employees.nomsa, ctx.employees.priya],
    },
    overrideAccess: true,
  })
  ctx.teams.pimms = String(pimmsTeam.id)

  await payload.create({
    collection: 'users',
    data: {
      email: 'admin@stanton-demo.local',
      password: 'demo1234',
      role: 'admin',
      employee: ctx.employees.sarah,
    },
    overrideAccess: true,
  })

  await payload.create({
    collection: 'users',
    data: {
      email: 'manager@stanton-demo.local',
      password: 'demo1234',
      role: 'manager',
      employee: ctx.employees.lisa,
    },
    overrideAccess: true,
  })

  const assetSpecs = [
    {
      key: 'inj1',
      name: 'Engel ES 330 Injection Moulder',
      tag: 'STN-INJ-001',
      company: stanton.id,
      location: stantonFloor.id,
      category: ctx.categories.injection,
      status: ctx.statuses.active,
      serialNumber: 'ENG-330-2019',
      tonnage: 330,
      team: ctx.teams.machineShop,
    },
    {
      key: 'inj2',
      name: 'Arburg Allrounder 470',
      tag: 'STN-INJ-002',
      company: stanton.id,
      location: stantonFloor.id,
      category: ctx.categories.injection,
      status: ctx.statuses.active,
      serialNumber: 'ARB-470-2021',
      tonnage: 170,
      team: ctx.teams.machineShop,
    },
    {
      key: 'hvac1',
      name: 'Carrier Chiller Unit 40RT',
      tag: 'STN-HVAC-001',
      company: stanton.id,
      location: stantonFloor.id,
      category: ctx.categories.hvac,
      status: ctx.statuses.active,
      team: ctx.teams.facilities,
    },
    {
      key: 'conv1',
      name: 'Overhead Conveyor Line B',
      tag: 'STN-CONV-001',
      company: stanton.id,
      location: stantonWarehouse.id,
      category: ctx.categories.conveyors,
      status: ctx.statuses.outOfService,
      team: ctx.teams.machineShop,
    },
    {
      key: 'mold1',
      name: 'Cap Mold CM-450',
      tag: 'STN-MLD-001',
      company: stanton.id,
      location: stantonWarehouse.id,
      category: ctx.categories.molds,
      status: ctx.statuses.active,
    },
    {
      key: 'elec1',
      name: 'Main Distribution Panel MDP-1',
      tag: 'STN-ELC-001',
      company: stanton.id,
      location: stantonFloor.id,
      category: ctx.categories.electrical,
      status: ctx.statuses.active,
      team: ctx.teams.facilities,
    },
    {
      key: 'pimms1',
      name: 'PIMMS Filling Line Alpha',
      tag: 'PIM-LINE-001',
      company: pimms.id,
      location: pimmsPlant.id,
      category: ctx.categories.conveyors,
      status: ctx.statuses.active,
      team: ctx.teams.pimms,
    },
    {
      key: 'pimms2',
      name: 'PIMMS CIP System',
      tag: 'PIM-CIP-001',
      company: pimms.id,
      location: pimmsPlant.id,
      category: ctx.categories.hvac,
      status: ctx.statuses.active,
      team: ctx.teams.pimms,
    },
  ] as const

  const assets: Record<string, string> = {}

  for (const spec of assetSpecs) {
    const doc = await payload.create({
      collection: 'assets',
      data: {
        name: spec.name,
        assetTag: spec.tag,
        company: spec.company,
        location: spec.location,
        category: spec.category,
        status: spec.status,
        serialNumber: 'serialNumber' in spec ? spec.serialNumber : undefined,
        tonnage: 'tonnage' in spec ? spec.tonnage : undefined,
        defaultTeam: 'team' in spec ? spec.team : undefined,
        notes: DEMO_MARKER,
      },
      overrideAccess: true,
    })
    assets[spec.key] = String(doc.id)
  }

  await payload.create({
    collection: 'asset-movements',
    data: {
      asset: assets.conv1,
      company: stanton.id,
      fromLocation: stantonFloor.id,
      toLocation: stantonWarehouse.id,
      movedBy: ctx.employees.james,
      movedAt: new Date(Date.now() - 7 * 86400000).toISOString(),
      reason: `Relocated for maintenance staging (${DEMO_MARKER})`,
    },
    overrideAccess: true,
  })

  const now = Date.now()
  const ticketSpecs = [
    {
      title: 'Injection moulder hydraulic leak',
      description: 'Oil pooling beneath ES 330 near clamp unit. Production halted on line 2.',
      type: ctx.ticketTypes.breakdown,
      priority: 'urgent' as const,
      status: 'in_progress' as const,
      reviewStatus: 'none' as const,
      company: stanton.id,
      location: stantonFloor.id,
      asset: assets.inj1,
      reportedBy: ctx.employees.lisa,
      reportedAt: new Date(now - 2 * 3600000).toISOString(),
      assignedTeam: ctx.teams.machineShop,
      assignedTo: ctx.employees.james,
    },
    {
      title: 'Chiller temperature drift',
      description: 'Supply temp reading 14°C vs setpoint 7°C for past 4 hours.',
      type: ctx.ticketTypes.breakdown,
      priority: 'high' as const,
      status: 'open' as const,
      reviewStatus: 'none' as const,
      company: stanton.id,
      location: stantonFloor.id,
      asset: assets.hvac1,
      reportedBy: ctx.employees.sarah,
      reportedAt: new Date(now - 5 * 3600000).toISOString(),
      assignedTeam: ctx.teams.facilities,
      assignedTo: ctx.employees.andre,
    },
    {
      title: 'Quarterly conveyor inspection',
      description: 'Scheduled inspection for overhead conveyor line B.',
      type: ctx.ticketTypes.inspection,
      priority: 'medium' as const,
      status: 'open' as const,
      reviewStatus: 'none' as const,
      company: stanton.id,
      location: stantonWarehouse.id,
      asset: assets.conv1,
      reportedBy: ctx.employees.sarah,
      reportedAt: new Date(now - 86400000).toISOString(),
      assignedTeam: ctx.teams.machineShop,
    },
    {
      title: 'MDP-1 thermal scan follow-up',
      description: 'Hot spot detected on breaker 4 during last scan.',
      type: ctx.ticketTypes.inspection,
      priority: 'medium' as const,
      status: 'completed' as const,
      reviewStatus: 'pending' as const,
      company: stanton.id,
      location: stantonFloor.id,
      asset: assets.elec1,
      reportedBy: ctx.employees.thabo,
      reportedAt: new Date(now - 3 * 86400000).toISOString(),
      assignedTeam: ctx.teams.facilities,
      assignedTo: ctx.employees.thabo,
      activity: [
        {
          kind: 'comment' as const,
          author: ctx.employees.thabo,
          body: 'Breaker 4 contacts cleaned and torqued to spec.',
          createdAt: new Date(now - 86400000).toISOString(),
        },
        {
          kind: 'completion' as const,
          author: ctx.employees.thabo,
          body: 'Thermal scan shows normal readings. Ready for review.',
          createdAt: new Date(now - 20 * 3600000).toISOString(),
        },
      ],
    },
    {
      title: 'PIMMS filling line jam sensor fault',
      description: 'Jam sensor triggering false positives on lane 3.',
      type: ctx.ticketTypes.breakdown,
      priority: 'high' as const,
      status: 'in_progress' as const,
      reviewStatus: 'none' as const,
      company: pimms.id,
      location: pimmsPlant.id,
      asset: assets.pimms1,
      reportedBy: ctx.employees.nomsa,
      reportedAt: new Date(now - 6 * 3600000).toISOString(),
      assignedTeam: ctx.teams.pimms,
      assignedTo: ctx.employees.david,
    },
    {
      title: 'CIP cycle duration anomaly',
      description: 'Last two CIP cycles ran 40% longer than baseline.',
      type: ctx.ticketTypes.general,
      priority: 'low' as const,
      status: 'open' as const,
      reviewStatus: 'none' as const,
      company: pimms.id,
      location: pimmsPlant.id,
      asset: assets.pimms2,
      reportedBy: ctx.employees.priya,
      reportedAt: new Date(now - 12 * 3600000).toISOString(),
      assignedTeam: ctx.teams.pimms,
    },
    {
      title: 'Mold storage humidity check',
      description: 'Routine environmental check for mold storage bay.',
      type: ctx.ticketTypes.inspection,
      priority: 'low' as const,
      status: 'completed' as const,
      reviewStatus: 'verified' as const,
      company: stanton.id,
      location: stantonWarehouse.id,
      asset: assets.mold1,
      reportedBy: ctx.employees.sarah,
      reportedAt: new Date(now - 10 * 86400000).toISOString(),
      assignedTeam: ctx.teams.facilities,
      assignedTo: ctx.employees.andre,
      activity: [
        {
          kind: 'comment' as const,
          author: ctx.employees.andre,
          body: 'Humidity within acceptable range. Dehumidifier filters replaced.',
          createdAt: new Date(now - 9 * 86400000).toISOString(),
        },
        {
          kind: 'review' as const,
          author: ctx.employees.sarah,
          body: 'Verified — good work.',
          createdAt: new Date(now - 8 * 86400000).toISOString(),
        },
      ],
    },
    {
      title: 'Arburg heater band replacement',
      description: 'Zone 3 heater band failed during startup.',
      type: ctx.ticketTypes.breakdown,
      priority: 'high' as const,
      status: 'cancelled' as const,
      reviewStatus: 'none' as const,
      company: stanton.id,
      location: stantonFloor.id,
      asset: assets.inj2,
      reportedBy: ctx.employees.lisa,
      reportedAt: new Date(now - 5 * 86400000).toISOString(),
      assignedTeam: ctx.teams.machineShop,
      activity: [
        {
          kind: 'comment' as const,
          author: ctx.employees.james,
          body: 'Duplicate ticket — merged with TKT-00003.',
          createdAt: new Date(now - 4 * 86400000).toISOString(),
        },
      ],
    },
  ]

  for (const ticket of ticketSpecs) {
    await payload.create({
      collection: 'tickets',
      data: ticket,
      overrideAccess: true,
    })
  }

  const manufacturing = await seedManufacturingWorkbook(payload, {
    companyId: String(stanton.id),
  })

  return {
    marker: DEMO_MARKER,
    companies: 2,
    locations: 7,
    employees: employeeData.length,
    teams: 3,
    assets: assetSpecs.length,
    tickets: ticketSpecs.length,
    manufacturing,
  }
}
