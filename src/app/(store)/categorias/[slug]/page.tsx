import { getProductsByCategory } from '@/lib/db/products';
import { ProductCard } from '@/components/ProductCard';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const name = slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  return {
    title: `${name} | Kushpa Importaciones`,
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const products = await getProductsByCategory(slug);
  const categoryName = slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <div className="bg-[#F8FAFC] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-slate-800">{categoryName}</h1>
          <p className="text-slate-500 mt-1 text-sm">
            {products.length} {products.length === 1 ? 'producto' : 'productos'} disponibles
          </p>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-slate-400">No hay productos en esta categoría aún.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                slug={product.slug}
                image={product.image_url}
                brand={product.brand}
                title={product.title}
                regularPrice={product.regular_price}
                discountPrice={product.discount_price ?? product.regular_price}
                stock={product.stock}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
