/**
 * Synthetic SPD process template derived from docs/intake/SPD brief + docs/modules/spd.md.
 * Stand-in until SPD_ProcessFlow.docx is reconciled (BUI-288 / SPD-002).
 */

export const SYNTHETIC_TEMPLATE_VERSION = '1.0-synthetic'
export const SYNTHETIC_TEMPLATE_NAME = 'Stanton Product Development (Synthetic v1)'

type SpdRole =
  | 'business-lead'
  | 'pdm'
  | 'product-director'
  | 'design-lead'
  | 'quality-lead'
  | 'manufacturing-lead'
  | 'tooling-lead'
  | 'process-lead'

type RasciEntry = { role: SpdRole; responsibility: 'R' | 'A' | 'S' | 'C' | 'I' }
type GateSeed = {
  gateId: string
  name: string
  description: string
  requiredRoles: SpdRole[]
}

type StageSeed = {
  stageId: string
  name: string
  order: number
  checklistItems: { item: string }[]
  deliverables: { name: string }[]
  gate?: GateSeed
  rasci?: RasciEntry[]
}

type PhaseSeed = {
  phaseId: string
  name: string
  order: number
  stages: StageSeed[]
}

const gateRasci: RasciEntry[] = [
  { role: 'pdm', responsibility: 'A' },
  { role: 'product-director', responsibility: 'A' },
  { role: 'business-lead', responsibility: 'C' },
]

function items(...labels: string[]): { item: string }[] {
  return labels.map((item) => ({ item }))
}

function outputs(...names: string[]): { name: string }[] {
  return names.map((name) => ({ name }))
}

function gate(
  gateId: string,
  name: string,
  description: string,
  requiredRoles: GateSeed['requiredRoles'],
): GateSeed {
  return { gateId, name, description, requiredRoles }
}

