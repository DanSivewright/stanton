import type { CollectionConfig } from 'payload'
import { authenticated } from '../../access/authenticated'
import { syncLocationToMovement } from '../../hooks/assets/syncLocationToMovement'
import { validateAssetLocation } from '../../hooks/assets/validateAssetLocation'

export const Assets: CollectionConfig = {
  slug: 'assets',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'assetTag', 'company', 'location', 'status'],
  },
  access: {
    create: authenticated,
    read: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  hooks: {
    beforeChange: [validateAssetLocation],
    afterChange: [syncLocationToMovement],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Asset Name',
    },
    {
      name: 'assetTag',
      type: 'text',
      required: true,
      unique: true,
      index: true,
      label: 'Asset Tag',
    },
    {
      name: 'company',
      type: 'relationship',
      relationTo: 'companies',
      required: true,
      label: 'Owner Company',
      admin: {
        description: 'Owning company — may differ from the location company.',
      },
    },
    {
      name: 'location',
      type: 'relationship',
      relationTo: 'locations',
      required: true,
      label: 'Location',
      filterOptions: {
        isGroup: { equals: false },
      },
    },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'asset-categories',
      required: true,
      label: 'Category',
    },
    {
      name: 'status',
      type: 'relationship',
      relationTo: 'asset-statuses',
      required: true,
      label: 'Status',
    },
    {
      name: 'serialNumber',
      type: 'text',
      label: 'Serial Number',
    },
    {
      name: 'tonnage',
      type: 'number',
      label: 'Tonnage',
    },
    {
      name: 'custodian',
      type: 'relationship',
      relationTo: 'employees',
      label: 'Custodian',
    },
    {
      name: 'defaultTeam',
      type: 'relationship',
      relationTo: 'maintenance-teams',
      label: 'Default Team',
      admin: {
        description: 'Pre-fills ticket assignment when this asset is linked.',
      },
    },
    {
      name: 'notes',
      type: 'textarea',
      label: 'Notes',
    },
  ],
}
