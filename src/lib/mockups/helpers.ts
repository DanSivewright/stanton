type RelValue = string | number | { id?: string | number; name?: string; fullName?: string; title?: string; assetTag?: string; reference?: string; ticketNumber?: string; code?: string; email?: string } | null | undefined

export function relId(value: RelValue): string | undefined {
  if (value == null) return undefined
  if (typeof value === 'string' || typeof value === 'number') return String(value)
  if (value.id != null) return String(value.id)
  return undefined
}

export function relLabel(value: RelValue, fallback = '—'): string {
  if (value == null) return fallback
  if (typeof value === 'object') {
    return (
      value.name ??
      value.fullName ??
      value.title ??
      value.assetTag ??
      value.reference ??
      value.ticketNumber ??
      value.code ??
      value.email ??
      fallback
    )
  }
  return String(value)
}

export function formatDate(value: string | Date | null | undefined): string {
  if (!value) return '—'
  const d = typeof value === 'string' ? new Date(value) : value
  return d.toLocaleDateString('en-ZA', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function formatDateTime(value: string | Date | null | undefined): string {
  if (!value) return '—'
  const d = typeof value === 'string' ? new Date(value) : value
  return d.toLocaleString('en-ZA', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function initials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('')
}

export function priorityColor(priority: string): string {
  switch (priority) {
    case 'urgent':
      return '#ef4444'
    case 'high':
      return '#f97316'
    case 'medium':
      return '#eab308'
    default:
      return '#94a3b8'
  }
}

export function statusLabel(status: string): string {
  return status.replace(/_/g, ' ')
}
