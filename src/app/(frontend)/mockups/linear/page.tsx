import { TopBar } from '@/components/mockups/linear/TopBar'
import { DashboardView } from '@/components/mockups/linear/DashboardView'
import { getDashboardStats, getRecentTickets } from '@/lib/mockups/queries'

export default async function LinearDashboardPage() {
  const [stats, recentTickets] = await Promise.all([
    getDashboardStats(),
    getRecentTickets(10),
  ])

  return (
    <>
      <TopBar segments={[{ label: 'Inbox' }]} count={stats.openTickets} />
      <DashboardView stats={stats} recentTickets={recentTickets as unknown as Record<string, unknown>[]} />
    </>
  )
}
