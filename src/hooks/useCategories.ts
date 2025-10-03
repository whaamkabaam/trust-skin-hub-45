import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Category } from '@/types';
import { useToast } from '@/hooks/use-toast';

export interface CategoryFormData {
  name: string;
  slug: string;
  logo_url?: string;
  description_rich?: string;
  display_order?: number;
  is_featured?: boolean;
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('display_order', { ascending: true });

      if (error) throw error;
      setCategories(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching categories",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const createCategory = useCallback(async (categoryData: CategoryFormData) => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .insert([categoryData])
        .select()
        .single();

      if (error) throw error;

      setCategories(prev => [...prev, data]);
      toast({
        title: "Category created",
        description: `${categoryData.name} has been created successfully.`,
      });
      
      return data;
    } catch (error: any) {
      toast({
        title: "Error creating category",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  }, [toast]);

  const updateCategory = useCallback(async (id: string, categoryData: Partial<CategoryFormData>) => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .update(categoryData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setCategories(prev => prev.map(cat => cat.id === id ? data : cat));
      toast({
        title: "Category updated",
        description: "Category has been updated successfully.",
      });
      
      return data;
    } catch (error: any) {
      toast({
        title: "Error updating category",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  }, [toast]);

  const deleteCategory = useCallback(async (id: string) => {
    try {
      // Get the category details first
      const { data: category } = await supabase
        .from('categories')
        .select('slug, name')
        .eq('id', id)
        .single();

      if (!category) throw new Error('Category not found');

      // Check if category is in use across all provider tables
      const providers = ['rillabox', 'hypedrop', 'casesgg', 'luxdrop'];
      let totalCount = 0;

      for (const provider of providers) {
        const { count, error } = await supabase
          .from(provider as any)
          .select('*', { count: 'exact', head: true })
          .eq('category', category.name);

        if (error) {
          console.warn(`Error checking ${provider}:`, error);
          continue;
        }

        totalCount += count || 0;
      }

      if (totalCount > 0) {
        toast({
          title: "Cannot delete category",
          description: `This category is used by ${totalCount} mystery box(es) across provider data. It cannot be deleted.`,
          variant: "destructive",
        });
        return false;
      }

      // Proceed with deletion if not in use
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setCategories(prev => prev.filter(cat => cat.id !== id));
      toast({
        title: "Category deleted",
        description: "Category has been deleted successfully.",
      });
      
      return true;
    } catch (error: any) {
      toast({
        title: "Error deleting category",
        description: error.message,
        variant: "destructive",
      });
      return false;
    }
  }, [toast]);

  const getCategoryBySlug = useCallback(async (slug: string) => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) throw error;
      return data;
    } catch (error: any) {
      toast({
        title: "Error fetching category",
        description: error.message,
        variant: "destructive",
      });
      return null;
    }
  }, [toast]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    categories,
    loading,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
    getCategoryBySlug,
  };
}