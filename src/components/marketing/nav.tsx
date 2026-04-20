'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Menu, X } from 'lucide-react'

const LINKS = [
  { href: '/pricing', label: 'Pricing' },
  { href: '/demo',    label: 'Demo' },
]

export function MarketingNav() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)

  // Close menu on route change
  useEffect(() => { setOpen(false) }, [pathname])

  // Prevent body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-[100] bg-white/95 backdrop-blur border-b border-neutral-100">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-14">
          {/* Logo */}
          <Link href="/" onClick={() => setOpen(false)} className="text-lg font-bold text-black tracking-tight">
            Selli
          </Link>

          {/* Desktop nav links — hidden on mobile */}
          <nav className="hidden md:flex items-center gap-6">
            {LINKS.map(l => (
              <Link
                key={l.href}
                href={l.href}
                className={`text-sm transition-colors ${pathname === l.href ? 'text-black font-medium' : 'text-neutral-600 hover:text-black'}`}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Log in — desktop only */}
            <Link href="/login" className="text-sm text-neutral-600 hover:text-black transition-colors hidden md:block">
              Log in
            </Link>
            {/* Start Free — always visible */}
            <Link href="/signup">
              <Button size="sm">Start Free</Button>
            </Link>
            {/* Hamburger — mobile only (below md = 768px) */}
            <button
              type="button"
              onClick={() => setOpen(o => !o)}
              className="md:hidden flex items-center justify-center w-10 h-10 rounded-lg text-neutral-700 hover:bg-neutral-100 active:bg-neutral-200 transition-colors"
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
            >
              {open ? <X size={20} strokeWidth={2} /> : <Menu size={20} strokeWidth={2} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer — sits just below the header */}
      {open && (
        <>
          {/* Full-screen backdrop */}
          <div
            className="fixed inset-0 z-[90] bg-black/30 md:hidden"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          {/* Menu panel */}
          <div className="fixed top-14 left-0 right-0 z-[95] md:hidden bg-white border-b border-neutral-200 shadow-lg">
            <nav className="px-4 py-4 flex flex-col gap-1">
              {LINKS.map(l => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className={`flex items-center h-12 px-4 rounded-xl text-base font-medium transition-colors ${pathname === l.href ? 'bg-neutral-100 text-black' : 'text-neutral-700 hover:bg-neutral-50 active:bg-neutral-100'}`}
                >
                  {l.label}
                </Link>
              ))}
              <div className="mt-3 pt-3 border-t border-neutral-100 flex flex-col gap-2">
                <Link href="/login" onClick={() => setOpen(false)} className="flex items-center justify-center h-12 px-4 rounded-xl text-base font-medium text-neutral-700 border border-neutral-200 hover:border-neutral-400 active:bg-neutral-50 transition-colors">
                  Log in
                </Link>
                <Link href="/signup" onClick={() => setOpen(false)}>
                  <Button className="w-full h-12 text-base" size="sm">Start Free</Button>
                </Link>
              </div>
            </nav>
          </div>
        </>
      )}
    </>
  )
}
