'use client';

import { useState } from 'react';
import { createPresignedUrl } from '@/app/actions/s3';
import { saveProduct, updateProduct } from '@/app/actions/products';
import { Button } from '@/components/ui/button';
import type { KushpaProduct } from '@/lib/db/types';

interface ProductFormProps {
  onSuccess?: () => void;
  product?: KushpaProduct;
}

export function ProductForm({ onSuccess, product }: ProductFormProps) {
  const isEditing = !!product;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [title, setTitle] = useState(product?.title ?? '');
  const [brand, setBrand] = useState(product?.brand ?? '');
  const [regularPrice, setRegularPrice] = useState(product?.regular_price?.toString() ?? '');
  const [discountPrice, setDiscountPrice] = useState(product?.discount_price?.toString() ?? '');
  const [stock, setStock] = useState(product?.stock?.toString() ?? '');
  const [isActive, setIsActive] = useState(product?.is_active ?? true);
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let imageUrl = product?.image_url ?? '';

      if (file) {
        const fileName = `${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
        const { presignedUrl, publicUrl } = await createPresignedUrl(fileName, file.type);
        const uploadRes = await fetch(presignedUrl, {
          method: 'PUT',
          body: file,
          headers: { 'Content-Type': file.type },
        });
        if (!uploadRes.ok) throw new Error('Failed to upload image');
        imageUrl = publicUrl;
      } else if (!isEditing) {
        throw new Error('La imagen es requerida');
      }

      const productData = {
        title,
        brand,
        regular_price: parseFloat(regularPrice),
        discount_price: discountPrice ? parseFloat(discountPrice) : null,
        stock: parseInt(stock, 10),
        is_active: isActive,
        image_url: imageUrl,
      };

      if (isEditing) {
        await updateProduct(product.id, productData);
      } else {
        await saveProduct(productData);
        setTitle('');
        setBrand('');
        setRegularPrice('');
        setDiscountPrice('');
        setStock('');
        setIsActive(true);
        setFile(null);
      }

      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar el producto');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg p-6 bg-white rounded shadow">
      <h3 className="text-xl font-bold mb-4">
        {isEditing ? 'Editar Producto' : 'Agregar Producto'}
      </h3>

      {error && <div className="text-red-500 text-sm">{error}</div>}

      <div>
        <label className="block text-sm font-medium mb-1">Título</label>
        <input
          type="text"
          required
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Marca</label>
        <input
          type="text"
          required
          value={brand}
          onChange={e => setBrand(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <div className="flex gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium mb-1">Precio regular</label>
          <input
            type="number"
            step="0.01"
            required
            value={regularPrice}
            onChange={e => setRegularPrice(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium mb-1">Precio oferta</label>
          <input
            type="number"
            step="0.01"
            value={discountPrice}
            onChange={e => setDiscountPrice(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Stock</label>
        <input
          type="number"
          required
          value={stock}
          onChange={e => setStock(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Imagen del producto</label>
        {isEditing && product.image_url && (
          <img
            src={product.image_url}
            alt={product.title}
            className="h-16 w-16 object-cover rounded mb-2"
          />
        )}
        <input
          type="file"
          accept="image/*"
          onChange={e => setFile(e.target.files?.[0] ?? null)}
          className="w-full border rounded px-3 py-2"
        />
        {isEditing && (
          <p className="text-xs text-gray-400 mt-1">
            Dejar vacío para conservar la imagen actual
          </p>
        )}
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="isActive"
          checked={isActive}
          onChange={e => setIsActive(e.target.checked)}
        />
        <label htmlFor="isActive" className="text-sm font-medium">
          Activo (visible en la tienda)
        </label>
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Guardando...' : isEditing ? 'Guardar cambios' : 'Agregar producto'}
      </Button>
    </form>
  );
}
