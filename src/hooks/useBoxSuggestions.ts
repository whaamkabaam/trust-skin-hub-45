import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PROVIDER_CONFIGS } from '@/types/filters';
import { findBestMatches, normalizeString } from '@/utils/slugUtils';

interface BoxSuggestion {
  box_name: string;
  provider: string;
  provider_name: string;
  slug: string;
  score: number;
}

export const useBoxSuggestions = () => {
  const [suggestions, setSuggestions] = useState<BoxSuggestion[]>([]);
  const [loading, setLoading] = useState(false);

  const findSuggestions = useCallback(async (searchSlug: string): Promise<BoxSuggestion[]> => {
    if (!searchSlug || searchSlug.length < 2) return [];

    setLoading(true);
    console.log(`Finding suggestions for: ${searchSlug}`);

    try {
      // Get box names from all providers
      const searchPromises = Object.entries(PROVIDER_CONFIGS).map(async ([providerId, config]) => {
        try {
          const { data, error } = await supabase
            .from(config.tableName)
            .select('box_name')
            .limit(200); // Get more boxes for better suggestions

          if (error || !data) {
            console.error(`Error fetching suggestions from ${config.displayName}:`, error);
            return [];
          }

          const boxNames = data.map(box => box.box_name).filter(Boolean);
          const matches = findBestMatches(searchSlug, boxNames);

          return matches
            .filter(match => match.score > 0.2 && match.score < 0.9) // Exclude exact matches and very poor matches
            .slice(0, 3) // Top 3 suggestions per provider
            .map(match => ({
              box_name: match.originalName,
              provider: providerId,
              provider_name: config.displayName,
              slug: match.slug,
              score: match.score
            }));
        } catch (error) {
          console.error(`Suggestion error in ${config.displayName}:`, error);
          return [];
        }
      });

      const allSuggestions = (await Promise.all(searchPromises))
        .flat()
        .sort((a, b) => b.score - a.score)
        .slice(0, 6); // Top 6 overall suggestions

      setSuggestions(allSuggestions);
      return allSuggestions;
    } catch (error) {
      console.error('Error finding suggestions:', error);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    suggestions,
    loading,
    findSuggestions
  };
};