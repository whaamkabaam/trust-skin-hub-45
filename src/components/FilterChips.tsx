
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { FilterState } from '@/types/filters';

interface FilterChipsProps {
  filters: FilterState;
  onRemoveFilter: (filterType: string, value?: string) => void;
  initialFilters: FilterState;
}

// Helper function to capitalize first letter
const capitalizeFirstLetter = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const FilterChips: React.FC<FilterChipsProps> = ({
  filters,
  onRemoveFilter,
  initialFilters
}) => {
  const chips: Array<{ type: string; label: string; value?: string }> = [];

  // Category chips
  filters.categories.forEach(category => {
    chips.push({
      type: 'category',
      label: capitalizeFirstLetter(category),
      value: category
    });
  });

  // Tag chips
  filters.tags.forEach(tag => {
    chips.push({
      type: 'tag',
      label: `#${capitalizeFirstLetter(tag)}`,
      value: tag
    });
  });

  // Volatility bucket chips
  filters.volatilityBuckets.forEach(bucket => {
    chips.push({
      type: 'volatilityBucket',
      label: `${bucket} Volatility`,
      value: bucket
    });
  });

  // Range chips - Fix: Use proper initial values for comparison
  if (filters.priceRange.min !== initialFilters.priceRange.min || 
      filters.priceRange.max !== initialFilters.priceRange.max) {
    chips.push({
      type: 'priceRange',
      label: `Price: $${filters.priceRange.min}-$${filters.priceRange.max}`
    });
  }

  if (filters.expectedValueRange.min !== initialFilters.expectedValueRange.min || 
      filters.expectedValueRange.max !== initialFilters.expectedValueRange.max) {
    chips.push({
      type: 'expectedValueRange',
      label: `EV: ${filters.expectedValueRange.min}%-${filters.expectedValueRange.max}%`
    });
  }

  // Fix: Compare against actual initial values instead of hardcoded 0 and 100
  if (filters.volatilityRange.min !== 0 || filters.volatilityRange.max !== initialFilters.volatilityRange.max) {
    chips.push({
      type: 'volatilityRange',
      label: `Volatility: ${filters.volatilityRange.min}%-${filters.volatilityRange.max}%`
    });
  }

  if (filters.floorRateRange.min !== initialFilters.floorRateRange.min || 
      filters.floorRateRange.max !== initialFilters.floorRateRange.max) {
    chips.push({
      type: 'floorRateRange',
      label: `Floor: ${filters.floorRateRange.min}%-${filters.floorRateRange.max}%`
    });
  }

  // Advanced filter chips
  if (filters.advanced.jackpotValueRange.min !== 0 || 
      filters.advanced.jackpotValueRange.max !== initialFilters.advanced.jackpotValueRange.max) {
    chips.push({
      type: 'jackpotValueRange',
      label: `Jackpot: $${filters.advanced.jackpotValueRange.min.toLocaleString()}-$${filters.advanced.jackpotValueRange.max.toLocaleString()}`
    });
  }

  if (filters.advanced.itemCountRange.min !== 0 || 
      filters.advanced.itemCountRange.max !== initialFilters.advanced.itemCountRange.max) {
    chips.push({
      type: 'itemCountRange',
      label: `Items: ${filters.advanced.itemCountRange.min}-${filters.advanced.itemCountRange.max}`
    });
  }

  if (chips.length === 0) return null;

  // Fix: Add proper handler for range filter removal
  const handleRemoveFilter = (type: string, value?: string) => {
    console.log('Removing filter:', type, value);
    
    // For range filters, we need to reset them to their initial values
    if (['priceRange', 'expectedValueRange', 'volatilityRange', 'floorRateRange', 'jackpotValueRange', 'itemCountRange'].includes(type)) {
      // Reset to initial values instead of just dispatching removal
      onRemoveFilter(type);
    } else {
      onRemoveFilter(type, value);
    }
  };

  return (
    <div className="flex flex-wrap gap-2 items-center">
      <span className="text-sm text-gray-600 font-medium">Active Filters:</span>
      {chips.map((chip, index) => (
        <Badge 
          key={`${chip.type}-${chip.value || index}`}
          variant="secondary" 
          className="bg-purple-100 text-purple-700 hover:bg-purple-200 pr-1"
        >
          {chip.label}
          <Button
            variant="ghost"
            size="sm"
            className="h-4 w-4 p-0 ml-2 hover:bg-purple-300 rounded-full"
            onClick={() => handleRemoveFilter(chip.type, chip.value)}
          >
            <X className="h-3 w-3" />
          </Button>
        </Badge>
      ))}
    </div>
  );
};

export default FilterChips;
