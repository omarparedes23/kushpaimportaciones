'use server';

import { createClient as createAdminClient } from '@supabase/supabase-js';
import { requireAdmin } from '@/lib/auth/require-admin';
import type { KushpaProduct } from '@/lib/db/types';
import { toProductCategoryRows, uniqueCategoryIds } from '@/lib/categories/product-category-rows';

interface ProductData {
  title: string;
  brand: string;
  regular_price: number;
  discount_price: number | null;
  stock: number;
  is_active: boolean;
  image_url: string;
  category_ids: string[];
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
    .select('*, kushpa_product_categories(category_id)')
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []).map(({ kushpa_product_categories, ...product }) => ({
    ...product,
    category_ids: (kushpa_product_categories ?? []).map((row: { category_id: string }) => row.category_id),
  }));
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Upsert first, then prune: a failure mid-way never leaves the product without its categories.
async function syncProductCategories(productId: string, categoryIds: string[]): Promise<void> {
  const client = getAdminClient();
  const ids = uniqueCategoryIds(categoryIds);
  if (!ids.every(id => UUID_RE.test(id))) throw new Error('Categoría inválida');

  if (ids.length > 0) {
    const { error } = await client
      .from('kushpa_product_categories')
      .upsert(toProductCategoryRows(productId, ids), { onConflict: 'product_id,category_id', ignoreDuplicates: true });
    if (error) throw new Error(error.message);
  }

  const prune = client.from('kushpa_product_categories').delete().eq('product_id', productId);
  const { error } = ids.length > 0 ? await prune.not('category_id', 'in', `(${ids.join(',')})`) : await prune;
  if (error) throw new Error(error.message);
}

export async function saveProduct(data: ProductData): Promise<void> {
  await requireAdmin();
  const { category_ids, ...product } = data;
  const slug = generateSlug(product.title);
  const client = getAdminClient();
  const { data: created, error } = await client
    .from('kushpa_products')
    .insert({ ...product, slug })
    .select('id')
    .single();
  if (error) throw new Error(error.message);

  try {
    await syncProductCategories(created.id, category_ids);
  } catch (err) {
    await client.from('kushpa_products').delete().eq('id', created.id);
    throw err;
  }
}

export async function updateProduct(id: string, data: ProductData): Promise<void> {
  await requireAdmin();
  const { category_ids, ...product } = data;
  const { error } = await getAdminClient()
    .from('kushpa_products')
    .update(product)
    .eq('id', id);
  if (error) throw new Error(error.message);
  await syncProductCategories(id, category_ids);
}

export async function deleteProduct(id: string): Promise<void> {
  await requireAdmin();
  const { error } = await getAdminClient()
    .from('kushpa_products')
    .delete()
    .eq('id', id);
  if (error) throw new Error(error.message);
}