export const syntheticSpdPhases: PhaseSeed[] = [
  {
    phaseId: 'phase-1',
    name: 'Opportunity & Feasibility',
    order: 1,
    stages: [
      {
        stageId: 'stage-1-1',
        name: 'Market & Problem Definition',
        order: 1,
        checklistItems: items(
          'Define target market segment and customer pain',
          'Draft problem statement and value proposition',
          'Capture indicative volume and price ranges',
        ),
        deliverables: outputs('Problem Statement', 'Value Proposition', 'Volume/Price Ranges'),
        rasci: [
          { role: 'business-lead', responsibility: 'R' },
          { role: 'pdm', responsibility: 'A' },
          { role: 'product-director', responsibility: 'C' },
        ],
      },
      {
        stageId: 'stage-1-2',
        name: 'Commercial Feasibility',
        order: 2,
        checklistItems: items(
          'Complete commercial feasibility summary',
          'Produce early pricing estimate (±30–40%)',
          'Document commercial and technical risks',
        ),
        deliverables: outputs(
          'Commercial Feasibility Summary',
          'Early Pricing Estimate',
          'Risk Map',
        ),
        rasci: [
          { role: 'business-lead', responsibility: 'R' },
          { role: 'pdm', responsibility: 'A' },
          { role: 'product-director', responsibility: 'C' },
        ],
      },
      {
        stageId: 'stage-1-3',
        name: 'Product Opportunity Definition',
        order: 3,
        checklistItems: items(
          'Assemble Product & Market Definition Pack',
          'Confirm gate 1 entry criteria met',
          'Schedule Opportunity Review sign-off',
        ),
        deliverables: outputs('Product & Market Definition Pack', 'Gate 1 Submission Pack'),
        gate: gate(
          'gate-1',
          'Opportunity Review',
          'Approve opportunity to proceed into design foundation.',
          ['pdm', 'product-director', 'business-lead'],
        ),
        rasci: gateRasci,
      },
    ],
  },
  {
    phaseId: 'phase-2',
    name: 'Design Foundation',
    order: 2,
    stages: [
      {
        stageId: 'stage-2-1',
        name: 'Requirements & Architecture Definition',
        order: 1,
        checklistItems: items(
          'Publish PDS v1 and functional architecture',
          'Shortlist materials and draft BOM v1',
          'Define KTF/KTQ critical-to-quality items',
        ),
        deliverables: outputs(
          'PDS v1',
          'Functional Architecture',
          'Material Shortlist',
          'BOM v1',
          'KTF/KTQ Register',
        ),
        rasci: [
          { role: 'design-lead', responsibility: 'R' },
          { role: 'pdm', responsibility: 'A' },
          { role: 'quality-lead', responsibility: 'C' },
        ],
      },
      {
        stageId: 'stage-2-2',
        name: 'Concept Design & Concept Selection',
        order: 2,
        checklistItems: items(
          'Produce concept sketches and early CAD',
          'Run concept evaluation and selection',
          'Update PDS to v2',
        ),
        deliverables: outputs(
          'Concept Sketches',
          'Early CAD',
          'Concept Evaluation Summary',
          'PDS v2',
        ),
        rasci: [
          { role: 'design-lead', responsibility: 'R' },
          { role: 'pdm', responsibility: 'A' },
          { role: 'product-director', responsibility: 'C' },
        ],
      },
      {
        stageId: 'stage-2-3',
        name: 'Design Definition & Freeze Prep',
        order: 3,
        checklistItems: items(
          'Complete CAD v1 and BOM v2',
          'Publish PDS v3 and Design Architecture Pack',
          'Prepare Design Freeze gate submission',
        ),
        deliverables: outputs('CAD v1', 'BOM v2', 'PDS v3', 'Design Architecture Pack'),
        gate: gate(
          'gate-2',
          'Design Freeze',
          'Freeze design baseline before engineering validation.',
          ['product-director', 'design-lead', 'pdm'],
        ),
        rasci: gateRasci,
      },
    ],
  },
  {
    phaseId: 'phase-3',
    name: 'Engineering & Validation',
    order: 3,
    stages: [
      {
        stageId: 'stage-3-1',
        name: 'Simulation Engineering (MFA/FEA)',
        order: 1,
        checklistItems: items(
          'Run MFA and FEA analyses',
          'Complete tolerance analysis',
          'Compile Simulation & Validation Pack',
        ),
        deliverables: outputs(
          'MFA Report',
          'FEA Report',
          'Tolerance Analysis',
          'Simulation & Validation Pack',
        ),
        rasci: [
          { role: 'process-lead', responsibility: 'R' },
          { role: 'pdm', responsibility: 'A' },
          { role: 'design-lead', responsibility: 'C' },
        ],
      },
      {
        stageId: 'stage-3-2',
        name: 'Prototype Build & Validation',
        order: 2,
        checklistItems: items(
          'Build prototype parts and run test programme',
          'Update CAD to v3 and PDS to v4',
          'Assemble Prototyping & Evidence Pack',
        ),
        deliverables: outputs(
          'Prototype Parts',
          'Test Results',
          'CAD v3',
          'PDS v4',
          'Prototyping & Evidence Pack',
        ),
        rasci: [
          { role: 'design-lead', responsibility: 'R' },
          { role: 'quality-lead', responsibility: 'C' },
          { role: 'pdm', responsibility: 'A' },
        ],
      },
      {
        stageId: 'stage-3-3',
        name: 'Engineering DFM & Tooling Spec',
        order: 3,
        checklistItems: items(
          'Complete tooling spec (DFT) and tool BOM',
          'Prepare RFQ package for tool build',
          'Submit Tooling Release gate pack',
        ),
        deliverables: outputs(
          'Tooling Spec (DFT)',
          'Tool BOM',
          'RFQ Package',
          'Tooling Definition Pack',
        ),
        gate: gate(
          'gate-3',
          'Tooling Release',
          'Release design to tooling and industrialisation.',
          ['tooling-lead', 'product-director', 'pdm'],
        ),
        rasci: gateRasci,
      },
    ],
  },
  {
    phaseId: 'phase-4',
    name: 'Tooling & Industrialisation',
    order: 4,
    stages: [
      {
        stageId: 'stage-4-1',
        name: 'Tool Build & T1/T2/Tn Trials',
        order: 1,
        checklistItems: items(
          'Complete tool build and trial runs (T1/T2/Tn)',
          'Capture trial reports and CPK studies',
          'Assemble Tooling Trial Pack',
        ),
        deliverables: outputs(
          'Trial Parts',
          'Trial Reports',
          'CPK Studies',
          'Tooling Trial Pack',
        ),
        rasci: [
          { role: 'tooling-lead', responsibility: 'R' },
          { role: 'pdm', responsibility: 'A' },
          { role: 'process-lead', responsibility: 'C' },
        ],
      },
      {
        stageId: 'stage-4-2',
        name: 'Production Engineering & Assembly Setup',
        order: 2,
        checklistItems: items(
          'Define assembly flow and takt time',
          'Plan jigs/fixtures and final BOM',
          'Publish Product Configuration Pack',
        ),
        deliverables: outputs(
          'Assembly Flow',
          'Takt Time Study',
          'Jig/Fixture Plan',
          'Final BOM',
          'Product Configuration Pack',
        ),
        rasci: [
          { role: 'manufacturing-lead', responsibility: 'R' },
          { role: 'pdm', responsibility: 'A' },
          { role: 'tooling-lead', responsibility: 'C' },
        ],
      },
      {
        stageId: 'stage-4-3',
        name: 'Pilot Run & Production Validation',
        order: 3,
        checklistItems: items(
          'Complete part FAI, product FAI, and CPK',
          'Run pilot and compile validation report',
          'Prepare Product Gate submission',
        ),
        deliverables: outputs(
          'Part FAI',
          'Product FAI',
          'CPK Report',
          'Pilot Run Report',
          'Commercial Viability Pack',
        ),
        gate: gate(
          'gate-4',
          'Product Gate',
          'Confirm product and process ready for market documentation.',
          ['product-director', 'manufacturing-lead', 'quality-lead'],
        ),
        rasci: gateRasci,
      },
    ],
  },
  {
    phaseId: 'phase-5',
    name: 'Market Ready',
    order: 5,
    stages: [
      {
        stageId: 'stage-5-1',
        name: 'Final Documentation Assembly',
        order: 1,
        checklistItems: items(
          'Assemble processing, assembly, mould maintenance, QC, and product life books',
          'Verify document completeness against checklist',
        ),
        deliverables: outputs(
          'Processing Book',
          'Assemble Book',
          'Mould Maintenance Book',
          'QC Book',
          'Product Life Book',
        ),
        rasci: [
          { role: 'quality-lead', responsibility: 'R' },
          { role: 'pdm', responsibility: 'A' },
        ],
      },
      {
        stageId: 'stage-5-2',
        name: 'Commercial Launch Pack Finalisation',
        order: 2,
        checklistItems: items(
          'Finalise commercial viability pack and datasheet',
          'Prepare marketing asset bundle',
        ),
        deliverables: outputs(
          'Final Commercial Viability Pack',
          'Product Datasheet',
          'Marketing Assets',
        ),
        rasci: [
          { role: 'business-lead', responsibility: 'R' },
          { role: 'pdm', responsibility: 'A' },
        ],
      },
      {
        stageId: 'stage-5-3',
        name: 'Supply Chain & QA Release',
        order: 3,
        checklistItems: items(
          'Execute manufacturing and supply agreements',
          'Publish surveillance plans',
          'Submit Market Ready gate pack',
        ),
        deliverables: outputs(
          'Manufacturing Agreement',
          'Supply Agreement',
          'Surveillance Plans',
          'Gate 5 Pack',
        ),
        gate: gate(
          'gate-5',
          'Market Ready Sign-Off',
          'Authorise commercial launch and supply release.',
          ['product-director', 'business-lead', 'quality-lead'],
        ),
        rasci: gateRasci,
      },
    ],
  },
  {
    phaseId: 'phase-6',
    name: 'Post-Launch & Continuous Improvement',
    order: 6,
    stages: [
      {
        stageId: 'stage-6-1',
        name: 'Post-Launch Surveillance',
        order: 1,
        checklistItems: items(
          'Monitor tooling and production stability',
          'Review QC trends post-launch',
        ),
        deliverables: outputs(
          'Tooling Surveillance Report',
          'Production Stability Report',
          'QC Trend Analysis',
        ),
        rasci: [
          { role: 'quality-lead', responsibility: 'R' },
          { role: 'pdm', responsibility: 'A' },
        ],
      },
      {
        stageId: 'stage-6-2',
        name: 'Field Performance & Customer Feedback',
        order: 2,
        checklistItems: items(
          'Collect field performance data',
          'Summarise customer feedback and ECO requests',
        ),
        deliverables: outputs(
          'Field Performance Report',
          'Customer Feedback Summary',
          'ECO Requests Log',
        ),
        rasci: [
          { role: 'business-lead', responsibility: 'R' },
          { role: 'pdm', responsibility: 'A' },
        ],
      },
      {
        stageId: 'stage-6-3',
        name: 'Lessons Learned & Project Close-Out',
        order: 3,
        checklistItems: items(
          'Capture lessons learned across functions',
          'Complete close-out and PLM handover',
        ),
        deliverables: outputs('Lessons Learned Pack', 'Close-Out Pack', 'PLM Handover Record'),
        rasci: [
          { role: 'pdm', responsibility: 'R' },
          { role: 'product-director', responsibility: 'A' },
        ],
      },
    ],
  },
]
