export interface KushpaProduct {
  id: string;
  image_url: string;
  brand: string;
  title: string;
  regular_price: number;
  discount_price: number | null;
  stock: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface KushpaCategory {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

export interface KushpaCartItem {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  created_at: string;
}

export interface KushpaOrder {
  id: string;
  user_id: string | null;
  stripe_payment_intent_id: string | null;
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  currency: string;
  shipping_address: string | null;
  created_at: string;
  updated_at: string;
}

export interface KushpaOrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  created_at: string;
}

export interface KushpaProfile {
  id: string;
  full_name: string | null;
  phone: string | null;
  address: string | null;
  created_at: string;
  updated_at: string;
}
