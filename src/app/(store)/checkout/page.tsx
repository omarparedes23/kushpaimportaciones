'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useCart } from '@/lib/cart-context';
import { createPaymentIntent, type ShippingAddress } from '@/app/actions/checkout';
import { ArrowLeft, Lock, CreditCard } from 'lucide-react';
import Link from 'next/link';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '');

function CheckoutForm({ shipping }: { shipping: ShippingAddress }) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCart();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setProcessing(true);
    setError(null);

    try {
      const { error: submitError } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/pedido/confirmado`,
        },
        redirect: 'if_required',
      });

      if (submitError) {
        setError(submitError.message || 'Error al procesar el pago');
        setProcessing(false);
        return;
      }

      // Payment succeeded — webhook will create the order
      clearCart();
      router.push('/pedido/confirmado');
    } catch {
      setError('Error al procesar el pago. Intenta de nuevo.');
      setProcessing(false);
    }
  };

  const shippingCost = totalPrice >= 150 ? 0 : 15;
  const grandTotal = totalPrice + shippingCost;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Payment element */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6">
        <div className="flex items-center gap-2 mb-4">
          <CreditCard className="h-5 w-5 text-brand" />
          <h2 className="text-lg font-black text-slate-800">Método de pago</h2>
        </div>
        <PaymentElement />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl p-4">
          {error}
        </div>
      )}

      {/* Summary */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6">
        <h2 className="text-lg font-black text-slate-800 mb-4">Resumen</h2>
        <div className="space-y-2 text-sm">
          {items.map((item) => (
            <div key={item.id} className="flex justify-between text-slate-600">
              <span className="truncate mr-2">{item.title} × {item.quantity}</span>
              <span className="font-bold text-slate-800 flex-shrink-0">S/ {(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <hr className="border-slate-100 my-2" />
          <div className="flex justify-between text-slate-600">
            <span>Envío</span>
            <span className={`font-bold ${shippingCost === 0 ? 'text-emerald-600' : 'text-slate-800'}`}>
              {shippingCost === 0 ? 'Gratis' : `S/ ${shippingCost.toFixed(2)}`}
            </span>
          </div>
          <div className="flex justify-between text-base pt-2">
            <span className="font-black text-slate-800">Total</span>
            <span className="font-black text-brand text-xl">S/ {grandTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={!stripe || processing}
        className="w-full bg-brand text-white font-bold py-4 rounded-2xl hover:bg-brand-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        <Lock className="h-4 w-4" />
        {processing ? 'Procesando pago...' : `Pagar S/ ${grandTotal.toFixed(2)}`}
      </button>

      <p className="text-xs text-slate-400 text-center">
        Pago seguro con Stripe. Tus datos están protegidos con SSL.
      </p>
    </form>
  );
}

export default function CheckoutPage() {
  const { items, totalPrice } = useCart();
  const [shipping, setShipping] = useState<ShippingAddress>({
    full_name: '',
    phone: '',
    address_line1: '',
    address_line2: '',
    city: 'Lima',
    region: 'Lima',
    postal_code: '',
  });
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'shipping' | 'payment'>('shipping');

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <h1 className="text-2xl font-black text-slate-800 mb-2">No hay productos en tu carrito</h1>
        <Link href="/" className="bg-brand text-white font-bold px-8 py-3 rounded-full hover:bg-brand-dark transition-colors mt-4">
          Explorar productos
        </Link>
      </div>
    );
  }

  const handleShippingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await createPaymentIntent(items, shipping);
      setClientSecret(result.clientSecret);
      setStep('payment');
    } catch {
      alert('Error al iniciar el pago. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const shippingCost = totalPrice >= 150 ? 0 : 15;

  return (
    <div className="bg-[#F8FAFC] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-black text-slate-800">Checkout</h1>
          <Link href="/carrito" className="flex items-center gap-2 text-sm text-slate-500 hover:text-brand transition-colors font-medium">
            <ArrowLeft className="h-4 w-4" />
            Volver al carrito
          </Link>
        </div>

        {/* Progress steps */}
        <div className="flex items-center gap-4 mb-8">
          <div className={`flex items-center gap-2 text-sm font-bold ${step === 'shipping' ? 'text-brand' : 'text-emerald-600'}`}>
            <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs ${step === 'shipping' ? 'bg-brand text-white' : 'bg-emerald-500 text-white'}`}>
              {step === 'payment' ? '✓' : '1'}
            </span>
            Envío
          </div>
          <div className={`h-0.5 w-12 ${step === 'payment' ? 'bg-emerald-500' : 'bg-slate-200'}`} />
          <div className={`flex items-center gap-2 text-sm font-bold ${step === 'payment' ? 'text-brand' : 'text-slate-400'}`}>
            <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs ${step === 'payment' ? 'bg-brand text-white' : 'bg-slate-200 text-slate-500'}`}>
              2
            </span>
            Pago
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3">
            {step === 'shipping' ? (
              <form onSubmit={handleShippingSubmit} className="space-y-4">
                <div className="bg-white rounded-2xl border border-slate-100 p-6 space-y-4">
                  <h2 className="text-lg font-black text-slate-800 mb-2">Dirección de envío</h2>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Nombre completo *</label>
                    <input
                      required
                      type="text"
                      value={shipping.full_name}
                      onChange={(e) => setShipping({ ...shipping, full_name: e.target.value })}
                      className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand transition-colors"
                      placeholder="Juan Pérez"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Teléfono *</label>
                    <input
                      required
                      type="tel"
                      value={shipping.phone}
                      onChange={(e) => setShipping({ ...shipping, phone: e.target.value })}
                      className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand transition-colors"
                      placeholder="+51 987 654 321"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Dirección *</label>
                    <input
                      required
                      type="text"
                      value={shipping.address_line1}
                      onChange={(e) => setShipping({ ...shipping, address_line1: e.target.value })}
                      className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand transition-colors"
                      placeholder="Av. Principal 123"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-1">Referencia</label>
                    <input
                      type="text"
                      value={shipping.address_line2}
                      onChange={(e) => setShipping({ ...shipping, address_line2: e.target.value })}
                      className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand transition-colors"
                      placeholder="Edificio color blanco, piso 3"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">Ciudad *</label>
                      <input
                        required
                        type="text"
                        value={shipping.city}
                        onChange={(e) => setShipping({ ...shipping, city: e.target.value })}
                        className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-1">Departamento *</label>
                      <input
                        required
                        type="text"
                        value={shipping.region}
                        onChange={(e) => setShipping({ ...shipping, region: e.target.value })}
                        className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand transition-colors"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-brand text-white font-bold py-4 rounded-2xl hover:bg-brand-dark transition-colors disabled:opacity-50"
                >
                  {loading ? 'Preparando pago...' : 'Continuar al pago'}
                </button>
              </form>
            ) : (
              clientSecret && (
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                  <CheckoutForm shipping={shipping} />
                </Elements>
              )
            )}
          </div>

          {/* Order summary sidebar */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-slate-100 p-6 sticky top-24">
              <h2 className="text-lg font-black text-slate-800 mb-4">Tu pedido</h2>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3 items-center">
                    <div className="w-12 h-12 bg-slate-50 rounded-lg flex-shrink-0 relative overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={item.image_url} alt={item.title} className="w-full h-full object-contain mix-blend-multiply p-1" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-700 truncate">{item.title}</p>
                      <p className="text-xs text-slate-400">× {item.quantity}</p>
                    </div>
                    <span className="text-sm font-bold text-slate-800 flex-shrink-0">S/ {(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <hr className="border-slate-100 my-4" />
              <div className="space-y-2 text-sm">
                <div className="flex justify-between text-slate-600">
                  <span>Subtotal</span>
                  <span className="font-bold">S/ {totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Envío</span>
                  <span className={`font-bold ${shippingCost === 0 ? 'text-emerald-600' : ''}`}>
                    {shippingCost === 0 ? 'Gratis' : `S/ ${shippingCost.toFixed(2)}`}
                  </span>
                </div>
                <hr className="border-slate-100" />
                <div className="flex justify-between">
                  <span className="font-black text-slate-800">Total</span>
                  <span className="font-black text-brand text-lg">S/ {(totalPrice + shippingCost).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
