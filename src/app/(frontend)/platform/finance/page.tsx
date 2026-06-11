'use client'

import React, { useState } from 'react'

import { PlatformShell, StatusBadge } from '@/components/platform-demo/PlatformShell'
import { financeReports, companies, formatCurrency } from '@/lib/platform-demo/mock-data'

const profitabilityData = [
  { label: 'Revenue', current: 42.5, prior: 38.2, yoy: 39.1 },
  { label: 'Gross Profit', current: 18.3, prior: 16.1, yoy: 16.8 },
  { label: 'Net Profit', current: 6.2, prior: 5.1, yoy: 5.4 },
]

const debtorsBuckets = [
  { bucket: 'Current (0-30)', amount: 12400000, pct: 52 },
  { bucket: '31-60 days', amount: 4800000, pct: 20 },
  { bucket: '61-90 days', amount: 3200000, pct: 13 },
  { bucket: '91-120 days', amount: 1800000, pct: 8 },
  { bucket: '120+ days', amount: 1700000, pct: 7 },
]

export default function FinancePage() {
  const [company, setCompany] = useState('PIMMS Group JHB')
  const [period, setPeriod] = useState('2026-05')
  const [activeReport, setActiveReport] = useState('profitability')
  const [generating, setGenerating] = useState(false)

  function handleGenerate() {
    setGenerating(true)
    setTimeout(() => {
      setGenerating(false)
      alert('Demo: Board-pack PowerPoint generated — 9 slides ready for download')
    }, 1500)
  }

  return (
    <PlatformShell
      title="Financial Reporting"
      subtitle="Odoo-sourced · Auto-generated board packs · PIMMS Group + Stanton Global"
      actions={
        <button type="button" className="p-btn p-btn--primary p-btn--sm" onClick={handleGenerate} disabled={generating}>
          {generating ? 'Generating...' : 'Generate PowerPoint'}
        </button>
      }
    >
      <div className="p-grid-2 p-mb">
        <div className="p-form-group">
          <label>Company</label>
          <select className="p-select" value={company} onChange={(e) => setCompany(e.target.value)}>
            {companies.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div className="p-form-group">
          <label>Reporting Period</label>
          <select className="p-select" value={period} onChange={(e) => setPeriod(e.target.value)}>
            <option value="2026-05">May 2026</option>
            <option value="2026-04">April 2026</option>
            <option value="2026-03">March 2026</option>
            <option value="2026-w22">Week 22, 2026</option>
          </select>
        </div>
      </div>

      <div className="p-stats">
        <div className="p-stat p-stat--good">
          <div className="p-stat__label">Revenue MTD</div>
          <div className="p-stat__value">R 42.5M</div>
          <div className="p-stat__sub">+11.3% vs prior period</div>
        </div>
        <div className="p-stat p-stat--accent">
          <div className="p-stat__label">Gross Margin</div>
          <div className="p-stat__value">43.1%</div>
          <div className="p-stat__sub">Target 42%</div>
        </div>
        <div className="p-stat">
          <div className="p-stat__label">Wages % Revenue</div>
          <div className="p-stat__value">28.4%</div>
        </div>
        <div className="p-stat p-stat--warn">
          <div className="p-stat__label">Debtors 90+ Days</div>
          <div className="p-stat__value">R 3.5M</div>
          <div className="p-stat__sub">15% of total debtors</div>
        </div>
      </div>

      <div className="p-grid-2">
        <div className="p-card">
          <div className="p-card__header"><h2>Report Library</h2></div>
          <div className="p-card__body" style={{ padding: 0 }}>
            {financeReports.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => setActiveReport(r.id)}
                style={{
                  display: 'block',
                  width: '100%',
                  textAlign: 'left',
                  padding: '14px 20px',
                  border: 'none',
                  borderBottom: '1px solid var(--p-line)',
                  background: activeReport === r.id ? 'var(--p-accent-soft)' : 'transparent',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <strong>{r.name}</strong>
                  <StatusBadge status={r.status} />
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--p-muted)', marginTop: 4 }}>{r.description}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="p-card">
          <div className="p-card__header">
            <h2>{financeReports.find((r) => r.id === activeReport)?.name ?? 'Report Preview'}</h2>
            <button type="button" className="p-btn p-btn--secondary p-btn--sm" onClick={() => alert('Demo: PDF exported')}>
              Export PDF
            </button>
          </div>
          <div className="p-card__body">
            {activeReport === 'profitability' && (
              <>
                <p className="p-section-intro">Current vs prior period + same period last year (R millions)</p>
                <div className="p-chart-bars">
                  {profitabilityData.map((d) => (
                    <div key={d.label} className="p-chart-bar">
                      <div className="p-chart-bar__col" style={{ height: `${d.current * 4}px`, background: 'var(--p-accent)' }} title={`Current: R${d.current}M`} />
                      <div className="p-chart-bar__col" style={{ height: `${d.prior * 4}px`, background: 'var(--p-muted)', opacity: 0.5 }} title={`Prior: R${d.prior}M`} />
                      <div className="p-chart-bar__label">{d.label}</div>
                    </div>
                  ))}
                </div>
                <div className="p-table-wrap p-mt">
                  <table className="p-table">
                    <thead>
                      <tr><th>Metric</th><th>Current</th><th>Prior</th><th>YoY</th><th>Var %</th></tr>
                    </thead>
                    <tbody>
                      {profitabilityData.map((d) => (
                        <tr key={d.label}>
                          <td>{d.label}</td>
                          <td>R {d.current}M</td>
                          <td>R {d.prior}M</td>
                          <td>R {d.yoy}M</td>
                          <td style={{ color: 'var(--p-good)' }}>+{(((d.current - d.prior) / d.prior) * 100).toFixed(1)}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {activeReport === 'debtors' && (
              <>
                <p className="p-section-intro">Outstanding debtors by aging bucket — local entities only</p>
                {debtorsBuckets.map((b) => (
                  <div key={b.bucket} style={{ marginBottom: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: 4 }}>
                      <span>{b.bucket}</span>
                      <span>{formatCurrency(b.amount)} ({b.pct}%)</span>
                    </div>
                    <div className="p-progress">
                      <div className="p-progress__fill" style={{ width: `${b.pct}%`, background: b.pct > 20 ? 'var(--p-warn)' : 'var(--p-teal)' }} />
                    </div>
                  </div>
                ))}
              </>
            )}

            {activeReport === 'ratios' && (
              <div className="p-grid-2">
                {[
                  { name: 'Gross Margin %', value: '43.1%', bench: '42%' },
                  { name: 'Net Margin %', value: '14.6%', bench: '13%' },
                  { name: 'Current Ratio', value: '1.82', bench: '>1.5' },
                  { name: 'Quick Ratio', value: '1.24', bench: '>1.0' },
                  { name: 'Debt-to-Equity', value: '0.38', bench: '<0.5' },
                ].map((r) => (
                  <div key={r.name} className="p-stat">
                    <div className="p-stat__label">{r.name}</div>
                    <div className="p-stat__value" style={{ fontSize: '1.4rem' }}>{r.value}</div>
                    <div className="p-stat__sub">Benchmark {r.bench}</div>
                  </div>
                ))}
              </div>
            )}

            {!['profitability', 'debtors', 'ratios'].includes(activeReport) && (
              <div className="p-alert p-alert--info">
                Preview for <strong>{financeReports.find((r) => r.id === activeReport)?.name}</strong> — 
                auto-computed from Odoo XML-RPC. Click Generate PowerPoint for full board pack.
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="p-card p-mt">
        <div className="p-card__header"><h2>Scheduled Delivery</h2></div>
        <div className="p-card__body">
          <div className="p-table-wrap">
            <table className="p-table">
              <thead>
                <tr>
                  <th>Schedule</th>
                  <th>Recipients</th>
                  <th>Format</th>
                  <th>Next Run</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Monthly — 12th of month</td>
                  <td>Board (4) + Exco (6)</td>
                  <td>PowerPoint + PDF</td>
                  <td>12 Jun 2026</td>
                </tr>
                <tr>
                  <td>Weekly — Monday</td>
                  <td>Finance team (3)</td>
                  <td>PDF summary</td>
                  <td>16 Jun 2026</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </PlatformShell>
  )
}
