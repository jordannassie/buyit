import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatCurrency, formatDate } from '@/lib/utils'
import { Package, ShoppingBag, DollarSign, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import type { Order } from '@/types'

export const metadata = { title: 'Dashboard — Selli' }

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const [{ data: products }, { data: orders }] = await Promise.all([
    supabase.from('products').select('id, name, published, price_amount, product_type, slug').eq('user_id', user!.id),
    supabase.from('orders').select('*, products(name, product_type)').eq('user_id', user!.id).eq('payment_status', 'paid').order('created_at', { ascending: false }).limit(10),
  ])

  const totalRevenue = (orders || []).reduce((sum, o) => sum + (o.amount_total || 0), 0)
  const totalSales = (orders || []).length
  const activeProducts = (products || []).filter((p) => p.published).length

  const thisMonthRevenue = (orders || [])
    .filter((o) => {
      const d = new Date(o.created_at)
      const now = new Date()
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    })
    .reduce((sum, o) => sum + (o.amount_total || 0), 0)

  const stats = [
    { label: 'Total Revenue', value: formatCurrency(totalRevenue), icon: DollarSign },
    { label: 'Total Sales', value: totalSales.toString(), icon: ShoppingBag },
    { label: 'Active Products', value: activeProducts.toString(), icon: Package },
    { label: 'This Month', value: formatCurrency(thisMonthRevenue), icon: TrendingUp },
  ]

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-black">Overview</h1>
        <p className="text-neutral-500 text-sm mt-1">Welcome back. Here&apos;s how things are going.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label}>
              <CardContent className="pt-5 pb-5">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-neutral-500">{stat.label}</p>
                  <Icon size={14} className="text-neutral-400" />
                </div>
                <p className="text-2xl font-bold text-black">{stat.value}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent orders */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {!orders || orders.length === 0 ? (
              <div className="px-6 py-10 text-center">
                <p className="text-sm text-neutral-500">No orders yet.</p>
                <p className="text-xs text-neutral-400 mt-1">Orders will appear here after someone buys.</p>
              </div>
            ) : (
              <div className="divide-y divide-neutral-50">
                {(orders as Order[]).map((order) => (
                  <div key={order.id} className="px-6 py-3 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-neutral-900">{order.buyer_email}</p>
                      <p className="text-xs text-neutral-400">{formatDate(order.created_at)}</p>
                    </div>
                    <span className="text-sm font-semibold text-black">
                      {formatCurrency(order.amount_total, order.currency)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Products */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>My Products</CardTitle>
            <Link href="/dashboard/products/new">
              <Button size="sm">+ New</Button>
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            {!products || products.length === 0 ? (
              <div className="px-6 py-10 text-center">
                <p className="text-sm text-neutral-500">No products yet.</p>
                <Link href="/dashboard/products/new" className="block mt-3">
                  <Button size="sm" variant="secondary">Create your first product</Button>
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-neutral-50">
                {products.map((product) => (
                  <div key={product.id} className="px-6 py-3 flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-neutral-900">{product.name}</p>
                      <p className="text-xs text-neutral-400">
                        {formatCurrency(product.price_amount)} · {product.product_type.replace('_', ' ')}
                      </p>
                    </div>
                    <Badge variant={product.published ? 'success' : 'neutral'}>
                      {product.published ? 'Live' : 'Draft'}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
