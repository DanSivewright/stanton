import pillStyles from './Pills.module.css'
import { statusLabel } from '@/lib/mockups/helpers'

const STATUS_CLASS: Record<string, string> = {
  open: pillStyles.statusOpen,
  in_progress: pillStyles.statusInProgress,
  completed: pillStyles.statusCompleted,
  cancelled: pillStyles.statusCancelled,
  pending: pillStyles.statusReviewPending,
  approved: pillStyles.statusReviewApproved,
  rejected: pillStyles.statusReviewRejected,
}

export function StatusPill({ status }: { status: string }) {
  const className = STATUS_CLASS[status] ?? pillStyles.statusDefault
  return <span className={`${pillStyles.pill} ${className}`}>{statusLabel(status)}</span>
}

export function GroupBadge({ isGroup }: { isGroup: boolean }) {
  const className = isGroup ? pillStyles.groupYes : pillStyles.groupNo
  return (
    <span className={`${pillStyles.groupBadge} ${className}`}>
      {isGroup ? 'Group' : 'Leaf'}
    </span>
  )
}

export function PriorityIndicator({ priority }: { priority: string }) {
  const colors: Record<string, string> = {
    urgent: '#ef4444',
    high: '#f97316',
    medium: '#eab308',
    low: '#5c6370',
  }
  return (
    <span
      className={pillStyles.priorityDot}
      style={{ background: colors[priority] ?? colors.low }}
      title={priority}
    />
  )
}

export function PriorityBar({ priority }: { priority: string }) {
  const colors: Record<string, string> = {
    urgent: '#ef4444',
    high: '#f97316',
    medium: '#eab308',
    low: 'transparent',
  }
  return (
    <span
      style={{
        width: 3,
        height: 16,
        borderRadius: 2,
        background: colors[priority] ?? colors.low,
        display: 'block',
      }}
    />
  )
}
