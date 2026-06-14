import { Instrument_Sans } from 'next/font/google'
import { QatalogShell } from '@/components/mockups/qatalog/QatalogShell'

const instrumentSans = Instrument_Sans({
  subsets: ['latin'],
  variable: '--font-instrument-sans',
})

export const metadata = {
  title: 'Qatalog · Stanton Asset Management',
  description: 'Airy directory mockup for Stanton asset management',
}

export default function QatalogLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={instrumentSans.className} style={{ fontFamily: 'var(--font-instrument-sans), system-ui, sans-serif' }}>
      <QatalogShell>{children}</QatalogShell>
    </div>
  )
}
