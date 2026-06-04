import Link from 'next/link'
import { notFound } from 'next/navigation'
import React from 'react'

import { TeamPageHero } from '@/components/stakeholder/internal/InternalShell'
import { Reveal } from '@/components/stakeholder/Reveal'
import { getInternalModule, internalModules } from '@/lib/stakeholder/internal-content'

type Props = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return internalModules.map((m) => ({ slug: m.slug }))
}

export default async function TeamModulePage({ params }: Props) {
  const { slug } = await params
  const mod = getInternalModule(slug)
  if (!mod) notFound()

  return (
    <>
      <TeamPageHero
        eyebrow={`${mod.phase} · ${mod.owner}`}
        title={mod.name}
        lead={mod.summary}
      />

      {mod.globals.length > 0 && (
        <section className="team-section">
          <div className="team-section__inner">
            <Reveal>
              <h2 className="team-section__title">Globals</h2>
            </Reveal>
            <div className="team-tags">
              {mod.globals.map((g) => (
                <span key={g.slug} className="team-tag" title={g.purpose}>
                  {g.slug}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {mod.records.length > 0 && (
        <section className="team-section team-section--paper">
          <div className="team-section__inner">
            <Reveal>
              <h2 className="team-section__title">Record types ({mod.records.length})</h2>
            </Reveal>
            <div className="record-grid">
              {mod.records.map((r, i) => (
                <Reveal key={r.slug} delay={i * 30} className="record-card">
                  <div className="record-card__slug">{r.slug}</div>
                  <div className="record-card__term">{r.term}</div>
                  <p>{r.purpose}</p>
                  {r.relationships ? <p>↔ {r.relationships}</p> : null}
                  {r.fieldGroups ? <p>Fields: {r.fieldGroups}</p> : null}
                  {r.notes ? <p>{r.notes}</p> : null}
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="team-section">
        <div className="team-section__inner">
          <Reveal>
            <h2 className="team-section__title">Hooks & jobs</h2>
          </Reveal>
          <ul style={{ color: 'var(--team-muted)', fontSize: '0.9rem' }}>
            {mod.hooks.map((h) => (
              <li key={h} style={{ marginBottom: '0.4rem' }}>
                {h}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="team-section">
        <div className="team-section__inner">
          <Reveal>
            <h2 className="team-section__title">Out of scope (v1)</h2>
          </Reveal>
          <ul style={{ color: 'var(--team-muted)', fontSize: '0.9rem' }}>
            {mod.outOfScope.map((o) => (
              <li key={o}>{o}</li>
            ))}
          </ul>
        </div>
      </section>

      {mod.openQuestions.length > 0 && (
        <section className="team-section team-section--paper">
          <div className="team-section__inner">
            <Reveal>
              <h2 className="team-section__title">Open questions</h2>
            </Reveal>
            <ul>
              {mod.openQuestions.map((q) => (
                <li key={q} style={{ marginBottom: '0.35rem' }}>
                  {q}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section className="team-section">
        <div className="team-section__inner">
          <Link href="/team/modules" className="team-btn team-btn--ghost">
            ← All modules
          </Link>
        </div>
      </section>
    </>
  )
}
