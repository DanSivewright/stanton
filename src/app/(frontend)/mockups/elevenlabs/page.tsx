import { DashboardView } from '@/components/mockups/elevenlabs/DashboardView'
import { findCollection, getDashboardStats, getRecentTickets } from '@/lib/mockups/queries'

export default async function ElevenLabsDashboardPage() {
  const [stats, assetsResult, recentTickets] = await Promise.all([
    getDashboardStats(),
    findCollection('assets', { limit: 5 }),
    getRecentTickets(5),
  ])

  return (
    <DashboardView
      stats={stats}
      recentAssets={assetsResult.docs as Record<string, unknown>[]}
      recentTickets={recentTickets as unknown as Record<string, unknown>[]}
    />
  )
}
