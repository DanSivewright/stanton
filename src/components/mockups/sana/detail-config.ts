import type { MockupCollectionSlug } from '@/lib/mockups/navigation'
import { formatDate, formatDateTime, relLabel } from '@/lib/mockups/helpers'

export type DetailField = {
  label: string
  value: string
  wide?: boolean
}

type Doc = Record<string, unknown>

function rel(key: string, doc: Doc): string {
  return relLabel(doc[key] as Parameters<typeof relLabel>[0])
}

function txt(key: string, doc: Doc): string {
  const v = doc[key]
  if (v == null || v === '') return '—'
  return String(v)
}

function bool(key: string, doc: Doc): string {
  return doc[key] ? 'Yes' : 'No'
}

function members(doc: Doc): string {
  const members = doc.members as unknown[] | undefined
  return String(members?.length ?? 0)
}

export function getDetailFields(slug: MockupCollectionSlug, doc: Doc): DetailField[] {
  switch (slug) {
    case 'companies':
      return [
        { label: 'Name', value: txt('name', doc) },
        { label: 'Code', value: txt('code', doc) },
        { label: 'Parent', value: rel('parent', doc) },
      ]
    case 'locations':
      return [
        { label: 'Name', value: txt('name', doc) },
        { label: 'Company', value: rel('company', doc) },
        { label: 'Is Group', value: bool('isGroup', doc) },
        { label: 'Kind', value: txt('kind', doc) },
        { label: 'Parent', value: rel('parent', doc) },
        { label: 'Notes', value: txt('notes', doc), wide: true },
      ]
    case 'asset-categories':
    case 'asset-statuses':
    case 'ticket-types':
      return [
        { label: 'Name', value: txt('name', doc) },
        { label: 'Description', value: txt('description', doc), wide: true },
      ]
    case 'employees':
      return [
        { label: 'Full Name', value: txt('fullName', doc) },
        { label: 'Company', value: rel('company', doc) },
        { label: 'Job Title', value: txt('jobTitle', doc) },
        { label: 'Email', value: txt('email', doc) },
        { label: 'Phone', value: txt('phone', doc) },
        { label: 'Team', value: rel('team', doc) },
        { label: 'User Account', value: rel('user', doc) },
      ]
    case 'maintenance-teams':
      return [
        { label: 'Name', value: txt('name', doc) },
        { label: 'Company', value: rel('company', doc) },
        { label: 'Members', value: members(doc) },
      ]
    case 'users':
      return [
        { label: 'Email', value: txt('email', doc) },
        { label: 'Role', value: txt('role', doc) },
        { label: 'Employee', value: rel('employee', doc) },
      ]
    case 'assets':
      return [
        { label: 'Name', value: txt('name', doc) },
        { label: 'Asset Tag', value: txt('assetTag', doc) },
        { label: 'Company', value: rel('company', doc) },
        { label: 'Location', value: rel('location', doc) },
        { label: 'Category', value: rel('category', doc) },
        { label: 'Status', value: rel('status', doc) },
        { label: 'Serial Number', value: txt('serialNumber', doc) },
        { label: 'Tonnage', value: txt('tonnage', doc) },
        { label: 'Custodian', value: rel('custodian', doc) },
        { label: 'Default Team', value: rel('defaultTeam', doc) },
        { label: 'Notes', value: txt('notes', doc), wide: true },
      ]
    case 'asset-movements':
      return [
        { label: 'Reference', value: txt('reference', doc) },
        { label: 'Asset', value: rel('asset', doc) },
        { label: 'Company', value: rel('company', doc) },
        { label: 'From Location', value: rel('fromLocation', doc) },
        { label: 'To Location', value: rel('toLocation', doc) },
        { label: 'Moved By', value: rel('movedBy', doc) },
        { label: 'Moved At', value: formatDateTime(doc.movedAt as string) },
        { label: 'Reason', value: txt('reason', doc), wide: true },
      ]
    case 'tickets':
      return [
        { label: 'Ticket Number', value: txt('ticketNumber', doc) },
        { label: 'Title', value: txt('title', doc), wide: true },
        { label: 'Description', value: txt('description', doc), wide: true },
        { label: 'Type', value: rel('type', doc) },
        { label: 'Priority', value: txt('priority', doc) },
        { label: 'Status', value: txt('status', doc) },
        { label: 'Review Status', value: txt('reviewStatus', doc) },
        { label: 'Company', value: rel('company', doc) },
        { label: 'Location', value: rel('location', doc) },
        { label: 'Asset', value: rel('asset', doc) },
        { label: 'Reported By', value: rel('reportedBy', doc) },
        { label: 'Reported At', value: formatDateTime(doc.reportedAt as string) },
        { label: 'Assigned Team', value: rel('assignedTeam', doc) },
        { label: 'Assigned To', value: rel('assignedTo', doc) },
      ]
    default:
      return []
  }
}

export function getMetaFields(doc: Doc): DetailField[] {
  return [
    { label: 'Created', value: formatDate(doc.createdAt as string) },
    { label: 'Updated', value: formatDate(doc.updatedAt as string) },
  ]
}
