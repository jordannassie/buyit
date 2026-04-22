'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  FileDown,
  CreditCard,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-react'

const primaryNavItems = [
  { href: '/dashboard',          label: 'Overview', icon: LayoutDashboard, exact: true },
  { href: '/dashboard/products', label: 'Products', icon: Package },
  { href: '/dashboard/orders',   label: 'Orders',   icon: ShoppingBag },
]

const secondaryNavItems = [
  { href: '/dashboard/files',    label: 'Files',    icon: FileDown },
  { href: '/dashboard/billing',  label: 'Billing',  icon: CreditCard },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
]

type NavItem = { href: string; label: string; icon: React.ElementType; exact?: boolean }

function NavLinks({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  function isActive(href: string, exact?: boolean) {
    return exact ? pathname === href : pathname.startsWith(href)
  }

  function renderItem(item: NavItem) {
    const Icon = item.icon
    const active = isActive(item.href, item.exact)
    return (
      <Link
        key={item.href}
        href={item.href}
        onClick={onNavigate}
        className={cn(
          'flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm transition-colors',
          active
            ? 'bg-neutral-900 text-white font-medium'
            : 'text-neutral-500 hover:text-black hover:bg-neutral-50'
        )}
      >
        <Icon size={15} />
        {item.label}
      </Link>
    )
  }

  return (
    <div className="space-y-5">
      <div>
        <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider px-3 mb-1.5">
          Main
        </p>
        <div className="space-y-0.5">
          {primaryNavItems.map(renderItem)}
        </div>
      </div>
      <div>
        <p className="text-[10px] font-semibold text-neutral-400 uppercase tracking-wider px-3 mb-1.5">
          Manage
        </p>
        <div className="space-y-0.5">
          {secondaryNavItems.map(renderItem)}
        </div>
      </div>
    </div>
  )
}

export function DashboardSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)

  // Close drawer on route change (e.g. browser back/forward)
  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const logoutBtn = (
    <div className="px-2 py-4 border-t border-neutral-100">
      <button
        onClick={handleLogout}
        className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-neutral-500 hover:text-red-600 hover:bg-red-50 transition-colors w-full"
      >
        <LogOut size={15} />
        Log out
      </button>
    </div>
  )

  return (
    <>
      {/* ── Mobile top bar ─────────────────────────────────────────────── */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-40 h-14 bg-white border-b border-neutral-100 flex items-center justify-between px-4">
        <Link href="/" className="text-base font-bold text-black tracking-tight">
          Selli
        </Link>
        <button
          onClick={() => setMobileOpen(o => !o)}
          className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-neutral-100 transition-colors"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </header>

      {/* ── Mobile overlay + right-side drawer ─────────────────────────── */}
      {/* Always in DOM so the close animation plays smoothly */}
      <div
        className={cn(
          'lg:hidden fixed inset-0 z-30 transition-opacity duration-300',
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
        onClick={() => setMobileOpen(false)}
      >
        <div className="absolute inset-0 bg-black/25" />
        <aside
          className={cn(
            'absolute top-14 right-0 bottom-0 w-72 max-w-[80vw] bg-white border-l border-neutral-100 flex flex-col shadow-xl',
            'transform transition-transform duration-300 ease-in-out',
            mobileOpen ? 'translate-x-0' : 'translate-x-full'
          )}
          onClick={e => e.stopPropagation()}
        >
          <nav className="flex-1 px-2 py-4 overflow-y-auto">
            <NavLinks pathname={pathname} onNavigate={() => setMobileOpen(false)} />
          </nav>
          {logoutBtn}
        </aside>
      </div>

      {/* ── Desktop sidebar (always visible on lg+) ────────────────────── */}
      <aside className="hidden lg:flex w-56 shrink-0 border-r border-neutral-100 bg-white min-h-screen flex-col">
        <div className="h-14 flex items-center px-5 border-b border-neutral-100">
          <Link href="/" className="text-base font-bold text-black">
            Selli
          </Link>
        </div>
        <nav className="flex-1 px-2 py-4">
          <NavLinks pathname={pathname} />
        </nav>
        {logoutBtn}
      </aside>
    </>
  )
}
