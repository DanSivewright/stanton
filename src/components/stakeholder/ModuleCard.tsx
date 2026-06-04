import Link from 'next/link'
import React from 'react'

import type { ModuleMeta } from '@/lib/stakeholder/content'

export function ModuleCard({ module }: { module: ModuleMeta }) {
  return (
    <Link href={`/modules/${module.slug}`} className={`module-card module-card--${module.status}`}>
      <div className="module-card__top">
        <span className="module-card__icon" aria-hidden>
          {module.icon}
        </span>
        <span className={`module-card__status module-card__status--${module.status}`}>
          {module.statusLabel}
        </span>
      </div>
      <h3>{module.name}</h3>
      <p>{module.tagline}</p>
      <span className="module-card__phase">{module.phaseLabel}</span>
    </Link>
  )
}
