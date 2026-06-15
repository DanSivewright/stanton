'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import type { MockupCollectionSlug, MockupVariantSlug } from '@/lib/mockups/navigation'
import { createRecord, updateRecord } from '@/lib/mockups/actions'
import type { FormFieldDef } from '@/lib/mockups/form-config'
import type { RelationOption } from '@/lib/mockups/relations'
import { detailHref, listHref } from '@/lib/mockups/links'
import { SanaRecordFormFields } from '@/components/mockups/sana/SanaRecordFormFields'
import { FORM_STYLES } from './form-styles'
import * as Button from '@/components/ui/button'

type RecordFormProps = {
  variant: MockupVariantSlug
  slug: MockupCollectionSlug
  mode: 'create' | 'edit'
  fields: FormFieldDef[]
  initialValues: Record<string, unknown>
  relationOptions: Record<string, RelationOption[]>
  identifier?: string
}

export function RecordForm({
  variant,
  slug,
  mode,
  fields,
  initialValues,
  relationOptions,
  identifier,
}: RecordFormProps) {
  const router = useRouter()
  const [values, setValues] = useState<Record<string, unknown>>(() => {
    const defaults: Record<string, unknown> = {}
    for (const field of fields) {
      if (field.defaultValue !== undefined && initialValues[field.name] === undefined) {
        defaults[field.name] = field.defaultValue
      }
    }
    return { ...defaults, ...initialValues }
  })
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const styles = FORM_STYLES[variant]
  const isSana = variant === 'sana'

  function setField(name: string, value: unknown) {
    setValues((prev) => ({ ...prev, [name]: value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    startTransition(async () => {
      const result =
        mode === 'create'
          ? await createRecord(variant, slug, values)
          : await updateRecord(variant, slug, identifier!, values)

      if (!result.ok) {
        setError(result.error ?? 'Something went wrong')
        return
      }

      if (result.redirectTo) {
        router.push(result.redirectTo)
        router.refresh()
      }
    })
  }

  const cancelHref =
    mode === 'edit' && identifier
      ? detailHref(variant, slug, identifier)
      : listHref(variant, slug)

  if (isSana) {
    return (
      <form
        className="flex max-w-2xl flex-col gap-5 rounded-2xl bg-bg-white-0 p-6 shadow-regular-xs ring-1 ring-inset ring-stroke-soft-200"
        onSubmit={handleSubmit}
      >
        <SanaRecordFormFields
          fields={fields}
          values={values}
          relationOptions={relationOptions}
          mode={mode}
          onFieldChange={setField}
        />

        {error ? <p className="text-paragraph-sm text-error-base">{error}</p> : null}

        <div className="mt-2 flex flex-wrap gap-3">
          <Button.Root type="submit" variant="primary" mode="filled" size="medium" disabled={isPending}>
            {isPending ? 'Saving…' : mode === 'create' ? 'Create' : 'Save changes'}
          </Button.Root>
          <Button.Root variant="neutral" mode="stroke" size="medium" asChild>
            <Link href={cancelHref}>Cancel</Link>
          </Button.Root>
        </div>
      </form>
    )
  }

  return (
    <form style={styles.form} onSubmit={handleSubmit}>
      {fields.map((field) => (
        <div key={field.name} style={styles.fieldGroup}>
          <label htmlFor={`field-${field.name}`} style={styles.label}>
            {field.label}
            {field.required && mode === 'create' ? ' *' : ''}
          </label>

          {field.type === 'textarea' ? (
            <textarea
              id={`field-${field.name}`}
              style={styles.textarea}
              value={String(values[field.name] ?? '')}
              onChange={(e) => setField(field.name, e.target.value)}
              required={field.required && mode === 'create'}
              readOnly={field.readOnly}
              placeholder={field.placeholder}
            />
          ) : field.type === 'select' ? (
            <select
              id={`field-${field.name}`}
              style={styles.select}
              value={String(values[field.name] ?? '')}
              onChange={(e) => setField(field.name, e.target.value)}
              required={field.required && mode === 'create'}
            >
              <option value="">Select…</option>
              {field.options?.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          ) : field.type === 'relationship' ? (
            field.hasMany ? (
              <select
                id={`field-${field.name}`}
                style={styles.select}
                multiple
                value={(values[field.name] as string[]) ?? []}
                onChange={(e) =>
                  setField(
                    field.name,
                    Array.from(e.target.selectedOptions, (o) => o.value),
                  )
                }
              >
                {(relationOptions[field.name] ?? []).map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            ) : (
              <select
                id={`field-${field.name}`}
                style={styles.select}
                value={String(values[field.name] ?? '')}
                onChange={(e) => setField(field.name, e.target.value)}
                required={field.required && mode === 'create'}
              >
                <option value="">Select…</option>
                {(relationOptions[field.name] ?? []).map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            )
          ) : field.type === 'checkbox' ? (
            <input
              id={`field-${field.name}`}
              type="checkbox"
              style={styles.checkbox}
              checked={Boolean(values[field.name])}
              onChange={(e) => setField(field.name, e.target.checked)}
            />
          ) : field.type === 'password' ? (
            <input
              id={`field-${field.name}`}
              type="password"
              style={styles.input}
              value={String(values[field.name] ?? '')}
              onChange={(e) => setField(field.name, e.target.value)}
              required={field.required && mode === 'create'}
              autoComplete={mode === 'create' ? 'new-password' : 'off'}
            />
          ) : (
            <input
              id={`field-${field.name}`}
              type={field.type === 'email' ? 'email' : field.type === 'number' ? 'number' : field.type === 'date' ? 'date' : 'text'}
              style={styles.input}
              value={String(values[field.name] ?? '')}
              onChange={(e) =>
                setField(field.name, field.type === 'number' ? e.target.value : e.target.value)
              }
              required={field.required && mode === 'create'}
              readOnly={field.readOnly}
              placeholder={field.placeholder}
            />
          )}

          {field.helpText ? (
            <span style={{ fontSize: 12, color: '#94a3b8' }}>{field.helpText}</span>
          ) : null}
        </div>
      ))}

      {error ? <p style={styles.error}>{error}</p> : null}

      <div style={styles.actions}>
        <button type="submit" style={styles.submit} disabled={isPending}>
          {isPending ? 'Saving…' : mode === 'create' ? 'Create' : 'Save changes'}
        </button>
        <Link href={cancelHref} style={styles.cancel}>
          Cancel
        </Link>
      </div>
    </form>
  )
}
