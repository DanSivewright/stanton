export const TICKET_REVIEW_STATUSES = ['none', 'pending', 'verified', 'rejected'] as const
export type TicketReviewStatus = (typeof TICKET_REVIEW_STATUSES)[number]

export const DEFAULT_TICKET_REVIEW_STATUS: TicketReviewStatus = 'none'
