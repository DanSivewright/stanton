import { AppShell } from '@/components/mockups/elevenlabs/AppShell'

export const metadata = {
  title: 'Stanton — ElevenLabs UI Mockup',
  description: 'Light sidebar library browse pattern for Stanton asset management',
}

export default function ElevenLabsLayout({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>
}
