import type { GlobalConfig } from 'payload'

export const ManufacturingSettings: GlobalConfig = {
  slug: 'manufacturing-settings',
  label: 'Manufacturing Settings',
  admin: {
    group: 'Manufacturing',
  },
  fields: [
    {
      name: 'oeeBenchmark',
      type: 'number',
      defaultValue: 70,
      admin: { description: 'Target OEE %' },
    },
    {
      name: 'rejectThresholdPercent',
      type: 'number',
      defaultValue: 2,
    },
    {
      name: 'snapshotIntervalHours',
      type: 'number',
      defaultValue: 3,
    },
    {
      name: 'mouldWarningShotCount',
      type: 'number',
      defaultValue: 15000,
    },
    {
      name: 'mouldServiceShotCount',
      type: 'number',
      defaultValue: 20000,
    },
  ],
}
