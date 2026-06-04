import Link from 'next/link'
import React from 'react'

import { TeamPageHero } from '@/components/stakeholder/internal/InternalShell'
import { Reveal } from '@/components/stakeholder/Reveal'
import {
  internalCostRollups,
  internalCostRows,
  markupNote,
} from '@/lib/stakeholder/internal-content'

const unknowns = [
  'Manufacturing snapshot frequency (40 machines × hourly → storage)',
  'Finance report count expansion',
  'SharePoint / Microsoft licensing (client-owned?)',
  'South Africa data residency',
  '24/7 vs business-hours support expectation',
]

const oneTime = [
  'MongoDB migration / replica set setup — internal time',
  'Odoo integration user setup — per handoff checklist',
  'Spike: Pipedrive field mapping — before Sales Phase 2',
]

export default function TeamCostsPage() {
  return (
    <>
      <TeamPageHero
        eyebrow="docs/architecture/operating-costs.md"
        title="Operating costs (internal)"
        lead="Vendor pass-through + client allowance columns. Stakeholder site shows client-facing tiers only (1.5× on vendor midpoints)."
      />

      <section className="team-section">
        <div className="team-section__inner">
          <Reveal>
            <p className="team-section__intro">{markupNote}</p>
          </Reveal>
          <div className="team-card-grid">
            {internalCostRollups.map((r, i) => (
              <Reveal key={r.stage} delay={i * 50} className="team-card">
                <h3>{r.stage}</h3>
                <p>
                  Vendor: <strong>{r.vendor}</strong>
                </p>
                <p>
                  Client allowance (doc): <strong>{r.client}</strong>
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="team-section team-section--paper">
        <div className="team-section__inner">
          <Reveal>
            <h2 className="team-section__title">Line items (USD / month)</h2>
          </Reveal>
          <div className="team-table-wrap">
            <table className="team-table">
              <thead>
                <tr>
                  <th>Service</th>
                  <th>MVP vendor</th>
                  <th>MVP client</th>
                  <th>Prod vendor</th>
                  <th>Prod client</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {internalCostRows.map((row) => (
                  <tr key={row.service}>
                    <td>{row.service}</td>
                    <td>{row.mvpVendor}</td>
                    <td>{row.mvpClient}</td>
                    <td>{row.prodVendor}</td>
                    <td>{row.prodClient}</td>
                    <td>{row.notes}</td>
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
            <h2 className="team-section__title">Unknowns & one-time</h2>
          </Reveal>
          <div className="team-card-grid">
            <div className="team-card">
              <h3>Unknowns</h3>
              <ul style={{ margin: 0, paddingLeft: '1rem', fontSize: '0.85rem', color: 'var(--team-muted)' }}>
                {unknowns.map((u) => (
                  <li key={u}>{u}</li>
                ))}
              </ul>
            </div>
            <div className="team-card">
              <h3>One-time / episodic</h3>
              <ul style={{ margin: 0, paddingLeft: '1rem', fontSize: '0.85rem', color: 'var(--team-muted)' }}>
                {oneTime.map((o) => (
                  <li key={o}>{o}</li>
                ))}
              </ul>
            </div>
          </div>
          <p style={{ marginTop: '1.5rem' }}>
            <Link href="/" className="team-btn team-btn--ghost">
              Client overview (public) →
            </Link>
            <span style={{ margin: '0 0.5rem', opacity: 0.3 }}>|</span>
            <Link href="/team" className="team-btn">
              Team hub
            </Link>
          </p>
        </div>
      </section>
    </>
  )
}
