import type { Field } from 'payload'

import { rasciOptions, spdRoleOptions } from './constants'

export const processPhasesFields: Field[] = [
  {
    name: 'phases',
    type: 'array',
    labels: {
      singular: 'Phase',
      plural: 'Phases',
    },
    fields: [
      {
        name: 'phaseId',
        type: 'text',
        required: true,
      },
      {
        name: 'name',
        type: 'text',
        required: true,
      },
      {
        name: 'order',
        type: 'number',
        required: true,
        min: 1,
      },
      {
        name: 'stages',
        type: 'array',
        labels: {
          singular: 'Stage',
          plural: 'Stages',
        },
        fields: [
          {
            name: 'stageId',
            type: 'text',
            required: true,
          },
          {
            name: 'name',
            type: 'text',
            required: true,
          },
          {
            name: 'order',
            type: 'number',
            required: true,
            min: 1,
          },
          {
            name: 'checklistItems',
            type: 'array',
            labels: {
              singular: 'Checklist Item',
              plural: 'Checklist Items',
            },
            fields: [
              {
                name: 'item',
                type: 'text',
                required: true,
              },
            ],
          },
          {
            name: 'deliverables',
            type: 'array',
            labels: {
              singular: 'Deliverable',
              plural: 'Deliverables',
            },
            fields: [
              {
                name: 'name',
                type: 'text',
                required: true,
              },
            ],
          },
          {
            name: 'gate',
            type: 'group',
            fields: [
              {
                name: 'gateId',
                type: 'text',
              },
              {
                name: 'name',
                type: 'text',
              },
              {
                name: 'description',
                type: 'textarea',
              },
              {
                name: 'requiredRoles',
                type: 'select',
                hasMany: true,
                options: [...spdRoleOptions],
              },
            ],
          },
          {
            name: 'rasci',
            type: 'array',
            labels: {
              singular: 'RASCI Assignment',
              plural: 'RASCI Assignments',
            },
            fields: [
              {
                name: 'role',
                type: 'select',
                required: true,
                options: [...spdRoleOptions],
              },
              {
                name: 'responsibility',
                type: 'select',
                required: true,
                options: [...rasciOptions],
              },
            ],
          },
        ],
      },
    ],
  },
]
