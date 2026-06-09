import type { CollectionConfig } from 'payload'

import { unlockPhaseOnApprove } from '@/hooks/spd/unlockPhaseOnApprove'
import { spdRoleOptions } from '@/lib/spd/constants'

const decisionOptions = [
  { label: 'Approved', value: 'approved' },
  { label: 'Rejected', value: 'rejected' },
] as const

export const SpdGateSignOffs: CollectionConfig = {
  slug: 'spd-gate-sign-offs',
  admin: {
    useAsTitle: 'gateId',
    defaultColumns: ['gateId', 'project', 'approver', 'role', 'decision', 'createdAt'],
    group: 'SPD',
    description: 'Append-only gate approval events',
  },
  access: {
    update: () => false,
    delete: () => false,
  },
  hooks: {
    afterChange: [unlockPhaseOnApprove],
  },
  fields: [
    {
      name: 'project',
      type: 'relationship',
      relationTo: 'spd-projects',
      required: true,
    },
    {
      name: 'gateId',
      type: 'text',
      required: true,
      admin: {
        description: 'Gate identifier from the project process snapshot (e.g. gate-1)',
      },
    },
    {
      name: 'approver',
      type: 'relationship',
      relationTo: 'employees',
      required: true,
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      options: [...spdRoleOptions],
    },
    {
      name: 'decision',
      type: 'select',
      required: true,
      options: [...decisionOptions],
    },
    {
      name: 'comments',
      type: 'textarea',
    },
    {
      name: 'evidenceDocuments',
      type: 'relationship',
      relationTo: 'documents',
      hasMany: true,
    },
  ],
}
