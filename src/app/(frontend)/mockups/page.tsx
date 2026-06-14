import Link from 'next/link'
import { MOCKUP_VARIANTS } from '@/lib/mockups/navigation'

export const metadata = {
  title: 'Stanton UI Mockups',
  description: 'Four UI variants for Stanton asset management',
}

export default function MockupsIndexPage() {
  return (
    <div style={styles.page}>
      <header style={styles.header}>
        <p style={styles.eyebrow}>Stanton Asset Management</p>
        <h1 style={styles.title}>UI mockup variants</h1>
        <p style={styles.subtitle}>
          Four full-application explorations connected to Payload demo data. Each route mirrors
          admin collections with a distinct visual language.
        </p>
      </header>

      <div style={styles.grid}>
        {MOCKUP_VARIANTS.map((variant) => (
          <Link key={variant.slug} href={`/mockups/${variant.slug}`} style={styles.card}>
            <span style={styles.cardLabel}>{variant.label}</span>
            <span style={styles.cardRef}>{variant.reference}</span>
            <span style={styles.cardCta}>Open variant →</span>
          </Link>
        ))}
      </div>

      <p style={styles.seedHint}>
        No data yet?{' '}
        <code style={styles.code}>curl -X POST http://localhost:3000/api/seed-demo</code>
      </p>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
    padding: '64px 24px',
    background: '#0a0a0a',
    color: '#f5f5f5',
    fontFamily: 'system-ui, sans-serif',
  },
  header: { maxWidth: 720, margin: '0 auto 48px' },
  eyebrow: {
    textTransform: 'uppercase',
    letterSpacing: '0.12em',
    fontSize: 12,
    color: '#888',
    marginBottom: 12,
  },
  title: { fontSize: 40, fontWeight: 700, margin: '0 0 16px', lineHeight: 1.1 },
  subtitle: { color: '#aaa', lineHeight: 1.6, margin: 0 },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: 16,
    maxWidth: 960,
    margin: '0 auto',
  },
  card: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    padding: 24,
    borderRadius: 16,
    border: '1px solid #222',
    background: '#141414',
    textDecoration: 'none',
    color: 'inherit',
    transition: 'border-color 0.2s',
  },
  cardLabel: { fontSize: 20, fontWeight: 600 },
  cardRef: { color: '#888', fontSize: 14, flex: 1 },
  cardCta: { color: '#60a5fa', fontSize: 14, marginTop: 8 },
  seedHint: { textAlign: 'center', color: '#666', marginTop: 48, fontSize: 14 },
  code: {
    background: '#1a1a1a',
    padding: '2px 8px',
    borderRadius: 6,
    fontSize: 13,
  },
}
