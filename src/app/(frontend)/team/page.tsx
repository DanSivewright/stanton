import Link from 'next/link'
import React from 'react'

import { DataLayersSvg } from '@/components/stakeholder/internal/DataLayersSvg'
import { InternalEcosystemSvg } from '@/components/stakeholder/internal/InternalEcosystemSvg'
import { TeamPageHero } from '@/components/stakeholder/internal/InternalShell'
import { Reveal } from '@/components/stakeholder/Reveal'
import { internalNav, openDecisions, platformPrinciples } from '@/lib/stakeholder/internal-content'

export default function TeamHubPage() {
  const quickLinks = internalNav.filter((l) => l.href !== '/team')

  return (
    <>
      <TeamPageHero
        eyebrow="Buildmore · delivery reference"
        title="Everything we are building — in one place"
        lead="Exhaustive team view of the Stanton / PIMMS ecosystem: data model, modules, integrations, automation, delivery backlog, and internal operating costs. Not linked from the client overview."
      />

      <section className="team-section">
        <div className="team-section__inner">
          <Reveal>
            <h2 className="team-section__title">Platform principles</h2>
          </Reveal>
          <div className="team-principles">
            {platformPrinciples.map((p, i) => (
              <Reveal key={p.title} delay={i * 60} className="team-principle">
                <h3>{p.title}</h3>
                <p>{p.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="team-section team-section--paper">
        <div className="team-section__inner">
          <Reveal>
            <h2 className="team-section__title">Module map</h2>
            <p className="team-section__intro">
              Nine modules + cross-cutting data management. One MongoDB model — organized by module for
              docs, admin grouping, and Linear labels.
            </p>
          </Reveal>
          <Reveal delay={80}>
            <InternalEcosystemSvg />
          </Reveal>
        </div>
      </section>

      <section className="team-section">
        <div className="team-section__inner">
          <Reveal>
            <h2 className="team-section__title">Model layers</h2>
          </Reveal>
          <Reveal delay={60}>
            <DataLayersSvg />
          </Reveal>
        </div>
      </section>

      <section className="team-section">
        <div className="team-section__inner">
          <Reveal>
            <h2 className="team-section__title">Navigate</h2>
          </Reveal>
          <div className="team-card-grid">
            {quickLinks.map((link, i) => (
              <Reveal key={link.href} delay={i * 40} className="team-card">
                <h3>{link.label}</h3>
                <p>Deep dive →</p>
                <Link href={link.href}>Open section</Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="team-section team-section--paper">
        <div className="team-section__inner">
          <Reveal>
            <h2 className="team-section__title">Open decisions ({openDecisions.length})</h2>
          </Reveal>
          <div className="team-table-wrap">
            <table className="team-table">
              <thead>
                <tr>
                  <th>Topic</th>
                  <th>Status</th>
                  <th>Refs</th>
                </tr>
              </thead>
              <tbody>
                {openDecisions.map((row) => (
                  <tr key={row.topic}>
                    <td>{row.topic}</td>
                    <td>{row.status}</td>
                    <td>
                      <code>{row.refs}</code>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={{ marginTop: '1.5rem' }}>
            <Link href="/team/delivery" className="team-btn">
              Delivery & Linear →
            </Link>
          </p>
        </div>
      </section>
    </>
  )
}
