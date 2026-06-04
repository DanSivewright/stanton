import Link from 'next/link'
import React from 'react'

import { TeamPageHero } from '@/components/stakeholder/internal/InternalShell'
import { Reveal } from '@/components/stakeholder/Reveal'
import { deliveryEpics, linearLabels } from '@/lib/stakeholder/internal-content'

const phaseDetail = [
  {
    id: '0',
    title: 'Phase 0 — Align',
    items: [
      'Documentation pass (complete in repo)',
      'CONTEXT.md glossary',
      'Intake archive immutable under docs/intake/',
      'Linear scope map markdown — ~88 issues, NOT created until approved',
      'Operating rule: spec changes update markdown + Linear together',
    ],
  },
  {
    id: '1',
    title: 'Phase 1 — Operations core',
    items: [
      'Foundations collections implement',
      'Manufacturing — replaces WhatsApp rounds; prior MVP reference only',
      'Maintenance — separate module; no Fix migration v1',
      'Finance — PIMMS + Stanton Global first',
      'SPD POC — end June 2026 pressure',
      'Platform: Mongo replica set, Vercel Pro, import-export plugin, jobs cron',
    ],
  },
  {
    id: '2',
    title: 'Phase 2 — Commercial & people',
    items: ['Sales — Pipedrive mapping TBD', 'HR — blocked on Trevor green light', 'Odoo actuals layer for sales'],
  },
  {
    id: '3',
    title: 'Phase 3 — Intelligence',
    items: [
      'LLM provider + agent API plugin',
      'Odoo automated finance sync',
      'Pipedrive sync',
      'SharePoint auto-filing jobs',
    ],
  },
]

export default function TeamDeliveryPage() {
  return (
    <>
      <TeamPageHero
        eyebrow="docs/linear/scope-map.md"
        title="Delivery & backlog"
        lead="Markdown is canonical until scope map is explicitly approved. Then create Linear project + ~88 issues via MCP."
      />

      <section className="team-section">
        <div className="team-section__inner">
          <Reveal>
            <div className="team-card" style={{ borderColor: 'rgba(201, 162, 39, 0.4)' }}>
              <h3 style={{ color: 'var(--team-warn)' }}>⚠ Linear creation blocked</h3>
              <p>
                Do not bulk-create issues without user sign-off on docs/linear/scope-map.md. Labels and epics below
                are ready to paste.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="team-section">
        <div className="team-section__inner">
          {phaseDetail.map((phase, i) => (
            <Reveal key={phase.id} delay={i * 70} className="team-principle">
              <h3>{phase.title}</h3>
              <ul style={{ margin: 0, paddingLeft: '1.1rem', color: 'var(--team-muted)', fontSize: '0.88rem' }}>
                {phase.items.map((item) => (
                  <li key={item} style={{ marginBottom: '0.3rem' }}>
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="team-section team-section--paper">
        <div className="team-section__inner">
          <Reveal>
            <h2 className="team-section__title">Epics (scope map)</h2>
          </Reveal>
          <div className="team-table-wrap">
            <table className="team-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Epic</th>
                  <th>Status</th>
                  <th>~Issues</th>
                </tr>
              </thead>
              <tbody>
                {deliveryEpics.map((e) => (
                  <tr key={e.id}>
                    <td>
                      <code>{e.id}</code>
                    </td>
                    <td>{e.name}</td>
                    <td>{e.status}</td>
                    <td>{e.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="team-section">
        <div className="team-section__inner">
          <Reveal>
            <h2 className="team-section__title">Linear labels</h2>
          </Reveal>
          <div className="team-tags">
            {linearLabels.map((l) => (
              <span key={l} className="team-tag">
                {l}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="team-section">
        <div className="team-section__inner">
          <Reveal>
            <h2 className="team-section__title">Priority guidance</h2>
          </Reveal>
          <ul style={{ fontSize: '0.9rem', color: 'var(--team-muted)' }}>
            <li>
              <strong>Urgent:</strong> SPD POC (June 2026), Finance active
            </li>
            <li>
              <strong>High:</strong> Manufacturing Phase 2, Foundations
            </li>
            <li>
              <strong>Medium:</strong> Maintenance, Sales
            </li>
            <li>
              <strong>Low:</strong> HR (deferred), LLM
            </li>
          </ul>
          <p style={{ marginTop: '1.5rem' }}>
            <Link href="/team/costs" className="team-btn">
              Internal operating costs →
            </Link>
          </p>
        </div>
      </section>
    </>
  )
}
