import Link from 'next/link'
import React from 'react'

import { PageHero } from '@/components/stakeholder/PageHero'
import { Reveal } from '@/components/stakeholder/Reveal'
import { costFootnotes, costRollups, costRows } from '@/lib/stakeholder/costs'

export default function InvestmentPage() {
  return (
    <>
      <PageHero
        eyebrow="Operating allowance"
        title="Monthly platform investment"
        lead="Indicative running costs for hosting, data, files, and communications — scaled to how you adopt each phase."
      />

      <section className="section">
        <div className="section__inner">
          <div className="rollup-grid">
            {costRollups.map((r, i) => (
              <Reveal key={r.stage} delay={i * 70} className="rollup-card">
                <p className="rollup-card__stage">{r.stage}</p>
                <p className="rollup-card__range">{r.range}</p>
                <p className="rollup-card__blurb">{r.blurb}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section section--paper">
        <div className="section__inner">
          <Reveal>
            <h2 className="section__title">Line items</h2>
          </Reveal>
          <div className="cost-table-wrap">
            <table className="cost-table">
              <thead>
                <tr>
                  <th>Service</th>
                  <th>Launch</th>
                  <th>Steady state</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {costRows.map((row) => (
                  <tr key={row.service}>
                    <td>{row.service}</td>
                    <td>{row.mvp}</td>
                    <td>{row.production}</td>
                    <td>{row.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <ul className="footnotes">
            {costFootnotes.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section">
        <div className="section__inner">
          <Reveal className="cta-band cta-band--compact">
            <h2>Implementation is quoted separately</h2>
            <p>
              This page covers ongoing platform operation. Build, migration, and integration spikes are
              part of the delivery agreement — not hidden inside these tiers.
            </p>
            <Link href="/" className="btn btn--ghost">
              Back to overview
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  )
}
