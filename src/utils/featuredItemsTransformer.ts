/**
 * Transforms jackpot_items from various provider formats into a consistent structure
 */
export interface FeaturedItem {
  name: string;
  price: number;
}

export function transformFeaturedItems(jackpotItems: any[]): FeaturedItem[] {
  if (!Array.isArray(jackpotItems)) {
    return [];
  }

  return jackpotItems
    .map((item) => {
      // All providers use item_value for price and item_name for name
      const price = typeof item.item_value === 'number' ? item.item_value : 0;
      const name = item.item_name || 'Unknown Item';

      return {
        name,
        price,
      };
    })
    .filter((item) => item.price > 0) // Filter out items with no valid price
    .sort((a, b) => b.price - a.price) // Sort by highest price first
    .slice(0, 5); // Return top 5 items
}
