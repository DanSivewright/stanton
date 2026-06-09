import type { CSSProperties } from 'react'
import type { BeforeListServerProps } from 'payload'
import { getPayload } from 'payload'

import config from '@payload-config'

const panelStyle: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '12px',
  marginBottom: '20px',
  padding: '16px',
  border: '1px solid var(--theme-elevation-150)',
  borderRadius: '4px',
  background: 'var(--theme-elevation-50)',
}

const statStyle: CSSProperties = {
  flex: '1 1 140px',
  padding: '12px',
  borderRadius: '4px',
  background: 'var(--theme-elevation-0)',
  border: '1px solid var(--theme-elevation-100)',
}

const labelStyle: CSSProperties = {
  fontSize: '12px',
  color: 'var(--theme-elevation-500)',
  marginBottom: '4px',
}

const valueStyle: CSSProperties = {
  fontSize: '22px',
  fontWeight: 600,
}

export async function SpdWorkflowBeforeList(_props: BeforeListServerProps) {
  const payload = await getPayload({ config: await config })

  const [projects, signOffs] = await Promise.all([
    payload.find({ collection: 'spd-projects', limit: 200, depth: 0 }),
    payload.find({
      collection: 'spd-gate-sign-offs',
      limit: 0,
      where: { decision: { equals: 'approved' } },
    }),
  ])

  const onTrack = projects.docs.filter((p) => p.onTrack !== false).length
  const behind = projects.docs.filter((p) => p.onTrack === false).length
  const phases = new Map<string, number>()

  for (const project of projects.docs) {
    const phase = project.currentPhase ?? 'unknown'
    phases.set(phase, (phases.get(phase) ?? 0) + 1)
  }

  const topPhases = [...phases.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([phase, count]) => `${phase} (${count})`)
    .join(' · ')

  return (
    <div style={panelStyle}>
      <div style={statStyle}>
        <div style={labelStyle}>Open projects</div>
        <div style={valueStyle}>{projects.totalDocs}</div>
      </div>
      <div style={statStyle}>
        <div style={labelStyle}>On track</div>
        <div style={valueStyle}>{onTrack}</div>
      </div>
      <div style={statStyle}>
        <div style={labelStyle}>Behind</div>
        <div style={valueStyle}>{behind}</div>
      </div>
      <div style={statStyle}>
        <div style={labelStyle}>Gate approvals</div>
        <div style={valueStyle}>{signOffs.totalDocs}</div>
      </div>
      <div style={{ ...statStyle, flex: '2 1 240px' }}>
        <div style={labelStyle}>Top phases</div>
        <div style={{ fontSize: '14px', fontWeight: 500 }}>{topPhases || '—'}</div>
      </div>
    </div>
  )
}
