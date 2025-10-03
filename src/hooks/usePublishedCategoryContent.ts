import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const usePublishedCategoryContent = (slug: string) => {
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const { data, error } = await supabase
          .from('published_category_content')
          .select('*')
          .eq('slug', slug)
          .single();

        if (error) throw error;
        setContent(data);
      } catch (error) {
        console.error('Error fetching published category content:', error);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchContent();
    }
  }, [slug]);

  return { content, loading };
};
