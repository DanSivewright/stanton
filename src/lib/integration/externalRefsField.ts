import type { Field } from 'payload'

import { integrationSystemOptions, syncStatusOptions } from './constants'

/**
 * Reusable external reference rows for hub collections.
 * Future connectors write here; Payload records remain canonical.
 */
export const externalRefsField: Field = {
  name: 'externalRefs',
  type: 'array',
  labels: { singular: 'External Reference', plural: 'External References' },
  admin: {
    description:
      'Links to external systems (Odoo, Pipedrive, SharePoint). Canonical data lives on this record.',
    position: 'sidebar',
  },
  fields: [
    {
      name: 'system',
      type: 'select',
      required: true,
      options: [...integrationSystemOptions],
    },
    {
      name: 'externalId',
      type: 'text',
      required: true,
      admin: { description: 'ID in the external system' },
    },
    {
      name: 'lastSyncedAt',
      type: 'date',
      admin: { date: { pickerAppearance: 'dayAndTime' } },
    },
    {
      name: 'syncStatus',
      type: 'select',
      defaultValue: 'pending',
      options: [...syncStatusOptions],
    },
    {
      name: 'notes',
      type: 'text',
    },
  ],
}
