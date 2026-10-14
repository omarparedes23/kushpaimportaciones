-- Migration: add slug column to kushpa_products and populate existing rows
-- Run this in Supabase Dashboard → SQL Editor
-- If step 4 fails with "constraint already exists", skip it — it's already there.

-- 1. Add column (nullable first so existing rows don't fail)
ALTER TABLE public.kushpa_products
  ADD COLUMN IF NOT EXISTS slug TEXT;

-- 2. Populate slug for every product that doesn't have one yet
--    Uses only ASCII-safe operations available in Postgres
UPDATE public.kushpa_products
SET slug = regexp_replace(
             regexp_replace(
               regexp_replace(
                 lower(title),
                 '[àáâãäå]', 'a', 'g'
               ),
               '[èéêë]', 'e', 'g'
             ),
             '[íìîï]', 'i', 'g'
           )
WHERE slug IS NULL OR slug = '';

-- Continue replacing remaining accented chars and special chars
UPDATE public.kushpa_products
SET slug = regexp_replace(
             regexp_replace(
               regexp_replace(
                 regexp_replace(slug, '[óòôõö]', 'o', 'g'),
                 '[úùûü]', 'u', 'g'
               ),
               '[ñ]', 'n', 'g'
             ),
             '[^a-z0-9\s-]', '', 'g'
           )
WHERE slug IS NOT NULL;

-- Trim and replace spaces/repeated hyphens
UPDATE public.kushpa_products
SET slug = regexp_replace(
             regexp_replace(
               trim(slug),
               '\s+', '-', 'g'
             ),
             '-+', '-', 'g'
           )
WHERE slug IS NOT NULL;

-- 3. Handle duplicate slugs (append -2, -3, etc.)
WITH ranked AS (
  SELECT id, slug,
         row_number() OVER (PARTITION BY slug ORDER BY created_at) AS rn
  FROM public.kushpa_products
)
UPDATE public.kushpa_products p
SET slug = r.slug || '-' || r.rn
FROM ranked r
WHERE p.id = r.id AND r.rn > 1;

-- 4. Add NOT NULL + UNIQUE constraints now that all rows are populated
ALTER TABLE public.kushpa_products
  ALTER COLUMN slug SET NOT NULL;

ALTER TABLE public.kushpa_products
  ADD CONSTRAINT kushpa_products_slug_key UNIQUE (slug);
