import Link from 'next/link'
import { notFound } from 'next/navigation'
import React from 'react'

import { PageHero } from '@/components/stakeholder/PageHero'
import { Reveal } from '@/components/stakeholder/Reveal'
import { getModule, modules } from '@/lib/stakeholder/content'

type Props = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return modules.map((m) => ({ slug: m.slug }))
}

export default async function ModuleDetailPage({ params }: Props) {
  const { slug } = await params
  const module = getModule(slug)
  if (!module) notFound()

  return (
    <>
      <PageHero
        eyebrow={`${module.phaseLabel} · ${module.statusLabel}`}
        title={module.name}
        lead={module.tagline}
      >
        <span className="module-detail__icon" aria-hidden>
          {module.icon}
        </span>
      </PageHero>

      <section className="section">
        <div className="section__inner module-detail">
          <Reveal>
            <h2 className="section__title">Outcomes</h2>
            <ul className="detail-list">
              {module.outcomes.map((o) => (
                <li key={o}>{o}</li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={80}>
            <h2 className="section__title">Connects to</h2>
            <div className="tag-row">
              {module.connectsTo.map((c) => (
                <span key={c} className="tag">
                  {c}
                </span>
              ))}
            </div>
          </Reveal>

          <Reveal delay={120}>
            <h2 className="section__title">Not in this version</h2>
            <ul className="detail-list detail-list--muted">
              {module.notIncluded.map((n) => (
                <li key={n}>{n}</li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={160}>
            <div className="detail-nav">
              <Link href="/modules" className="btn btn--ghost">
                ← All modules
              </Link>
              <Link href="/ecosystem" className="btn btn--primary">
                How it connects
              </Link>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
