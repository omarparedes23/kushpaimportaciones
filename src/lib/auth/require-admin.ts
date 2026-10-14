import { createClient } from '@/utils/supabase/server';
import { isAdmin } from './is-admin';

export async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!isAdmin(user)) throw new Error('Unauthorized');
}
