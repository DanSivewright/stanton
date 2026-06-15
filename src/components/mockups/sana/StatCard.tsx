import Link from 'next/link'
import { cn } from '@/utils/cn'

type StatCardProps = {
  label: string
  value: number | string
  accentClassName?: string
  href?: string
}

export function StatCard({
  label,
  value,
  accentClassName = 'text-feature-base',
  href,
}: StatCardProps) {
  const className = cn(
    'block rounded-2xl bg-bg-white-0 p-5 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200 transition duration-200',
    href && 'hover:-translate-y-0.5 hover:shadow-regular-sm hover:ring-feature-light',
  )

  const inner = (
    <>
      <p className="text-subheading-2xs uppercase tracking-wide text-text-soft-400">{label}</p>
      <p className={cn('mt-2 text-title-h4 font-bold leading-none', accentClassName)}>{value}</p>
    </>
  )

  if (href) {
    return (
      <Link href={href} className={className}>
        {inner}
      </Link>
    )
  }

  return <div className={className}>{inner}</div>
}
