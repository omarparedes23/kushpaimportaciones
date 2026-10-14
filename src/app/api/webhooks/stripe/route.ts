import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient as createAdminClient } from '@supabase/supabase-js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  apiVersion: '2026-05-27.dahlia',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || '';

function getAdminClient() {
  return createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature || !webhookSecret) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  if (event.type === 'payment_intent.succeeded') {
    const intent = event.data.object as Stripe.PaymentIntent;
    const admin = getAdminClient();

    // Check if order already exists
    const { data: existing } = await admin
      .from('kushpa_orders')
      .select('id')
      .eq('stripe_payment_intent_id', intent.id)
      .single();

    if (existing) {
      return NextResponse.json({ received: true });
    }

    // Parse metadata
    const items = JSON.parse(intent.metadata?.items || '[]');
    const shippingAddress = intent.metadata?.shipping_address || '';

    // Create order
    const { data: order, error: orderError } = await admin
      .from('kushpa_orders')
      .insert({
        user_id: intent.metadata?.user_id === 'guest' ? null : intent.metadata?.user_id,
        stripe_payment_intent_id: intent.id,
        status: 'paid',
        total: intent.amount / 100,
        currency: intent.currency.toUpperCase(),
        shipping_address: shippingAddress,
      })
      .select()
      .single();

    if (orderError || !order) {
      console.error('Failed to create order:', orderError);
      return NextResponse.json({ error: 'Order creation failed' }, { status: 500 });
    }

    // Create order items with real prices from DB and decrement stock
    if (items.length > 0) {
      const productIds = items.map((item: { id: string; qty: number }) => item.id);
      const { data: products } = await admin
        .from('kushpa_products')
        .select('id, regular_price, discount_price, stock')
        .in('id', productIds);

      const productMap = new Map((products ?? []).map((p: { id: string; regular_price: number; discount_price: number | null; stock: number }) => [p.id, p]));

      const orderItems = items.map((item: { id: string; qty: number }) => {
        const product = productMap.get(item.id);
        const unit_price = product
          ? (product.discount_price ?? product.regular_price)
          : 0;
        return { order_id: order.id, product_id: item.id, quantity: item.qty, unit_price };
      });

      await admin.from('kushpa_order_items').insert(orderItems);

      for (const item of items as { id: string; qty: number }[]) {
        const product = productMap.get(item.id);
        if (product) {
          await admin
            .from('kushpa_products')
            .update({ stock: Math.max(0, product.stock - item.qty) })
            .eq('id', item.id);
        }
      }
    }
  }

  return NextResponse.json({ received: true });
}
