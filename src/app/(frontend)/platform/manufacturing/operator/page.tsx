'use client'

import Link from 'next/link'
import React, { useState } from 'react'

import { PlatformShell } from '@/components/platform-demo/PlatformShell'
import { machines, hourlySnapshots } from '@/lib/platform-demo/mock-data'

export default function OperatorInputPage() {
  const [machineId, setMachineId] = useState('m01')
  const [firstName, setFirstName] = useState('Thabo')
  const [surname, setSurname] = useState('Molefe')
  const [employeeCode, setEmployeeCode] = useState('EMP-0201')
  const [actualCycle, setActualCycle] = useState('32')
  const [unitsProduced, setUnitsProduced] = useState('112')
  const [rejects, setRejects] = useState('2')
  const [stopped, setStopped] = useState(false)
  const [stoppageReason, setStoppageReason] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const machine = machines.find((m) => m.id === machineId) ?? machines[0]
  const cycleNum = parseFloat(actualCycle) || 0
  const unitsNum = parseInt(unitsProduced, 10) || 0
  const rejectsNum = parseInt(rejects, 10) || 0
  const theoreticalUnits = cycleNum > 0 ? Math.round(3600 / cycleNum) : 0
  const operatorOee = theoreticalUnits > 0 ? Math.min(95, Math.round((unitsNum / theoreticalUnits) * 85)) : 0
  const systemOee = machine.oee
  const oeeVariance = Math.abs(operatorOee - systemOee)
  const behindSchedule = unitsNum < theoreticalUnits * 0.9
  const rejectRate = unitsNum > 0 ? (rejectsNum / unitsNum) * 100 : 0
  const cycleConsistent = cycleNum > 0 && unitsNum > 0

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (stopped && !stoppageReason.trim()) {
      alert('Stoppage reason is mandatory when machine is stopped')
      return
    }
    if (!cycleConsistent) {
      alert('Cycle time and output must be consistent before submission')
      return
    }
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

  function handleMachineStopped() {
    setStopped(true)
    alert('Demo: Instant notification sent to all line managers and maintenance. Machine marked offline until reason submitted.')
  }

  return (
    <PlatformShell
      title="Operator Data Entry"
      subtitle="Tablet-optimised · Identity required on every submission"
      actions={<Link href="/platform/manufacturing" className="p-btn p-btn--ghost p-btn--sm">← Dashboard</Link>}
    >
      <div className="p-tablet">
        {submitted && (
          <div className="p-alert p-alert--info p-mb">
            ✓ Submission recorded · Synced to HR via {employeeCode} · OEE updated on dashboard
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="p-card p-mb">
            <div className="p-card__header">
              <h2>Operator Identity</h2>
              <span className="p-employee-link">Compulsory</span>
            </div>
            <div className="p-card__body">
              <div className="p-grid-3">
                <div className="p-form-group">
                  <label>First Name</label>
                  <input className="p-input" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                </div>
                <div className="p-form-group">
                  <label>Surname</label>
                  <input className="p-input" value={surname} onChange={(e) => setSurname(e.target.value)} required />
                </div>
                <div className="p-form-group">
                  <label>Employee Code</label>
                  <input className="p-input" value={employeeCode} onChange={(e) => setEmployeeCode(e.target.value)} required />
                </div>
              </div>
            </div>
          </div>

          <div className="p-card p-mb">
            <div className="p-card__header">
              <h2>Machine & Production</h2>
              <button type="button" className="p-btn p-btn--danger p-btn--sm" onClick={handleMachineStopped}>
                Machine Stopped
              </button>
            </div>
            <div className="p-card__body">
              <div className="p-form-group">
                <label>Machine</label>
                <select className="p-select" value={machineId} onChange={(e) => setMachineId(e.target.value)}>
                  {machines.filter((m) => m.status !== 'scheduled').map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.code} — {m.product}
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-grid-2">
                <div className="p-form-group">
                  <label>Product (auto-populated)</label>
                  <input className="p-input" value={`${machine.stockCode} — ${machine.product}`} readOnly />
                </div>
                <div className="p-form-group">
                  <label>Manufacturing Order</label>
                  <input className="p-input" value={machine.mo} readOnly />
                </div>
              </div>

              <div className="p-alert p-alert--warn" style={{ fontSize: '0.8rem' }}>
                Planned cycle time is <strong>not shown</strong> on screen (physical job card only) to prevent gaming.
              </div>

              <div className="p-grid-3">
                <div className="p-form-group">
                  <label>Actual Cycle Time (seconds)</label>
                  <input className="p-input" type="number" value={actualCycle} onChange={(e) => setActualCycle(e.target.value)} required />
                </div>
                <div className="p-form-group">
                  <label>Units Produced (this hour)</label>
                  <input className="p-input" type="number" value={unitsProduced} onChange={(e) => setUnitsProduced(e.target.value)} required />
                </div>
                <div className="p-form-group">
                  <label>Rejects</label>
                  <input className="p-input" type="number" value={rejects} onChange={(e) => setRejects(e.target.value)} />
                </div>
              </div>

              {stopped && (
                <div className="p-form-group">
                  <label>Stoppage Reason (mandatory)</label>
                  <textarea className="p-textarea" value={stoppageReason} onChange={(e) => setStoppageReason(e.target.value)} placeholder="Describe reason for stoppage..." required />
                </div>
              )}

              {behindSchedule && (
                <div className="p-alert p-alert--danger">Behind schedule — actual output below theoretical for this period</div>
              )}

              {rejectRate > 2 && (
                <div className="p-alert p-alert--danger">Reject rate {rejectRate.toFixed(1)}% exceeds 2% threshold — alert triggered</div>
              )}
            </div>
          </div>

          <div className="p-card p-mb">
            <div className="p-card__header"><h2>Dual OEE Display</h2></div>
            <div className="p-card__body">
              <div className="p-dual-oee">
                <div className="p-dual-oee__box p-dual-oee__box--operator">
                  <div className="p-dual-oee__value">{operatorOee}%</div>
                  <div className="p-dual-oee__label">Operator-entered OEE</div>
                </div>
                <div className="p-dual-oee__box p-dual-oee__box--system">
                  <div className="p-dual-oee__value">{systemOee}%</div>
                  <div className="p-dual-oee__label">System-calculated OEE</div>
                </div>
              </div>
              {oeeVariance > 8 && (
                <div className="p-alert p-alert--warn">Variance of {oeeVariance}% flagged — review required</div>
              )}
              <div className="p-grid-2">
                <div>
                  <strong>Machine efficiency:</strong> {machine.isRobotic ? 'Robotic validation rules' : 'Manual validation rules'}
                </div>
                <div>
                  <strong>Operator efficiency:</strong> {((unitsNum / Math.max(theoreticalUnits, 1)) * 100).toFixed(0)}%
                </div>
              </div>
            </div>
          </div>

          <div className="p-card p-mb">
            <div className="p-card__header"><h2>3-Hourly Reporting Snapshots</h2></div>
            <div className="p-card__body">
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {hourlySnapshots.map((t) => (
                  <span key={t} className="p-badge p-badge--ready">{t}</span>
                ))}
              </div>
              <p style={{ marginTop: 12, fontSize: '0.85rem', color: 'var(--p-muted)' }}>
                12-hour production day · Snapshots at 7am, 10am, 1pm, 4pm, 7pm · Offline capable with sync on reconnect
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <button type="submit" className="p-btn p-btn--primary" style={{ flex: 1, justifyContent: 'center', padding: '14px' }}>
              Submit Production Data
            </button>
            <Link href="/platform/manufacturing/tool-change" className="p-btn p-btn--secondary" style={{ padding: '14px 20px' }}>
              Tool Change
            </Link>
          </div>
        </form>
      </div>
    </PlatformShell>
  )
}
