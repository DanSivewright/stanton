export function getRelationshipId(value: unknown): string | null {
  if (value == null) return null
  if (typeof value === 'string' || typeof value === 'number') return String(value)
  if (typeof value === 'object') {
    if ('value' in value) return String((value as { value: string | number }).value)
    if ('id' in value) return String((value as { id: string | number }).id)
  }
  return null
}
