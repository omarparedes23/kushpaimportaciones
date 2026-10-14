export function uniqueCategoryIds(ids: string[]): string[] {
  return [...new Set(ids.map(id => id.trim()).filter(Boolean))];
}

export function toProductCategoryRows(productId: string, categoryIds: string[]) {
  return uniqueCategoryIds(categoryIds).map(category_id => ({ product_id: productId, category_id }));
}
