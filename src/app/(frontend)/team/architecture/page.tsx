import Link from 'next/link'
import React from 'react'

import { HistoryFlowSvg } from '@/components/stakeholder/internal/HistoryFlowSvg'
import { OrgTreeSvg } from '@/components/stakeholder/internal/OrgTreeSvg'
import { TeamPageHero } from '@/components/stakeholder/internal/InternalShell'
import { Reveal } from '@/components/stakeholder/Reveal'
import { intakeOverrides, orgLevels } from '@/lib/stakeholder/internal-content'

const boundaries = [
  {
    title: 'In scope (this repo)',
    items: [
      'Single application — operational & intelligence hub',
      'Admin UI as primary operations surface',
      'Normalized cross-module data model on MongoDB',
      'Import/export, jobs queue, phased external sync',
      'Custom admin views for workflow-heavy modules (phased)',
    ],
  },
  {
    title: 'Explicitly out of scope',
    items: [
      'Replacing Odoo as accounting system of record',
      'Full CRM, full HRIS, standalone per-module apps',
      'Board pack rendering inside core admin (downstream generators)',
      'Prior MVP / PoC carry-over without clean rebuild',
    ],
  },
]

const spdAlignment = [
  'SPD intake described a standalone app — ecosystem decision: bounded module in shared app',
  'Shared foundations: Employee, Company, Customer, Contact, Documents, Product/Tooling Asset',
  'Versioned process templates + per-project snapshot (template updates do not mutate live projects)',
  'First-class change requests + gate sign-off events',
  'Phased links to Manufacturing/HR/Finance — not hard v1 POC dependencies',
]

export default function TeamArchitecturePage() {
  return (
    <>
      <TeamPageHero
        eyebrow="Executive agreement"
        title="Architecture & boundaries"
        lead="Canonical spec: docs/MASTER-SPEC.md. This page summarizes vision, org model, SPD alignment, and what we deliberately do not build."
      />

      <section className="team-section">
        <div className="team-section__inner">
          <Reveal>
            <h2 className="team-section__title">Organisation model</h2>
            <p className="team-section__intro">
              Separate collections for hierarchy — not nested-docs for Employee→Manager or
              Project→Gate (use relationships or embedded blocks).
            </p>
          </Reveal>
          <Reveal delay={60}>
            <OrgTreeSvg />
          </Reveal>
          <div className="team-table-wrap" style={{ marginTop: '1.5rem' }}>
            <table className="team-table">
              <thead>
                <tr>
                  <th>Level</th>
                  <th>Collection</th>
                  <th>Children / links</th>
                </tr>
              </thead>
              <tbody>
                {orgLevels.map((row) => (
                  <tr key={row.level}>
                    <td>{row.level}</td>
                    <td>
                      <code>{row.slug}</code>
                    </td>
                    <td>{row.children}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="team-section team-section--paper">
        <div className="team-section__inner">
          <Reveal>
            <h2 className="team-section__title">History patterns</h2>
            <p className="team-section__intro">
              Drafts/versions for publishable templates only — not the sole workflow engine for factory,
              SPD, or HR operations.
            </p>
          </Reveal>
          <Reveal delay={80}>
            <HistoryFlowSvg />
          </Reveal>
        </div>
      </section>

      <section className="team-section">
        <div className="team-section__inner">
          <div className="team-card-grid">
            {boundaries.map((b, i) => (
              <Reveal key={b.title} delay={i * 50} className="team-card">
                <h3>{b.title}</h3>
                <ul style={{ margin: '0.5rem 0 0', paddingLeft: '1.1rem', fontSize: '0.88rem', color: 'var(--team-muted)' }}>
                  {b.items.map((item) => (
                    <li key={item} style={{ marginBottom: '0.35rem' }}>
                      {item}
                    </li>
                  ))}
                </ul>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="team-section">
        <div className="team-section__inner">
          <Reveal>
            <h2 className="team-section__title">SPD ecosystem alignment</h2>
          </Reveal>
          <ul style={{ color: 'var(--team-muted)', fontSize: '0.9rem', lineHeight: 1.7 }}>
            {spdAlignment.map((line) => (
              <li key={line} style={{ marginBottom: '0.5rem' }}>
                {line}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="team-section team-section--paper">
        <div className="team-section__inner">
          <Reveal>
            <h2 className="team-section__title">Intake overrides</h2>
          </Reveal>
          <ul>
            {intakeOverrides.map((o) => (
              <li key={o} style={{ marginBottom: '0.5rem' }}>
                {o}
              </li>
            ))}
          </ul>
          <p style={{ marginTop: '1.5rem' }}>
            <Link href="/team/data-model" className="team-btn">
              Data model layers →
            </Link>
          </p>
        </div>
      </section>
    </>
  )
}
