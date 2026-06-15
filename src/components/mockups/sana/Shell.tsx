'use client'

import Link from 'next/link'
import { Sidebar } from './Sidebar'
import * as Badge from '@/components/ui/badge'
import * as LinkButton from '@/components/ui/link-button'
import { cn } from '@/utils/cn'

type ShellProps = {
  title?: string
  subtitle?: string
  children: React.ReactNode
}

export function Shell({ title, subtitle, children }: ShellProps) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex shrink-0 items-start justify-between gap-4 border-b border-stroke-soft-200 bg-bg-white-0/80 px-6 py-4 backdrop-blur-sm lg:px-8">
          <div>
            {title ? (
              <h1 className="text-label-md font-semibold text-text-strong-950">{title}</h1>
            ) : null}
            {subtitle ? (
              <p className="mt-0.5 text-paragraph-sm text-text-sub-600">{subtitle}</p>
            ) : null}
          </div>
          <div className="flex items-center gap-3">
            <Badge.Root variant="lighter" color="purple" size="medium">
              Sana AI
            </Badge.Root>
            <LinkButton.Root variant="gray" size="medium" asChild>
              <Link href="/mockups">← All variants</Link>
            </LinkButton.Root>
          </div>
        </header>
        <main className={cn('flex-1 overflow-y-auto px-6 py-6 lg:px-8 lg:py-8')}>
          {children}
        </main>
      </div>
    </div>
  )
}
