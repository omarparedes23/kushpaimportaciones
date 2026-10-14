'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const supabase = createClient();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-emerald-500 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
            <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-black text-slate-800 mb-3">¡Cuenta creada!</h1>
          <p className="text-slate-500 mb-6">
            Revisa tu correo para confirmar tu cuenta y luego inicia sesión.
          </p>
          <Link
            href="/admin/login"
            className="bg-brand text-white font-bold px-8 py-3 rounded-full hover:bg-brand-dark transition-colors inline-block"
          >
            Ir a iniciar sesión
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-slate-800">Crear cuenta</h1>
          <p className="text-slate-500 mt-2">Regístrate para hacer pedidos y seguimiento</p>
        </div>

        <form onSubmit={handleRegister} className="bg-white rounded-2xl border border-slate-100 p-8 space-y-5">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Nombre completo</label>
            <input
              required
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand transition-colors"
              placeholder="Juan Pérez"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Correo electrónico</label>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand transition-colors"
              placeholder="juan@ejemplo.com"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">Contraseña</label>
            <input
              required
              type="password"
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-brand transition-colors"
              placeholder="Mínimo 6 caracteres"
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
            {loading ? 'Creando cuenta...' : 'Crear cuenta'}
          </button>

          <p className="text-center text-sm text-slate-500">
            ¿Ya tienes cuenta?{' '}
            <Link href="/admin/login" className="text-brand font-bold hover:underline">
              Iniciar sesión
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
