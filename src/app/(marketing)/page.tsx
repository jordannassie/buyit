import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Check, Link as LinkIcon, CreditCard, Download, LayoutDashboard, PackagePlus, Plug, Share2, Banknote } from 'lucide-react'

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-20 pb-24 text-center">
        <div className="inline-flex items-center gap-2 bg-neutral-100 text-neutral-600 text-xs font-medium px-3 py-1.5 rounded-full mb-8">
          Simple. Fast. Clean.
        </div>
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-black tracking-tight leading-[1.05] mb-6">
          Sell anything<br />in minutes
        </h1>
        <p className="text-lg sm:text-xl text-neutral-500 max-w-xl mx-auto mb-10">
          Create one simple page for your product or offer, connect Stripe, and start getting paid.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/signup">
            <Button size="lg" className="w-full sm:w-auto">Start Free</Button>
          </Link>
          <Link href="/demo">
            <Button size="lg" variant="secondary" className="w-full sm:w-auto">See Demo</Button>
          </Link>
        </div>
        <p className="text-xs text-neutral-400 mt-4">No credit card required to start.</p>
      </section>

      {/* Mock sell page preview */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-24">
        <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-3 shadow-sm">
          <div className="bg-white rounded-xl border border-neutral-100 overflow-hidden shadow-sm">
            <div className="h-48 bg-gradient-to-br from-neutral-100 to-neutral-200 flex items-center justify-center">
              <div className="text-center">
                <div className="w-12 h-12 bg-neutral-300 rounded-xl mx-auto mb-3" />
                <div className="h-3 bg-neutral-300 rounded w-32 mx-auto mb-2" />
                <div className="h-2 bg-neutral-200 rounded w-48 mx-auto" />
              </div>
            </div>
            <div className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="h-4 bg-neutral-200 rounded w-48 mb-2" />
                <div className="h-3 bg-neutral-100 rounded w-64 mb-1" />
                <div className="h-3 bg-neutral-100 rounded w-40" />
              </div>
              <div className="flex-shrink-0">
                <div className="bg-black text-white text-sm font-medium px-5 py-2.5 rounded-lg">
                  Get Instant Access — $29
                </div>
              </div>
            </div>
          </div>
        </div>
        <p className="text-center text-xs text-neutral-400 mt-3">Your sell page looks like this — clean, fast, ready to convert.</p>
      </section>

      {/* Why Selli */}
      <section className="border-t border-neutral-100 bg-neutral-50 py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-black mb-3">Why Selli</h2>
            <p className="text-neutral-500 text-base max-w-md mx-auto">
              Built for the creator who just wants to sell, without dealing with complex platforms.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {[
              {
                icon: <LayoutDashboard size={20} />,
                title: 'One simple page for every offer',
                description: 'Build a beautiful product page in minutes. No drag-and-drop complexity.',
              },
              {
                icon: <CreditCard size={20} />,
                title: 'Instant Stripe checkout',
                description: 'Stripe handles payments. You get paid. That\'s the whole thing.',
              },
              {
                icon: <Download size={20} />,
                title: 'Secure file delivery',
                description: 'Upload your digital product. Buyers get a secure download link after payment.',
              },
              {
                icon: <LinkIcon size={20} />,
                title: 'One shareable link',
                description: 'Share your sell page anywhere. Your link works everywhere.',
              },
              {
                icon: <LayoutDashboard size={20} />,
                title: 'Clean dashboard, no clutter',
                description: 'See your orders, revenue, and products in one simple place.',
              },
              {
                icon: <Check size={20} />,
                title: 'Everything you need, nothing you don\'t',
                description: 'We removed every feature that wasn\'t essential to selling.',
              },
            ].map((feature) => (
              <div key={feature.title} className="bg-white border border-neutral-200 rounded-xl p-6">
                <div className="text-black mb-3">{feature.icon}</div>
                <h3 className="font-semibold text-black mb-1.5">{feature.title}</h3>
                <p className="text-sm text-neutral-500">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl font-bold text-black mb-3">Four steps to selling</h2>
            <p className="text-neutral-500 text-base max-w-md mx-auto">From idea to paid — in minutes, not days.</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-8">
            {[
              { step: '01', icon: <PackagePlus size={28} />, title: 'Create your product', description: 'Fill in your product name, description, and price.', iconBg: 'bg-violet-100', iconColor: 'text-violet-600', numColor: 'text-violet-400' },
              { step: '02', icon: <Plug size={28} />, title: 'Connect Stripe', description: 'Link your Stripe account to accept payments instantly.', iconBg: 'bg-blue-100', iconColor: 'text-blue-600', numColor: 'text-blue-400' },
              { step: '03', icon: <Share2 size={28} />, title: 'Share your link', description: 'Copy your unique sell page URL and share it anywhere.', iconBg: 'bg-emerald-100', iconColor: 'text-emerald-600', numColor: 'text-emerald-400' },
              { step: '04', icon: <Banknote size={28} />, title: 'Get paid', description: 'Buyers pay via Stripe. Files deliver automatically.', iconBg: 'bg-amber-100', iconColor: 'text-amber-600', numColor: 'text-amber-400' },
            ].map((item) => (
              <div key={item.step} className="flex flex-col items-start">
                {/* Big step number */}
                <span className={`text-5xl sm:text-6xl font-black leading-none mb-4 select-none ${item.numColor}`}>{item.step}</span>
                {/* Icon */}
                <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl ${item.iconBg} ${item.iconColor} flex items-center justify-center mb-4`}>
                  {item.icon}
                </div>
                <h3 className="font-bold text-black mb-2 text-sm sm:text-base leading-tight">{item.title}</h3>
                <p className="text-xs sm:text-sm text-neutral-500 leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing preview */}
      <section className="border-t border-neutral-100 bg-neutral-50 py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-black mb-2">Simple, transparent pricing</h2>
            <p className="text-neutral-500 text-base">
              No monthly fees. Only pay when you sell.
            </p>
          </div>
          <div className="bg-white border border-neutral-200 rounded-3xl p-8 space-y-4">
            <p className="text-sm text-neutral-500 uppercase tracking-wide">Direct sales</p>
            <p className="text-4xl sm:text-5xl font-bold text-black">
              10% + $0.50 per direct sale
            </p>
            <p className="text-base text-neutral-600 max-w-2xl">
              Simple selling, simple pricing. Built for creators selling downloads, services, and subscriptions.
            </p>
            <ul className="grid sm:grid-cols-2 gap-3 text-sm text-neutral-600">
              {[
                'No monthly fee to get started',
                'Keep more of your revenue than complicated all-in-one tools',
                'Built to share a single sell page or full storefront',
                'Payment processing fees may apply separately',
              ].map((line) => (
                <li key={line} className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-black/70 flex-shrink-0" />
                  {line}
                </li>
              ))}
            </ul>
            <p className="text-xs text-neutral-400 mt-3">
              Discover/marketplace sales (only when Selli brings the customer): 30% per transaction.
            </p>
          </div>
          <p className="text-center text-xs text-neutral-400 mt-5">
            <Link href="/pricing" className="underline underline-offset-2 hover:text-neutral-600">
              View the full pricing model →
            </Link>
          </p>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold text-black mb-4 leading-tight">
            Start selling with<br />one simple link
          </h2>
          <p className="text-neutral-500 mb-8 text-base">
            Create your offer. Share your link. Get paid.
          </p>
          <Link href="/signup">
            <Button size="lg">Create My Selli Page</Button>
          </Link>
          <p className="text-xs text-neutral-400 mt-4">Setup takes less than 5 minutes.</p>
        </div>
      </section>
    </>
  )
}
