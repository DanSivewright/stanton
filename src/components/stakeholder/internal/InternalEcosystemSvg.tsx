'use client'

import Link from 'next/link'
import React, { useState } from 'react'

const modules = [
  { id: 'foundations', label: 'Foundations', x: 360, y: 160, r: 48, href: '/team/modules/foundations' },
  { id: 'mfg', label: 'Manufacturing', x: 140, y: 100, r: 36, href: '/team/modules/manufacturing' },
  { id: 'maint', label: 'Maintenance', x: 580, y: 100, r: 36, href: '/team/modules/maintenance' },
  { id: 'fin', label: 'Finance', x: 100, y: 220, r: 34, href: '/team/modules/finance' },
  { id: 'spd', label: 'SPD', x: 360, y: 60, r: 34, href: '/team/modules/spd' },
  { id: 'sales', label: 'Sales', x: 620, y: 220, r: 32, href: '/team/modules/sales' },
  { id: 'hr', label: 'HR', x: 360, y: 260, r: 32, href: '/team/modules/hr' },
  { id: 'data', label: 'Data', x: 520, y: 160, r: 28, href: '/team/modules/data' },
  { id: 'llm', label: 'LLM', x: 200, y: 160, r: 28, href: '/team/modules/llm' },
]

const links: [string, string][] = [
  ['foundations', 'mfg'],
  ['foundations', 'maint'],
  ['foundations', 'fin'],
  ['foundations', 'spd'],
  ['foundations', 'sales'],
  ['foundations', 'hr'],
  ['foundations', 'data'],
  ['foundations', 'llm'],
  ['mfg', 'maint'],
  ['mfg', 'hr'],
]

export function InternalEcosystemSvg() {
  const [active, setActive] = useState('foundations')
  const byId = (id: string) => modules.find((m) => m.id === id)!

  return (
    <div className="internal-eco">
      <svg viewBox="0 0 720 320" className="team-svg internal-eco__svg" role="img" aria-label="Module ecosystem">
        {links.map(([a, b]) => {
          const na = byId(a)
          const nb = byId(b)
          const lit = active === a || active === b
          return (
            <line
              key={`${a}-${b}`}
              x1={na.x}
              y1={na.y}
              x2={nb.x}
              y2={nb.y}
              className={`internal-eco__edge ${lit ? 'internal-eco__edge--lit' : ''}`}
            />
          )
        })}
        {modules.map((m) => {
          const lit = active === m.id
          return (
            <g
              key={m.id}
              className={`internal-eco__node ${lit ? 'internal-eco__node--active' : ''}`}
              onMouseEnter={() => setActive(m.id)}
            >
              <a href={m.href} className="internal-eco__link">
                <circle cx={m.x} cy={m.y} r={m.r} />
                <text x={m.x} y={m.y + 4}>
                  {m.label}
                </text>
              </a>
            </g>
          )
        })}
      </svg>
      <p className="internal-eco__hint">
        Hover modules · click for record inventory ·{' '}
        <Link href="/team/modules">full module index</Link>
      </p>
    </div>
  )
}
