import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { stripe } from '@/lib/stripe'
import { APP_URL } from '@/lib/utils'

export async function POST(request: Request) {
  const { productId, slug } = await request.json()

  if (!productId) {
    return NextResponse.json({ error: 'Missing productId' }, { status: 400 })
  }

  const supabase = await createClient()

  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('id', productId)
    .eq('published', true)
    .single()

  if (!product) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 })
  }

  if (!product.stripe_price_id) {
    return NextResponse.json({ error: 'Product not configured for checkout' }, { status: 400 })
  }

  try {
    const isSubscription = product.product_type === 'subscription'

    const session = await stripe.checkout.sessions.create({
      mode: isSubscription ? 'subscription' : 'payment',
      line_items: [{ price: product.stripe_price_id, quantity: 1 }],
      success_url: `${APP_URL}/success?session_id={CHECKOUT_SESSION_ID}&product_id=${productId}`,
      cancel_url: `${APP_URL}/p/${slug}`,
      metadata: {
        product_id: productId,
        product_type: product.product_type,
        user_id: product.user_id,
      },
      ...(isSubscription && {
        subscription_data: {
          metadata: { product_id: productId, user_id: product.user_id },
        },
      }),
      allow_promotion_codes: false,
      billing_address_collection: 'auto',
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Checkout session error:', error)
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 })
  }
}
