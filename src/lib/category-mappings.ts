/**
 * Maps CSV category values to category slugs in the database
 * Used for importing mystery box data and linking to proper categories
 */
export const CSV_CATEGORY_TO_SLUG: Record<string, string> = {
  // CS:GO/CS2 Weapons
  'CS:GO': 'weapons',
  'CS2': 'weapons',
  'CSGO': 'weapons',
  'Weapons': 'weapons',
  'Counter-Strike': 'weapons',
  
  // Apple Products
  'Apple': 'apple',
  'iPhone': 'apple',
  'iPad': 'apple',
  'MacBook': 'apple',
  'AirPods': 'apple',
  'Apple Products': 'apple',
  
  // Knives
  'Knives': 'knives',
  'Knife': 'knives',
  'Blades': 'knives',
  
  // Gloves
  'Gloves': 'gloves',
  'Hand Wraps': 'gloves',
  
  // Mixed/Various
  'Mixed': 'mixed',
  'Various': 'mixed',
  'Variety': 'mixed',
  'General': 'mixed',
  
  // Tech/Electronics
  'Tech': 'tech',
  'Electronics': 'tech',
  'Technology': 'tech',
  'Gadgets': 'tech',
  
  // Stickers
  'Stickers': 'stickers',
  'Sticker': 'stickers',
  
  // Premium/High Value
  'Premium': 'premium',
  'High-End': 'premium',
  'High Value': 'premium',
  'Luxury': 'premium',
  'Elite': 'premium',
};

/**
 * Maps a category string from CSV to a category slug
 * Returns null if no mapping exists
 */
export function mapCategoryToSlug(category: string | null | undefined): string | null {
  if (!category) return null;
  
  // Try exact match first
  const slug = CSV_CATEGORY_TO_SLUG[category];
  if (slug) return slug;
  
  // Try case-insensitive match
  const lowerCategory = category.toLowerCase();
  for (const [key, value] of Object.entries(CSV_CATEGORY_TO_SLUG)) {
    if (key.toLowerCase() === lowerCategory) {
      return value;
    }
  }
  
  return null;
}

/**
 * Returns all unique category slugs that can be mapped
 */
export function getAvailableCategorySlugs(): string[] {
  return Array.from(new Set(Object.values(CSV_CATEGORY_TO_SLUG)));
}
