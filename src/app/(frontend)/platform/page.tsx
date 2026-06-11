'use client'

import Link from 'next/link'
import React from 'react'

import { OeeBar, PlatformShell, StatusBadge } from '@/components/platform-demo/PlatformShell'
import {
  employees,
  financeReports,
  machines,
  maintenanceJobs,
  salesReps,
  spdProjects,
  formatCurrency,
  formatPct,
  oeeColor,
} from '@/lib/platform-demo/mock-data'

export default function PlatformDashboardPage() {
  const running = machines.filter((m) => m.status === 'running').length
  const stopped = machines.filter((m) => m.status === 'stopped').length
  const avgOee = machines.reduce((s, m) => s + m.oee, 0) / machines.length
  const criticalMaint = maintenanceJobs.filter((j) => j.priority === 'critical' || j.priority === 'high').length
  const salesGap = salesReps.reduce((s, r) => s + (r.target - r.actual), 0)
  const hrPending = employees.filter((e) => e.contractStatus !== 'approved').length
  const spdBehind = spdProjects.filter((p) => p.status === 'behind' || p.status === 'at_risk').length

  const topMachines = [...machines].sort((a, b) => b.oee - a.oee).slice(0, 3)
  const bottomMachines = [...machines].sort((a, b) => a.oee - b.oee).slice(0, 3)

  return (
    <PlatformShell
      title="Command Centre"
      subtitle="Unified view across Manufacturing · Finance · HR · Sales · SPD · Maintenance"
      actions={
        <Link href="/platform/manufacturing/tv" className="p-btn p-btn--secondary p-btn--sm">
          TV Display Mode
        </Link>
      }
    >
      <div className="p-alert p-alert--info">
        <span>◎</span>
        <span>
          <strong>Unified platform demo</strong> — all modules share Employee ID, machine registry, and
          company structure. Click any module in the sidebar to explore.
        </span>
      </div>

      <div className="p-stats">
        <div className="p-stat p-stat--good">
          <div className="p-stat__label">Machines Running</div>
          <div className="p-stat__value">{running}</div>
          <div className="p-stat__sub">of {machines.length} total · {stopped} stopped</div>
        </div>
        <div className="p-stat p-stat--accent">
          <div className="p-stat__label">Group OEE</div>
          <div className="p-stat__value">{formatPct(avgOee)}</div>
          <div className="p-stat__sub">Benchmark 70%</div>
        </div>
        <div className="p-stat p-stat--warn">
          <div className="p-stat__label">Open Maintenance</div>
          <div className="p-stat__value">{maintenanceJobs.filter((j) => j.status !== 'complete').length}</div>
          <div className="p-stat__sub">{criticalMaint} high priority</div>
        </div>
        <div className="p-stat p-stat--bad">
          <div className="p-stat__label">Sales Gap</div>
          <div className="p-stat__value">{formatCurrency(salesGap)}</div>
          <div className="p-stat__sub">Target vs actual MTD</div>
        </div>
        <div className="p-stat">
          <div className="p-stat__label">SPD Projects</div>
          <div className="p-stat__value">{spdProjects.filter((p) => p.status !== 'complete').length}</div>
          <div className="p-stat__sub">{spdBehind} behind or at risk</div>
        </div>
        <div className="p-stat">
          <div className="p-stat__label">HR Actions</div>
          <div className="p-stat__value">{hrPending}</div>
          <div className="p-stat__sub">Contracts pending approval</div>
        </div>
      </div>

      <div className="p-grid-2">
        <div className="p-card">
          <div className="p-card__header">
            <h2>Manufacturing — Live Floor</h2>
            <Link href="/platform/manufacturing" className="p-btn p-btn--ghost p-btn--sm">
              View all →
            </Link>
          </div>
          <div className="p-card__body">
            <div className="p-grid-2" style={{ gap: 12 }}>
              <div>
                <h3 className="p-section-title" style={{ fontSize: '0.85rem' }}>
                  Top Performers
                </h3>
                {topMachines.map((m, i) => (
                  <div key={m.id} className="p-tv-rank" style={{ borderColor: 'var(--p-line)' }}>
                    <span className="p-tv-rank__pos p-tv-rank__pos--top">{i + 1}</span>
                    <div style={{ flex: 1 }}>
                      <strong>{m.code}</strong> — {m.product}
                      <OeeBar value={m.oee} />
                    </div>
                    <strong>{formatPct(m.oee)}</strong>
                  </div>
                ))}
              </div>
              <div>
                <h3 className="p-section-title" style={{ fontSize: '0.85rem' }}>
                  Needs Attention
                </h3>
                {bottomMachines.map((m, i) => (
                  <div key={m.id} className="p-tv-rank" style={{ borderColor: 'var(--p-line)' }}>
                    <span className="p-tv-rank__pos p-tv-rank__pos--bottom">{i + 1}</span>
                    <div style={{ flex: 1 }}>
                      <strong>{m.code}</strong> — <StatusBadge status={m.status} />
                      <OeeBar value={m.oee} />
                    </div>
                    <strong>{formatPct(m.oee)}</strong>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="p-card">
          <div className="p-card__header">
            <h2>Ecosystem Connections</h2>
          </div>
          <div className="p-card__body">
            <div className="p-table-wrap">
              <table className="p-table">
                <thead>
                  <tr>
                    <th>Source</th>
                    <th>Data Flow</th>
                    <th>Destination</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Manufacturing</td>
                    <td>Operator scores, OEE, rejects</td>
                    <td>
                      HR <span className="p-employee-link">via Employee ID</span>
                    </td>
                  </tr>
                  <tr>
                    <td>Manufacturing</td>
                    <td>Shot count ≥ 20,000</td>
                    <td>Maintenance service trigger</td>
                  </tr>
                  <tr>
                    <td>Manufacturing</td>
                    <td>Machine stopped event</td>
                    <td>Maintenance + notifications</td>
                  </tr>
                  <tr>
                    <td>Odoo</td>
                    <td>Financial actuals</td>
                    <td>Finance reports + Sales actuals</td>
                  </tr>
                  <tr>
                    <td>Pipedrive</td>
                    <td>Targets, pipeline, Hunt/Care</td>
                    <td>Sales Performance</td>
                  </tr>
                  <tr>
                    <td>SPD</td>
                    <td>Tooling assets</td>
                    <td>Manufacturing mould registry</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div className="p-grid-3 p-mt">
        <ModuleSummaryCard
          title="Finance"
          href="/platform/finance"
          stat={financeReports.filter((r) => r.status === 'ready').length + ' reports ready'}
          detail="Next scheduled delivery: 12th of month"
        />
        <ModuleSummaryCard
          title="Human Resources"
          href="/platform/hr"
          stat={`${employees.length} employees`}
          detail="Q2 reviews · 1-on-1 scorecards active"
        />
        <ModuleSummaryCard
          title="Sales Performance"
          href="/platform/sales"
          stat="Target vs Planned vs Actual"
          detail={`${salesReps.filter((r) => r.actual < r.target).length} reps below target`}
        />
        <ModuleSummaryCard
          title="Product Development"
          href="/platform/spd"
          stat={`${spdProjects.length} active projects`}
          detail="6-phase waterfall · 5 gates"
        />
        <ModuleSummaryCard
          title="Maintenance"
          href="/platform/maintenance"
          stat={`${maintenanceJobs.filter((j) => j.status !== 'complete').length} open jobs`}
          detail="Replaces Fix app · PO attachments"
        />
        <ModuleSummaryCard
          title="Operator Input"
          href="/platform/manufacturing/operator"
          stat="Tablet optimised"
          detail="Identity · dual OEE · offline sync"
        />
      </div>
    </PlatformShell>
  )
}

function ModuleSummaryCard({
  title,
  href,
  stat,
  detail,
}: {
  title: string
  href: string
  stat: string
  detail: string
}) {
  return (
    <Link href={href} className="p-card" style={{ display: 'block', transition: 'border-color 0.15s' }}>
      <div className="p-card__body">
        <h3 className="p-section-title">{title}</h3>
        <div className="p-stat__value" style={{ fontSize: '1.1rem', marginBottom: 6 }}>
          {stat}
        </div>
        <div className="p-stat__sub">{detail}</div>
      </div>
    </Link>
  )
}
