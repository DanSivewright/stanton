import type { CollectionConfig } from 'payload'
import { authenticated } from '../../access/authenticated'
import { generateMovementReference } from '../../hooks/asset-movements/generateReference'
import { syncMovementToAsset } from '../../hooks/asset-movements/syncMovementToAsset'
import { validateMovementLocations } from '../../hooks/asset-movements/validateMovementLocations'

export const AssetMovements: CollectionConfig = {
  slug: 'asset-movements',
  admin: {
    useAsTitle: 'reference',
    defaultColumns: ['reference', 'asset', 'fromLocation', 'toLocation', 'movedAt'],
  },
  access: {
    create: authenticated,
    read: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  hooks: {
    beforeChange: [generateMovementReference, validateMovementLocations],
    afterChange: [syncMovementToAsset],
  },
  fields: [
    {
      name: 'reference',
      type: 'text',
      unique: true,
      index: true,
      label: 'Reference',
      admin: {
        readOnly: true,
        description: 'Auto-generated on create.',
      },
    },
    {
      name: 'asset',
      type: 'relationship',
      relationTo: 'assets',
      required: true,
      label: 'Asset',
    },
    {
      name: 'company',
      type: 'relationship',
      relationTo: 'companies',
      required: true,
      label: 'Company',
    },
    {
      name: 'fromLocation',
      type: 'relationship',
      relationTo: 'locations',
      label: 'From Location',
    },
    {
      name: 'toLocation',
      type: 'relationship',
      relationTo: 'locations',
      required: true,
      label: 'To Location',
      filterOptions: {
        isGroup: { equals: false },
      },
    },
    {
      name: 'movedBy',
      type: 'relationship',
      relationTo: 'employees',
      label: 'Moved By',
    },
    {
      name: 'movedAt',
      type: 'date',
      required: true,
      label: 'Moved At',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'reason',
      type: 'textarea',
      label: 'Reason',
    },
  ],
}
