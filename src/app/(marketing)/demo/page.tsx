import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Check, Download, Shield, Star } from 'lucide-react'

export const metadata = {
  title: 'Demo — Selli',
  description: 'See what a Selli sell page looks like.',
}

export default function DemoPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-black mb-3">See Selli in action</h1>
        <p className="text-neutral-500 text-base max-w-md mx-auto">
          A live preview of what your sell page and dashboard look like.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8 items-start">
        {/* Demo sell page */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs font-medium bg-neutral-900 text-white px-2 py-1 rounded">Public Sell Page</span>
            <span className="text-xs text-neutral-400">selli.app/p/notion-template-pack</span>
          </div>
          <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="bg-gradient-to-br from-neutral-800 to-neutral-900 h-52 flex items-center justify-center">
              <div className="text-center">
                <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <Download size={24} className="text-white" />
                </div>
                <p className="text-white/60 text-sm">Notion Template Pack</p>
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <span className="text-xs bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded font-medium">Digital Download</span>
                  <h2 className="text-xl font-bold text-black mt-2 mb-1">Notion Template Pack</h2>
                  <p className="text-sm text-neutral-500">
                    50+ premium Notion templates for productivity, project management, and goal tracking. Used by 2,000+ creators.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 mb-6">
                <Star size={14} className="text-yellow-400 fill-yellow-400" />
                <span className="text-sm text-neutral-600">4.9 · Delivered instantly</span>
              </div>
              <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg mb-5 text-sm text-neutral-600">
                <Shield size={14} className="text-neutral-400" />
                Secure checkout · Instant access after payment
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-2xl font-bold text-black">$29</span>
                  <span className="text-neutral-400 text-sm ml-1">one time</span>
                </div>
                <button className="bg-black text-white font-medium px-6 py-2.5 rounded-lg text-sm hover:bg-neutral-800">
                  Get Instant Access
                </button>
              </div>
              <p className="text-xs text-neutral-400 mt-3 text-center">
                Sold by Alex Johnson · support@alex.com
              </p>
            </div>
          </div>
        </div>

        {/* Demo dashboard */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs font-medium bg-neutral-100 text-neutral-700 px-2 py-1 rounded">Dashboard</span>
            <span className="text-xs text-neutral-400">Your private seller view</span>
          </div>
          <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-sm">
            {/* Sidebar + content */}
            <div className="flex">
              <div className="w-36 bg-neutral-50 border-r border-neutral-100 p-3 min-h-64">
                <p className="text-xs font-bold text-black px-2 py-1.5 mb-1">Selli</p>
                {['Overview', 'Products', 'Orders', 'Files', 'Billing', 'Settings'].map((item, i) => (
                  <div
                    key={item}
                    className={`px-2 py-1.5 rounded-md text-xs mb-0.5 ${i === 0 ? 'bg-black text-white font-medium' : 'text-neutral-500'}`}
                  >
                    {item}
                  </div>
                ))}
              </div>
              <div className="flex-1 p-4">
                <p className="text-sm font-semibold text-black mb-3">Overview</p>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {[
                    { label: 'Total Revenue', value: '$1,247' },
                    { label: 'Total Sales', value: '43' },
                    { label: 'Active Products', value: '2' },
                    { label: 'This Month', value: '$389' },
                  ].map((stat) => (
                    <div key={stat.label} className="bg-neutral-50 rounded-lg p-2.5">
                      <p className="text-xs text-neutral-400 mb-0.5">{stat.label}</p>
                      <p className="text-sm font-bold text-black">{stat.value}</p>
                    </div>
                  ))}
                </div>
                <p className="text-xs font-medium text-neutral-600 mb-2">Recent Orders</p>
                {[
                  { email: 'sara@gmail.com', amount: '$29' },
                  { email: 'mike@outlook.com', amount: '$29' },
                  { email: 'jen@icloud.com', amount: '$29' },
                ].map((order) => (
                  <div key={order.email} className="flex items-center justify-between py-1.5 border-b border-neutral-50 last:border-0">
                    <span className="text-xs text-neutral-500">{order.email}</span>
                    <span className="text-xs font-medium text-black">{order.amount}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Product list card */}
          <div className="mt-4 bg-white border border-neutral-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="p-4 border-b border-neutral-100 flex items-center justify-between">
              <p className="text-sm font-semibold text-black">My Products</p>
              <span className="text-xs text-neutral-400">2 products</span>
            </div>
            {[
              { name: 'Notion Template Pack', type: 'Digital Download', price: '$29', status: 'Live' },
              { name: '1-on-1 Coaching Call', type: 'Service Offer', price: '$149', status: 'Live' },
            ].map((product) => (
              <div key={product.name} className="flex items-center justify-between px-4 py-3 border-b border-neutral-50 last:border-0">
                <div>
                  <p className="text-sm font-medium text-black">{product.name}</p>
                  <p className="text-xs text-neutral-400">{product.type} · {product.price}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded-md font-medium">
                    {product.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="mt-16 text-center bg-neutral-50 border border-neutral-200 rounded-2xl py-12 px-6">
        <h2 className="text-2xl font-bold text-black mb-2">Ready to start selling?</h2>
        <p className="text-neutral-500 text-sm mb-6">Create your first product in under 5 minutes.</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/signup">
            <Button size="lg">Start Free</Button>
          </Link>
          <Link href="/pricing">
            <Button size="lg" variant="secondary">View Pricing</Button>
          </Link>
        </div>
        <ul className="flex flex-wrap justify-center gap-x-6 gap-y-1 mt-5">
          {['No credit card required', 'Setup in minutes', 'Keep 100% of revenue'].map((t) => (
            <li key={t} className="flex items-center gap-1.5 text-xs text-neutral-500">
              <Check size={12} className="text-neutral-400" />
              {t}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
