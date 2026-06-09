import type { Payload } from 'payload'

export async function seedIntegration(payload: Payload): Promise<void> {
  const settings = await payload.findGlobal({ slug: 'integration-settings' })
  const odooMapping = settings?.odoo?.fieldMapping

  if (!odooMapping || (typeof odooMapping === 'object' && Object.keys(odooMapping).length === 0)) {
    await payload.updateGlobal({
      slug: 'integration-settings',
      data: {
        odoo: {
          enabled: false,
          notes: 'Finance actuals + product master — XML-RPC connector deferred',
          fieldMapping: {},
        },
        pipedrive: {
          enabled: false,
          notes: 'Sales targets, Hunt/Care activities — API connector deferred',
          fieldMapping: {},
        },
        sharepoint: {
          enabled: false,
          notes: 'SPD deliverables + document library — Graph API deferred',
          fieldMapping: {},
        },
      },
    })
  }

  const existing = await payload.find({
    collection: 'integration-sync-events',
    where: { message: { equals: 'Demo seed — Odoo product import (stub)' } },
    limit: 1,
  })
  if (existing.totalDocs > 0) return

  const products = await payload.find({
    collection: 'products',
    where: { stockCode: { equals: 'WGT-A' } },
    limit: 1,
  })
  const productId = products.docs[0]?.id

  await payload.create({
    collection: 'integration-sync-events',
    data: {
      system: 'odoo',
      direction: 'inbound',
      entityType: 'products',
      entityId: productId ? String(productId) : 'pending',
      status: 'skipped',
      message: 'Demo seed — Odoo product import (stub)',
      externalId: 'product.template/1042',
      occurredAt: new Date().toISOString(),
    },
  })

  await payload.create({
    collection: 'integration-sync-events',
    data: {
      system: 'pipedrive',
      direction: 'inbound',
      entityType: 'sales-targets',
      entityId: 'demo',
      status: 'skipped',
      message: 'Demo seed — Pipedrive target pull (stub)',
      occurredAt: new Date().toISOString(),
    },
  })
}
