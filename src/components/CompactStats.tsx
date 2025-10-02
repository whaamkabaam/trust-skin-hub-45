
import React from 'react';
import { motion } from 'framer-motion';
import { Package, List } from 'lucide-react';
import { calculateTotalItemsCount, formatBoxCount, formatItemCount } from '@/utils/boxStatisticsUtils';

interface CompactStatsProps {
  boxesData: any[];
  loading?: boolean;
}

const CompactStats: React.FC<CompactStatsProps> = ({ boxesData, loading = false }) => {
  const totalBoxes = boxesData.length;
  const totalItems = calculateTotalItemsCount(boxesData);

  if (loading) {
    return (
      <div className="flex items-center justify-center">
        <div className="flex items-center justify-center gap-3 py-2 px-3 max-w-xs">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-purple-100 rounded-lg animate-pulse"></div>
            <div className="space-y-1">
              <div className="h-6 w-16 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
          <div className="h-8 w-px bg-gray-200"></div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-purple-100 rounded-lg animate-pulse"></div>
            <div className="space-y-1">
              <div className="h-6 w-16 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center">
      <motion.div 
        className="flex items-center justify-center gap-3 py-2 px-3 max-w-xs"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {/* Mystery Boxes Count */}
        <motion.div 
          className="flex items-center gap-2"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
            <Package className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900">
              {formatBoxCount(totalBoxes)}
            </div>
            <div className="text-sm text-gray-600 font-medium">
              Mystery Boxes
            </div>
          </div>
        </motion.div>

        {/* Separator */}
        <div className="h-8 w-px bg-gray-300"></div>

        {/* Items Indexed Count */}
        <motion.div 
          className="flex items-center gap-2"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
            <List className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900">
              {formatItemCount(totalItems)}
            </div>
            <div className="text-sm text-gray-600 font-medium">
              Items Indexed
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default CompactStats;
