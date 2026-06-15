'use client'

import Link from 'next/link'
import React, { useEffect, useState } from 'react'

import { OeeBar, PlatformShell } from '@/components/platform-demo/PlatformShell'
import { machines, formatPct } from '@/lib/platform-demo/mock-data'

export default function TvDisplayPage() {
  const [clock, setClock] = useState(new Date())

  useEffect(() => {
    const t = setInterval(() => setClock(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  const running = machines.filter((m) => m.status === 'running').length
  const avgOee = machines.reduce((s, m) => s + m.oee, 0) / machines.length
  const top3 = [...machines].sort((a, b) => b.oee - a.oee).slice(0, 3)
  const bottom3 = [...machines].sort((a, b) => a.oee - b.oee).slice(0, 3)

  const byFactory = machines.reduce<Record<string, typeof machines>>((acc, m) => {
    const key = m.factory.split(' —')[0]
    if (!acc[key]) acc[key] = []
    acc[key].push(m)
    return acc
  }, {})

  return (
    <PlatformShell
      tvMode
      title="Factory Floor Display"
      subtitle={clock.toLocaleString('en-ZA', { weekday: 'long', hour: '2-digit', minute: '2-digit', second: '2-digit' })}
      actions={
        <Link href="/platform/manufacturing" className="p-btn p-btn--secondary p-btn--sm" style={{ color: '#e8ecf2' }}>
          Exit TV Mode
        </Link>
      }
    >
      <div className="p-stats" style={{ marginBottom: 32 }}>
        <div className="p-stat" style={{ background: '#121820', borderColor: '#1e2836', color: '#e8ecf2' }}>
          <div className="p-stat__label" style={{ color: '#6b7d94' }}>Running</div>
          <div className="p-stat__value">{running} / {machines.length}</div>
        </div>
        <div className="p-stat" style={{ background: '#121820', borderColor: '#1e2836', color: '#e8ecf2' }}>
          <div className="p-stat__label" style={{ color: '#6b7d94' }}>Group OEE</div>
          <div className="p-stat__value" style={{ color: avgOee >= 70 ? '#4ade80' : avgOee >= 60 ? '#fbbf24' : '#f87171' }}>
            {formatPct(avgOee)}
          </div>
        </div>
        <div className="p-stat" style={{ background: '#121820', borderColor: '#1e2836', color: '#e8ecf2' }}>
          <div className="p-stat__label" style={{ color: '#6b7d94' }}>Benchmark</div>
          <div className="p-stat__value">70%</div>
        </div>
      </div>

      <div className="p-tv-grid">
        <div className="p-tv-panel">
          <h2>Top 3 — Best Performance</h2>
          {top3.map((m, i) => (
            <div key={m.id} className="p-tv-rank">
              <span className="p-tv-rank__pos p-tv-rank__pos--top">{i + 1}</span>
              <div style={{ flex: 1 }}>
                <strong style={{ color: '#e8ecf2' }}>{m.code}</strong>
                <div style={{ fontSize: '0.8rem', color: '#6b7d94' }}>{m.product}</div>
                <OeeBar value={m.oee} />
              </div>
              <strong style={{ color: '#4ade80', fontSize: '1.2rem' }}>{formatPct(m.oee)}</strong>
            </div>
          ))}
        </div>

        <div className="p-tv-panel">
          <h2>Bottom 3 — Needs Attention</h2>
          {bottom3.map((m, i) => (
            <div key={m.id} className="p-tv-rank">
              <span className="p-tv-rank__pos p-tv-rank__pos--bottom">{i + 1}</span>
              <div style={{ flex: 1 }}>
                <strong style={{ color: '#e8ecf2' }}>{m.code}</strong>
                <div style={{ fontSize: '0.8rem', color: '#6b7d94' }}>{m.product} · {m.status}</div>
                <OeeBar value={m.oee} />
              </div>
              <strong style={{ color: '#f87171', fontSize: '1.2rem' }}>{formatPct(m.oee)}</strong>
            </div>
          ))}
        </div>
      </div>

      <div className="p-mt" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, marginTop: 32 }}>
        {Object.entries(byFactory).map(([factory, list]) => (
          <div key={factory} className="p-tv-panel">
            <h2>{factory}</h2>
            {list.slice(0, 5).map((m) => (
              <div key={m.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: '0.85rem', borderBottom: '1px solid #1e2836' }}>
                <span style={{ color: '#e8ecf2' }}>{m.code}</span>
                <span style={{ color: m.oee >= 70 ? '#4ade80' : m.oee >= 60 ? '#fbbf24' : '#f87171' }}>{formatPct(m.oee)}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </PlatformShell>
  )
}
