'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { Toggle } from '@/components/ui/toggle'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { slugify } from '@/lib/utils'
import { Upload, X, ExternalLink } from 'lucide-react'
import type { Product, ProductType } from '@/types'
import Link from 'next/link'

interface ProductFormProps {
  userId: string
  product?: Product
  defaultSellerName?: string
  defaultSupportEmail?: string
}

const PRODUCT_TYPES = [
  { value: 'digital_download', label: 'Digital Download' },
  { value: 'service_offer', label: 'Service Offer' },
  { value: 'subscription', label: 'Subscription' },
]

const CTA_OPTIONS = [
  { value: 'Buy Now', label: 'Buy Now' },
  { value: 'Get Instant Access', label: 'Get Instant Access' },
  { value: 'Start Subscription', label: 'Start Subscription' },
  { value: 'Book and Pay', label: 'Book and Pay' },
  { value: 'Download Now', label: 'Download Now' },
]

export function ProductForm({ userId, product, defaultSellerName, defaultSupportEmail }: ProductFormProps) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const thumbnailInputRef = useRef<HTMLInputElement>(null)

  const [name, setName] = useState(product?.name ?? '')
  const [description, setDescription] = useState(product?.description ?? '')
  const [productType, setProductType] = useState<ProductType>(product?.product_type ?? 'digital_download')
  const [price, setPrice] = useState(product ? String(product.price_amount / 100) : '')
  const [slug, setSlug] = useState(product?.slug ?? '')
  const [ctaText, setCtaText] = useState(product?.cta_text ?? 'Get Instant Access')
  const [sellerName, setSellerName] = useState(product?.seller_name ?? defaultSellerName ?? '')
  const [supportEmail, setSupportEmail] = useState(product?.support_email ?? defaultSupportEmail ?? '')
  const [externalLink, setExternalLink] = useState(product?.external_link ?? '')
  const [published, setPublished] = useState(product?.published ?? false)
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
  const [productFile, setProductFile] = useState<File | null>(null)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)

  function handleNameChange(val: string) {
    setName(val)
    if (!product) {
      setSlug(slugify(val))
    }
  }

  async function uploadFile(file: File, bucket: string, path: string): Promise<string | null> {
    const supabase = createClient()
    const { error } = await supabase.storage.from(bucket).upload(path, file, { upsert: true })
    if (error) return null
    return path
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!name || !slug || !price) {
      toast.error('Please fill in all required fields.')
      return
    }

    const priceAmount = Math.round(parseFloat(price) * 100)
    if (isNaN(priceAmount) || priceAmount < 50) {
      toast.error('Price must be at least $0.50.')
      return
    }

    setSaving(true)

    try {
      const supabase = createClient()

      let thumbnailUrl = product?.thumbnail_url ?? null
      let filePath = product?.file_path ?? null

      // Upload thumbnail
      if (thumbnailFile) {
        const ext = thumbnailFile.name.split('.').pop()
        const path = `${userId}/${slug}-thumb.${ext}`
        const uploadedPath = await uploadFile(thumbnailFile, 'product-images', path)
        if (uploadedPath) {
          const { data } = supabase.storage.from('product-images').getPublicUrl(uploadedPath)
          thumbnailUrl = data.publicUrl
        }
      }

      // Upload product file
      if (productFile && productType === 'digital_download') {
        const path = `${userId}/${slug}-${Date.now()}-${productFile.name}`
        filePath = await uploadFile(productFile, 'product-files', path)
      }

      // Create/update Stripe product + price via API
      let stripeProductId = product?.stripe_product_id ?? null
      let stripePriceId = product?.stripe_price_id ?? null

      if (!stripeProductId || product?.price_amount !== priceAmount) {
        const res = await fetch('/api/products/stripe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name,
            description,
            priceAmount,
            productType,
            existingProductId: stripeProductId,
          }),
        })
        if (res.ok) {
          const data = await res.json()
          stripeProductId = data.productId
          stripePriceId = data.priceId
        }
      }

      const payload = {
        user_id: userId,
        name,
        description: description || null,
        product_type: productType,
        price_amount: priceAmount,
        currency: 'usd',
        slug,
        thumbnail_url: thumbnailUrl,
        file_path: filePath,
        external_link: externalLink || null,
        cta_text: ctaText,
        seller_name: sellerName || null,
        support_email: supportEmail || null,
        published,
        stripe_product_id: stripeProductId,
        stripe_price_id: stripePriceId,
        updated_at: new Date().toISOString(),
      }

      let error
      if (product) {
        const result = await supabase.from('products').update(payload).eq('id', product.id)
        error = result.error
      } else {
        const result = await supabase.from('products').insert({ ...payload, created_at: new Date().toISOString() })
        error = result.error
      }

      if (error) {
        toast.error(error.message)
      } else {
        toast.success(product ? 'Product updated.' : 'Product created.')
        router.push('/dashboard/products')
        router.refresh()
      }
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!product) return
    if (!confirm('Delete this product? This cannot be undone.')) return
    setDeleting(true)
    const supabase = createClient()
    const { error } = await supabase.from('products').delete().eq('id', product.id)
    if (error) {
      toast.error('Failed to delete product.')
    } else {
      toast.success('Product deleted.')
      router.push('/dashboard/products')
      router.refresh()
    }
    setDeleting(false)
  }

  return (
    <form onSubmit={handleSave} className="space-y-5">
      <Card>
        <CardHeader>
          <CardTitle>Product Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            label="Product Name *"
            value={name}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="e.g. Notion Template Pack"
            required
          />
          <Textarea
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="A short description of what buyers get..."
            rows={3}
          />
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Product Type"
              value={productType}
              onChange={(e) => setProductType(e.target.value as ProductType)}
              options={PRODUCT_TYPES}
            />
            <Input
              label="Price (USD) *"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="29"
              min="0.50"
              step="0.01"
              required
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Page Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            label="Page Slug *"
            value={slug}
            onChange={(e) => setSlug(slugify(e.target.value))}
            placeholder="my-product"
            hint={`Your page URL: /p/${slug || 'your-slug'}`}
            required
          />
          <Select
            label="CTA Button Text"
            value={ctaText}
            onChange={(e) => setCtaText(e.target.value)}
            options={CTA_OPTIONS}
          />
          <div>
            <p className="text-sm font-medium text-neutral-700 mb-1.5">Thumbnail Image</p>
            <input
              ref={thumbnailInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => setThumbnailFile(e.target.files?.[0] ?? null)}
            />
            <div
              onClick={() => thumbnailInputRef.current?.click()}
              className="border-2 border-dashed border-neutral-200 rounded-lg p-6 text-center cursor-pointer hover:border-neutral-300 transition-colors"
            >
              {thumbnailFile ? (
                <div className="flex items-center justify-center gap-2 text-sm text-neutral-700">
                  <span className="truncate max-w-xs">{thumbnailFile.name}</span>
                  <button type="button" onClick={(ev) => { ev.stopPropagation(); setThumbnailFile(null) }}>
                    <X size={14} />
                  </button>
                </div>
              ) : product?.thumbnail_url ? (
                <p className="text-sm text-neutral-500">Current image set. Click to replace.</p>
              ) : (
                <div>
                  <Upload size={20} className="mx-auto text-neutral-400 mb-1.5" />
                  <p className="text-sm text-neutral-500">Click to upload thumbnail</p>
                  <p className="text-xs text-neutral-400 mt-0.5">PNG, JPG, WEBP up to 5MB</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* File / fulfillment */}
      <Card>
        <CardHeader>
          <CardTitle>
            {productType === 'digital_download' ? 'Digital File' : 'Fulfillment'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {productType === 'digital_download' && (
            <div>
              <p className="text-sm font-medium text-neutral-700 mb-1.5">Upload File</p>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={(e) => setProductFile(e.target.files?.[0] ?? null)}
              />
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-neutral-200 rounded-lg p-6 text-center cursor-pointer hover:border-neutral-300 transition-colors"
              >
                {productFile ? (
                  <div className="flex items-center justify-center gap-2 text-sm text-neutral-700">
                    <span className="truncate max-w-xs">{productFile.name}</span>
                    <button type="button" onClick={(ev) => { ev.stopPropagation(); setProductFile(null) }}>
                      <X size={14} />
                    </button>
                  </div>
                ) : product?.file_path ? (
                  <p className="text-sm text-neutral-500">File uploaded. Click to replace.</p>
                ) : (
                  <div>
                    <Upload size={20} className="mx-auto text-neutral-400 mb-1.5" />
                    <p className="text-sm text-neutral-500">Upload your digital product</p>
                    <p className="text-xs text-neutral-400 mt-0.5">PDF, ZIP, MP4, or any file up to 500MB</p>
                  </div>
                )}
              </div>
            </div>
          )}
          {(productType === 'service_offer' || productType === 'subscription') && (
            <Input
              label="Fulfillment / Booking Link"
              type="url"
              value={externalLink}
              onChange={(e) => setExternalLink(e.target.value)}
              placeholder="https://cal.com/yourname"
              hint="Buyers see this link after payment."
            />
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Seller Info</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            label="Seller / Brand Name"
            value={sellerName}
            onChange={(e) => setSellerName(e.target.value)}
            placeholder="Alex Johnson"
          />
          <Input
            label="Support Email"
            type="email"
            value={supportEmail}
            onChange={(e) => setSupportEmail(e.target.value)}
            placeholder="support@yoursite.com"
          />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-900">Publish Page</p>
              <p className="text-xs text-neutral-500 mt-0.5">Make this product page publicly visible.</p>
            </div>
            <Toggle checked={published} onChange={setPublished} />
          </div>
          {published && slug && (
            <div className="mt-3 flex items-center gap-1.5 text-xs text-neutral-500 bg-neutral-50 px-3 py-2 rounded-lg">
              <span>Public URL:</span>
              <Link
                href={`/p/${slug}`}
                target="_blank"
                className="text-black font-medium flex items-center gap-1 hover:underline"
              >
                /p/{slug}
                <ExternalLink size={10} />
              </Link>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex items-center justify-between pt-2">
        <div className="flex gap-3">
          <Button type="submit" loading={saving}>
            {product ? 'Save Changes' : 'Create Product'}
          </Button>
          <Button type="button" variant="secondary" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
        {product && (
          <Button type="button" variant="danger" loading={deleting} onClick={handleDelete}>
            Delete
          </Button>
        )}
      </div>
    </form>
  )
}
