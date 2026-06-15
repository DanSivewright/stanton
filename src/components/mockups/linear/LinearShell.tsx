import { LinearProvider } from './LinearProvider'
import { Sidebar } from './Sidebar'

export function LinearShell({ children }: { children: React.ReactNode }) {
  return (
    <LinearProvider>
      <div className="dark flex h-[100dvh] flex-col overflow-hidden bg-bg-strong-950 text-text-white-0">
        <div className="flex min-h-0 flex-1">
          <Sidebar />
          <main className="flex min-h-0 min-w-0 flex-1 flex-col border-l border-stroke-soft-200">
            <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">{children}</div>
          </main>
        </div>
      </div>
    </LinearProvider>
  )
}
