import type { Access, FieldAccess, PayloadRequest } from 'payload'

import type { User } from '@/payload-types'

export function isAdmin(user: User | null | undefined): boolean {
  return Boolean(user?.roles?.includes('admin'))
}

export function isStaff(user: User | null | undefined): boolean {
  return Boolean(user?.roles?.includes('staff') || isAdmin(user))
}

export const authenticated: Access = ({ req }) => Boolean(req.user)

export const adminOnly: Access = ({ req }) => isAdmin(req.user as User | undefined)

export const adminOnlyField: FieldAccess = ({ req }) => isAdmin(req.user as User | undefined)

/** Staff can read; create/update/delete restricted to admin (finance, HR). */
export const sensitiveModuleRead: Access = ({ req }) => Boolean(req.user)

export const sensitiveModuleWrite: Access = ({ req }) => isAdmin(req.user as User | undefined)

export const sensitiveModuleDelete: Access = adminOnly

export function hasCompanyScope(
  user: User | null | undefined,
  companyId: string | undefined,
): boolean {
  if (!user || !companyId) return true
  if (isAdmin(user)) return true

  const scope = user.companyScope
  if (!scope?.length) return true

  const scopedIds = scope.map((entry) => (typeof entry === 'object' ? entry.id : entry))
  return scopedIds.includes(companyId)
}

export function companyScopedRead(collectionCompanyField = 'company'): Access {
  return ({ req }) => {
    if (!req.user) return false
    if (isAdmin(req.user as User)) return true

    const scope = (req.user as User).companyScope
    if (!scope?.length) return true

    const scopedIds = scope.map((entry) => (typeof entry === 'object' ? entry.id : entry))
    return {
      [collectionCompanyField]: {
        in: scopedIds,
      },
    }
  }
}

export function getActorUserId(req: PayloadRequest): string | undefined {
  return req.user?.id
}
