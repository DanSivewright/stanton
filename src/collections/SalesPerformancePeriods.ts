import type { CollectionConfig } from 'payload'

const statusOptions = [
  { label: 'Open', value: 'open' },
  { label: 'Closed', value: 'closed' },
] as const

export const SalesPerformancePeriods: CollectionConfig = {
  slug: 'sales-performance-periods',
  admin: {
    useAsTitle: 'label',
    defaultColumns: ['label', 'company', 'month', 'year', 'status'],
    group: 'Sales',
    components: {
      beforeList: [
        '/components/admin/SalesDashboardBeforeList#SalesDashboardBeforeList',
      ],
    },
  },
  fields: [
    {
      name: 'label',
      type: 'text',
      required: true,
    },
    {
      name: 'company',
      type: 'relationship',
      relationTo: 'companies',
      required: true,
    },
    {
      name: 'month',
      type: 'number',
      required: true,
      min: 1,
      max: 12,
    },
    {
      name: 'year',
      type: 'number',
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'open',
      options: [...statusOptions],
    },
  ],
}
