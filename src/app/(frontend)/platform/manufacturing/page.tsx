'use client'

import Link from 'next/link'
import React, { useMemo, useState } from 'react'

import { OeeBar, PlatformShell, StatusBadge } from '@/components/platform-demo/PlatformShell'
import {
  machines,
  planningSnapshots,
  formatPct,
  oeeColor,
} from '@/lib/platform-demo/mock-data'

type Filter = 'all' | 'running' | 'critical'
type View = 'card' | 'table'

export default function ManufacturingPage() {
  const [filter, setFilter] = useState<Filter>('all')
  const [view, setView] = useState<View>('card')
  const [selectedMachine, setSelectedMachine] = useState<string | null>(null)

  const filtered = useMemo(() => {
    if (filter === 'running') return machines.filter((m) => m.status === 'running')
    if (filter === 'critical')
      return machines.filter((m) => m.oee < 60 || m.rejectRate > 2 || m.status === 'stopped')
    return machines
  }, [filter])

  const byFactory = useMemo(() => {
    const groups: Record<string, typeof machines> = {}
    for (const m of filtered) {
      if (!groups[m.factory]) groups[m.factory] = []
      groups[m.factory].push(m)
    }
    return groups
  }, [filtered])

  const selected = machines.find((m) => m.id === selectedMachine)

  return (
    <PlatformShell
      title="Manufacturing Dashboard"
      subtitle="3 factories · 40 machines · Real-time OEE and production"
      actions={
        <>
          <Link href="/platform/manufacturing/operator" className="p-btn p-btn--primary p-btn--sm">
            Operator Input
          </Link>
          <Link href="/platform/manufacturing/tv" className="p-btn p-btn--secondary p-btn--sm">
            TV Mode
          </Link>
        </>
      }
    >
      <div className="p-stats">
        <div className="p-stat p-stat--good">
          <div className="p-stat__label">Running</div>
          <div className="p-stat__value">{machines.filter((m) => m.status === 'running').length}</div>
        </div>
        <div className="p-stat p-stat--bad">
          <div className="p-stat__label">Stopped</div>
          <div className="p-stat__value">{machines.filter((m) => m.status === 'stopped').length}</div>
        </div>
        <div className="p-stat">
          <div className="p-stat__label">In Changeover</div>
          <div className="p-stat__value">{machines.filter((m) => m.status === 'changeover').length}</div>
        </div>
        <div className="p-stat p-stat--warn">
          <div className="p-stat__label">Mould Service Due</div>
          <div className="p-stat__value">{machines.filter((m) => m.shotServiceDue).length}</div>
        </div>
      </div>

      <div className="p-filters">
        <span className="p-filters__label">Filter:</span>
        {(['all', 'running', 'critical'] as const).map((f) => (
          <button
            key={f}
            type="button"
            className={`p-btn p-btn--secondary p-btn--sm ${filter === f ? 'is-active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f === 'all' ? 'All' : f === 'running' ? 'Running only' : 'Critical only'}
          </button>
        ))}
        <span style={{ flex: 1 }} />
        <div className="p-view-toggle">
          <button type="button" className={view === 'card' ? 'is-active' : ''} onClick={() => setView('card')}>
            Cards
          </button>
          <button type="button" className={view === 'table' ? 'is-active' : ''} onClick={() => setView('table')}>
            Table
          </button>
        </div>
        <Link href="/platform/manufacturing/tool-change" className="p-btn p-btn--secondary p-btn--sm">
          Tool Change Flow
        </Link>
      </div>

      {view === 'card' ? (
        Object.entries(byFactory).map(([factory, list]) => (
          <div key={factory} className="p-factory-group">
            <div className="p-factory-group__title">{factory}</div>
            <div className="p-machine-grid">
              {list.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  className="p-machine-card"
                  style={{ textAlign: 'left', width: '100%' }}
                  onClick={() => setSelectedMachine(m.id)}
                >
                  <div className="p-machine-card__top">
                    <div>
                      <div className="p-machine-card__code">{m.code}</div>
                      <div className="p-machine-card__product">
                        {m.stockCode} · {m.product}
                      </div>
                    </div>
                    <StatusBadge status={m.status} />
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--p-muted)' }}>
                    OEE <strong style={{ color: `var(--p-${oeeColor(m.oee) === 'good' ? 'good' : oeeColor(m.oee) === 'warn' ? 'warn' : 'bad'})` }}>{formatPct(m.oee)}</strong>
                  </div>
                  <OeeBar value={m.oee} />
                  <dl className="p-machine-card__metrics">
                    <dt>Units/hr</dt>
                    <dd>{m.unitsPerHour} / {m.targetUnitsPerHour}</dd>
                    <dt>Cycle</dt>
                    <dd>{m.actualCycle}s (var {(((m.actualCycle - m.plannedCycle) / m.plannedCycle) * 100).toFixed(0)}%)</dd>
                    <dt>MO</dt>
                    <dd>{m.mo}</dd>
                    <dt>Rejects</dt>
                    <dd style={{ color: m.rejectRate > 2 ? 'var(--p-bad)' : undefined }}>{formatPct(m.rejectRate)}</dd>
                  </dl>
                  {m.shotWarning && (
                    <div className="p-alert p-alert--warn" style={{ marginTop: 10, marginBottom: 0, padding: '8px 10px', fontSize: '0.75rem' }}>
                      Mould shots: {m.shotCount.toLocaleString()}
                      {m.shotServiceDue ? ' — SERVICE DUE' : ' — warning threshold'}
                    </div>
                  )}
                  {m.operator && (
                    <div style={{ marginTop: 8, fontSize: '0.72rem' }}>
                      <span className="p-employee-link">{m.employeeId}</span> · {m.operator}
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        ))
      ) : (
        <div className="p-card">
          <div className="p-table-wrap">
            <table className="p-table">
              <thead>
                <tr>
                  <th>Machine</th>
                  <th>Factory</th>
                  <th>Status</th>
                  <th>Product</th>
                  <th>OEE</th>
                  <th>Units/hr</th>
                  <th>Cycle Var</th>
                  <th>Rejects</th>
                  <th>Operator</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((m) => (
                  <tr
                    key={m.id}
                    className={m.oee < 60 || m.status === 'stopped' ? 'is-critical' : ''}
                    style={{ cursor: 'pointer' }}
                    onClick={() => setSelectedMachine(m.id)}
                  >
                    <td><strong>{m.code}</strong></td>
                    <td>{m.factory.replace('Factory ', '').split(' —')[0]}</td>
                    <td><StatusBadge status={m.status} /></td>
                    <td>{m.stockCode}</td>
                    <td>{formatPct(m.oee)}</td>
                    <td>{m.unitsPerHour}</td>
                    <td>{(((m.actualCycle - m.plannedCycle) / m.plannedCycle) * 100).toFixed(0)}%</td>
                    <td style={{ color: m.rejectRate > 2 ? 'var(--p-bad)' : undefined }}>{formatPct(m.rejectRate)}</td>
                    <td>{m.employeeId ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="p-card p-mt">
        <div className="p-card__header">
          <h2>Planning & Scheduling</h2>
          <button type="button" className="p-btn p-btn--primary p-btn--sm" onClick={() => alert('Demo: Excel planning sheet uploaded — dashboard refreshed in 3 seconds')}>
            Upload Planning Sheet
          </button>
        </div>
        <div className="p-card__body">
          <p className="p-section-intro">
            Static product display per machine (Stock Code + Product Name). Planned changeovers show as
            &quot;In Changeover&quot; — excluded from downtime alerts.
          </p>
          <div className="p-table-wrap">
            <table className="p-table">
              <thead>
                <tr>
                  <th>Snapshot</th>
                  <th>Uploaded By</th>
                  <th>Machines</th>
                  <th>Changes</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {planningSnapshots.map((s) => (
                  <tr key={s.id}>
                    <td>{s.date}</td>
                    <td>{s.uploadedBy}</td>
                    <td>{s.machines}</td>
                    <td>{s.changes}</td>
                    <td>
                      <button type="button" className="p-btn p-btn--ghost p-btn--sm" onClick={() => alert('Demo: Viewing planning snapshot archive')}>
                        Compare
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {selected && (
        <div className="p-modal-overlay" onClick={() => setSelectedMachine(null)}>
          <div className="p-modal" onClick={(e) => e.stopPropagation()}>
            <div className="p-modal__header">
              <h2>{selected.code} — {selected.product}</h2>
              <button type="button" className="p-btn p-btn--ghost" onClick={() => setSelectedMachine(null)}>✕</button>
            </div>
            <div className="p-modal__body">
              <StatusBadge status={selected.status} />
              <div className="p-stats" style={{ marginTop: 16 }}>
                <div className="p-stat"><div className="p-stat__label">OEE</div><div className="p-stat__value">{formatPct(selected.oee)}</div></div>
                <div className="p-stat"><div className="p-stat__label">Units/hr</div><div className="p-stat__value">{selected.unitsPerHour}</div></div>
              </div>
              <p><strong>MO:</strong> {selected.mo}</p>
              <p><strong>Mould shots:</strong> {selected.shotCount.toLocaleString()}</p>
              {selected.stoppageReason && <div className="p-alert p-alert--danger">{selected.stoppageReason}</div>}
              <div className="p-modal__footer" style={{ border: 'none', padding: '16px 0 0' }}>
                <Link href="/platform/manufacturing/operator" className="p-btn p-btn--primary">Log Production</Link>
                <Link href="/platform/maintenance" className="p-btn p-btn--secondary">View Maintenance</Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </PlatformShell>
  )
}
