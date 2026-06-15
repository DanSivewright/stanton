export type MachineStatus = 'running' | 'stopped' | 'scheduled' | 'changeover' | 'offline'

export interface Machine {
  id: string
  code: string
  name: string
  factory: string
  status: MachineStatus
  oee: number
  plannedCycle: number
  actualCycle: number
  unitsPerHour: number
  targetUnitsPerHour: number
  product: string
  stockCode: string
  mo: string
  rejectRate: number
  shotCount: number
  shotWarning: boolean
  shotServiceDue: boolean
  isRobotic: boolean
  operator?: string
  employeeId?: string
  stoppageReason?: string
}

export interface Employee {
  id: string
  employeeId: string
  firstName: string
  surname: string
  company: string
  department: string
  role: string
  manager: string
  contractStatus: 'draft' | 'submitted' | 'approved' | 'needs_changes'
  reviewDue: string
  accuracyScore: number
  runsScore: number
}

export interface FinanceReport {
  id: string
  name: string
  description: string
  lastGenerated: string
  status: 'ready' | 'scheduled' | 'generating'
}

export interface SalesRep {
  id: string
  name: string
  team: string
  department: string
  target: number
  planned: number
  actual: number
  huntActivities: number
  huntTarget: number
  careVisits: number
  careTarget: number
  leadConversion: number
}

export interface SpdProject {
  id: string
  name: string
  client: string
  phase: number
  phaseName: string
  stage: string
  status: 'on_track' | 'behind' | 'at_risk' | 'complete'
  progress: number
  businessLead: string
  pdm: string
  daysInPhase: number
  gatePending?: string
}

export interface MaintenanceJob {
  id: string
  machineId: string
  machineCode: string
  type: 'scheduled' | 'breakdown' | 'shot_threshold'
  status: 'open' | 'in_progress' | 'complete'
  priority: 'low' | 'medium' | 'high' | 'critical'
  technician?: string
  openedAt: string
  shotCount?: number
  notes: string
}

export const companies = ['PIMMS Group JHB', 'Stanton Global', 'PMG']

export const factories = [
  { id: 'f1', name: 'Factory A — Johannesburg', code: 'JHB-A' },
  { id: 'f2', name: 'Factory B — Johannesburg', code: 'JHB-B' },
  { id: 'f3', name: 'Factory C — Cape Town', code: 'CPT-C' },
]

const products = [
  { stock: 'CL-500', name: 'Container Lid 500ml' },
  { stock: 'BT-250', name: 'Bottle 250ml Clear' },
  { stock: 'CP-100', name: 'Cap Push-Fit 100' },
  { stock: 'TR-750', name: 'Tray 750g Food Grade' },
  { stock: 'HD-200', name: 'Hinged Lid 200ml' },
  { stock: 'SP-400', name: 'Spray Pump Housing' },
]

function machine(
  i: number,
  factory: string,
  overrides: Partial<Machine> = {},
): Machine {
  const p = products[i % products.length]
  const oee = overrides.oee ?? 55 + (i % 30)
  const planned = 28 + (i % 8)
  const actual = planned + (i % 5) - 2
  const status =
    overrides.status ??
    (i % 11 === 0 ? 'stopped' : i % 13 === 0 ? 'changeover' : i % 17 === 0 ? 'scheduled' : 'running')
  const shots = 8000 + i * 420
  return {
    id: `m${i}`,
    code: `IM-${String(i).padStart(2, '0')}`,
    name: `Injection Moulder ${i}`,
    factory,
    status,
    oee,
    plannedCycle: planned,
    actualCycle: actual,
    unitsPerHour: Math.round(3600 / actual),
    targetUnitsPerHour: Math.round(3600 / planned),
    product: p.name,
    stockCode: p.stock,
    mo: `MO-2026-${String(1000 + i).slice(1)}`,
    rejectRate: i % 7 === 0 ? 2.8 : i % 5 === 0 ? 1.4 : 0.6,
    shotCount: shots,
    shotWarning: shots >= 15000,
    shotServiceDue: shots >= 20000,
    isRobotic: i % 4 === 0,
    operator: status === 'running' ? ['Thabo M.', 'Sarah K.', 'Pieter V.', 'Nomsa D.'][i % 4] : undefined,
    employeeId: status === 'running' ? `EMP-${String(200 + (i % 20)).padStart(4, '0')}` : undefined,
    stoppageReason: status === 'stopped' ? 'Hydraulic pressure drop — awaiting maintenance' : undefined,
    ...overrides,
  }
}

