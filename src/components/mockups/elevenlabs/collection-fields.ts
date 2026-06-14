import type { MockupCollectionSlug } from '@/lib/mockups/navigation'
import { formatDate, formatDateTime, relLabel } from '@/lib/mockups/helpers'

type Doc = Record<string, unknown>

type DetailField = {
  label: string
  value: string
}

export function getDetailFields(slug: MockupCollectionSlug, doc: Doc): DetailField[] {
  const rel = (key: string, fallback = '—') => relLabel(doc[key] as never, fallback)
  const str = (key: string, fallback = '—') => {
    const v = doc[key]
    if (v == null || v === '') return fallback
    return String(v)
  }

  switch (slug) {
    case 'companies':
      return [
        { label: 'Name', value: str('name') },
        { label: 'Code', value: str('code') },
        { label: 'Parent', value: rel('parent') },
      ]
    case 'locations':
      return [
        { label: 'Name', value: str('name') },
        { label: 'Company', value: rel('company') },
        { label: 'Type', value: doc.isGroup ? 'Group' : 'Leaf location' },
        { label: 'Kind', value: str('kind') },
        { label: 'Parent', value: rel('parent') },
        { label: 'Notes', value: str('notes') },
      ]
    case 'asset-categories':
    case 'asset-statuses':
    case 'ticket-types':
      return [
        { label: 'Name', value: str('name') },
        { label: 'Description', value: str('description') },
      ]
    case 'employees':
      return [
        { label: 'Full name', value: str('fullName') },
        { label: 'Company', value: rel('company') },
        { label: 'Job title', value: str('jobTitle') },
        { label: 'Email', value: str('email') },
        { label: 'Phone', value: str('phone') },
        { label: 'Team', value: rel('team') },
      ]
    case 'maintenance-teams':
      return [
        { label: 'Name', value: str('name') },
        { label: 'Company', value: rel('company') },
        { label: 'Members', value: formatMembers(doc.members) },
      ]
    case 'users':
      return [
        { label: 'Email', value: str('email') },
        { label: 'Role', value: str('role') },
        { label: 'Employee', value: rel('employee') },
      ]
    case 'assets':
      return [
        { label: 'Name', value: str('name') },
        { label: 'Asset tag', value: str('assetTag') },
        { label: 'Company', value: rel('company') },
        { label: 'Location', value: rel('location') },
        { label: 'Category', value: rel('category') },
        { label: 'Status', value: rel('status') },
        { label: 'Serial number', value: str('serialNumber') },
        { label: 'Tonnage', value: doc.tonnage != null ? String(doc.tonnage) : '—' },
        { label: 'Custodian', value: rel('custodian') },
        { label: 'Default team', value: rel('defaultTeam') },
        { label: 'Notes', value: str('notes') },
      ]
    case 'asset-movements':
      return [
        { label: 'Reference', value: str('reference') },
        { label: 'Asset', value: rel('asset') },
        { label: 'Company', value: rel('company') },
        { label: 'From', value: rel('fromLocation') },
        { label: 'To', value: rel('toLocation') },
        { label: 'Moved by', value: rel('movedBy') },
        { label: 'Moved at', value: formatDateTime(doc.movedAt as string) },
        { label: 'Reason', value: str('reason') },
      ]
    case 'tickets':
      return [
        { label: 'Ticket number', value: str('ticketNumber') },
        { label: 'Title', value: str('title') },
        { label: 'Description', value: str('description') },
        { label: 'Type', value: rel('type') },
        { label: 'Priority', value: str('priority') },
        { label: 'Status', value: str('status').replace(/_/g, ' ') },
        { label: 'Review', value: str('reviewStatus').replace(/_/g, ' ') },
        { label: 'Company', value: rel('company') },
        { label: 'Location', value: rel('location') },
        { label: 'Asset', value: rel('asset') },
        { label: 'Reported by', value: rel('reportedBy') },
        { label: 'Reported at', value: formatDateTime(doc.reportedAt as string) },
        { label: 'Assigned team', value: rel('assignedTeam') },
        { label: 'Assigned to', value: rel('assignedTo') },
      ]
    default:
      return []
  }
}

function formatMembers(members: unknown): string {
  if (!Array.isArray(members) || members.length === 0) return '—'
  return members.map((m) => relLabel(m as never)).join(', ')
}

export function getListColumns(slug: MockupCollectionSlug): { key: string; label: string }[] {
  switch (slug) {
    case 'companies':
      return [
        { key: 'name', label: 'Name' },
        { key: 'code', label: 'Code' },
        { key: 'parent', label: 'Parent' },
      ]
    case 'locations':
      return [
        { key: 'name', label: 'Name' },
        { key: 'company', label: 'Company' },
        { key: 'isGroup', label: 'Type' },
      ]
    case 'employees':
      return [
        { key: 'fullName', label: 'Name' },
        { key: 'company', label: 'Company' },
        { key: 'jobTitle', label: 'Role' },
      ]
    case 'maintenance-teams':
      return [
        { key: 'name', label: 'Team' },
        { key: 'company', label: 'Company' },
      ]
    case 'users':
      return [
        { key: 'email', label: 'Email' },
        { key: 'role', label: 'Role' },
        { key: 'employee', label: 'Employee' },
      ]
    case 'asset-movements':
      return [
        { key: 'reference', label: 'Reference' },
        { key: 'asset', label: 'Asset' },
        { key: 'movedAt', label: 'Moved' },
      ]
    default:
      return [
        { key: 'name', label: 'Name' },
        { key: 'description', label: 'Description' },
      ]
  }
}

export function cellValue(slug: MockupCollectionSlug, doc: Doc, key: string): string {
  if (key === 'isGroup') return doc.isGroup ? 'Group' : 'Location'
  if (key === 'movedAt') return formatDate(doc.movedAt as string)
  if (key === 'parent' || key === 'company' || key === 'employee' || key === 'asset') {
    return relLabel(doc[key] as never)
  }
  const v = doc[key]
  if (v == null || v === '') return '—'
  return String(v)
}
