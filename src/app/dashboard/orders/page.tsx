import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { EmptyState } from '@/components/ui/empty-state'
import { formatCurrency, formatDate } from '@/lib/utils'
import { ShoppingBag } from 'lucide-react'

export const metadata = { title: 'Orders — Selli' }

function statusVariant(status: string) {
  if (status === 'paid') return 'success'
  if (status === 'failed') return 'danger'
  if (status === 'refunded') return 'warning'
  return 'neutral'
}

export default async function OrdersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: orders } = await supabase
    .from('orders')
    .select('*, products(name)')
    .eq('user_id', user!.id)
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-black">Orders</h1>
        <p className="text-neutral-500 text-sm mt-1">All orders from your product pages.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Orders</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {!orders || orders.length === 0 ? (
            <EmptyState
              icon={<ShoppingBag size={32} />}
              title="No orders yet"
              description="Orders will appear here once someone buys from your product page."
            />
          ) : (
            <>
              {/* Mobile card list */}
              <div className="divide-y divide-neutral-50 sm:hidden">
                {orders.map((order) => (
                  <div key={order.id} className="px-4 py-4 space-y-2">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-neutral-900 truncate">{order.buyer_email}</p>
                        <p className="text-xs text-neutral-400 mt-0.5">
                          {(order.products as { name: string } | null)?.name ?? '—'}
                        </p>
                      </div>
                      <Badge variant={statusVariant(order.payment_status)}>
                        {order.payment_status}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between text-xs text-neutral-500">
                      <span className="capitalize">{order.product_type?.replace('_', ' ')}</span>
                      <div className="flex items-center gap-3">
                        <span>{formatDate(order.created_at)}</span>
                        <span className="font-semibold text-black text-sm">
                          {formatCurrency(order.amount_total, order.currency)}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop table */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-neutral-100 bg-neutral-50">
                      <th className="text-left px-6 py-3 text-xs font-medium text-neutral-500">Customer</th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-neutral-500">Product</th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-neutral-500">Amount</th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-neutral-500">Type</th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-neutral-500">Status</th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-neutral-500">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-50">
                    {orders.map((order) => (
                      <tr key={order.id} className="hover:bg-neutral-50 transition-colors">
                        <td className="px-6 py-3 text-neutral-700">{order.buyer_email}</td>
                        <td className="px-6 py-3 text-neutral-700">
                          {(order.products as { name: string } | null)?.name ?? '—'}
                        </td>
                        <td className="px-6 py-3 font-medium text-black">
                          {formatCurrency(order.amount_total, order.currency)}
                        </td>
                        <td className="px-6 py-3 text-neutral-500 capitalize">
                          {order.product_type?.replace('_', ' ')}
                        </td>
                        <td className="px-6 py-3">
                          <Badge variant={statusVariant(order.payment_status)}>
                            {order.payment_status}
                          </Badge>
                        </td>
                        <td className="px-6 py-3 text-neutral-500">{formatDate(order.created_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
