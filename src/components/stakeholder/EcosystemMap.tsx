'use client'

import React, { useState } from 'react'

import { ecosystemEdges, ecosystemNodes } from '@/lib/stakeholder/content'

const slugMap: Record<string, string> = {
  foundations: 'foundations',
  manufacturing: 'manufacturing',
  maintenance: 'maintenance',
  finance: 'finance',
  spd: 'spd',
  sales: 'sales',
  hr: 'hr',
  intelligence: 'intelligence',
}

export function EcosystemMap() {
  const [active, setActive] = useState<string | null>('foundations')

  return (
    <div className="eco-map">
      <svg
        viewBox="0 0 100 100"
        className="eco-map__svg"
        role="img"
        aria-label="Module relationship diagram"
      >
        <defs>
          <linearGradient id="eco-line" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.15" />
            <stop offset="50%" stopColor="var(--accent)" stopOpacity="0.55" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0.15" />
          </linearGradient>
        </defs>

        {ecosystemEdges.map(([a, b], i) => {
          const na = ecosystemNodes.find((n) => n.id === a)!
          const nb = ecosystemNodes.find((n) => n.id === b)!
          const lit = active === a || active === b
          return (
            <line
              key={`${a}-${b}`}
              x1={na.x}
              y1={na.y}
              x2={nb.x}
              y2={nb.y}
              className={`eco-map__edge ${lit ? 'eco-map__edge--lit' : ''}`}
              style={{ animationDelay: `${i * 80}ms` }}
            />
          )
        })}

        {ecosystemNodes.map((node, i) => {
          const href = slugMap[node.id] ? `/modules/${slugMap[node.id]}` : '/modules'
          const isActive = active === node.id
          return (
            <g
              key={node.id}
              className={`eco-map__node ${isActive ? 'eco-map__node--active' : ''}`}
              style={{ animationDelay: `${i * 60}ms` }}
              onMouseEnter={() => setActive(node.id)}
              onFocus={() => setActive(node.id)}
            >
              <a href={href} className="eco-map__node-link">
                <circle cx={node.x} cy={node.y} r={node.r / 10} className="eco-map__ring" />
                <circle cx={node.x} cy={node.y} r={node.r / 14} className="eco-map__core" />
                <text x={node.x} y={node.y + node.r / 5 + 2} className="eco-map__label">
                  {node.label}
                </text>
              </a>
            </g>
          )
        })}
      </svg>

      <p className="eco-map__hint">Hover a module to see how it links to the rest · click to read more</p>
    </div>
  )
}
