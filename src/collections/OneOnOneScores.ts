import type { CollectionConfig } from 'payload'

export const OneOnOneScores: CollectionConfig = {
  slug: 'one-on-one-scores',
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['employee', 'weekStart', 'accuracy', 'runs', 'manager'],
    group: 'Manufacturing',
    description: 'Weekly Accuracy/Runs scores — canonical home for HR rollup',
  },
  fields: [
    {
      name: 'employee',
      type: 'relationship',
      relationTo: 'employees',
      required: true,
    },
    {
      name: 'employeeId',
      type: 'text',
      index: true,
    },
    {
      name: 'manager',
      type: 'relationship',
      relationTo: 'employees',
    },
    {
      name: 'weekStart',
      type: 'date',
      required: true,
      admin: { date: { pickerAppearance: 'dayOnly' } },
    },
    {
      name: 'accuracy',
      type: 'number',
      min: 0,
      max: 100,
      admin: { description: 'Accuracy score 0–100' },
    },
    {
      name: 'runs',
      type: 'number',
      min: 0,
      admin: { description: 'Runs completed count' },
    },
    {
      name: 'notes',
      type: 'textarea',
    },
  ],
}
