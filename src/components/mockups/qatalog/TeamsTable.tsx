'use client'

import type { MaintenanceTeam } from '@/payload-types'
import { relLabel } from '@/lib/mockups/helpers'
import { QatalogAvatar } from './QatalogAvatar'
import * as AvatarGroupCompact from '@/components/ui/avatar-group-compact'
import * as Table from '@/components/ui/table'
import { RiArrowRightSLine } from '@remixicon/react'
import { cn } from '@/utils/cn'

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
      <div className="rounded-xl border border-stroke-soft-200 px-6 py-12 text-center text-paragraph-md text-text-sub-600">
        No maintenance teams yet. Seed demo data to populate teams.
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-xl ring-1 ring-stroke-soft-200">
      <Table.Root>
        <Table.Header>
          <tr>
            <Table.Head>Team</Table.Head>
            <Table.Head>Company</Table.Head>
            <Table.Head>Members</Table.Head>
            <Table.Head className="w-10" />
          </tr>
        </Table.Header>
        <Table.Body>
          {teams.map((team, rowIndex) => {
            const names = memberNames(team)
            return (
              <Table.Row
                key={team.id}
                onClick={() => onSelect?.(team.id)}
                className={cn(onSelect && 'cursor-pointer')}
              >
                <Table.Cell className="font-medium text-text-strong-950">{team.name}</Table.Cell>
                <Table.Cell className="text-text-sub-600">{relLabel(team.company)}</Table.Cell>
                <Table.Cell>
                  {names.length > 0 ? (
                    <span className="inline-flex items-center gap-3">
                      <AvatarGroupCompact.Root size="32" variant="stroke">
                        <AvatarGroupCompact.Stack>
                          {names.slice(0, 4).map((name, i) => (
                            <QatalogAvatar key={`${name}-${i}`} name={name} size="32" index={i} />
                          ))}
                        </AvatarGroupCompact.Stack>
                        {names.length > 4 ? (
                          <AvatarGroupCompact.Overflow>+{names.length - 4}</AvatarGroupCompact.Overflow>
                        ) : null}
                      </AvatarGroupCompact.Root>
                      <span className="text-paragraph-sm text-text-sub-600">
                        {names.length} {names.length === 1 ? 'member' : 'members'}
                      </span>
                    </span>
                  ) : (
                    <span className="text-text-soft-400">No members</span>
                  )}
                </Table.Cell>
                <Table.Cell className="text-text-soft-400">
                  <RiArrowRightSLine className="size-5" />
                </Table.Cell>
                {rowIndex < teams.length - 1 ? <Table.RowDivider /> : null}
              </Table.Row>
            )
          })}
        </Table.Body>
      </Table.Root>
    </div>
  )
}
