import type { CollectionConfig } from 'payload'

const sourceOptions = [
  { label: 'Manual', value: 'manual' },
  { label: 'Odoo Import', value: 'odoo' },
  { label: 'CSV Import', value: 'import' },
] as const

export const SalesActuals: CollectionConfig = {
  slug: 'sales-actuals',
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['employee', 'period', 'actualAmount', 'source'],
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
      name: 'customer',
      type: 'relationship',
      relationTo: 'customers',
    },
    {
      name: 'product',
      type: 'relationship',
      relationTo: 'products',
    },
    {
      name: 'actualAmount',
      type: 'number',
      required: true,
    },
    {
      name: 'source',
      type: 'select',
      defaultValue: 'manual',
      options: [...sourceOptions],
    },
  ],
}
