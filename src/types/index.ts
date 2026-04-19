export type ProductType = 'digital_download' | 'service_offer' | 'subscription'

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded'

export type SubscriptionStatus =
  | 'active'
  | 'trialing'
  | 'past_due'
  | 'canceled'
  | 'incomplete'
  | null

export interface Profile {
  id: string
  email: string
  full_name: string | null
  brand_name: string | null
  support_email: string | null
  avatar_url: string | null
  stripe_customer_id: string | null
  stripe_subscription_status: SubscriptionStatus
  stripe_price_id: string | null
  created_at: string
}

export interface Product {
  id: string
  user_id: string
  name: string
  description: string | null
  product_type: ProductType
  price_amount: number
  currency: string
  slug: string
  thumbnail_url: string | null
  cover_url: string | null
  file_path: string | null
  external_link: string | null
  cta_text: string
  seller_name: string | null
  support_email: string | null
  published: boolean
  stripe_product_id: string | null
  stripe_price_id: string | null
  created_at: string
  updated_at: string
}

export interface Order {
  id: string
  user_id: string
  product_id: string
  buyer_email: string
  stripe_checkout_session_id: string | null
  stripe_payment_intent_id: string | null
  stripe_subscription_id: string | null
  amount_total: number
  currency: string
  payment_status: PaymentStatus
  product_type: ProductType
  created_at: string
  products?: Pick<Product, 'name' | 'product_type'>
}

export interface Download {
  id: string
  order_id: string
  product_id: string
  buyer_email: string
  download_token: string
  expires_at: string
  created_at: string
}

export interface PricingPlan {
  name: string
  price: number
  priceId: string
  description: string
  features: string[]
  highlighted?: boolean
}
