'use server';

import { requireAdmin } from '@/lib/auth/require-admin';
import { getCategories } from '@/lib/db/categories';
import type { KushpaCategory } from '@/lib/db/types';

export async function getAdminCategories(): Promise<KushpaCategory[]> {
  await requireAdmin();
  return getCategories();
}
