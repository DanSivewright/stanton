import type { CSSProperties } from 'react'
import { DM_Sans } from 'next/font/google'
import { SANA_CSS_VARS } from '@/components/mockups/sana/tokens'
import styles from '@/components/mockups/sana/sana.module.css'

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
})

export const metadata = {
  title: 'Stanton — Sana AI Mockup',
  description: 'Soft card-based asset management workspace',
}

export default function SanaLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`${styles.sanaRoot} ${dmSans.variable}`}
      style={SANA_CSS_VARS as CSSProperties}
    >
      {children}
    </div>
  )
}
