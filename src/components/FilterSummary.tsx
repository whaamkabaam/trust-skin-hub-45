import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FilterState } from '@/types/filters';
import { RillaBoxMetricsBox } from '@/types';
import { useIsMobile } from '@/hooks/use-mobile';

interface FilterSummaryProps {
  filteredCount: number;
  totalCount: number;
  filters: FilterState;
  isLoading: boolean;
}

const FilterSummary: React.FC<FilterSummaryProps> = ({
  filteredCount,
  totalCount,
  filters,
  isLoading
}) => {
  const isMobile = useIsMobile();
  const hasActiveFilters = 
    filters.categories.length > 0 ||
    filters.tags.length > 0 ||
    filters.volatilityBuckets.length > 0;

  const getFilterSummaryText = () => {
    if (isLoading) return "Filtering mystery boxes...";
    if (filteredCount === totalCount && !hasActiveFilters) {
      return `Showing all ${totalCount} mystery boxes`;
    }
    if (filteredCount === 0) {
      return "No mystery boxes match your filters";
    }
    return `Found ${filteredCount} of ${totalCount} mystery boxes`;
  };

  const getFilterDescription = () => {
    const activeFilters = [];
    
    // Handle categories with proper singular/plural
    if (filters.categories.length > 0) {
      const categoryText = filters.categories.length === 1 ? 'category' : 'categories';
      activeFilters.push(`${filters.categories.length} ${categoryText}`);
    }
    
    // Handle tags with proper singular/plural
    if (filters.tags.length > 0) {
      const tagText = filters.tags.length === 1 ? 'tag' : 'tags';
      activeFilters.push(`${filters.tags.length} ${tagText}`);
    }
    
    // Handle volatility buckets with proper singular/plural
    if (filters.volatilityBuckets.length > 0) {
      const volatilityText = filters.volatilityBuckets.length === 1 ? 'volatility level' : 'volatility levels';
      activeFilters.push(`${filters.volatilityBuckets.length} ${volatilityText}`);
    }
    
    if (activeFilters.length === 0) return null;
    return `Filtered by: ${activeFilters.join(', ')}`;
  };

  // Don't render anything on mobile
  if (isMobile) return null;

  return (
    <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200/50">
      <CardContent className="p-0 md:p-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-900">
              {getFilterSummaryText()}
            </p>
            {getFilterDescription() && (
              <p className="text-xs text-gray-600">
                {getFilterDescription()}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            {isLoading && (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-purple-600 border-t-transparent"></div>
                <span className="text-xs text-purple-600">Filtering...</span>
              </div>
            )}
            <Badge variant="outline" className="bg-white/60">
              {filteredCount} mystery boxes
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FilterSummary;
