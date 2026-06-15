import { QatalogSidebar } from './QatalogSidebar'

export function QatalogShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-bg-white-0 text-text-strong-950">
      <QatalogSidebar />
      <main className="min-w-0 flex-1">{children}</main>
    </div>
  )
}
