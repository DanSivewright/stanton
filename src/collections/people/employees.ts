import type { CollectionConfig } from 'payload'
import { authenticated } from '../../access/authenticated'
import { generateEmployeeId } from '../../hooks/employees/generateEmployeeId'

export const Employees: CollectionConfig = {
  slug: 'employees',
  admin: {
    useAsTitle: 'fullName',
    defaultColumns: ['employeeId', 'fullName', 'company', 'jobTitle', 'team'],
  },
  access: {
    create: authenticated,
    read: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  hooks: {
    beforeChange: [generateEmployeeId],
  },
  fields: [
    {
      name: 'employeeId',
      type: 'text',
      unique: true,
      index: true,
      label: 'Employee ID',
      admin: {
        readOnly: true,
        description: 'Auto-generated on create.',
      },
    },
    {
      name: 'fullName',
      type: 'text',
      required: true,
      label: 'Full Name',
    },
    {
      name: 'company',
      type: 'relationship',
      relationTo: 'companies',
      required: true,
      label: 'Company',
    },
    {
      name: 'jobTitle',
      type: 'text',
      label: 'Job Title',
    },
    {
      name: 'phone',
      type: 'text',
      label: 'Phone',
    },
    {
      name: 'email',
      type: 'email',
      label: 'Email',
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      label: 'User Account',
      admin: {
        description: 'Optional link to a Payload admin user.',
      },
    },
    {
      name: 'team',
      type: 'relationship',
      relationTo: 'maintenance-teams',
      label: 'Primary Team',
    },
  ],
}
