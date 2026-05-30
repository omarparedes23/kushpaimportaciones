import Link from 'next/link';
import {
  Laptop,
  Sofa,
  Dumbbell,
  Gamepad2,
  Sparkles,
} from 'lucide-react';

const CATEGORIES = [
  {
    slug: 'tecnologia',
    name: 'Tecnología',
    icon: Laptop,
    bg: 'bg-blue-50',
    iconColor: 'text-blue-600',
    hoverBorder: 'hover:border-blue-300',
    hoverBg: 'hover:bg-blue-50',
  },
  {
    slug: 'hogar-y-muebles',
    name: 'Hogar y Muebles',
    icon: Sofa,
    bg: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
    hoverBorder: 'hover:border-emerald-300',
    hoverBg: 'hover:bg-emerald-50',
  },
  {
    slug: 'deportes-y-fitness',
    name: 'Deportes y Fitness',
    icon: Dumbbell,
    bg: 'bg-orange-50',
    iconColor: 'text-orange-600',
    hoverBorder: 'hover:border-orange-300',
    hoverBg: 'hover:bg-orange-50',
  },
  {
    slug: 'juegos-y-juguetes',
    name: 'Juegos y Juguetes',
    icon: Gamepad2,
    bg: 'bg-purple-50',
    iconColor: 'text-purple-600',
    hoverBorder: 'hover:border-purple-300',
    hoverBg: 'hover:bg-purple-50',
  },
  {
    slug: 'belleza-y-cuidado',
    name: 'Belleza y Cuidado',
    icon: Sparkles,
    bg: 'bg-pink-50',
    iconColor: 'text-pink-600',
    hoverBorder: 'hover:border-pink-300',
    hoverBg: 'hover:bg-pink-50',
  },
];

export function CategoryGrid() {
  return (
    <section id="categorias" className="py-12 bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-slate-800">
              Explora por categoría
            </h2>
            <p className="text-slate-500 mt-1 text-sm">
              Encuentra exactamente lo que buscas
            </p>
          </div>
          <Link
            href="/productos"
            className="hidden md:inline-flex text-brand font-semibold text-sm hover:underline items-center gap-1"
          >
            Ver todo →
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 md:gap-4">
          {CATEGORIES.map(({ slug, name, icon: Icon, bg, iconColor, hoverBorder, hoverBg }) => (
            <Link
              key={slug}
              href={`/?categoria=${slug}`}
              className={`group flex flex-col items-center gap-3 p-5 bg-white rounded-2xl border-2 border-transparent ${hoverBorder} ${hoverBg} transition-all duration-200 hover:shadow-md cursor-pointer`}
            >
              <div className={`p-4 rounded-2xl ${bg} group-hover:scale-110 transition-transform duration-200`}>
                <Icon className={`h-7 w-7 ${iconColor}`} />
              </div>
              <span className="text-sm font-semibold text-slate-700 text-center leading-tight">
                {name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
