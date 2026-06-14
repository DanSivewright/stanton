import type { MockupCollectionSlug } from '@/lib/mockups/navigation'
import { formatDate, formatDateTime, relLabel, statusLabel } from '@/lib/mockups/helpers'
import { priorityColor } from '@/lib/mockups/helpers'

type Doc = Record<string, unknown>

export type ColumnDef = {
  key: string
  label: string
  render: (doc: Doc) => React.ReactNode
}

function rel(doc: Doc, key: string) {
  return relLabel(doc[key] as Parameters<typeof relLabel>[0])
}

export const COLLECTION_COLUMNS: Record<MockupCollectionSlug, ColumnDef[]> = {
  companies: [
    { key: 'name', label: 'Name', render: (d) => String(d.name ?? '—') },
    { key: 'code', label: 'Code', render: (d) => String(d.code ?? '—') },
    { key: 'parent', label: 'Parent', render: (d) => rel(d, 'parent') },
  ],
  locations: [
    { key: 'name', label: 'Name', render: (d) => String(d.name ?? '—') },
    { key: 'company', label: 'Company', render: (d) => rel(d, 'company') },
    { key: 'kind', label: 'Kind', render: (d) => String(d.kind ?? '—') },
    {
      key: 'isGroup',
      label: 'Type',
      render: (d) => (d.isGroup ? 'Group' : 'Leaf'),
    },
  ],
  'asset-categories': [
    { key: 'name', label: 'Name', render: (d) => String(d.name ?? '—') },
    {
      key: 'description',
      label: 'Description',
      render: (d) => String(d.description ?? '—'),
    },
  ],
  'asset-statuses': [
    { key: 'name', label: 'Name', render: (d) => String(d.name ?? '—') },
    {
      key: 'description',
      label: 'Description',
      render: (d) => String(d.description ?? '—'),
    },
  ],
  'ticket-types': [
    { key: 'name', label: 'Name', render: (d) => String(d.name ?? '—') },
    {
      key: 'description',
      label: 'Description',
      render: (d) => String(d.description ?? '—'),
    },
  ],
  employees: [
    { key: 'fullName', label: 'Name', render: (d) => String(d.fullName ?? '—') },
    { key: 'jobTitle', label: 'Title', render: (d) => String(d.jobTitle ?? '—') },
    { key: 'company', label: 'Company', render: (d) => rel(d, 'company') },
    { key: 'team', label: 'Team', render: (d) => rel(d, 'team') },
  ],
  'maintenance-teams': [
    { key: 'name', label: 'Team', render: (d) => String(d.name ?? '—') },
    { key: 'company', label: 'Company', render: (d) => rel(d, 'company') },
    {
      key: 'members',
      label: 'Members',
      render: (d) => {
        const members = d.members as unknown[] | null | undefined
        return members?.length ?? 0
      },
    },
  ],
  users: [
    { key: 'email', label: 'Email', render: (d) => String(d.email ?? '—') },
    { key: 'role', label: 'Role', render: (d) => statusLabel(String(d.role ?? '')) },
    { key: 'employee', label: 'Employee', render: (d) => rel(d, 'employee') },
  ],
  assets: [
    { key: 'name', label: 'Name', render: (d) => String(d.name ?? '—') },
    { key: 'assetTag', label: 'Tag', render: (d) => String(d.assetTag ?? '—') },
    { key: 'location', label: 'Location', render: (d) => rel(d, 'location') },
    { key: 'status', label: 'Status', render: (d) => rel(d, 'status') },
  ],
  'asset-movements': [
    { key: 'reference', label: 'Reference', render: (d) => String(d.reference ?? '—') },
    { key: 'asset', label: 'Asset', render: (d) => rel(d, 'asset') },
    { key: 'toLocation', label: 'To', render: (d) => rel(d, 'toLocation') },
    {
      key: 'movedAt',
      label: 'Moved',
      render: (d) => formatDateTime(String(d.movedAt ?? '')),
    },
  ],
  tickets: [
    {
      key: 'ticketNumber',
      label: 'Ticket',
      render: (d) => String(d.ticketNumber ?? '—'),
    },
    { key: 'title', label: 'Title', render: (d) => String(d.title ?? '—') },
    {
      key: 'status',
      label: 'Status',
      render: (d) => statusLabel(String(d.status ?? '')),
    },
    {
      key: 'priority',
      label: 'Priority',
      render: (d) => String(d.priority ?? '—'),
    },
  ],
}

