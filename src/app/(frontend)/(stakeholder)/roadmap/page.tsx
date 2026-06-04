import Link from 'next/link'
import React from 'react'

import { PageHero } from '@/components/stakeholder/PageHero'
import { Reveal } from '@/components/stakeholder/Reveal'
import { phases } from '@/lib/stakeholder/content'

export default function RoadmapPage() {
  return (
    <>
      <PageHero
        eyebrow="Delivery"
        title="Phased roadmap"
        lead="We scope the full picture up front, then implement in waves so factory and reporting value lands early."
      />

      <section className="section">
        <div className="section__inner">
          <ol className="phase-timeline">
            {phases.map((phase, i) => (
              <Reveal key={phase.id} as="li" delay={i * 90} className="phase-timeline__item">
                <div className="phase-timeline__marker">
                  <span>{phase.id}</span>
                </div>
                <div className="phase-timeline__body">
                  <h3>{phase.title}</h3>
                  <p>{phase.summary}</p>
                  <ul>
                    {phase.modules.map((m) => (
                      <li key={m}>{m}</li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </section>

      <section className="section section--paper">
        <div className="section__inner">
          <Reveal>
            <h2 className="section__title">What success looks like</h2>
            <div className="success-grid">
              <div className="success-card">
                <h3>Phase 1 complete</h3>
                <p>
                  Leaders see live factory performance, maintenance is traceable, finance reporting data
                  is centralized, and SPD gates are enforced in software — on shared org and asset data.
                </p>
              </div>
              <div className="success-card">
                <h3>Phase 2 complete</h3>
                <p>
                  Sales teams coach against target vs actual. HR performance hub is live with your
                  approval — contracts, reviews, and manufacturing-fed metrics in one place.
                </p>
              </div>
              <div className="success-card">
                <h3>Phase 3 complete</h3>
                <p>
                  Staff ask questions in plain language. Deep ERP and CRM sync runs on schedules you
                  control — without rewriting how the business thinks about its data.
                </p>
              </div>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <Link href="/investment" className="btn btn--primary">
              Operating investment →
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  )
}
