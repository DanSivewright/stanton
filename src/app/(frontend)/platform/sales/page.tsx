'use client'

import React, { useState } from 'react'

import { PlatformShell } from '@/components/platform-demo/PlatformShell'
import { salesReps, formatCurrency } from '@/lib/platform-demo/mock-data'

export default function SalesPage() {
  const [level, setLevel] = useState<'rep' | 'team' | 'department' | 'business'>('rep')
  const [phase, setPhase] = useState<'full' | 'pipedrive'>('full')

  const totalTarget = salesReps.reduce((s, r) => s + r.target, 0)
  const totalPlanned = salesReps.reduce((s, r) => s + r.planned, 0)
  const totalActual = phase === 'full' ? salesReps.reduce((s, r) => s + r.actual, 0) : 0

  const teams = [...new Set(salesReps.map((r) => r.team))]
  const departments = [...new Set(salesReps.map((r) => r.department))]

  return (
    <PlatformShell
      title="Sales Performance"
      subtitle="Target vs Planned vs Actual · Pipedrive + Odoo"
      actions={
        <div className="p-view-toggle">
          <button type="button" className={phase === 'pipedrive' ? 'is-active' : ''} onClick={() => setPhase('pipedrive')}>
            Phase 1 — Pipedrive
          </button>
          <button type="button" className={phase === 'full' ? 'is-active' : ''} onClick={() => setPhase('full')}>
            Phase 2 — + Odoo Actuals
          </button>
        </div>
      }
    >
      <div className="p-stats">
        <div className="p-stat p-stat--accent">
          <div className="p-stat__label">Monthly Target</div>
          <div className="p-stat__value">{formatCurrency(totalTarget)}</div>
        </div>
        <div className="p-stat">
          <div className="p-stat__label">Planned Pipeline</div>
          <div className="p-stat__value">{formatCurrency(totalPlanned)}</div>
          <div className="p-stat__sub">{(((totalPlanned - totalTarget) / totalTarget) * 100).toFixed(1)}% vs target</div>
        </div>
        {phase === 'full' && (
          <div className="p-stat p-stat--bad">
            <div className="p-stat__label">Actual (Odoo)</div>
            <div className="p-stat__value">{formatCurrency(totalActual)}</div>
            <div className="p-stat__sub">Gap: {formatCurrency(totalTarget - totalActual)}</div>
          </div>
        )}
        <div className="p-stat p-stat--warn">
          <div className="p-stat__label">Reps Below Target</div>
          <div className="p-stat__value">{phase === 'full' ? salesReps.filter((r) => r.actual < r.target).length : '—'}</div>
        </div>
      </div>

      <div className="p-tabs">
        {[
          { id: 'rep', label: 'Sales Rep' },
          { id: 'team', label: 'Team' },
          { id: 'department', label: 'Department' },
          { id: 'business', label: 'Business-wide' },
        ].map((t) => (
          <button key={t.id} type="button" className={`p-tab ${level === t.id ? 'is-active' : ''}`} onClick={() => setLevel(t.id as typeof level)}>
            {t.label}
          </button>
        ))}
      </div>

      {level === 'rep' && (
        <div className="p-card">
          <div className="p-card__header"><h2>Individual Performance — Discrepancy per Rep</h2></div>
          <div className="p-table-wrap">
            <table className="p-table">
              <thead>
                <tr>
                  <th>Rep</th>
                  <th>Team</th>
                  <th>Target</th>
                  <th>Planned</th>
                  {phase === 'full' && <th>Actual</th>}
                  {phase === 'full' && <th>Discrepancy</th>}
                  <th>Hunt</th>
                  <th>Care Visits</th>
                  <th>Lead Conv.</th>
                </tr>
              </thead>
              <tbody>
                {salesReps.map((r) => {
                  const disc = r.actual - r.target
                  return (
                    <tr key={r.id} className={phase === 'full' && disc < 0 ? 'is-critical' : ''}>
                      <td><strong>{r.name}</strong></td>
                      <td>{r.team}</td>
                      <td>{formatCurrency(r.target)}</td>
                      <td>{formatCurrency(r.planned)}</td>
                      {phase === 'full' && <td>{formatCurrency(r.actual)}</td>}
                      {phase === 'full' && (
                        <td style={{ color: disc < 0 ? 'var(--p-bad)' : 'var(--p-good)', fontWeight: 600 }}>
                          {disc < 0 ? '' : '+'}{formatCurrency(disc)}
                        </td>
                      )}
                      <td>{r.huntActivities}/{r.huntTarget}</td>
                      <td style={{ color: r.careVisits < r.careTarget ? 'var(--p-warn)' : undefined }}>
                        {r.careVisits}/{r.careTarget}
                      </td>
                      <td style={{ color: r.leadConversion < 30 ? 'var(--p-warn)' : 'var(--p-good)' }}>
                        {r.leadConversion}%
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {level === 'team' && (
        <div className="p-grid-2">
          {teams.map((team) => {
            const reps = salesReps.filter((r) => r.team === team)
            const target = reps.reduce((s, r) => s + r.target, 0)
            const actual = reps.reduce((s, r) => s + r.actual, 0)
            return (
              <div key={team} className="p-card">
                <div className="p-card__header"><h2>{team} Team</h2></div>
                <div className="p-card__body">
                  <div className="p-stat"><div className="p-stat__label">Target</div><div className="p-stat__value" style={{ fontSize: '1.3rem' }}>{formatCurrency(target)}</div></div>
                  {phase === 'full' && (
                    <div className="p-stat p-mt"><div className="p-stat__label">Actual</div><div className="p-stat__value" style={{ fontSize: '1.3rem' }}>{formatCurrency(actual)}</div></div>
                  )}
                  <p style={{ fontSize: '0.85rem', marginTop: 12 }}>{reps.length} reps · {reps.map((r) => r.name.split(' ')[0]).join(', ')}</p>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {level === 'department' && (
        <div className="p-grid-2">
          {departments.map((dept) => {
            const reps = salesReps.filter((r) => r.department === dept)
            const target = reps.reduce((s, r) => s + r.target, 0)
            const actual = reps.reduce((s, r) => s + r.actual, 0)
            return (
              <div key={dept} className="p-stat p-stat--accent">
                <div className="p-stat__label">{dept}</div>
                <div className="p-stat__value" style={{ fontSize: '1.3rem' }}>{formatCurrency(target)}</div>
                {phase === 'full' && <div className="p-stat__sub">Actual: {formatCurrency(actual)}</div>}
              </div>
            )
          })}
        </div>
      )}

      {level === 'business' && (
        <div className="p-card">
          <div className="p-card__header"><h2>Business-wide — Monthly Target vs Forecast vs Actual</h2></div>
          <div className="p-card__body">
            <div className="p-chart-bars">
              <div className="p-chart-bar">
                <div className="p-chart-bar__col" style={{ height: '180px', background: 'var(--p-accent)' }} />
                <div className="p-chart-bar__label">Target</div>
              </div>
              <div className="p-chart-bar">
                <div className="p-chart-bar__col" style={{ height: `${(totalPlanned / totalTarget) * 180}px`, background: 'var(--p-teal)' }} />
                <div className="p-chart-bar__label">Planned</div>
              </div>
              {phase === 'full' && (
                <div className="p-chart-bar">
                  <div className="p-chart-bar__col" style={{ height: `${(totalActual / totalTarget) * 180}px`, background: 'var(--p-bad)' }} />
                  <div className="p-chart-bar__label">Actual</div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="p-grid-2 p-mt">
        <div className="p-card">
          <div className="p-card__header"><h2>KPA 1 — Hunt (Sales Targets)</h2></div>
          <div className="p-card__body">
            <ul style={{ margin: 0, paddingLeft: 20, fontSize: '0.9rem' }}>
              <li>Within 5% of annual target</li>
              <li>15% new business growth</li>
              <li>Forecast within 10%</li>
            </ul>
          </div>
        </div>
        <div className="p-card">
          <div className="p-card__header"><h2>KPA 2 — Care (Customer Care)</h2></div>
          <div className="p-card__body">
            <ul style={{ margin: 0, paddingLeft: 20, fontSize: '0.9rem' }}>
              <li>8 care visits per month</li>
              <li>30%+ lead conversion</li>
              <li>80% satisfaction surveys</li>
            </ul>
          </div>
        </div>
      </div>
    </PlatformShell>
  )
}
