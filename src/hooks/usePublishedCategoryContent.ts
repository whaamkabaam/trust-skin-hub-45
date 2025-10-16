import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const usePublishedCategoryContent = (slug: string) => {
  const { data: content, isLoading: loading } = useQuery({
    queryKey: ['published-category-content', slug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('published_category_content')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!slug,
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
  });

  return { content, loading };
};
