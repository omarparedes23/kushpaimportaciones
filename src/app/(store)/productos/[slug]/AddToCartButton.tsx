'use client';

import { useState } from 'react';
import { ShoppingCart, Plus, Minus } from 'lucide-react';
import { useCart } from '@/lib/cart-context';

interface AddToCartButtonProps {
  product: {
    id: string;
    title: string;
    brand: string;
    image_url: string;
    price: number;
    stock: number;
  };
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();

  const handleAdd = () => {
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        title: product.title,
        brand: product.brand,
        image_url: product.image_url,
        price: product.price,
      });
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Quantity selector */}
      <div className="flex items-center gap-4">
        <span className="text-sm font-bold text-slate-700">Cantidad:</span>
        <div className="flex items-center border-2 border-slate-200 rounded-xl overflow-hidden">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="p-3 hover:bg-slate-50 transition-colors text-slate-600"
            disabled={quantity <= 1}
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="w-12 text-center font-bold text-slate-800">{quantity}</span>
          <button
            onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
            className="p-3 hover:bg-slate-50 transition-colors text-slate-600"
            disabled={quantity >= product.stock}
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
        {product.stock > 0 && product.stock <= 10 && (
          <span className="text-xs text-orange-600 font-medium">
            ¡Solo quedan {product.stock}!
          </span>
        )}
      </div>

      {/* Add to cart button */}
      <button
        onClick={handleAdd}
        disabled={product.stock === 0}
        className={`flex items-center justify-center gap-3 w-full py-4 rounded-2xl font-bold text-base transition-all duration-300 ${
          added
            ? 'bg-emerald-500 text-white scale-[1.02]'
            : product.stock === 0
            ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
            : 'bg-brand text-white hover:bg-brand-dark hover:shadow-lg hover:shadow-brand/20 active:scale-[0.98]'
        }`}
      >
        <ShoppingCart className="h-5 w-5" />
        {added ? (
          '¡Agregado al carrito!'
        ) : product.stock === 0 ? (
          'Agotado'
        ) : (
          `Agregar al carrito — S/ ${(product.price * quantity).toFixed(2)}`
        )}
      </button>

      {/* Buy now */}
      {product.stock > 0 && (
        <button className="w-full py-3 rounded-2xl font-bold text-sm border-2 border-slate-200 text-slate-700 hover:border-brand hover:text-brand transition-all">
          Comprar ahora
        </button>
      )}
    </div>
  );
}
