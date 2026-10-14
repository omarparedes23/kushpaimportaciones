'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';

export default function CustomerLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push('/mi-cuenta');
      router.refresh();
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-slate-800">Iniciar sesión</h1>
          <p className="text-slate-500 mt-2">Accede a tu cuenta para ver tus pedidos</p>
        </div>

        <form onSubmit={handleLogin} className="bg-white rounded-2xl border border-slate-100 p-8 space-y-5">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Correo electrónico</label>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand transition-colors"
              placeholder="tu@ejemplo.com"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Contraseña</label>
            <input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand transition-colors"
              placeholder="Tu contraseña"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl p-3">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand text-white font-bold py-3 rounded-xl hover:bg-brand-dark transition-colors disabled:opacity-50"
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar sesión'}
          </button>

          <p className="text-center text-sm text-slate-500">
            ¿No tienes cuenta?{' '}
            <Link href="/registro" className="text-brand font-bold hover:underline">
              Crear cuenta
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
