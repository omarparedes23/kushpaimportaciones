'use client';

import { useEffect, useState, useCallback } from 'react';
import { ProductForm } from '@/components/admin/ProductForm';
import { getAdminProducts, deleteProduct } from '@/app/actions/products';
import type { KushpaProduct } from '@/lib/db/types';
import { Button } from '@/components/ui/button';

export default function AdminDashboardPage() {
  const [products, setProducts] = useState<KushpaProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeForm, setActiveForm] = useState<null | 'create' | KushpaProduct>(null);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAdminProducts();
      setProducts(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleFormSuccess = () => {
    setActiveForm(null);
    fetchProducts();
  };

  const handleDelete = async (product: KushpaProduct) => {
    if (!window.confirm(`¿Eliminar "${product.title}"? Esta acción no se puede deshacer.`)) return;
    try {
      await deleteProduct(product.id);
      fetchProducts();
    } catch {
      alert('Error al eliminar el producto.');
    }
  };

  const isCreating = activeForm === 'create';
  const editingProduct = activeForm !== null && activeForm !== 'create' ? activeForm : undefined;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-800">Products Dashboard</h1>
        <Button onClick={() => setActiveForm(isCreating ? null : 'create')}>
          {isCreating ? 'Cancelar' : 'Agregar producto'}
        </Button>
      </div>

      {activeForm !== null && (
        <div className="mb-8">
          {editingProduct && (
            <div className="mb-3">
              <Button variant="outline" size="sm" onClick={() => setActiveForm(null)}>
                ← Cancelar edición
              </Button>
            </div>
          )}
          <ProductForm product={editingProduct} onSuccess={handleFormSuccess} />
        </div>
      )}

      <div className="bg-white rounded shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Imagen</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Título</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Marca</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Precio</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                  Cargando productos...
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-sm text-gray-500">
                  No hay productos.
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <img src={product.image_url} alt={product.title} className="h-10 w-10 object-cover rounded" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {product.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {product.brand}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    S/ {product.discount_price ?? product.regular_price}
                    {product.discount_price && (
                      <span className="ml-2 text-xs text-gray-400 line-through">
                        S/ {product.regular_price}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      product.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {product.is_active ? 'Activo' : 'Inactivo'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setActiveForm(product)}
                      >
                        Editar
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(product)}
                      >
                        Eliminar
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
