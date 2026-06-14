export const TICKET_PRIORITIES = ['low', 'medium', 'high', 'urgent'] as const
export type TicketPriority = (typeof TICKET_PRIORITIES)[number]

export const DEFAULT_TICKET_PRIORITY: TicketPriority = 'medium'
