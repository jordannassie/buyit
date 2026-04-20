'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

interface BuyButtonProps {
  productId: string
  slug: string
  ctaText: string
}

export function BuyButton({ productId, slug, ctaText }: BuyButtonProps) {
  const [loading, setLoading] = useState(false)

  async function handleBuy() {
    setLoading(true)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, slug }),
      })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        toast.error(data.error || 'Failed to start checkout.')
      }
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button size="lg" loading={loading} onClick={handleBuy} className="w-full sm:w-auto sm:shrink-0">
      {ctaText}
    </Button>
  )
}
