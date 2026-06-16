import type { CollectionConfig } from 'payload'
import { authenticated } from '../../access/authenticated'
import { syncLocationToMovement } from '../../hooks/assets/syncLocationToMovement'
import { validateAssetLocation } from '../../hooks/assets/validateAssetLocation'

function isMachineAsset(_: unknown, siblingData: Record<string, unknown> = {}) {
  const assetTag = typeof siblingData.assetTag === 'string' ? siblingData.assetTag : ''
  return assetTag.startsWith('MFG-')
}

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
    {
      type: 'collapsible',
      label: 'Machine Dashboard Data',
      admin: {
        condition: isMachineAsset,
        description: 'Optional metrics for manufacturing machine dashboards.',
      },
      fields: [
        {
          name: 'machineCode',
          type: 'text',
          label: 'Machine Code',
        },
        {
          name: 'factorySheet',
          type: 'text',
          label: 'Factory Sheet',
        },
        {
          name: 'currentJobLabel',
          type: 'text',
          label: 'Current Job',
        },
        {
          name: 'moNumber',
          type: 'text',
          label: 'MO Number',
        },
        {
          name: 'salesOrderOrStock',
          type: 'text',
          label: 'Sales O/N or Stock O/N',
        },
        {
          name: 'month',
          type: 'text',
          label: 'Month',
        },
        {
          name: 'palletType',
          type: 'text',
          label: 'Pallet Type',
        },
        {
          name: 'setupTimeMin',
          type: 'number',
          label: 'Setup Time (min)',
        },
        {
          name: 'lsFlag',
          type: 'text',
          label: 'L/S',
        },
        {
          name: 'targetCycleTimeSec',
          type: 'number',
          label: 'Target Cycle Time (sec)',
        },
        {
          name: 'actualCycleTimeSec',
          type: 'number',
          label: 'Actual Cycle Time (sec)',
        },
        {
          name: 'oeePercent',
          type: 'number',
          label: 'OEE (%)',
          min: 0,
          max: 100,
        },
        {
          name: 'targetOutputPerHour',
          type: 'number',
          label: 'Target Output / Hour',
        },
        {
          name: 'actualOutputPerHour',
          type: 'number',
          label: 'Actual Output / Hour',
        },
        {
          name: 'cycleVariancePercent',
          type: 'number',
          label: 'Cycle Variance (%)',
        },
        {
          name: 'productionVariancePercent',
          type: 'number',
          label: 'Production Variance (%)',
        },
        {
          name: 'machineStoppage',
          type: 'checkbox',
          label: 'Machine Stoppage',
        },
        {
          name: 'stoppageReason',
          type: 'textarea',
          label: 'Stoppage Reason',
          validate: (value, { siblingData }) => {
            const machineStoppage =
              typeof siblingData === 'object' &&
              siblingData != null &&
              'machineStoppage' in siblingData
                ? Boolean((siblingData as { machineStoppage?: unknown }).machineStoppage)
                : false
            if (!machineStoppage) {
              return true
            }

            if (typeof value === 'string' && value.trim()) {
              return true
            }

            return 'Stoppage reason is required when machine stoppage is checked.'
          },
          admin: {
            condition: (_, siblingData) => Boolean(siblingData?.machineStoppage),
          },
        },
        {
          name: 'reasonForDrift',
          type: 'textarea',
          label: 'Reason For Drift',
        },
        {
          name: 'productionStartDate',
          type: 'date',
          label: 'Production Start Date',
        },
        {
          name: 'originalPlannedDate',
          type: 'date',
          label: 'Original Planned Date',
        },
        {
          name: 'driftDays',
          type: 'number',
          label: 'Drift (days)',
        },
        {
          name: 'remainDays',
          type: 'number',
          label: 'Remaining (days)',
        },
        {
          name: 'remainQty',
          type: 'number',
          label: 'Remaining Qty',
        },
        {
          name: 'remainHours',
          type: 'number',
          label: 'Remaining Hours',
        },
        {
          name: 'qtyPerDay',
          type: 'number',
          label: 'Qty Per Day',
        },
        {
          name: 'orderQty',
          type: 'number',
          label: 'Order Qty',
        },
        {
          name: 'cavQty',
          type: 'number',
          label: 'Cavity Qty',
        },
        {
          name: 'shotQty',
          type: 'number',
          label: 'Shot Qty',
        },
        {
          name: 'satMon',
          type: 'checkbox',
          label: 'SAT-MON',
        },
        {
          name: 'productionEndDate',
          type: 'date',
          label: 'Production End Date',
        },
        {
          name: 'machineStatus',
          type: 'select',
          label: 'Machine Status',
          options: [
            { label: 'Running', value: 'running' },
            { label: 'Warning', value: 'warning' },
            { label: 'Critical', value: 'critical' },
            { label: 'Stopped', value: 'stopped' },
          ],
        },
        {
          name: 'lastSnapshotAt',
          type: 'date',
          label: 'Last Snapshot At',
        },
      ],
    },
  ],
}
