'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { CheckCircle, Package, Home, ShoppingBag } from 'lucide-react';

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Success animation */}
        <div className="relative mx-auto w-24 h-24 mb-8">
          <div className="absolute inset-0 bg-emerald-100 rounded-full animate-ping opacity-30" />
          <div className="relative bg-emerald-500 rounded-full w-24 h-24 flex items-center justify-center">
            <CheckCircle className="h-12 w-12 text-white" />
          </div>
        </div>

        <h1 className="text-3xl font-black text-slate-800 mb-3">
          ¡Pedido confirmado!
        </h1>
        <p className="text-slate-500 mb-2">
          Tu pago ha sido procesado exitosamente.
        </p>
        {orderId && (
          <p className="text-sm text-slate-400 mb-8">
            Pedido #{orderId.slice(0, 8).toUpperCase()}
          </p>
        )}

        <div className="bg-white rounded-2xl border border-slate-100 p-6 mb-8 text-left">
          <h2 className="font-bold text-slate-800 mb-4">¿Qué sigue?</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-50 rounded-lg flex-shrink-0">
                <Package className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-700">Preparación del envío</p>
                <p className="text-xs text-slate-500">Recibirás un email con el código de seguimiento.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 bg-emerald-50 rounded-lg flex-shrink-0">
                <ShoppingBag className="h-4 w-4 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-700">Tiempo de entrega</p>
                <p className="text-xs text-slate-500">24 a 48 horas hábiles en Lima. 3 a 5 días a nivel nacional.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/"
            className="flex-1 flex items-center justify-center gap-2 bg-brand text-white font-bold py-3 rounded-2xl hover:bg-brand-dark transition-colors"
          >
            <Home className="h-4 w-4" />
            Volver al inicio
          </Link>
          <Link
            href="/"
            className="flex-1 flex items-center justify-center gap-2 border-2 border-slate-200 text-slate-700 font-bold py-3 rounded-2xl hover:border-brand hover:text-brand transition-colors"
          >
            <ShoppingBag className="h-4 w-4" />
            Seguir comprando
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function OrderConfirmedPage() {
  return (
    <Suspense fallback={
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand" />
      </div>
    }>
      <ConfirmationContent />
    </Suspense>
  );
}
