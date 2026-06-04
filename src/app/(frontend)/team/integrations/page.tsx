import Link from 'next/link'
import React from 'react'

import { IntegrationFlowSvg } from '@/components/stakeholder/internal/IntegrationFlowSvg'
import { TeamPageHero } from '@/components/stakeholder/internal/InternalShell'
import { Reveal } from '@/components/stakeholder/Reveal'
import { integrations } from '@/lib/stakeholder/internal-content'

export default function TeamIntegrationsPage() {
  return (
    <>
      <TeamPageHero
        eyebrow="docs/architecture/integrations.md"
        title="Integrations"
        lead="External systems feed or receive data — they do not define our schema. Model + manual/import first; automated sync later."
      />

      <section className="team-section">
        <div className="team-section__inner">
          <Reveal>
            <IntegrationFlowSvg />
          </Reveal>
          <p className="team-section__intro" style={{ marginTop: '1rem', textAlign: 'center' }}>
            <strong>Hard rule:</strong> all external API calls are server-side (hooks, jobs, custom endpoints). Admin UI
            reads/writes platform only.
          </p>
        </div>
      </section>

      <section className="team-section team-section--paper">
        <div className="team-section__inner">
          <Reveal>
            <h2 className="team-section__title">Integration matrix</h2>
          </Reveal>
          <div className="team-table-wrap">
            <table className="team-table">
              <thead>
                <tr>
                  <th>System</th>
                  <th>Role</th>
                  <th>Module</th>
                  <th>v1</th>
                  <th>Later</th>
                </tr>
              </thead>
              <tbody>
                {integrations.map((row) => (
                  <tr key={row.system}>
                    <td>
                      <strong>{row.system}</strong>
                      <br />
                      <small style={{ color: '#6a7580' }}>{row.rule}</small>
                    </td>
                    <td>{row.role}</td>
                    <td>{row.module}</td>
                    <td>{row.v1}</td>
                    <td>{row.later}</td>
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
            <h2 className="team-section__title">Odoo finance (when automated)</h2>
          </Reveal>
          <ul style={{ fontSize: '0.9rem', color: 'var(--team-muted)', lineHeight: 1.7 }}>
            <li>Server-side only — never browser → Odoo</li>
            <li>search_read / JSON-RPC from prior PoC</li>
            <li>Persist to normalized finance collections</li>
            <li>Incremental sync + full reconcile when scheduled</li>
            <li>Secrets in env; monitor lag and errors</li>
            <li>v1: manual entry + import-export — sync is separate epic after model validation</li>
          </ul>
          <p style={{ marginTop: '1.5rem' }}>
            <Link href="/team/automation" className="team-btn">
              Automation & jobs →
            </Link>
          </p>
        </div>
      </section>
    </>
  )
}
