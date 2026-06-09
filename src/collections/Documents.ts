import type { CollectionConfig } from 'payload'

import { externalRefsField } from '@/lib/integration/externalRefsField'

const moduleOptions = [
  { label: 'Foundations', value: 'foundations' },
  { label: 'SPD', value: 'spd' },
  { label: 'Finance', value: 'finance' },
  { label: 'Manufacturing', value: 'manufacturing' },
  { label: 'Maintenance', value: 'maintenance' },
  { label: 'HR', value: 'hr' },
  { label: 'Sales', value: 'sales' },
] as const

const confidentialityOptions = [
  { label: 'Public', value: 'public' },
  { label: 'Internal', value: 'internal' },
  { label: 'Confidential', value: 'confidential' },
  { label: 'Restricted', value: 'restricted' },
] as const

export const Documents: CollectionConfig = {
  slug: 'documents',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'module', 'confidentiality', 'createdAt'],
    group: 'Foundations',
  },
  access: {
    read: ({ req }) => Boolean(req.user),
    create: ({ req }) => Boolean(req.user),
    update: ({ req }) => Boolean(req.user),
    delete: ({ req }) => req.user?.roles?.includes('admin') ?? false,
  },
  upload: {
    mimeTypes: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'image/*',
    ],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'module',
      type: 'select',
      required: true,
      options: [...moduleOptions],
    },
    {
      name: 'confidentiality',
      type: 'select',
      required: true,
      defaultValue: 'internal',
      options: [...confidentialityOptions],
    },
    externalRefsField,
  ],
}
