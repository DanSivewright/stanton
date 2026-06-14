import type { ReactNode } from 'react'
import type { MockupCollectionSlug } from '@/lib/mockups/navigation'
import { formatDateTime, relLabel } from '@/lib/mockups/helpers'

export type ColumnDef<T = Record<string, unknown>> = {
  key: string
  label: string
  render?: (row: T) => ReactNode
  width?: string
}

function rel(key: string): ColumnDef['render'] {
  return (row) => relLabel(row[key] as Parameters<typeof relLabel>[0])
}

function bool(key: string): ColumnDef['render'] {
  return (row) => (row[key] ? 'Yes' : 'No')
}

function text(key: string): ColumnDef['render'] {
  return (row) => String(row[key] ?? '—')
}

function membersCount(): ColumnDef['render'] {
  return (row) => {
    const members = row.members as unknown[] | undefined
    return String(members?.length ?? 0)
  }
}

export const COLLECTION_COLUMNS: Record<MockupCollectionSlug, ColumnDef[]> = {
  companies: [
    { key: 'name', label: 'Name', render: text('name') },
    { key: 'code', label: 'Code', render: text('code'), width: '100px' },
    { key: 'parent', label: 'Parent', render: rel('parent') },
  ],
  locations: [
    { key: 'name', label: 'Name', render: text('name') },
    { key: 'company', label: 'Company', render: rel('company') },
    { key: 'isGroup', label: 'Group', render: bool('isGroup'), width: '80px' },
    { key: 'kind', label: 'Kind', render: text('kind'), width: '100px' },
    { key: 'parent', label: 'Parent', render: rel('parent') },
  ],
  'asset-categories': [
    { key: 'name', label: 'Name', render: text('name') },
    { key: 'description', label: 'Description', render: text('description') },
  ],
  'asset-statuses': [
    { key: 'name', label: 'Name', render: text('name') },
    { key: 'description', label: 'Description', render: text('description') },
  ],
  'ticket-types': [
    { key: 'name', label: 'Name', render: text('name') },
    { key: 'description', label: 'Description', render: text('description') },
  ],
  employees: [
    { key: 'fullName', label: 'Full Name', render: text('fullName') },
    { key: 'company', label: 'Company', render: rel('company') },
    { key: 'jobTitle', label: 'Job Title', render: text('jobTitle') },
    { key: 'team', label: 'Team', render: rel('team') },
  ],
  'maintenance-teams': [
    { key: 'name', label: 'Name', render: text('name') },
    { key: 'company', label: 'Company', render: rel('company') },
    { key: 'members', label: 'Members', render: membersCount(), width: '90px' },
  ],
  users: [
    { key: 'email', label: 'Email', render: text('email') },
    { key: 'role', label: 'Role', render: text('role'), width: '120px' },
    { key: 'employee', label: 'Employee', render: rel('employee') },
  ],
  assets: [
    { key: 'name', label: 'Name', render: text('name') },
    { key: 'assetTag', label: 'Tag', render: text('assetTag'), width: '110px' },
    { key: 'company', label: 'Company', render: rel('company') },
    { key: 'location', label: 'Location', render: rel('location') },
    { key: 'status', label: 'Status', render: rel('status'), width: '110px' },
    { key: 'category', label: 'Category', render: rel('category') },
  ],
  'asset-movements': [
    { key: 'reference', label: 'Reference', render: text('reference'), width: '130px' },
    { key: 'asset', label: 'Asset', render: rel('asset') },
    { key: 'fromLocation', label: 'From', render: rel('fromLocation') },
    { key: 'toLocation', label: 'To', render: rel('toLocation') },
    {
      key: 'movedAt',
      label: 'Moved At',
      render: (row) => formatDateTime(row.movedAt as string),
      width: '150px',
    },
  ],
  tickets: [
    { key: 'ticketNumber', label: '#', render: text('ticketNumber'), width: '100px' },
    { key: 'title', label: 'Title', render: text('title') },
    { key: 'status', label: 'Status', render: text('status'), width: '110px' },
    { key: 'priority', label: 'Priority', render: text('priority'), width: '90px' },
    { key: 'location', label: 'Location', render: rel('location') },
    { key: 'assignedTo', label: 'Assigned', render: rel('assignedTo') },
  ],
}

export function getRowTitle(slug: MockupCollectionSlug, row: Record<string, unknown>): string {
  switch (slug) {
    case 'employees':
      return String(row.fullName ?? 'Employee')
    case 'users':
      return String(row.email ?? 'User')
    case 'tickets':
      return String(row.title ?? row.ticketNumber ?? 'Ticket')
    case 'asset-movements':
      return String(row.reference ?? 'Movement')
    case 'assets':
      return String(row.name ?? row.assetTag ?? 'Asset')
    default:
      return String(row.name ?? row.id ?? 'Record')
  }
}
