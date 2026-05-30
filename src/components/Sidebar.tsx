import { getCategories } from "@/lib/db/categories";
import { createClient } from "@/utils/supabase/server";

async function getBrands(): Promise<string[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('kushpa_products')
    .select('brand')
    .eq('is_active', true);

  if (error) return [];

  const unique = [...new Set((data ?? []).map((r: { brand: string }) => r.brand))].sort();
  return unique;
}

export async function Sidebar() {
  const [categories, brands] = await Promise.all([getCategories(), getBrands()]);

  return (
    <aside className="w-64 flex-shrink-0 hidden lg:block pr-8">
      <div className="space-y-8 sticky top-24">
        <div>
          <h3 className="text-lg font-bold mb-4 text-gray-900">Categorías</h3>
          <ul className="space-y-2">
            {categories.map((cat) => (
              <li key={cat.id}>
                <a
                  href={`/?categoria=${cat.slug}`}
                  className="text-sm text-gray-600 hover:text-[#80a60c] hover:font-medium transition-colors"
                >
                  {cat.name}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-bold mb-4 text-gray-900">Marcas</h3>
          <ul className="space-y-3">
            {brands.map((brand) => (
              <li key={brand} className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id={`brand-${brand.replace(/\s+/g, '-').toLowerCase()}`}
                  className="rounded border-gray-300 text-[#A5D610] focus:ring-[#A5D610] h-4 w-4 accent-[#A5D610]"
                />
                <label
                  htmlFor={`brand-${brand.replace(/\s+/g, '-').toLowerCase()}`}
                  className="text-sm text-gray-600 cursor-pointer hover:text-gray-900"
                >
                  {brand}
                </label>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-bold mb-4 text-gray-900">Precio</h3>
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="Mín."
              className="w-full border rounded-md px-2 py-1.5 text-sm outline-none focus:border-[#A5D610]"
            />
            <span className="text-gray-400">-</span>
            <input
              type="number"
              placeholder="Máx."
              className="w-full border rounded-md px-2 py-1.5 text-sm outline-none focus:border-[#A5D610]"
            />
            <button className="bg-gray-200 hover:bg-gray-300 rounded-md p-1.5 transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
