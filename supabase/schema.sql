-- ============================================================
-- SELLI DATABASE SCHEMA
-- Run this in the Supabase SQL editor to set up all tables.
-- ============================================================

-- ─── PROFILES ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.profiles (
  id                          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email                       TEXT,
  full_name                   TEXT,
  brand_name                  TEXT,
  support_email               TEXT,
  avatar_url                  TEXT,
  stripe_customer_id          TEXT UNIQUE,
  stripe_subscription_status  TEXT,
  stripe_price_id             TEXT,
  created_at                  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Users can only read/update their own profile
CREATE POLICY "profiles_select_own" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Service role can do anything (needed for webhooks)
CREATE POLICY "profiles_service_all" ON public.profiles
  USING (auth.role() = 'service_role');

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data ->> 'full_name'
  );
  RETURN NEW;
END;
$$;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- ─── PRODUCTS ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.products (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name              TEXT NOT NULL,
  description       TEXT,
  product_type      TEXT NOT NULL CHECK (product_type IN ('digital_download', 'service_offer', 'subscription')),
  price_amount      INTEGER NOT NULL,
  currency          TEXT NOT NULL DEFAULT 'usd',
  slug              TEXT NOT NULL UNIQUE,
  thumbnail_url     TEXT,
  cover_url         TEXT,
  file_path         TEXT,
  external_link     TEXT,
  cta_text          TEXT NOT NULL DEFAULT 'Buy Now',
  seller_name       TEXT,
  support_email     TEXT,
  published         BOOLEAN NOT NULL DEFAULT FALSE,
  stripe_product_id TEXT,
  stripe_price_id   TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Owners can do everything with their products
CREATE POLICY "products_owner_all" ON public.products
  USING (auth.uid() = user_id);

-- Anyone can read published products (public sell pages)
CREATE POLICY "products_public_read" ON public.products
  FOR SELECT USING (published = TRUE);

-- Service role bypass
CREATE POLICY "products_service_all" ON public.products
  USING (auth.role() = 'service_role');


-- ─── ORDERS ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.orders (
  id                            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                       UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  product_id                    UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  buyer_email                   TEXT NOT NULL,
  stripe_checkout_session_id    TEXT,
  stripe_payment_intent_id      TEXT,
  stripe_subscription_id        TEXT,
  amount_total                  INTEGER NOT NULL,
  currency                      TEXT NOT NULL DEFAULT 'usd',
  payment_status                TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
  product_type                  TEXT NOT NULL,
  created_at                    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Sellers can read their own orders
CREATE POLICY "orders_seller_read" ON public.orders
  FOR SELECT USING (auth.uid() = user_id);

-- Service role can insert/update (webhooks do this)
CREATE POLICY "orders_service_all" ON public.orders
  USING (auth.role() = 'service_role');


-- ─── DOWNLOADS ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.downloads (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id        UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id      UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  buyer_email     TEXT NOT NULL,
  download_token  TEXT NOT NULL UNIQUE,
  expires_at      TIMESTAMPTZ NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.downloads ENABLE ROW LEVEL SECURITY;

-- Service role only (download tokens are resolved server-side)
CREATE POLICY "downloads_service_all" ON public.downloads
  USING (auth.role() = 'service_role');

-- Sellers can view their download records
CREATE POLICY "downloads_seller_read" ON public.downloads
  FOR SELECT
  USING (
    auth.uid() IN (
      SELECT user_id FROM public.products WHERE id = product_id
    )
  );


-- ─── STORAGE BUCKETS ────────────────────────────────────────
-- Run these in the Supabase dashboard Storage section,
-- OR via the SQL editor using the storage schema:

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('product-images', 'product-images', TRUE, 5242880, ARRAY['image/jpeg','image/png','image/webp','image/gif']),
  ('product-files',  'product-files',  FALSE, 524288000, NULL)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for product-images (public)
CREATE POLICY "product_images_public_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'product-images');

CREATE POLICY "product_images_auth_upload" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'product-images' AND auth.uid() IS NOT NULL
  );

CREATE POLICY "product_images_owner_update" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'product-images' AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "product_images_owner_delete" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'product-images' AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Storage policies for product-files (private — service role only for downloads)
CREATE POLICY "product_files_auth_upload" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'product-files' AND auth.uid() IS NOT NULL
  );

CREATE POLICY "product_files_owner_select" ON storage.objects
  FOR SELECT USING (
    bucket_id = 'product-files' AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "product_files_owner_delete" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'product-files' AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- ─── INDEXES ────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_products_user_id ON public.products(user_id);
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_product_id ON public.orders(product_id);
CREATE INDEX IF NOT EXISTS idx_downloads_token ON public.downloads(download_token);
CREATE INDEX IF NOT EXISTS idx_downloads_order_id ON public.downloads(order_id);
CREATE INDEX IF NOT EXISTS idx_profiles_stripe_customer ON public.profiles(stripe_customer_id);
