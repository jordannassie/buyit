import Link from 'next/link'

export const metadata = {
  title: 'Pricing — Selli',
  description: 'No monthly fees. Only pay when you sell.',
}

const faq = [
  {
    q: 'Do I pay monthly?',
    a: 'No. Selli only charges when you make a sale.',
  },
  {
    q: 'What is the direct sales fee?',
    a: '10% + $0.50 per transaction when you share your own sell page or storefront.',
  },
  {
    q: 'When does the 30% fee apply?',
    a: 'Only when Selli brings the customer through a future discover marketplace.',
  },
  {
    q: 'Are payment processing fees included?',
    a: 'No. Payment processing fees may apply separately through Stripe.',
  },
]

export default function PricingPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-20 space-y-12">
      <div className="text-center space-y-3">
        <p className="text-sm uppercase tracking-[0.3em] text-neutral-400">Transparent</p>
        <h1 className="text-4xl sm:text-5xl font-bold text-black">Simple, transparent pricing</h1>
        <p className="text-neutral-500 text-lg max-w-2xl mx-auto">
          No monthly fees. Only pay when you sell. Keep more of your revenue than complicated all-in-one tools.
        </p>
      </div>

      <div className="grid lg:grid-cols-[1.3fr,0.7fr] gap-6 items-start">
        <div className="bg-white border border-neutral-200 rounded-3xl p-5 sm:p-8 space-y-5">
          <div>
            <p className="text-xs text-neutral-500 uppercase tracking-[0.4em]">Direct sales</p>
            <p className="text-5xl font-bold text-black mt-2">10% + $0.50</p>
            <p className="text-sm text-neutral-500">per direct sale</p>
          </div>
          <p className="text-neutral-600 text-base">
            Chargeback support, automatic payouts, and instant publish flow for downloads, services, subscriptions, and media packs.
          </p>
          <ul className="space-y-3 text-sm text-neutral-600">
            {[
              'No monthly fee to get started',
              'Simple selling, simple pricing',
              'Built for creators selling downloads, services, and subscriptions',
              'Payment processing fees may apply separately',
              'Keep more of your revenue than complicated all-in-one tools',
            ].map((item) => (
              <li key={item} className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-black/70" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-neutral-900 text-white rounded-3xl p-5 sm:p-8 space-y-4">
          <p className="text-xs uppercase tracking-[0.4em] text-neutral-300">Discover sales</p>
          <p className="text-3xl font-bold">30% per transaction</p>
          <p className="text-sm text-neutral-200">
            Only when Selli brings the customer through a future discover marketplace. Not shown as the main price because discover is coming soon.
          </p>
          <p className="text-xs text-neutral-400">Payment processing fees may apply separately.</p>
          <Link href="/demo">
            <span className="text-xs uppercase tracking-[0.4em] text-neutral-200 underline underline-offset-4">
              Learn more about discover →
            </span>
          </Link>
        </div>
      </div>

      <div className="bg-white border border-neutral-200 rounded-3xl p-5 sm:p-8 space-y-6">
        <h2 className="text-2xl font-semibold text-black">FAQ</h2>
        <div className="grid sm:grid-cols-2 gap-5">
          {faq.map((item) => (
            <div key={item.q} className="space-y-1">
              <p className="text-sm font-medium text-black">{item.q}</p>
              <p className="text-sm text-neutral-500">{item.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
