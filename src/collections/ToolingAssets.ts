import type { CollectionConfig } from 'payload'

const statusOptions = [
  { label: 'Draft', value: 'draft' },
  { label: 'Active', value: 'active' },
  { label: 'Archived', value: 'archived' },
] as const

export const ToolingAssets: CollectionConfig = {
  slug: 'tooling-assets',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'version', 'status', 'project'],
    group: 'SPD',
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
        description: 'Version label (e.g. 1.0)',
      },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      options: [...statusOptions],
    },
    {
      name: 'project',
      type: 'relationship',
      relationTo: 'spd-projects',
      admin: {
        description: 'SPD project this tooling asset belongs to',
      },
    },
    {
      name: 'previousVersion',
      type: 'relationship',
      relationTo: 'tooling-assets',
      admin: { description: 'Prior version in the lineage chain' },
    },
  ],
}
