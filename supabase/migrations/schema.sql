-- schema.sql
-- Create tables for Kushpa Importaciones

-- 1. kushpa_categories
CREATE TABLE IF NOT EXISTS public.kushpa_categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. kushpa_products
CREATE TABLE IF NOT EXISTS public.kushpa_products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    category_id UUID REFERENCES public.kushpa_categories(id) ON DELETE SET NULL,
    brand TEXT,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    discount_price DECIMAL(10,2),
    image_url TEXT, -- This will hold the Cloudflare R2 URL
    stock INTEGER DEFAULT 0 NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Sample Data (Categories)
INSERT INTO public.kushpa_categories (name, slug) VALUES 
('Niños y Juguetería', 'ninos-y-jugueteria'),
('Decohogar', 'decohogar'),
('Electrohogar', 'electrohogar'),
('Deportes y aire libre', 'deportes-y-aire-libre')
ON CONFLICT (slug) DO NOTHING;

-- Sample Data (Products using public image URLs as requested)
-- We use a generic image URL for now as requested
INSERT INTO public.kushpa_products (brand, name, slug, description, price, discount_price, image_url, stock) VALUES 
('Raff', 'Cocina de inducción de 1 hornilla', 'cocina-induccion-1-hornilla', 'Cocina de inducción portátil.', 150.00, 113.90, 'https://images.unsplash.com/photo-1556910103-1c02745a872f?auto=format&fit=crop&q=80&w=400', 50),
('Generico', 'Máquina Portátil de Coser con 12 Puntadas', 'maquina-coser-portatil', 'Color Blanco.', 160.00, 103.90, 'https://images.unsplash.com/photo-1599643478524-fb6664d098d3?auto=format&fit=crop&q=80&w=400', 30),
('Generico', 'Juego de Olla Hau Roland 12 piezas', 'juego-olla-12-piezas', 'Set completo para cocina.', 499.00, 284.90, 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&q=80&w=400', 20),
('Cafini', 'Cafetera Espresso Premium', 'cafetera-espresso-premium', 'Cafetera de alta presión.', 350.00, 299.00, 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?auto=format&fit=crop&q=80&w=400', 15),
('Exploding kittens', 'Juego de Mesa Exploding Kittens', 'exploding-kittens', 'Edición original.', 80.00, 65.00, 'https://images.unsplash.com/photo-1610890716171-6b1bb98ffaed?auto=format&fit=crop&q=80&w=400', 100),
('Finezza', 'Set de Cubiertos 24 piezas', 'set-cubiertos-24-piezas', 'Acero inoxidable.', 120.00, 89.90, 'https://images.unsplash.com/photo-1585236767554-159a60e0a5cc?auto=format&fit=crop&q=80&w=400', 40)
ON CONFLICT (slug) DO NOTHING;
