import type { CollectionConfig } from 'payload'

import { externalRefsField } from '@/lib/integration/externalRefsField'

const statusOptions = [
  { label: 'Planned', value: 'planned' },
  { label: 'Active', value: 'active' },
  { label: 'Complete', value: 'complete' },
  { label: 'Cancelled', value: 'cancelled' },
] as const

export const ManufacturingOrders: CollectionConfig = {
  slug: 'manufacturing-orders',
  admin: {
    useAsTitle: 'moNumber',
    defaultColumns: ['moNumber', 'machine', 'product', 'status', 'orderQty'],
    group: 'Manufacturing',
  },
  fields: [
    {
      name: 'moNumber',
      type: 'text',
      required: true,
      unique: true,
      index: true,
    },
    {
      name: 'machine',
      type: 'relationship',
      relationTo: 'machines',
      required: true,
    },
    {
      name: 'product',
      type: 'relationship',
      relationTo: 'products',
      required: true,
    },
    {
      name: 'site',
      type: 'relationship',
      relationTo: 'sites',
    },
    {
      name: 'mould',
      type: 'relationship',
      relationTo: 'moulds',
    },
    {
      name: 'orderQty',
      type: 'number',
      required: true,
    },
    {
      name: 'remainQty',
      type: 'number',
    },
    {
      name: 'cycleTimePlanned',
      type: 'number',
      admin: { description: 'Planned cycle time in seconds' },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'planned',
      options: [...statusOptions],
    },
    {
      name: 'plannedStart',
      type: 'date',
      admin: { date: { pickerAppearance: 'dayOnly' } },
    },
    {
      name: 'plannedEnd',
      type: 'date',
      admin: { date: { pickerAppearance: 'dayOnly' } },
    },
    {
      name: 'oeeActual',
      type: 'number',
      admin: { description: 'Actual OEE %' },
    },
    externalRefsField,
  ],
}
