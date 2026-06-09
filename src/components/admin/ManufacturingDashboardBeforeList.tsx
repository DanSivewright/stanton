import type { CSSProperties } from 'react'
import type { BeforeListServerProps } from 'payload'
import { getPayload } from 'payload'

import config from '@payload-config'

const panelStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
  gap: '12px',
  marginBottom: '20px',
  padding: '16px',
  border: '1px solid var(--theme-elevation-150)',
  borderRadius: '4px',
  background: 'var(--theme-elevation-50)',
}

const statStyle: CSSProperties = {
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

export async function ManufacturingDashboardBeforeList(
  _props: BeforeListServerProps,
) {
  const payload = await getPayload({ config: await config })

  const [draftSnapshots, submittedSnapshots, activeOrders, machines] = await Promise.all([
    payload.find({
      collection: 'production-snapshots',
      limit: 0,
      where: { status: { equals: 'draft' } },
    }),
    payload.find({
      collection: 'production-snapshots',
      limit: 0,
      where: { status: { equals: 'submitted' } },
    }),
    payload.find({
      collection: 'manufacturing-orders',
      limit: 0,
      where: { status: { equals: 'active' } },
    }),
    payload.find({ collection: 'machines', limit: 200, depth: 0 }),
  ])

  const running = machines.docs.filter((m) => m.status === 'running').length
  const stopped = machines.docs.filter((m) => m.status === 'stopped').length
  const maintenance = machines.docs.filter((m) => m.status === 'maintenance').length

  return (
    <div style={panelStyle}>
      <div style={statStyle}>
        <div style={labelStyle}>Draft snapshots</div>
        <div style={valueStyle}>{draftSnapshots.totalDocs}</div>
      </div>
      <div style={statStyle}>
        <div style={labelStyle}>Submitted snapshots</div>
        <div style={valueStyle}>{submittedSnapshots.totalDocs}</div>
      </div>
      <div style={statStyle}>
        <div style={labelStyle}>Active MOs</div>
        <div style={valueStyle}>{activeOrders.totalDocs}</div>
      </div>
      <div style={statStyle}>
        <div style={labelStyle}>Machines running</div>
        <div style={valueStyle}>{running}</div>
      </div>
      <div style={statStyle}>
        <div style={labelStyle}>Stopped</div>
        <div style={valueStyle}>{stopped}</div>
      </div>
      <div style={statStyle}>
        <div style={labelStyle}>In maintenance</div>
        <div style={valueStyle}>{maintenance}</div>
      </div>
    </div>
  )
}
