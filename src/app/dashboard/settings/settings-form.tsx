'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'

interface SettingsFormProps {
  profile: {
    full_name: string
    brand_name: string
    support_email: string
  }
  userId: string
}

export function SettingsForm({ profile, userId }: SettingsFormProps) {
  const [fullName, setFullName] = useState(profile.full_name)
  const [brandName, setBrandName] = useState(profile.brand_name)
  const [supportEmail, setSupportEmail] = useState(profile.support_email)
  const [saving, setSaving] = useState(false)

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)

    const supabase = createClient()
    const { error } = await supabase
      .from('profiles')
      .update({ full_name: fullName, brand_name: brandName, support_email: supportEmail })
      .eq('id', userId)

    if (error) {
      toast.error('Failed to save settings.')
    } else {
      toast.success('Settings saved.')
    }
    setSaving(false)
  }

  return (
    <form onSubmit={handleSave} className="space-y-4">
      <Input
        label="Full Name"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
        placeholder="Your name"
      />
      <Input
        label="Brand Name"
        value={brandName}
        onChange={(e) => setBrandName(e.target.value)}
        placeholder="Your brand or business name"
        hint="Shown on public product pages."
      />
      <Input
        label="Support Email"
        type="email"
        value={supportEmail}
        onChange={(e) => setSupportEmail(e.target.value)}
        placeholder="support@yoursite.com"
        hint="Buyers can reach you at this address."
      />
      <div className="pt-2">
        <Button type="submit" loading={saving}>
          Save Changes
        </Button>
      </div>
    </form>
  )
}
