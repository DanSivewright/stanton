import { Sidebar } from './Sidebar'

type AppShellProps = {
  children: React.ReactNode
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex min-h-screen bg-bg-white-0 text-text-strong-950">
      <Sidebar />
      <main className="flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto">
        <div className="mx-auto w-full max-w-6xl flex-1 px-8 py-8">{children}</div>
      </main>
    </div>
  )
}
