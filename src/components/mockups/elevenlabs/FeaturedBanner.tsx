import Link from 'next/link'
import * as Badge from '@/components/ui/badge'
import * as Button from '@/components/ui/button'
import { cn } from '@/utils/cn'

type FeaturedBannerProps = {
  title: string
  description: string
  ctaLabel: string
  ctaHref: string
  tags?: string[]
}

export function FeaturedBanner({ title, description, ctaLabel, ctaHref, tags = [] }: FeaturedBannerProps) {
  return (
    <section className="relative mb-8 overflow-hidden rounded-2xl bg-bg-weak-50 p-8 ring-1 ring-inset ring-stroke-soft-200">
      <div className="relative z-10 max-w-xl">
        <Badge.Root size="small" variant="lighter" color="purple" className="mb-4">
          Featured collections
        </Badge.Root>
        <h2 className="text-title-h5 text-text-strong-950">{title}</h2>
        <p className="mt-2 text-paragraph-sm text-text-sub-600">{description}</p>
        {tags.length > 0 ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <Badge.Root key={tag} size="medium" variant="stroke" color="gray">
                {tag}
              </Badge.Root>
            ))}
          </div>
        ) : null}
        <Button.Root variant="primary" mode="filled" size="medium" className="mt-6" asChild>
          <Link href={ctaHref}>{ctaLabel}</Link>
        </Button.Root>
      </div>
      <div className="pointer-events-none absolute -right-8 top-1/2 size-56 -translate-y-1/2 rounded-full bg-primary-base/10 blur-3xl" />
      <div className="pointer-events-none absolute right-16 top-8 size-32 rounded-full bg-purple-200/60 blur-2xl" />
      <div className="pointer-events-none absolute bottom-0 right-24 size-40 rounded-full bg-sky-200/50 blur-2xl" />
    </section>
  )
}
