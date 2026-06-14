import Link from 'next/link'
import styles from './StatsCards.module.css'

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
    <div className={styles.grid}>
      {stats.map((stat) => {
        const inner = (
          <>
            <span className={styles.value} style={stat.accent ? { color: stat.accent } : undefined}>
              {stat.value.toLocaleString()}
            </span>
            <span className={styles.label}>{stat.label}</span>
          </>
        )

        return stat.href ? (
          <Link key={stat.label} href={stat.href} className={styles.card}>
            {inner}
          </Link>
        ) : (
          <div key={stat.label} className={styles.card}>
            {inner}
          </div>
        )
      })}
    </div>
  )
}
