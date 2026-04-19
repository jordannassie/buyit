import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { stripe } from '@/lib/stripe'
import { APP_URL } from '@/lib/utils'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { action, priceId } = await request.json()

  const { data: profile } = await supabase
    .from('profiles')
    .select('stripe_customer_id, email')
    .eq('id', user.id)
    .single()

  try {
    // Open Stripe billing portal for existing customers
    if (action === 'portal') {
      if (!profile?.stripe_customer_id) {
        return NextResponse.json({ error: 'No billing account found' }, { status: 400 })
      }

      const session = await stripe.billingPortal.sessions.create({
        customer: profile.stripe_customer_id,
        return_url: `${APP_URL}/dashboard/billing`,
      })

      return NextResponse.json({ url: session.url })
    }

    // Start a new Selli subscription checkout
    if (action === 'subscribe') {
      if (!priceId) {
        return NextResponse.json({ error: 'Missing priceId' }, { status: 400 })
      }

      let customerId = profile?.stripe_customer_id

      // Create Stripe customer if needed
      if (!customerId) {
        const customer = await stripe.customers.create({
          email: user.email,
          metadata: { user_id: user.id },
        })
        customerId = customer.id

        await supabase
          .from('profiles')
          .update({ stripe_customer_id: customerId })
          .eq('id', user.id)
      }

      const session = await stripe.checkout.sessions.create({
        mode: 'subscription',
        customer: customerId,
        line_items: [{ price: priceId, quantity: 1 }],
        success_url: `${APP_URL}/dashboard/billing?success=true`,
        cancel_url: `${APP_URL}/dashboard/billing`,
        metadata: { user_id: user.id, selli_subscription: 'true' },
        subscription_data: {
          metadata: { user_id: user.id },
        },
      })

      return NextResponse.json({ url: session.url })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (error) {
    console.error('Billing portal error:', error)
    return NextResponse.json({ error: 'Request failed' }, { status: 500 })
  }
}
