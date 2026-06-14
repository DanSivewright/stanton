import { getPayload } from 'payload'
import config from '../../src/payload.config.js'

export const testUser = {
  email: 'dev@payloadcms.com',
  password: 'test',
}

/**
 * Seeds a test user for e2e admin tests.
 */
export async function seedTestUser(): Promise<void> {
  const payload = await getPayload({ config })

  await payload.delete({
    collection: 'users',
    where: {
      email: {
        equals: testUser.email,
      },
    },
  })

  await payload.delete({
    collection: 'employees',
    where: {
      email: {
        equals: testUser.email,
      },
    },
  })

  const company =
    (
      await payload.find({
        collection: 'companies',
        limit: 1,
      })
    ).docs[0] ??
    (await payload.create({
      collection: 'companies',
      data: {
        name: 'Test Company',
        code: 'TEST',
      },
    }))

  const employee = await payload.create({
    collection: 'employees',
    data: {
      fullName: 'Test User',
      company: company.id,
      email: testUser.email,
    },
  })

  await payload.create({
    collection: 'users',
    data: {
      ...testUser,
      role: 'admin',
      employee: employee.id,
    },
  })
}

/**
 * Cleans up test user after tests
 */
export async function cleanupTestUser(): Promise<void> {
  const payload = await getPayload({ config })

  await payload.delete({
    collection: 'users',
    where: {
      email: {
        equals: testUser.email,
      },
    },
  })

  await payload.delete({
    collection: 'employees',
    where: {
      email: {
        equals: testUser.email,
      },
    },
  })
}
