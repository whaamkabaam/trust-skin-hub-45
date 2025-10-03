import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import type { Category } from '@/types';

interface ProviderBoxCategoryOverride {
  id: string;
  provider: string;
  box_id: number;
  category_id: string;
  created_at: string;
  updated_at: string;
  categories?: Category;
}

export function useProviderBoxCategories() {
  const [loading, setLoading] = useState(false);

  const fetchBoxCategories = useCallback(async (provider: string, boxId: number) => {
    try {
      const { data, error } = await supabase
        .from('provider_box_category_overrides')
        .select(`
          *,
          categories (*)
        `)
        .eq('provider', provider)
        .eq('box_id', boxId);

      if (error) throw error;
      return data as ProviderBoxCategoryOverride[];
    } catch (error: any) {
      console.error('Error fetching box categories:', error);
      return [];
    }
  }, []);

  const addCategory = useCallback(async (provider: string, boxId: number, categoryId: string) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('provider_box_category_overrides')
        .insert({
          provider,
          box_id: boxId,
          category_id: categoryId,
        });

      if (error) throw error;

      toast({
        title: "Category added",
        description: "Category has been assigned to the mystery box.",
      });
      return true;
    } catch (error: any) {
      // Check for unique constraint violation (duplicate)
      if (error.code === '23505') {
        toast({
          title: "Category already assigned",
          description: "This category is already assigned to this box.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error adding category",
          description: error.message,
          variant: "destructive",
        });
      }
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const removeCategory = useCallback(async (overrideId: string) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('provider_box_category_overrides')
        .delete()
        .eq('id', overrideId);

      if (error) throw error;

      toast({
        title: "Category removed",
        description: "Category assignment has been removed.",
      });
      return true;
    } catch (error: any) {
      toast({
        title: "Error removing category",
        description: error.message,
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateBoxCategories = useCallback(async (
    provider: string,
    boxId: number,
    categoryIds: string[]
  ) => {
    setLoading(true);
    try {
      // First, get existing overrides
      const existing = await fetchBoxCategories(provider, boxId);
      const existingIds = existing.map(o => o.category_id);

      // Determine what to add and what to remove
      const toAdd = categoryIds.filter(id => !existingIds.includes(id));
      const toRemove = existing.filter(o => !categoryIds.includes(o.category_id));

      // Remove old assignments
      if (toRemove.length > 0) {
        const { error: deleteError } = await supabase
          .from('provider_box_category_overrides')
          .delete()
          .in('id', toRemove.map(o => o.id));

        if (deleteError) throw deleteError;
      }

      // Add new assignments
      if (toAdd.length > 0) {
        const { error: insertError } = await supabase
          .from('provider_box_category_overrides')
          .insert(
            toAdd.map(categoryId => ({
              provider,
              box_id: boxId,
              category_id: categoryId,
            }))
          );

        if (insertError) throw insertError;
      }

      toast({
        title: "Categories updated",
        description: `Successfully updated category assignments.`,
      });
      return true;
    } catch (error: any) {
      toast({
        title: "Error updating categories",
        description: error.message,
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [fetchBoxCategories]);

  return {
    loading,
    fetchBoxCategories,
    addCategory,
    removeCategory,
    updateBoxCategories,
  };
}
