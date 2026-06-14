import { QatalogSidebar } from './QatalogSidebar'
import { qatalog, qatalogStyles } from './tokens'

export function QatalogShell({ children }: { children: React.ReactNode }) {
  return (
    <div style={qatalogStyles.page}>
      <QatalogSidebar />
      <div style={qatalogStyles.main}>{children}</div>
    </div>
  )
}

export function QatalogTopBar({
  count,
  action,
}: {
  count?: number
  action?: React.ReactNode
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 24,
        gap: 16,
      }}
    >
      {count != null ? (
        <span style={{ fontSize: 14, color: qatalog.textSecondary }}>
          {count} {count === 1 ? 'record' : 'records'}
        </span>
      ) : (
        <span />
      )}
      {action}
    </div>
  )
}
