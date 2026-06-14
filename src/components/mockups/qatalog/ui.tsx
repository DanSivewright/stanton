'use client'

import Link from 'next/link'
import { initials } from '@/lib/mockups/helpers'
import { qatalog } from './tokens'
import { IconX } from './icons'

export function QButton({
  children,
  href,
  onClick,
  variant = 'primary',
}: {
  children: React.ReactNode
  href?: string
  onClick?: () => void
  variant?: 'primary' | 'ghost'
}) {
  const style: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    padding: variant === 'primary' ? '10px 18px' : '8px 14px',
    borderRadius: qatalog.radius,
    border: variant === 'primary' ? 'none' : `1px solid ${qatalog.border}`,
    background: variant === 'primary' ? qatalog.primary : 'transparent',
    color: variant === 'primary' ? qatalog.primaryText : qatalog.text,
    fontSize: 14,
    fontWeight: 500,
    cursor: 'pointer',
    textDecoration: 'none',
    fontFamily: 'inherit',
  }

  if (href) {
    return (
      <Link href={href} style={style}>
        {children}
      </Link>
    )
  }

  return (
    <button type="button" onClick={onClick} style={style}>
      {children}
    </button>
  )
}

export function Pill({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode
  active?: boolean
  onClick?: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding: '6px 14px',
        borderRadius: qatalog.radiusPill,
        border: `1px solid ${active ? qatalog.text : qatalog.border}`,
        background: active ? qatalog.text : qatalog.bg,
        color: active ? qatalog.primaryText : qatalog.textSecondary,
        fontSize: 13,
        fontWeight: 500,
        cursor: 'pointer',
        fontFamily: 'inherit',
        whiteSpace: 'nowrap',
      }}
    >
      {children}
    </button>
  )
}

export function Avatar({
  name,
  size = 32,
  index = 0,
}: {
  name: string
  size?: number
  index?: number
}) {
  const hues = [220, 160, 280, 30, 200, 340]
  const hue = hues[index % hues.length]
  return (
    <span
      title={name}
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        background: `hsl(${hue} 45% 88%)`,
        color: `hsl(${hue} 35% 30%)`,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: size * 0.38,
        fontWeight: 600,
        flexShrink: 0,
        border: `2px solid ${qatalog.bg}`,
      }}
    >
      {initials(name)}
    </span>
  )
}

export function AvatarStack({
  names,
  max = 4,
  size = 28,
}: {
  names: string[]
  max?: number
  size?: number
}) {
  const visible = names.slice(0, max)
  const overflow = names.length - max

  return (
    <span style={{ display: 'inline-flex', alignItems: 'center' }}>
      {visible.map((name, i) => (
        <span key={`${name}-${i}`} style={{ marginLeft: i === 0 ? 0 : -8, zIndex: visible.length - i }}>
          <Avatar name={name} size={size} index={i} />
        </span>
      ))}
      {overflow > 0 && (
        <span
          style={{
            marginLeft: -8,
            width: size,
            height: size,
            borderRadius: '50%',
            background: qatalog.bgMuted,
            border: `2px solid ${qatalog.bg}`,
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 11,
            fontWeight: 600,
            color: qatalog.textSecondary,
          }}
        >
          +{overflow}
        </span>
      )}
    </span>
  )
}

export function Badge({ children, color }: { children: React.ReactNode; color?: string }) {
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '3px 10px',
        borderRadius: qatalog.radiusPill,
        background: color ? `${color}18` : qatalog.bgMuted,
        color: color ?? qatalog.textSecondary,
        fontSize: 12,
        fontWeight: 500,
        textTransform: 'capitalize',
      }}
    >
      {children}
    </span>
  )
}

export function DetailDrawer({
  open,
  onClose,
  title,
  subtitle,
  children,
}: {
  open: boolean
  onClose: () => void
  title: string
  subtitle?: string
  children: React.ReactNode
}) {
  if (!open) return null

  return (
    <>
      <div
        role="presentation"
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.12)',
          zIndex: 40,
        }}
      />
      <aside
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: qatalog.drawerWidth,
          maxWidth: '100vw',
          background: qatalog.bg,
          borderLeft: `1px solid ${qatalog.border}`,
          zIndex: 50,
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '-8px 0 32px rgba(0,0,0,0.06)',
          animation: 'qatalogSlideIn 0.22s ease-out',
        }}
      >
        <header
          style={{
            padding: '24px 28px',
            borderBottom: `1px solid ${qatalog.border}`,
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: 16,
          }}
        >
          <div>
            <h2 style={{ margin: 0, fontSize: 22, fontWeight: 500, letterSpacing: '-0.02em' }}>{title}</h2>
            {subtitle ? (
              <p style={{ margin: '6px 0 0', fontSize: 14, color: qatalog.textSecondary }}>{subtitle}</p>
            ) : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            style={{
              border: 'none',
              background: qatalog.bgMuted,
              borderRadius: qatalog.radius,
              width: 36,
              height: 36,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              flexShrink: 0,
            }}
          >
            <IconX size={18} />
          </button>
        </header>
        <div style={{ flex: 1, overflow: 'auto', padding: '24px 28px' }}>{children}</div>
      </aside>
      <style>{`
        @keyframes qatalogSlideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </>
  )
}

export function FieldRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <div
        style={{
          fontSize: 12,
          fontWeight: 500,
          color: qatalog.textMuted,
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          marginBottom: 6,
        }}
      >
        {label}
      </div>
      <div style={{ fontSize: 15, color: qatalog.text, lineHeight: 1.5 }}>{value ?? '—'}</div>
    </div>
  )
}
