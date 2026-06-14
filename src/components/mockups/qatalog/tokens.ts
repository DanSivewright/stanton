import type { CSSProperties } from 'react'

export const qatalog = {
  bg: '#ffffff',
  bgMuted: '#fafafa',
  bgHover: '#f5f5f5',
  border: '#e8e8e8',
  borderStrong: '#d4d4d4',
  text: '#0a0a0a',
  textSecondary: '#737373',
  textMuted: '#a3a3a3',
  primary: '#0a0a0a',
  primaryText: '#ffffff',
  accent: '#2563eb',
  sidebarWidth: 56,
  drawerWidth: 440,
  radius: 8,
  radiusPill: 999,
  fontFamily: 'var(--font-instrument-sans), "Instrument Sans", system-ui, sans-serif',
} as const

export const qatalogStyles = {
  page: {
    minHeight: '100vh',
    background: qatalog.bg,
    color: qatalog.text,
    fontFamily: qatalog.fontFamily,
    display: 'flex',
  } satisfies CSSProperties,
  main: {
    flex: 1,
    minWidth: 0,
    display: 'flex',
    flexDirection: 'column',
  } satisfies CSSProperties,
  content: {
    flex: 1,
    padding: '32px 48px 64px',
    maxWidth: 1200,
  } satisfies CSSProperties,
  sectionTitle: {
    fontSize: 48,
    fontWeight: 400,
    letterSpacing: '-0.03em',
    lineHeight: 1.1,
    margin: '0 0 8px',
  } satisfies CSSProperties,
  subtitle: {
    fontSize: 15,
    color: qatalog.textSecondary,
    margin: '0 0 32px',
  } satisfies CSSProperties,
}
