import { Truck, ShieldCheck, RotateCcw, BadgeCheck } from 'lucide-react';

const BADGES = [
  {
    icon: Truck,
    title: 'Envío rápido',
    description: 'Llega en 24 a 48 horas',
    color: 'text-brand',
    bg: 'bg-brand-light',
  },
  {
    icon: ShieldCheck,
    title: 'Pago seguro',
    description: 'SSL + tarjeta, Yape y más',
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
  },
  {
    icon: RotateCcw,
    title: 'Devoluciones',
    description: '30 días sin preguntas',
    color: 'text-orange-600',
    bg: 'bg-orange-50',
  },
  {
    icon: BadgeCheck,
    title: 'Garantía de producto',
    description: '100% originales importados',
    color: 'text-purple-600',
    bg: 'bg-purple-50',
  },
];

export function TrustBadges() {
  return (
    <section className="bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {BADGES.map(({ icon: Icon, title, description, color, bg }) => (
            <div
              key={title}
              className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 hover:border-slate-200 hover:shadow-sm transition-all"
            >
              <div className={`flex-shrink-0 p-3 rounded-xl ${bg}`}>
                <Icon className={`h-5 w-5 ${color}`} />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">{title}</p>
                <p className="text-xs text-slate-500 mt-0.5">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
