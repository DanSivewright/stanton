import type { Access } from 'payload'
import type { User } from '../payload-types'
import { USER_ROLES, type UserRole } from '../lib/constants/userRoles'

export function getUserRole(user: User | null | undefined): UserRole | null {
  if (!user?.role) return null
  if (USER_ROLES.includes(user.role as UserRole)) return user.role as UserRole
  return null
}

export function hasRole(user: User | null | undefined, ...roles: UserRole[]): boolean {
  const role = getUserRole(user)
  return role !== null && roles.includes(role)
}

/** Reserved for future strict RBAC — MVP uses authenticated access everywhere. */
export const adminOnly: Access = ({ req }) => hasRole(req.user as User, 'admin')
