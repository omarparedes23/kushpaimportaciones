import { test } from 'node:test';
import assert from 'node:assert/strict';
import { uniqueCategoryIds, toProductCategoryRows } from './product-category-rows.ts';

test('uniqueCategoryIds elimina duplicados conservando el orden', () => {
  assert.deepEqual(uniqueCategoryIds(['a', 'b', 'a', 'c', 'b']), ['a', 'b', 'c']);
});

test('uniqueCategoryIds descarta vacíos y espacios', () => {
  assert.deepEqual(uniqueCategoryIds(['', '  ', 'a', ' b ']), ['a', 'b']);
});

test('uniqueCategoryIds con lista vacía devuelve lista vacía', () => {
  assert.deepEqual(uniqueCategoryIds([]), []);
});

test('toProductCategoryRows arma una fila por categoría única', () => {
  assert.deepEqual(toProductCategoryRows('p1', ['c1', 'c2', 'c1']), [
    { product_id: 'p1', category_id: 'c1' },
    { product_id: 'p1', category_id: 'c2' },
  ]);
});

test('toProductCategoryRows sin categorías devuelve lista vacía', () => {
  assert.deepEqual(toProductCategoryRows('p1', []), []);
});
