import { createServiceClient } from '@/lib/supabase/server'
import { stripe } from '@/lib/stripe'
import { notFound } from 'next/navigation'
import { CheckCircle, Download, Calendar, CreditCard } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export const metadata = { title: 'Order Confirmed — Selli' }

interface Props {
  searchParams: Promise<{ session_id?: string; product_id?: string }>
}

export default async function SuccessPage({ searchParams }: Props) {
  const { session_id, product_id } = await searchParams

  if (!session_id || !product_id) notFound()

  const supabase = await createServiceClient()

  // Load the Stripe session
  let session
  try {
    session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ['line_items'],
    })
  } catch {
    notFound()
  }

  if (session.payment_status !== 'paid' && session.mode !== 'subscription') {
    notFound()
  }

  // Load the product
  const { data: product } = await supabase
    .from('products')
    .select('name, product_type, external_link, seller_name, support_email')
    .eq('id', product_id)
    .single()

  if (!product) notFound()

  const buyerEmail = session.customer_details?.email ?? ''
  const isDigital = product.product_type === 'digital_download'
  const isSubscription = product.product_type === 'subscription'

  // Find download token for digital products
  let downloadToken: string | null = null
  if (isDigital) {
    const { data: download } = await supabase
      .from('downloads')
      .select('download_token')
      .eq('product_id', product_id)
      .eq('buyer_email', buyerEmail)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    downloadToken = download?.download_token ?? null
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 py-16">
      <div className="w-full max-w-md">
        {/* Success icon */}
        <div className="flex items-center justify-center mb-6">
          <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center">
            <CheckCircle size={32} className="text-green-600" />
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-black mb-2">Payment confirmed</h1>
          <p className="text-neutral-500 text-sm">
            Thank you for your purchase. A receipt was sent to{' '}
            <strong className="text-neutral-700">{buyerEmail}</strong>.
          </p>
        </div>

        {/* Product card */}
        <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-6 mb-6">
          <p className="text-xs text-neutral-400 mb-1">You purchased</p>
          <p className="font-semibold text-black text-lg">{product.name}</p>
          {product.seller_name && (
            <p className="text-sm text-neutral-500 mt-0.5">from {product.seller_name}</p>
          )}
        </div>

        {/* Type-specific next steps */}
        {isDigital && downloadToken && (
          <div className="mb-6">
            <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-100 rounded-xl mb-3">
              <Download size={16} className="text-blue-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-blue-900">Your file is ready</p>
                <p className="text-xs text-blue-700 mt-0.5">Download link is valid for 24 hours.</p>
              </div>
            </div>
            <a href={`/api/download/${downloadToken}`} className="block">
              <Button className="w-full" size="lg">
                <Download size={16} />
                Download Now
              </Button>
            </a>
          </div>
        )}

        {isDigital && !downloadToken && (
          <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl text-sm text-yellow-800">
            Your download is being prepared. Check your email for the download link, or contact{' '}
            {product.support_email ? (
              <a href={`mailto:${product.support_email}`} className="underline">{product.support_email}</a>
            ) : (
              'the seller'
            )}.
          </div>
        )}

        {product.product_type === 'service_offer' && (
          <div className="mb-6">
            <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-100 rounded-xl mb-3">
              <Calendar size={16} className="text-green-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-green-900">Next steps</p>
                <p className="text-xs text-green-700 mt-0.5">
                  {product.external_link
                    ? 'Use the link below to book your session.'
                    : 'The seller will reach out to confirm your booking.'}
                </p>
              </div>
            </div>
            {product.external_link && (
              <a href={product.external_link} target="_blank" rel="noopener noreferrer" className="block">
                <Button className="w-full" size="lg">
                  <Calendar size={16} />
                  Book Your Session
                </Button>
              </a>
            )}
          </div>
        )}

        {isSubscription && (
          <div className="mb-6 flex items-start gap-3 p-4 bg-purple-50 border border-purple-100 rounded-xl">
            <CreditCard size={16} className="text-purple-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-medium text-purple-900">Subscription active</p>
              <p className="text-xs text-purple-700 mt-0.5">
                Your subscription is now active. You'll be billed monthly. Manage it from your email receipt.
              </p>
            </div>
          </div>
        )}

        {/* Support */}
        {product.support_email && (
          <p className="text-center text-xs text-neutral-400">
            Questions?{' '}
            <a href={`mailto:${product.support_email}`} className="text-neutral-600 underline hover:text-black">
              Contact support
            </a>
          </p>
        )}
      </div>
    </div>
  )
}
