import Link from 'next/link'
import * as Button from '@/components/ui/button'
import { cn } from '@/utils/cn'

type PageHeaderProps = {
  title: string
  description?: string
  action?: React.ReactNode
  children?: React.ReactNode
  className?: string
}

export function PageHeader({ title, description, action, children, className }: PageHeaderProps) {
  return (
    <header className={cn('mb-8', className)}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-title-h4 text-text-strong-950">{title}</h1>
          {description ? (
            <p className="mt-1 max-w-2xl text-paragraph-sm text-text-sub-600">{description}</p>
          ) : null}
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
      {children ? <div className="mt-6 space-y-4">{children}</div> : null}
    </header>
  )
}

export function PrimaryButton({ children, href }: { children: React.ReactNode; href?: string }) {
  if (href) {
    return (
      <Button.Root variant="primary" mode="filled" size="medium" asChild>
        <Link href={href}>{children}</Link>
      </Button.Root>
    )
  }
  return (
    <Button.Root variant="primary" mode="filled" size="medium" type="button">
      {children}
    </Button.Root>
  )
}
