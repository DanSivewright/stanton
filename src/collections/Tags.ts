import type { CollectionConfig } from 'payload'

export const Tags: CollectionConfig = {
  slug: 'tags',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'slug', 'module'],
    group: 'Platform',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      index: true,
    },
    {
      name: 'module',
      type: 'select',
      options: [
        { label: 'Foundations', value: 'foundations' },
        { label: 'SPD', value: 'spd' },
        { label: 'Manufacturing', value: 'manufacturing' },
        { label: 'Maintenance', value: 'maintenance' },
        { label: 'Finance', value: 'finance' },
        { label: 'Sales', value: 'sales' },
        { label: 'HR', value: 'hr' },
      ],
    },
  ],
}
