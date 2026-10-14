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

export async function getProductsByCategory(categorySlug: string): Promise<KushpaProduct[]> {
  const supabase = await createClient();

  // First get the category ID
  const { data: category } = await supabase
    .from('kushpa_categories')
    .select('id')
    .eq('slug', categorySlug)
    .single();

  if (!category) return [];

  // Then get products in that category
  const { data, error } = await supabase
    .from('kushpa_products')
    .select('*')
    .eq('is_active', true)
    .eq('category_id', category.id)
    .order('created_at', { ascending: false });

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

export async function getProductBySlug(slug: string): Promise<KushpaProduct | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('kushpa_products')
    .select('*')
    .eq('slug', slug)
    .eq('is_active', true)
    .single();

  if (error) return null;
  return data;
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
