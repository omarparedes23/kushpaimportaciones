'use client';

import { Search, ShoppingCart, UserCircle, Menu, X, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { useCart } from '@/lib/cart-context';

const CATEGORIES = [
  { name: 'Tecnología', href: '/categorias/tecnologia' },
  { name: 'Hogar y Muebles', href: '/categorias/hogar-y-muebles' },
  { name: 'Deportes y Fitness', href: '/categorias/deportes-y-fitness' },
  { name: 'Juegos y Juguetes', href: '/categorias/juegos-y-juguetes' },
  { name: 'Belleza y Cuidado', href: '/categorias/belleza-y-cuidado' },
];

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { totalItems } = useCart();
  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* Announcement bar */}
      <div className="bg-brand text-white text-center py-2 text-xs md:text-sm font-medium tracking-wide">
        🚚 Envío gratis en compras mayores a{' '}
        <span className="font-black">S/ 150</span>
        {' '}· Más de 1,000 productos importados
      </div>

      {/* Main navigation */}
      <nav className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto flex h-16 items-center gap-4 px-4 md:px-6">

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Abrir menú"
            aria-expanded={mobileMenuOpen}
            className="md:hidden text-slate-600 hover:text-brand transition-colors"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          {/* Logo */}
          <Link href="/" className="flex-shrink-0 flex flex-col leading-none">
            <span className="text-2xl font-black text-brand tracking-tight">Kushpa</span>
            <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-widest -mt-0.5">
              Importaciones
            </span>
          </Link>

          {/* Search bar */}
          <div className="flex-1 max-w-2xl mx-2 md:mx-6 hidden md:flex">
            <form action="/buscar" method="get" className="relative flex w-full">
              <input
                type="search"
                name="q"
                placeholder="Buscar productos, marcas y más..."
                className="w-full border-2 border-slate-200 rounded-l-full py-2.5 px-5 text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:border-brand transition-colors"
              />
              <button type="submit" className="bg-brand hover:bg-brand-dark text-white px-5 rounded-r-full transition-colors flex items-center gap-1.5 font-medium text-sm">
                <Search className="h-4 w-4" />
                <span className="hidden lg:inline">Buscar</span>
              </button>
            </form>
          </div>

          {/* Right actions */}
          <div className="ml-auto md:ml-0 flex items-center gap-1 md:gap-3">
            <Link
              href="/mi-cuenta"
              className="hidden md:flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg text-slate-500 hover:text-brand hover:bg-brand-light transition-colors"
            >
              <UserCircle className="h-5 w-5" />
              <span className="text-[10px] font-medium">Mi cuenta</span>
            </Link>

            <Link
              href="/carrito"
              className="relative flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg text-slate-500 hover:text-brand hover:bg-brand-light transition-colors"
            >
              <div className="relative">
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 h-4 w-4 rounded-full bg-danger text-[9px] font-black text-white flex items-center justify-center">
                    {totalItems > 99 ? '99+' : totalItems}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-medium hidden md:block">Carrito</span>
            </Link>
          </div>
        </div>

        {/* Mobile search */}
        <div className="md:hidden px-4 pb-3">
          <form action="/buscar" method="get" className="relative flex">
            <input
              type="search"
              name="q"
              placeholder="Buscar en Kushpa..."
              className="w-full border-2 border-slate-200 rounded-l-full py-2 px-4 text-sm outline-none focus:border-brand transition-colors"
            />
            <button type="submit" className="bg-brand text-white px-4 rounded-r-full flex items-center">
              <Search className="h-4 w-4" />
            </button>
          </form>
        </div>

        {/* Mobile menu panel */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white px-4 pb-4">
            <nav className="flex flex-col py-2">
              <Link
                href="/"
                onClick={closeMenu}
                className="py-2.5 text-sm font-semibold text-slate-700 hover:text-brand transition-colors"
              >
                Inicio
              </Link>
              {CATEGORIES.map(({ name, href }) => (
                <Link
                  key={href}
                  href={href}
                  onClick={closeMenu}
                  className="flex items-center justify-between py-2.5 text-sm font-medium text-slate-600 hover:text-brand transition-colors"
                >
                  {name}
                  <ChevronRight className="h-4 w-4 text-slate-300" />
                </Link>
              ))}
              <div className="mt-2 pt-3 border-t border-slate-100 flex flex-col">
                <Link
                  href="/mi-cuenta"
                  onClick={closeMenu}
                  className="py-2.5 text-sm font-semibold text-slate-700 hover:text-brand transition-colors"
                >
                  Mi cuenta
                </Link>
                <Link
                  href="/carrito"
                  onClick={closeMenu}
                  className="py-2.5 text-sm font-semibold text-slate-700 hover:text-brand transition-colors"
                >
                  Mi carrito {totalItems > 0 ? `(${totalItems})` : ''}
                </Link>
              </div>
            </nav>
          </div>
        )}
      </nav>
    </header>
  );
}
