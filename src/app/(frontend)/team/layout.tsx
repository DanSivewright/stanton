import React from 'react'

import { InternalShell } from '@/components/stakeholder/internal/InternalShell'

import './team.css'

export const metadata = {
  title: 'Team reference · Stanton / PIMMS',
  description: 'Buildmore internal delivery reference for the Stanton PIMMS ecosystem.',
  robots: { index: false, follow: false },
}

export default function TeamLayout(props: { children: React.ReactNode }) {
  return (
    <InternalShell>
      <main>{props.children}</main>
    </InternalShell>
  )
}
