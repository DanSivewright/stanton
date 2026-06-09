import type { CollectionConfig } from 'payload'

export const MaintenancePOs: CollectionConfig = {
  slug: 'maintenance-pos',
  admin: {
    useAsTitle: 'poNumber',
    defaultColumns: ['poNumber', 'maintenanceJob', 'machine', 'createdAt'],
    group: 'Maintenance',
  },
  fields: [
    {
      name: 'poNumber',
      type: 'text',
      required: true,
    },
    {
      name: 'maintenanceJob',
      type: 'relationship',
      relationTo: 'maintenance-jobs',
      required: true,
    },
    {
      name: 'machine',
      type: 'relationship',
      relationTo: 'machines',
    },
    {
      name: 'document',
      type: 'relationship',
      relationTo: 'documents',
      required: true,
    },
    {
      name: 'notes',
      type: 'textarea',
    },
  ],
}
