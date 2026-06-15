'use client'

import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import type { MockupVariantSlug } from '@/lib/mockups/navigation'
import { appendTicketActivity } from '@/lib/mockups/actions'
import * as Button from '@/components/ui/button'
import * as Label from '@/components/ui/label'
import * as Select from '@/components/ui/select'
import * as Textarea from '@/components/ui/textarea'

type TicketActivityComposerProps = {
  variant: MockupVariantSlug
  identifier: string
  authorId: string
  authorOptions?: { id: string; name: string }[]
  useAlignUI?: boolean
  styles?: {
    wrap?: React.CSSProperties
    input?: React.CSSProperties
    button?: React.CSSProperties
    error?: React.CSSProperties
  }
}

export function TicketActivityComposer({
  variant,
  identifier,
  authorId: defaultAuthorId,
  authorOptions,
  useAlignUI = false,
  styles = {},
}: TicketActivityComposerProps) {
  const router = useRouter()
  const [body, setBody] = useState('')
  const [authorId, setAuthorId] = useState(defaultAuthorId)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!body.trim()) return
    setError(null)

    startTransition(async () => {
      const result = await appendTicketActivity(variant, identifier, body.trim(), authorId)
      if (!result.ok) {
        setError(result.error ?? 'Failed to post comment')
        return
      }
      setBody('')
      router.refresh()
    })
  }

  if (useAlignUI) {
    return (
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-3 border-t border-stroke-soft-200 p-4"
      >
        {authorOptions && authorOptions.length > 1 ? (
          <div className="flex flex-col gap-1.5">
            <Label.Root>Post as</Label.Root>
            <Select.Root value={authorId} onValueChange={setAuthorId}>
              <Select.Trigger className="w-full">
                <Select.Value placeholder="Select author" />
              </Select.Trigger>
              <Select.Content>
                {authorOptions.map((opt) => (
                  <Select.Item key={opt.id} value={opt.id}>
                    {opt.name}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
          </div>
        ) : null}
        <Textarea.Root simple placeholder="Add a comment…" rows={3} value={body} onChange={(e) => setBody(e.target.value)} />
        {error ? <p className="text-paragraph-sm text-error-base">{error}</p> : null}
        <Button.Root
          type="submit"
          variant="primary"
          mode="filled"
          size="small"
          className="self-start"
          disabled={isPending || !body.trim()}
        >
          {isPending ? 'Posting…' : 'Post comment'}
        </Button.Root>
      </form>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 10,
        padding: 16,
        borderTop: '1px solid #e2e8f0',
        ...styles.wrap,
      }}
    >
      {authorOptions && authorOptions.length > 1 ? (
        <select
          value={authorId}
          onChange={(e) => setAuthorId(e.target.value)}
          style={{
            padding: '8px 12px',
            borderRadius: 8,
            border: '1px solid #e2e8f0',
            fontSize: 13,
          }}
        >
          {authorOptions.map((opt) => (
            <option key={opt.id} value={opt.id}>
              Post as {opt.name}
            </option>
          ))}
        </select>
      ) : null}
      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Add a comment…"
        rows={3}
        style={{
          padding: '10px 14px',
          borderRadius: 8,
          border: '1px solid #e2e8f0',
          fontSize: 14,
          fontFamily: 'inherit',
          resize: 'vertical',
          ...styles.input,
        }}
      />
      {error ? <p style={{ margin: 0, fontSize: 13, color: '#dc2626', ...styles.error }}>{error}</p> : null}
      <button
        type="submit"
        disabled={isPending || !body.trim()}
        style={{
          alignSelf: 'flex-start',
          padding: '8px 16px',
          borderRadius: 8,
          border: 'none',
          background: '#111827',
          color: '#fff',
          fontSize: 13,
          fontWeight: 600,
          cursor: 'pointer',
          opacity: isPending || !body.trim() ? 0.6 : 1,
          ...styles.button,
        }}
      >
        {isPending ? 'Posting…' : 'Post comment'}
      </button>
    </form>
  )
}
