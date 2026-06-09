import type { CollectionConfig } from 'payload'

import { sensitiveModuleDelete, sensitiveModuleRead, sensitiveModuleWrite } from '@/lib/access/roles'

const statusOptions = [
  { label: 'Not Started', value: 'not_started' },
  { label: 'In Progress', value: 'in_progress' },
  { label: 'Manager Review', value: 'manager_review' },
  { label: 'Signed Off', value: 'signed_off' },
] as const

const ratingOptions = [
  { label: '1 — Below Expectations', value: '1' },
  { label: '2 — Meets Expectations', value: '2' },
  { label: '3 — Exceeds Expectations', value: '3' },
] as const

export const QuarterlyReviews: CollectionConfig = {
  slug: 'quarterly-reviews',
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['employee', 'quarter', 'year', 'status', 'rating'],
    group: 'HR',
  },
  access: {
    read: sensitiveModuleRead,
    create: sensitiveModuleWrite,
    update: sensitiveModuleWrite,
    delete: sensitiveModuleDelete,
  },
  fields: [
    {
      name: 'employee',
      type: 'relationship',
      relationTo: 'employees',
      required: true,
    },
    {
      name: 'manager',
      type: 'relationship',
      relationTo: 'employees',
    },
    {
      name: 'performanceContract',
      type: 'relationship',
      relationTo: 'performance-contracts',
    },
    {
      name: 'quarter',
      type: 'number',
      required: true,
      min: 1,
      max: 4,
    },
    {
      name: 'year',
      type: 'number',
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'not_started',
      options: [...statusOptions],
    },
    {
      name: 'scores',
      type: 'array',
      labels: { singular: 'KPI Score', plural: 'KPI Scores' },
      fields: [
        {
          name: 'kpiName',
          type: 'text',
          required: true,
        },
        {
          name: 'score',
          type: 'number',
          min: 1,
          max: 3,
        },
        {
          name: 'weight',
          type: 'number',
          defaultValue: 1,
        },
      ],
    },
    {
      name: 'weightedTotal',
      type: 'number',
      admin: { readOnly: true },
    },
    {
      name: 'rating',
      type: 'select',
      options: [...ratingOptions],
    },
    {
      name: 'managerComments',
      type: 'textarea',
    },
    {
      name: 'aiSummary',
      type: 'textarea',
      admin: { description: 'Optional AI-generated summary (Phase 3)' },
    },
  ],
}
