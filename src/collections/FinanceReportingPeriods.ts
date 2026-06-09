import type { CollectionConfig } from 'payload'

import {
  companyScopedRead,
  sensitiveModuleDelete,
  sensitiveModuleWrite,
} from '@/lib/access/roles'
import { activityOnPeriodLock } from '@/hooks/platform/recordActivityOnChange'
import { lockFinancePeriod } from '@/hooks/finance/lockFinancePeriod'

const periodTypeOptions = [
  { label: 'Monthly', value: 'monthly' },
  { label: 'Weekly', value: 'weekly' },
  { label: 'Custom', value: 'custom' },
] as const

const statusOptions = [
  { label: 'Open', value: 'open' },
  { label: 'Locked', value: 'locked' },
] as const

export const FinanceReportingPeriods: CollectionConfig = {
  slug: 'finance-reporting-periods',
  admin: {
    useAsTitle: 'label',
    defaultColumns: ['label', 'company', 'periodType', 'status', 'periodStart'],
    group: 'Finance',
  },
  access: {
    read: companyScopedRead('company'),
    create: sensitiveModuleWrite,
    update: sensitiveModuleWrite,
    delete: sensitiveModuleDelete,
  },
  hooks: {
    beforeChange: [lockFinancePeriod],
    afterChange: [activityOnPeriodLock],
  },
  fields: [
    {
      name: 'label',
      type: 'text',
      required: true,
      admin: { description: 'e.g. June 2026' },
    },
    {
      name: 'company',
      type: 'relationship',
      relationTo: 'companies',
      required: true,
    },
    {
      name: 'periodType',
      type: 'select',
      required: true,
      defaultValue: 'monthly',
      options: [...periodTypeOptions],
    },
    {
      name: 'periodStart',
      type: 'date',
      required: true,
      admin: { date: { pickerAppearance: 'dayOnly' } },
    },
    {
      name: 'periodEnd',
      type: 'date',
      required: true,
      admin: { date: { pickerAppearance: 'dayOnly' } },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'open',
      options: [...statusOptions],
    },
    {
      name: 'sections',
      type: 'array',
      labels: { singular: 'Section', plural: 'Sections' },
      fields: [
        {
          name: 'sectionKey',
          type: 'text',
          required: true,
        },
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'order',
          type: 'number',
        },
      ],
    },
    {
      name: 'lockedAt',
      type: 'date',
      admin: {
        readOnly: true,
        date: { pickerAppearance: 'dayAndTime' },
      },
    },
  ],
}
