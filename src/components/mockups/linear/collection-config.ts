import type { MockupCollectionSlug } from '@/lib/mockups/navigation'

export type ColumnDef = {
  key: string
  label: string
  width: string
  mono?: boolean
  secondary?: boolean
}

export type DetailFieldDef = {
  key: string
  label: string
  mono?: boolean
  relation?: MockupCollectionSlug
}

export type CollectionConfig = {
  slug: MockupCollectionSlug
  titleField: string
  idField?: string
  descriptionField?: string
  sort: string
  isIssueStyle?: boolean
  columns: ColumnDef[]
  detailFields: DetailFieldDef[]
}

export const COLLECTION_CONFIG: Record<MockupCollectionSlug, CollectionConfig> = {
  tickets: {
    slug: 'tickets',
    titleField: 'title',
    idField: 'ticketNumber',
    descriptionField: 'description',
    sort: '-reportedAt',
    isIssueStyle: true,
    columns: [
      { key: 'priority', label: '', width: '20px' },
      { key: 'ticketNumber', label: 'ID', width: '90px', mono: true },
      { key: 'title', label: 'Title', width: '1fr' },
      { key: 'status', label: 'Status', width: '100px' },
      { key: 'priorityLabel', label: 'Priority', width: '80px', secondary: true },
      { key: 'location', label: 'Location', width: '120px', secondary: true },
      { key: 'reportedAt', label: 'Reported', width: '90px', secondary: true },
    ],
    detailFields: [
      { key: 'ticketNumber', label: 'Ticket ID', mono: true },
      { key: 'status', label: 'Status' },
      { key: 'reviewStatus', label: 'Review' },
      { key: 'priority', label: 'Priority' },
      { key: 'type', label: 'Type', relation: 'ticket-types' },
      { key: 'company', label: 'Company', relation: 'companies' },
      { key: 'location', label: 'Location', relation: 'locations' },
      { key: 'asset', label: 'Asset', relation: 'assets' },
      { key: 'reportedBy', label: 'Reported By', relation: 'employees' },
      { key: 'reportedAt', label: 'Reported At' },
      { key: 'assignedTeam', label: 'Team', relation: 'maintenance-teams' },
      { key: 'assignedTo', label: 'Assignee', relation: 'employees' },
    ],
  },
  assets: {
    slug: 'assets',
    titleField: 'name',
    idField: 'assetTag',
    descriptionField: 'notes',
    sort: 'assetTag',
    columns: [
      { key: 'assetTag', label: 'Tag', width: '100px', mono: true },
      { key: 'name', label: 'Name', width: '1fr' },
      { key: 'status', label: 'Status', width: '100px' },
      { key: 'category', label: 'Category', width: '120px', secondary: true },
      { key: 'location', label: 'Location', width: '120px', secondary: true },
      { key: 'company', label: 'Company', width: '100px', secondary: true },
    ],
    detailFields: [
      { key: 'assetTag', label: 'Asset Tag', mono: true },
      { key: 'serialNumber', label: 'Serial', mono: true },
      { key: 'status', label: 'Status', relation: 'asset-statuses' },
      { key: 'category', label: 'Category', relation: 'asset-categories' },
      { key: 'company', label: 'Owner', relation: 'companies' },
      { key: 'location', label: 'Location', relation: 'locations' },
      { key: 'custodian', label: 'Custodian', relation: 'employees' },
      { key: 'defaultTeam', label: 'Default Team', relation: 'maintenance-teams' },
      { key: 'tonnage', label: 'Tonnage' },
    ],
  },
  companies: {
    slug: 'companies',
    titleField: 'name',
    idField: 'code',
    sort: 'name',
    columns: [
      { key: 'code', label: 'Code', width: '80px', mono: true },
      { key: 'name', label: 'Name', width: '1fr' },
      { key: 'parent', label: 'Parent', width: '140px', secondary: true },
    ],
    detailFields: [
      { key: 'code', label: 'Code', mono: true },
      { key: 'parent', label: 'Parent Company', relation: 'companies' },
    ],
  },
  locations: {
    slug: 'locations',
    titleField: 'name',
    sort: 'name',
    columns: [
      { key: 'name', label: 'Name', width: '1fr' },
      { key: 'kind', label: 'Kind', width: '80px', secondary: true },
      { key: 'isGroup', label: 'Type', width: '80px' },
      { key: 'company', label: 'Company', width: '120px', secondary: true },
      { key: 'parent', label: 'Parent', width: '120px', secondary: true },
    ],
    detailFields: [
      { key: 'kind', label: 'Kind' },
      { key: 'isGroup', label: 'Node Type' },
      { key: 'company', label: 'Company', relation: 'companies' },
      { key: 'parent', label: 'Parent', relation: 'locations' },
    ],
  },
  'asset-categories': {
    slug: 'asset-categories',
    titleField: 'name',
    descriptionField: 'description',
    sort: 'name',
    columns: [
      { key: 'name', label: 'Name', width: '1fr' },
      { key: 'updatedAt', label: 'Updated', width: '100px', secondary: true },
    ],
    detailFields: [{ key: 'description', label: 'Description' }],
  },
  'asset-statuses': {
    slug: 'asset-statuses',
    titleField: 'name',
    descriptionField: 'description',
    sort: 'name',
    columns: [
      { key: 'name', label: 'Name', width: '1fr' },
      { key: 'updatedAt', label: 'Updated', width: '100px', secondary: true },
    ],
    detailFields: [{ key: 'description', label: 'Description' }],
  },
  'ticket-types': {
    slug: 'ticket-types',
    titleField: 'name',
    descriptionField: 'description',
    sort: 'name',
    columns: [
      { key: 'name', label: 'Name', width: '1fr' },
      { key: 'updatedAt', label: 'Updated', width: '100px', secondary: true },
    ],
    detailFields: [{ key: 'description', label: 'Description' }],
  },
  employees: {
    slug: 'employees',
    titleField: 'fullName',
    sort: 'fullName',
    columns: [
      { key: 'fullName', label: 'Name', width: '1fr' },
      { key: 'jobTitle', label: 'Title', width: '140px', secondary: true },
      { key: 'company', label: 'Company', width: '120px', secondary: true },
      { key: 'team', label: 'Team', width: '120px', secondary: true },
    ],
    detailFields: [
      { key: 'jobTitle', label: 'Job Title' },
      { key: 'email', label: 'Email' },
      { key: 'phone', label: 'Phone' },
      { key: 'company', label: 'Company', relation: 'companies' },
      { key: 'team', label: 'Primary Team', relation: 'maintenance-teams' },
      { key: 'user', label: 'User Account', relation: 'users' },
    ],
  },
  'maintenance-teams': {
    slug: 'maintenance-teams',
    titleField: 'name',
    sort: 'name',
    columns: [
      { key: 'name', label: 'Name', width: '1fr' },
      { key: 'company', label: 'Company', width: '140px', secondary: true },
      { key: 'memberCount', label: 'Members', width: '80px', secondary: true },
    ],
    detailFields: [
      { key: 'company', label: 'Company', relation: 'companies' },
      { key: 'members', label: 'Members' },
    ],
  },
  users: {
    slug: 'users',
    titleField: 'email',
    sort: 'email',
    columns: [
      { key: 'email', label: 'Email', width: '1fr' },
      { key: 'role', label: 'Role', width: '100px' },
      { key: 'employee', label: 'Employee', width: '140px', secondary: true },
    ],
    detailFields: [
      { key: 'role', label: 'Role' },
      { key: 'employee', label: 'Employee', relation: 'employees' },
    ],
  },
  'asset-movements': {
    slug: 'asset-movements',
    titleField: 'reference',
    idField: 'reference',
    descriptionField: 'reason',
    sort: '-movedAt',
    columns: [
      { key: 'reference', label: 'Ref', width: '110px', mono: true },
      { key: 'asset', label: 'Asset', width: '1fr' },
      { key: 'fromLocation', label: 'From', width: '120px', secondary: true },
      { key: 'toLocation', label: 'To', width: '120px', secondary: true },
      { key: 'movedAt', label: 'Moved', width: '90px', secondary: true },
    ],
    detailFields: [
      { key: 'reference', label: 'Reference', mono: true },
      { key: 'asset', label: 'Asset', relation: 'assets' },
      { key: 'company', label: 'Company', relation: 'companies' },
      { key: 'fromLocation', label: 'From', relation: 'locations' },
      { key: 'toLocation', label: 'To', relation: 'locations' },
      { key: 'movedBy', label: 'Moved By', relation: 'employees' },
      { key: 'movedAt', label: 'Moved At' },
    ],
  },
}

export function getCollectionConfig(slug: string): CollectionConfig | null {
  return COLLECTION_CONFIG[slug as MockupCollectionSlug] ?? null
}

export const NAV_ICONS: Record<MockupCollectionSlug, string> = {
  companies: '◈',
  locations: '⌂',
  'asset-categories': '▤',
  'asset-statuses': '●',
  'ticket-types': '◆',
  employees: '○',
  'maintenance-teams': '◎',
  users: '◉',
  assets: '▣',
  'asset-movements': '→',
  tickets: '◇',
}
