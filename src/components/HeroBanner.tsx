import Image from 'next/image';
import Link from 'next/link';

export function HeroBanner() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-brand to-brand-dark text-white">
      {/* Scoped styles as a robust backup to guarantee columns and card sizes render perfectly */}
      <style dangerouslySetInnerHTML={{ __html: `
        .hero-flex-container {
          display: flex;
          flex-direction: column;
          gap: 2.5rem;
        }
        .hero-left-col {
          width: 100%;
        }
        .hero-right-col {
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
        }
        .premium-hero-card {
          width: 100% !important;
          max-width: 380px !important;
          aspect-ratio: 4 / 5 !important;
          display: flex !important;
          flex-direction: column !important;
          justify-content: space-between !important;
        }
        @media (min-width: 640px) {
          .premium-hero-card {
            max-width: 400px !important;
            aspect-ratio: 1 / 1 !important;
          }
        }
        @media (min-width: 1024px) {
          .hero-flex-container {
            flex-direction: row !important;
            justify-content: space-between !important;
            align-items: center !important;
            gap: 3rem !important;
          }
          .hero-left-col {
            width: 56% !important;
          }
          .hero-right-col {
            width: 40% !important;
          }
        }
      `}} />

      {/* Decorative blobs */}
      <div className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-white/5" />
      <div className="pointer-events-none absolute bottom-0 right-1/3 h-72 w-72 rounded-full bg-white/5 translate-y-1/2" />
      <div className="pointer-events-none absolute top-1/2 right-12 h-48 w-48 rounded-full bg-yellow-300/10" />

      <div className="relative max-w-7xl mx-auto px-4 md:px-6 py-16 md:py-24 lg:py-28">
        <div className="hero-flex-container">
          {/* Left Column: Headline and actions */}
          <div className="hero-left-col flex flex-col justify-center">
            {/* Badge */}
            <span className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm text-white text-sm font-semibold px-4 py-1.5 rounded-full mb-6 border border-white/20 w-fit">
              🎉 Hasta 50% de descuento esta semana
            </span>

            {/* Headline */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black leading-[1.1] mb-5">
              Importaciones
              <br />
              <span className="text-yellow-300">al mejor precio</span>
            </h1>

            <p className="text-base md:text-lg text-white/75 mb-8 max-w-lg leading-relaxed">
              Tecnología, moda, hogar y más — productos originales importados
              directamente, con el precio más competitivo del mercado peruano.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-3">
              <Link
                href="#productos"
                className="bg-white text-brand font-bold px-7 py-3 rounded-full hover:bg-slate-100 transition-colors shadow-lg shadow-black/20"
              >
                Ver ofertas →
              </Link>
              <Link
                href="#categorias"
                className="border-2 border-white/30 text-white font-semibold px-7 py-3 rounded-full hover:bg-white/10 transition-colors"
              >
                Ver categorías
              </Link>
            </div>

            {/* Stats */}
            <div className="mt-12 flex flex-wrap gap-6 md:gap-10">
              <div>
                <p className="text-3xl font-black">+1,000</p>
                <p className="text-white/60 text-sm mt-0.5">Productos</p>
              </div>
              <div className="w-px bg-white/15 self-stretch" />
              <div>
                <p className="text-3xl font-black">+550</p>
                <p className="text-white/60 text-sm mt-0.5">Clientes felices</p>
              </div>
              <div className="w-px bg-white/15 self-stretch" />
              <div>
                <p className="text-3xl font-black">24h</p>
                <p className="text-white/60 text-sm mt-0.5">Envío express</p>
              </div>
            </div>
          </div>

          {/* Right Column: Premium Interactive Mockup */}
          <div className="hero-right-col mt-12 lg:mt-0">
            {/* Glowing backlights */}
            <div className="absolute inset-0 bg-yellow-300/10 blur-3xl rounded-full scale-75 pointer-events-none" />
            <div className="absolute -inset-4 bg-white/5 blur-2xl rounded-full pointer-events-none" />

            {/* Hero Main Card */}
            <div className="premium-hero-card relative z-10 bg-gradient-to-br from-white/15 to-white/5 border border-white/15 rounded-3xl p-6 backdrop-blur-md shadow-2xl overflow-hidden group hover:border-white/25 transition-all duration-500 hover:scale-[1.02]">
              {/* Glossy overlay effect */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 opacity-50 pointer-events-none" />

              {/* Header inside the card */}
              <div className="flex justify-between items-start relative z-10">
                <span className="bg-yellow-300 text-brand-dark text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                  Lo nuevo
                </span>
                <span className="bg-white/15 text-white text-xs font-semibold px-3 py-1 rounded-full backdrop-blur-sm border border-white/15">
                  Gadgets
                </span>
              </div>

              {/* High-quality headset image floating and rotating */}
              <div className="my-auto relative flex justify-center items-center py-4 h-48 w-full">
                <Image
                  src="https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&auto=format&fit=crop&q=80"
                  alt="Kushpa Premium Headset"
                  width={220}
                  height={220}
                  className="object-contain max-h-44 drop-shadow-[0_15px_25px_rgba(0,0,0,0.4)] transform -rotate-12 group-hover:rotate-0 transition-transform duration-700 ease-out hover:scale-105"
                  priority
                />
              </div>

              {/* Product Info Overlay inside the mockup card */}
              <div className="bg-slate-900/60 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex items-center justify-between relative z-10">
                <div>
                  <h4 className="text-white font-bold text-sm">Sony WH-1000XM4</h4>
                  <p className="text-xs text-white/60">Cancelación de ruido premium</p>
                </div>
                <div className="text-right font-semibold">
                  <p className="text-xs line-through text-white/40">S/ 1,499</p>
                  <p className="text-yellow-300 font-extrabold text-base">S/ 999</p>
                </div>
              </div>
            </div>

            {/* Extra floaty element: Free shipping */}
            <div className="absolute -bottom-6 -left-6 z-20 bg-white text-slate-800 rounded-2xl p-3.5 shadow-xl border border-slate-100 hidden md:flex items-center gap-3 hover:scale-105 transition-transform duration-300 cursor-default">
              <div className="bg-emerald-100 text-emerald-600 p-2 rounded-xl">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-slate-400 font-semibold leading-none">Envío a todo el Perú</p>
                <p className="text-sm font-black text-slate-800 mt-1">100% Garantizado</p>
              </div>
            </div>

            {/* Extra floaty element: Rating */}
            <div className="absolute -top-6 -right-6 z-20 bg-brand/90 backdrop-blur-sm text-white rounded-2xl p-3 shadow-xl border border-white/10 hidden md:flex items-center gap-3 hover:scale-105 transition-transform duration-300 cursor-default">
              <div className="bg-yellow-300 text-brand-dark font-black text-xs px-2 py-1 rounded-lg">
                ★ 4.9
              </div>
              <p className="text-xs font-bold leading-none pr-1">Mejor Calificación</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
