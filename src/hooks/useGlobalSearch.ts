import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface SearchResult {
  id: string;
  type: 'operator' | 'review' | 'content';
  title: string;
  excerpt: string;
  rating?: number;
  categories?: string[];
  url?: string;
}

interface SearchFilters {
  type: string;
  category: string;
  rating: string;
}

export function useGlobalSearch() {
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  const search = useCallback(async (query: string, filters: SearchFilters) => {
    if (query.length < 3) {
      setResults([]);
      return;
    }

    try {
      setLoading(true);
      const searchResults: SearchResult[] = [];

      // Search operators if type is 'all' or 'operator'
      if (filters.type === 'all' || filters.type === 'operator') {
        const { data: operators } = await supabase
          .from('operators')
          .select('id, name, slug, verdict, categories, ratings')
          .or(`name.ilike.%${query}%, verdict.ilike.%${query}%`)
          .eq('published', true)
          .limit(10);

        if (operators) {
          operators.forEach(op => {
            searchResults.push({
              id: op.id,
              type: 'operator',
              title: op.name,
              excerpt: op.verdict?.substring(0, 150) + '...' || 'No description available',
              rating: (op.ratings as any)?.overall || 0,
              categories: op.categories || [],
              url: `/operators/${op.slug}`
            });
          });
        }
      }

      // Search reviews if type is 'all' or 'review'
      if (filters.type === 'all' || filters.type === 'review') {
        const { data: reviews } = await supabase
          .from('reviews')
          .select(`
            id, 
            content, 
            rating,
            operators (name)
          `)
          .ilike('content', `%${query}%`)
          .eq('status', 'approved')
          .limit(10);

        if (reviews) {
          reviews.forEach(review => {
            searchResults.push({
              id: review.id,
              type: 'review',
              title: `Review for ${(review.operators as any)?.name || 'Unknown Operator'}`,
              excerpt: review.content?.substring(0, 150) + '...' || 'No content available',
              rating: review.rating
            });
          });
        }
      }

      // Search content sections if type is 'all' or 'content'
      if (filters.type === 'all' || filters.type === 'content') {
        const { data: content } = await supabase
          .from('content_sections')
          .select(`
            id,
            heading,
            rich_text_content,
            operators (name)
          `)
          .or(`heading.ilike.%${query}%, rich_text_content.ilike.%${query}%`)
          .limit(10);

        if (content) {
          content.forEach(section => {
            searchResults.push({
              id: section.id,
              type: 'content',
              title: section.heading,
              excerpt: section.rich_text_content?.substring(0, 150) + '...' || 'No content available'
            });
          });
        }
      }

      // Sort results by relevance (exact title matches first, then content matches)
      const sortedResults = searchResults.sort((a, b) => {
        const aExactMatch = a.title.toLowerCase().includes(query.toLowerCase());
        const bExactMatch = b.title.toLowerCase().includes(query.toLowerCase());
        
        if (aExactMatch && !bExactMatch) return -1;
        if (!aExactMatch && bExactMatch) return 1;
        
        // Then by rating (higher first)
        if (a.rating && b.rating) {
          return b.rating - a.rating;
        }
        
        return 0;
      });

      setResults(sortedResults);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    results,
    loading,
    search
  };
}