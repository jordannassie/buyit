import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { EmptyState } from '@/components/ui/empty-state'
import { formatCurrency } from '@/lib/utils'
import { Package, ExternalLink, Pencil } from 'lucide-react'

export const metadata = { title: 'Products — Selli' }

export default async function ProductsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('user_id', user!.id)
    .order('created_at', { ascending: false })

  function typeLabel(type: string) {
    return { digital_download: 'Digital Download', service_offer: 'Service Offer', subscription: 'Subscription' }[type] ?? type
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-black">Products</h1>
          <p className="text-neutral-500 text-sm mt-1">Your sell pages.</p>
        </div>
        <Link href="/dashboard/products/new">
          <Button>+ New Product</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Products</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {!products || products.length === 0 ? (
            <EmptyState
              icon={<Package size={32} />}
              title="No products yet"
              description="Create your first product page and start selling."
              action={
                <Link href="/dashboard/products/new">
                  <Button size="sm">Create Product</Button>
                </Link>
              }
            />
          ) : (
            <div className="divide-y divide-neutral-50">
              {products.map((product) => (
                <div key={product.id} className="px-6 py-4 flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-sm font-semibold text-black truncate">{product.name}</p>
                      <Badge variant={product.published ? 'success' : 'neutral'}>
                        {product.published ? 'Live' : 'Draft'}
                      </Badge>
                    </div>
                    <p className="text-xs text-neutral-500">
                      {typeLabel(product.product_type)} · {formatCurrency(product.price_amount, product.currency)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {product.published && (
                      <Link href={`/p/${product.slug}`} target="_blank">
                        <Button size="sm" variant="ghost">
                          <ExternalLink size={13} />
                          View Page
                        </Button>
                      </Link>
                    )}
                    <Link href={`/dashboard/products/${product.id}`}>
                      <Button size="sm" variant="secondary">
                        <Pencil size={13} />
                        Edit
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
