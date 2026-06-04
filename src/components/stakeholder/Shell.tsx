'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import { brand, navLinks } from '@/lib/stakeholder/content'

export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  return (
    <div className="stakeholder">
      <div className="stakeholder__grain" aria-hidden />
      <header className={`stakeholder__header ${scrolled ? 'stakeholder__header--scrolled' : ''}`}>
        <Link href="/" className="stakeholder__brand">
          <span className="stakeholder__brand-mark" aria-hidden>
            SG
          </span>
          <span className="stakeholder__brand-text">
            <strong>{brand.title}</strong>
            <em>{brand.subtitle}</em>
          </span>
        </Link>

        <button
          type="button"
          className="stakeholder__menu-btn"
          aria-expanded={menuOpen}
          aria-label="Toggle navigation"
          onClick={() => setMenuOpen((o) => !o)}
        >
          <span />
          <span />
        </button>

        <nav className={`stakeholder__nav ${menuOpen ? 'stakeholder__nav--open' : ''}`}>
          {navLinks.map((link) => {
            const active =
              link.href === '/'
                ? pathname === '/'
                : pathname === link.href || pathname.startsWith(`${link.href}/`)
            return (
              <Link
                key={link.href}
                href={link.href}
                className={active ? 'is-active' : undefined}
              >
                {link.label}
              </Link>
            )
          })}
        </nav>
      </header>

      <div className="stakeholder__main">{children}</div>

      <footer className="stakeholder__footer">
        <p>
          Confidential overview · {brand.title} · {new Date().getFullYear()}
        </p>
        <p className="stakeholder__watermark">Fulfilled by Buildmore</p>
      </footer>
    </div>
  )
}
