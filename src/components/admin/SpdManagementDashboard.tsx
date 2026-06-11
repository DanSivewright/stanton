import type { CSSProperties } from 'react'
import type { AdminViewServerProps } from 'payload'

import {
  buildPhasePipeline,
  getLastSignOffDate,
  getPhaseLabel,
  isActiveProject,
  isGatePendingForProject,
  type SpdGateSignOffSummary,
} from '@/lib/spd/managementDashboard'

const panelStyle: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '12px',
  marginBottom: '24px',
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

const tableStyle: CSSProperties = {
  width: '100%',
  borderCollapse: 'collapse',
  fontSize: '14px',
}

const thStyle: CSSProperties = {
  textAlign: 'left',
  padding: '10px 12px',
  borderBottom: '2px solid var(--theme-elevation-150)',
  color: 'var(--theme-elevation-800)',
}

const tdStyle: CSSProperties = {
  padding: '10px 12px',
  borderBottom: '1px solid var(--theme-elevation-100)',
}

const filterLinkStyle = (active: boolean): CSSProperties => ({
  padding: '6px 12px',
  borderRadius: '4px',
  border: '1px solid var(--theme-elevation-150)',
  background: active ? 'var(--theme-elevation-150)' : 'var(--theme-elevation-0)',
  color: 'var(--theme-elevation-800)',
  textDecoration: 'none',
  fontSize: '13px',
  fontWeight: active ? 600 : 400,
})

const pipelineChipStyle: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '8px',
  padding: '8px 12px',
  borderRadius: '4px',
  border: '1px solid var(--theme-elevation-100)',
  background: 'var(--theme-elevation-0)',
  fontSize: '13px',
}

function formatDate(value: string | null | undefined): string {
  if (!value) return '—'
  return new Date(value).toLocaleDateString()
}

