import type { GlobalConfig } from 'payload'

export const SalesSettings: GlobalConfig = {
  slug: 'sales-settings',
  label: 'Sales Settings',
  admin: {
    group: 'Sales',
  },
  fields: [
    {
      name: 'defaultHuntVisitsTarget',
      type: 'number',
      defaultValue: 8,
    },
    {
      name: 'defaultCareVisitsTarget',
      type: 'number',
      defaultValue: 8,
    },
    {
      name: 'defaultConversionPercent',
      type: 'number',
      defaultValue: 30,
    },
  ],
}
