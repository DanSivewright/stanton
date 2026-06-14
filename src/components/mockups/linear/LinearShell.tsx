import { LinearProvider } from './LinearProvider'
import { Sidebar } from './Sidebar'
import linearStyles from './linear.module.css'

export function LinearShell({ children }: { children: React.ReactNode }) {
  return (
    <LinearProvider>
      <div className={linearStyles.linearApp}>
        <div className={linearStyles.shell}>
          <Sidebar />
          <div className={linearStyles.main}>
            <div className={linearStyles.content}>{children}</div>
          </div>
        </div>
      </div>
    </LinearProvider>
  )
}
