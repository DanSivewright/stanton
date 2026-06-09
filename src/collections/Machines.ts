import type { CollectionConfig } from 'payload'

import { externalRefsField } from '@/lib/integration/externalRefsField'

const statusOptions = [
  { label: 'Running', value: 'running' },
  { label: 'Stopped', value: 'stopped' },
  { label: 'Maintenance', value: 'maintenance' },
  { label: 'Offline', value: 'offline' },
] as const

export const Machines: CollectionConfig = {
  slug: 'machines',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'code', 'site', 'status', 'active'],
    group: 'Foundations',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'code',
      type: 'text',
      required: true,
      unique: true,
      index: true,
    },
    {
      name: 'site',
      type: 'relationship',
      relationTo: 'sites',
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'offline',
      options: [...statusOptions],
    },
    {
      name: 'oeeTarget',
      type: 'number',
      admin: { description: 'Target OEE % (default 70)' },
      defaultValue: 70,
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
    },
    externalRefsField,
  ],
}
