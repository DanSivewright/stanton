'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import { Reveal } from '@/components/stakeholder/Reveal'
import { internalBrand, internalNav } from '@/lib/stakeholder/internal-content'

export function InternalShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  return (
    <div className="team-site">
      <div className="team-site__grid" aria-hidden />
      <header className={`team-site__header ${scrolled ? 'team-site__header--scrolled' : ''}`}>
        <Link href="/team" className="team-site__brand">
          <span className="team-site__brand-mark">BM</span>
          <span className="team-site__brand-text">
            <strong>{internalBrand.title}</strong>
            <em>{internalBrand.subtitle}</em>
          </span>
          <span className="team-site__badge">{internalBrand.badge}</span>
        </Link>

        <button
          type="button"
          className="team-site__menu-btn"
          aria-expanded={menuOpen}
          aria-label="Toggle navigation"
          onClick={() => setMenuOpen((o) => !o)}
        >
          <span />
          <span />
        </button>

        <nav className={`team-site__nav ${menuOpen ? 'team-site__nav--open' : ''}`}>
          {internalNav.map((link) => {
            const active =
              link.href === '/team'
                ? pathname === '/team'
                : pathname === link.href || pathname.startsWith(`${link.href}/`)
            return (
              <Link key={link.href} href={link.href} className={active ? 'is-active' : undefined}>
                {link.label}
              </Link>
            )
          })}
        </nav>
      </header>

      <div className="team-site__main">{children}</div>

      <footer className="team-site__footer">
        <p>Buildmore delivery reference · Not linked from client overview · {new Date().getFullYear()}</p>
        <p className="team-site__watermark">docs/MASTER-SPEC.md · docs/modules/ · docs/architecture/</p>
      </footer>
    </div>
  )
}

export function TeamPageHero({
  eyebrow,
  title,
  lead,
  children,
}: {
  eyebrow?: string
  title: string
  lead: string
  children?: React.ReactNode
}) {
  return (
    <section className="team-hero">
      <Reveal>
        {eyebrow ? <p className="team-hero__eyebrow">{eyebrow}</p> : null}
        <h1>{title}</h1>
        <p className="team-hero__lead">{lead}</p>
        {children}
      </Reveal>
    </section>
  )
}
