import type { CollectionConfig } from 'payload'

export const SalesTargets: CollectionConfig = {
  slug: 'sales-targets',
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['employee', 'period', 'revenueTarget', 'newBusinessTarget'],
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
    },
    {
      name: 'team',
      type: 'relationship',
      relationTo: 'teams',
    },
    {
      name: 'department',
      type: 'relationship',
      relationTo: 'departments',
    },
    {
      name: 'revenueTarget',
      type: 'number',
    },
    {
      name: 'newBusinessTarget',
      type: 'number',
    },
    {
      name: 'huntVisitsTarget',
      type: 'number',
      defaultValue: 8,
    },
    {
      name: 'careVisitsTarget',
      type: 'number',
      defaultValue: 8,
    },
    {
      name: 'conversionTargetPercent',
      type: 'number',
      defaultValue: 30,
    },
  ],
}
