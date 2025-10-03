import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useDebounce } from './useDebounce';

export interface ProviderBox {
  id: string; // format: "provider-boxId"
  provider: string;
  box_id: number;
  box_name: string;
  box_image?: string;
  box_price: number;
}

export function useProviderBoxSearch() {
  const [query, setQuery] = useState('');
  const [provider, setProvider] = useState<string>('all');
  const [results, setResults] = useState<ProviderBox[]>([]);
  const [loading, setLoading] = useState(false);
  
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    searchBoxes();
  }, [debouncedQuery, provider]);

  const searchBoxes = async () => {
    setLoading(true);
    try {
      const providers = provider === 'all' 
        ? ['rillabox', 'hypedrop', 'casesgg', 'luxdrop']
        : [provider];

      const allResults: ProviderBox[] = [];

      for (const providerName of providers) {
        let data: any[] = [];
        
        if (providerName === 'rillabox') {
          const query = supabase.from('rillabox').select('id, box_name, box_image, box_price').order('box_name');
          const result = debouncedQuery 
            ? await query.ilike('box_name', `%${debouncedQuery}%`).limit(25)
            : await query.limit(25);
          if (!result.error && result.data) data = result.data;
        } else if (providerName === 'hypedrop') {
          const query = supabase.from('hypedrop').select('id, box_name, box_image, box_price').order('box_name');
          const result = debouncedQuery 
            ? await query.ilike('box_name', `%${debouncedQuery}%`).limit(25)
            : await query.limit(25);
          if (!result.error && result.data) data = result.data;
        } else if (providerName === 'casesgg') {
          const query = supabase.from('casesgg').select('id, box_name, box_image, box_price').order('box_name');
          const result = debouncedQuery 
            ? await query.ilike('box_name', `%${debouncedQuery}%`).limit(25)
            : await query.limit(25);
          if (!result.error && result.data) data = result.data;
        } else if (providerName === 'luxdrop') {
          const query = supabase.from('luxdrop').select('id, box_name, box_image, box_price').order('box_name');
          const result = debouncedQuery 
            ? await query.ilike('box_name', `%${debouncedQuery}%`).limit(25)
            : await query.limit(25);
          if (!result.error && result.data) data = result.data;
        }

        const mapped = data.map(box => ({
          id: `${providerName}-${box.id}`,
          provider: providerName,
          box_id: box.id,
          box_name: box.box_name,
          box_image: box.box_image,
          box_price: box.box_price,
        }));
        allResults.push(...mapped);
      }

      // Sort by name and limit to 50 total results
      allResults.sort((a, b) => a.box_name.localeCompare(b.box_name));
      setResults(allResults.slice(0, 50));
    } catch (error) {
      console.error('Error searching boxes:', error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return {
    query,
    setQuery,
    provider,
    setProvider,
    results,
    loading,
  };
}
