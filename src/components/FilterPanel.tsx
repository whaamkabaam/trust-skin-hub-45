
import React, { useMemo } from 'react';
import { ScrollableContainer } from '@/components/ui/ScrollableContainer';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Filter, RotateCcw, X } from 'lucide-react';
import { FilterState } from '@/types/filters';
import { RillaBoxMetricsBox } from '@/types';
import { useIsMobile } from '@/hooks/use-mobile';
import CategoryFilter from './filters/CategoryFilter';
import RangeFilter from './filters/RangeFilter';
import MobileRangeFilter from './filters/MobileRangeFilter';
import VolatilityFilter from './filters/VolatilityFilter';
import TagsFilter from './filters/TagsFilter';
import AdvancedFilters from './filters/AdvancedFilters';
import ProviderFilter from './filters/ProviderFilter';
import { useToast } from '@/hooks/use-toast';

interface FilterPanelProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  boxesData: RillaBoxMetricsBox[];
  activeFiltersCount: number;
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  isOpen,
  onOpenChange,
  filters,
  onFiltersChange,
  boxesData,
  activeFiltersCount
}) => {
  const { toast } = useToast();
  const isMobile = useIsMobile();

  // Calculate initial filters for proper reset functionality
  const initialFilters: FilterState = useMemo(() => {
    if (!boxesData || boxesData.length === 0) {
      return {
        categories: [],
        providers: [], // Add providers property
        priceRange: { min: 0, max: 1000 },
        expectedValueRange: { min: 0, max: 200 }, // EV should never be negative
        volatilityBuckets: [],
        volatilityRange: { min: 0, max: 100 },
        floorRateRange: { min: 0, max: 100 },
        tags: [],
        advanced: {
          jackpotValueRange: { min: 0, max: 10000 },
          itemCountRange: { min: 0, max: 100 }
        }
      };
    }

    const validPrices = boxesData.map(box => Number(box?.box_price)).filter(p => !isNaN(p) && p > 0);
    const validEvs = boxesData.map(box => Number(box?.expected_value_percent_of_price)).filter(v => !isNaN(v) && v >= 0); // Only positive EVs
    const validFloors = boxesData.map(box => Number(box?.floor_rate_percent)).filter(v => !isNaN(v) && v >= 0);
    const validVolatilities = boxesData.map(box => Number(box?.standard_deviation_percent)).filter(v => !isNaN(v) && v >= 0);

    return {
      categories: [],
      providers: [], // Add providers property
      priceRange: { 
        min: validPrices.length > 0 ? Math.floor(Math.min(...validPrices)) : 0,
        max: validPrices.length > 0 ? Math.ceil(Math.max(...validPrices)) : 1000
      },
      expectedValueRange: { 
        min: 0, // Always start EV from 0, never negative
        max: validEvs.length > 0 ? Math.ceil(Math.max(...validEvs)) : 200
      },
      volatilityBuckets: [],
      volatilityRange: { 
        min: 0,
        max: validVolatilities.length > 0 ? Math.ceil(Math.max(...validVolatilities)) : 100
      },
      floorRateRange: { 
        min: validFloors.length > 0 ? Math.floor(Math.min(...validFloors)) : 0,
        max: validFloors.length > 0 ? Math.ceil(Math.max(...validFloors)) : 100
      },
      tags: [],
      advanced: {
        jackpotValueRange: { min: 0, max: 10000 },
        itemCountRange: { min: 0, max: 100 }
      }
    };
  }, [boxesData]);

  // Calculate available options from data
  const { 
    availableCategories, 
    availableTags, 
    priceRange, 
    evRange, 
    floorRange,
    jackpotRange,
    itemCountRange
  } = useMemo(() => {
    const categories = [...new Set(boxesData.map(box => box.category).filter(Boolean))];
    const tags = [...new Set(boxesData.flatMap(box => box.tags))];
    
    const prices = boxesData.map(box => box.box_price).filter(Boolean);
    const evs = boxesData.map(box => box.expected_value_percent_of_price).filter(v => v !== null && v !== undefined && v >= 0); // Only positive EVs
    const floors = boxesData.map(box => box.floor_rate_percent).filter(Boolean);
    
    const jackpotValues = boxesData.flatMap(box => 
      box.jackpot_items?.map(item => item.value || 0) || []
    ).filter(val => val > 0);
    
    const itemCounts = boxesData.map(box => 
      box.all_items?.length || 0
    ).filter(count => count > 0);
    
    return {
      availableCategories: categories,
      availableTags: tags,
      priceRange: {
        min: Math.floor(Math.min(...prices, 0)),
        max: Math.ceil(Math.max(...prices, 1000))
      },
      evRange: {
        min: 0, // Always start from 0, never negative
        max: Math.ceil(Math.max(...evs, 200))
      },
      floorRange: {
        min: Math.floor(Math.min(...floors, 0)),
        max: Math.ceil(Math.max(...floors, 100))
      },
      jackpotRange: {
        min: 0,
        max: Math.ceil(Math.max(...jackpotValues, 10000))
      },
      itemCountRange: {
        min: 0,
        max: Math.ceil(Math.max(...itemCounts, 100))
      }
    };
  }, [boxesData]);

  // Calculate provider counts from boxesData
  const providerCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    boxesData.forEach(box => {
      // Use optional chaining to safely access provider property
      if (box?.provider) {
        counts[box.provider] = (counts[box.provider] || 0) + 1;
      }
    });
    return counts;
  }, [boxesData]);

  const clearAllFilters = () => {
    onFiltersChange(initialFilters);
    
    toast({
      title: "All filters cleared",
      description: "All filters have been reset to default values.",
    });
  };

  const updateFilters = (updates: Partial<FilterState>) => {
    console.log('FilterPanel updateFilters called with:', updates);
    const newFilters = { ...filters, ...updates };
    console.log('New filters state:', newFilters);
    onFiltersChange(newFilters);
  };

  const updateAdvancedFilters = (updates: Partial<FilterState['advanced']>) => {
    onFiltersChange({
      ...filters,
      advanced: { ...filters.advanced, ...updates }
    });
  };

  // Render trigger button
  const TriggerButton = (
    <Button 
      variant="outline" 
      className="bg-white/60 border-purple-300 text-gray-800 transition-all duration-300 hover:bg-white hover:border-purple-400 focus:border-purple-400 focus:ring-purple-400 relative"
    >
      <Filter className="h-4 w-4 mr-2" />
      Filters
      {activeFiltersCount > 0 && (
        <span className="ml-2 px-1.5 py-0.5 text-xs bg-purple-500 text-white rounded-full animate-pulse">
          {activeFiltersCount}
        </span>
      )}
    </Button>
  );

  // Render filter content
  const FilterContent = (
    <div className="space-y-6">
      {/* Advanced Provider Filter */}
      <ProviderFilter
        selectedProviders={filters.providers}
        onProviderChange={(providers) => updateFilters({ providers })}
        providerCounts={providerCounts}
      />

      <CategoryFilter
        selectedCategories={filters.categories}
        availableCategories={availableCategories}
        onCategoryChange={(categories) => updateFilters({ categories })}
      />

      <RangeFilter
        title="Price Range"
        min={priceRange.min}
        max={priceRange.max}
        value={filters.priceRange}
        onChange={(priceRange) => updateFilters({ priceRange })}
        formatLabel={(v) => `$${v.toFixed(2)}`}
        step={0.01}
      />

      {isMobile ? (
        <MobileRangeFilter
          title="Expected Value"
          min={evRange.min}
          max={evRange.max}
          value={filters.expectedValueRange}
          onChange={(expectedValueRange) => updateFilters({ expectedValueRange })}
          formatLabel={(v) => `${v.toFixed(1)}%`}
          step={0.1}
          presetButtons={[
            {
              label: "High Value >50%",
              action: () => updateFilters({
                expectedValueRange: { min: 50, max: evRange.max }
              })
            },
            {
              label: "Premium >100%",
              action: () => updateFilters({
                expectedValueRange: { min: 100, max: evRange.max }
              })
            }
          ]}
        />
      ) : (
        <RangeFilter
          title="Expected Value"
          min={evRange.min}
          max={evRange.max}
          value={filters.expectedValueRange}
          onChange={(expectedValueRange) => updateFilters({ expectedValueRange })}
          formatLabel={(v) => `${v.toFixed(1)}%`}
          step={0.1}
          presetButtons={[
            {
              label: "High Value >50%",
              action: () => updateFilters({
                expectedValueRange: { min: 50, max: evRange.max }
              })
            },
            {
              label: "Premium >100%",
              action: () => updateFilters({
                expectedValueRange: { min: 100, max: evRange.max }
              })
            }
          ]}
        />
      )}

      <VolatilityFilter
        selectedBuckets={filters.volatilityBuckets}
        onBucketsChange={(volatilityBuckets) => updateFilters({ volatilityBuckets })}
        percentageRange={filters.volatilityRange}
        onPercentageRangeChange={(volatilityRange) => updateFilters({ volatilityRange })}
      />

      <RangeFilter
        title="Floor Rate"
        min={floorRange.min}
        max={floorRange.max}
        value={filters.floorRateRange}
        onChange={(floorRateRange) => updateFilters({ floorRateRange })}
        formatLabel={(v) => `${v.toFixed(1)}%`}
        step={0.1}
        presetButtons={[
          {
            label: "High Floor >80%",
            action: () => updateFilters({
              floorRateRange: { min: 80, max: floorRange.max }
            })
          },
          {
            label: "Safe Bets >90%",
            action: () => updateFilters({
              floorRateRange: { min: 90, max: floorRange.max }
            })
          }
        ]}
      />

      <TagsFilter
        selectedTags={filters.tags}
        availableTags={availableTags}
        onTagsChange={(tags) => updateFilters({ tags })}
      />

      <AdvancedFilters
        jackpotValueRange={filters.advanced.jackpotValueRange}
        onJackpotValueRangeChange={(jackpotValueRange) => 
          updateAdvancedFilters({ jackpotValueRange })
        }
        itemCountRange={filters.advanced.itemCountRange}
        onItemCountRangeChange={(itemCountRange) => 
          updateAdvancedFilters({ itemCountRange })
        }
        maxJackpotValue={jackpotRange.max}
        maxItemCount={itemCountRange.max}
      />
    </div>
  );

  // Render mobile drawer
  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={onOpenChange}>
        <DrawerTrigger asChild>
          {TriggerButton}
        </DrawerTrigger>
        <DrawerContent className="max-h-[85vh]">
          <DrawerHeader className="pb-4 border-b">
            <div className="flex items-center justify-between">
              <div>
                <DrawerTitle className="text-xl font-semibold text-gray-900">
                  Filter & Search
                </DrawerTitle>
                <DrawerDescription className="text-gray-600">
                  Refine your search with filtering options
                </DrawerDescription>
              </div>
              <div className="flex items-center gap-2">
                {activeFiltersCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearAllFilters}
                    className="text-gray-500 hover:text-gray-700 hover:bg-red-50 transition-colors min-h-[44px]"
                  >
                    <RotateCcw className="h-5 w-5 mr-1" />
                    Clear All
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onOpenChange(false)}
                  className="text-gray-500 hover:text-gray-700 min-h-[44px] min-w-[44px]"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </DrawerHeader>

          <ScrollableContainer 
            maxHeight="max-h-[calc(85vh-12rem)]" 
            className="px-4 pb-6"
            showIndicators={true}
          >
            <div className="space-y-6 pt-4">
              {FilterContent}
            </div>
          </ScrollableContainer>
        </DrawerContent>
      </Drawer>
    );
  }

  // Render desktop sheet
  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        {TriggerButton}
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <ScrollableContainer 
          maxHeight="h-full" 
          className="pb-6"
          showIndicators={true}
        >
        <SheetHeader className="pb-6">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-xl font-semibold text-gray-900">
              Filter & Search
            </SheetTitle>
            {activeFiltersCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="text-gray-500 hover:text-gray-700 hover:bg-red-50 transition-colors"
              >
                <RotateCcw className="h-4 w-4 mr-1" />
                Clear All
              </Button>
            )}
          </div>
          <SheetDescription className="text-gray-600">
            Refine your search with advanced filtering options
          </SheetDescription>
        </SheetHeader>

        {FilterContent}
        </ScrollableContainer>
      </SheetContent>
    </Sheet>
  );
};

export default FilterPanel;
