import type { CSSProperties } from 'react'
import type { BeforeListServerProps } from 'payload'
import { getPayload } from 'payload'

import config from '@payload-config'

const panelStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
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

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-ZA', {
    style: 'currency',
    currency: 'ZAR',
    maximumFractionDigits: 0,
  }).format(amount)
}

export async function SalesDashboardBeforeList(_props: BeforeListServerProps) {
  const payload = await getPayload({ config: await config })

  const periods = await payload.find({
    collection: 'sales-performance-periods',
    limit: 1,
    sort: '-year,-month',
    depth: 0,
  })

  const latestPeriod = periods.docs[0]
  if (!latestPeriod) {
    return (
      <div style={panelStyle}>
        <div style={statStyle}>
          <div style={labelStyle}>Sales performance</div>
          <div style={{ fontSize: '14px' }}>No performance periods yet.</div>
        </div>
      </div>
    )
  }

  const periodId = latestPeriod.id

  const [targets, actuals, activities] = await Promise.all([
    payload.find({
      collection: 'sales-targets',
      where: { period: { equals: periodId } },
      limit: 200,
      depth: 0,
    }),
    payload.find({
      collection: 'sales-actuals',
      where: { period: { equals: periodId } },
      limit: 200,
      depth: 0,
    }),
    payload.find({
      collection: 'sales-activities',
      where: { period: { equals: periodId } },
      limit: 200,
      depth: 0,
    }),
  ])

  const targetRevenue = targets.docs.reduce((sum, row) => sum + (row.revenueTarget ?? 0), 0)
  const actualRevenue = actuals.docs.reduce((sum, row) => sum + (row.actualAmount ?? 0), 0)
  const revenueGap = actualRevenue - targetRevenue
  const attainmentPct =
    targetRevenue > 0 ? Math.round((actualRevenue / targetRevenue) * 100) : null

  const huntVisits = activities.docs
    .filter((row) => row.activityType === 'hunt')
    .reduce((sum, row) => sum + (row.careVisits ?? 0), 0)

  const careVisits = activities.docs
    .filter((row) => row.activityType === 'care')
    .reduce((sum, row) => sum + (row.careVisits ?? 0), 0)

  return (
    <div style={panelStyle}>
      <div style={{ ...statStyle, gridColumn: '1 / -1' }}>
        <div style={labelStyle}>Latest period</div>
        <div style={{ fontSize: '16px', fontWeight: 600 }}>{latestPeriod.label}</div>
      </div>
      <div style={statStyle}>
        <div style={labelStyle}>Revenue target</div>
        <div style={valueStyle}>{formatCurrency(targetRevenue)}</div>
      </div>
      <div style={statStyle}>
        <div style={labelStyle}>Revenue actual</div>
        <div style={valueStyle}>{formatCurrency(actualRevenue)}</div>
      </div>
      <div style={statStyle}>
        <div style={labelStyle}>Gap</div>
        <div
          style={{
            ...valueStyle,
            color: revenueGap >= 0 ? 'var(--theme-success-500)' : 'var(--theme-error-500)',
          }}
        >
          {formatCurrency(revenueGap)}
        </div>
      </div>
      <div style={statStyle}>
        <div style={labelStyle}>Attainment</div>
        <div style={valueStyle}>{attainmentPct !== null ? `${attainmentPct}%` : '—'}</div>
      </div>
      <div style={statStyle}>
        <div style={labelStyle}>Hunt visits</div>
        <div style={valueStyle}>{huntVisits}</div>
      </div>
      <div style={statStyle}>
        <div style={labelStyle}>Care visits</div>
        <div style={valueStyle}>{careVisits}</div>
      </div>
      <div style={statStyle}>
        <div style={labelStyle}>Reps tracked</div>
        <div style={valueStyle}>{targets.totalDocs}</div>
      </div>
    </div>
  )
}
