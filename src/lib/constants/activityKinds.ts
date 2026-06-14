export const ACTIVITY_KINDS = ['comment', 'photo', 'completion', 'review'] as const
export type ActivityKind = (typeof ACTIVITY_KINDS)[number]
