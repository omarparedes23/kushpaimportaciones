import type { User } from '@supabase/supabase-js';

// app_metadata solo se puede modificar con la service role key; user_metadata lo edita el propio usuario.
export function isAdmin(user: Pick<User, 'app_metadata'> | null | undefined): boolean {
  return user?.app_metadata?.role === 'admin';
}
