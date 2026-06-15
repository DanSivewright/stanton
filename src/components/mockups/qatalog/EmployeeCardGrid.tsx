'use client'

import type { Employee } from '@/payload-types'
import { relLabel } from '@/lib/mockups/helpers'
import { QatalogAvatar } from './QatalogAvatar'
import { cn } from '@/utils/cn'

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
      <div className="rounded-xl border border-stroke-soft-200 px-6 py-12 text-center text-paragraph-md text-text-sub-600">
        No employees yet. Seed demo data to populate the directory.
      </div>
    )
  }

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-4">
      {employees.map((emp, i) => (
        <button
          key={emp.id}
          type="button"
          onClick={() => onSelect?.(emp.id)}
          className={cn(
            'rounded-xl border border-stroke-soft-200 bg-bg-white-0 p-6 text-left transition duration-200',
            'hover:border-stroke-strong-950 hover:shadow-regular-sm',
          )}
        >
          <QatalogAvatar name={emp.fullName} size="48" index={i} />
          <div className="mt-4 text-label-md font-medium tracking-tight text-text-strong-950">
            {emp.fullName}
          </div>
          <div className="mt-1 text-paragraph-sm text-text-sub-600">{emp.jobTitle ?? '—'}</div>
          <div className="mt-3 border-t border-stroke-soft-200 pt-3 text-paragraph-sm text-text-soft-400">
            {relLabel(emp.company)}
            {emp.team ? ` · ${relLabel(emp.team)}` : ''}
          </div>
        </button>
      ))}
    </div>
  )
}
