import type { GlobalConfig } from 'payload'

import { sensitiveModuleRead, sensitiveModuleWrite } from '@/lib/access/roles'

export const HrSettings: GlobalConfig = {
  slug: 'hr-settings',
  label: 'HR Settings',
  admin: {
    group: 'HR',
  },
  access: {
    read: sensitiveModuleRead,
    update: sensitiveModuleWrite,
  },
  fields: [
    {
      name: 'reviewCadence',
      type: 'select',
      defaultValue: 'quarterly',
      options: [
        { label: 'Quarterly', value: 'quarterly' },
        { label: 'Annual', value: 'annual' },
      ],
    },
    {
      name: 'defaultContractPeriod',
      type: 'text',
      defaultValue: 'FY2026',
    },
    {
      name: 'ratingBandLabels',
      type: 'textarea',
      defaultValue: '1=Below, 2=Meets, 3=Exceeds',
    },
  ],
}
