type PaginationHintProps = {
  totalDocs: number
  limit: number
  page?: number
  style?: React.CSSProperties
}

export function PaginationHint({ totalDocs, limit, page = 1, style }: PaginationHintProps) {
  if (totalDocs <= limit) return null

  const shown = Math.min(limit * page, totalDocs)

  return (
    <p
      style={{
        margin: '16px 0 0',
        fontSize: 13,
        color: '#64748b',
        ...style,
      }}
    >
      Showing {shown} of {totalDocs} records
    </p>
  )
}
