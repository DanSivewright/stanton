import type { CollectionConfig } from 'payload'

import { adminOnly, authenticated } from '@/lib/access/roles'
import {
  integrationSystemOptions,
  syncDirectionOptions,
  syncEventStatusOptions,
} from '@/lib/integration/constants'

export const IntegrationSyncEvents: CollectionConfig = {
  slug: 'integration-sync-events',
  admin: {
    useAsTitle: 'message',
    defaultColumns: ['system', 'direction', 'entityType', 'status', 'createdAt'],
    group: 'Platform',
    description: 'Append-only audit log for future integration jobs',
  },
  access: {
    read: authenticated,
    create: adminOnly,
    update: () => false,
    delete: adminOnly,
  },
  fields: [
    {
      name: 'system',
      type: 'select',
      required: true,
      options: [...integrationSystemOptions],
    },
    {
      name: 'direction',
      type: 'select',
      required: true,
      options: [...syncDirectionOptions],
    },
    {
      name: 'entityType',
      type: 'text',
      required: true,
      admin: { description: 'Payload collection slug, e.g. products' },
    },
    {
      name: 'entityId',
      type: 'text',
      required: true,
      admin: { description: 'Payload document ID' },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      options: [...syncEventStatusOptions],
    },
    {
      name: 'message',
      type: 'text',
      required: true,
    },
    {
      name: 'externalId',
      type: 'text',
    },
    {
      name: 'occurredAt',
      type: 'date',
      required: true,
      admin: { date: { pickerAppearance: 'dayAndTime' } },
    },
  ],
}
