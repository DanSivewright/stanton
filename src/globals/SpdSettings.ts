import type { GlobalConfig } from 'payload'

export const SpdSettings: GlobalConfig = {
  slug: 'spd-settings',
  label: 'SPD Settings',
  admin: {
    group: 'SPD',
  },
  fields: [
    {
      name: 'defaultTemplate',
      type: 'relationship',
      relationTo: 'spd-process-templates',
      admin: {
        description: 'Default published process template for new SPD projects',
      },
      filterOptions: {
        _status: {
          equals: 'published',
        },
      },
    },
  ],
}
