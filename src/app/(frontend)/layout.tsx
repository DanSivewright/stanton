import { Inter as FontSans } from "next/font/google";
import type React from "react";

import "@/globals.css";
import "./styles.css";
import { Providers } from "@/components/providers";
import { cn } from "@/utils/cn";

const inter = FontSans({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata = {
  description: "A blank template using Payload in a Next.js app.",
  title: "Payload Blank Template",
};

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props;

  return (
    <html
      className={cn(inter.variable, "antialiased")}
      lang="en"
      suppressHydrationWarning
    >
      <body className="bg-bg-white-0 text-text-strong-950">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
