import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Search, TrendingUp, TrendingDown, Target, BarChart3, ChevronLeft, ChevronRight } from 'lucide-react';
import VirtualizedBoxGrid from './VirtualizedBoxGrid';
import PaginationControls from './PaginationControls';
import { useDebounce } from '@/hooks/useDebounce';

// Type definitions for the data structures
interface RillaBoxMetricsSummary {
  portfolio_average_ev_percent: number;
  best_box_by_ev_percent: string;
  best_box_ev_percent: number;
  worst_box_by_ev_percent: string;
  worst_box_ev_percent: number;
  portfolio_average_standard_deviation_percent: number;
}
interface BoxItem {
  name: string;
  value: number;
  drop_chance: number;
  image?: string;
  type?: string;
}
interface RillaBoxMetricsBox {
  box_name: string;
  box_price: number;
  box_image: string;
  expected_value_percent_of_price: number;
  volatility_bucket: 'Low' | 'Medium' | 'High';
  standard_deviation_percent: number;
  floor_rate_percent: number;
  category: string;
  tags: string[];
  jackpot_items: BoxItem[];
  unwanted_items: BoxItem[];
  all_items: BoxItem[];
}
interface RillaBoxDashboardProps {
  summaryData: RillaBoxMetricsSummary;
  boxesData: RillaBoxMetricsBox[];
}
const RillaBoxDashboard: React.FC<RillaBoxDashboardProps> = ({
  summaryData,
  boxesData
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'price' | 'ev' | 'volatility' | 'volatility_low' | 'floor_price'>('price');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(50);
  const [isLoading, setIsLoading] = useState(false);
  const [animatedStats, setAnimatedStats] = useState({
    portfolioEV: 0,
    bestBoxEV: 0,
    worstBoxEV: 0,
    avgVolatility: 0
  });
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Enhanced animation function with easing
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
      animateValue(0, summaryData.portfolio_average_ev_percent, 2000, 'portfolioEV');
      animateValue(0, summaryData.best_box_ev_percent, 2200, 'bestBoxEV');
      animateValue(0, summaryData.worst_box_ev_percent, 1800, 'worstBoxEV');
      animateValue(0, summaryData.portfolio_average_standard_deviation_percent, 2400, 'avgVolatility');
    }, 600);
  }, [summaryData]);

  // Get unique categories for filtering
  const categories = useMemo(() => {
    const cats = [...new Set(boxesData.map(box => box.category))];
    return cats;
  }, [boxesData]);

  // Filter and sort boxes with performance optimization
  const filteredAndSortedBoxes = useMemo(() => {
    setIsLoading(true);
    let filtered = boxesData.filter(box => {
      const matchesSearch = box.box_name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) || box.tags.some(tag => tag.toLowerCase().includes(debouncedSearchTerm.toLowerCase()));
      const matchesCategory = filterCategory === 'all' || box.category === filterCategory;
      return matchesSearch && matchesCategory;
    });
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price':
          return a.box_price - b.box_price;
        case 'ev':
          return b.expected_value_percent_of_price - a.expected_value_percent_of_price;
        case 'volatility':
          return (b.standard_deviation_percent || 0) - (a.standard_deviation_percent || 0);
        case 'volatility_low':
          return (a.standard_deviation_percent || 0) - (b.standard_deviation_percent || 0);
        case 'floor_price':
          return (b.floor_rate_percent || 0) - (a.floor_rate_percent || 0);
        default:
          return 0;
      }
    });
    setIsLoading(false);
    return filtered;
  }, [boxesData, debouncedSearchTerm, sortBy, filterCategory]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm, sortBy, filterCategory]);

  // Calculate pagination info
  const totalPages = Math.ceil(filteredAndSortedBoxes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, filteredAndSortedBoxes.length);
  const getVolatilityColor = (bucket: string) => {
    switch (bucket) {
      case 'Low':
        return 'border-green-400 bg-green-50 text-green-700';
      case 'Medium':
        return 'border-yellow-400 bg-yellow-50 text-yellow-700';
      case 'High':
        return 'border-red-400 bg-red-50 text-red-700';
      default:
        return 'border-gray-400 bg-gray-50 text-gray-700';
    }
  };
  const getEVColor = (ev: number) => {
    if (ev > 200) return 'text-green-600';
    if (ev > 100) return 'text-blue-600';
    if (ev > 50) return 'text-yellow-600';
    return 'text-red-600';
  };
  const formatDropRate = (dropChance: number) => {
    if (!dropChance || isNaN(dropChance)) return '0%';
    const percentage = dropChance * 100;
    if (percentage >= 1) {
      return `${percentage.toFixed(1)}%`;
    } else if (percentage >= 0.1) {
      return `${percentage.toFixed(2)}%`;
    } else {
      return `${percentage.toFixed(3)}%`;
    }
  };
  const formatCurrency = (value: number) => {
    if (!value || isNaN(value)) return '$0';
    return `$${value.toLocaleString()}`;
  };
  const safeParseJSON = (jsonString: string | any) => {
    if (!jsonString) return [];
    if (typeof jsonString === 'object') return jsonString;
    try {
      return JSON.parse(jsonString);
    } catch (e) {
      console.warn('Failed to parse JSON:', jsonString);
      return [];
    }
  };
  console.log('Total boxes in data:', boxesData.length);
  console.log('Filtered boxes:', filteredAndSortedBoxes.length);
  console.log('Current page:', currentPage, 'of', totalPages);
  return <div className="p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Enhanced Header Section with Centered Logo */}
        <motion.div className="text-center space-y-6" initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.8
      }}>
          <div className="flex items-center justify-center">
            <img src="/images/208a85a9-4108-4646-8cb0-aed2a05655ab.png" alt="Unpacked.gg Logo" className="h-32 object-contain" />
          </div>
          <p className="text-xl text-gray-600 font-medium">Discover the perfect mystery box for your risk appetite.</p>
        </motion.div>

        {/* Enhanced Summary Stats with Purple Theme */}
        <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.8,
        delay: 0.3
      }}>
          <motion.div whileHover={{
          scale: 1.02,
          y: -2
        }} transition={{
          type: "spring",
          stiffness: 300
        }}>
            <Card className="glass-edge hover:shadow-xl transition-all duration-300 border-purple-200/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-700">Portfolio Average EV</CardTitle>
                <BarChart3 className="h-5 w-5 text-purple-500 drop-shadow-sm" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent">
                  {animatedStats.portfolioEV.toFixed(1)}%
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div whileHover={{
          scale: 1.02,
          y: -2
        }} transition={{
          type: "spring",
          stiffness: 300
        }}>
            <Card className="glass-edge hover:shadow-xl transition-all duration-300 border-purple-200/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-700">Best Box</CardTitle>
                <TrendingUp className="h-5 w-5 text-purple-500 drop-shadow-sm" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent">
                  {animatedStats.bestBoxEV.toFixed(1)}%
                </div>
                <p className="text-xs text-gray-600 mt-1 font-medium truncate">{summaryData.best_box_by_ev_percent}</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div whileHover={{
          scale: 1.02,
          y: -2
        }} transition={{
          type: "spring",
          stiffness: 300
        }}>
            <Card className="glass-edge hover:shadow-xl transition-all duration-300 border-purple-200/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-700">Worst Box</CardTitle>
                <TrendingDown className="h-5 w-5 text-purple-500 drop-shadow-sm" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
                  {animatedStats.worstBoxEV.toFixed(1)}%
                </div>
                <p className="text-xs text-gray-600 mt-1 font-medium truncate">{summaryData.worst_box_by_ev_percent}</p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div whileHover={{
          scale: 1.02,
          y: -2
        }} transition={{
          type: "spring",
          stiffness: 300
        }}>
            <Card className="glass-edge hover:shadow-xl transition-all duration-300 border-purple-200/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-700">Avg. Volatility</CardTitle>
                <Target className="h-5 w-5 text-purple-500 drop-shadow-sm" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent">
                  {animatedStats.avgVolatility.toFixed(1)}%
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Enhanced Controls with Purple Theme */}
        <motion.div className="flex flex-col md:flex-row gap-4 items-center justify-between glass-edge rounded-xl p-6 shadow-lg border-purple-200/30" initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.8,
        delay: 0.5
      }}>
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-500 h-4 w-4" />
            <Input placeholder="Search boxes or tags..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10 bg-white/60 border-purple-300 text-gray-800 placeholder:text-gray-500 transition-all duration-300 focus:bg-white focus:border-purple-400 focus:shadow-md focus:ring-purple-400" />
          </div>
          
          <div className="flex gap-4 items-center">
            <Select value={sortBy} onValueChange={(value: 'price' | 'ev' | 'volatility' | 'volatility_low' | 'floor_price') => setSortBy(value)}>
              <SelectTrigger className="w-48 bg-white/60 border-purple-300 text-gray-800 transition-all duration-300 hover:bg-white hover:border-purple-400 focus:border-purple-400 focus:ring-purple-400">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent className="bg-white border-purple-200 shadow-xl">
                <SelectItem value="ev">Expected Value</SelectItem>
                <SelectItem value="price">Box Price</SelectItem>
                <SelectItem value="volatility">Volatility (High to Low)</SelectItem>
                <SelectItem value="volatility_low">Volatility (Low to High)</SelectItem>
                <SelectItem value="floor_price">Floor Rate</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-40 bg-white/60 border-purple-300 text-gray-800 transition-all duration-300 hover:bg-white hover:border-purple-400 focus:border-purple-400 focus:ring-purple-400">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent className="bg-white border-purple-200 shadow-xl">
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => <SelectItem key={category} value={category}>{category}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </motion.div>

        {/* Top pagination controls */}
        <PaginationControls currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} startIndex={startIndex} endIndex={endIndex} totalItems={filteredAndSortedBoxes.length} />

        {/* Virtualized Box Grid */}
        <VirtualizedBoxGrid boxes={filteredAndSortedBoxes} itemsPerPage={itemsPerPage} currentPage={currentPage} />

        {/* Bottom pagination controls */}
        <PaginationControls currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} startIndex={startIndex} endIndex={endIndex} totalItems={filteredAndSortedBoxes.length} />

        {filteredAndSortedBoxes.length === 0 && !isLoading && <motion.div className="text-center py-12" initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} transition={{
        duration: 0.3
      }}>
            <div className="text-xl text-gray-600">No boxes found matching your criteria</div>
          </motion.div>}
      </div>
    </div>;
};
export default RillaBoxDashboard;