'use client'

import type { FormFieldDef } from '@/lib/mockups/form-config'
import type { RelationOption } from '@/lib/mockups/relations'
import * as Checkbox from '@/components/ui/checkbox'
import * as Hint from '@/components/ui/hint'
import * as Input from '@/components/ui/input'
import * as Label from '@/components/ui/label'
import * as Select from '@/components/ui/select'
import * as Textarea from '@/components/ui/textarea'

type SanaRecordFormFieldsProps = {
  fields: FormFieldDef[]
  values: Record<string, unknown>
  relationOptions: Record<string, RelationOption[]>
  mode: 'create' | 'edit'
  onFieldChange: (name: string, value: unknown) => void
}

function inputType(field: FormFieldDef) {
  if (field.type === 'email') return 'email'
  if (field.type === 'number') return 'number'
  if (field.type === 'date') return 'date'
  if (field.type === 'password') return 'password'
  return 'text'
}

export function SanaRecordFormFields({
  fields,
  values,
  relationOptions,
  mode,
  onFieldChange,
}: SanaRecordFormFieldsProps) {
  return (
    <>
      {fields.map((field) => (
        <div key={field.name} className="flex flex-col gap-1.5">
          {field.type === 'checkbox' ? (
            <div className="flex items-center gap-2">
              <Checkbox.Root
                id={`field-${field.name}`}
                checked={Boolean(values[field.name])}
                onCheckedChange={(checked) => onFieldChange(field.name, checked === true)}
              />
              <Label.Root htmlFor={`field-${field.name}`}>{field.label}</Label.Root>
            </div>
          ) : (
            <>
              <Label.Root htmlFor={`field-${field.name}`}>
                {field.label}
                {field.required && mode === 'create' ? <Label.Asterisk /> : null}
              </Label.Root>

              {field.type === 'textarea' ? (
                <Textarea.Root
                  simple
                  id={`field-${field.name}`}
                  value={String(values[field.name] ?? '')}
                  onChange={(e) => onFieldChange(field.name, e.target.value)}
                  required={field.required && mode === 'create'}
                  readOnly={field.readOnly}
                  placeholder={field.placeholder}
                />
              ) : field.type === 'select' ? (
                <Select.Root
                  value={String(values[field.name] ?? '') || undefined}
                  onValueChange={(value) => onFieldChange(field.name, value)}
                >
                  <Select.Trigger id={`field-${field.name}`} className="w-full">
                    <Select.Value placeholder="Select…" />
                  </Select.Trigger>
                  <Select.Content>
                    {field.options?.map((opt) => (
                      <Select.Item key={opt.value} value={opt.value}>
                        {opt.label}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Root>
              ) : field.type === 'relationship' && !field.hasMany ? (
                <Select.Root
                  value={String(values[field.name] ?? '') || undefined}
                  onValueChange={(value) => onFieldChange(field.name, value)}
                >
                  <Select.Trigger id={`field-${field.name}`} className="w-full">
                    <Select.Value placeholder="Select…" />
                  </Select.Trigger>
                  <Select.Content>
                    {(relationOptions[field.name] ?? []).map((opt) => (
                      <Select.Item key={opt.value} value={opt.value}>
                        {opt.label}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Root>
              ) : field.type === 'relationship' && field.hasMany ? (
                <div className="flex flex-col gap-2 rounded-xl bg-bg-weak-50 p-3 ring-1 ring-inset ring-stroke-soft-200">
                  {(relationOptions[field.name] ?? []).map((opt) => {
                    const selected = ((values[field.name] as string[]) ?? []).includes(opt.value)
                    return (
                      <div key={opt.value} className="flex items-center gap-2">
                        <Checkbox.Root
                          id={`field-${field.name}-${opt.value}`}
                          checked={selected}
                          onCheckedChange={(checked) => {
                            const current = (values[field.name] as string[]) ?? []
                            onFieldChange(
                              field.name,
                              checked
                                ? [...current, opt.value]
                                : current.filter((v) => v !== opt.value),
                            )
                          }}
                        />
                        <Label.Root htmlFor={`field-${field.name}-${opt.value}`}>
                          {opt.label}
                        </Label.Root>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <Input.Root size="medium">
                  <Input.Wrapper>
                    <Input.Input
                      id={`field-${field.name}`}
                      type={inputType(field)}
                      value={String(values[field.name] ?? '')}
                      onChange={(e) => onFieldChange(field.name, e.target.value)}
                      required={field.required && mode === 'create'}
                      readOnly={field.readOnly}
                      placeholder={field.placeholder}
                      autoComplete={field.type === 'password' && mode === 'create' ? 'new-password' : 'off'}
                    />
                  </Input.Wrapper>
                </Input.Root>
              )}
            </>
          )}

          {field.helpText ? <Hint.Root>{field.helpText}</Hint.Root> : null}
        </div>
      ))}
    </>
  )
}
