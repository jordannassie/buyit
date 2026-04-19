import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Check } from 'lucide-react'

export const metadata = {
  title: 'Pricing — Selli',
  description: 'Simple pricing with no hidden fees.',
}

const plans = [
  {
    name: 'Starter',
    price: '$19',
    period: '/mo',
    description: 'Perfect for getting started with one product.',
    features: [
      '1 product page',
      'Custom sell page',
      'Stripe checkout',
      'File delivery for digital products',
      'Order dashboard',
      'Email notifications',
    ],
    cta: 'Start with Starter',
    href: '/signup',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '$49',
    period: '/mo',
    description: 'For creators with multiple products and offers.',
    features: [
      'Up to 5 product pages',
      'Custom branding & logo',
      'Multiple product pages',
      'Priority email support',
      'Everything in Starter',
    ],
    cta: 'Start with Pro',
    href: '/signup',
    highlighted: true,
  },
]

export default function PricingPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-20">
      <div className="text-center mb-14">
        <h1 className="text-4xl sm:text-5xl font-bold text-black mb-4">Simple pricing</h1>
        <p className="text-neutral-500 text-lg max-w-md mx-auto">
          No percentage cuts. No hidden fees. Pay a flat monthly rate and keep 100% of your revenue.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={
              plan.highlighted
                ? 'bg-black text-white rounded-2xl p-8'
                : 'bg-white border border-neutral-200 rounded-2xl p-8'
            }
          >
            <p className={`text-sm font-medium mb-1 ${plan.highlighted ? 'text-neutral-400' : 'text-neutral-500'}`}>
              {plan.name}
            </p>
            <div className="flex items-baseline gap-1 mb-2">
              <span className="text-4xl font-bold">{plan.price}</span>
              <span className={`text-sm ${plan.highlighted ? 'text-neutral-400' : 'text-neutral-400'}`}>{plan.period}</span>
            </div>
            <p className={`text-sm mb-7 ${plan.highlighted ? 'text-neutral-400' : 'text-neutral-500'}`}>
              {plan.description}
            </p>
            <ul className="space-y-3 mb-8">
              {plan.features.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm">
                  <Check size={14} className={`mt-0.5 flex-shrink-0 ${plan.highlighted ? 'text-white' : 'text-black'}`} />
                  <span className={plan.highlighted ? 'text-neutral-200' : 'text-neutral-700'}>{f}</span>
                </li>
              ))}
            </ul>
            <Link href={plan.href} className="block">
              <Button
                className={
                  plan.highlighted
                    ? 'w-full bg-white text-black hover:bg-neutral-100'
                    : 'w-full'
                }
                variant={plan.highlighted ? 'primary' : 'secondary'}
              >
                {plan.cta}
              </Button>
            </Link>
          </div>
        ))}
      </div>

      <div className="mt-14 text-center">
        <h2 className="text-xl font-semibold text-black mb-6">Common questions</h2>
        <div className="max-w-xl mx-auto text-left space-y-6">
          {[
            {
              q: 'Do you take a percentage of my sales?',
              a: 'No. Selli charges a flat monthly fee. You keep 100% of your sales revenue (minus Stripe processing fees).',
            },
            {
              q: 'Do I need a Stripe account?',
              a: 'Yes. You\'ll need a free Stripe account to accept payments. Selli connects to your Stripe account so payouts go directly to you.',
            },
            {
              q: 'Can I cancel anytime?',
              a: 'Yes, cancel anytime from your dashboard. Your pages remain accessible until the end of your billing period.',
            },
            {
              q: 'What types of products can I sell?',
              a: 'Digital downloads, service offers, paid calls, simple subscriptions, and any simple offer where someone pays once or monthly.',
            },
          ].map((item) => (
            <div key={item.q} className="border-b border-neutral-100 pb-5">
              <p className="font-medium text-black mb-1.5">{item.q}</p>
              <p className="text-sm text-neutral-500">{item.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
