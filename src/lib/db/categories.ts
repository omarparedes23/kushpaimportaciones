import { createClient } from '@/utils/supabase/server';
import type { KushpaCategory } from './types';

export async function getCategories(): Promise<KushpaCategory[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('kushpa_categories')
    .select('*')
    .order('name');

  if (error) throw error;
  return data ?? [];
}
