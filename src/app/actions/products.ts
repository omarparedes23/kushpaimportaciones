'use server';

import { createClient as createAdminClient } from '@supabase/supabase-js';
import { requireAdmin } from '@/lib/auth/require-admin';
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

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function getAdminClient() {
  return createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function getAdminProducts(): Promise<KushpaProduct[]> {
  await requireAdmin();
  const { data, error } = await getAdminClient()
    .from('kushpa_products')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function saveProduct(data: ProductData): Promise<void> {
  await requireAdmin();
  const slug = generateSlug(data.title);
  const { error } = await getAdminClient()
    .from('kushpa_products')
    .insert({ ...data, slug });
  if (error) throw new Error(error.message);
}

export async function updateProduct(id: string, data: ProductData): Promise<void> {
  await requireAdmin();
  const { error } = await getAdminClient()
    .from('kushpa_products')
    .update(data)
    .eq('id', id);
  if (error) throw new Error(error.message);
}

export async function deleteProduct(id: string): Promise<void> {
  await requireAdmin();
  const { error } = await getAdminClient()
    .from('kushpa_products')
    .delete()
    .eq('id', id);
  if (error) throw new Error(error.message);
}
