import Link from 'next/link'
import * as BreadcrumbUI from '@/components/ui/breadcrumb'
import { RiArrowRightSLine } from '@remixicon/react'

type Crumb = {
  label: string
  href?: string
}

type BreadcrumbProps = {
  items: Crumb[]
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <BreadcrumbUI.Root aria-label="Breadcrumb">
      {items.map((item, index) => (
        <span key={item.label} className="contents">
          {index > 0 ? <BreadcrumbUI.ArrowIcon as={RiArrowRightSLine} /> : null}
          {item.href ? (
            <BreadcrumbUI.Item asChild>
              <Link href={item.href}>{item.label}</Link>
            </BreadcrumbUI.Item>
          ) : (
            <BreadcrumbUI.Item active>{item.label}</BreadcrumbUI.Item>
          )}
        </span>
      ))}
    </BreadcrumbUI.Root>
  )
}
