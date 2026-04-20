import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { SettingsForm } from './settings-form'

export const metadata = { title: 'Settings — Selli' }

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, brand_name, support_email, avatar_url')
    .eq('id', user!.id)
    .single()

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-black">Settings</h1>
        <p className="text-neutral-500 text-sm mt-1">Manage your account and seller information.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Seller Profile</CardTitle>
          <CardDescription>This info appears on your public product pages.</CardDescription>
        </CardHeader>
        <CardContent>
          <SettingsForm
            profile={{
              full_name: profile?.full_name ?? '',
              brand_name: profile?.brand_name ?? '',
              support_email: profile?.support_email ?? user!.email ?? '',
            }}
            userId={user!.id}
          />
        </CardContent>
      </Card>
    </div>
  )
}
