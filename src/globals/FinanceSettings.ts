import type { GlobalConfig } from 'payload'

import { sensitiveModuleRead, sensitiveModuleWrite } from '@/lib/access/roles'

export const FinanceSettings: GlobalConfig = {
  slug: 'finance-settings',
  label: 'Finance Settings',
  admin: {
    group: 'Finance',
  },
  access: {
    read: sensitiveModuleRead,
    update: sensitiveModuleWrite,
  },
  fields: [
    {
      name: 'defaultCompanies',
      type: 'relationship',
      relationTo: 'companies',
      hasMany: true,
    },
    {
      name: 'periodCadence',
      type: 'select',
      defaultValue: 'monthly',
      options: [
        { label: 'Monthly', value: 'monthly' },
        { label: 'Weekly', value: 'weekly' },
      ],
    },
    {
      name: 'defaultRecipients',
      type: 'textarea',
      admin: { description: 'Comma-separated emails for board pack delivery (downstream)' },
    },
  ],
}
