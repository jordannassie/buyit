import Stripe from 'stripe'

let _stripe: Stripe | null = null

export function getStripe(): Stripe {
  if (!_stripe) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY environment variable is not set')
    }
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2026-03-25.dahlia',
      typescript: true,
    })
  }
  return _stripe
}

// Convenience alias used in route handlers
export const stripe = new Proxy({} as Stripe, {
  get(_target, prop) {
    return getStripe()[prop as keyof Stripe]
  },
})

export const PLANS = {
  starter: {
    name: 'Starter',
    price: 1900,
    get priceId() { return process.env.STRIPE_STARTER_PRICE_ID! },
    productLimit: 1,
    features: [
      '1 product page',
      'Custom sell page',
      'Stripe checkout',
      'File delivery',
      'Order dashboard',
    ],
  },
  pro: {
    name: 'Pro',
    price: 4900,
    get priceId() { return process.env.STRIPE_PRO_PRICE_ID! },
    productLimit: 5,
    features: [
      'Up to 5 product pages',
      'Custom branding',
      'Multiple product pages',
      'Priority support',
      'Everything in Starter',
    ],
  },
}

export function getPlanFromPriceId(priceId: string) {
  if (priceId === process.env.STRIPE_STARTER_PRICE_ID) return 'starter'
  if (priceId === process.env.STRIPE_PRO_PRICE_ID) return 'pro'
  return null
}

export function getProductLimit(priceId: string | null): number {
  if (!priceId) return 0
  const plan = getPlanFromPriceId(priceId)
  if (plan === 'starter') return 1
  if (plan === 'pro') return 5
  return 0
}
