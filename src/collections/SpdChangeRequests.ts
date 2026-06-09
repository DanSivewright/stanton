import type { CollectionConfig } from 'payload'

const classificationOptions = [
  { label: 'In-scope redo', value: 'in-scope-redo' },
  { label: 'Out-of-scope (costed)', value: 'out-of-scope-costed' },
] as const

const approvalStatusOptions = [
  { label: 'Draft', value: 'draft' },
  { label: 'Pending approval', value: 'pending-approval' },
  { label: 'Approved', value: 'approved' },
  { label: 'Rejected', value: 'rejected' },
  { label: 'Pending client sign-off', value: 'pending-client-sign-off' },
] as const

const clientSignOffStatusOptions = [
  { label: 'Pending', value: 'pending' },
  { label: 'Approved', value: 'approved' },
  { label: 'Rejected', value: 'rejected' },
] as const

export const SpdChangeRequests: CollectionConfig = {
  slug: 'spd-change-requests',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'project', 'classification', 'approvalStatus', 'updatedAt'],
    group: 'SPD',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'project',
      type: 'relationship',
      relationTo: 'spd-projects',
      required: true,
    },
    {
      name: 'toolingAsset',
      type: 'relationship',
      relationTo: 'tooling-assets',
    },
    {
      name: 'classification',
      type: 'select',
      required: true,
      options: [...classificationOptions],
    },
    {
      name: 'impact',
      type: 'textarea',
      admin: {
        description: 'Scope and delivery impact summary',
      },
    },
    {
      name: 'approvalStatus',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      options: [...approvalStatusOptions],
    },
    {
      name: 'costFields',
      type: 'group',
      admin: {
        condition: (data) => data?.classification === 'out-of-scope-costed',
        description: 'Required for out-of-scope change requests',
      },
      fields: [
        {
          name: 'estimatedCost',
          type: 'number',
          min: 0,
        },
        {
          name: 'currency',
          type: 'select',
          defaultValue: 'GBP',
          options: [
            { label: 'GBP', value: 'GBP' },
            { label: 'USD', value: 'USD' },
            { label: 'ZAR', value: 'ZAR' },
          ],
        },
        {
          name: 'clientSignOffStatus',
          type: 'select',
          defaultValue: 'pending',
          options: [...clientSignOffStatusOptions],
          admin: {
            description: 'Manual client sign-off path for POC',
          },
        },
        {
          name: 'clientSignOffNotes',
          type: 'textarea',
        },
      ],
    },
    {
      name: 'documents',
      type: 'relationship',
      relationTo: 'documents',
      hasMany: true,
    },
  ],
}
