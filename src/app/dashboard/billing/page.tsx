import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Check } from 'lucide-react'

export const metadata = { title: 'Billing — Selli' }

export default function BillingPage() {
  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-black">Billing</h1>
        <p className="text-neutral-500 text-sm mt-1">No monthly fee. You only pay when you sell.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Direct sales fee</CardTitle>
          <CardDescription>Shared when you publish your own product page or storefront.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-4xl font-bold text-black">10% + $0.50 per transaction</p>
          <p className="text-sm text-neutral-500">
            Includes instant checkout, delivery, receipts, and payout-ready reporting.
          </p>
          <ul className="space-y-2 text-sm text-neutral-600">
            {['No monthly subscription', 'Simple selling, simple pricing', 'Built for downloads, services, and subscriptions'].map((item) => (
              <li key={item} className="flex items-center gap-2">
                <Check size={14} className="text-black flex-shrink-0" />
                {item}
              </li>
            ))}
          </ul>
          <p className="text-xs text-neutral-400">
            Payment processing fees may apply separately.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Discover marketplace (future)</CardTitle>
          <CardDescription>Only when Selli brings the buyer.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-2xl font-semibold text-black">30% per transaction</p>
          <p className="text-sm text-neutral-500">
            We’ll only take this fee when a customer discovers your work through Selli’s future marketplace. The 10% + $0.50 direct fee still applies when you share links yourself.
          </p>
          <Badge variant="neutral">Discover fees not live yet</Badge>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Future-ready payout + tax settings</CardTitle>
          <CardDescription>Coming soon.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-neutral-600">
          <p>Connect your payout account and track tax settings effortlessly.</p>
          <p>The billing portal will let you review past transactions and fees.</p>
        </CardContent>
      </Card>
    </div>
  )
}
