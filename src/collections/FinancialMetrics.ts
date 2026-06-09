import type { CollectionConfig } from 'payload'

import {
  companyScopedRead,
  sensitiveModuleDelete,
  sensitiveModuleWrite,
} from '@/lib/access/roles'
import { externalRefsField } from '@/lib/integration/externalRefsField'

export const FinancialMetrics: CollectionConfig = {
  slug: 'financial-metrics',
  admin: {
    useAsTitle: 'metricKey',
    defaultColumns: ['metricKey', 'period', 'value', 'updatedAt'],
    group: 'Finance',
  },
  access: {
    read: companyScopedRead('company'),
    create: sensitiveModuleWrite,
    update: sensitiveModuleWrite,
    delete: sensitiveModuleDelete,
  },
  fields: [
    {
      name: 'period',
      type: 'relationship',
      relationTo: 'finance-reporting-periods',
      required: true,
    },
    {
      name: 'company',
      type: 'relationship',
      relationTo: 'companies',
      required: true,
    },
    {
      name: 'metricKey',
      type: 'text',
      required: true,
      admin: { description: 'e.g. gross-margin-pct, current-ratio' },
    },
    {
      name: 'value',
      type: 'number',
      required: true,
    },
    {
      name: 'priorValue',
      type: 'number',
    },
    {
      name: 'frozen',
      type: 'checkbox',
      defaultValue: false,
      admin: { description: 'Set when parent period is locked' },
    },
    externalRefsField,
  ],
}
