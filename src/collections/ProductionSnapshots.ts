import type { CollectionConfig } from 'payload'

import { flagMaintenanceOnShotThreshold } from '@/hooks/manufacturing/flagMaintenanceOnShotThreshold'
import { externalRefsField } from '@/lib/integration/externalRefsField'
import { validateProductionSnapshot } from '@/hooks/manufacturing/validateProductionSnapshot'
import { activityOnSnapshotSubmit } from '@/hooks/platform/recordActivityOnChange'

const statusOptions = [
  { label: 'Draft', value: 'draft' },
  { label: 'Submitted', value: 'submitted' },
] as const

export const ProductionSnapshots: CollectionConfig = {
  slug: 'production-snapshots',
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['machine', 'manufacturingOrder', 'employee', 'status', 'createdAt'],
    group: 'Manufacturing',
    description: 'Operator round entries — immutable after submit',
    components: {
      beforeList: [
        '/components/admin/ManufacturingDashboardBeforeList#ManufacturingDashboardBeforeList',
      ],
    },
  },
  hooks: {
    beforeChange: [validateProductionSnapshot],
    afterChange: [activityOnSnapshotSubmit, flagMaintenanceOnShotThreshold],
  },
  fields: [
    {
      name: 'machine',
      type: 'relationship',
      relationTo: 'machines',
      required: true,
    },
    {
      name: 'manufacturingOrder',
      type: 'relationship',
      relationTo: 'manufacturing-orders',
      required: true,
    },
    {
      name: 'employee',
      type: 'relationship',
      relationTo: 'employees',
      required: true,
    },
    {
      name: 'employeeId',
      type: 'text',
      admin: { description: 'Denormalized Employee ID for cross-module joins' },
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      options: [...statusOptions],
    },
    {
      name: 'actualCycleTime',
      type: 'number',
      admin: { description: 'Actual cycle time in seconds' },
    },
    {
      name: 'unitsProduced',
      type: 'number',
      defaultValue: 0,
    },
    {
      name: 'rejects',
      type: 'number',
      defaultValue: 0,
    },
    {
      name: 'stoppage',
      type: 'group',
      fields: [
        {
          name: 'occurred',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'reason',
          type: 'text',
        },
        {
          name: 'durationMinutes',
          type: 'number',
        },
      ],
    },
    {
      name: 'notes',
      type: 'textarea',
    },
    externalRefsField,
  ],
}
