import type { CollectionConfig } from 'payload'
import { authenticated } from '../../access/authenticated'
import { DEFAULT_USER_ROLE, USER_ROLES } from '../../lib/constants/userRoles'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'role', 'employee'],
  },
  auth: true,
  access: {
    create: authenticated,
    read: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  fields: [
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: DEFAULT_USER_ROLE,
      options: [...USER_ROLES],
      saveToJWT: true,
      label: 'Role',
      admin: {
        description: 'Stored for future RBAC; MVP grants broad access to all authenticated users.',
      },
    },
    {
      name: 'employee',
      type: 'relationship',
      relationTo: 'employees',
      required: true,
      label: 'Employee',
      admin: {
        description: 'Create the employee record first, then link it here.',
      },
    },
  ],
}
