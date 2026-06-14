export const LOCATION_KINDS = ['region', 'building', 'floor', 'zone'] as const
export type LocationKind = (typeof LOCATION_KINDS)[number]
