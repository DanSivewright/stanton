import type { CollectionConfig } from 'payload'

const spdRoleOptions = [
  { label: 'Business Lead', value: 'business-lead' },
  { label: 'PDM', value: 'pdm' },
  { label: 'Product Director', value: 'product-director' },
  { label: 'Design Lead', value: 'design-lead' },
  { label: 'Quality Lead', value: 'quality-lead' },
  { label: 'Manufacturing Lead', value: 'manufacturing-lead' },
  { label: 'Tooling Lead', value: 'tooling-lead' },
  { label: 'Process Lead', value: 'process-lead' },
] as const

const rasciOptions = [
  { label: 'Responsible', value: 'R' },
  { label: 'Accountable', value: 'A' },
  { label: 'Support', value: 'S' },
  { label: 'Consulted', value: 'C' },
  { label: 'Informed', value: 'I' },
] as const

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
    {
      name: 'phases',
      type: 'array',
      labels: {
        singular: 'Phase',
        plural: 'Phases',
      },
      fields: [
        {
          name: 'phaseId',
          type: 'text',
          required: true,
          admin: {
            description: 'Stable identifier (e.g. phase-1)',
          },
        },
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'order',
          type: 'number',
          required: true,
          min: 1,
        },
        {
          name: 'stages',
          type: 'array',
          labels: {
            singular: 'Stage',
            plural: 'Stages',
          },
          fields: [
            {
              name: 'stageId',
              type: 'text',
              required: true,
              admin: {
                description: 'Stable identifier (e.g. stage-1-1)',
              },
            },
            {
              name: 'name',
              type: 'text',
              required: true,
            },
            {
              name: 'order',
              type: 'number',
              required: true,
              min: 1,
            },
            {
              name: 'checklistItems',
              type: 'array',
              labels: {
                singular: 'Checklist Item',
                plural: 'Checklist Items',
              },
              fields: [
                {
                  name: 'item',
                  type: 'text',
                  required: true,
                },
              ],
            },
            {
              name: 'deliverables',
              type: 'array',
              labels: {
                singular: 'Deliverable',
                plural: 'Deliverables',
              },
              fields: [
                {
                  name: 'name',
                  type: 'text',
                  required: true,
                },
              ],
            },
            {
              name: 'gate',
              type: 'group',
              fields: [
                {
                  name: 'gateId',
                  type: 'text',
                  admin: {
                    description: 'Set when this stage ends with a gate (e.g. gate-1)',
                  },
                },
                {
                  name: 'name',
                  type: 'text',
                },
                {
                  name: 'description',
                  type: 'textarea',
                },
                {
                  name: 'requiredRoles',
                  type: 'select',
                  hasMany: true,
                  options: [...spdRoleOptions],
                },
              ],
            },
            {
              name: 'rasci',
              type: 'array',
              labels: {
                singular: 'RASCI Assignment',
                plural: 'RASCI Assignments',
              },
              fields: [
                {
                  name: 'role',
                  type: 'select',
                  required: true,
                  options: [...spdRoleOptions],
                },
                {
                  name: 'responsibility',
                  type: 'select',
                  required: true,
                  options: [...rasciOptions],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
}
