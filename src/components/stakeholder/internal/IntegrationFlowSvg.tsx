'use client'

import React, { useState } from 'react'

const nodes = [
  { id: 'hub', label: 'Platform\n(source of truth)', x: 360, y: 140, r: 56 },
  { id: 'odoo', label: 'Odoo', x: 120, y: 80, r: 40 },
  { id: 'pipe', label: 'Pipedrive', x: 120, y: 200, r: 40 },
  { id: 'excel', label: 'Planning\nsheets', x: 600, y: 80, r: 40 },
  { id: 'sp', label: 'SharePoint', x: 600, y: 200, r: 40 },
  { id: 'llm', label: 'LLM\n(Phase 3)', x: 360, y: 260, r: 36 },
]

const edges: [string, string, string][] = [
  ['odoo', 'hub', 'normalize'],
  ['pipe', 'hub', 'import'],
  ['excel', 'hub', 'MO import'],
  ['hub', 'sp', 'file jobs'],
  ['hub', 'llm', 'agent API'],
]

export function IntegrationFlowSvg() {
  const [hover, setHover] = useState<string | null>('hub')

  const node = (id: string) => nodes.find((n) => n.id === id)!

  return (
    <svg viewBox="0 0 720 320" className="team-svg integration-flow" role="img" aria-label="Integration flow">
      <defs>
        <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 Z" fill="var(--team-accent)" opacity="0.7" />
        </marker>
      </defs>

      {edges.map(([from, to, label]) => {
        const a = node(from)
        const b = node(to)
        const lit = hover === from || hover === to || hover === 'hub'
        const mx = (a.x + b.x) / 2
        const my = (a.y + b.y) / 2
        return (
          <g key={`${from}-${to}`} className={lit ? 'integration-flow__edge--lit' : ''}>
            <line
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              className="integration-flow__edge"
              markerEnd="url(#arrow)"
            />
            <text x={mx} y={my - 6} className="integration-flow__edge-label">
              {label}
            </text>
          </g>
        )
      })}

      {nodes.map((n) => {
        const lit = hover === n.id || (n.id !== 'hub' && hover === 'hub')
        return (
          <g
            key={n.id}
            className={`integration-flow__node ${lit ? 'integration-flow__node--lit' : ''}`}
            onMouseEnter={() => setHover(n.id)}
            onMouseLeave={() => setHover('hub')}
          >
            <circle cx={n.x} cy={n.y} r={n.r} className="integration-flow__ring" />
            {n.label.split('\n').map((line, i) => (
              <text key={line} x={n.x} y={n.y + i * 14 - (n.label.split('\n').length - 1) * 6} className="integration-flow__label">
                {line}
              </text>
            ))}
          </g>
        )
      })}
    </svg>
  )
}
