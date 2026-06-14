export const USER_ROLES = ['admin', 'manager', 'technician', 'staff'] as const
export type UserRole = (typeof USER_ROLES)[number]

export const DEFAULT_USER_ROLE: UserRole = 'staff'
