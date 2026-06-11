'use client'

import Link from 'next/link'
import React, { useState } from 'react'

import { PlatformShell, StatusBadge } from '@/components/platform-demo/PlatformShell'
import { employees, companies } from '@/lib/platform-demo/mock-data'

export default function HrPage() {
  const [tab, setTab] = useState<'dashboard' | 'contracts' | 'reviews' | 'oneonone' | 'organogram'>('dashboard')
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null)

  const approved = employees.filter((e) => e.contractStatus === 'approved').length
  const reviewDue = employees.filter((e) => new Date(e.reviewDue) < new Date('2026-07-15')).length

  return (
    <PlatformShell
      title="Human Resources"
      subtitle="Central node · Employee ID links all platforms · ~300 employees"
      actions={
        <button type="button" className="p-btn p-btn--primary p-btn--sm" onClick={() => alert('Demo: AI contract generation started')}>
          Generate Contract
        </button>
      }
    >
      <div className="p-alert p-alert--info">
        Manufacturing floor scores (Accuracy + Runs) flow here via <span className="p-employee-link">Employee ID</span> — 
        forming part of quarterly composite KPI score.
      </div>

      <div className="p-tabs">
        {[
          { id: 'dashboard', label: 'Employee Dashboard' },
          { id: 'contracts', label: 'Contracts' },
          { id: 'reviews', label: 'Quarterly Reviews' },
          { id: 'oneonone', label: '1-on-1 Scorecards' },
          { id: 'organogram', label: 'Organogram' },
        ].map((t) => (
          <button key={t.id} type="button" className={`p-tab ${tab === t.id ? 'is-active' : ''}`} onClick={() => setTab(t.id as typeof tab)}>
            {t.label}
          </button>
        ))}
      </div>

      {tab === 'dashboard' && (
        <>
          <div className="p-stats">
            <div className="p-stat"><div className="p-stat__label">Total Employees</div><div className="p-stat__value">~300</div></div>
            <div className="p-stat p-stat--good"><div className="p-stat__label">Contracts Approved</div><div className="p-stat__value">{approved}</div></div>
            <div className="p-stat p-stat--warn"><div className="p-stat__label">Reviews Due</div><div className="p-stat__value">{reviewDue}</div></div>
            <div className="p-stat"><div className="p-stat__label">Companies</div><div className="p-stat__value">{companies.length}</div></div>
          </div>

          <div className="p-card">
            <div className="p-card__header"><h2>Employee Status</h2></div>
            <div className="p-table-wrap">
              <table className="p-table">
                <thead>
                  <tr>
                    <th>Employee ID</th>
                    <th>Name</th>
                    <th>Company</th>
                    <th>Department</th>
                    <th>Contract</th>
                    <th>Review Due</th>
                    <th>Mfg Scores</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((e) => (
                    <tr key={e.id} style={{ cursor: 'pointer' }} onClick={() => setSelectedEmployee(e.id)}>
                      <td><span className="p-employee-link">{e.employeeId}</span></td>
                      <td>{e.firstName} {e.surname}</td>
                      <td>{e.company}</td>
                      <td>{e.department}</td>
                      <td><StatusBadge status={e.contractStatus} /></td>
                      <td>{e.reviewDue}</td>
                      <td>Acc {e.accuracyScore} · Runs {e.runsScore}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {tab === 'contracts' && (
        <div className="p-card">
          <div className="p-card__header"><h2>AI-Assisted Contract Generation</h2></div>
          <div className="p-card__body">
            <div className="p-form-group">
              <label>Select Employee</label>
              <select className="p-select">
                {employees.map((e) => (
                  <option key={e.id}>{e.firstName} {e.surname} — {e.role}</option>
                ))}
              </select>
            </div>
            <div className="p-form-group">
              <label>Company Branding</label>
              <select className="p-select">
                {companies.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--p-muted)' }}>
              Generates branded DOCX performance contract + matching XLSX scorecard. Auto-files to SharePoint on approval.
            </p>
            <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
              <button type="button" className="p-btn p-btn--primary" onClick={() => alert('Demo: Contract draft generated')}>Generate Draft</button>
              <button type="button" className="p-btn p-btn--secondary" onClick={() => alert('Demo: Scorecard generated')}>Generate Scorecard</button>
            </div>
            <div className="p-mt">
              <h3 className="p-section-title">Workflow Status</h3>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {['draft', 'submitted', 'approved', 'rejected', 'needs_changes'].map((s) => (
                  <StatusBadge key={s} status={s} />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === 'reviews' && (
        <div className="p-card">
          <div className="p-card__header">
            <h2>Q2 2026 Quarterly Reviews</h2>
            <button type="button" className="p-btn p-btn--secondary p-btn--sm" onClick={() => alert('Demo: Notification sent to all managers')}>
              Notify Managers
            </button>
          </div>
          <div className="p-card__body">
            <div className="p-stats">
              <div className="p-stat p-stat--good"><div className="p-stat__label">Submitted</div><div className="p-stat__value">4</div></div>
              <div className="p-stat p-stat--warn"><div className="p-stat__label">Pending</div><div className="p-stat__value">4</div></div>
              <div className="p-stat"><div className="p-stat__label">Completion</div><div className="p-stat__value">50%</div></div>
            </div>
            <div className="p-form-group p-mt">
              <label>Sample Review — Thabo Molefe</label>
              <div className="p-card" style={{ boxShadow: 'none' }}>
                <div className="p-card__body">
                  <p><strong>KPI Scoring:</strong> 1 / 2 / 3 per KPI · Weighted totals calculated automatically</p>
                  <div className="p-grid-3" style={{ marginTop: 12 }}>
                    {['Production output', 'Quality compliance', 'Safety adherence', 'Team collaboration'].map((kpi, i) => (
                      <div key={kpi} className="p-form-group">
                        <label>{kpi}</label>
                        <select className="p-select" defaultValue={i < 3 ? '3' : '2'}>
                          <option value="1">1 — Below</option>
                          <option value="2">2 — Meets</option>
                          <option value="3">3 — Exceeds</option>
                        </select>
                      </div>
                    ))}
                  </div>
                  <div className="p-form-group p-mt">
                    <label>AI Performance Summary</label>
                    <textarea className="p-textarea" readOnly defaultValue="Thabo consistently exceeds production targets with strong quality metrics. Manufacturing 1-on-1 scores (Accuracy 4.2, Runs 3.8) support a high performance rating. Recommended development: advanced setter certification." />
                  </div>
                  <button type="button" className="p-btn p-btn--primary" onClick={() => alert('Demo: Review submitted and filed to SharePoint')}>
                    Submit Review
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {tab === 'oneonone' && (
        <div className="p-card">
          <div className="p-card__header"><h2>Weekly 1-on-1 Scorecards</h2></div>
          <div className="p-card__body">
            <p className="p-section-intro">Scores per Employee ID: Accuracy and Runs · Rolls up to monthly → quarterly composite KPI</p>
            <div className="p-table-wrap">
              <table className="p-table">
                <thead>
                  <tr>
                    <th>Employee ID</th>
                    <th>Name</th>
                    <th>Manager</th>
                    <th>Accuracy (weekly avg)</th>
                    <th>Runs (weekly avg)</th>
                    <th>Source</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {employees.filter((e) => e.department === 'Production').map((e) => (
                    <tr key={e.id}>
                      <td><span className="p-employee-link">{e.employeeId}</span></td>
                      <td>{e.firstName} {e.surname}</td>
                      <td>{e.manager}</td>
                      <td>{e.accuracyScore}</td>
                      <td>{e.runsScore}</td>
                      <td><Link href="/platform/manufacturing" className="p-btn p-btn--ghost p-btn--sm">Manufacturing →</Link></td>
                      <td>
                        <button type="button" className="p-btn p-btn--secondary p-btn--sm" onClick={() => alert('Demo: 1-on-1 scorecard opened')}>
                          Score
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {tab === 'organogram' && (
        <div className="p-card">
          <div className="p-card__header"><h2>Group Organogram</h2></div>
          <div className="p-card__body">
            <div className="p-org-level">
              <div className="p-org-node" style={{ borderColor: 'var(--p-accent)', borderWidth: 2 }}>
                <strong>Trevor Walsh</strong>
                <span>Group CEO</span>
              </div>
            </div>
            <div className="p-org-level">
              {[
                { name: 'Morganna Kirkman', role: 'HR Director' },
                { name: 'Johan Botha', role: 'Production Manager' },
                { name: 'Conrad Eksteen', role: 'Head of Design' },
                { name: 'Karen Smith', role: 'Sales Director' },
              ].map((n) => (
                <div key={n.name} className="p-org-node">
                  <strong>{n.name}</strong>
                  <span>{n.role}</span>
                </div>
              ))}
            </div>
            <div className="p-org-level">
              {employees.filter((e) => e.role !== 'HR Director' && e.role !== 'Production Manager').slice(0, 4).map((e) => (
                <div key={e.id} className="p-org-node">
                  <strong>{e.firstName} {e.surname}</strong>
                  <span>{e.role} · {e.employeeId}</span>
                </div>
              ))}
            </div>
            <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--p-muted)' }}>
              Master data model — companies → departments → managers → direct reports
            </p>
          </div>
        </div>
      )}

      {selectedEmployee && (
        <div className="p-modal-overlay" onClick={() => setSelectedEmployee(null)}>
          <div className="p-modal" onClick={(e) => e.stopPropagation()}>
            <div className="p-modal__header">
              <h2>{employees.find((e) => e.id === selectedEmployee)?.firstName} {employees.find((e) => e.id === selectedEmployee)?.surname}</h2>
              <button type="button" className="p-btn p-btn--ghost" onClick={() => setSelectedEmployee(null)}>✕</button>
            </div>
            <div className="p-modal__body">
              {(() => {
                const e = employees.find((emp) => emp.id === selectedEmployee)!
                return (
                  <>
                    <p><span className="p-employee-link">{e.employeeId}</span> · {e.company} · {e.department}</p>
                    <p>Manager: {e.manager}</p>
                    <p>Contract: <StatusBadge status={e.contractStatus} /></p>
                    <p>Manufacturing scores — Accuracy: {e.accuracyScore}, Runs: {e.runsScore}</p>
                    <Link href="/platform/manufacturing" className="p-btn p-btn--secondary p-btn--sm">View floor data →</Link>
                  </>
                )
              })()}
            </div>
          </div>
        </div>
      )}
    </PlatformShell>
  )
}