export function getDetailTitle(slug: MockupCollectionSlug, doc: Doc): string {
  switch (slug) {
    case 'employees':
      return String(doc.fullName ?? 'Employee')
    case 'users':
      return String(doc.email ?? 'User')
    case 'assets':
      return String(doc.name ?? doc.assetTag ?? 'Asset')
    case 'asset-movements':
      return String(doc.reference ?? 'Movement')
    case 'tickets':
      return String(doc.title ?? doc.ticketNumber ?? 'Ticket')
    default:
      return String(doc.name ?? doc.title ?? 'Record')
  }
}

export function getDetailSubtitle(slug: MockupCollectionSlug, doc: Doc): string | undefined {
  switch (slug) {
    case 'companies':
      return String(doc.code ?? '')
    case 'assets':
      return String(doc.assetTag ?? '')
    case 'tickets':
      return String(doc.ticketNumber ?? '')
    case 'asset-movements':
      return formatDateTime(String(doc.movedAt ?? ''))
    default:
      return relLabel(doc.company as Parameters<typeof relLabel>[0], undefined)
  }
}

export function renderDetailFields(slug: MockupCollectionSlug, doc: Doc): { label: string; value: React.ReactNode }[] {
  const fields: { label: string; value: React.ReactNode }[] = []

  const add = (label: string, value: unknown) => {
    if (value === undefined) return
    fields.push({ label, value: value as React.ReactNode })
  }

  switch (slug) {
    case 'companies':
      add('Name', doc.name)
      add('Code', doc.code)
      add('Parent', rel(doc, 'parent'))
      add('Updated', formatDate(String(doc.updatedAt ?? '')))
      break
    case 'locations':
      add('Name', doc.name)
      add('Company', rel(doc, 'company'))
      add('Kind', doc.kind ?? '—')
      add('Type', doc.isGroup ? 'Group node' : 'Leaf location')
      add('Parent', rel(doc, 'parent'))
      add('Notes', doc.notes ?? '—')
      break
    case 'asset-categories':
    case 'asset-statuses':
    case 'ticket-types':
      add('Name', doc.name)
      add('Description', doc.description ?? '—')
      break
    case 'employees':
      add('Full name', doc.fullName)
      add('Job title', doc.jobTitle ?? '—')
      add('Company', rel(doc, 'company'))
      add('Team', rel(doc, 'team'))
      add('Email', doc.email ?? '—')
      add('Phone', doc.phone ?? '—')
      break
    case 'maintenance-teams':
      add('Name', doc.name)
      add('Company', rel(doc, 'company'))
      add(
        'Members',
        ((doc.members as unknown[] | null) ?? [])
          .map((m) => relLabel(m as Parameters<typeof relLabel>[0]))
          .join(', ') || '—',
      )
      break
    case 'users':
      add('Email', doc.email)
      add('Role', statusLabel(String(doc.role ?? '')))
      add('Employee', rel(doc, 'employee'))
      break
    case 'assets':
      add('Name', doc.name)
      add('Asset tag', doc.assetTag)
      add('Company', rel(doc, 'company'))
      add('Location', rel(doc, 'location'))
      add('Category', rel(doc, 'category'))
      add('Status', rel(doc, 'status'))
      add('Serial', doc.serialNumber ?? '—')
      add('Custodian', rel(doc, 'custodian'))
      add('Notes', doc.notes ?? '—')
      break
    case 'asset-movements':
      add('Reference', doc.reference)
      add('Asset', rel(doc, 'asset'))
      add('From', rel(doc, 'fromLocation'))
      add('To', rel(doc, 'toLocation'))
      add('Moved by', rel(doc, 'movedBy'))
      add('Moved at', formatDateTime(String(doc.movedAt ?? '')))
      add('Reason', doc.reason ?? '—')
      break
    case 'tickets':
      add('Ticket number', doc.ticketNumber)
      add('Title', doc.title)
      add('Description', doc.description ?? '—')
      add('Type', rel(doc, 'type'))
      add('Priority', doc.priority)
      add('Status', statusLabel(String(doc.status ?? '')))
      add('Review', statusLabel(String(doc.reviewStatus ?? '')))
      add('Location', rel(doc, 'location'))
      add('Asset', rel(doc, 'asset'))
      add('Reported by', rel(doc, 'reportedBy'))
      add('Assigned team', rel(doc, 'assignedTeam'))
      add('Assigned to', rel(doc, 'assignedTo'))
      add('Reported at', formatDateTime(String(doc.reportedAt ?? '')))
      break
  }

  return fields
}

export function getPriorityBadgeColor(priority: string) {
  return priorityColor(priority)
}

export type { Doc }
