import type { CollectionConfig } from 'payload'

import { authenticated } from '@/lib/access/roles'

export const ActivityEvents: CollectionConfig = {
  slug: 'activity-events',
  admin: {
    useAsTitle: 'summary',
    defaultColumns: ['summary', 'eventType', 'module', 'createdAt'],
    group: 'Platform',
    description: 'Cross-module audit trail for significant actions',
  },
  access: {
    read: authenticated,
    create: () => false,
    update: () => false,
    delete: () => false,
  },
  fields: [
    {
      name: 'summary',
      type: 'text',
      required: true,
    },
    {
      name: 'eventType',
      type: 'text',
      required: true,
      admin: { description: 'e.g. gate-approved, snapshot-submitted, period-locked' },
    },
    {
      name: 'module',
      type: 'select',
      options: [
        { label: 'SPD', value: 'spd' },
        { label: 'Manufacturing', value: 'manufacturing' },
        { label: 'Maintenance', value: 'maintenance' },
        { label: 'Finance', value: 'finance' },
        { label: 'Sales', value: 'sales' },
        { label: 'HR', value: 'hr' },
        { label: 'Platform', value: 'platform' },
      ],
    },
    {
      name: 'collectionSlug',
      type: 'text',
    },
    {
      name: 'documentId',
      type: 'text',
    },
    {
      name: 'actor',
      type: 'relationship',
      relationTo: 'users',
    },
    {
      name: 'metadata',
      type: 'json',
    },
  ],
}
