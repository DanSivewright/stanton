/**
 * Atlas — Stanton Operations Command Center
 *
 * Design synthesis (AlignUI + Mobbin admin portal research):
 * - Dashboard-first landing with KPI metric cards and activity timeline
 *   (Squarespace/Deel dashboard patterns)
 * - ⌘K command palette for global navigation and record search
 * - Split-pane master-detail on collection detail routes
 * - Finance-template density: filterable tables, status badges, alert banners
 * - Teal "stable" accent on white — distinct from sana (purple chat), linear (dark),
 *   qatalog (org charts), elevenlabs (library browse)
 *
 * Built exclusively with AlignUI components + Tailwind tokens (no CSS modules).
 */
import { AtlasProvider } from './AtlasProvider'
import { AtlasSidebar } from './AtlasSidebar'

export function AtlasShell({ children }: { children: React.ReactNode }) {
  return (
    <AtlasProvider>
      <div className="flex min-h-screen bg-bg-weak-50 text-text-strong-950">
        <AtlasSidebar />
        <div className="flex min-h-screen min-w-0 flex-1 flex-col">{children}</div>
      </div>
    </AtlasProvider>
  )
}
