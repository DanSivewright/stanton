'use client'

import styles from './sana.module.css'
import { IconSearch, IconSparkle } from './icons'

type SearchHeroProps = {
  placeholder?: string
  suggestions?: string[]
}

export function SearchHero({
  placeholder = 'Ask about assets, tickets, or locations…',
  suggestions = ['Open tickets at Building A', 'Assets due for maintenance', 'Location hierarchy'],
}: SearchHeroProps) {
  return (
    <div className={styles.searchHero}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
        <IconSparkle size={22} color="var(--sana-accent)" />
        <span style={{ fontSize: 15, fontWeight: 500, color: 'var(--sana-text-muted)' }}>
          What can I help you find?
        </span>
      </div>
      <div className={styles.searchInputWrap}>
        <IconSearch size={20} color="var(--sana-text-subtle)" />
        <input
          className={styles.searchInput}
          type="search"
          placeholder={placeholder}
          aria-label="Search workspace"
        />
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 16 }}>
        {suggestions.map((s) => (
          <button
            key={s}
            type="button"
            style={{
              padding: '8px 14px',
              borderRadius: 999,
              border: '1px solid var(--sana-border)',
              background: 'var(--sana-surface)',
              font: 'inherit',
              fontSize: 13,
              color: 'var(--sana-text-muted)',
              cursor: 'pointer',
            }}
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  )
}
