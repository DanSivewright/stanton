import type { CollectionConfig } from 'payload'

import {
  companyScopedRead,
  sensitiveModuleDelete,
  sensitiveModuleWrite,
} from '@/lib/access/roles'

const lineTypeOptions = [
  { label: 'Standard', value: 'standard' },
  { label: 'Aging', value: 'aging' },
] as const

const agingBucketOptions = [
  { label: 'Current', value: 'current' },
  { label: '30 days', value: '30' },
  { label: '60 days', value: '60' },
  { label: '90 days', value: '90' },
  { label: '120+ days', value: '120plus' },
] as const

export const FinanceReportLines: CollectionConfig = {
  slug: 'finance-report-lines',
  admin: {
    useAsTitle: 'label',
    defaultColumns: ['label', 'period', 'sectionKey', 'amount', 'lineType'],
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
      name: 'sectionKey',
      type: 'text',
      required: true,
    },
    {
      name: 'lineType',
      type: 'select',
      defaultValue: 'standard',
      options: [...lineTypeOptions],
    },
    {
      name: 'label',
      type: 'text',
      required: true,
    },
    {
      name: 'amount',
      type: 'number',
      required: true,
    },
    {
      name: 'priorPeriodAmount',
      type: 'number',
    },
    {
      name: 'samePeriodLastYear',
      type: 'number',
    },
    {
      name: 'division',
      type: 'text',
    },
    {
      name: 'agingBucket',
      type: 'select',
      options: [...agingBucketOptions],
      admin: {
        condition: (_, siblingData) => siblingData?.lineType === 'aging',
      },
    },
  ],
}
