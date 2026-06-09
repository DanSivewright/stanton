import type { CollectionConfig } from 'payload'

const activityTypeOptions = [
  { label: 'Hunt', value: 'hunt' },
  { label: 'Care', value: 'care' },
] as const

export const SalesActivities: CollectionConfig = {
  slug: 'sales-activities',
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['employee', 'period', 'activityType', 'careVisits', 'conversions'],
    group: 'Sales',
  },
  fields: [
    {
      name: 'period',
      type: 'relationship',
      relationTo: 'sales-performance-periods',
      required: true,
    },
    {
      name: 'employee',
      type: 'relationship',
      relationTo: 'employees',
      required: true,
    },
    {
      name: 'activityType',
      type: 'select',
      required: true,
      options: [...activityTypeOptions],
    },
    {
      name: 'careVisits',
      type: 'number',
      defaultValue: 0,
    },
    {
      name: 'conversions',
      type: 'number',
      defaultValue: 0,
    },
    {
      name: 'satisfactionScore',
      type: 'number',
      min: 0,
      max: 100,
    },
    {
      name: 'notes',
      type: 'textarea',
    },
  ],
}
