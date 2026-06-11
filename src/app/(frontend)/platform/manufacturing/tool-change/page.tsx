'use client'

import Link from 'next/link'
import React, { useState } from 'react'

import { PlatformShell, StatusBadge } from '@/components/platform-demo/PlatformShell'
import { machines, toolChangeAllocations, qualityChecklist } from '@/lib/platform-demo/mock-data'

export default function ToolChangePage() {
  const [step, setStep] = useState(1)
  const [machineId, setMachineId] = useState('')
  const [productId, setProductId] = useState('')
  const [checklist, setChecklist] = useState(qualityChecklist)
  const [setterName, setSetterName] = useState('Pieter Van Wyk')
  const [setterId, setSetterId] = useState('EMP-0203')
  const [photosUploaded, setPhotosUploaded] = useState(false)

  const machine = machines.find((m) => m.id === machineId)
  const products = [...new Set(machines.map((m) => `${m.stockCode}|${m.product}`))]

  const requiredComplete = checklist.filter((c) => c.required).every((c) => c.completed)
  const canSignOff = requiredComplete && photosUploaded && setterName && setterId

  function toggleCheck(id: string) {
    setChecklist((prev) => prev.map((c) => (c.id === id ? { ...c, completed: !c.completed } : c)))
  }

  return (
    <PlatformShell
      title="Tool Change Flow"
      subtitle="Machine → Product → Tool change · Quality sign-off · Setter photos"
      actions={<Link href="/platform/manufacturing" className="p-btn p-btn--ghost p-btn--sm">← Dashboard</Link>}
    >
      <div className="p-tabs">
        {['Select Machine', 'Tool Change', 'Quality Checklist', 'Setter Sign-Off'].map((label, i) => (
          <button
            key={label}
            type="button"
            className={`p-tab ${step === i + 1 ? 'is-active' : ''}`}
            onClick={() => setStep(i + 1)}
          >
            {i + 1}. {label}
          </button>
        ))}
      </div>

      {step === 1 && (
        <div className="p-card">
          <div className="p-card__header"><h2>Step 1 — Select Machine & Product</h2></div>
          <div className="p-card__body">
            <div className="p-form-group">
              <label>Machine</label>
              <select className="p-select" value={machineId} onChange={(e) => { setMachineId(e.target.value); setProductId('') }}>
                <option value="">Select machine...</option>
                {machines.map((m) => (
                  <option key={m.id} value={m.id}>{m.code} — {m.factory}</option>
                ))}
              </select>
            </div>
            {machineId && (
              <div className="p-form-group">
                <label>Product for Tool Change</label>
                <select className="p-select" value={productId} onChange={(e) => setProductId(e.target.value)}>
                  <option value="">Select product...</option>
                  {products.map((p) => {
                    const [stock, name] = p.split('|')
                    return <option key={p} value={p}>{stock} — {name}</option>
                  })}
                </select>
              </div>
            )}
            {machine && productId && (
              <div className="p-alert p-alert--info">
                Current shots on mould: <strong>{machine.shotCount.toLocaleString()}</strong>
                {machine.shotWarning && ' — Warning threshold reached'}
              </div>
            )}
            <button type="button" className="p-btn p-btn--primary" disabled={!productId} onClick={() => setStep(2)}>
              Continue to Tool Change →
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="p-card">
          <div className="p-card__header">
            <h2>Step 2 — Tool Change Time Allocations</h2>
            <button type="button" className="p-btn p-btn--secondary p-btn--sm" onClick={() => alert('Demo: Tool list Excel uploaded')}>
              Upload Tool List
            </button>
          </div>
          <div className="p-card__body">
            <div className="p-table-wrap">
              <table className="p-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Allocated (mins)</th>
                    <th>Actual (mins)</th>
                    <th>Variance</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {toolChangeAllocations.map((t) => (
                    <tr key={t.product} className={t.overrun ? 'is-critical' : ''}>
                      <td>{t.product}</td>
                      <td>{t.allocatedMins}</td>
                      <td>{t.actualMins}</td>
                      <td style={{ color: t.overrun ? 'var(--p-bad)' : 'var(--p-good)' }}>
                        {t.overrun ? '+' : ''}{t.actualMins - t.allocatedMins} min
                      </td>
                      <td>{t.overrun ? <StatusBadge status="behind" /> : <StatusBadge status="on_track" />}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-mt">
              <button type="button" className="p-btn p-btn--primary" onClick={() => setStep(3)}>Continue to Quality →</button>
            </div>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="p-card">
          <div className="p-card__header">
            <h2>Step 3 — Quality Checklist</h2>
            <span className="p-employee-link">Quality person sign-off required before production</span>
          </div>
          <div className="p-card__body">
            <ul className="p-checklist">
              {checklist.map((item) => (
                <li key={item.id}>
                  <input type="checkbox" checked={item.completed} onChange={() => toggleCheck(item.id)} id={item.id} />
                  <label htmlFor={item.id} style={{ flex: 1, cursor: 'pointer' }}>
                    {item.item}
                    {!item.required && <span style={{ color: 'var(--p-muted)', marginLeft: 8 }}>(optional)</span>}
                  </label>
                </li>
              ))}
            </ul>
            {!requiredComplete && (
              <div className="p-alert p-alert--warn p-mt">Complete all required checks before production can start</div>
            )}
            <button type="button" className="p-btn p-btn--primary p-mt" disabled={!requiredComplete} onClick={() => setStep(4)}>
              Quality Sign-Off →
            </button>
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="p-card">
          <div className="p-card__header"><h2>Step 4 — Setter Sign-Off + Photos</h2></div>
          <div className="p-card__body">
            <div
              className="p-upload-zone p-mb"
              onClick={() => setPhotosUploaded(true)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && setPhotosUploaded(true)}
            >
              {photosUploaded ? (
                <span>✓ 3 photos uploaded — machine settings documented</span>
              ) : (
                <span>📷 Click to upload photos of machine settings <strong>(mandatory)</strong></span>
              )}
            </div>
            <div className="p-grid-2">
              <div className="p-form-group">
                <label>Setter Name</label>
                <input className="p-input" value={setterName} onChange={(e) => setSetterName(e.target.value)} />
              </div>
              <div className="p-form-group">
                <label>Employee ID</label>
                <input className="p-input" value={setterId} onChange={(e) => setSetterId(e.target.value)} />
              </div>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--p-muted)' }}>
              Digital sign-off timestamp: {new Date().toLocaleString('en-ZA')}
            </p>
            <button
              type="button"
              className="p-btn p-btn--primary"
              disabled={!canSignOff}
              onClick={() => alert('Demo: Tool change complete — machine released to production')}
            >
              Complete Sign-Off & Release Machine
            </button>
          </div>
        </div>
      )}
    </PlatformShell>
  )
}
