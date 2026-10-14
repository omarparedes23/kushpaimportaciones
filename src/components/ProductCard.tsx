'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/lib/cart-context';

interface ProductCardProps {
  id: string;
  slug: string;
  image: string;
  brand: string;
  title: string;
  regularPrice: number;
  discountPrice: number;
  stock: number;
}

export function ProductCard({ id, slug, image, brand, title, regularPrice, discountPrice, stock }: ProductCardProps) {
  const discountPercentage = Math.round(((regularPrice - discountPrice) / regularPrice) * 100);
  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem({ id, title, brand, image_url: image, price: discountPrice });
  };

  return (
    <div className="group relative flex flex-col bg-white rounded-2xl border border-slate-100 hover:border-brand/20 hover:shadow-xl hover:shadow-slate-200/80 transition-all duration-300 overflow-hidden">

      {/* Discount badge */}
      {discountPercentage > 0 && (
        <div className="absolute top-3 left-3 z-10 bg-danger text-white text-xs font-black px-2.5 py-1 rounded-full shadow-sm">
          -{discountPercentage}%
        </div>
      )}

      <Link href={`/productos/${slug}`} className="flex flex-col flex-1">
      {/* Image */}
      <div className="relative aspect-square w-full overflow-hidden bg-slate-50 p-4">
        <Image
          src={image}
          alt={title}
          fill
          className="object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4 pt-3">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
          {brand}
        </span>
        <h3 className="text-sm font-semibold text-slate-700 line-clamp-2 mb-3 flex-1 leading-snug group-hover:text-brand transition-colors">
          {title}
        </h3>

        <div className="mt-auto">
          <div className="flex items-baseline gap-2 mb-0.5">
            <span className="text-xl font-black text-slate-900">
              S/ {discountPrice.toFixed(2)}
            </span>
          </div>
          {discountPercentage > 0 && (
            <span className="text-xs text-slate-400 line-through">
              S/ {regularPrice.toFixed(2)}
            </span>
          )}

          {/* Stock badge */}
          <div className="mt-3 flex items-center justify-between">
            {stock === 0 ? (
              <span className="inline-flex items-center gap-1 bg-red-50 text-red-600 text-[10px] font-bold px-2 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                Agotado
              </span>
            ) : (
              <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full ${stock <= 10 ? 'bg-orange-50 text-orange-600' : 'bg-emerald-50 text-emerald-700'}`}>
                <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${stock <= 10 ? 'bg-orange-500' : 'bg-emerald-500'}`} />
                Stock: {stock} ud.
              </span>
            )}
          </div>
        </div>
      </div>
      </Link>

      {/* Add to cart — always visible on mobile (no hover), hover-reveal on md+ */}
      {stock > 0 && (
        <button
          type="button"
          onClick={handleAddToCart}
          className="w-full bg-brand text-white text-xs font-bold py-2.5 flex items-center justify-center gap-2 hover:bg-brand-dark md:absolute md:bottom-0 md:inset-x-0 md:translate-y-full md:group-hover:translate-y-0 md:transition-transform md:duration-300"
        >
          <ShoppingCart className="h-3.5 w-3.5" />
          Agregar al carrito
        </button>
      )}
    </div>
  );
}
