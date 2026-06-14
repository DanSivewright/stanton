import type { CSSProperties } from 'react'

export const SANA_CSS_VARS = {
  '--sana-bg': '#f6f5fb',
  '--sana-bg-soft': '#eeecf8',
  '--sana-surface': '#ffffff',
  '--sana-surface-hover': '#faf9fe',
  '--sana-border': '#e8e5f2',
  '--sana-border-strong': '#d9d4ea',
  '--sana-text': '#1a1625',
  '--sana-text-muted': '#6b6578',
  '--sana-text-subtle': '#9b94a8',
  '--sana-accent': '#7c5cfc',
  '--sana-accent-soft': '#ede9fe',
  '--sana-accent-hover': '#6b4ae8',
  '--sana-lavender': '#b794f6',
  '--sana-shadow': '0 1px 3px rgba(26, 22, 37, 0.06), 0 8px 24px rgba(124, 92, 252, 0.06)',
  '--sana-shadow-lg': '0 4px 24px rgba(26, 22, 37, 0.08), 0 12px 48px rgba(124, 92, 252, 0.1)',
  '--sana-radius': '16px',
  '--sana-radius-sm': '10px',
  '--sana-radius-xs': '8px',
  '--sana-sidebar-width': '72px',
  '--sana-nav-width': '240px',
} as const

export const sanaFont = 'var(--font-dm-sans, "DM Sans", system-ui, sans-serif)'

export const cardStyle: CSSProperties = {
  background: 'var(--sana-surface)',
  borderRadius: 'var(--sana-radius)',
  border: '1px solid var(--sana-border)',
  boxShadow: 'var(--sana-shadow)',
}

export const pillStyle = (color: string, bg: string): CSSProperties => ({
  display: 'inline-flex',
  alignItems: 'center',
  padding: '3px 10px',
  borderRadius: 999,
  fontSize: 12,
  fontWeight: 500,
  color,
  background: bg,
  textTransform: 'capitalize',
})
