import Link from 'next/link'
import React from 'react'

import { DataLayersSvg } from '@/components/stakeholder/internal/DataLayersSvg'
import { TeamPageHero } from '@/components/stakeholder/internal/InternalShell'
import { Reveal } from '@/components/stakeholder/Reveal'
import { dataLayers } from '@/lib/stakeholder/internal-content'

const designRules = [
  'Meaningful normalization — enough structure for relationships, history, reporting; not full external system replication',
  'Nested arrays/blocks for owned substructure (checklists, report lines, SPD template phases)',
  'Separate collection when independent permissions, querying, reuse, or history needed',
  'Module ownership on every collection — integrated model, clear Linear label',
  'Slug convention: plural kebab-case (employees, finance-report-lines); glossary uses singular business terms',
]

const globals = [
  { slug: 'manufacturing-settings', module: 'Manufacturing', purpose: 'OEE, snapshot times, reject %' },
  { slug: 'maintenance-settings', module: 'Maintenance', purpose: 'Shot thresholds, escalation chain' },
  { slug: 'finance-settings', module: 'Finance', purpose: 'Period cadence, recipient labels' },
  { slug: 'hr-settings', module: 'HR', purpose: 'Review cadence, rating bands' },
  { slug: 'spd-settings', module: 'SPD', purpose: 'Default process template pointer' },
  { slug: 'sales-settings', module: 'Sales', purpose: 'Hunt/Care defaults' },
  { slug: 'ecosystem-settings', module: 'Cross-cutting', purpose: 'Optional flags' },
]

const plugins = [
  { name: 'import-export', purpose: 'Bulk CSV/JSON on selected collections; jobs for large files' },
  { name: 'nested-docs', purpose: 'Same-collection trees only — e.g. document-categories if needed' },
  { name: 'mcp (Phase 3)', purpose: 'Agent API with per-collection least privilege' },
]

const uploads = [
  { slug: 'media', content: 'Images, photos, logos, setter photos' },
  { slug: 'documents', content: 'PDF, Office, POs, contracts — module, confidentiality, filing status' },
]

export default function TeamDataModelPage() {
  return (
    <>
      <TeamPageHero
        eyebrow="docs/architecture/payload-data-model.md"
        title="Data model"
        lead="How records, settings, files, and automation fit together. One MongoDB database — module-organized, not siloed apps."
      />

      <section className="team-section">
        <div className="team-section__inner">
          <Reveal>
            <DataLayersSvg />
          </Reveal>
          <div className="team-card-grid" style={{ marginTop: '2rem' }}>
            {dataLayers.map((l, i) => (
              <Reveal key={l.id} delay={i * 40} className="team-card">
                <h3>{l.label}</h3>
                <p>
                  <code>{l.construct}</code> — {l.examples}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="team-section team-section--paper">
        <div className="team-section__inner">
          <Reveal>
            <h2 className="team-section__title">Collection design rules</h2>
          </Reveal>
          <ol style={{ lineHeight: 1.75, paddingLeft: '1.2rem' }}>
            {designRules.map((r) => (
              <li key={r} style={{ marginBottom: '0.5rem' }}>
                {r}
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="team-section">
        <div className="team-section__inner">
          <Reveal>
            <h2 className="team-section__title">Module globals</h2>
            <p className="team-section__intro">Pointers and defaults — not full template bodies (templates are collections).</p>
          </Reveal>
          <div className="team-table-wrap">
            <table className="team-table">
              <thead>
                <tr>
                  <th>Global</th>
                  <th>Module</th>
                  <th>Purpose</th>
                </tr>
              </thead>
              <tbody>
                {globals.map((g) => (
                  <tr key={g.slug}>
                    <td>
                      <code>{g.slug}</code>
                    </td>
                    <td>{g.module}</td>
                    <td>{g.purpose}</td>
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
            <h2 className="team-section__title">Uploads & plugins</h2>
          </Reveal>
          <div className="team-card-grid">
            <div className="team-card">
              <h3>Upload collections</h3>
              <ul style={{ margin: 0, paddingLeft: '1rem', fontSize: '0.85rem', color: 'var(--team-muted)' }}>
                {uploads.map((u) => (
                  <li key={u.slug}>
                    <code>{u.slug}</code> — {u.content}
                  </li>
                ))}
              </ul>
            </div>
            <div className="team-card">
              <h3>Planned plugins</h3>
              <ul style={{ margin: 0, paddingLeft: '1rem', fontSize: '0.85rem', color: 'var(--team-muted)' }}>
                {plugins.map((p) => (
                  <li key={p.name}>
                    <code>{p.name}</code> — {p.purpose}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <p style={{ marginTop: '1.5rem' }}>
            <Link href="/team/modules/foundations" className="team-btn team-btn--ghost">
              Foundations records →
            </Link>
          </p>
        </div>
      </section>
    </>
  )
}
