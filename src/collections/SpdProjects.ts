import type { CollectionConfig } from 'payload'

import { lockPhaseEdits } from '@/hooks/spd/lockPhaseEdits'
import { snapshotOnCreate } from '@/hooks/spd/snapshotOnCreate'
import { processPhasesFields } from '@/lib/spd/processFields'

export const SpdProjects: CollectionConfig = {
  slug: 'spd-projects',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'currentPhase', 'onTrack', 'customer', 'updatedAt'],
    group: 'SPD',
    components: {
      beforeList: ['/components/admin/SpdWorkflowBeforeList#SpdWorkflowBeforeList'],
      views: {
        workflow: {
          Component: '/components/admin/SpdProjectWorkflowView#SpdProjectWorkflowView',
          path: '/workflow',
        },
      },
    },
  },
  hooks: {
    beforeChange: [snapshotOnCreate, lockPhaseEdits],
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
      name: 'includedOptionalStages',
      type: 'text',
      hasMany: true,
      admin: {
        description:
          'Optional stage IDs selected at creation (non-optional stages always included)',
      },
    },
    {
      name: 'checklistCompletion',
      type: 'array',
      labels: { singular: 'Checklist Item', plural: 'Checklist Items' },
      admin: { description: 'Per-project checklist tick-off state' },
      fields: [
        {
          name: 'stageId',
          type: 'text',
          required: true,
        },
        {
          name: 'itemIndex',
          type: 'number',
          required: true,
          min: 0,
        },
        {
          name: 'done',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'completedBy',
          type: 'relationship',
          relationTo: 'employees',
        },
        {
          name: 'completedAt',
          type: 'date',
          admin: { date: { pickerAppearance: 'dayAndTime' } },
        },
      ],
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
