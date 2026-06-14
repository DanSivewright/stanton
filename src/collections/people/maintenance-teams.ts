import type { CollectionConfig } from 'payload'
import { authenticated } from '../../access/authenticated'

export const MaintenanceTeams: CollectionConfig = {
  slug: 'maintenance-teams',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'company'],
  },
  access: {
    create: authenticated,
    read: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Team Name',
    },
    {
      name: 'company',
      type: 'relationship',
      relationTo: 'companies',
      required: true,
      label: 'Company',
    },
    {
      name: 'members',
      type: 'relationship',
      relationTo: 'employees',
      hasMany: true,
      label: 'Members',
    },
  ],
}
