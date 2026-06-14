import type { CollectionConfig } from 'payload'
import { authenticated } from '../../access/authenticated'

export const AssetCategories: CollectionConfig = {
  slug: 'asset-categories',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name'],
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
      label: 'Category Name',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description',
    },
  ],
}
