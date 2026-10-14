'use server';

import { createClient as createAdminClient } from '@supabase/supabase-js';
import { createClient } from '@/utils/supabase/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  apiVersion: '2026-05-27.dahlia',
});

function getAdminClient() {
  return createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export interface CheckoutItem {
  id: string;
  title: string;
  brand: string;
  image_url: string;
  price: number;
  quantity: number;
}

export interface ShippingAddress {
  full_name: string;
  phone: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  region: string;
  postal_code?: string;
}

export async function createPaymentIntent(items: CheckoutItem[], shipping: ShippingAddress) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const admin = getAdminClient();

  // Fetch real prices from DB — never trust client-provided prices
  const productIds = items.map((i) => i.id);
  const { data: products, error: productsError } = await admin
    .from('kushpa_products')
    .select('id, regular_price, discount_price, stock, is_active')
    .in('id', productIds);

  if (productsError || !products) throw new Error('Error al verificar productos');

  const productMap = new Map(products.map((p) => [p.id, p]));

  for (const item of items) {
    const product = productMap.get(item.id);
    if (!product || !product.is_active) throw new Error('Producto no disponible');
    if (product.stock < item.quantity) throw new Error('Stock insuficiente');
  }

  const total = items.reduce((sum, item) => {
    const product = productMap.get(item.id)!;
    const price = product.discount_price ?? product.regular_price;
    return sum + price * item.quantity;
  }, 0);

  const shippingCost = total >= 150 ? 0 : 15;
  const grandTotal = total + shippingCost;

  const intent = await stripe.paymentIntents.create({
    amount: Math.round(grandTotal * 100),
    currency: 'pen',
    metadata: {
      user_id: user?.id || 'guest',
      items: JSON.stringify(items.map((i) => ({ id: i.id, qty: i.quantity }))),
      shipping_name: shipping.full_name,
      shipping_phone: shipping.phone,
      shipping_address: `${shipping.address_line1}, ${shipping.city}, ${shipping.region}`,
    },
  });

  return { clientSecret: intent.client_secret, paymentIntentId: intent.id };
}

export async function getOrder(orderId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const admin = getAdminClient();
  const { data, error } = await admin
    .from('kushpa_orders')
    .select('*, kushpa_order_items(*, kushpa_products(title, image_url, brand))')
    .eq('id', orderId)
    .single();

  if (error) throw new Error(error.message);

  // Prevent PII leak: only the owner (or guest orders) can view the order
  if (data.user_id && data.user_id !== user?.id) {
    throw new Error('No autorizado');
  }

  return data;
}

export interface Order {
  id: string;
  user_id: string | null;
  stripe_payment_intent_id: string | null;
  status: string;
  total: number;
  currency: string;
  shipping_address: string | null;
  created_at: string;
  updated_at: string;
  kushpa_order_items?: Array<{
    id: string;
    quantity: number;
    unit_price: number;
    kushpa_products?: { title: string; image_url: string; brand: string } | null;
  }>;
}

export async function getUserOrders(): Promise<Order[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return [];

  const admin = getAdminClient();
  const { data, error } = await admin
    .from('kushpa_orders')
    .select('*, kushpa_order_items(*, kushpa_products(title, image_url, brand))')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data ?? [];
}
