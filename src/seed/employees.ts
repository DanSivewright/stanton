import type { Payload } from 'payload'

const sampleEmployees = [
  {
    employeeId: 'EMP-001',
    name: 'Jane Approver',
    jobTitle: 'Product Director',
  },
  {
    employeeId: 'EMP-002',
    name: 'John Gatekeeper',
    jobTitle: 'Quality Lead',
  },
  {
    employeeId: 'EMP-003',
    name: 'Sam Reviewer',
    jobTitle: 'Design Lead',
  },
] as const

export async function seedEmployees(payload: Payload): Promise<void> {
  const companies = await payload.find({
    collection: 'companies',
    where: { code: { equals: 'PIMMS' } },
    limit: 1,
  })

  const company = companies.docs[0]
  if (!company) {
    return
  }

  for (const employee of sampleEmployees) {
    const existing = await payload.find({
      collection: 'employees',
      where: { employeeId: { equals: employee.employeeId } },
      limit: 1,
    })

    if (existing.totalDocs > 0) {
      continue
    }

    await payload.create({
      collection: 'employees',
      data: {
        ...employee,
        company: company.id,
        active: true,
      },
    })
  }
}
