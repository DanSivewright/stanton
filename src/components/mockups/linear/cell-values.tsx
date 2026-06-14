import type { ReactNode } from 'react'
import { formatDate, formatDateTime, relId, relLabel, statusLabel } from '@/lib/mockups/helpers'
import type { CollectionConfig } from './collection-config'
import { GroupBadge, PriorityIndicator, StatusPill } from './Pills'

type Doc = Record<string, unknown>

export function getCellValue(doc: Doc, key: string, config: CollectionConfig): ReactNode {
  switch (key) {
    case 'priority':
      return typeof doc.priority === 'string' ? <PriorityIndicator priority={doc.priority} /> : null
    case 'priorityLabel':
      return typeof doc.priority === 'string' ? statusLabel(doc.priority) : '—'
    case 'status':
      return typeof doc.status === 'string' ? <StatusPill status={doc.status} /> : relLabel(doc.status as never)
    case 'reviewStatus':
      return typeof doc.reviewStatus === 'string' ? (
        <StatusPill status={doc.reviewStatus} />
      ) : (
        '—'
      )
    case 'isGroup':
      return <GroupBadge isGroup={Boolean(doc.isGroup)} />
    case 'memberCount': {
      const members = doc.members
      return Array.isArray(members) ? String(members.length) : '0'
    }
    case 'role':
      return typeof doc.role === 'string' ? statusLabel(doc.role) : '—'
    case 'kind':
      return typeof doc.kind === 'string' ? statusLabel(doc.kind) : '—'
    case 'reportedAt':
    case 'movedAt':
      return formatDate(doc[key] as string)
    case 'updatedAt':
    case 'createdAt':
      return formatDate(doc[key] as string)
    default: {
      const val = doc[key]
      if (val == null) return '—'
      if (typeof val === 'boolean') return val ? 'Yes' : 'No'
      if (typeof val === 'number') return String(val)
      if (typeof val === 'string') return val
      return relLabel(val as never)
    }
  }
}

export function getDetailValue(
  doc: Doc,
  key: string,
  relation?: string,
): { display: ReactNode; linkId?: string } {
  const val = doc[key]

  if (val == null || val === '') {
    return { display: '—' }
  }

  if (key === 'isGroup') {
    return { display: <GroupBadge isGroup={Boolean(val)} /> }
  }

  if (key === 'status' && typeof val === 'string' && !relation) {
    return { display: <StatusPill status={val} /> }
  }

  if (key === 'reviewStatus' && typeof val === 'string') {
    return { display: <StatusPill status={val} /> }
  }

  if (key === 'priority' && typeof val === 'string') {
    return { display: statusLabel(val) }
  }

  if (key === 'role' && typeof val === 'string') {
    return { display: statusLabel(val) }
  }

  if (key === 'members' && Array.isArray(val)) {
    return {
      display: val.length > 0 ? val.map((m) => relLabel(m as never)).join(', ') : '—',
    }
  }

  if (key.endsWith('At') && (typeof val === 'string' || val instanceof Date)) {
    return { display: formatDateTime(val as string) }
  }

  if (typeof val === 'object' && val !== null && relation) {
    const id = relId(val as never)
    return { display: relLabel(val as never), linkId: id }
  }

  if (typeof val === 'boolean') {
    return { display: val ? 'Yes' : 'No' }
  }

  return { display: String(val) }
}

export function getDocTitle(doc: Doc, config: CollectionConfig): string {
  const title = doc[config.titleField]
  if (typeof title === 'string' && title) return title
  if (config.idField) {
    const id = doc[config.idField]
    if (typeof id === 'string') return id
  }
  return 'Untitled'
}

export function getDocId(doc: Doc): string {
  return String(doc.id ?? '')
}
