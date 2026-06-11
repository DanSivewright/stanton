import Link from 'next/link'
import React from 'react'

import { EcosystemMap } from '@/components/stakeholder/EcosystemMap'
import { ModuleCard } from '@/components/stakeholder/ModuleCard'
import { Reveal } from '@/components/stakeholder/Reveal'
import { brand, modules, principles } from '@/lib/stakeholder/content'

export default function OverviewPage() {
  const featured = modules.filter((m) => m.phase === '1' && m.slug !== 'connectivity').slice(0, 4)

  return (
    <>
      <section className="hero">
        <div className="hero__orb hero__orb--a" aria-hidden />
        <div className="hero__orb hero__orb--b" aria-hidden />
        <Reveal className="hero__inner">
          <p className="hero__eyebrow">Executive overview</p>
          <h1>
            One platform for how <span className="hero__accent">Stanton Group</span> runs
          </h1>
          <p className="hero__lead">{brand.descriptor}</p>
          <div className="hero__cta">
            <Link href="/platform" className="btn btn--primary">
              Open unified platform demo
            </Link>
            <Link href="/ecosystem" className="btn btn--ghost">
              See how it connects
            </Link>
            <Link href="/modules" className="btn btn--ghost">
              Explore modules
            </Link>
          </div>
        </Reveal>
        <div className="hero__stats">
          <Reveal delay={120}>
            <div className="stat-pill">
              <strong>9</strong>
              <span>connected capabilities</span>
            </div>
          </Reveal>
          <Reveal delay={200}>
            <div className="stat-pill">
              <strong>~40</strong>
              <span>machines in scope</span>
            </div>
          </Reveal>
          <Reveal delay={280}>
            <div className="stat-pill">
              <strong>3</strong>
              <span>delivery phases after blueprint</span>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section section--paper">
        <div className="section__inner">
          <Reveal>
            <h2 className="section__title">What you get</h2>
            <p className="section__intro">
              A single operational hub — not a patchwork of apps. Each capability below shares the same
              people, sites, and assets.
            </p>
          </Reveal>
          <div className="principle-grid">
            {principles.map((p, i) => (
              <Reveal key={p.title} delay={i * 80} className="principle-card">
                <h3>{p.title}</h3>
                <p>{p.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section__inner section__inner--wide">
          <Reveal>
            <h2 className="section__title">The ecosystem at a glance</h2>
            <p className="section__intro">
              Foundations sit at the centre. Factory, finance, product development, and future sales
              and HR capabilities orbit the same records.
            </p>
          </Reveal>
          <Reveal delay={100}>
            <EcosystemMap />
          </Reveal>
        </div>
      </section>

      <section className="section section--dark">
        <div className="section__inner">
          <Reveal>
            <h2 className="section__title">Phase 1 — in focus now</h2>
          </Reveal>
          <div className="module-grid">
            {featured.map((m, i) => (
              <Reveal key={m.slug} delay={i * 70}>
                <ModuleCard module={m} />
              </Reveal>
            ))}
          </div>
          <Reveal delay={200}>
            <Link href="/modules" className="text-link">
              View all modules →
            </Link>
          </Reveal>
        </div>
      </section>

      <section className="section section--cta">
        <Reveal className="cta-band">
          <h2>Ready to walk through the roadmap and investment?</h2>
          <p>Short, punchy pages — built for leadership read-through and sign-off.</p>
          <div className="hero__cta">
            <Link href="/roadmap" className="btn btn--primary">
              Delivery roadmap
            </Link>
            <Link href="/investment" className="btn btn--ghost">
              Operating investment
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  )
}
