'use client'

import React from 'react'

export function OrgTreeSvg() {
  return (
    <svg viewBox="0 0 640 320" className="team-svg org-tree" role="img" aria-label="Organisation hierarchy">
      <defs>
        <linearGradient id="org-line" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--team-accent)" stopOpacity="0.8" />
          <stop offset="100%" stopColor="var(--team-accent)" stopOpacity="0.2" />
        </linearGradient>
      </defs>

      <g className="org-tree__pulse">
        <rect x="270" y="16" width="100" height="44" rx="8" className="org-tree__node org-tree__node--root" />
        <text x="320" y="44" className="org-tree__label">
          Group
        </text>
        <text x="320" y="56" className="org-tree__slug">
          groups
        </text>
      </g>

      <line x1="320" y1="60" x2="320" y2="88" stroke="url(#org-line)" strokeWidth="2" className="org-tree__edge" />

      <g className="org-tree__row">
        <rect x="120" y="92" width="120" height="48" rx="8" className="org-tree__node" />
        <text x="180" y="118" className="org-tree__label">
          Company
        </text>
        <text x="180" y="130" className="org-tree__slug">
          companies
        </text>

        <rect x="400" y="92" width="120" height="48" rx="8" className="org-tree__node" />
        <text x="460" y="118" className="org-tree__label">
          Company
        </text>
        <text x="460" y="130" className="org-tree__slug">
          PIMMS JHB · …
        </text>
      </g>

      <line x1="180" y1="140" x2="180" y2="168" stroke="url(#org-line)" strokeWidth="2" />
      <line x1="460" y1="140" x2="460" y2="168" stroke="url(#org-line)" strokeWidth="2" />

      <rect x="60" y="172" width="100" height="44" rx="8" className="org-tree__node org-tree__node--sm" />
      <text x="110" y="198" className="org-tree__label">
        Site
      </text>
      <text x="110" y="208" className="org-tree__slug">
        sites
      </text>

      <rect x="200" y="172" width="120" height="44" rx="8" className="org-tree__node org-tree__node--sm" />
      <text x="260" y="198" className="org-tree__label">
        Department
      </text>

      <rect x="380" y="172" width="100" height="44" rx="8" className="org-tree__node org-tree__node--sm" />
      <text x="430" y="198" className="org-tree__label">
        Site
      </text>

      <rect x="500" y="172" width="100" height="44" rx="8" className="org-tree__node org-tree__node--sm" />
      <text x="550" y="198" className="org-tree__label">
        Team
      </text>

      <line x1="110" y1="216" x2="110" y2="244" stroke="url(#org-line)" strokeWidth="1.5" />
      <rect x="40" y="248" width="140" height="52" rx="8" className="org-tree__node org-tree__node--accent" />
      <text x="110" y="274" className="org-tree__label">
        Employee
      </text>
      <text x="110" y="288" className="org-tree__slug">
        employeeId → all modules
      </text>

      <rect x="360" y="248" width="140" height="52" rx="8" className="org-tree__node org-tree__node--machine" />
      <text x="430" y="274" className="org-tree__label">
        Machine (~40)
      </text>
      <text x="430" y="288" className="org-tree__slug">
        machines → site
      </text>
    </svg>
  )
}
