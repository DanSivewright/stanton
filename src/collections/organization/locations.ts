import type { CollectionConfig, Where } from 'payload'
import { authenticated } from '../../access/authenticated'
import { LOCATION_KINDS } from '../../lib/constants/locationKinds'
import { validateParentLocation } from '../../hooks/locations/validateParentLocation'

export const Locations: CollectionConfig = {
  slug: 'locations',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'company', 'isGroup', 'parent'],
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
      label: 'Location Name',
    },
    {
      name: 'company',
      type: 'relationship',
      relationTo: 'companies',
      required: true,
      label: 'Company',
    },
    {
      name: 'isGroup',
      type: 'checkbox',
      defaultValue: false,
      label: 'Is Group',
      admin: {
        description: 'Group nodes organise the tree; only leaf locations hold assets and tickets.',
      },
    },
    {
      name: 'parent',
      type: 'relationship',
      relationTo: 'locations',
      label: 'Parent Location',
      admin: {
        description: 'Parent must be a group location within the same company.',
      },
      filterOptions: ({ id, siblingData }) => {
        const filters: Where = { isGroup: { equals: true } }
        if (id) filters.id = { not_equals: id }
        const data = siblingData as { company?: string | { id: string } } | undefined
        const companyId =
          typeof data?.company === 'object' && data.company !== null
            ? data.company.id
            : data?.company
        if (companyId) filters.company = { equals: companyId }
        return filters
      },
      validate: validateParentLocation,
    },
    {
      name: 'kind',
      type: 'select',
      options: [...LOCATION_KINDS],
      label: 'Kind',
      admin: {
        description: 'Optional label for what this node represents in the hierarchy.',
      },
    },
    {
      name: 'children',
      type: 'join',
      collection: 'locations',
      on: 'parent',
      admin: {
        condition: (data) => data.isGroup === true,
        description: 'Locations nested under this group.',
        defaultColumns: ['name', 'isGroup', 'kind'],
      },
    },
    {
      name: 'assets',
      type: 'join',
      collection: 'assets',
      on: 'location',
      admin: {
        allowCreate: false,
        description: 'Assets assigned to this location.',
        defaultColumns: ['name', 'assetTag', 'status'],
      },
    },
    {
      name: 'tickets',
      type: 'join',
      collection: 'tickets',
      on: 'location',
      admin: {
        allowCreate: false,
        description: 'Maintenance tickets for this location.',
        defaultColumns: ['ticketNumber', 'title', 'type', 'status'],
      },
    },
    {
      name: 'notes',
      type: 'textarea',
      label: 'Notes',
    },
  ],
}
