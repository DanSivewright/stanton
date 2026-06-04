import Link from 'next/link'
import React from 'react'

import { TeamPageHero } from '@/components/stakeholder/internal/InternalShell'
import { Reveal } from '@/components/stakeholder/Reveal'
import { internalModules } from '@/lib/stakeholder/internal-content'

export default function TeamModulesPage() {
  return (
    <>
      <TeamPageHero
        eyebrow="docs/modules/*.md"
        title="Module inventory"
        lead="Each module: globals, proposed record types, hooks, boundaries, and open questions. ~88 Linear issues scoped in docs/linear/scope-map.md — not created until approved."
      />

      <section className="team-section">
        <div className="team-section__inner">
          {internalModules.map((mod, i) => (
            <Reveal key={mod.slug} delay={i * 40}>
              <Link href={`/team/modules/${mod.slug}`} className="team-module-link" style={{ marginBottom: '0.75rem' }}>
                <h3>{mod.name}</h3>
                <span>
                  {mod.phase} · {mod.owner} · {mod.records.length} record types
                </span>
                <p style={{ margin: '0.5rem 0 0', fontSize: '0.88rem', color: 'var(--team-muted)' }}>{mod.summary}</p>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  )
}