export const machines: Machine[] = [
  ...Array.from({ length: 14 }, (_, i) => machine(i + 1, 'Factory A — Johannesburg')),
  ...Array.from({ length: 13 }, (_, i) => machine(i + 15, 'Factory B — Johannesburg')),
  ...Array.from({ length: 13 }, (_, i) => machine(i + 28, 'Factory C — Cape Town')),
]

export const employees: Employee[] = [
  { id: 'e1', employeeId: 'EMP-0201', firstName: 'Thabo', surname: 'Molefe', company: 'PIMMS Group JHB', department: 'Production', role: 'Machine Operator', manager: 'Johan Botha', contractStatus: 'approved', reviewDue: '2026-07-01', accuracyScore: 4.2, runsScore: 3.8 },
  { id: 'e2', employeeId: 'EMP-0202', firstName: 'Sarah', surname: 'Khumalo', company: 'PIMMS Group JHB', department: 'Production', role: 'Line Manager', manager: 'Trevor Walsh', contractStatus: 'approved', reviewDue: '2026-07-01', accuracyScore: 4.5, runsScore: 4.1 },
  { id: 'e3', employeeId: 'EMP-0203', firstName: 'Pieter', surname: 'Van Wyk', company: 'Stanton Global', department: 'Production', role: 'Setter', manager: 'Johan Botha', contractStatus: 'submitted', reviewDue: '2026-07-15', accuracyScore: 3.9, runsScore: 4.0 },
  { id: 'e4', employeeId: 'EMP-0204', firstName: 'Nomsa', surname: 'Dlamini', company: 'PIMMS Group JHB', department: 'Quality', role: 'Quality Inspector', manager: 'Linda Pretorius', contractStatus: 'approved', reviewDue: '2026-07-01', accuracyScore: 4.7, runsScore: 4.3 },
  { id: 'e5', employeeId: 'EMP-0205', firstName: 'Johan', surname: 'Botha', company: 'PIMMS Group JHB', department: 'Production', role: 'Production Manager', manager: 'Trevor Walsh', contractStatus: 'approved', reviewDue: '2026-06-30', accuracyScore: 4.4, runsScore: 4.2 },
  { id: 'e6', employeeId: 'EMP-0206', firstName: 'Morganna', surname: 'Kirkman', company: 'PIMMS Group JHB', department: 'Human Resources', role: 'HR Director', manager: 'Trevor Walsh', contractStatus: 'approved', reviewDue: '2026-07-01', accuracyScore: 4.8, runsScore: 4.6 },
  { id: 'e7', employeeId: 'EMP-0207', firstName: 'Conrad', surname: 'Eksteen', company: 'Stanton Global', department: 'Product Development', role: 'Head of Design', manager: 'Trevor Walsh', contractStatus: 'approved', reviewDue: '2026-07-15', accuracyScore: 4.3, runsScore: 4.0 },
  { id: 'e8', employeeId: 'EMP-0208', firstName: 'David', surname: 'Naidoo', company: 'PIMMS Group JHB', department: 'Sales', role: 'Sales Rep', manager: 'Karen Smith', contractStatus: 'draft', reviewDue: '2026-08-01', accuracyScore: 3.5, runsScore: 3.7 },
]

export const financeReports: FinanceReport[] = [
  { id: 'profitability', name: 'Profitability', description: 'Revenue, gross profit, net profit — current vs prior period + YoY', lastGenerated: '2026-05-12', status: 'ready' },
  { id: 'debtors', name: 'Debtors Aging', description: 'Outstanding debtors by bucket (30/60/90/120+ days)', lastGenerated: '2026-05-12', status: 'ready' },
  { id: 'creditors', name: 'Creditors Aging', description: 'Outstanding creditors by aging bucket', lastGenerated: '2026-05-12', status: 'ready' },
  { id: 'invoice-target', name: 'Invoice vs Target', description: 'Actual invoiced revenue vs target by division', lastGenerated: '2026-05-12', status: 'ready' },
  { id: 'wages', name: 'Wages & Salaries %', description: 'Total payroll as percentage of revenue', lastGenerated: '2026-05-12', status: 'ready' },
  { id: 'ratios', name: 'Financial Ratios', description: 'Gross margin, net margin, current ratio, quick ratio, D/E', lastGenerated: '2026-05-12', status: 'ready' },
  { id: 'debt', name: 'Good vs Bad Debt', description: 'Debt classified by collectability', lastGenerated: '2026-05-12', status: 'ready' },
  { id: 'sales', name: 'Sales Reporting', description: 'Target vs forecast — actuals from Odoo', lastGenerated: '2026-05-12', status: 'scheduled' },
]

