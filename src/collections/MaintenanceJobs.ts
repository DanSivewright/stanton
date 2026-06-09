import type { CollectionConfig } from 'payload'

import { activityOnMaintenanceComplete } from '@/hooks/platform/recordActivityOnChange'

const statusOptions = [
  { label: 'Open', value: 'open' },
  { label: 'In Progress', value: 'in_progress' },
  { label: 'Completed', value: 'completed' },
  { label: 'Cancelled', value: 'cancelled' },
] as const

const triggerOptions = [
  { label: 'Manual', value: 'manual' },
  { label: 'Shot Count', value: 'shot_count' },
  { label: 'Machine Stopped', value: 'machine_stopped' },
] as const

export const MaintenanceJobs: CollectionConfig = {
  slug: 'maintenance-jobs',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'machine', 'status', 'trigger', 'scheduledAt'],
    group: 'Maintenance',
  },
  hooks: {
    afterChange: [activityOnMaintenanceComplete],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'machine',
      type: 'relationship',
      relationTo: 'machines',
      required: true,
    },
    {
      name: 'mould',
      type: 'relationship',
      relationTo: 'moulds',
    },
    {
      name: 'technician',
      type: 'relationship',
      relationTo: 'employees',
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'open',
      options: [...statusOptions],
    },
    {
      name: 'trigger',
      type: 'select',
      defaultValue: 'manual',
      options: [...triggerOptions],
    },
    {
      name: 'scheduledAt',
      type: 'date',
      admin: { date: { pickerAppearance: 'dayAndTime' } },
    },
    {
      name: 'completedAt',
      type: 'date',
      admin: { date: { pickerAppearance: 'dayAndTime' } },
    },
    {
      name: 'downtimeMinutes',
      type: 'number',
    },
    {
      name: 'notes',
      type: 'textarea',
    },
    {
      name: 'partsUsed',
      type: 'array',
      labels: { singular: 'Part Used', plural: 'Parts Used' },
      fields: [
        {
          name: 'part',
          type: 'relationship',
          relationTo: 'parts',
          required: true,
        },
        {
          name: 'quantity',
          type: 'number',
          required: true,
          defaultValue: 1,
        },
        {
          name: 'notes',
          type: 'text',
        },
      ],
    },
  ],
}
