
import { useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FilterState } from '@/types/filters';

export const useUrlFilters = (filters: FilterState, onFiltersChange: (filters: FilterState) => void) => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Get provider from URL on mount
  const urlProvider = searchParams.get('provider');

  // Sync URL provider to filters when URL changes
  useEffect(() => {
    if (urlProvider && !filters.providers.includes(urlProvider)) {
      onFiltersChange({
        ...filters,
        providers: [urlProvider]
      });
    }
  }, [urlProvider, filters, onFiltersChange]);

  // Update URL when provider filter changes (but preserve other params)
  const updateUrlProvider = (providers: string[]) => {
    const newSearchParams = new URLSearchParams(searchParams);
    
    if (providers.length === 1) {
      newSearchParams.set('provider', providers[0]);
    } else {
      newSearchParams.delete('provider');
    }
    
    setSearchParams(newSearchParams, { replace: true });
  };

  return {
    urlProvider,
    updateUrlProvider
  };
};
