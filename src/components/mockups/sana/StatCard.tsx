import Link from 'next/link'
import { cardStyle } from './tokens'

type StatCardProps = {
  label: string
  value: number | string
  accent?: string
  href?: string
}

export function StatCard({ label, value, accent = 'var(--sana-accent)', href }: StatCardProps) {
  const inner = (
    <>
      <p
        style={{
          margin: 0,
          fontSize: 12,
          fontWeight: 600,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          color: 'var(--sana-text-subtle)',
        }}
      >
        {label}
      </p>
      <p
        style={{
          margin: '8px 0 0',
          fontSize: 32,
          fontWeight: 700,
          color: accent,
          lineHeight: 1,
        }}
      >
        {value}
      </p>
    </>
  )

  const style = {
    ...cardStyle,
    padding: '20px 22px',
    textDecoration: 'none',
    color: 'inherit',
    display: 'block',
    transition: 'transform 0.15s, box-shadow 0.15s',
  }

  if (href) {
    return (
      <Link href={href} style={style}>
        {inner}
      </Link>
    )
  }

  return <div style={style}>{inner}</div>
}
