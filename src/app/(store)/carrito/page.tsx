'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useCart } from '@/lib/cart-context';

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalItems, totalPrice } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <div className="bg-slate-100 rounded-full p-6 mb-6">
          <ShoppingBag className="h-12 w-12 text-slate-400" />
        </div>
        <h1 className="text-2xl font-black text-slate-800 mb-2">Tu carrito está vacío</h1>
        <p className="text-slate-500 mb-8 text-center max-w-md">
          Explora nuestros productos y agrega los que más te gusten al carrito.
        </p>
        <Link
          href="/"
          className="bg-brand text-white font-bold px-8 py-3 rounded-full hover:bg-brand-dark transition-colors"
        >
          Explorar productos
        </Link>
      </div>
    );
  }

  const shippingCost = totalPrice >= 150 ? 0 : 15;
  const grandTotal = totalPrice + shippingCost;

  return (
    <div className="bg-[#F8FAFC] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-slate-800">Mi carrito</h1>
            <p className="text-slate-500 mt-1 text-sm">
              {totalItems} {totalItems === 1 ? 'producto' : 'productos'} en tu carrito
            </p>
          </div>
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-slate-500 hover:text-brand transition-colors font-medium"
          >
            <ArrowLeft className="h-4 w-4" />
            Seguir comprando
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-100 p-4 md:p-6 flex flex-col sm:flex-row sm:items-center gap-4 md:gap-6"
              >
                {/* Image + Info */}
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <Link href={`/productos/${item.id}`} className="relative w-20 h-20 md:w-24 md:h-24 flex-shrink-0 bg-slate-50 rounded-xl overflow-hidden">
                    <Image
                      src={item.image_url}
                      alt={item.title}
                      fill
                      className="object-contain mix-blend-multiply p-2"
                      sizes="96px"
                    />
                  </Link>

                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      {item.brand}
                    </span>
                    <h3 className="text-sm font-semibold text-slate-800 truncate mt-0.5">
                      {item.title}
                    </h3>
                    <p className="text-lg font-black text-brand mt-1">
                      S/ {item.price.toFixed(2)}
                    </p>
                  </div>
                </div>

                {/* Quantity + subtotal */}
                <div className="flex items-center justify-between sm:justify-end gap-4 flex-shrink-0">
                  <div className="flex items-center border-2 border-slate-200 rounded-xl overflow-hidden flex-shrink-0">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-2 hover:bg-slate-50 transition-colors text-slate-600"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-10 text-center font-bold text-sm text-slate-800">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-2 hover:bg-slate-50 transition-colors text-slate-600"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <span className="text-sm font-bold text-slate-800">
                      S/ {(item.price * item.quantity).toFixed(2)}
                    </span>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="p-1.5 text-slate-400 hover:text-danger hover:bg-danger/10 rounded-lg transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-slate-100 p-6 sticky top-24">
              <h2 className="text-lg font-black text-slate-800 mb-6">Resumen del pedido</h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal ({totalItems} items)</span>
                  <span className="font-bold text-slate-800">S/ {totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Envío</span>
                  <span className={`font-bold ${shippingCost === 0 ? 'text-emerald-600' : 'text-slate-800'}`}>
                    {shippingCost === 0 ? 'Gratis' : `S/ ${shippingCost.toFixed(2)}`}
                  </span>
                </div>
                {shippingCost > 0 && (
                  <p className="text-xs text-emerald-600 bg-emerald-50 rounded-lg p-2 text-center">
                    ¡Agrega S/ {(150 - totalPrice).toFixed(2)} más para envío gratis!
                  </p>
                )}
                <hr className="border-slate-100" />
                <div className="flex justify-between text-base">
                  <span className="font-black text-slate-800">Total</span>
                  <span className="font-black text-slate-900 text-xl">S/ {grandTotal.toFixed(2)}</span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="block w-full mt-6 bg-brand text-white text-center font-bold py-4 rounded-2xl hover:bg-brand-dark transition-colors hover:shadow-lg hover:shadow-brand/20"
              >
                Ir al checkout
              </Link>

              <p className="text-xs text-slate-400 text-center mt-4">
                Pago seguro con SSL. Aceptamos Visa, Mastercard, Yape y Plin.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
