'use client'

import Link from 'next/link'
import React from 'react'

import { PlatformShell, StatusBadge } from '@/components/platform-demo/PlatformShell'
import { spdProjects, spdPhases } from '@/lib/platform-demo/mock-data'

export default function SpdPage() {
  const active = spdProjects.filter((p) => p.status !== 'complete')
  const behind = spdProjects.filter((p) => p.status === 'behind' || p.status === 'at_risk')

  return (
    <PlatformShell
      title="Stanton Product Development"
      subtitle="6 phases · 18 stages · 5 gates · Waterfall workflow"
      actions={
        <button type="button" className="p-btn p-btn--primary p-btn--sm" onClick={() => alert('Demo: New SPD project wizard')}>
          New Project
        </button>
      }
    >
      <div className="p-stats">
        <div className="p-stat"><div className="p-stat__label">Active Projects</div><div className="p-stat__value">{active.length}</div></div>
        <div className="p-stat p-stat--warn"><div className="p-stat__label">Behind / At Risk</div><div className="p-stat__value">{behind.length}</div></div>
        <div className="p-stat p-stat--good"><div className="p-stat__label">Avg Phase Duration</div><div className="p-stat__value">38d</div></div>
        <div className="p-stat"><div className="p-stat__label">Gates Pending</div><div className="p-stat__value">{spdProjects.filter((p) => p.gatePending).length}</div></div>
      </div>

      <div className="p-card p-mb">
        <div className="p-card__header"><h2>Process Overview</h2></div>
        <div className="p-card__body">
          <div className="p-phase-timeline">
            {spdPhases.map((ph) => (
              <div key={ph.num} className="p-phase-step is-complete">
                <div className="p-phase-step__bar" />
                <div className="p-phase-step__label">P{ph.num}<br />{ph.name.split(' ')[0]}</div>
              </div>
            ))}
          </div>
          <p style={{ fontSize: '0.85rem', color: 'var(--p-muted)', textAlign: 'center' }}>
            Phases lock until gate sign-off · Data hub collects once, generates 80% of documents automatically
          </p>
        </div>
      </div>

      <h2 className="p-section-title">Management Overview — All Open Projects</h2>
      <div className="p-table-wrap">
        <table className="p-table">
          <thead>
            <tr>
              <th>Project</th>
              <th>Client</th>
              <th>Phase</th>
              <th>Stage</th>
              <th>Status</th>
              <th>Progress</th>
              <th>PDM</th>
              <th>Gate</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {spdProjects.map((p) => (
              <tr key={p.id} className={p.status === 'behind' || p.status === 'at_risk' ? 'is-critical' : ''}>
                <td><strong>{p.name}</strong></td>
                <td>{p.client}</td>
                <td>P{p.phase} — {p.phaseName.split(' ')[0]}</td>
                <td style={{ fontSize: '0.8rem' }}>{p.stage}</td>
                <td><StatusBadge status={p.status} /></td>
                <td>
                  <div className="p-progress" style={{ width: 80, display: 'inline-block', verticalAlign: 'middle', marginRight: 8 }}>
                    <div className="p-progress__fill" style={{ width: `${p.progress}%` }} />
                  </div>
                  {p.progress}%
                </td>
                <td>{p.pdm}</td>
                <td style={{ fontSize: '0.78rem' }}>{p.gatePending ?? '—'}</td>
                <td>
                  <Link href={`/platform/spd/${p.id}`} className="p-btn p-btn--secondary p-btn--sm">
                    Open
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="p-grid-3 p-mt">
        <div className="p-card">
          <div className="p-card__header"><h3>Change Requests</h3></div>
          <div className="p-card__body">
            <p style={{ fontSize: '0.85rem' }}><strong>In-scope:</strong> Redo, no cost</p>
            <p style={{ fontSize: '0.85rem' }}><strong>Out-of-scope:</strong> Costed, re-scoped, client sign-off</p>
            <button type="button" className="p-btn p-btn--secondary p-btn--sm p-mt" onClick={() => alert('Demo: Change request form')}>
              New Change Request
            </button>
          </div>
        </div>
        <div className="p-card">
          <div className="p-card__header"><h3>Asset Library</h3></div>
          <div className="p-card__body">
            <p style={{ fontSize: '0.85rem' }}>Every project = tooling asset with full version history including all CRs.</p>
            <Link href="/platform/manufacturing" className="p-btn p-btn--ghost p-btn--sm">→ Manufacturing moulds</Link>
          </div>
        </div>
        <div className="p-card">
          <div className="p-card__header"><h3>Client Forms</h3></div>
          <div className="p-card__body">
            <p style={{ fontSize: '0.85rem' }}>Select forms sent externally. Client submits back into platform.</p>
            <button type="button" className="p-btn p-btn--secondary p-btn--sm" onClick={() => alert('Demo: Client form sent')}>
              Send Form
            </button>
          </div>
        </div>
      </div>
    </PlatformShell>
  )
}
