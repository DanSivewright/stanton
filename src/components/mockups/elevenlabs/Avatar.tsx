import { initials } from '@/lib/mockups/helpers'
import { avatarGradient } from './utils'
import styles from './Avatar.module.css'

type AvatarProps = {
  name: string
  seed?: string
  size?: 'sm' | 'md' | 'lg'
}

export function Avatar({ name, seed, size = 'md' }: AvatarProps) {
  const gradient = avatarGradient(seed ?? name)
  return (
    <span
      className={`${styles.avatar} ${styles[size]}`}
      style={{ background: gradient }}
      aria-hidden
    >
      {initials(name)}
    </span>
  )
}
