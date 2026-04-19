import { NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params
  const supabase = await createServiceClient()

  // Look up the download record
  const { data: download } = await supabase
    .from('downloads')
    .select('*, products(file_path, name)')
    .eq('download_token', token)
    .single()

  if (!download) {
    return new NextResponse('Download not found.', { status: 404 })
  }

  // Check expiry
  if (new Date(download.expires_at) < new Date()) {
    return new NextResponse('This download link has expired.', { status: 410 })
  }

  const product = download.products as { file_path: string; name: string } | null

  if (!product?.file_path) {
    return new NextResponse('File not found.', { status: 404 })
  }

  // Generate a signed URL (valid for 60 seconds — just enough to start the download)
  const { data: signedUrl, error } = await supabase.storage
    .from('product-files')
    .createSignedUrl(product.file_path, 60, {
      download: product.name,
    })

  if (error || !signedUrl?.signedUrl) {
    console.error('Signed URL error:', error)
    return new NextResponse('Failed to generate download link.', { status: 500 })
  }

  return NextResponse.redirect(signedUrl.signedUrl)
}
