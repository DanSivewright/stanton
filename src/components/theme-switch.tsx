'use client'

import * as React from 'react'
import { useTheme } from 'next-themes'
import { RiEqualizer3Fill, RiMoonLine, RiSunLine } from '@remixicon/react'

import * as SegmentedControl from '@/components/ui/segmented-control'

export function ThemeSwitch() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <SegmentedControl.Root value={theme} onValueChange={setTheme}>
      <SegmentedControl.List>
        <SegmentedControl.Trigger value="light" className="aspect-square">
          <RiSunLine className="size-4" />
        </SegmentedControl.Trigger>
        <SegmentedControl.Trigger value="dark" className="aspect-square">
          <RiMoonLine className="size-4" />
        </SegmentedControl.Trigger>
        <SegmentedControl.Trigger value="system" className="aspect-square">
          <RiEqualizer3Fill className="size-4" />
        </SegmentedControl.Trigger>
      </SegmentedControl.List>
    </SegmentedControl.Root>
  )
}
