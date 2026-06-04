import { Fraunces, IBM_Plex_Sans } from 'next/font/google'
import React from 'react'

import { Shell } from '@/components/stakeholder/Shell'

import './styles.css'

const display = Fraunces({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['400', '500', '600', '700'],
})

const body = IBM_Plex_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['400', '500', '600'],
})

export const metadata = {
  title: 'Stanton Group · PIMMS — Platform Overview',
  description:
    'Executive overview of the integrated operations platform for Stanton Group and PIMMS.',
}

export default function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body>
        <Shell>
          <main>{children}</main>
        </Shell>
      </body>
    </html>
  )
}
