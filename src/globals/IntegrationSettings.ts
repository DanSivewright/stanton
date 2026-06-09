import type { Field, GlobalConfig } from 'payload'

import { sensitiveModuleRead, sensitiveModuleWrite } from '@/lib/access/roles'

function systemGroup(label: string, defaultUrl: string): Field {
  return {
    name: label.toLowerCase(),
    type: 'group',
    label,
    fields: [
      {
        name: 'enabled',
        type: 'checkbox',
        defaultValue: false,
        admin: { description: 'Connector not built — placeholder for future enablement' },
      },
      {
        name: 'notes',
        type: 'textarea',
        admin: { description: 'Assumptions, scope notes, client decisions' },
      },
      {
        name: 'baseUrlPlaceholder',
        type: 'text',
        defaultValue: defaultUrl,
        admin: { description: 'Instance URL hint only — no secrets stored here' },
      },
      {
        name: 'fieldMapping',
        type: 'json',
        admin: {
          description: 'Empty object by default; future jobs map external ↔ Payload fields',
        },
      },
    ],
  }
}

export const IntegrationSettings: GlobalConfig = {
  slug: 'integration-settings',
  label: 'Integration Settings',
  admin: {
    group: 'Platform',
    description: 'Per-system stubs for future Odoo / Pipedrive / SharePoint connectors',
  },
  access: {
    read: sensitiveModuleRead,
    update: sensitiveModuleWrite,
  },
  fields: [
    systemGroup('Odoo', 'https://odoo.example.com'),
    systemGroup('Pipedrive', 'https://company.pipedrive.com'),
    systemGroup('SharePoint', 'https://tenant.sharepoint.com/sites/pimms'),
  ],
}
