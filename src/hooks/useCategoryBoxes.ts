import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface CategoryBoxAssignment {
  id: string;
  provider: string;
  box_id: number;
  box_name: string;
  box_image?: string;
  box_price: number;
  expected_value_percent?: number;
}

export function useCategoryBoxes() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const fetchCategoryBoxes = async (categoryId: string): Promise<CategoryBoxAssignment[]> => {
    setLoading(true);
    try {
      // Fetch all overrides for this category
      const { data: overrides, error } = await supabase
        .from('provider_box_category_overrides')
        .select('id, provider, box_id')
        .eq('category_id', categoryId);

      if (error) throw error;

      if (!overrides || overrides.length === 0) {
        return [];
      }

      // Fetch box details from each provider
      const providers = ['rillabox', 'hypedrop', 'casesgg', 'luxdrop'];
      const assignments: CategoryBoxAssignment[] = [];

      for (const provider of providers) {
        const providerOverrides = overrides.filter(o => o.provider === provider);
        if (providerOverrides.length === 0) continue;

        const boxIds = providerOverrides.map(o => o.box_id);
        
        let boxes: any[] = [];
        
        if (provider === 'rillabox') {
          const { data, error } = await supabase.from('rillabox').select('id, box_name, box_image, box_price, expected_value_percent').in('id', boxIds);
          if (!error && data) boxes = data;
        } else if (provider === 'hypedrop') {
          const { data, error } = await supabase.from('hypedrop').select('id, box_name, box_image, box_price, expected_value_percent').in('id', boxIds);
          if (!error && data) boxes = data;
        } else if (provider === 'casesgg') {
          const { data, error } = await supabase.from('casesgg').select('id, box_name, box_image, box_price, expected_value_percent').in('id', boxIds);
          if (!error && data) boxes = data;
        } else if (provider === 'luxdrop') {
          const { data, error } = await supabase.from('luxdrop').select('id, box_name, box_image, box_price, expected_value_percent').in('id', boxIds);
          if (!error && data) boxes = data;
        }

        boxes.forEach(box => {
          const override = providerOverrides.find(o => o.box_id === box.id);
          if (override) {
            assignments.push({
              id: override.id,
              provider,
              box_id: box.id,
              box_name: box.box_name,
              box_image: box.box_image,
              box_price: box.box_price,
              expected_value_percent: box.expected_value_percent,
            });
          }
        });
      }

      return assignments;
    } catch (error: any) {
      toast({
        title: "Error fetching category boxes",
        description: error.message,
        variant: "destructive",
      });
      return [];
    } finally {
      setLoading(false);
    }
  };

  const removeBoxFromCategory = async (overrideId: string): Promise<boolean> => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('provider_box_category_overrides')
        .delete()
        .eq('id', overrideId);

      if (error) throw error;

      toast({
        title: "Box removed",
        description: "Box has been removed from this category.",
      });
      
      return true;
    } catch (error: any) {
      toast({
        title: "Error removing box",
        description: error.message,
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    fetchCategoryBoxes,
    removeBoxFromCategory,
  };
}
