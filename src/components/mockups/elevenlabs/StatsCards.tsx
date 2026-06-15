import Link from 'next/link'
import { cn } from '@/utils/cn'

type Stat = {
  label: string
  value: number
  href?: string
  accent?: string
}

type StatsCardsProps = {
  stats: Stat[]
}

export function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {stats.map((stat) => {
        const className = cn(
          'rounded-xl bg-bg-white-0 p-5 ring-1 ring-inset ring-stroke-soft-200 transition duration-200 ease-out',
          stat.href && 'hover:bg-bg-weak-50 hover:ring-stroke-sub-300',
        )

        const inner = (
          <>
            <p
              className="text-title-h5 text-text-strong-950"
              style={stat.accent ? { color: stat.accent } : undefined}
            >
              {stat.value.toLocaleString()}
            </p>
            <p className="mt-1 text-paragraph-sm text-text-sub-600">{stat.label}</p>
          </>
        )

        return stat.href ? (
          <Link key={stat.label} href={stat.href} className={className}>
            {inner}
          </Link>
        ) : (
          <div key={stat.label} className={className}>
            {inner}
          </div>
        )
      })}
    </div>
  )
}
