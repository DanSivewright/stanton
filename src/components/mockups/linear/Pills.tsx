import * as Badge from '@/components/ui/badge'
import { statusLabel } from '@/lib/mockups/helpers'

type BadgeColor =
  | 'gray'
  | 'blue'
  | 'orange'
  | 'red'
  | 'green'
  | 'yellow'
  | 'purple'

const STATUS_COLOR: Record<string, BadgeColor> = {
  open: 'blue',
  in_progress: 'orange',
  completed: 'green',
  cancelled: 'gray',
  pending: 'yellow',
  approved: 'green',
  rejected: 'red',
}

const PRIORITY_COLOR: Record<string, string> = {
  urgent: 'bg-error-base',
  high: 'bg-warning-base',
  medium: 'bg-yellow-500',
  low: 'bg-text-soft-400',
}

export function StatusPill({ status }: { status: string }) {
  return (
    <Badge.Root
      variant="lighter"
      color={STATUS_COLOR[status] ?? 'gray'}
      size="small"
      className="capitalize"
    >
      {statusLabel(status)}
    </Badge.Root>
  )
}

export function GroupBadge({ isGroup }: { isGroup: boolean }) {
  return (
    <Badge.Root variant="lighter" color={isGroup ? 'purple' : 'gray'} size="small">
      {isGroup ? 'Group' : 'Leaf'}
    </Badge.Root>
  )
}

export function PriorityIndicator({ priority }: { priority: string }) {
  return (
    <span
      className={`inline-block size-2 shrink-0 rounded-full ${PRIORITY_COLOR[priority] ?? PRIORITY_COLOR.low}`}
      title={priority}
    />
  )
}

export function PriorityBar({ priority }: { priority: string }) {
  return (
    <span
      className={`block h-4 w-0.5 shrink-0 rounded-sm ${PRIORITY_COLOR[priority] ?? 'bg-transparent'}`}
    />
  )
}
