'use server';

import { createClient as createAdminClient } from '@supabase/supabase-js';
import { createClient } from '@/utils/supabase/server';
import type { KushpaProduct } from '@/lib/db/types';

interface ProductData {
  title: string;
  brand: string;
  regular_price: number;
  discount_price: number | null;
  stock: number;
  is_active: boolean;
  image_url: string;
}

function getAdminClient() {
  return createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

async function requireAuth() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Unauthorized');
}

export async function getAdminProducts(): Promise<KushpaProduct[]> {
  await requireAuth();
  const { data, error } = await getAdminClient()
    .from('kushpa_products')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function saveProduct(data: ProductData): Promise<void> {
  await requireAuth();
  const { error } = await getAdminClient().from('kushpa_products').insert(data);
  if (error) throw new Error(error.message);
}

export async function updateProduct(id: string, data: ProductData): Promise<void> {
  await requireAuth();
  const { error } = await getAdminClient()
    .from('kushpa_products')
    .update(data)
    .eq('id', id);
  if (error) throw new Error(error.message);
}

export async function deleteProduct(id: string): Promise<void> {
  await requireAuth();
  const { error } = await getAdminClient()
    .from('kushpa_products')
    .delete()
    .eq('id', id);
  if (error) throw new Error(error.message);
}
