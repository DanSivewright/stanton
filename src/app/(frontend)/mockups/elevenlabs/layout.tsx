import { AppShell } from '@/components/mockups/elevenlabs/AppShell'
import '@/components/mockups/elevenlabs/tokens.css'

export const metadata = {
  title: 'Stanton — ElevenLabs UI Mockup',
  description: 'Light sidebar library browse pattern for Stanton asset management',
}

export default function ElevenLabsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
        rel="stylesheet"
      />
      <div className="elevenlabs-root">
        <AppShell>{children}</AppShell>
      </div>
    </>
  )
}
