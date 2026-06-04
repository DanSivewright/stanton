import Link from 'next/link'
import React from 'react'

import { TeamPageHero } from '@/components/stakeholder/internal/InternalShell'
import { Reveal } from '@/components/stakeholder/Reveal'
import { jobTasks } from '@/lib/stakeholder/internal-content'

const whenWhat = [
  { mechanism: 'beforeChange / afterChange hooks', use: 'Validation, denormalized fields, queue jobs, activity events' },
  { mechanism: 'Non-blocking hooks', use: 'Fire-and-forget — void, no returned Promise' },
  { mechanism: 'Jobs Queue', use: 'Email, SharePoint, Odoo sync, large imports, embeddings, report gen' },
  { mechanism: 'Globals', use: 'Thresholds, recipient chains, cron labels, template default IDs' },
  { mechanism: 'activity-events collection', use: 'Cross-module audit trail' },
]

const notBuilding = [
  'Notification Rules collection',
  'Workflow engine collection',
  'Separate Import Batch domain collection (plugin handles operational imports)',
]

const examples = [
  {
    module: 'Manufacturing',
    items: [
      'production-snapshots afterChange: rollups; reject % > threshold → notification job',
      'moulds afterChange: shot count ≥ maintenance-settings → create maintenance job',
      'stoppage afterChange: machine-down notification chain',
    ],
  },
  {
    module: 'SPD',
    items: [
      'gate sign-off afterChange: unlock next phase; activity event',
      'change request beforeChange: validate classification + approvals',
    ],
  },
  {
    module: 'HR',
    items: [
      'review afterChange: weighted score; optional SharePoint job',
      'cron from hr-settings: quarterly review reminders',
    ],
  },
]

export default function TeamAutomationPage() {
  return (
    <>
      <TeamPageHero
        eyebrow="docs/architecture/automation.md"
        title="Automation"
        lead="Hooks + Jobs Queue — not generic automation collections unless business users must edit rules in admin."
      />

      <section className="team-section">
        <div className="team-section__inner">
          <Reveal>
            <h2 className="team-section__title">When to use what</h2>
          </Reveal>
          <div className="team-table-wrap">
            <table className="team-table">
              <thead>
                <tr>
                  <th>Mechanism</th>
                  <th>Use for</th>
                </tr>
              </thead>
              <tbody>
                {whenWhat.map((row) => (
                  <tr key={row.mechanism}>
                    <td>
                      <code>{row.mechanism}</code>
                    </td>
                    <td>{row.use}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="team-section team-section--paper">
        <div className="team-section__inner">
          <Reveal>
            <h2 className="team-section__title">Job tasks (conceptual)</h2>
          </Reveal>
          <div className="team-table-wrap">
            <table className="team-table">
              <thead>
                <tr>
                  <th>Task slug</th>
                  <th>Trigger</th>
                  <th>Module</th>
                </tr>
              </thead>
              <tbody>
                {jobTasks.map((t) => (
                  <tr key={t.slug}>
                    <td>
                      <code>{t.slug}</code>
                    </td>
                    <td>{t.trigger}</td>
                    <td>{t.module}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="team-section">
        <div className="team-section__inner">
          <Reveal>
            <h2 className="team-section__title">Examples by module</h2>
          </Reveal>
          {examples.map((ex, i) => (
            <Reveal key={ex.module} delay={i * 50} className="team-principle">
              <h3>{ex.module}</h3>
              <ul style={{ margin: 0, paddingLeft: '1.1rem', color: 'var(--team-muted)', fontSize: '0.88rem' }}>
                {ex.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="team-section">
        <div className="team-section__inner">
          <Reveal>
            <h2 className="team-section__title">Hook safety & Vercel</h2>
          </Reveal>
          <ul style={{ fontSize: '0.9rem', color: 'var(--team-muted)', lineHeight: 1.7 }}>
            <li>Pass req to nested operations in hooks (transactions)</li>
            <li>Use context flags to prevent infinite loops</li>
            <li>Local API: overrideAccess: false when acting on behalf of user</li>
            <li>
              <strong>Vercel:</strong> cron → API routes calling jobs.run + handle-schedules — not in-process autoRun
              alone
            </li>
          </ul>
        </div>
      </section>

      <section className="team-section team-section--paper">
        <div className="team-section__inner">
          <Reveal>
            <h2 className="team-section__title">Not building (v1)</h2>
          </Reveal>
          <ul>
            {notBuilding.map((n) => (
              <li key={n}>{n}</li>
            ))}
          </ul>
          <p style={{ marginTop: '1.5rem' }}>
            <Link href="/team/delivery" className="team-btn">
              Delivery phases →
            </Link>
          </p>
        </div>
      </section>
    </>
  )
}