export async function SpdManagementDashboard({
  initPageResult,
  viewType,
}: AdminViewServerProps) {
  const { req } = initPageResult
  const showAll = viewType === 'managementAll'

  const [projectsResult, signOffsResult] = await Promise.all([
    req.payload.find({
      collection: 'spd-projects',
      limit: 500,
      depth: 1,
      sort: '-updatedAt',
      req,
    }),
    req.payload.find({
      collection: 'spd-gate-sign-offs',
      limit: 2000,
      depth: 0,
      sort: '-createdAt',
      req,
    }),
  ])

  const signOffsByProject = new Map<string | number, SpdGateSignOffSummary[]>()

  for (const signOff of signOffsResult.docs) {
    const projectId =
      typeof signOff.project === 'object' && signOff.project !== null
        ? signOff.project.id
        : signOff.project

    if (!projectId) continue

    const list = signOffsByProject.get(projectId) ?? []
    list.push({
      projectId,
      gateId: signOff.gateId,
      decision: signOff.decision,
      createdAt: signOff.createdAt,
    })
    signOffsByProject.set(projectId, list)
  }

  const allProjects = projectsResult.docs.map((project) => {
    const phases = project.processSnapshot?.phases
    const currentPhaseId = project.currentPhase ?? '—'
    const projectSignOffs = signOffsByProject.get(project.id) ?? []
    const approvedGateIds = new Set(
      projectSignOffs
        .filter((entry) => entry.decision === 'approved')
        .map((entry) => entry.gateId),
    )
    const gateStatus = isGatePendingForProject(
      phases,
      project.currentPhase,
      approvedGateIds,
    )

    const customer =
      typeof project.customer === 'object' && project.customer !== null
        ? project.customer.name
        : '—'

    return {
      id: project.id,
      name: project.name,
      customerName: customer,
      currentPhaseId,
      currentPhaseLabel: getPhaseLabel(phases, project.currentPhase),
      onTrack: project.onTrack !== false,
      gatePending: gateStatus.pending,
      gateLabel: gateStatus.gateName,
      lastSignOffDate: getLastSignOffDate(projectSignOffs),
      isActive: isActiveProject(project.actualEndDate),
    }
  })

  const visibleProjects = showAll
    ? allProjects
    : allProjects.filter((project) => project.isActive)

  const onTrackCount = visibleProjects.filter((project) => project.onTrack).length
  const behindCount = visibleProjects.filter((project) => !project.onTrack).length
  const gatePendingCount = visibleProjects.filter((project) => project.gatePending).length
  const visibleProjectIds = new Set(visibleProjects.map((project) => project.id))
  const pipeline = buildPhasePipeline(
    projectsResult.docs.filter((doc) => visibleProjectIds.has(doc.id)),
  )

  return (
    <div style={{ padding: '24px' }}>
      <h1 style={{ margin: '0 0 8px', fontSize: '24px' }}>SPD management dashboard</h1>
      <p style={{ margin: '0 0 16px', color: 'var(--theme-elevation-500)' }}>
        Open projects, track status, gate queue, and pipeline by phase.
      </p>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        <a
          href="/admin/collections/spd-projects/management"
          style={filterLinkStyle(!showAll)}
        >
          Active projects
        </a>
        <a
          href="/admin/collections/spd-projects/management/all"
          style={filterLinkStyle(showAll)}
        >
          All projects
        </a>
        <a
          href="/admin/collections/spd-projects/workflow"
          style={{
            ...filterLinkStyle(false),
            marginLeft: 'auto',
            border: 'none',
            background: 'transparent',
            color: 'var(--theme-elevation-500)',
          }}
        >
          Workflow view →
        </a>
      </div>

      <div style={panelStyle}>
        <div style={statStyle}>
          <div style={labelStyle}>Projects</div>
          <div style={valueStyle}>{visibleProjects.length}</div>
        </div>
        <div style={statStyle}>
          <div style={labelStyle}>On track</div>
          <div style={valueStyle}>{onTrackCount}</div>
        </div>
        <div style={statStyle}>
          <div style={labelStyle}>Behind</div>
          <div style={valueStyle}>{behindCount}</div>
        </div>
        <div style={statStyle}>
          <div style={labelStyle}>Gate pending</div>
          <div style={valueStyle}>{gatePendingCount}</div>
        </div>
      </div>

      <h2 style={{ margin: '0 0 12px', fontSize: '16px' }}>Pipeline by phase</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px' }}>
        {pipeline.length === 0 ? (
          <span style={{ color: 'var(--theme-elevation-500)' }}>No projects in this view.</span>
        ) : (
          pipeline.map((entry) => (
            <span key={entry.phaseId} style={pipelineChipStyle}>
              <span>{entry.label}</span>
              <strong>{entry.count}</strong>
            </span>
          ))
        )}
      </div>

      <h2 style={{ margin: '0 0 12px', fontSize: '16px' }}>Projects</h2>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Project</th>
            <th style={thStyle}>Customer</th>
            <th style={thStyle}>Current phase</th>
            <th style={thStyle}>Status</th>
            <th style={thStyle}>Gate pending</th>
            <th style={thStyle}>Last sign-off</th>
          </tr>
        </thead>
        <tbody>
          {visibleProjects.map((project) => (
            <tr key={project.id}>
              <td style={tdStyle}>
                <a href={`/admin/collections/spd-projects/${project.id}`}>{project.name}</a>
              </td>
              <td style={tdStyle}>{project.customerName}</td>
              <td style={tdStyle}>{project.currentPhaseLabel}</td>
              <td style={tdStyle}>
                {project.onTrack ? 'On track' : 'Behind'}
              </td>
              <td style={tdStyle}>
                {project.gatePending
                  ? project.gateLabel ?? 'Yes'
                  : '—'}
              </td>
              <td style={tdStyle}>{formatDate(project.lastSignOffDate)}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {visibleProjects.length === 0 ? (
        <p style={{ color: 'var(--theme-elevation-500)' }}>
          {showAll ? 'No SPD projects yet.' : 'No active SPD projects.'}
        </p>
      ) : null}
    </div>
  )
}
