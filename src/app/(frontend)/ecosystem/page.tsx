import Link from 'next/link'
import React from 'react'

import { EcosystemMap } from '@/components/stakeholder/EcosystemMap'
import { PageHero } from '@/components/stakeholder/PageHero'
import { Reveal } from '@/components/stakeholder/Reveal'
import { openItems } from '@/lib/stakeholder/content'

const flows = [
  {
    title: 'Factory floor → maintenance',
    body: 'When a machine stops or a mould hits its shot threshold, maintenance jobs can open automatically — with the same machine and employee context manufacturing already captured.',
  },
  {
    title: 'Production → people performance',
    body: 'Every production round links to Employee ID. HR and leadership see operational contribution alongside contracts and reviews — without re-keying data.',
  },
  {
    title: 'Finance → board packs',
    body: 'Reporting periods and lines live in the platform. Your existing accounting system remains authoritative; presentation layers pull normalized numbers when you generate decks.',
  },
  {
    title: 'SPD → tooling & products',
    body: 'Gate sign-offs unlock phases. Change requests stay first-class. Tooling assets connect to products and factory assets as you phase in deeper links.',
  },
  {
    title: 'External systems → on your terms',
    body: 'Odoo, Pipedrive, and SharePoint connect after the model is stable. Imports and scheduled jobs handle bulk loads and filing — without forcing you into a rip-and-replace.',
  },
]

export default function EcosystemPage() {
  return (
    <>
      <PageHero
        eyebrow="Architecture for stakeholders"
        title="How everything plays together"
        lead="You do not need to know how the software is built — only how information flows between teams, sites, and tools."
      />

      <section className="section">
        <div className="section__inner section__inner--wide">
          <Reveal>
            <EcosystemMap />
          </Reveal>
        </div>
      </section>

      <section className="section section--paper">
        <div className="section__inner">
          <Reveal>
            <h2 className="section__title">Key interplay</h2>
          </Reveal>
          <ul className="flow-list">
            {flows.map((f, i) => (
              <Reveal key={f.title} as="li" delay={i * 60} className="flow-list__item">
                <h3>{f.title}</h3>
                <p>{f.body}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className="section">
        <div className="section__inner">
          <Reveal>
            <h2 className="section__title">What we are confirming together</h2>
            <p className="section__intro">
              These items do not block the vision — they refine scope as we build.
            </p>
          </Reveal>
          <ul className="open-list">
            {openItems.map((item, i) => (
              <Reveal key={item} as="li" delay={i * 40}>
                {item}
              </Reveal>
            ))}
          </ul>
          <Reveal delay={200}>
            <Link href="/roadmap" className="btn btn--primary">
              See delivery phases
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  )
}
