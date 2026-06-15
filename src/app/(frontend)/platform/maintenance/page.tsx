'use client'

import Link from 'next/link'
import React, { useState } from 'react'

import { PlatformShell, StatusBadge } from '@/components/platform-demo/PlatformShell'
import { maintenanceJobs, machines } from '@/lib/platform-demo/mock-data'

export default function MaintenancePage() {
  const [tab, setTab] = useState<'jobs' | 'history' | 'pos'>('jobs')
  const [showPoModal, setShowPoModal] = useState(false)

  const openJobs = maintenanceJobs.filter((j) => j.status !== 'complete')

  return (
    <PlatformShell
      title="Machine Maintenance"
      subtitle="Replaces Fix · Integrated with Manufacturing shot counts"
      actions={
        <Link href="/platform/manufacturing" className="p-btn p-btn--ghost p-btn--sm">
          ← Manufacturing
        </Link>
      }
    >
      <div className="p-alert p-alert--info">
        Shot count from Manufacturing triggers service at <strong>20,000 shots</strong>. Warning at 15,000.
        Machine stopped events create maintenance jobs automatically.
      </div>

      <div className="p-stats">
        <div className="p-stat p-stat--bad">
          <div className="p-stat__label">Open Jobs</div>
          <div className="p-stat__value">{openJobs.length}</div>
        </div>
        <div className="p-stat p-stat--warn">
          <div className="p-stat__label">Shot Threshold</div>
          <div className="p-stat__value">{maintenanceJobs.filter((j) => j.type === 'shot_threshold').length}</div>
        </div>
        <div className="p-stat">
          <div className="p-stat__label">Machines Monitored</div>
          <div className="p-stat__value">{machines.length}</div>
        </div>
        <div className="p-stat p-stat--good">
          <div className="p-stat__label">Completed (30d)</div>
          <div className="p-stat__value">{maintenanceJobs.filter((j) => j.status === 'complete').length}</div>
        </div>
      </div>

      <div className="p-tabs">
        {[
          { id: 'jobs', label: 'Active Jobs' },
          { id: 'history', label: 'Service History' },
          { id: 'pos', label: 'Purchase Orders' },
        ].map((t) => (
          <button key={t.id} type="button" className={`p-tab ${tab === t.id ? 'is-active' : ''}`} onClick={() => setTab(t.id as typeof tab)}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'jobs' && (
        <>
          {maintenanceJobs.filter((j) => j.priority === 'critical').map((j) => (
            <div key={j.id} className="p-alert p-alert--danger">
              <strong>{j.machineCode}</strong> — {j.notes}
              <button type="button" className="p-btn p-btn--danger p-btn--sm" style={{ marginLeft: 'auto' }} onClick={() => alert('Demo: Notification chain activated — Line Manager → Maintenance Lead → Production Manager')}>
                Notify Chain
              </button>
            </div>
          ))}

          <div className="p-card">
            <div className="p-card__header">
              <h2>Maintenance Jobs</h2>
              <button type="button" className="p-btn p-btn--primary p-btn--sm" onClick={() => alert('Demo: New maintenance job created')}>
                New Job
              </button>
            </div>
            <div className="p-table-wrap">
              <table className="p-table">
                <thead>
                  <tr>
                    <th>Job</th>
                    <th>Machine</th>
                    <th>Type</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Technician</th>
                    <th>Opened</th>
                    <th>Shots</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {maintenanceJobs.map((j) => (
                    <tr key={j.id} className={j.priority === 'critical' ? 'is-critical' : ''}>
                      <td>{j.id.toUpperCase()}</td>
                      <td><strong>{j.machineCode}</strong></td>
                      <td>{j.type.replace('_', ' ')}</td>
                      <td><StatusBadge status={j.priority} /></td>
                      <td><StatusBadge status={j.status} /></td>
                      <td>{j.technician ?? '—'}</td>
                      <td>{j.openedAt}</td>
                      <td>{j.shotCount?.toLocaleString() ?? '—'}</td>
                      <td>
                        <button type="button" className="p-btn p-btn--secondary p-btn--sm" onClick={() => alert(`Demo: Logging service for ${j.machineCode}`)}>
                          Log Service
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {tab === 'history' && (
        <div className="p-card">
          <div className="p-card__header"><h2>Service History per Machine</h2></div>
          <div className="p-card__body">
            {machines.filter((m) => m.shotWarning).slice(0, 6).map((m) => (
              <div key={m.id} style={{ marginBottom: 20, paddingBottom: 20, borderBottom: '1px solid var(--p-line)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <strong>{m.code}</strong>
                  <span>Mould shots: {m.shotCount.toLocaleString()}</span>
                </div>
                <div className="p-table-wrap">
                  <table className="p-table">
                    <thead>
                      <tr><th>Date</th><th>Technician</th><th>Parts</th><th>Duration</th><th>Notes</th></tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>2026-06-08</td>
                        <td>Sipho Ndlovu</td>
                        <td>Seal kit, heater band</td>
                        <td>4.5 hrs</td>
                        <td>Scheduled service at 20,000 shots — counter reset</td>
                      </tr>
                      <tr>
                        <td>2026-03-15</td>
                        <td>Andre Fourie</td>
                        <td>Hydraulic filter</td>
                        <td>2 hrs</td>
                        <td>Preventive maintenance</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 'pos' && (
        <div className="p-card">
          <div className="p-card__header">
            <h2>Purchase Orders</h2>
            <button type="button" className="p-btn p-btn--primary p-btn--sm" onClick={() => setShowPoModal(true)}>
              Attach PO
            </button>
          </div>
          <div className="p-card__body">
            <p className="p-section-intro">Simple PO attachment to machine + job. No inventory management.</p>
            <div className="p-table-wrap">
              <table className="p-table">
                <thead>
                  <tr><th>PO Number</th><th>Machine</th><th>Job</th><th>Parts</th><th>Amount</th><th>Status</th></tr>
                </thead>
                <tbody>
                  <tr>
                    <td>PO-8842</td>
                    <td>IM-35</td>
                    <td>MJ5</td>
                    <td>Barrel heater assembly</td>
                    <td>R 12,400</td>
                    <td><StatusBadge status="open" /></td>
                  </tr>
                  <tr>
                    <td>PO-8831</td>
                    <td>IM-07</td>
                    <td>MJ2</td>
                    <td>Mould service kit CL-500</td>
                    <td>R 8,750</td>
                    <td><StatusBadge status="in_progress" /></td>
                  </tr>
                  <tr>
                    <td>PO-8819</td>
                    <td>IM-03</td>
                    <td>MJ4</td>
                    <td>Seal kit, ejector pins</td>
                    <td>R 4,200</td>
                    <td><StatusBadge status="complete" /></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {showPoModal && (
        <div className="p-modal-overlay" onClick={() => setShowPoModal(false)}>
          <div className="p-modal" onClick={(e) => e.stopPropagation()}>
            <div className="p-modal__header">
              <h2>Attach Purchase Order</h2>
              <button type="button" className="p-btn p-btn--ghost" onClick={() => setShowPoModal(false)}>✕</button>
            </div>
            <div className="p-modal__body">
              <div className="p-form-group">
                <label>Machine</label>
                <select className="p-select">
                  {machines.map((m) => <option key={m.id}>{m.code}</option>)}
                </select>
              </div>
              <div className="p-form-group">
                <label>PO Number</label>
                <input className="p-input" placeholder="PO-XXXX" />
              </div>
              <div className="p-form-group">
                <label>Upload PO Document</label>
                <div className="p-upload-zone" onClick={() => alert('Demo: PO document attached')}>
                  Click to upload PDF
                </div>
              </div>
            </div>
            <div className="p-modal__footer">
              <button type="button" className="p-btn p-btn--secondary" onClick={() => setShowPoModal(false)}>Cancel</button>
              <button type="button" className="p-btn p-btn--primary" onClick={() => { setShowPoModal(false); alert('Demo: PO attached to machine and job') }}>Attach</button>
            </div>
          </div>
        </div>
      )}
    </PlatformShell>
  )
}
