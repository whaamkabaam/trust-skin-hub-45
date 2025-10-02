
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { FilterState, PROVIDER_CONFIGS } from '@/types/filters';
import ProviderLogo from '@/components/ui/ProviderLogo';

interface MobileFilterChipsProps {
  filters: FilterState;
  onRemoveFilter: (filterType: string, value?: string) => void;
  initialFilters: FilterState;
}

// Helper function to capitalize first letter
const capitalizeFirstLetter = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const MobileFilterChips: React.FC<MobileFilterChipsProps> = ({
  filters,
  onRemoveFilter,
  initialFilters
}) => {
  const chips: Array<{ type: string; label: string; value?: string; providerId?: string }> = [];

  // Provider chips with logos
  filters.providers.forEach(providerId => {
    const config = PROVIDER_CONFIGS[providerId as keyof typeof PROVIDER_CONFIGS];
    if (config) {
      chips.push({
        type: 'provider',
        label: config.displayName,
        value: providerId,
        providerId: providerId
      });
    }
  });

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
      label: `${bucket} Vol.`,
      value: bucket
    });
  });

  // Range chips with mobile-optimized labels
  if (filters.priceRange.min !== initialFilters.priceRange.min || 
      filters.priceRange.max !== initialFilters.priceRange.max) {
    chips.push({
      type: 'priceRange',
      label: `$${filters.priceRange.min}-$${filters.priceRange.max}`
    });
  }

  if (filters.expectedValueRange.min !== initialFilters.expectedValueRange.min || 
      filters.expectedValueRange.max !== initialFilters.expectedValueRange.max) {
    chips.push({
      type: 'expectedValueRange',
      label: `EV: ${filters.expectedValueRange.min}%-${filters.expectedValueRange.max}%`
    });
  }

  if (filters.volatilityRange.min !== 0 || filters.volatilityRange.max !== initialFilters.volatilityRange.max) {
    chips.push({
      type: 'volatilityRange',
      label: `Vol: ${filters.volatilityRange.min}%-${filters.volatilityRange.max}%`
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

  const handleRemoveFilter = (type: string, value?: string) => {
    onRemoveFilter(type, value);
  };

  return (
    <div className="flex flex-wrap gap-2 px-1">
      {chips.map((chip, index) => (
        <Badge 
          key={`${chip.type}-${chip.value || index}`}
          variant="secondary" 
          className="bg-purple-100 text-purple-700 hover:bg-purple-200 pr-1 py-2 text-sm min-h-[36px] flex items-center"
        >
          <div className="flex items-center gap-2">
            {chip.providerId && (
              <ProviderLogo 
                providerId={chip.providerId as keyof typeof PROVIDER_CONFIGS} 
                size="sm"
                enhanced={true}
                className="flex-shrink-0"
              />
            )}
            <span className="truncate max-w-[120px]">{chip.label}</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 ml-2 hover:bg-purple-300 rounded-full min-w-[24px] flex-shrink-0"
            onClick={() => handleRemoveFilter(chip.type, chip.value)}
          >
            <X className="h-4 w-4" />
          </Button>
        </Badge>
      ))}
    </div>
  );
};

export default MobileFilterChips;
