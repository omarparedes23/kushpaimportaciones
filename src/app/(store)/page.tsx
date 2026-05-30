import { HeroBanner } from '@/components/HeroBanner';
import { TrustBadges } from '@/components/TrustBadges';
import { CategoryGrid } from '@/components/CategoryGrid';
import { ProductCard } from '@/components/ProductCard';
import { getProducts } from '@/lib/db/products';
import { ChevronDown } from 'lucide-react';

export default async function Home() {
  const products = await getProducts();

  return (
    <>
      <HeroBanner />
      <TrustBadges />
      <CategoryGrid />

      {/* Products section */}
      <section id="productos" className="py-12 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto px-4 md:px-6">

          {/* Section header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-black text-slate-800">
                Ofertas destacadas
              </h2>
              <p className="text-slate-500 mt-1 text-sm">
                {products.length} productos disponibles
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-500 font-medium">Ordenar por:</span>
              <div className="relative">
                <select className="appearance-none bg-white border border-slate-200 rounded-xl text-sm py-2 pl-4 pr-9 text-slate-700 outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand transition-colors font-medium cursor-pointer">
                  <option>Recomendados</option>
                  <option>Menor precio</option>
                  <option>Mayor precio</option>
                  <option>Mayor descuento</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              </div>
            </div>
          </div>

          {/* Product grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 md:gap-5">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                image={product.image_url}
                brand={product.brand}
                title={product.title}
                regularPrice={product.regular_price}
                discountPrice={product.discount_price ?? product.regular_price}
              />
            ))}
          </div>

          {/* Load more */}
          {products.length >= 8 && (
            <div className="mt-12 flex justify-center">
              <button className="group flex items-center gap-2 bg-white border-2 border-slate-200 hover:border-brand text-slate-600 hover:text-brand font-semibold px-8 py-3 rounded-full transition-all duration-200 hover:shadow-md">
                Mostrar más productos
                <ChevronDown className="h-4 w-4 group-hover:translate-y-0.5 transition-transform" />
              </button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
