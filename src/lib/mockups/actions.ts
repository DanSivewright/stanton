'use server'

import { revalidatePath } from 'next/cache'
import { getPayload } from 'payload'
import config from '@payload-config'
import type { MockupCollectionSlug, MockupVariantSlug } from './navigation'
import { getDocIdentifier } from './identifiers'
import { detailHref, listHref } from './links'
import { findByIdentifier, searchRecords } from './queries'

export type ActionResult = {
  ok: boolean
  error?: string
  doc?: Record<string, unknown>
  redirectTo?: string
}

function revalidateCollection(variant: MockupVariantSlug, slug: MockupCollectionSlug, identifier?: string) {
  revalidatePath(listHref(variant, slug))
  if (identifier) {
    revalidatePath(detailHref(variant, slug, identifier))
    revalidatePath(`${detailHref(variant, slug, identifier)}/edit`)
  }
}

function parseFormData(data: Record<string, unknown>, slug: MockupCollectionSlug): Record<string, unknown> {
  const parsed: Record<string, unknown> = { ...data }

  if (slug === 'users') {
    if (!parsed.password) delete parsed.password
  }

  for (const [key, val] of Object.entries(parsed)) {
    if (val === '' || val === undefined) {
      parsed[key] = null
    }
    if (Array.isArray(val) && val.length === 0) {
      parsed[key] = []
    }
  }

  if (parsed.tonnage != null && parsed.tonnage !== '') {
    parsed.tonnage = Number(parsed.tonnage)
  }

  return parsed
}

export async function createRecord(
  variant: MockupVariantSlug,
  slug: MockupCollectionSlug,
  data: Record<string, unknown>,
): Promise<ActionResult> {
  try {
    const payload = await getPayload({ config })
    const parsed = parseFormData(data, slug)

    const doc = await payload.create({
      collection: slug,
      data: parsed as never,
      overrideAccess: true,
    })

    const identifier = getDocIdentifier(doc as unknown as Record<string, unknown>, slug)
    revalidateCollection(variant, slug, identifier)

    return {
      ok: true,
      doc: doc as unknown as Record<string, unknown>,
      redirectTo: detailHref(variant, slug, identifier),
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to create record'
    return { ok: false, error: message }
  }
}

export async function updateRecord(
  variant: MockupVariantSlug,
  slug: MockupCollectionSlug,
  identifier: string,
  data: Record<string, unknown>,
): Promise<ActionResult> {
  try {
    const existing = await findByIdentifier(slug, identifier)
    if (!existing) return { ok: false, error: 'Record not found' }

    const payload = await getPayload({ config })
    const parsed = parseFormData(data, slug)
    const id = String((existing as Record<string, unknown>).id)

    const doc = await payload.update({
      collection: slug,
      id,
      data: parsed as never,
      overrideAccess: true,
    })

    const newIdentifier = getDocIdentifier(doc as unknown as Record<string, unknown>, slug)
    revalidateCollection(variant, slug, newIdentifier)

    return {
      ok: true,
      doc: doc as unknown as Record<string, unknown>,
      redirectTo: detailHref(variant, slug, newIdentifier),
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to update record'
    return { ok: false, error: message }
  }
}

export async function deleteRecord(
  variant: MockupVariantSlug,
  slug: MockupCollectionSlug,
  identifier: string,
): Promise<ActionResult> {
  try {
    const existing = await findByIdentifier(slug, identifier)
    if (!existing) return { ok: false, error: 'Record not found' }

    const payload = await getPayload({ config })
    const id = String((existing as Record<string, unknown>).id)

    await payload.delete({
      collection: slug,
      id,
      overrideAccess: true,
    })

    revalidateCollection(variant, slug)

    return {
      ok: true,
      redirectTo: listHref(variant, slug),
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to delete record'
    return { ok: false, error: message }
  }
}

export async function searchMockupRecords(query: string) {
  return searchRecords(query)
}

export async function appendTicketActivity(
  variant: MockupVariantSlug,
  identifier: string,
  body: string,
  authorId: string,
): Promise<ActionResult> {
  try {
    const existing = await findByIdentifier('tickets', identifier)
    if (!existing) return { ok: false, error: 'Ticket not found' }

    const ticket = existing as Record<string, unknown>
    const activity = Array.isArray(ticket.activity) ? [...ticket.activity] : []

    activity.push({
      kind: 'comment',
      author: authorId,
      body,
      createdAt: new Date().toISOString(),
    })

    const payload = await getPayload({ config })
    const doc = await payload.update({
      collection: 'tickets',
      id: String(ticket.id),
      data: { activity } as never,
      overrideAccess: true,
    })

    const newIdentifier = getDocIdentifier(doc as unknown as Record<string, unknown>, 'tickets')
    revalidateCollection(variant, 'tickets', newIdentifier)

    return { ok: true, doc: doc as unknown as Record<string, unknown> }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to add comment'
    return { ok: false, error: message }
  }
}
