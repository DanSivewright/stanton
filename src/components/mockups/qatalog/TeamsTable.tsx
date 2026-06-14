'use client'

import type { MaintenanceTeam } from '@/payload-types'
import { relLabel } from '@/lib/mockups/helpers'
import { qatalog } from './tokens'
import { AvatarStack } from './ui'
import { IconChevronRight } from './icons'

type TeamDoc = MaintenanceTeam & { id: string }

function memberNames(team: TeamDoc): string[] {
  return (team.members ?? []).map((m) =>
    typeof m === 'object' && m ? m.fullName : relLabel(m),
  )
}

export function TeamsTable({
  teams,
  onSelect,
}: {
  teams: TeamDoc[]
  onSelect?: (id: string) => void
}) {
  if (teams.length === 0) {
    return (
      <div style={{ padding: 48, textAlign: 'center', color: qatalog.textSecondary }}>
        No maintenance teams yet. Seed demo data to populate teams.
      </div>
    )
  }

  return (
    <div style={{ border: `1px solid ${qatalog.border}`, borderRadius: 12, overflow: 'hidden' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
        <thead>
          <tr style={{ background: qatalog.bgMuted, borderBottom: `1px solid ${qatalog.border}` }}>
            {['Team', 'Company', 'Members', ''].map((h) => (
              <th
                key={h}
                style={{
                  textAlign: 'left',
                  padding: '12px 20px',
                  fontWeight: 500,
                  fontSize: 12,
                  color: qatalog.textMuted,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  width: h === '' ? 40 : undefined,
                }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {teams.map((team) => {
            const names = memberNames(team)
            return (
              <tr
                key={team.id}
                onClick={() => onSelect?.(team.id)}
                style={{
                  borderBottom: `1px solid ${qatalog.border}`,
                  cursor: onSelect ? 'pointer' : 'default',
                  transition: 'background 0.12s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = qatalog.bgHover
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent'
                }}
              >
                <td style={{ padding: '16px 20px', fontWeight: 500 }}>{team.name}</td>
                <td style={{ padding: '16px 20px', color: qatalog.textSecondary }}>
                  {relLabel(team.company)}
                </td>
                <td style={{ padding: '16px 20px' }}>
                  {names.length > 0 ? (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
                      <AvatarStack names={names} />
                      <span style={{ color: qatalog.textSecondary, fontSize: 13 }}>
                        {names.length} {names.length === 1 ? 'member' : 'members'}
                      </span>
                    </span>
                  ) : (
                    <span style={{ color: qatalog.textMuted }}>No members</span>
                  )}
                </td>
                <td style={{ padding: '16px 20px', color: qatalog.textMuted }}>
                  <IconChevronRight size={16} />
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
