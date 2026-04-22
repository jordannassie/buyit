import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ProductForm } from '@/components/dashboard/product-form'

export const metadata = { title: 'New Product — Selli' }

export default async function NewProductPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select('seller_name:full_name, support_email, stripe_price_id, stripe_subscription_status')
    .eq('id', user!.id)
    .single()

  const isSubscribed =
    profile?.stripe_subscription_status === 'active' ||
    profile?.stripe_subscription_status === 'trialing'

  // Count existing products
  const { count } = await supabase
    .from('products')
    .select('id', { count: 'exact', head: true })
    .eq('user_id', user!.id)

  const productCount = count ?? 0
  const planLimit =
    profile?.stripe_price_id === process.env.STRIPE_PRO_PRICE_ID ? 5 :
    profile?.stripe_price_id === process.env.STRIPE_STARTER_PRICE_ID ? 1 : 0

  if (isSubscribed && productCount >= planLimit) {
    redirect('/dashboard/billing')
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-4 sm:mb-8">
        <h1 className="text-xl sm:text-2xl font-bold text-black">New Product</h1>
        <p className="text-neutral-500 text-sm mt-0.5">Create your sell page.</p>
      </div>
      <ProductForm
        userId={user!.id}
        defaultSellerName={profile?.seller_name ?? ''}
        defaultSupportEmail={profile?.support_email ?? user!.email ?? ''}
      />
    </div>
  )
}
