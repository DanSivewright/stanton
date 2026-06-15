"use client";

import {
  ThemeProvider as NextThemesProvider,
  type ThemeProviderProps,
} from "next-themes";
import { ThemeSwitch } from "@/components/theme-switch";
import { NotificationProvider } from "@/components/ui/notification-provider";
import { Toaster } from "@/components/ui/toast";
import { Provider as TooltipProvider } from "@/components/ui/tooltip";

function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  // next-themes injects an inline script to prevent theme flash on first paint.
  // React 19 warns about <script> inside client components during hydration.
  // On the client only, use a non-executable type so React skips the warning.
  const scriptProps =
    typeof window === "undefined"
      ? undefined
      : ({ type: "application/json" } as const);

  return (
    <NextThemesProvider scriptProps={scriptProps} {...props}>
      {children}
    </NextThemesProvider>
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      disableTransitionOnChange
      enableSystem
    >
      <TooltipProvider>
        {children}
        <div className="fixed right-4 bottom-4 z-50">
          <ThemeSwitch />
        </div>
        <NotificationProvider />
        <Toaster />
      </TooltipProvider>
    </ThemeProvider>
  );
}
