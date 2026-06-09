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
  {
    employeeId: 'EMP-004',
    name: 'Mike LineManager',
    jobTitle: 'Production Line Manager',
  },
  {
    employeeId: 'EMP-005',
    name: 'Branden-Roy Unsworth',
    jobTitle: 'Regional Sales Manager',
  },
  {
    employeeId: 'EMP-006',
    name: 'Lisa Finance',
    jobTitle: 'Finance Controller',
  },
] as const

export async function seedEmployees(payload: Payload): Promise<void> {
  const companies = await payload.find({
    collection: 'companies',
    where: { code: { equals: 'PIMMS' } },
    limit: 1,
  })

  const company = companies.docs[0]
  if (!company) return

  for (const employee of sampleEmployees) {
    const existing = await payload.find({
      collection: 'employees',
      where: { employeeId: { equals: employee.employeeId } },
      limit: 1,
    })

    if (existing.totalDocs > 0) continue

    await payload.create({
      collection: 'employees',
      data: {
        ...employee,
        company: company.id,
        active: true,
        externalRefs:
          employee.employeeId === 'EMP-005'
            ? [
                {
                  system: 'pipedrive',
                  externalId: 'user/8821',
                  syncStatus: 'pending',
                  notes: 'Sales rep — future Pipedrive sync',
                },
              ]
            : undefined,
      },
    })
  }
}
