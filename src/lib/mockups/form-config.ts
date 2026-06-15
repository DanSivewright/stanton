import type { MockupCollectionSlug } from './navigation'
import { LOCATION_KINDS } from '@/lib/constants/locationKinds'
import { TICKET_PRIORITIES } from '@/lib/constants/ticketPriorities'
import { TICKET_STATUSES } from '@/lib/constants/ticketStatuses'
import { TICKET_REVIEW_STATUSES } from '@/lib/constants/ticketReviewStatuses'
import { USER_ROLES } from '@/lib/constants/userRoles'

export type FormFieldType =
  | 'text'
  | 'textarea'
  | 'email'
  | 'number'
  | 'date'
  | 'checkbox'
  | 'select'
  | 'relationship'
  | 'password'

export type FormFieldDef = {
  name: string
  label: string
  type: FormFieldType
  required?: boolean
  readOnly?: boolean
  relationTo?: MockupCollectionSlug
  hasMany?: boolean
  options?: { label: string; value: string }[]
  defaultValue?: string | number | boolean
  placeholder?: string
  helpText?: string
}

export type FormConfig = {
  slug: MockupCollectionSlug
  fields: FormFieldDef[]
}

const selectOpts = (values: readonly string[]) =>
  values.map((v) => ({ label: v.replace(/_/g, ' '), value: v }))

export const FORM_CONFIG: Record<MockupCollectionSlug, FormConfig> = {
  companies: {
    slug: 'companies',
    fields: [
      { name: 'name', label: 'Name', type: 'text', required: true },
      { name: 'code', label: 'Code', type: 'text', required: true },
      { name: 'parent', label: 'Parent company', type: 'relationship', relationTo: 'companies' },
    ],
  },
  locations: {
    slug: 'locations',
    fields: [
      { name: 'name', label: 'Location name', type: 'text', required: true },
      { name: 'company', label: 'Company', type: 'relationship', relationTo: 'companies', required: true },
      { name: 'isGroup', label: 'Is group node', type: 'checkbox', defaultValue: false },
      { name: 'parent', label: 'Parent location', type: 'relationship', relationTo: 'locations' },
      { name: 'kind', label: 'Kind', type: 'select', options: selectOpts(LOCATION_KINDS) },
      { name: 'notes', label: 'Notes', type: 'textarea' },
    ],
  },
  'asset-categories': {
    slug: 'asset-categories',
    fields: [
      { name: 'name', label: 'Name', type: 'text', required: true },
      { name: 'description', label: 'Description', type: 'textarea' },
    ],
  },
  'asset-statuses': {
    slug: 'asset-statuses',
    fields: [
      { name: 'name', label: 'Name', type: 'text', required: true },
      { name: 'description', label: 'Description', type: 'textarea' },
    ],
  },
  'ticket-types': {
    slug: 'ticket-types',
    fields: [
      { name: 'name', label: 'Name', type: 'text', required: true },
      { name: 'description', label: 'Description', type: 'textarea' },
    ],
  },
  employees: {
    slug: 'employees',
    fields: [
      { name: 'fullName', label: 'Full name', type: 'text', required: true },
      { name: 'company', label: 'Company', type: 'relationship', relationTo: 'companies', required: true },
      { name: 'jobTitle', label: 'Job title', type: 'text' },
      { name: 'phone', label: 'Phone', type: 'text' },
      { name: 'email', label: 'Email', type: 'email' },
      { name: 'team', label: 'Primary team', type: 'relationship', relationTo: 'maintenance-teams' },
      { name: 'user', label: 'Linked user', type: 'relationship', relationTo: 'users' },
    ],
  },
  'maintenance-teams': {
    slug: 'maintenance-teams',
    fields: [
      { name: 'name', label: 'Team name', type: 'text', required: true },
      { name: 'company', label: 'Company', type: 'relationship', relationTo: 'companies', required: true },
      { name: 'members', label: 'Members', type: 'relationship', relationTo: 'employees', hasMany: true },
    ],
  },
  users: {
    slug: 'users',
    fields: [
      { name: 'email', label: 'Email', type: 'email', required: true },
      { name: 'password', label: 'Password', type: 'password', required: true },
      { name: 'role', label: 'Role', type: 'select', required: true, options: selectOpts(USER_ROLES), defaultValue: 'staff' },
      { name: 'employee', label: 'Employee', type: 'relationship', relationTo: 'employees', required: true },
    ],
  },
  assets: {
    slug: 'assets',
    fields: [
      { name: 'name', label: 'Name', type: 'text', required: true },
      { name: 'assetTag', label: 'Asset tag', type: 'text', required: true },
      { name: 'company', label: 'Owner company', type: 'relationship', relationTo: 'companies', required: true },
      { name: 'location', label: 'Location', type: 'relationship', relationTo: 'locations', required: true },
      { name: 'category', label: 'Category', type: 'relationship', relationTo: 'asset-categories', required: true },
      { name: 'status', label: 'Status', type: 'relationship', relationTo: 'asset-statuses', required: true },
      { name: 'serialNumber', label: 'Serial number', type: 'text' },
      { name: 'tonnage', label: 'Tonnage', type: 'number' },
      { name: 'custodian', label: 'Custodian', type: 'relationship', relationTo: 'employees' },
      { name: 'defaultTeam', label: 'Default team', type: 'relationship', relationTo: 'maintenance-teams' },
      { name: 'notes', label: 'Notes', type: 'textarea' },
    ],
  },
  'asset-movements': {
    slug: 'asset-movements',
    fields: [
      { name: 'asset', label: 'Asset', type: 'relationship', relationTo: 'assets', required: true },
      { name: 'company', label: 'Company', type: 'relationship', relationTo: 'companies', required: true },
      { name: 'fromLocation', label: 'From location', type: 'relationship', relationTo: 'locations' },
      { name: 'toLocation', label: 'To location', type: 'relationship', relationTo: 'locations', required: true },
      { name: 'movedBy', label: 'Moved by', type: 'relationship', relationTo: 'employees' },
      { name: 'movedAt', label: 'Moved at', type: 'date', required: true },
      { name: 'reason', label: 'Reason', type: 'textarea' },
    ],
  },
  tickets: {
    slug: 'tickets',
    fields: [
      { name: 'title', label: 'Title', type: 'text', required: true },
      { name: 'description', label: 'Description', type: 'textarea' },
      { name: 'type', label: 'Type', type: 'relationship', relationTo: 'ticket-types', required: true },
      { name: 'priority', label: 'Priority', type: 'select', required: true, options: selectOpts(TICKET_PRIORITIES), defaultValue: 'medium' },
      { name: 'status', label: 'Status', type: 'select', required: true, options: selectOpts(TICKET_STATUSES), defaultValue: 'open' },
      { name: 'reviewStatus', label: 'Review status', type: 'select', required: true, options: selectOpts(TICKET_REVIEW_STATUSES), defaultValue: 'none' },
      { name: 'company', label: 'Company', type: 'relationship', relationTo: 'companies', required: true },
      { name: 'location', label: 'Location', type: 'relationship', relationTo: 'locations', required: true },
      { name: 'asset', label: 'Asset', type: 'relationship', relationTo: 'assets' },
      { name: 'reportedBy', label: 'Reported by', type: 'relationship', relationTo: 'employees', required: true },
      { name: 'reportedAt', label: 'Reported at', type: 'date', required: true },
      { name: 'assignedTeam', label: 'Assigned team', type: 'relationship', relationTo: 'maintenance-teams' },
      { name: 'assignedTo', label: 'Assigned to', type: 'relationship', relationTo: 'employees' },
    ],
  },
}

