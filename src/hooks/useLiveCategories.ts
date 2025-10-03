import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Category } from '@/types';
import { toast } from 'sonner';

interface LiveCategory extends Category {
  source: 'manual' | 'provider' | 'both';
  box_count: number;
}

export function useLiveCategories() {
  const [categories, setCategories] = useState<LiveCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      // Fetch existing categories from database
      const { data: dbCategories, error: dbError } = await supabase
        .from('categories')
        .select('*')
        .order('display_order', { ascending: true });

      if (dbError) throw dbError;

      // Fetch all unique categories from provider tables
      const providers = ['rillabox', 'hypedrop', 'casesgg', 'luxdrop'];
      const liveCategories = new Set<string>();
      const categoryCounts: Record<string, number> = {};

      for (const provider of providers) {
        const { data: providerData, error: providerError } = await supabase
          .from(provider as any)
          .select('category');

        if (!providerError && providerData) {
          providerData.forEach((row: any) => {
            if (row.category) {
              const slug = row.category.toLowerCase().replace(/[^a-z0-9]+/g, '-');
              liveCategories.add(row.category);
              categoryCounts[slug] = (categoryCounts[slug] || 0) + 1;
            }
          });
        }
      }

      // Also count manual category overrides
      const categoryIdToSlug = new Map(
        dbCategories?.map(cat => [cat.id, cat.slug]) || []
      );

      const { data: overrides } = await supabase
        .from('provider_box_category_overrides')
        .select('category_id');

      overrides?.forEach(override => {
        const slug = categoryIdToSlug.get(override.category_id);
        if (slug) {
          categoryCounts[slug] = (categoryCounts[slug] || 0) + 1;
        }
      });

      // Combine and classify categories
      const dbCategoryMap = new Map(dbCategories?.map(c => [c.slug, c]) || []);
      const liveCategorySet = new Set(Array.from(liveCategories).map(cat => 
        cat.toLowerCase().replace(/[^a-z0-9]+/g, '-')
      ));

      const combined: LiveCategory[] = [];

      // Add existing DB categories with classification
      dbCategories?.forEach(cat => {
        const isLive = liveCategorySet.has(cat.slug);
        combined.push({
          ...cat,
          source: isLive ? 'both' : 'manual',
          box_count: categoryCounts[cat.slug] || 0,
        });
      });

      // Add live categories that don't exist in DB yet
      Array.from(liveCategories).forEach(categoryName => {
        const slug = categoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        if (!dbCategoryMap.has(slug)) {
          combined.push({
            id: `temp-${slug}`,
            name: categoryName,
            slug,
            display_order: 999,
            is_featured: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            source: 'provider',
            box_count: categoryCounts[slug] || 0,
          });
        }
      });

      // Sort: Featured first, then by display order, then by box count
      combined.sort((a, b) => {
        if (a.is_featured !== b.is_featured) return a.is_featured ? -1 : 1;
        if (a.display_order !== b.display_order) return a.display_order - b.display_order;
        return b.box_count - a.box_count;
      });

      setCategories(combined);
    } catch (error: any) {
      console.error('Error fetching live categories:', error);
      toast.error('Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  const syncCategories = async () => {
    setSyncing(true);
    try {
      // Fetch all unique categories from provider tables
      const providers = ['rillabox', 'hypedrop', 'casesgg', 'luxdrop'];
      const liveCategories = new Set<string>();

      for (const provider of providers) {
        const { data: providerData } = await supabase
          .from(provider as any)
          .select('category');

        if (providerData) {
          providerData.forEach((row: any) => {
            if (row.category) liveCategories.add(row.category);
          });
        }
      }

      // Get existing categories
      const { data: existingCategories } = await supabase
        .from('categories')
        .select('slug, name');

      const existingSlugs = new Set(existingCategories?.map(c => c.slug) || []);

      // Create missing categories
      const toCreate = Array.from(liveCategories)
        .map(categoryName => ({
          name: categoryName,
          slug: categoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        }))
        .filter(cat => !existingSlugs.has(cat.slug));

      if (toCreate.length > 0) {
        const { error: insertError } = await supabase
          .from('categories')
          .insert(toCreate.map((cat, index) => ({
            ...cat,
            display_order: 999 + index,
            is_featured: false,
          })));

        if (insertError) throw insertError;

        toast.success(`Synced ${toCreate.length} new categories from providers`);
      } else {
        toast.success('All categories are already synced');
      }

      // Refresh the list
      await fetchCategories();
    } catch (error: any) {
      console.error('Error syncing categories:', error);
      toast.error('Failed to sync categories');
    } finally {
      setSyncing(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return {
    categories,
    loading,
    syncing,
    syncCategories,
    refetch: fetchCategories,
  };
}
