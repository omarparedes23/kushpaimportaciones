'use client';

import { Search, ShoppingCart, UserCircle, Menu, X } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
            <div className="relative flex w-full">
              <input
                type="search"
                placeholder="Buscar productos, marcas y más..."
                className="w-full border-2 border-slate-200 rounded-l-full py-2.5 px-5 text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:border-brand transition-colors"
              />
              <button className="bg-brand hover:bg-brand-dark text-white px-5 rounded-r-full transition-colors flex items-center gap-1.5 font-medium text-sm">
                <Search className="h-4 w-4" />
                <span className="hidden lg:inline">Buscar</span>
              </button>
            </div>
          </div>

          {/* Right actions */}
          <div className="ml-auto md:ml-0 flex items-center gap-1 md:gap-3">
            <button className="hidden md:flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg text-slate-500 hover:text-brand hover:bg-brand-light transition-colors">
              <UserCircle className="h-5 w-5" />
              <span className="text-[10px] font-medium">Mi cuenta</span>
            </button>

            <button className="relative flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg text-slate-500 hover:text-brand hover:bg-brand-light transition-colors">
              <div className="relative">
                <ShoppingCart className="h-5 w-5" />
                <span className="absolute -top-2 -right-2 h-4 w-4 rounded-full bg-danger text-[9px] font-black text-white flex items-center justify-center">
                  0
                </span>
              </div>
              <span className="text-[10px] font-medium hidden md:block">Carrito</span>
            </button>
          </div>
        </div>

        {/* Mobile search */}
        <div className="md:hidden px-4 pb-3">
          <div className="relative flex">
            <input
              type="search"
              placeholder="Buscar en Kushpa..."
              className="w-full border-2 border-slate-200 rounded-l-full py-2 px-4 text-sm outline-none focus:border-brand transition-colors"
            />
            <button className="bg-brand text-white px-4 rounded-r-full flex items-center">
              <Search className="h-4 w-4" />
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}
