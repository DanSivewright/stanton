import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
    group: 'Foundations',
  },
  auth: true,
  fields: [
    {
      name: 'roles',
      type: 'select',
      hasMany: true,
      required: true,
      defaultValue: ['staff'],
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Staff', value: 'staff' },
      ],
      saveToJWT: true,
    },
    {
      name: 'employee',
      type: 'relationship',
      relationTo: 'employees',
      admin: {
        description: 'Optional link to business person record (FND-003)',
      },
    },
    {
      name: 'companyScope',
      type: 'relationship',
      relationTo: 'companies',
      hasMany: true,
      admin: {
        description: 'Optional multi-company access scope (enforced in PLAT-007)',
      },
    },
  ],
}
