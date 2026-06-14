export const TICKET_STATUSES = ['open', 'in_progress', 'completed', 'cancelled'] as const
export type TicketStatus = (typeof TICKET_STATUSES)[number]

export const DEFAULT_TICKET_STATUS: TicketStatus = 'open'
