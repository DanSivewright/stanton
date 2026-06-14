type IconProps = { size?: number; color?: string }

const base = (size: number) => ({
  width: size,
  height: size,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
})

export function IconBuilding({ size = 20, color = 'currentColor' }: IconProps) {
  return (
    <svg {...base(size)} style={{ color }}>
      <path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-6h6v6" />
    </svg>
  )
}

export function IconGrid({ size = 20, color = 'currentColor' }: IconProps) {
  return (
    <svg {...base(size)} style={{ color }}>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  )
}

export function IconUsers({ size = 20, color = 'currentColor' }: IconProps) {
  return (
    <svg {...base(size)} style={{ color }}>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}

export function IconBox({ size = 20, color = 'currentColor' }: IconProps) {
  return (
    <svg {...base(size)} style={{ color }}>
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <path d="M3.27 6.96 12 12.01l8.73-5.05M12 22.08V12" />
    </svg>
  )
}

export function IconWrench({ size = 20, color = 'currentColor' }: IconProps) {
  return (
    <svg {...base(size)} style={{ color }}>
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
    </svg>
  )
}

export function IconHome({ size = 20, color = 'currentColor' }: IconProps) {
  return (
    <svg {...base(size)} style={{ color }}>
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <path d="M9 22V12h6v10" />
    </svg>
  )
}

export function IconX({ size = 20, color = 'currentColor' }: IconProps) {
  return (
    <svg {...base(size)} style={{ color }}>
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  )
}

export function IconChevronRight({ size = 16, color = 'currentColor' }: IconProps) {
  return (
    <svg {...base(size)} style={{ color }}>
      <path d="m9 18 6-6-6-6" />
    </svg>
  )
}

export function IconSearch({ size = 18, color = 'currentColor' }: IconProps) {
  return (
    <svg {...base(size)} style={{ color }}>
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  )
}

export function IconPlus({ size = 18, color = 'currentColor' }: IconProps) {
  return (
    <svg {...base(size)} style={{ color }}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  )
}

const GROUP_ICONS = {
  Organization: IconBuilding,
  Catalog: IconGrid,
  People: IconUsers,
  Assets: IconBox,
  Maintenance: IconWrench,
} as const

export function getGroupIcon(label: string) {
  return GROUP_ICONS[label as keyof typeof GROUP_ICONS] ?? IconGrid
}
