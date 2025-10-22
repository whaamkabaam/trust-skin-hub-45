import { supabase } from '@/integrations/supabase/client';

interface CategoryStats {
  total_boxes: number;
  avg_price: number;
  price_min: number;
  price_max: number;
}

/**
 * Calculate statistics for a category based on assigned boxes
 */
export async function calculateCategoryStats(categoryId: string): Promise<CategoryStats | null> {
  try {
    // Get all box overrides for this category
    const { data: overrides, error: overridesError } = await supabase
      .from('provider_box_category_overrides')
      .select('provider, box_id')
      .eq('category_id', categoryId);

    if (overridesError) throw overridesError;
    if (!overrides || overrides.length === 0) {
      return { total_boxes: 0, avg_price: 0, price_min: 0, price_max: 0 };
    }

    // Group by provider
    const providerGroups = overrides.reduce((acc, override) => {
      const provider = override.provider.toLowerCase();
      if (!acc[provider]) acc[provider] = [];
      acc[provider].push(override.box_id);
      return acc;
    }, {} as Record<string, number[]>);

    // Fetch prices from each provider table
    const prices: number[] = [];

    for (const [provider, boxIds] of Object.entries(providerGroups)) {
      let boxes: any[] | null = null;

      if (provider === 'rillabox') {
        const { data } = await supabase.from('rillabox').select('box_price').in('id', boxIds);
        boxes = data;
      } else if (provider === 'hypedrop') {
        const { data } = await supabase.from('hypedrop').select('box_price').in('id', boxIds);
        boxes = data;
      } else if (provider === 'casesgg') {
        const { data } = await supabase.from('casesgg').select('box_price').in('id', boxIds);
        boxes = data;
      } else if (provider === 'luxdrop') {
        const { data } = await supabase.from('luxdrop').select('box_price').in('id', boxIds);
        boxes = data;
      }

      if (boxes) {
        boxes.forEach(box => {
          const price = Number(box.box_price);
          if (price > 0) prices.push(price);
        });
      }
    }

    if (prices.length === 0) {
      return { total_boxes: overrides.length, avg_price: 0, price_min: 0, price_max: 0 };
    }

    return {
      total_boxes: overrides.length,
      avg_price: prices.reduce((a, b) => a + b, 0) / prices.length,
      price_min: Math.min(...prices),
      price_max: Math.max(...prices),
    };
  } catch (error) {
    console.error('Error calculating category stats:', error);
    return null;
  }
}

/**
 * Update cached statistics in the categories table
 */
export async function refreshCategoryStats(categoryId: string): Promise<boolean> {
  try {
    const stats = await calculateCategoryStats(categoryId);
    if (!stats) return false;

    const { error } = await supabase
      .from('categories')
      .update(stats)
      .eq('id', categoryId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error refreshing category stats:', error);
    return false;
  }
}

/**
 * Refresh stats by category slug
 */
export async function refreshCategoryStatsBySlug(categorySlug: string): Promise<boolean> {
  try {
    const { data: category, error: catError } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', categorySlug)
      .single();

    if (catError || !category) return false;

    return await refreshCategoryStats(category.id);
  } catch (error) {
    console.error('Error refreshing category stats by slug:', error);
    return false;
  }
}

/**
 * Refresh stats for all categories
 */
export async function refreshAllCategoryStats(): Promise<void> {
  try {
    const { data: categories } = await supabase
      .from('categories')
      .select('id');
    
    if (!categories) return;
    
    for (const cat of categories) {
      await refreshCategoryStats(cat.id);
    }
  } catch (error) {
    console.error('Error refreshing all category stats:', error);
  }
}
