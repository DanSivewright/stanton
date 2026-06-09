import type { GlobalConfig } from 'payload'

export const MaintenanceSettings: GlobalConfig = {
  slug: 'maintenance-settings',
  label: 'Maintenance Settings',
  admin: {
    group: 'Maintenance',
  },
  fields: [
    {
      name: 'serviceIntervalShots',
      type: 'number',
      defaultValue: 20000,
    },
    {
      name: 'warningShotCount',
      type: 'number',
      defaultValue: 15000,
    },
    {
      name: 'notificationChain',
      type: 'textarea',
      admin: { description: 'Comma-separated emails for machine-down alerts' },
    },
  ],
}
