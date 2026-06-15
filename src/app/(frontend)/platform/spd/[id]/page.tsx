'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import React, { useState } from 'react'

import { PlatformShell, StatusBadge } from '@/components/platform-demo/PlatformShell'
import { spdProjects, spdPhases } from '@/lib/platform-demo/mock-data'

const stageChecklists: Record<number, string[]> = {
  1: ['Problem Statement complete', 'Value Proposition defined', 'Volume/Price ranges documented', 'Commercial Feasibility Summary', 'Risk map created'],
  2: ['PDS v1 approved', 'Functional Architecture defined', 'Material shortlist', 'BOM v1', 'KTF/KTQ documented'],
  3: ['MFA Report', 'FEA Report', 'Tolerance Analysis', 'Prototype Parts', 'Tooling Spec (DFT)'],
  4: ['T1/T2 Trial Parts', 'CPK Studies', 'Assembly Flow', 'Final BOM', 'Pilot Run Report'],
  5: ['Processing Book', 'QC Book', 'Commercial Launch Pack', 'Supply Agreement', 'Gate 5 Pack'],
  6: ['Surveillance Report', 'Field Performance Report', 'Lessons Learned Pack', 'Close-Out Pack'],
}

const roles = ['Business Lead', 'PDM', 'Product Director', 'Design Lead', 'Quality Lead', 'Mfg Lead', 'Tooling Lead', 'Process Lead']

export default function SpdProjectPage() {
  const params = useParams()
  const project = spdProjects.find((p) => p.id === params.id) ?? spdProjects[0]
  const [checklist, setChecklist] = useState(
    (stageChecklists[project.phase] ?? []).map((item, i) => ({ id: `c${i}`, item, done: i < 2 })),
  )

  const allDone = checklist.every((c) => c.done)

  return (
    <PlatformShell
      title={project.name}
      subtitle={`${project.client} · ${project.pdm} (PDM) · ${project.daysInPhase} days in current phase`}
      actions={
        <>
          <StatusBadge status={project.status} />
          <Link href="/platform/spd" className="p-btn p-btn--ghost p-btn--sm">← All Projects</Link>
        </>
      }
    >
      <div className="p-phase-timeline">
        {spdPhases.map((ph) => {
          const state = ph.num < project.phase ? 'is-complete' : ph.num === project.phase ? 'is-current' : 'is-locked'
          return (
            <div key={ph.num} className={`p-phase-step ${state}`}>
              <div className="p-phase-step__bar" />
              <div className="p-phase-step__label">
                Phase {ph.num}
                {ph.gate && <><br /><span style={{ fontSize: '0.6rem' }}>{ph.gate.split('—')[0]}</span></>}
              </div>
            </div>
          )
        })}
      </div>

      <div className="p-grid-2">
        <div className="p-card">
          <div className="p-card__header"><h2>Current Stage — {project.stage}</h2></div>
          <div className="p-card__body">
            <div className="p-progress p-mb" style={{ height: 10 }}>
              <div className="p-progress__fill" style={{ width: `${project.progress}%` }} />
            </div>
            <p>Overall progress: <strong>{project.progress}%</strong></p>
            <ul className="p-checklist">
              {checklist.map((c) => (
                <li key={c.id}>
                  <input
                    type="checkbox"
                    checked={c.done}
                    onChange={() => setChecklist((prev) => prev.map((x) => (x.id === c.id ? { ...x, done: !x.done } : x)))}
                    id={c.id}
                  />
                  <label htmlFor={c.id} style={{ cursor: 'pointer' }}>{c.item}</label>
                </li>
              ))}
            </ul>
            {project.gatePending && (
              <div className="p-alert p-alert--warn p-mt">
                Pending: <strong>{project.gatePending}</strong> — phase locked until approved
              </div>
            )}
          </div>
        </div>

        <div className="p-card">
          <div className="p-card__header"><h2>RASCI — 8 Roles</h2></div>
          <div className="p-card__body">
            <div className="p-table-wrap">
              <table className="p-table">
                <thead>
                  <tr><th>Role</th><th>Assigned</th><th>Status</th></tr>
                </thead>
                <tbody>
                  {roles.map((role, i) => (
                    <tr key={role}>
                      <td>{role}</td>
                      <td>{[project.businessLead, project.pdm, 'Trevor Walsh', 'Conrad Eksteen', 'Linda Pretorius', 'Johan Botha', 'Andre Fourie', 'Sipho Ndlovu'][i]}</td>
                      <td>{i < 3 ? '✓ Active' : i < 5 ? '○ Pending' : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div className="p-grid-3 p-mt">
        <div className="p-card">
          <div className="p-card__header"><h3>Deliverables Pack</h3></div>
          <div className="p-card__body">
            {['Product & Market Definition', 'Design Architecture', 'Simulation & Validation', 'Tooling Definition'].map((d) => (
              <div key={d} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--p-line)', fontSize: '0.85rem' }}>
                <span>{d}</span>
                <span style={{ color: project.phase > 1 ? 'var(--p-good)' : 'var(--p-muted)' }}>
                  {project.phase > 1 ? '✓' : '○'}
                </span>
              </div>
            ))}
            <button type="button" className="p-btn p-btn--secondary p-btn--sm p-mt" onClick={() => alert('Demo: AI document validation — 2 items flagged as insufficient')}>
              Validate Documents
            </button>
          </div>
        </div>

        <div className="p-card">
          <div className="p-card__header"><h3>Gate Sign-Off</h3></div>
          <div className="p-card__body">
            <p style={{ fontSize: '0.85rem' }}>Manager ticks checklist, signs off, next phase unlocks.</p>
            <button
              type="button"
              className="p-btn p-btn--primary"
              disabled={!allDone}
              onClick={() => alert(`Demo: ${project.gatePending ?? 'Gate'} approved — next phase unlocked`)}
            >
              Approve Gate
            </button>
          </div>
        </div>

        <div className="p-card">
          <div className="p-card__header"><h3>Timeline</h3></div>
          <div className="p-card__body">
            <p><strong>Days in phase:</strong> {project.daysInPhase}</p>
            <p><strong>On-track status:</strong> <StatusBadge status={project.status} /></p>
            <p style={{ fontSize: '0.85rem', color: 'var(--p-muted)' }}>Avg time per phase: 38 days (group benchmark)</p>
          </div>
        </div>
      </div>
    </PlatformShell>
  )
}
