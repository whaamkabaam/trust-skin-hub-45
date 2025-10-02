
import { useEffect, useCallback, useRef } from 'react';
import { FilterState } from '@/types/filters';

const STORAGE_KEY = 'boxfolio-filters';

export const useFilterPersistence = (
  filters: FilterState,
  onFiltersChange: (filters: FilterState) => void,
  initialFilters: FilterState
) => {
  const isInitialLoad = useRef(true);
  const lastSavedFilters = useRef<string>('');

  // Load filters from localStorage on mount - only once
  useEffect(() => {
    if (!isInitialLoad.current) return;
    
    try {
      const savedFilters = localStorage.getItem(STORAGE_KEY);
      if (savedFilters && savedFilters !== '{}') {
        const parsedFilters = JSON.parse(savedFilters);
        // Validate the saved filters structure
        if (parsedFilters && typeof parsedFilters === 'object') {
          console.log('Loading saved filters:', parsedFilters);
          onFiltersChange({ ...initialFilters, ...parsedFilters });
        }
      }
    } catch (error) {
      console.warn('Failed to load saved filters:', error);
    } finally {
      isInitialLoad.current = false;
    }
  }, []); // Remove dependencies to prevent re-triggering

  // Save filters to localStorage when they change (but not on initial load)
  useEffect(() => {
    if (isInitialLoad.current) return;
    
    const filtersString = JSON.stringify(filters);
    
    // Prevent saving if filters haven't actually changed
    if (filtersString === lastSavedFilters.current) return;
    
    try {
      localStorage.setItem(STORAGE_KEY, filtersString);
      lastSavedFilters.current = filtersString;
      console.log('Saved filters to localStorage');
    } catch (error) {
      console.warn('Failed to save filters:', error);
    }
  }, [filters]);

  const clearPersistedFilters = useCallback(() => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      lastSavedFilters.current = '';
    } catch (error) {
      console.warn('Failed to clear persisted filters:', error);
    }
  }, []);

  return {
    clearPersistedFilters
  };
};
