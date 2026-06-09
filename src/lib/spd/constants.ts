export const spdRoleOptions = [
  { label: 'Business Lead', value: 'business-lead' },
  { label: 'PDM', value: 'pdm' },
  { label: 'Product Director', value: 'product-director' },
  { label: 'Design Lead', value: 'design-lead' },
  { label: 'Quality Lead', value: 'quality-lead' },
  { label: 'Manufacturing Lead', value: 'manufacturing-lead' },
  { label: 'Tooling Lead', value: 'tooling-lead' },
  { label: 'Process Lead', value: 'process-lead' },
] as const

export const rasciOptions = [
  { label: 'Responsible', value: 'R' },
  { label: 'Accountable', value: 'A' },
  { label: 'Support', value: 'S' },
  { label: 'Consulted', value: 'C' },
  { label: 'Informed', value: 'I' },
] as const

export type SpdPhase = {
  phaseId: string
  name: string
  order: number
  stages?: Array<{
    stageId: string
    name: string
    order: number
    gate?: {
      gateId?: string | null
      name?: string | null
    } | null
  }> | null
}