export function getFormConfig(slug: MockupCollectionSlug): FormConfig {
  return FORM_CONFIG[slug]
}

export function getEditableFields(slug: MockupCollectionSlug, mode: 'create' | 'edit'): FormFieldDef[] {
  const config = FORM_CONFIG[slug]
  if (mode === 'edit' && slug === 'users') {
    return config.fields.map((f) =>
      f.name === 'password' ? { ...f, required: false, label: 'New password (optional)' } : f,
    )
  }
  return config.fields
}

export function docToFormValues(
  doc: Record<string, unknown>,
  slug: MockupCollectionSlug,
): Record<string, unknown> {
  const fields = FORM_CONFIG[slug].fields
  const values: Record<string, unknown> = {}

  for (const field of fields) {
    if (field.name === 'password') continue
    const raw = doc[field.name]
    if (field.type === 'relationship') {
      if (field.hasMany && Array.isArray(raw)) {
        values[field.name] = raw.map((r) =>
          typeof r === 'object' && r !== null && 'id' in r ? String((r as { id: string }).id) : String(r),
        )
      } else if (raw && typeof raw === 'object' && 'id' in raw) {
        values[field.name] = String((raw as { id: string }).id)
      } else if (raw != null) {
        values[field.name] = String(raw)
      } else {
        values[field.name] = field.hasMany ? [] : ''
      }
    } else if (field.type === 'checkbox') {
      values[field.name] = Boolean(raw)
    } else if (field.type === 'date' && raw) {
      const d = typeof raw === 'string' ? raw : new Date(raw as Date).toISOString()
      values[field.name] = d.slice(0, 10)
    } else if (raw != null) {
      values[field.name] = raw
    }
  }

  return values
}
