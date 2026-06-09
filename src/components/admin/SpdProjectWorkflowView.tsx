import type { CSSProperties } from 'react'
import type { AdminViewServerProps } from 'payload'

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

export async function SpdProjectWorkflowView({
  initPageResult,
}: AdminViewServerProps) {
  const { req } = initPageResult

  const projects = await req.payload.find({
    collection: 'spd-projects',
    limit: 100,
    depth: 1,
    sort: '-updatedAt',
    req,
  })

  return (
    <div style={{ padding: '24px' }}>
      <h1 style={{ margin: '0 0 8px', fontSize: '24px' }}>SPD project workflow</h1>
      <p style={{ margin: '0 0 20px', color: 'var(--theme-elevation-500)' }}>
        Pipeline view — phase, track status, and customer at a glance.
      </p>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Project</th>
            <th style={thStyle}>Customer</th>
            <th style={thStyle}>Current phase</th>
            <th style={thStyle}>On track</th>
            <th style={thStyle}>Updated</th>
          </tr>
        </thead>
        <tbody>
          {projects.docs.map((project) => {
            const customer =
              typeof project.customer === 'object' && project.customer !== null
                ? project.customer.name
                : '—'

            return (
              <tr key={project.id}>
                <td style={tdStyle}>
                  <a href={`/admin/collections/spd-projects/${project.id}`}>{project.name}</a>
                </td>
                <td style={tdStyle}>{customer}</td>
                <td style={tdStyle}>{project.currentPhase ?? '—'}</td>
                <td style={tdStyle}>{project.onTrack === false ? 'Behind' : 'On track'}</td>
                <td style={tdStyle}>
                  {project.updatedAt
                    ? new Date(project.updatedAt).toLocaleDateString()
                    : '—'}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
      {projects.totalDocs === 0 ? (
        <p style={{ color: 'var(--theme-elevation-500)' }}>No SPD projects yet.</p>
      ) : null}
    </div>
  )
}
