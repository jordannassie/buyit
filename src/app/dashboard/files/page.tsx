import { createClient } from '@/lib/supabase/server'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { EmptyState } from '@/components/ui/empty-state'
import { formatDate } from '@/lib/utils'
import { FileDown } from 'lucide-react'

export const metadata = { title: 'Files — Selli' }

export default async function FilesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: products } = await supabase
    .from('products')
    .select('id, name, file_path, product_type, created_at')
    .eq('user_id', user!.id)
    .eq('product_type', 'digital_download')
    .not('file_path', 'is', null)

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-black">Files</h1>
        <p className="text-neutral-500 text-sm mt-1">Digital files attached to your products.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Uploaded Files</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {!products || products.length === 0 ? (
            <EmptyState
              icon={<FileDown size={32} />}
              title="No files uploaded"
              description="Upload a file when creating a digital download product."
            />
          ) : (
            <div className="divide-y divide-neutral-50">
              {products.map((product) => (
                <div key={product.id} className="px-6 py-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-neutral-100 rounded-lg flex items-center justify-center">
                      <FileDown size={16} className="text-neutral-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-neutral-900">{product.name}</p>
                      <p className="text-xs text-neutral-400 font-mono truncate max-w-xs">
                        {product.file_path?.split('/').pop()}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-neutral-400">{formatDate(product.created_at)}</p>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="mt-4 p-4 bg-neutral-50 border border-neutral-200 rounded-xl">
        <p className="text-xs text-neutral-500">
          Files are stored securely and delivered to buyers only after successful payment.
          Each download link expires after 24 hours.
        </p>
      </div>
    </div>
  )
}
