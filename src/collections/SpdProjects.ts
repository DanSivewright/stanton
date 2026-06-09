import type { CollectionConfig } from 'payload'

import { snapshotOnCreate } from '@/hooks/spd/snapshotOnCreate'
import { processPhasesFields } from '@/lib/spd/processFields'

export const SpdProjects: CollectionConfig = {
  slug: 'spd-projects',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'currentPhase', 'onTrack', 'customer', 'updatedAt'],
    group: 'SPD',
  },
  hooks: {
    beforeChange: [snapshotOnCreate],
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
      required: true,
    },
    {
      name: 'customer',
      type: 'relationship',
      relationTo: 'customers',
      required: true,
    },
    {
      name: 'contacts',
      type: 'relationship',
      relationTo: 'contacts',
      hasMany: true,
      admin: {
        description: 'Customer contacts associated with this project',
      },
    },
    {
      name: 'toolingAsset',
      type: 'relationship',
      relationTo: 'tooling-assets',
    },
    {
      name: 'processTemplate',
      type: 'relationship',
      relationTo: 'spd-process-templates',
      admin: {
        description:
          'Published template used at creation. Defaults from SPD Settings when omitted.',
      },
      filterOptions: {
        _status: {
          equals: 'published',
        },
      },
    },
    {
      name: 'currentPhase',
      type: 'text',
      admin: {
        description: 'Active phase ID from the embedded process snapshot',
        readOnly: true,
      },
    },
    {
      name: 'onTrack',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      type: 'row',
      fields: [
        {
          name: 'startDate',
          type: 'date',
          admin: {
            date: {
              pickerAppearance: 'dayOnly',
            },
          },
        },
        {
          name: 'targetEndDate',
          type: 'date',
          admin: {
            date: {
              pickerAppearance: 'dayOnly',
            },
          },
        },
        {
          name: 'actualEndDate',
          type: 'date',
          admin: {
            date: {
              pickerAppearance: 'dayOnly',
            },
          },
        },
      ],
    },
    {
      name: 'processSnapshot',
      type: 'group',
      admin: {
        readOnly: true,
        description: 'Immutable copy of the process template at project creation',
      },
      fields: [
        {
          name: 'templateId',
          type: 'text',
          admin: { readOnly: true },
        },
        {
          name: 'templateVersion',
          type: 'text',
          admin: { readOnly: true },
        },
        {
          name: 'templateName',
          type: 'text',
          admin: { readOnly: true },
        },
        ...processPhasesFields,
      ],
    },
  ],
}
