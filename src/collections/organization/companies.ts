import type { CollectionConfig } from 'payload'
import { authenticated } from '../../access/authenticated'

export const Companies: CollectionConfig = {
  slug: 'companies',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'code', 'parent'],
  },
  access: {
    create: authenticated,
    read: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Company Name',
    },
    {
      name: 'code',
      type: 'text',
      required: true,
      unique: true,
      label: 'Code',
      admin: {
        description: 'Short code (e.g. STN, PIMMS)',
      },
    },
    {
      name: 'parent',
      type: 'relationship',
      relationTo: 'companies',
      label: 'Parent Company',
      admin: {
        description: 'Leave empty for the group root (e.g. Stanton).',
      },
      filterOptions: ({ id }) => (id ? { id: { not_equals: id } } : true),
    },
  ],
}
