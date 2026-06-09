import type { CollectionConfig } from 'payload'

import { externalRefsField } from '@/lib/integration/externalRefsField'

export const Contacts: CollectionConfig = {
  slug: 'contacts',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'customer', 'roleTitle'],
    group: 'Foundations',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'email',
      type: 'email',
    },
    {
      name: 'phone',
      type: 'text',
    },
    {
      name: 'roleTitle',
      type: 'text',
      label: 'Role / Title',
    },
    {
      name: 'customer',
      type: 'relationship',
      relationTo: 'customers',
      required: true,
    },
    {
      name: 'company',
      type: 'relationship',
      relationTo: 'companies',
      admin: {
        description: 'Optional internal company context',
      },
    },
    externalRefsField,
  ],
}
