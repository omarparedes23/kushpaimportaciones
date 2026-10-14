'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { getUserOrders, type Order } from '@/app/actions/checkout';
import Link from 'next/link';
import { Package, LogOut, User, ShoppingBag } from 'lucide-react';

interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
}

export default function MyAccountPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function load() {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) {
        router.push('/login');
        return;
      }

      setUser({
        id: authUser.id,
        email: authUser.email || '',
        full_name: authUser.user_metadata?.full_name || null,
      });

      try {
        const userOrders = await getUserOrders();
        setOrders(userOrders as Order[]);
      } catch {
        // Orders may not exist yet
      }

      setLoading(false);
    }

    load();
  }, [router, supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand" />
      </div>
    );
  }

  return (
    <div className="bg-[#F8FAFC] min-h-screen">
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-8">
        <h1 className="text-3xl font-black text-slate-800 mb-8">Mi cuenta</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile card */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-brand-light rounded-xl">
                <User className="h-5 w-5 text-brand" />
              </div>
              <h2 className="font-bold text-slate-800">Perfil</h2>
            </div>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-slate-400">Nombre</span>
                <p className="font-medium text-slate-700">{user?.full_name || 'Sin nombre'}</p>
              </div>
              <div>
                <span className="text-slate-400">Correo</span>
                <p className="font-medium text-slate-700">{user?.email}</p>
              </div>
            </div>
          </div>

          {/* Quick actions */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-emerald-50 rounded-xl">
                <ShoppingBag className="h-5 w-5 text-emerald-600" />
              </div>
              <h2 className="font-bold text-slate-800">Acciones</h2>
            </div>
            <div className="space-y-2">
              <Link href="/" className="block text-sm text-slate-600 hover:text-brand transition-colors py-1">
                → Seguir comprando
              </Link>
              <Link href="/carrito" className="block text-sm text-slate-600 hover:text-brand transition-colors py-1">
                → Ver carrito
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-sm text-danger hover:text-red-700 transition-colors py-1"
              >
                <LogOut className="h-3.5 w-3.5" />
                Cerrar sesión
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-blue-50 rounded-xl">
                <Package className="h-5 w-5 text-blue-600" />
              </div>
              <h2 className="font-bold text-slate-800">Mis pedidos</h2>
            </div>
            <p className="text-3xl font-black text-slate-800">{orders.length}</p>
            <p className="text-xs text-slate-400 mt-1">pedidos realizados</p>
          </div>
        </div>

        {/* Orders list */}
        {orders.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-black text-slate-800 mb-4">Historial de pedidos</h2>
            <div className="space-y-3">
              {orders.map((order: Order) => (
                <div key={order.id} className="bg-white rounded-2xl border border-slate-100 p-5">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <span className="text-xs font-bold text-slate-400">
                        Pedido #{order.id.slice(0, 8).toUpperCase()}
                      </span>
                      <p className="text-xs text-slate-400">
                        {new Date(order.created_at).toLocaleDateString('es-PE', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-bold ${
                        order.status === 'paid' ? 'bg-emerald-100 text-emerald-700' :
                        order.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                        order.status === 'delivered' ? 'bg-purple-100 text-purple-700' :
                        order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                        'bg-yellow-100 text-yellow-700'
                      }`}>
                        {order.status === 'paid' ? 'Pagado' :
                         order.status === 'shipped' ? 'Enviado' :
                         order.status === 'delivered' ? 'Entregado' :
                         order.status === 'cancelled' ? 'Cancelado' : 'Pendiente'}
                      </span>
                      <p className="text-lg font-black text-slate-800 mt-1">
                        S/ {order.total.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
