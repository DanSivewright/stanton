import React from 'react'

import { ModuleCard } from '@/components/stakeholder/ModuleCard'
import { PageHero } from '@/components/stakeholder/PageHero'
import { Reveal } from '@/components/stakeholder/Reveal'
import { modules } from '@/lib/stakeholder/content'

export default function ModulesIndexPage() {
  const byPhase = ['1', '2', '3', '0'] as const

  return (
    <>
      <PageHero
        eyebrow="Scope"
        title="Nine capabilities, one platform"
        lead="Each module earns its place. Click through for outcomes, boundaries, and how it connects to the rest."
      />

      {byPhase.map((phase) => {
        const group = modules.filter((m) =>
          phase === '1' ? m.phase === '1' || m.slug === 'connectivity' : m.phase === phase,
        )
        if (group.length === 0) return null

        const title =
          phase === '0'
            ? 'Blueprint'
            : phase === '1'
              ? 'Phase 1 — Operations core'
              : phase === '2'
                ? 'Phase 2 — Commercial & people'
                : 'Phase 3 — Intelligence'

        return (
          <section key={phase} className={`section ${phase === '2' ? 'section--paper' : ''}`}>
            <div className="section__inner">
              <Reveal>
                <h2 className="section__title">{title}</h2>
              </Reveal>
              <div className="module-grid">
                {group.map((m, i) => (
                  <Reveal key={m.slug} delay={i * 50}>
                    <ModuleCard module={m} />
                  </Reveal>
                ))}
              </div>
            </div>
          </section>
        )
      })}
    </>
  )
}
