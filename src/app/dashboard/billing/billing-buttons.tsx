'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { ExternalLink } from 'lucide-react'

interface BillingButtonsProps {
  hasCustomer: boolean
  priceId?: string
  planName?: string
}

export function BillingButtons({ hasCustomer, priceId, planName }: BillingButtonsProps) {
  const [loading, setLoading] = useState(false)

  async function handleSubscribe() {
    if (!priceId) return
    setLoading(true)
    try {
      const res = await fetch('/api/billing-portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId, action: 'subscribe' }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        toast.error('Failed to start checkout. Please try again.')
      }
    } catch {
      toast.error('Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  async function handleManageBilling() {
    setLoading(true)
    try {
      const res = await fetch('/api/billing-portal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'portal' }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        toast.error('Failed to open billing portal.')
      }
    } catch {
      toast.error('Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  if (hasCustomer) {
    return (
      <Button variant="secondary" size="sm" loading={loading} onClick={handleManageBilling}>
        <ExternalLink size={13} />
        Manage Billing
      </Button>
    )
  }

  return (
    <Button className="w-full" size="sm" loading={loading} onClick={handleSubscribe}>
      Upgrade to {planName}
    </Button>
  )
}
