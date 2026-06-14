import type { ComponentType } from 'react'

type IconProps = { size?: number; color?: string }

export function IconHome({ size = 20, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75">
      <path d="M3 10.5L12 3l9 7.5V20a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1v-9.5z" strokeLinejoin="round" />
    </svg>
  )
}

export function IconBuilding({ size = 20, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75">
      <rect x="4" y="2" width="16" height="20" rx="2" />
      <path d="M9 6h1M9 10h1M9 14h1M14 6h1M14 10h1M14 14h1" strokeLinecap="round" />
    </svg>
  )
}

export function IconMapPin({ size = 20, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75">
      <path d="M12 21s7-4.5 7-11a7 7 0 10-14 0c0 6.5 7 11 7 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  )
}

export function IconTag({ size = 20, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75">
      <path d="M20 12l-8 8-8-8V4h8l8 8z" strokeLinejoin="round" />
      <circle cx="7.5" cy="7.5" r="1" fill={color} stroke="none" />
    </svg>
  )
}

export function IconUsers({ size = 20, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75">
      <circle cx="9" cy="7" r="3" />
      <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
      <circle cx="17" cy="8" r="2.5" />
      <path d="M15 20c.3-2.2 1.8-4 4-4" />
    </svg>
  )
}

export function IconWrench({ size = 20, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75">
      <path d="M14.7 6.3a4 4 0 00-5.4 5.4L4 17l3 3 5.3-5.3a4 4 0 005.4-5.4l-2.5 2.5-1.5-1.5 2.5-2.5z" />
    </svg>
  )
}

export function IconBox({ size = 20, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75">
      <path d="M12 2l9 5v10l-9 5-9-5V7l9-5z" strokeLinejoin="round" />
      <path d="M12 22V12M3 7l9 5 9-5" />
    </svg>
  )
}

export function IconTicket({ size = 20, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75">
      <path d="M4 8h16M4 16h16" strokeLinecap="round" />
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M8 5v14M16 5v14" strokeDasharray="2 2" />
    </svg>
  )
}

export function IconSearch({ size = 20, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75">
      <circle cx="11" cy="11" r="6" />
      <path d="M16 16l5 5" strokeLinecap="round" />
    </svg>
  )
}

export function IconSparkle({ size = 20, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75">
      <path d="M12 2l1.5 5.5L19 9l-5.5 1.5L12 16l-1.5-5.5L5 9l5.5-1.5L12 2z" strokeLinejoin="round" />
      <path d="M19 14l.8 2.8L22.5 18l-2.7.7L19 21.5l-.8-2.8L15.5 18l2.7-.7L19 14z" strokeLinejoin="round" />
    </svg>
  )
}

export function IconChevron({ size = 16, color = 'currentColor', direction = 'right' }: IconProps & { direction?: 'right' | 'down' }) {
  const rotate = direction === 'down' ? 90 : 0
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" style={{ transform: `rotate(${rotate}deg)` }}>
      <path d="M9 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function IconArrow({ size = 16, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
      <path d="M19 12H5M12 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function IconMenu({ size = 20, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
      <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
    </svg>
  )
}

export function IconLayers({ size = 20, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75">
      <path d="M12 2l9 5-9 5-9-5 9-5z" strokeLinejoin="round" />
      <path d="M3 12l9 5 9-5M3 17l9 5 9-5" strokeLinejoin="round" />
    </svg>
  )
}

export function IconMove({ size = 20, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75">
      <path d="M5 9l-3 3 3 3M19 9l3 3-3 3M9 5l3-3 3 3M9 19l3 3 3-3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function IconList({ size = 20, color = 'currentColor' }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.75">
      <path d="M8 6h13M8 12h13M8 18h13" strokeLinecap="round" />
      <circle cx="4" cy="6" r="1" fill={color} />
      <circle cx="4" cy="12" r="1" fill={color} />
      <circle cx="4" cy="18" r="1" fill={color} />
    </svg>
  )
}

const COLLECTION_ICONS: Record<string, ComponentType<IconProps>> = {
  companies: IconBuilding,
  locations: IconMapPin,
  'asset-categories': IconTag,
  'asset-statuses': IconLayers,
  'ticket-types': IconList,
  employees: IconUsers,
  'maintenance-teams': IconWrench,
  users: IconUsers,
  assets: IconBox,
  'asset-movements': IconMove,
  tickets: IconTicket,
}

export function CollectionIcon({ slug, ...props }: IconProps & { slug: string }) {
  const Icon = COLLECTION_ICONS[slug] ?? IconBox
  return <Icon {...props} />
}
