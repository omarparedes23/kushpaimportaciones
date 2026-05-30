import { createClient } from '@/utils/supabase/server';
import type { KushpaProduct } from './types';

export async function getProducts(): Promise<KushpaProduct[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('kushpa_products')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function getAllProducts(): Promise<KushpaProduct[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('kushpa_products')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function getProductsByCategory(slug: string): Promise<KushpaProduct[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('kushpa_products')
    .select('*, kushpa_product_categories!inner(category_id, kushpa_categories!inner(slug))')
    .eq('is_active', true)
    .eq('kushpa_product_categories.kushpa_categories.slug', slug);

  if (error) throw error;
  return data ?? [];
}

export async function getProductsByBrand(brand: string): Promise<KushpaProduct[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('kushpa_products')
    .select('*')
    .eq('is_active', true)
    .eq('brand', brand);

  if (error) throw error;
  return data ?? [];
}

export async function searchProducts(query: string): Promise<KushpaProduct[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('kushpa_products')
    .select('*')
    .eq('is_active', true)
    .or(`title.ilike.%${query}%,brand.ilike.%${query}%`);

  if (error) throw error;
  return data ?? [];
}
