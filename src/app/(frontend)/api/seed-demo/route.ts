import { getPayload } from 'payload'
import config from '@payload-config'
import { seedStantonDemo } from '@/seed/stanton-demo'

export async function POST() {
  try {
    const payload = await getPayload({ config })
    const summary = await seedStantonDemo(payload)
    return Response.json({ ok: true, summary })
  } catch (error) {
    console.error('[seed-demo]', error)
    const message = error instanceof Error ? error.message : 'Seed failed'
    const details =
      error && typeof error === 'object' && 'data' in error
        ? (error as { data?: unknown }).data
        : undefined
    return Response.json({ ok: false, message, details }, { status: 500 })
  }
}

export async function GET() {
  return Response.json({
    message: 'POST to this endpoint to seed Stanton demo data.',
  })
}
