'use client'

import React, { useEffect, useState } from 'react'

import { dataLayers } from '@/lib/stakeholder/internal-content'

export function DataLayersSvg() {
  const [active, setActive] = useState(0)

  useEffect(() => {
    const id = window.setInterval(() => setActive((a) => (a + 1) % dataLayers.length), 3200)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="data-layers">
      <svg viewBox="0 0 720 280" className="team-svg data-layers__svg" role="img" aria-label="Data model layers">
        {dataLayers.map((layer, i) => {
          const y = 24 + i * 48
          const lit = i === active
          return (
            <g
              key={layer.id}
              className={`data-layers__row ${lit ? 'data-layers__row--active' : ''}`}
              onMouseEnter={() => setActive(i)}
            >
              <rect
                x={24}
                y={y}
                width={672}
                height={40}
                rx={10}
                fill={lit ? layer.color : 'rgba(255,255,255,0.03)'}
                fillOpacity={lit ? 0.22 : 1}
                stroke={lit ? layer.color : 'rgba(255,255,255,0.08)'}
                strokeWidth={lit ? 2 : 1}
                className="data-layers__bar"
              />
              <text x={44} y={y + 18} className="data-layers__construct">
                {layer.construct}
              </text>
              <text x={200} y={y + 18} className="data-layers__label">
                {layer.label}
              </text>
              <text x={200} y={y + 32} className="data-layers__examples">
                {layer.examples}
              </text>
              <circle cx={680} cy={y + 20} r={6} fill={layer.color} className="data-layers__dot" />
            </g>
          )
        })}
      </svg>
      <ul className="data-layers__legend">
        {dataLayers.map((l, i) => (
          <li key={l.id}>
            <button
              type="button"
              className={i === active ? 'is-active' : ''}
              onClick={() => setActive(i)}
            >
              <span style={{ background: l.color }} />
              {l.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
