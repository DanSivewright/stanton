export const integrationSystemOptions = [
  { label: 'Odoo', value: 'odoo' },
  { label: 'Pipedrive', value: 'pipedrive' },
  { label: 'SharePoint', value: 'sharepoint' },
  { label: 'Manual / Legacy', value: 'manual' },
] as const

export type IntegrationSystem = (typeof integrationSystemOptions)[number]['value']

export const syncStatusOptions = [
  { label: 'Synced', value: 'synced' },
  { label: 'Pending', value: 'pending' },
  { label: 'Error', value: 'error' },
  { label: 'Stale', value: 'stale' },
] as const

export type SyncStatus = (typeof syncStatusOptions)[number]['value']

export const syncDirectionOptions = [
  { label: 'Inbound', value: 'inbound' },
  { label: 'Outbound', value: 'outbound' },
] as const

export const syncEventStatusOptions = [
  { label: 'Success', value: 'success' },
  { label: 'Partial', value: 'partial' },
  { label: 'Failed', value: 'failed' },
  { label: 'Skipped', value: 'skipped' },
] as const
