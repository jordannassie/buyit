'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function MarketingNav() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur border-b border-neutral-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-14">
        <Link href="/" className="text-lg font-bold text-black tracking-tight">
          Selli
        </Link>
        <nav className="hidden sm:flex items-center gap-6">
          <Link href="/pricing" className="text-sm text-neutral-600 hover:text-black transition-colors">
            Pricing
          </Link>
          <Link href="/demo" className="text-sm text-neutral-600 hover:text-black transition-colors">
            Demo
          </Link>
        </nav>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm text-neutral-600 hover:text-black transition-colors hidden sm:block">
            Log in
          </Link>
          <Link href="/signup">
            <Button size="sm">Start Free</Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
