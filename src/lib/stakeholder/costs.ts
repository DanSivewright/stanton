/** Client-facing operating estimates (vendor × 1.5 agency allowance). Internal vendor figures are not exposed. */

const MARKUP = 1.5

function band(min: number, max: number): string {
  const lo = Math.round(min * MARKUP)
  const hi = Math.round(max * MARKUP)
  if (lo === hi) return `$${lo}`
  return `$${lo}–$${hi}`
}

export type CostRow = {
  service: string
  mvp: string
  production: string
  notes: string
}

export const costRows: CostRow[] = [
  {
    service: 'Application hosting',
    mvp: band(20, 40),
    production: band(40, 150),
    notes: 'Web app, API, and management portal',
  },
  {
    service: 'Database',
    mvp: band(0, 25),
    production: band(57, 150),
    notes: 'Scales with production snapshots and history',
  },
  {
    service: 'File storage',
    mvp: band(0, 10),
    production: band(20, 80),
    notes: 'Documents, photos, exports',
  },
  {
    service: 'Email delivery',
    mvp: band(0, 20),
    production: band(20, 80),
    notes: 'Alerts and report distribution',
  },
  {
    service: 'Monitoring',
    mvp: band(0, 26),
    production: band(26, 80),
    notes: 'Error tracking and operational visibility',
  },
  {
    service: 'Intelligent assistant (when live)',
    mvp: '$0',
    production: `${band(50, 500)}/mo`,
    notes: 'Usage-based; enabled in Phase 3',
  },
]

export const costRollups = [
  {
    stage: 'Launch (MVP)',
    range: band(25, 120) + '/mo',
    blurb: 'Internal users, light traffic, core factory and reporting modules.',
  },
  {
    stage: 'Steady operations',
    range: band(150, 600) + '/mo',
    blurb: 'Daily production rounds, growing document volume, scheduled jobs.',
  },
  {
    stage: 'With assistant active',
    range: band(250, 1200) + '/mo',
    blurb: 'Adds AI query usage on top of production footprint.',
  },
]

export const costFootnotes = [
  'Figures are indicative monthly allowances in USD, excluding VAT and one-time implementation fees.',
  'Some services (AI usage, storage overages) may be managed-service fees rather than flat tiers.',
  'Odoo, Microsoft, and Pipedrive licences remain client-owned where applicable.',
  'South Africa data residency and 24/7 support expectations to be confirmed separately.',
]
