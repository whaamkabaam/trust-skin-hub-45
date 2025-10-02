
import { useReducer, useCallback } from 'react';
import { FilterState } from '@/types/filters';

type FilterAction = 
  | { type: 'SET_FILTERS'; payload: FilterState }
  | { type: 'UPDATE_CATEGORIES'; payload: string[] }
  | { type: 'UPDATE_PRICE_RANGE'; payload: { min: number; max: number } }
  | { type: 'UPDATE_EV_RANGE'; payload: { min: number; max: number } }
  | { type: 'UPDATE_VOLATILITY_BUCKETS'; payload: ('Low' | 'Medium' | 'High')[] }
  | { type: 'UPDATE_VOLATILITY_RANGE'; payload: { min: number; max: number } }
  | { type: 'UPDATE_FLOOR_RANGE'; payload: { min: number; max: number } }
  | { type: 'UPDATE_TAGS'; payload: string[] }
  | { type: 'UPDATE_ADVANCED'; payload: Partial<FilterState['advanced']> }
  | { type: 'RESET_FILTERS'; payload: FilterState }
  | { type: 'REMOVE_FILTER'; payload: { type: string; value?: string; initialFilters?: FilterState } };

const filterReducer = (state: FilterState, action: FilterAction): FilterState => {
  switch (action.type) {
    case 'SET_FILTERS':
      return action.payload;
    case 'UPDATE_CATEGORIES':
      return { ...state, categories: action.payload };
    case 'UPDATE_PRICE_RANGE':
      return { ...state, priceRange: action.payload };
    case 'UPDATE_EV_RANGE':
      // Ensure EV range never goes below 0
      const evRange = {
        min: Math.max(0, action.payload.min),
        max: Math.max(0, action.payload.max)
      };
      return { ...state, expectedValueRange: evRange };
    case 'UPDATE_VOLATILITY_BUCKETS':
      return { ...state, volatilityBuckets: action.payload };
    case 'UPDATE_VOLATILITY_RANGE':
      return { ...state, volatilityRange: action.payload };
    case 'UPDATE_FLOOR_RANGE':
      return { ...state, floorRateRange: action.payload };
    case 'UPDATE_TAGS':
      return { ...state, tags: action.payload };
    case 'UPDATE_ADVANCED':
      return { ...state, advanced: { ...state.advanced, ...action.payload } };
    case 'RESET_FILTERS':
      return action.payload;
    case 'REMOVE_FILTER':
      const { type, value, initialFilters } = action.payload;
      const newState = { ...state };
      
      switch (type) {
        case 'categories':
          if (value) newState.categories = state.categories.filter(cat => cat !== value);
          break;
        case 'tags':
          if (value) newState.tags = state.tags.filter(tag => tag !== value);
          break;
        case 'volatilityBuckets':
          if (value) newState.volatilityBuckets = state.volatilityBuckets.filter(
            bucket => bucket !== value as 'Low' | 'Medium' | 'High'
          );
          break;
        case 'priceRange':
          newState.priceRange = initialFilters ? initialFilters.priceRange : { ...state.priceRange };
          break;
        case 'expectedValueRange':
          // Ensure reset EV range never goes below 0
          const resetEvRange = initialFilters ? initialFilters.expectedValueRange : { min: 0, max: 200 };
          newState.expectedValueRange = {
            min: Math.max(0, resetEvRange.min),
            max: Math.max(0, resetEvRange.max)
          };
          break;
        case 'volatilityRange':
          newState.volatilityRange = initialFilters ? { min: 0, max: initialFilters.volatilityRange.max } : { min: 0, max: 100 };
          break;
        case 'floorRateRange':
          newState.floorRateRange = initialFilters ? initialFilters.floorRateRange : { ...state.floorRateRange };
          break;
        case 'jackpotValueRange':
          newState.advanced = {
            ...state.advanced,
            jackpotValueRange: initialFilters ? initialFilters.advanced.jackpotValueRange : { ...state.advanced.jackpotValueRange }
          };
          break;
        case 'itemCountRange':
          newState.advanced = {
            ...state.advanced,
            itemCountRange: initialFilters ? initialFilters.advanced.itemCountRange : { ...state.advanced.itemCountRange }
          };
          break;
      }
      
      return newState;
    default:
      return state;
  }
};

export const useFilterReducer = (initialFilters: FilterState) => {
  const [filters, dispatch] = useReducer(filterReducer, initialFilters);

  const updateFilters = useCallback((updates: Partial<FilterState>) => {
    const mergedFilters: FilterState = {
      ...filters,
      ...updates,
      advanced: {
        ...filters.advanced,
        ...(updates.advanced || {})
      }
    };
    
    // Ensure EV range never goes below 0 when updating filters
    if (updates.expectedValueRange) {
      mergedFilters.expectedValueRange = {
        min: Math.max(0, updates.expectedValueRange.min),
        max: Math.max(0, updates.expectedValueRange.max)
      };
    }
    
    dispatch({ type: 'SET_FILTERS', payload: mergedFilters });
  }, [filters]);

  const resetFilters = useCallback(() => {
    dispatch({ type: 'RESET_FILTERS', payload: initialFilters });
  }, [initialFilters]);

  const removeFilter = useCallback((filterType: string, value?: string) => {
    dispatch({ type: 'REMOVE_FILTER', payload: { type: filterType, value, initialFilters } });
  }, [initialFilters]);

  return {
    filters,
    dispatch,
    updateFilters,
    resetFilters,
    removeFilter
  };
};
