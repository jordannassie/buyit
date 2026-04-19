import { NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { stripe } from '@/lib/stripe'
import { createServiceClient } from '@/lib/supabase/server'
import { generateToken } from '@/lib/utils'
import Stripe from 'stripe'

export async function POST(request: Request) {
  const body = await request.text()
  const headersList = await headers()
  const signature = headersList.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    console.error('Webhook signature error:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const supabase = await createServiceClient()

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        await handleCheckoutCompleted(session, supabase)
        break
      }

      case 'customer.subscription.updated':
      case 'customer.subscription.created': {
        const subscription = event.data.object as Stripe.Subscription
        await handleSubscriptionChange(subscription, supabase)
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        await handleSubscriptionDeleted(subscription, supabase)
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice & { subscription?: string | null }
        if (invoice.subscription) {
          const subscription = await stripe.subscriptions.retrieve(invoice.subscription)
          await handleSubscriptionChange(subscription, supabase)
        }
        break
      }
    }
  } catch (error) {
    console.error('Webhook handler error:', error)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }

  return NextResponse.json({ received: true })
}

async function handleCheckoutCompleted(
  session: Stripe.Checkout.Session,
  supabase: Awaited<ReturnType<typeof createServiceClient>>
) {
  const productId = session.metadata?.product_id
  const productType = session.metadata?.product_type
  const sellerId = session.metadata?.user_id
  const buyerEmail = session.customer_details?.email ?? ''

  if (!productId || !sellerId) return

  // Check if this is a Selli SaaS subscription (for our own billing)
  if (session.mode === 'subscription' && !productId) {
    // Handled by subscription.updated event
    return
  }

  // Record the order
  const orderData = {
    user_id: sellerId,
    product_id: productId,
    buyer_email: buyerEmail,
    stripe_checkout_session_id: session.id,
    stripe_payment_intent_id:
      session.payment_intent ? String(session.payment_intent) : null,
    stripe_subscription_id:
      session.subscription ? String(session.subscription) : null,
    amount_total: session.amount_total ?? 0,
    currency: session.currency ?? 'usd',
    payment_status: 'paid',
    product_type: productType ?? 'digital_download',
  }

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert(orderData)
    .select()
    .single()

  if (orderError) {
    console.error('Order insert error:', orderError)
    return
  }

  // For digital downloads: create secure download token
  if (productType === 'digital_download' && order) {
    const { data: product } = await supabase
      .from('products')
      .select('file_path')
      .eq('id', productId)
      .single()

    if (product?.file_path) {
      const expiresAt = new Date()
      expiresAt.setHours(expiresAt.getHours() + 24)

      await supabase.from('downloads').insert({
        order_id: order.id,
        product_id: productId,
        buyer_email: buyerEmail,
        download_token: generateToken(),
        expires_at: expiresAt.toISOString(),
      })
    }
  }

  // If this is a Selli platform SaaS subscription checkout, update the seller's profile
  if (session.mode === 'subscription' && session.subscription) {
    const subscription = await stripe.subscriptions.retrieve(String(session.subscription))
    const priceId = subscription.items.data[0]?.price.id

    // Check if this price matches our Selli plans
    const isSelliPlan =
      priceId === process.env.STRIPE_STARTER_PRICE_ID ||
      priceId === process.env.STRIPE_PRO_PRICE_ID

    if (isSelliPlan) {
      const customerId = session.customer
        ? String(session.customer)
        : null

      await supabase.from('profiles').update({
        stripe_customer_id: customerId,
        stripe_subscription_status: subscription.status,
        stripe_price_id: priceId,
      }).eq('id', sellerId)
    }
  }
}

async function handleSubscriptionChange(
  subscription: Stripe.Subscription,
  supabase: Awaited<ReturnType<typeof createServiceClient>>
) {
  const priceId = subscription.items.data[0]?.price.id
  const customerId = String(subscription.customer)

  const isSelliPlan =
    priceId === process.env.STRIPE_STARTER_PRICE_ID ||
    priceId === process.env.STRIPE_PRO_PRICE_ID

  if (!isSelliPlan) return

  await supabase
    .from('profiles')
    .update({
      stripe_subscription_status: subscription.status,
      stripe_price_id: priceId,
      stripe_customer_id: customerId,
    })
    .eq('stripe_customer_id', customerId)
}

async function handleSubscriptionDeleted(
  subscription: Stripe.Subscription,
  supabase: Awaited<ReturnType<typeof createServiceClient>>
) {
  const customerId = String(subscription.customer)

  await supabase
    .from('profiles')
    .update({
      stripe_subscription_status: 'canceled',
      stripe_price_id: null,
    })
    .eq('stripe_customer_id', customerId)
}
