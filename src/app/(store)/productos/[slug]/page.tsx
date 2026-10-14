import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getProductBySlug, getProducts } from '@/lib/db/products';
import { AddToCartButton } from './AddToCartButton';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: 'Producto no encontrado' };
  return {
    title: `${product.title} | Kushpa Importaciones`,
    description: product.description || `${product.title} - ${product.brand}`,
  };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  const discountPercentage = product.discount_price
    ? Math.round(((product.regular_price - product.discount_price) / product.regular_price) * 100)
    : 0;

  const currentPrice = product.discount_price ?? product.regular_price;

  // Get related products (same brand, excluding current)
  const allProducts = await getProducts();
  const related = allProducts
    .filter((p) => p.brand === product.brand && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="bg-[#F8FAFC] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-slate-500 mb-8">
          <Link href="/" className="hover:text-brand transition-colors">Inicio</Link>
          <span>/</span>
          <Link href="/#productos" className="hover:text-brand transition-colors">Productos</Link>
          <span>/</span>
          <span className="text-slate-800 font-medium">{product.title}</span>
        </nav>

        {/* Main product section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Image */}
          <div className="relative aspect-square bg-white rounded-3xl border border-slate-100 overflow-hidden p-8">
            {discountPercentage > 0 && (
              <div className="absolute top-4 left-4 z-10 bg-danger text-white text-sm font-black px-3 py-1.5 rounded-full shadow-sm">
                -{discountPercentage}%
              </div>
            )}
            <Image
              src={product.image_url}
              alt={product.title}
              fill
              className="object-contain mix-blend-multiply p-8"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          </div>

          {/* Details */}
          <div className="flex flex-col">
            <span className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
              {product.brand}
            </span>

            <h1 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight mb-4">
              {product.title}
            </h1>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-4xl font-black text-brand">
                S/ {currentPrice.toFixed(2)}
              </span>
              {discountPercentage > 0 && (
                <>
                  <span className="text-lg text-slate-400 line-through">
                    S/ {product.regular_price.toFixed(2)}
                  </span>
                  <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                    Ahorras S/ {(product.regular_price - currentPrice).toFixed(2)}
                  </span>
                </>
              )}
            </div>

            {/* Stock */}
            <div className="flex items-center gap-2 mb-6">
              {product.stock > 0 ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-sm text-emerald-700 font-medium">
                    {product.stock > 10 ? 'En stock' : `Solo quedan ${product.stock} unidades`}
                  </span>
                </>
              ) : (
                <>
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                  <span className="text-sm text-red-600 font-medium">Agotado</span>
                </>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <div className="mb-8">
                <h3 className="text-sm font-bold text-slate-800 mb-2 uppercase tracking-wide">Descripción</h3>
                <p className="text-slate-600 leading-relaxed">{product.description}</p>
              </div>
            )}

            {/* Add to cart */}
            <AddToCartButton
              product={{
                id: product.id,
                title: product.title,
                brand: product.brand,
                image_url: product.image_url,
                price: currentPrice,
                stock: product.stock,
              }}
            />

            {/* Trust signals */}
            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-100">
                <div className="p-2 bg-emerald-50 rounded-lg">
                  <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">Envío gratis</p>
                  <p className="text-[10px] text-slate-500">Compras +S/ 150</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-100">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <svg className="w-4 h-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">Compra segura</p>
                  <p className="text-[10px] text-slate-500">Pago protegido SSL</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-100">
                <div className="p-2 bg-orange-50 rounded-lg">
                  <svg className="w-4 h-4 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">Devoluciones</p>
                  <p className="text-[10px] text-slate-500">30 días sin preguntas</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-100">
                <div className="p-2 bg-purple-50 rounded-lg">
                  <svg className="w-4 h-4 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-800">Garantía</p>
                  <p className="text-[10px] text-slate-500">Producto 100% original</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-black text-slate-800 mb-6">Productos relacionados</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {related.map((p) => (
                <Link
                  key={p.id}
                  href={`/productos/${p.slug}`}
                  className="group bg-white rounded-2xl border border-slate-100 hover:border-brand/20 hover:shadow-lg transition-all overflow-hidden"
                >
                  <div className="relative aspect-square p-4">
                    <Image
                      src={p.image_url}
                      alt={p.title}
                      fill
                      className="object-contain mix-blend-multiply"
                      sizes="25vw"
                    />
                  </div>
                  <div className="p-4 pt-0">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{p.brand}</span>
                    <h3 className="text-sm font-semibold text-slate-700 line-clamp-2 mt-1 group-hover:text-brand transition-colors">
                      {p.title}
                    </h3>
                    <p className="text-lg font-black text-slate-900 mt-2">
                      S/ {(p.discount_price ?? p.regular_price).toFixed(2)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
