import { LinearShell } from '@/components/mockups/linear/LinearShell'

export const metadata = {
  title: 'Stanton — Linear mockup',
  description: 'Dark dense issue-tracker UI for Stanton asset management',
}

export default function LinearMockupLayout({ children }: { children: React.ReactNode }) {
  return <LinearShell>{children}</LinearShell>
}
