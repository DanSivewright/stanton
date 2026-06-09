import type { Payload } from 'payload'

export async function seedCompanies(payload: Payload): Promise<void> {
  const existing = await payload.find({
    collection: 'companies',
    where: { code: { equals: 'PIMMS' } },
    limit: 1,
  })

  if (existing.totalDocs > 0) {
    return
  }

  await payload.create({
    collection: 'companies',
    data: {
      name: 'PIMMS Group JHB',
      code: 'PIMMS',
      active: true,
    },
  })
}
