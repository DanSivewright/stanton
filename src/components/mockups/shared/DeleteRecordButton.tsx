'use client'

import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import type { MockupCollectionSlug, MockupVariantSlug } from '@/lib/mockups/navigation'
import { deleteRecord } from '@/lib/mockups/actions'
import { FORM_STYLES } from './form-styles'
import * as Button from '@/components/ui/button'

type DeleteRecordButtonProps = {
  variant: MockupVariantSlug
  slug: MockupCollectionSlug
  identifier: string
  label?: string
  useAlignUI?: boolean
}

export function DeleteRecordButton({
  variant,
  slug,
  identifier,
  label = 'Delete',
  useAlignUI = false,
}: DeleteRecordButtonProps) {
  const router = useRouter()
  const [confirming, setConfirming] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const styles = FORM_STYLES[variant]

  function handleDelete() {
    setError(null)
    startTransition(async () => {
      const result = await deleteRecord(variant, slug, identifier)
      if (!result.ok) {
        setError(result.error ?? 'Delete failed')
        setConfirming(false)
        return
      }
      if (result.redirectTo) {
        router.push(result.redirectTo)
        router.refresh()
      }
    })
  }

  if (useAlignUI) {
    if (!confirming) {
      return (
        <Button.Root
          type="button"
          variant="error"
          mode="stroke"
          size="small"
          onClick={() => setConfirming(true)}
        >
          {label}
        </Button.Root>
      )
    }

    return (
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-paragraph-sm text-text-sub-600">Delete this record?</span>
        <Button.Root
          type="button"
          variant="error"
          mode="filled"
          size="small"
          onClick={handleDelete}
          disabled={isPending}
        >
          {isPending ? 'Deleting…' : 'Confirm delete'}
        </Button.Root>
        <Button.Root
          type="button"
          variant="neutral"
          mode="stroke"
          size="small"
          onClick={() => setConfirming(false)}
        >
          Cancel
        </Button.Root>
        {error ? <span className="text-paragraph-sm text-error-base">{error}</span> : null}
      </div>
    )
  }

  if (!confirming) {
    return (
      <button
        type="button"
        onClick={() => setConfirming(true)}
        style={{
          ...styles.cancel,
          color: '#dc2626',
          borderColor: '#fecaca',
        }}
      >
        {label}
      </button>
    )
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
      <span style={{ fontSize: 13, color: '#64748b' }}>Delete this record?</span>
      <button
        type="button"
        onClick={handleDelete}
        disabled={isPending}
        style={{ ...styles.submit, background: '#dc2626' }}
      >
        {isPending ? 'Deleting…' : 'Confirm delete'}
      </button>
      <button type="button" onClick={() => setConfirming(false)} style={styles.cancel}>
        Cancel
      </button>
      {error ? <span style={styles.error}>{error}</span> : null}
    </div>
  )
}
