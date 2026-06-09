import type { CollectionConfig } from 'payload'

import {
  companyScopedRead,
  sensitiveModuleDelete,
  sensitiveModuleWrite,
} from '@/lib/access/roles'

export const ContractTemplates: CollectionConfig = {
  slug: 'contract-templates',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'company', 'active'],
    group: 'HR',
  },
  access: {
    read: companyScopedRead('company'),
    create: sensitiveModuleWrite,
    update: sensitiveModuleWrite,
    delete: sensitiveModuleDelete,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'company',
      type: 'relationship',
      relationTo: 'companies',
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'kpas',
      type: 'array',
      labels: { singular: 'KPA', plural: 'KPAs' },
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'weight',
          type: 'number',
          defaultValue: 1,
        },
        {
          name: 'kpis',
          type: 'array',
          labels: { singular: 'Performance KPI', plural: 'Performance KPIs' },
          fields: [
            {
              name: 'name',
              type: 'text',
              required: true,
            },
            {
              name: 'target',
              type: 'text',
            },
            {
              name: 'weight',
              type: 'number',
              defaultValue: 1,
            },
          ],
        },
      ],
    },
  ],
}