export const salesReps: SalesRep[] = [
  { id: 's1', name: 'David Naidoo', team: 'Industrial', department: 'Sales JHB', target: 2400000, planned: 2280000, actual: 2150000, huntActivities: 42, huntTarget: 40, careVisits: 7, careTarget: 8, leadConversion: 32 },
  { id: 's2', name: 'Karen Smith', team: 'Industrial', department: 'Sales JHB', target: 3100000, planned: 3050000, actual: 2980000, huntActivities: 38, huntTarget: 40, careVisits: 9, careTarget: 8, leadConversion: 28 },
  { id: 's3', name: 'James Wilson', team: 'Retail', department: 'Sales CPT', target: 1800000, planned: 1650000, actual: 1420000, huntActivities: 35, huntTarget: 40, careVisits: 6, careTarget: 8, leadConversion: 22 },
  { id: 's4', name: 'Lisa Govender', team: 'Retail', department: 'Sales CPT', target: 2200000, planned: 2180000, actual: 2090000, huntActivities: 44, huntTarget: 40, careVisits: 8, careTarget: 8, leadConversion: 35 },
  { id: 's5', name: 'Michael Brown', team: 'Export', department: 'Sales Global', target: 4500000, planned: 4200000, actual: 3850000, huntActivities: 30, huntTarget: 40, careVisits: 5, careTarget: 8, leadConversion: 18 },
]

export const spdProjects: SpdProject[] = [
  { id: 'spd-001', name: 'AquaPure 750ml Bottle', client: 'AquaPure Ltd', phase: 4, phaseName: 'Tooling & Industrialisation', stage: '4.2 Production Engineering', status: 'on_track', progress: 68, businessLead: 'David Naidoo', pdm: 'Conrad Eksteen', daysInPhase: 34, gatePending: 'Gate 4 — Product Gate' },
  { id: 'spd-002', name: 'MedDevice Housing v2', client: 'Medena Health', phase: 3, phaseName: 'Engineering & Validation', stage: '3.2 Prototype Build', status: 'behind', progress: 52, businessLead: 'Karen Smith', pdm: 'Conrad Eksteen', daysInPhase: 48 },
  { id: 'spd-003', name: 'FoodTray Pro 1.2kg', client: 'RetailCo SA', phase: 2, phaseName: 'Design Foundation', stage: '2.3 Design Freeze Prep', status: 'on_track', progress: 38, businessLead: 'Lisa Govender', pdm: 'Conrad Eksteen', daysInPhase: 21, gatePending: 'Gate 2 — Design Freeze' },
  { id: 'spd-004', name: 'Spray Pump Gen3', client: 'Pallchem', phase: 1, phaseName: 'Opportunity & Feasibility', stage: '1.2 Commercial Feasibility', status: 'on_track', progress: 18, businessLead: 'Michael Brown', pdm: 'Conrad Eksteen', daysInPhase: 12 },
  { id: 'spd-005', name: 'Hinged Lid Family', client: 'Stanton Internal', phase: 5, phaseName: 'Market Ready', stage: '5.1 Final Documentation', status: 'at_risk', progress: 84, businessLead: 'David Naidoo', pdm: 'Conrad Eksteen', daysInPhase: 56, gatePending: 'Gate 5 — Market Ready' },
  { id: 'spd-006', name: 'Cap Push-Fit 100 Rev B', client: 'Tego Plastics', phase: 6, phaseName: 'Post-Launch', stage: '6.1 Post-Launch Surveillance', status: 'complete', progress: 95, businessLead: 'James Wilson', pdm: 'Conrad Eksteen', daysInPhase: 14 },
]

export const spdPhases = [
  { num: 1, name: 'Opportunity & Feasibility', gate: 'Gate 1 — Opportunity Review' },
  { num: 2, name: 'Design Foundation', gate: 'Gate 2 — Design Freeze' },
  { num: 3, name: 'Engineering & Validation', gate: 'Gate 3 — Tooling Release' },
  { num: 4, name: 'Tooling & Industrialisation', gate: 'Gate 4 — Product Gate' },
  { num: 5, name: 'Market Ready', gate: 'Gate 5 — Market Ready Sign-Off' },
  { num: 6, name: 'Post-Launch & CI', gate: null },
]

