import { DM_Sans } from 'next/font/google'

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
      className={`${dmSans.variable} min-h-screen bg-[#f6f5fb] font-[family-name:var(--font-dm-sans)] text-text-strong-950 antialiased`}
    >
      {children}
    </div>
  )
}
