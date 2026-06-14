'use client'

import type { Employee } from '@/payload-types'
import { relLabel } from '@/lib/mockups/helpers'
import { qatalog } from './tokens'
import { Avatar } from './ui'

type EmployeeDoc = Employee & { id: string }

export function EmployeeCardGrid({
  employees,
  onSelect,
}: {
  employees: EmployeeDoc[]
  onSelect?: (id: string) => void
}) {
  if (employees.length === 0) {
    return (
      <div style={{ padding: 48, textAlign: 'center', color: qatalog.textSecondary }}>
        No employees yet. Seed demo data to populate the directory.
      </div>
    )
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
        gap: 16,
      }}
    >
      {employees.map((emp, i) => (
        <button
          key={emp.id}
          type="button"
          onClick={() => onSelect?.(emp.id)}
          style={{
            padding: 24,
            border: `1px solid ${qatalog.border}`,
            borderRadius: 12,
            background: qatalog.bg,
            textAlign: 'left',
            cursor: 'pointer',
            fontFamily: 'inherit',
            transition: 'border-color 0.15s, box-shadow 0.15s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = qatalog.borderStrong
            e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.04)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = qatalog.border
            e.currentTarget.style.boxShadow = 'none'
          }}
        >
          <Avatar name={emp.fullName} size={44} index={i} />
          <div style={{ marginTop: 16, fontSize: 16, fontWeight: 500, letterSpacing: '-0.01em' }}>
            {emp.fullName}
          </div>
          <div style={{ marginTop: 4, fontSize: 14, color: qatalog.textSecondary }}>
            {emp.jobTitle ?? '—'}
          </div>
          <div
            style={{
              marginTop: 12,
              paddingTop: 12,
              borderTop: `1px solid ${qatalog.border}`,
              fontSize: 13,
              color: qatalog.textMuted,
            }}
          >
            {relLabel(emp.company)}
            {emp.team ? ` · ${relLabel(emp.team)}` : ''}
          </div>
        </button>
      ))}
    </div>
  )
}
