import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { ProductForm } from '@/components/dashboard/product-form'

export const metadata = { title: 'Edit Product — Selli' }

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .eq('user_id', user!.id)
    .single()

  if (!product) notFound()

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-black">Edit Product</h1>
        <p className="text-neutral-500 text-sm mt-1">{product.name}</p>
      </div>
      <ProductForm
        userId={user!.id}
        product={product}
        defaultSellerName={product.seller_name ?? ''}
        defaultSupportEmail={product.support_email ?? user!.email ?? ''}
      />
    </div>
  )
}
