import type { CollectionConfig } from 'payload'

import { sensitiveModuleDelete, sensitiveModuleRead, sensitiveModuleWrite } from '@/lib/access/roles'
import { activityOnPerformanceContractApproved } from '@/hooks/platform/recordActivityOnChange'

const statusOptions = [
  { label: 'Draft', value: 'draft' },
  { label: 'Submitted', value: 'submitted' },
  { label: 'Approved', value: 'approved' },
  { label: 'Archived', value: 'archived' },
] as const

export const PerformanceContracts: CollectionConfig = {
  slug: 'performance-contracts',
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['employee', 'periodLabel', 'status', 'template'],
    group: 'HR',
  },
  access: {
    read: sensitiveModuleRead,
    create: sensitiveModuleWrite,
    update: sensitiveModuleWrite,
    delete: sensitiveModuleDelete,
  },
  hooks: {
    afterChange: [activityOnPerformanceContractApproved],
  },
  fields: [
    {
      name: 'employee',
      type: 'relationship',
      relationTo: 'employees',
      required: true,
    },
    {
      name: 'template',
      type: 'relationship',
      relationTo: 'contract-templates',
    },
    {
      name: 'periodLabel',
      type: 'text',
      required: true,
      admin: { description: 'e.g. FY2026' },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      options: [...statusOptions],
    },
    {
      name: 'documents',
      type: 'relationship',
      relationTo: 'documents',
      hasMany: true,
    },
    {
      name: 'kpas',
      type: 'array',
      labels: { singular: 'KPA', plural: 'KPAs' },
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'weight',
          type: 'number',
          defaultValue: 1,
        },
        {
          name: 'kpis',
          type: 'array',
          labels: { singular: 'Performance KPI', plural: 'Performance KPIs' },
          fields: [
            {
              name: 'name',
              type: 'text',
              required: true,
            },
            {
              name: 'target',
              type: 'text',
            },
            {
              name: 'actual',
              type: 'text',
            },
            {
              name: 'weight',
              type: 'number',
              defaultValue: 1,
            },
          ],
        },
      ],
    },
  ],
}
