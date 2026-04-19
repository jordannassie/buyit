import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { stripe } from '@/lib/stripe'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { name, description, priceAmount, productType, existingProductId } = await request.json()

  try {
    let productId = existingProductId

    if (!productId) {
      const stripeProduct = await stripe.products.create({
        name,
        description: description || undefined,
        metadata: { user_id: user.id },
      })
      productId = stripeProduct.id
    } else {
      await stripe.products.update(productId, { name, description: description || undefined })
    }

    const priceData = await stripe.prices.create({
      product: productId,
      unit_amount: priceAmount,
      currency: 'usd',
      ...(productType === 'subscription' && {
        recurring: { interval: 'month' },
      }),
    })

    return NextResponse.json({ productId, priceId: priceData.id })
  } catch (error) {
    console.error('Stripe product creation error:', error)
    return NextResponse.json({ error: 'Failed to create Stripe product' }, { status: 500 })
  }
}
