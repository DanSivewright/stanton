import type { CollectionConfig } from 'payload'

import { externalRefsField } from '@/lib/integration/externalRefsField'

export const Parts: CollectionConfig = {
  slug: 'parts',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'partNumber', 'supplier'],
    group: 'Maintenance',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'partNumber',
      type: 'text',
      index: true,
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'supplier',
      type: 'text',
    },
    externalRefsField,
  ],
}
