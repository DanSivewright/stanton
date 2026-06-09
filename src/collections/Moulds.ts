import type { CollectionConfig } from 'payload'

export const Moulds: CollectionConfig = {
  slug: 'moulds',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'code', 'product', 'shotCount', 'active'],
    group: 'Foundations',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'code',
      type: 'text',
      required: true,
      unique: true,
      index: true,
    },
    {
      name: 'product',
      type: 'relationship',
      relationTo: 'products',
    },
    {
      name: 'shotCount',
      type: 'number',
      defaultValue: 0,
      admin: { description: 'Cumulative shots; service at 20k' },
    },
    {
      name: 'lastServiceAt',
      type: 'date',
      admin: { date: { pickerAppearance: 'dayOnly' } },
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
    },
  ],
}
