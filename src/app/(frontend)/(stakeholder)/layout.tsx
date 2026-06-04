import React from 'react'

import { Shell } from '@/components/stakeholder/Shell'

export const metadata = {
  title: 'Stanton Group · PIMMS — Platform Overview',
  description:
    'Executive overview of the integrated operations platform for Stanton Group and PIMMS.',
}

export default function StakeholderLayout(props: { children: React.ReactNode }) {
  return (
    <Shell>
      <main>{props.children}</main>
    </Shell>
  )
}
