"use client";

import { RiEqualizer3Fill, RiMoonLine, RiSunLine } from "@remixicon/react";
import { useTheme } from "next-themes";
import * as React from "react";

import * as SegmentedControl from "@/components/ui/segmented-control";

export function ThemeSwitch() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <SegmentedControl.Root onValueChange={setTheme} value={theme}>
      <SegmentedControl.List>
        <SegmentedControl.Trigger className="aspect-square" value="light">
          <RiSunLine className="size-4" />
        </SegmentedControl.Trigger>
        <SegmentedControl.Trigger className="aspect-square" value="dark">
          <RiMoonLine className="size-4" />
        </SegmentedControl.Trigger>
        <SegmentedControl.Trigger className="aspect-square" value="system">
          <RiEqualizer3Fill className="size-4" />
        </SegmentedControl.Trigger>
      </SegmentedControl.List>
    </SegmentedControl.Root>
  );
}
