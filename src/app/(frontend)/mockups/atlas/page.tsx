import { PageHeader } from '@/components/mockups/atlas/PageHeader'
import { DashboardView } from '@/components/mockups/atlas/DashboardView'
import { getDashboardStats, getRecentTickets, findCollection } from '@/lib/mockups/queries'

export default async function AtlasDashboardPage() {
  const [stats, recentTickets, movements] = await Promise.all([
    getDashboardStats(),
    getRecentTickets(8),
    findCollection('asset-movements', { limit: 5, sort: '-movedAt' }),
  ])

  return (
    <>
      <PageHeader segments={[{ label: 'Overview' }]} count={stats.counts.assets} />
      <DashboardView
        stats={stats}
        recentTickets={recentTickets as unknown as Record<string, unknown>[]}
        recentMovements={movements.docs as unknown as Record<string, unknown>[]}
      />
    </>
  )
}
