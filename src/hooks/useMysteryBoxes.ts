import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { MysteryBox } from '@/types';
import { useToast } from '@/hooks/use-toast';

export interface MysteryBoxFilters {
  category?: string;
  operator?: string;
  game?: string;
  priceRange?: [number, number];
  riskLevel?: string;
  search?: string;
  limit?: number;
  offset?: number;
}

export function useMysteryBoxes(filters?: MysteryBoxFilters) {
  const [mysteryBoxes, setMysteryBoxes] = useState<MysteryBox[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const { toast } = useToast();

  const fetchMysteryBoxes = useCallback(async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('mystery_boxes')
        .select(`
          *,
          operator:operators(id, name, slug, logo_url),
          categories:mystery_box_categories(
            category:categories(id, name, slug, logo_url)
          )
        `, { count: 'exact' })
        .eq('is_active', true);

      // Apply filters
      if (filters?.search) {
        query = query.ilike('name', `%${filters.search}%`);
      }

      if (filters?.game) {
        query = query.eq('game', filters.game);
      }

      if (filters?.operator) {
        query = query.eq('operator_id', filters.operator);
      }

      if (filters?.category) {
        const { data: categoryBoxes } = await supabase
          .from('mystery_box_categories')
          .select('mystery_box_id')
          .eq('category_id', filters.category);
        
        if (categoryBoxes) {
          const boxIds = categoryBoxes.map(cb => cb.mystery_box_id);
          query = query.in('id', boxIds);
        }
      }

      if (filters?.priceRange) {
        query = query.gte('price', filters.priceRange[0])
                    .lte('price', filters.priceRange[1]);
      }

      // Pagination
      if (filters?.limit) {
        query = query.limit(filters.limit);
      }
      if (filters?.offset) {
        query = query.range(filters.offset, (filters.offset + (filters.limit || 20)) - 1);
      }

      query = query.order('created_at', { ascending: false });

      const { data, error, count } = await query;

      if (error) throw error;

      setMysteryBoxes(data as any || []);
      setTotalCount(count || 0);
    } catch (error: any) {
      toast({
        title: "Error fetching mystery boxes",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(filters), toast]);

  const getMysteryBoxesByCategory = useCallback(async (categorySlug: string) => {
    try {
      // First get category ID
      const { data: category } = await supabase
        .from('categories')
        .select('id')
        .eq('slug', categorySlug)
        .single();

      if (!category) return [];

      // Then get mystery box IDs for this category
      const { data: categoryBoxes } = await supabase
        .from('mystery_box_categories')
        .select('mystery_box_id')
        .eq('category_id', category.id);

      if (!categoryBoxes?.length) return [];

      const boxIds = categoryBoxes.map(cb => cb.mystery_box_id);

      // Finally get the actual mystery boxes
      const { data, error } = await supabase
        .from('mystery_boxes')
        .select(`
          *,
          operator:operators(id, name, slug, logo_url),
          categories:mystery_box_categories(
            category:categories(id, name, slug, logo_url)
          )
        `)
        .eq('is_active', true)
        .in('id', boxIds)
        .order('popularity_score', { ascending: false });

      if (error) throw error;
      return data as any || [];
    } catch (error: any) {
      toast({
        title: "Error fetching category mystery boxes",
        description: error.message,
        variant: "destructive",
      });
      return [];
    }
  }, [toast]);

  useEffect(() => {
    fetchMysteryBoxes();
  }, [fetchMysteryBoxes]);

  return {
    mysteryBoxes,
    loading,
    totalCount,
    fetchMysteryBoxes,
    getMysteryBoxesByCategory,
  };
}