export const maintenanceJobs: MaintenanceJob[] = [
  { id: 'mj1', machineId: 'm11', machineCode: 'IM-11', type: 'breakdown', status: 'in_progress', priority: 'critical', technician: 'Andre Fourie', openedAt: '2026-06-11 06:42', notes: 'Hydraulic pressure drop — seal replacement in progress' },
  { id: 'mj2', machineId: 'm07', machineCode: 'IM-07', type: 'shot_threshold', status: 'open', priority: 'high', openedAt: '2026-06-11 05:15', shotCount: 20140, notes: 'Mould CL-500 reached 20,000 shots — service due' },
  { id: 'mj3', machineId: 'm22', machineCode: 'IM-22', type: 'scheduled', status: 'open', priority: 'medium', openedAt: '2026-06-10 14:00', notes: 'Quarterly preventive maintenance' },
  { id: 'mj4', machineId: 'm03', machineCode: 'IM-03', type: 'shot_threshold', status: 'complete', priority: 'medium', technician: 'Sipho Ndlovu', openedAt: '2026-06-08 09:30', shotCount: 20050, notes: 'Mould service complete — shot counter reset' },
  { id: 'mj5', machineId: 'm35', machineCode: 'IM-35', type: 'breakdown', status: 'open', priority: 'high', openedAt: '2026-06-11 08:10', notes: 'Barrel heater failure — parts on order PO-8842' },
]

export const toolChangeAllocations = [
  { product: 'Container Lid 500ml', allocatedMins: 45, actualMins: 52, overrun: true },
  { product: 'Bottle 250ml Clear', allocatedMins: 60, actualMins: 58, overrun: false },
  { product: 'Cap Push-Fit 100', allocatedMins: 30, actualMins: 28, overrun: false },
  { product: 'Tray 750g Food Grade', allocatedMins: 75, actualMins: 91, overrun: true },
]

export const qualityChecklist = [
  { id: 'q1', item: 'First-off part dimensional check', required: true, completed: true },
  { id: 'q2', item: 'Wall thickness verification (3 points)', required: true, completed: true },
  { id: 'q3', item: 'Surface finish visual inspection', required: true, completed: false },
  { id: 'q4', item: 'Flash and burr check', required: true, completed: false },
  { id: 'q5', item: 'Material lot traceability recorded', required: true, completed: true },
  { id: 'q6', item: 'Colour match to master sample', required: false, completed: false },
]

export const planningSnapshots = [
  { id: 'ps1', date: '2026-06-11 07:00', uploadedBy: 'Johan Botha', machines: 40, changes: 3 },
  { id: 'ps2', date: '2026-06-10 07:00', uploadedBy: 'Johan Botha', machines: 40, changes: 7 },
  { id: 'ps3', date: '2026-06-09 07:00', uploadedBy: 'Sarah Khumalo', machines: 40, changes: 2 },
  { id: 'ps4', date: '2026-06-08 07:00', uploadedBy: 'Johan Botha', machines: 40, changes: 5 },
]

export const hourlySnapshots = ['07:00', '10:00', '13:00', '16:00', '19:00']

export function oeeColor(oee: number): string {
  if (oee >= 70) return 'good'
  if (oee >= 60) return 'warn'
  return 'bad'
}

export function formatCurrency(n: number): string {
  if (n >= 1_000_000) return `R ${(n / 1_000_000).toFixed(2)}M`
  if (n >= 1_000) return `R ${(n / 1_000).toFixed(0)}K`
  return `R ${n.toLocaleString()}`
}

export function formatPct(n: number): string {
  return `${n.toFixed(1)}%`
}

export const platformNav = [
  { href: '/platform', label: 'Command Centre', icon: '◉' },
  { href: '/platform/manufacturing', label: 'Manufacturing', icon: '⚙' },
  { href: '/platform/manufacturing/operator', label: 'Operator Input', icon: '▣', nested: true },
  { href: '/platform/manufacturing/tool-change', label: 'Tool Change', icon: '↻', nested: true },
  { href: '/platform/manufacturing/tv', label: 'TV Display', icon: '▢', nested: true },
  { href: '/platform/finance', label: 'Finance', icon: '◈' },
  { href: '/platform/hr', label: 'Human Resources', icon: '◎' },
  { href: '/platform/sales', label: 'Sales Performance', icon: '◆' },
  { href: '/platform/spd', label: 'Product Development', icon: '◇' },
  { href: '/platform/maintenance', label: 'Maintenance', icon: '🔧' },
] as const
