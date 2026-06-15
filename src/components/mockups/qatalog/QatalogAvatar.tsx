'use client'

import * as Avatar from '@/components/ui/avatar'
import { initials } from '@/lib/mockups/helpers'

const AVATAR_COLORS = ['blue', 'purple', 'sky', 'yellow', 'red'] as const

type AvatarSize = '20' | '24' | '32' | '40' | '48' | '56'

export function QatalogAvatar({
  name,
  size = '40',
  index = 0,
}: {
  name: string
  size?: AvatarSize
  index?: number
}) {
  const color = AVATAR_COLORS[index % AVATAR_COLORS.length]

  return (
    <Avatar.Root size={size} color={color} title={name}>
      {initials(name)}
    </Avatar.Root>
  )
}
