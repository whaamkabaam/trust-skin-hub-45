import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, FilterX, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import SortDropdown from './SortDropdown';
import FilterPanel from './FilterPanel';
import MobileFilterChips from './MobileFilterChips';
import FilterChips from './FilterChips';
import ProviderLogo from './ui/ProviderLogo';
import { FilterState, SortOption, PROVIDER_CONFIGS } from '@/types/filters';
import { RillaBoxMetricsBox } from '@/types';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface FilterControlsProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  sortBy: SortOption;
  onSortChange: (value: SortOption) => void;
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  boxesData: RillaBoxMetricsBox[];
  activeFiltersCount: number;
  onClearAllFilters: () => void;
  onRemoveFilter: (filterType: string, value?: string) => void;
  filterPanelOpen: boolean;
  onFilterPanelOpenChange: (open: boolean) => void;
  filteredCount: number;
  totalCount: number;
  initialFilters: FilterState;
}

const FilterControls: React.FC<FilterControlsProps> = ({
  searchTerm,
  onSearchChange,
  sortBy,
  onSortChange,
  filters,
  onFiltersChange,
  boxesData,
  activeFiltersCount,
  onClearAllFilters,
  onRemoveFilter,
  filterPanelOpen,
  onFilterPanelOpenChange,
  filteredCount,
  totalCount,
  initialFilters
}) => {
  const isMobile = useIsMobile();
  // Calculate provider counts and available categories
  const { providerCounts, availableCategories } = useMemo(() => {
    const counts: Record<string, number> = {};
    boxesData.forEach(box => {
      if (box?.provider) {
        counts[box.provider] = (counts[box.provider] || 0) + 1;
      }
    });
    
    const categories = [...new Set(boxesData.map(box => box.category).filter(Boolean))];
    // Remove "Unknown" category and limit to 8 for space
    const filteredCategories = categories.filter(cat => cat !== 'Unknown').slice(0, 8);
    
    return { 
      providerCounts: counts, 
      availableCategories: filteredCategories
    };
  }, [boxesData]);

  const handleProviderClick = (providerId: string) => {
    const newProviders = filters.providers.includes(providerId)
      ? filters.providers.filter(p => p !== providerId)
      : [...filters.providers, providerId];
    onFiltersChange({ ...filters, providers: newProviders });
  };

  const handleCategoryClick = (category: string) => {
    const newCategories = filters.categories.includes(category)
      ? filters.categories.filter(c => c !== category)
      : [...filters.categories, category];
    onFiltersChange({ ...filters, categories: newCategories });
  };

  return (
    <motion.div 
      className={`flex flex-col glass-edge rounded-xl shadow-lg border-purple-200/30 overflow-hidden ${
        isMobile ? 'space-y-5 p-4 mx-3 max-w-[calc(100vw-1.5rem)]' : 'space-y-6 p-8'
      }`}
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 0.8, delay: 0.5 }}
    >
      {/* Search Bar - Mobile optimized */}
      <div className="relative w-full">
        <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-500 ${isMobile ? 'h-5 w-5' : 'h-4 w-4'}`} />
        <Input 
          placeholder={isMobile ? "Search boxes..." : "Search mystery boxes, tags, or categories..."} 
          value={searchTerm} 
          onChange={e => onSearchChange(e.target.value)} 
          className={`w-full ${isMobile ? 'pl-12 min-h-[48px] text-base' : 'pl-10'} bg-white/60 border-purple-300 text-gray-800 placeholder:text-gray-500 transition-all duration-300 focus:bg-white focus:border-purple-400 focus:shadow-md focus:ring-purple-400`}
          inputMode="search"
        />
        {searchTerm && (
          <Button
            variant="ghost"
            size="sm"
            className={`absolute right-2 top-1/2 transform -translate-y-1/2 h-auto p-1 text-gray-400 hover:text-gray-600 ${isMobile ? 'h-8 w-8' : 'h-6 w-6'}`}
            onClick={() => onSearchChange('')}
          >
            <FilterX className={`${isMobile ? 'h-4 w-4' : 'h-3 w-3'}`} />
          </Button>
        )}
      </div>
      
      {/* Quick Filters Section - Always Visible */}
      <div className="space-y-3 p-3 bg-purple-50/50 rounded-lg border border-purple-200/50">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-purple-700">Quick Filters</span>
          {(filters.providers.length > 0 || filters.categories.length > 0) && (
            <Badge variant="secondary" className="bg-purple-100 text-purple-700 text-xs">
              {filters.providers.length + filters.categories.length}
            </Badge>
          )}
        </div>
        
        {/* Provider Quick Selection */}
        <div className="space-y-2">
          <span className="text-xs font-medium text-gray-600">Providers</span>
          <div className="flex flex-wrap gap-2">
            {Object.entries(PROVIDER_CONFIGS).map(([providerId, config]) => {
              const isSelected = filters.providers.includes(providerId);
              const count = providerCounts[providerId] || 0;
              
              return (
                <button
                  key={providerId}
                  onClick={() => handleProviderClick(providerId)}
                  className={`
                    flex items-center gap-2 px-3 py-2 rounded-full border transition-all duration-200 text-xs
                    ${isSelected 
                      ? 'border-purple-400 bg-purple-50 text-purple-700' 
                      : 'border-gray-200 bg-white hover:border-gray-300 text-gray-600'
                    }
                  `}
                >
                  <ProviderLogo 
                    providerId={providerId as keyof typeof PROVIDER_CONFIGS} 
                    size="sm"
                    enhanced={true}
                  />
                  <span className="font-medium">{config.displayName}</span>
                  {count > 0 && (
                    <span className={`
                      px-1.5 py-0.5 rounded-full text-xs
                      ${isSelected ? 'bg-purple-200 text-purple-800' : 'bg-gray-100 text-gray-600'}
                    `}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Category Quick Selection */}
        <div className="space-y-2">
          <span className="text-xs font-medium text-gray-600">Categories</span>
          <div className="flex flex-wrap gap-1.5">
            {availableCategories.map((category) => {
              const isSelected = filters.categories.includes(category);
              
              return (
                <button
                  key={category}
                  onClick={() => handleCategoryClick(category)}
                  className={`
                    px-2 py-1 rounded-full text-xs font-medium transition-all duration-200
                    ${isSelected 
                      ? 'bg-purple-100 text-purple-700 border border-purple-300' 
                      : 'bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200'
                    }
                  `}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* Controls Row - Mobile responsive */}
      <div className={`flex gap-3 items-stretch ${isMobile ? 'flex-col w-full' : 'flex-wrap justify-between'}`}>
        {/* Left side controls */}
        <div className={`flex gap-3 ${isMobile ? 'w-full' : 'items-center flex-wrap'}`}>
          {/* Mobile: Full width buttons */}
          {isMobile ? (
            <div className="grid grid-cols-2 gap-4 w-full">
              <div className="w-full">
                <SortDropdown value={sortBy} onChange={onSortChange} />
              </div>
              <div className="w-full">
                <FilterPanel
                  isOpen={filterPanelOpen}
                  onOpenChange={onFilterPanelOpenChange}
                  filters={filters}
                  onFiltersChange={onFiltersChange}
                  boxesData={boxesData}
                  activeFiltersCount={activeFiltersCount}
                />
              </div>
            </div>
          ) : (
            // Desktop: Inline layout
            <>
              <SortDropdown value={sortBy} onChange={onSortChange} />
              <FilterPanel
                isOpen={filterPanelOpen}
                onOpenChange={onFilterPanelOpenChange}
                filters={filters}
                onFiltersChange={onFiltersChange}
                boxesData={boxesData}
                activeFiltersCount={activeFiltersCount}
              />
              
              {/* Desktop Clear All Filters Button */}
              {activeFiltersCount > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onClearAllFilters}
                  className="flex items-center gap-2 text-purple-600 border-purple-300 hover:bg-purple-50 hover:border-purple-400 transition-all duration-200"
                >
                  <FilterX className="h-4 w-4" />
                  Clear All
                  <Badge variant="secondary" className="ml-1 bg-purple-100 text-purple-700">
                    {activeFiltersCount}
                  </Badge>
                </Button>
              )}
            </>
          )}

          {/* Show All Button - When no results (full width on mobile) */}
          {filteredCount === 0 && activeFiltersCount > 0 && (
            <Button
              variant="default"
              size={isMobile ? "lg" : "sm"}
              onClick={onClearAllFilters}
              className={`flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 transition-all duration-200 ${
                isMobile ? 'w-full min-h-[48px] px-6 mt-3' : ''
              }`}
            >
              <Filter className={`${isMobile ? 'h-5 w-5' : 'h-4 w-4'}`} />
              Show All Mystery Boxes
            </Button>
          )}
        </div>
        
        {/* Results Counter - Desktop only */}
        {!isMobile && (
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <span>
              {searchTerm ? (
                <>
                  Found <span className="font-semibold text-purple-600">{filteredCount.toLocaleString()}</span> matches
                  {activeFiltersCount > 0 && (
                    <span className="text-gray-500"> (with filters)</span>
                  )}
                </>
              ) : (
                <>
                  Showing <span className="font-semibold text-purple-600">{filteredCount.toLocaleString()}</span> of{' '}
                  <span className="font-semibold">{totalCount.toLocaleString()}</span> mystery boxes
                </>
              )}
            </span>
            {activeFiltersCount > 0 && (
              <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-300">
                {activeFiltersCount} filter{activeFiltersCount !== 1 ? 's' : ''} active
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* Mobile Clear All Button */}
      {activeFiltersCount > 0 && isMobile && (
        <Button
          variant="outline"
          size="lg"
          onClick={onClearAllFilters}
          className="w-full flex items-center justify-center gap-2 text-purple-600 border-purple-300 hover:bg-purple-50 hover:border-purple-400 transition-all duration-200 min-h-[48px]"
        >
          <FilterX className="h-5 w-5" />
          Clear All Filters
          <Badge variant="secondary" className="bg-purple-100 text-purple-700">
            {activeFiltersCount}
          </Badge>
        </Button>
      )}

      {/* Filter Chips - Always show, even when no filters */}
      <div className={`${isMobile ? 'mt-3' : 'mt-2'}`}>
        {activeFiltersCount > 0 ? (
          isMobile ? (
            <MobileFilterChips
              filters={filters}
              onRemoveFilter={onRemoveFilter}
              initialFilters={initialFilters}
            />
          ) : (
            <FilterChips
              filters={filters}
              onRemoveFilter={onRemoveFilter}
              initialFilters={initialFilters}
            />
          )
        ) : (
          <div className="flex items-center text-sm text-gray-500">
            <span className="font-medium">Filters:</span>
            <span className="ml-2 italic">No filters applied - showing all mystery boxes</span>
          </div>
        )}
      </div>

      {/* Mobile Results Counter - At bottom */}
      {isMobile && (
        <div className="flex items-center justify-center text-sm text-gray-600 pt-2 border-t border-purple-200/50">
          <span className="text-center">
            {searchTerm ? (
              <>
                <span className="font-semibold text-purple-600">{filteredCount.toLocaleString()}</span> matches found
                {activeFiltersCount > 0 && (
                  <span className="block text-xs text-purple-600 mt-1">
                    {activeFiltersCount} filter{activeFiltersCount !== 1 ? 's' : ''} active
                  </span>
                )}
              </>
            ) : (
              <>
                <span className="font-semibold text-purple-600">{filteredCount.toLocaleString()}</span> of{' '}
                <span className="font-semibold">{totalCount.toLocaleString()}</span> boxes
                {activeFiltersCount > 0 && (
                  <span className="block text-xs text-purple-600 mt-1">
                    {activeFiltersCount} filter{activeFiltersCount !== 1 ? 's' : ''} active
                  </span>
                )}
              </>
            )}
          </span>
        </div>
      )}
    </motion.div>
  );
};

export default FilterControls;