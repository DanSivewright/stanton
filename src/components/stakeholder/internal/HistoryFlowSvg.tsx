'use client'

import React from 'react'

const patterns = [
  { title: 'Current-state', desc: 'Employee, Machine, Product, Company', x: 80 },
  { title: 'Snapshot', desc: 'Planning change, finance period, SPD template copy', x: 280 },
  { title: 'Event', desc: 'Gate sign-off, stoppage, activity event', x: 480 },
  { title: 'Status + transition', desc: 'Maintenance job, HR review, import job', x: 600 },
]

export function HistoryFlowSvg() {
  return (
    <svg viewBox="0 0 720 120" className="team-svg history-flow" role="img" aria-label="History patterns">
      <line x1="40" y1="60" x2="680" y2="60" className="history-flow__track" />
      {patterns.map((p, i) => (
        <g key={p.title} className="history-flow__step" style={{ animationDelay: `${i * 200}ms` }}>
          <circle cx={p.x} cy={60} r={14} className="history-flow__dot" />
          <text x={p.x} y={32} className="history-flow__title">
            {p.title}
          </text>
          <text x={p.x} y={92} className="history-flow__desc">
            {p.desc}
          </text>
        </g>
      ))}
    </svg>
  )
}
