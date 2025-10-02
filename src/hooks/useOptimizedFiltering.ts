import { useMemo, useCallback } from 'react';
import { RillaBoxMetricsBox } from '@/types';
import { FilterState, SortOption } from '@/types/filters';
import { calculateMultiWordSearchScore, sortBySearchRelevance } from '@/utils/searchScoring';

export const useOptimizedFiltering = (
  boxesData: any[],
  filters: FilterState,
  searchTerm: string,
  sortBy: SortOption
) => {
  // Memoize the filtering function
  const applyFilters = useCallback((boxes: any[], currentFilters: FilterState, search: string) => {
    if (!boxes || boxes.length === 0) return [];

    return boxes.filter(box => {
      if (!box) return false;
      
      // Provider filter - Add this first for performance
      if (currentFilters.providers.length > 0) {
        if (!currentFilters.providers.includes(box.provider)) return false;
      }
      
      // Enhanced search filter with relevance scoring
      if (search && search.trim()) {
        const boxName = String(box.box_name || '');
        const boxTags = Array.isArray(box.tags) ? box.tags : [];
        const boxCategory = String(box.category || '');
        
        const searchMatch = calculateMultiWordSearchScore(
          search,
          boxName,
          boxCategory,
          boxTags
        );
        
        // Only include boxes with meaningful search relevance
        // Score threshold: 10+ for any match, higher scores for better matches
        if (!searchMatch || searchMatch.score < 10) {
          return false;
        }
      }

      // Category filter
      if (currentFilters.categories.length > 0) {
        const boxCategory = String(box.category || '');
        if (!currentFilters.categories.includes(boxCategory)) return false;
      }

      // Price range filter
      const boxPrice = Number(box.box_price);
      if (!isNaN(boxPrice) && boxPrice > 0) {
        if (boxPrice < currentFilters.priceRange.min || boxPrice > currentFilters.priceRange.max) {
          return false;
        }
      }

      // Expected value filter
      const boxEV = Number(box.expected_value_percent_of_price);
      if (!isNaN(boxEV)) {
        if (boxEV < currentFilters.expectedValueRange.min || boxEV > currentFilters.expectedValueRange.max) {
          return false;
        }
      }

      // Volatility bucket filter
      if (currentFilters.volatilityBuckets.length > 0) {
        const boxVolatilityBucket = box.volatility_bucket;
        if (!boxVolatilityBucket || !currentFilters.volatilityBuckets.includes(boxVolatilityBucket)) {
          return false;
        }
      }

      // Volatility percentage filter
      const boxVolatility = Number(box.standard_deviation_percent);
      if (!isNaN(boxVolatility) && boxVolatility >= 0) {
        if (boxVolatility < currentFilters.volatilityRange.min || boxVolatility > currentFilters.volatilityRange.max) {
          return false;
        }
      }

      // Floor rate filter
      const boxFloorRate = Number(box.floor_rate_percent);
      if (!isNaN(boxFloorRate) && boxFloorRate >= 0) {
        if (boxFloorRate < currentFilters.floorRateRange.min || boxFloorRate > currentFilters.floorRateRange.max) {
          return false;
        }
      }

      // Tags filter
      if (currentFilters.tags.length > 0) {
        const boxTags = Array.isArray(box.tags) ? box.tags : [];
        if (!currentFilters.tags.some(tag => boxTags.includes(tag))) {
          return false;
        }
      }

      return true;
    });
  }, []);

  // Enhanced sorting function with mystery box priorities and provider context
  const applySorting = useCallback((boxes: any[], sortOption: SortOption) => {
    return [...boxes].sort((a, b) => {
      const getValue = (box: any, field: string) => {
        const value = Number(box[field]);
        return isNaN(value) ? 0 : value;
      };

      // Add mystery box name prioritization
      const getMysteryBoost = (box: any) => {
        const name = String(box.box_name || '').toLowerCase();
        const tags = Array.isArray(box.tags) ? box.tags : [];
        return name.includes('mystery') || 
               tags.some(tag => String(tag).toLowerCase().includes('mystery')) ? 1 : 0;
      };

      // Provider-based secondary sorting for tie-breaking
      const getProviderPriority = (box: any) => {
        const priorities = { rillabox: 4, hypedrop: 3, casesgg: 2, luxdrop: 1 };
        return priorities[box.provider as keyof typeof priorities] || 0;
      };

      switch (sortOption) {
        case 'ev_desc':
          const evDiff = getValue(b, 'expected_value_percent_of_price') - getValue(a, 'expected_value_percent_of_price');
          if (evDiff !== 0) return evDiff;
          const mysteryDiff = getMysteryBoost(b) - getMysteryBoost(a);
          return mysteryDiff !== 0 ? mysteryDiff : getProviderPriority(b) - getProviderPriority(a);
        case 'ev_asc':
          const evAscDiff = getValue(a, 'expected_value_percent_of_price') - getValue(b, 'expected_value_percent_of_price');
          if (evAscDiff !== 0) return evAscDiff;
          return getMysteryBoost(b) - getMysteryBoost(a);
        case 'price_desc':
          return getValue(b, 'box_price') - getValue(a, 'box_price');
        case 'price_asc':
          return getValue(a, 'box_price') - getValue(b, 'box_price');
        case 'volatility_desc':
          return getValue(b, 'standard_deviation_percent') - getValue(a, 'standard_deviation_percent');
        case 'volatility_asc':
          return getValue(a, 'standard_deviation_percent') - getValue(b, 'standard_deviation_percent');
        case 'floor_desc':
          return getValue(b, 'floor_rate_percent') - getValue(a, 'floor_rate_percent');
        case 'floor_asc':
          return getValue(a, 'floor_rate_percent') - getValue(b, 'floor_rate_percent');
        case 'name_asc':
          return (a.box_name || '').localeCompare(b.box_name || '');
        case 'name_desc':
          return (b.box_name || '').localeCompare(a.box_name || '');
        default:
          return getProviderPriority(b) - getProviderPriority(a);
      }
    });
  }, []);

  // Memoize the filtered and sorted results
  const filteredAndSortedBoxes = useMemo(() => {
    const filtered = applyFilters(boxesData, filters, searchTerm);
    
    // If there's a search term, sort by relevance first, then by selected sort option
    if (searchTerm && searchTerm.trim()) {
      return sortBySearchRelevance(filtered, searchTerm, (a, b) => {
        // Apply the selected sorting as secondary sort
        return applySorting([a, b], sortBy)[0] === a ? -1 : 1;
      });
    }
    
    // No search term, use normal sorting
    return applySorting(filtered, sortBy);
  }, [boxesData, filters, searchTerm, sortBy, applyFilters, applySorting]);

  return filteredAndSortedBoxes;
};
