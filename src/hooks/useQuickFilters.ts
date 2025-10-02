
import { useCallback } from 'react';
import { FilterState } from '@/types/filters';

interface QuickFilterConfig {
  id: string;
  label: string;
  description: string;
  isActive: (filters: FilterState, initialFilters: FilterState) => boolean;
  apply: (filters: FilterState, initialFilters: FilterState) => Partial<FilterState>;
  clear: (filters: FilterState, initialFilters: FilterState) => Partial<FilterState>;
}

export const useQuickFilters = (initialFilters: FilterState) => {
  const quickFilters: QuickFilterConfig[] = [
    {
      id: 'positive-ev',
      label: 'True Positive EV',
      description: 'Expected Value ≥ 100% (actual profit)',
      isActive: (filters) => filters.expectedValueRange.min >= 100,
      apply: (filters, initial) => ({
        expectedValueRange: { min: 100, max: initial.expectedValueRange.max }
      }),
      clear: (filters, initial) => ({
        expectedValueRange: { min: initial.expectedValueRange.min, max: initial.expectedValueRange.max }
      })
    },
    {
      id: 'balanced-risk',
      label: 'Balanced Risk',
      description: 'Floor Rate > 40%, Low-Medium Risk',
      isActive: (filters) => {
        const hasFloorFilter = filters.floorRateRange.min > 40;
        const hasVolatilityFilter = filters.volatilityBuckets.length > 0 && 
          (filters.volatilityBuckets.includes('Low') || filters.volatilityBuckets.includes('Medium')) &&
          !filters.volatilityBuckets.includes('High');
        return hasFloorFilter && hasVolatilityFilter;
      },
      apply: (filters, initial) => ({
        floorRateRange: { min: 40, max: initial.floorRateRange.max },
        volatilityBuckets: ['Low', 'Medium'] as ('Low' | 'Medium' | 'High')[]
      }),
      clear: (filters, initial) => ({
        floorRateRange: { min: initial.floorRateRange.min, max: initial.floorRateRange.max },
        volatilityBuckets: []
      })
    },
    {
      id: 'thrill-seeker',
      label: 'Thrill Seeker',
      description: 'Ultra High Volatility >1000%',
      isActive: (filters) => {
        return filters.volatilityRange.min >= 1000;
      },
      apply: (filters, initial) => ({
        volatilityRange: { min: 1000, max: initial.volatilityRange.max }
      }),
      clear: (filters, initial) => ({
        volatilityRange: { min: initial.volatilityRange.min, max: initial.volatilityRange.max }
      })
    },
    {
      id: 'jackpot-hunter',
      label: 'Jackpot Hunter',
      description: 'High jackpot value ($1000+) + High volatility',
      isActive: (filters) => {
        const hasJackpotFilter = filters.advanced.jackpotValueRange.min >= 1000;
        const hasHighVolatility = filters.volatilityBuckets.includes('High') || 
          filters.volatilityBuckets.includes('Medium');
        return hasJackpotFilter && hasHighVolatility;
      },
      apply: (filters, initial) => ({
        advanced: {
          ...filters.advanced,
          jackpotValueRange: { min: 1000, max: initial.advanced.jackpotValueRange.max }
        },
        volatilityBuckets: ['Medium', 'High'] as ('Low' | 'Medium' | 'High')[]
      }),
      clear: (filters, initial) => ({
        advanced: {
          ...filters.advanced,
          jackpotValueRange: { min: initial.advanced.jackpotValueRange.min, max: initial.advanced.jackpotValueRange.max }
        },
        volatilityBuckets: []
      })
    }
  ];

  const handleQuickFilter = useCallback((
    filterId: string, 
    currentFilters: FilterState, 
    onFiltersChange: (filters: Partial<FilterState>) => void
  ) => {
    console.log('Applying quick filter:', filterId, 'Current filters:', currentFilters);
    
    const filterConfig = quickFilters.find(f => f.id === filterId);
    if (!filterConfig) {
      console.warn('Quick filter not found:', filterId);
      return;
    }

    const isCurrentlyActive = filterConfig.isActive(currentFilters, initialFilters);
    console.log('Filter is currently active:', isCurrentlyActive);
    
    if (isCurrentlyActive) {
      // Toggle off - clear the filter
      const clearedFilters = filterConfig.clear(currentFilters, initialFilters);
      console.log('Clearing filter, new filters:', clearedFilters);
      onFiltersChange(clearedFilters);
    } else {
      // Apply the filter
      const appliedFilters = filterConfig.apply(currentFilters, initialFilters);
      console.log('Applying filter, new filters:', appliedFilters);
      onFiltersChange(appliedFilters);
    }
  }, [initialFilters, quickFilters]);

  return {
    quickFilters,
    handleQuickFilter
  };
};
