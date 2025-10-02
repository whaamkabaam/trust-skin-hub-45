import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { BarChart3 } from 'lucide-react';
import VirtualizedBoxGrid from './VirtualizedBoxGrid';
import PaginationControls from './PaginationControls';
import { useDebounce } from '@/hooks/useDebounce';
import { FilterState, SortOption } from '@/types/filters';
import FilterControls from './FilterControls';
import { useOptimizedFiltering } from '@/hooks/useOptimizedFiltering';
import { BoxItem, RillaBoxMetricsBox } from '@/types';

interface BoxfolioDashboardProps {
  summaryData: any;
  boxesData: any[];
  isUnified?: boolean;
  showOnlyStats?: boolean;
  showOnlyContent?: boolean;
  selectedProvider?: string | null;
}

const BoxfolioDashboard: React.FC<BoxfolioDashboardProps> = ({
  summaryData,
  boxesData,
  isUnified = false,
  showOnlyStats = false,
  showOnlyContent = false,
  selectedProvider = null
}) => {
  // Calculate initial filters FIRST before using them
  const initialFilters: FilterState = useMemo(() => {
    if (!boxesData || boxesData.length === 0) {
      return {
        categories: [],
        providers: selectedProvider ? [selectedProvider] : [],
        priceRange: { min: 0, max: 1000 },
        expectedValueRange: { min: 0, max: 200 },
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
    const validEvs = boxesData.map(box => Number(box?.expected_value_percent_of_price)).filter(v => !isNaN(v) && v >= 0);
    const validFloors = boxesData.map(box => Number(box?.floor_rate_percent)).filter(v => !isNaN(v) && v >= 0);
    const validVolatilities = boxesData.map(box => Number(box?.standard_deviation_percent)).filter(v => !isNaN(v) && v >= 0);

    return {
      categories: [],
      providers: selectedProvider ? [selectedProvider] : [],
      priceRange: { 
        min: validPrices.length > 0 ? Math.floor(Math.min(...validPrices)) : 0,
        max: validPrices.length > 0 ? Math.ceil(Math.max(...validPrices)) : 1000
      },
      expectedValueRange: { 
        min: 0,
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
  }, [boxesData, selectedProvider]);

  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('price_asc');
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(24);
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const [animatedStats, setAnimatedStats] = useState({
    portfolioEV: 0,
    bestBoxEV: 0,
    worstBoxEV: 0,
    avgVolatility: 0
  });

  useEffect(() => {
    const animateValue = (start: number, end: number, duration: number, key: keyof typeof animatedStats) => {
      const startTime = Date.now();
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easeOutCubic = 1 - Math.pow(1 - progress, 3);
        const current = start + (end - start) * easeOutCubic;
        setAnimatedStats(prev => ({
          ...prev,
          [key]: current
        }));
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      requestAnimationFrame(animate);
    };

    setTimeout(() => {
      animateValue(0, summaryData?.portfolio_average_ev_percent || 0, 2000, 'portfolioEV');
      animateValue(0, summaryData?.best_box_ev_percent || 0, 2200, 'bestBoxEV');
      animateValue(0, summaryData?.worst_box_ev_percent || 0, 1800, 'worstBoxEV');
      animateValue(0, summaryData?.portfolio_average_standard_deviation_percent || 0, 2400, 'avgVolatility');
    }, 600);
  }, [summaryData]);

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.categories.length > 0) count++;
    if (filters.providers.length > 0) count++;
    if (filters.tags.length > 0) count++;
    if (filters.volatilityBuckets.length > 0) count++;
    
    // Compare against actual initial values instead of hardcoded ones
    if (filters.priceRange.min !== initialFilters.priceRange.min || 
        filters.priceRange.max !== initialFilters.priceRange.max) count++;
    if (filters.expectedValueRange.min !== initialFilters.expectedValueRange.min || 
        filters.expectedValueRange.max !== initialFilters.expectedValueRange.max) count++;
    if (filters.volatilityRange.min !== initialFilters.volatilityRange.min || 
        filters.volatilityRange.max !== initialFilters.volatilityRange.max) count++;
    if (filters.floorRateRange.min !== initialFilters.floorRateRange.min || 
        filters.floorRateRange.max !== initialFilters.floorRateRange.max) count++;
    
    return count;
  }, [filters, initialFilters]);

  const clearAllFilters = useCallback(() => {
    setFilters(initialFilters);
    setCurrentPage(1);
  }, [initialFilters]);

  const removeFilter = useCallback((filterType: string, value?: string) => {
    setFilters(prevFilters => {
      const newFilters = { ...prevFilters };
      switch (filterType) {
        case 'category':
          newFilters.categories = prevFilters.categories.filter(cat => cat !== value);
          break;
        case 'provider':
          newFilters.providers = prevFilters.providers.filter(prov => prov !== value);
          break;
        case 'tag':
          newFilters.tags = prevFilters.tags.filter(tag => tag !== value);
          break;
        // Reset range filters to their initial values
        case 'priceRange':
          newFilters.priceRange = initialFilters.priceRange;
          break;
        case 'expectedValueRange':
          newFilters.expectedValueRange = initialFilters.expectedValueRange;
          break;
        case 'volatilityRange':
          newFilters.volatilityRange = initialFilters.volatilityRange;
          break;
        case 'floorRateRange':
          newFilters.floorRateRange = initialFilters.floorRateRange;
          break;
        case 'volatilityBucket':
          newFilters.volatilityBuckets = [];
          break;
        default:
          break;
      }
      return newFilters;
    });
    setCurrentPage(1);
  }, [initialFilters]);

  const paginatedBoxes = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return boxesData.slice(startIndex, endIndex);
  }, [boxesData, currentPage, itemsPerPage]);

  const filteredAndSortedBoxes = useOptimizedFiltering(
    boxesData,
    filters,
    debouncedSearchTerm,
    sortBy
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm, filters, sortBy]);

  const totalPages = Math.ceil(filteredAndSortedBoxes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, filteredAndSortedBoxes.length);

  // If showing only stats, return just the animated statistics cards
  if (showOnlyStats) {
    return (
      <>
        {/* Portfolio Average EV Card */}
        <motion.div whileHover={{ scale: 1.02, y: -2 }} transition={{ type: "spring", stiffness: 300 }}>
          <Card className="glass-edge hover:shadow-xl transition-all duration-300 border-purple-200/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">
                Avg. Expected Value
              </CardTitle>
              <BarChart3 className="h-5 w-5 text-purple-500 drop-shadow-sm" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent">
                {animatedStats.portfolioEV.toFixed(1)}%
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Best Box Card */}
        <motion.div whileHover={{ scale: 1.02, y: -2 }} transition={{ type: "spring", stiffness: 300 }}>
          <Card className="glass-edge hover:shadow-xl transition-all duration-300 border-purple-200/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">Best Box</CardTitle>
              <BarChart3 className="h-5 w-5 text-purple-500 drop-shadow-sm" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent">
                {animatedStats.bestBoxEV.toFixed(1)}%
              </div>
              <p className="text-xs text-gray-600 mt-1 font-medium truncate">{summaryData?.best_box_by_ev_percent}</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Worst Box Card */}
        <motion.div whileHover={{ scale: 1.02, y: -2 }} transition={{ type: "spring", stiffness: 300 }}>
          <Card className="glass-edge hover:shadow-xl transition-all duration-300 border-purple-200/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">Worst Box</CardTitle>
              <BarChart3 className="h-5 w-5 text-purple-500 drop-shadow-sm" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
                {animatedStats.worstBoxEV.toFixed(1)}%
              </div>
              <p className="text-xs text-gray-600 mt-1 font-medium truncate">{summaryData?.worst_box_by_ev_percent}</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Average Volatility Card */}
        <motion.div whileHover={{ scale: 1.02, y: -2 }} transition={{ type: "spring", stiffness: 300 }}>
          <Card className="glass-edge hover:shadow-xl transition-all duration-300 border-purple-200/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-700">Avg. Volatility</CardTitle>
              <BarChart3 className="h-5 w-5 text-purple-500 drop-shadow-sm" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent">
                {animatedStats.avgVolatility.toFixed(1)}%
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </>
    );
  }

  // If showing only content, skip hero and stats
  if (showOnlyContent) {
    return (
      <>
        {/* Enhanced Filter Controls */}
        <FilterControls
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          sortBy={sortBy}
          onSortChange={setSortBy}
          filters={filters}
          onFiltersChange={setFilters}
          boxesData={boxesData}
          activeFiltersCount={activeFiltersCount}
          onClearAllFilters={clearAllFilters}
          onRemoveFilter={removeFilter}
          filterPanelOpen={filterPanelOpen}
          onFilterPanelOpenChange={setFilterPanelOpen}
          filteredCount={filteredAndSortedBoxes.length}
          totalCount={boxesData.length}
          initialFilters={initialFilters}
        />

        {/* Pagination Controls */}
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          startIndex={startIndex}
          endIndex={endIndex}
          totalItems={filteredAndSortedBoxes.length}
        />

        {/* Virtualized Box Grid */}
        <VirtualizedBoxGrid
          boxes={filteredAndSortedBoxes}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
        />

        {/* Pagination Controls */}
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          startIndex={startIndex}
          endIndex={endIndex}
          totalItems={filteredAndSortedBoxes.length}
        />

        {filteredAndSortedBoxes.length === 0 && (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-xl text-gray-600">No boxes found matching your criteria</div>
          </motion.div>
        )}
      </>
    );
  }

  // Default: show full dashboard (original behavior)
  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Enhanced Header Section with Unified Logo */}
        <motion.div 
          className="text-center space-y-6" 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8 }}
        >
          <div className="flex items-center justify-center">
            <img 
              src="/images/208a85a9-4108-4646-8cb0-aed2a05655ab.png" 
              alt="Unpacked.gg Logo" 
              className="h-32 object-contain" 
            />
          </div>
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent">
              {isUnified ? 'Multi-Provider Mystery Box Hub' : 'Mystery Box Analytics'}
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {isUnified 
                ? `Discover the perfect mystery box across ${summaryData?.provider_breakdown ? Object.keys(summaryData.provider_breakdown).length : 4} providers. Compare, analyze, and find the best value.`
                : 'Discover the perfect mystery box for your risk appetite.'
              }
            </p>
          </div>
        </motion.div>

        {/* Enhanced Summary Stats - Only 3 cards now */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-6" 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          {/* Portfolio Average EV Card */}
          <motion.div whileHover={{ scale: 1.02, y: -2 }} transition={{ type: "spring", stiffness: 300 }}>
            <Card className="glass-edge hover:shadow-xl transition-all duration-300 border-purple-200/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-700">
                  Avg. Expected Value
                </CardTitle>
                <BarChart3 className="h-5 w-5 text-purple-500 drop-shadow-sm" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent">
                  {animatedStats.portfolioEV.toFixed(1)}%
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Best Box Card */}
          <motion.div whileHover={{ scale: 1.02, y: -2 }} transition={{ type: "spring", stiffness: 300 }}>
            <Card className="glass-edge hover:shadow-xl transition-all duration-300 border-purple-200/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-700">Best Box</CardTitle>
                <BarChart3 className="h-5 w-5 text-purple-500 drop-shadow-sm" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent">
                  {animatedStats.bestBoxEV.toFixed(1)}%
                </div>
                <p className="text-xs text-gray-600 mt-1 font-medium truncate">{summaryData?.best_box_by_ev_percent}</p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Worst Box Card */}
          <motion.div whileHover={{ scale: 1.02, y: -2 }} transition={{ type: "spring", stiffness: 300 }}>
            <Card className="glass-edge hover:shadow-xl transition-all duration-300 border-purple-200/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-700">Worst Box</CardTitle>
                <BarChart3 className="h-5 w-5 text-purple-500 drop-shadow-sm" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
                  {animatedStats.worstBoxEV.toFixed(1)}%
                </div>
                <p className="text-xs text-gray-600 mt-1 font-medium truncate">{summaryData?.worst_box_by_ev_percent}</p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Average Volatility Card */}
          <motion.div whileHover={{ scale: 1.02, y: -2 }} transition={{ type: "spring", stiffness: 300 }}>
            <Card className="glass-edge hover:shadow-xl transition-all duration-300 border-purple-200/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-700">Avg. Volatility</CardTitle>
                <BarChart3 className="h-5 w-5 text-purple-500 drop-shadow-sm" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent">
                  {animatedStats.avgVolatility.toFixed(1)}%
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Enhanced Filter Controls */}
        <FilterControls
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          sortBy={sortBy}
          onSortChange={setSortBy}
          filters={filters}
          onFiltersChange={setFilters}
          boxesData={boxesData}
          activeFiltersCount={activeFiltersCount}
          onClearAllFilters={clearAllFilters}
          onRemoveFilter={removeFilter}
          filterPanelOpen={filterPanelOpen}
          onFilterPanelOpenChange={setFilterPanelOpen}
          filteredCount={filteredAndSortedBoxes.length}
          totalCount={boxesData.length}
          initialFilters={initialFilters}
        />

        {/* Pagination Controls */}
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          startIndex={startIndex}
          endIndex={endIndex}
          totalItems={filteredAndSortedBoxes.length}
        />

        {/* Virtualized Box Grid */}
        <VirtualizedBoxGrid
          boxes={filteredAndSortedBoxes}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
        />

        {/* Pagination Controls */}
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          startIndex={startIndex}
          endIndex={endIndex}
          totalItems={filteredAndSortedBoxes.length}
        />

        {filteredAndSortedBoxes.length === 0 && (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-xl text-gray-600">No boxes found matching your criteria</div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default BoxfolioDashboard;
