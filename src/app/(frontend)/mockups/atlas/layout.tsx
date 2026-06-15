import { DM_Sans } from 'next/font/google'
import { AtlasShell } from '@/components/mockups/atlas/AtlasShell'
import { cn } from '@/utils/cn'

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
})

export const metadata = {
  title: 'Atlas · Stanton Asset Management',
  description: 'Operations command center mockup for Stanton asset management',
}

export default function AtlasLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={cn(dmSans.className, 'font-[family-name:var(--font-dm-sans)]')}>
      <AtlasShell>{children}</AtlasShell>
    </div>
  )
}
