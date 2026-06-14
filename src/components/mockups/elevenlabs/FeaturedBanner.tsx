import Link from 'next/link'
import styles from './FeaturedBanner.module.css'

type FeaturedBannerProps = {
  title: string
  description: string
  ctaLabel: string
  ctaHref: string
  tags?: string[]
}

export function FeaturedBanner({ title, description, ctaLabel, ctaHref, tags = [] }: FeaturedBannerProps) {
  return (
    <section className={styles.banner}>
      <div className={styles.content}>
        <span className={styles.eyebrow}>Featured collections</span>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.description}>{description}</p>
        {tags.length > 0 && (
          <div className={styles.tags}>
            {tags.map((tag) => (
              <span key={tag} className={styles.tag}>
                {tag}
              </span>
            ))}
          </div>
        )}
        <Link href={ctaHref} className={styles.cta}>
          {ctaLabel}
        </Link>
      </div>
      <div className={styles.visual} aria-hidden>
        <div className={styles.orb1} />
        <div className={styles.orb2} />
        <div className={styles.orb3} />
      </div>
    </section>
  )
}
