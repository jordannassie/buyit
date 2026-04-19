import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PLANS } from '@/lib/stripe'
import { Check, ExternalLink } from 'lucide-react'
import { BillingButtons } from './billing-buttons'

export const metadata = { title: 'Billing — Selli' }

export default async function BillingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select('stripe_subscription_status, stripe_price_id, stripe_customer_id')
    .eq('id', user!.id)
    .single()

  const currentPriceId = profile?.stripe_price_id
  const subscriptionStatus = profile?.stripe_subscription_status
  const isActive = subscriptionStatus === 'active' || subscriptionStatus === 'trialing'

  function getCurrentPlan() {
    if (currentPriceId === process.env.NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID) return 'starter'
    if (currentPriceId === process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID) return 'pro'
    return null
  }

  const currentPlan = getCurrentPlan()

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-black">Billing</h1>
        <p className="text-neutral-500 text-sm mt-1">Manage your Selli subscription.</p>
      </div>

      {/* Current plan status */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Current Plan</CardTitle>
          <CardDescription>Your active subscription status.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-black capitalize">
                {currentPlan ? PLANS[currentPlan].name : 'No active plan'}
              </p>
              <p className="text-sm text-neutral-500 mt-0.5">
                {currentPlan
                  ? `$${PLANS[currentPlan].price / 100}/month`
                  : 'Subscribe to start selling'}
              </p>
            </div>
            <Badge variant={isActive ? 'success' : 'neutral'}>
              {subscriptionStatus ?? 'inactive'}
            </Badge>
          </div>
          {isActive && profile?.stripe_customer_id && (
            <div className="mt-4 pt-4 border-t border-neutral-100">
              <BillingButtons hasCustomer={true} />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Plans */}
      <div className="grid sm:grid-cols-2 gap-4">
        {Object.entries(PLANS).map(([key, plan]) => {
          const isCurrentPlan = currentPlan === key && isActive
          return (
            <Card key={key} className={isCurrentPlan ? 'ring-2 ring-black' : ''}>
              <CardContent className="pt-6">
                {isCurrentPlan && (
                  <span className="text-xs bg-black text-white px-2 py-0.5 rounded-md font-medium mb-3 inline-block">
                    Current Plan
                  </span>
                )}
                <p className="text-sm font-medium text-neutral-500">{plan.name}</p>
                <div className="flex items-baseline gap-1 mt-1 mb-4">
                  <span className="text-3xl font-bold text-black">${plan.price / 100}</span>
                  <span className="text-neutral-400 text-sm">/mo</span>
                </div>
                <ul className="space-y-2 mb-5">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-neutral-600">
                      <Check size={13} className="text-black flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                {!isCurrentPlan && (
                  <BillingButtons
                    hasCustomer={false}
                    priceId={plan.priceId}
                    planName={plan.name}
                  />
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
