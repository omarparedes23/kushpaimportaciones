import { Suspense } from 'react';
import { searchProducts, getProducts } from '@/lib/db/products';
import { ProductCard } from '@/components/ProductCard';
import { Search } from 'lucide-react';

async function SearchResults({ query }: { query: string }) {
  const products = query
    ? await searchProducts(query)
    : await getProducts();

  return (
    <>
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-800">
          {query ? `Resultados para "${query}"` : 'Todos los productos'}
        </h1>
        <p className="text-slate-500 mt-1 text-sm">
          {products.length} {products.length === 1 ? 'producto encontrado' : 'productos encontrados'}
        </p>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-16">
          <Search className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-600 mb-2">No encontramos resultados</h2>
          <p className="text-slate-400 text-sm">
            Intenta con otros términos o explora nuestras categorías.
          </p>
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
    </>
  );
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; categoria?: string }>;
}) {
  const params = await searchParams;
  const query = params.q || '';
  const category = params.categoria || '';

  let products;
  if (category) {
    const { getProductsByCategory } = await import('@/lib/db/products');
    products = await getProductsByCategory(category);
  } else {
    products = query ? await searchProducts(query) : await getProducts();
  }

  return (
    <div className="bg-[#F8FAFC] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <Suspense fallback={
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand" />
          </div>
        }>
          {category ? (
            <>
              <div className="mb-8">
                <h1 className="text-3xl font-black text-slate-800">
                  Categoría: {category.replace(/-/g, ' ')}
                </h1>
                <p className="text-slate-500 mt-1 text-sm">
                  {products.length} {products.length === 1 ? 'producto' : 'productos'} disponibles
                </p>
              </div>
              {products.length === 0 ? (
                <div className="text-center py-16">
                  <Search className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                  <h2 className="text-xl font-bold text-slate-600 mb-2">No hay productos en esta categoría</h2>
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
            </>
          ) : (
            <SearchResults query={query} />
          )}
        </Suspense>
      </div>
    </div>
  );
}
