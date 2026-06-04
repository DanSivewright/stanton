import React from 'react'

import { Reveal } from './Reveal'

type PageHeroProps = {
  eyebrow?: string
  title: string
  lead: string
  children?: React.ReactNode
}

export function PageHero({ eyebrow, title, lead, children }: PageHeroProps) {
  return (
    <section className="page-hero">
      <Reveal>
        {eyebrow ? <p className="page-hero__eyebrow">{eyebrow}</p> : null}
        <h1>{title}</h1>
        <p className="page-hero__lead">{lead}</p>
        {children}
      </Reveal>
    </section>
  )
}
