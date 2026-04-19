import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { formatCurrency } from '@/lib/utils'
import { Shield, Download, Zap, CheckCircle } from 'lucide-react'
import { BuyButton } from './buy-button'
import type { Metadata } from 'next'
import Image from 'next/image'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const supabase = await createClient()
  const { data: product } = await supabase
    .from('products')
    .select('name, description, thumbnail_url')
    .eq('slug', slug)
    .eq('published', true)
    .single()

  if (!product) return { title: 'Product Not Found' }

  return {
    title: `${product.name} — Selli`,
    description: product.description ?? undefined,
    openGraph: {
      title: product.name,
      description: product.description ?? undefined,
      images: product.thumbnail_url ? [product.thumbnail_url] : [],
    },
  }
}

export default async function SellPage({ params }: Props) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .eq('published', true)
    .single()

  if (!product) notFound()

  const isDigital = product.product_type === 'digital_download'
  const isSubscription = product.product_type === 'subscription'

  return (
    <div className="min-h-screen bg-white">
      {/* Minimal top bar */}
      <div className="h-10 border-b border-neutral-100 flex items-center px-6">
        <span className="text-xs text-neutral-400">Powered by Selli</span>
      </div>

      <div className="max-w-xl mx-auto px-4 py-12">
        {/* Thumbnail */}
        {product.thumbnail_url ? (
          <div className="relative aspect-[16/9] rounded-2xl overflow-hidden mb-8 bg-neutral-100">
            <Image
              src={product.thumbnail_url}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
          </div>
        ) : (
          <div className="aspect-[16/9] rounded-2xl bg-gradient-to-br from-neutral-100 to-neutral-200 flex items-center justify-center mb-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-neutral-300 rounded-xl mx-auto mb-2" />
              <p className="text-sm text-neutral-400">{product.name}</p>
            </div>
          </div>
        )}

        {/* Product type badge */}
        <div className="flex items-center gap-2 mb-4">
          {isDigital && (
            <span className="inline-flex items-center gap-1.5 text-xs bg-neutral-100 text-neutral-600 px-2.5 py-1 rounded-full font-medium">
              <Download size={11} />
              Digital Download
            </span>
          )}
          {product.product_type === 'service_offer' && (
            <span className="inline-flex items-center gap-1.5 text-xs bg-neutral-100 text-neutral-600 px-2.5 py-1 rounded-full font-medium">
              <Zap size={11} />
              Service Offer
            </span>
          )}
          {isSubscription && (
            <span className="inline-flex items-center gap-1.5 text-xs bg-neutral-100 text-neutral-600 px-2.5 py-1 rounded-full font-medium">
              <CheckCircle size={11} />
              Subscription
            </span>
          )}
          {isDigital && (
            <span className="text-xs text-neutral-500">Delivered instantly</span>
          )}
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-black mb-3 leading-tight">{product.name}</h1>

        {/* Description */}
        {product.description && (
          <p className="text-neutral-500 text-base leading-relaxed mb-6">{product.description}</p>
        )}

        {/* Trust badge */}
        <div className="flex items-center gap-2 p-3 bg-neutral-50 border border-neutral-100 rounded-xl mb-6 text-sm text-neutral-500">
          <Shield size={14} className="text-neutral-400 shrink-0" />
          <span>Secure checkout powered by Stripe · {isDigital ? 'Instant file delivery' : 'Confirmation sent by email'}</span>
        </div>

        {/* Price + CTA */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <span className="text-3xl font-bold text-black">
              {formatCurrency(product.price_amount, product.currency)}
            </span>
            {isSubscription && <span className="text-neutral-400 text-sm ml-1">/month</span>}
          </div>
          <BuyButton
            productId={product.id}
            slug={product.slug}
            ctaText={product.cta_text}
          />
        </div>

        {/* Seller info */}
        {(product.seller_name || product.support_email) && (
          <div className="mt-8 pt-6 border-t border-neutral-100 text-xs text-neutral-400">
            {product.seller_name && <span>Sold by {product.seller_name}</span>}
            {product.seller_name && product.support_email && <span> · </span>}
            {product.support_email && (
              <a href={`mailto:${product.support_email}`} className="hover:text-neutral-600 underline underline-offset-2">
                {product.support_email}
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
