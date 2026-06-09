import type { CollectionConfig } from 'payload'

import { processPhasesFields } from '@/lib/spd/processFields'

export const SpdProcessTemplates: CollectionConfig = {
  slug: 'spd-process-templates',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'version', '_status', 'effectiveDate'],
    group: 'SPD',
  },
  versions: {
    drafts: true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'version',
      type: 'text',
      required: true,
      admin: {
        description: 'Semantic version label (e.g. 1.0)',
      },
    },
    {
      name: 'effectiveDate',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
        },
      },
    },
    ...processPhasesFields,
  ],
}
