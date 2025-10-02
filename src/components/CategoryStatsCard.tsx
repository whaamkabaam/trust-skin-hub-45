
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CategoryStats } from '@/utils/boxStatistics';
import { formatCompactCurrency } from '@/utils/priceFormatter';

interface CategoryStatsCardProps {
  stats: CategoryStats;
  title: string;
  type: 'jackpot' | 'common';
}

const CategoryStatsCard: React.FC<CategoryStatsCardProps> = ({ stats, title, type }) => {
  const formatPercentage = (value: number) => {
    if (value >= 1) return `${value.toFixed(1)}%`;
    if (value >= 0.1) return `${value.toFixed(2)}%`;
    if (value >= 0.01) return `${value.toFixed(3)}%`;
    if (value >= 0.001) return `${value.toFixed(4)}%`;
    return `${value.toFixed(5)}%`;
  };


  const formatRatio = (value: number) => {
    if (value >= 1) return `${value.toFixed(1)}x`;
    if (value >= 0.1) return `${value.toFixed(2)}x`;
    if (value >= 0.01) return `${value.toFixed(3)}x`;
    if (value >= 0.001) return `${value.toFixed(4)}x`;
    if (value >= 0.0001) return `${value.toFixed(5)}x`;
    return `${value.toFixed(6)}x`;
  };

  const getEVGradient = (ev: number) => {
    if (ev > 10) return 'bg-gradient-to-r from-purple-500 to-purple-600 bg-clip-text text-transparent';
    if (ev > 5) return 'bg-gradient-to-r from-purple-400 to-purple-500 bg-clip-text text-transparent';
    return 'bg-gradient-to-r from-purple-300 to-purple-400 bg-clip-text text-transparent';
  };

  const getRatioGradient = (ratio: number) => {
    if (ratio > 1) return 'bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent';
    if (ratio > 0.5) return 'bg-gradient-to-r from-purple-500 to-purple-600 bg-clip-text text-transparent';
    return 'bg-gradient-to-r from-purple-400 to-purple-500 bg-clip-text text-transparent';
  };

  const getOddsGradient = (odds: number) => {
    return 'bg-gradient-to-r from-purple-500 to-purple-600 bg-clip-text text-transparent';
  };

  const getCardGlow = (type: 'jackpot' | 'common') => {
    if (type === 'jackpot') {
      return 'shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 border-purple-500/20 hover:border-purple-500/40';
    }
    return 'shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 border-purple-500/20 hover:border-purple-500/40';
  };

  const isCommonItems = type === 'common';
  const categoryLabel = type === 'jackpot' ? 'Jackpot Items' : 'Common Items';

  return (
    <Card className={`
      bg-white/20 backdrop-blur-md border mb-3 rounded-xl shadow-lg isolate
      transition-all duration-300 hover:scale-[1.02] hover:bg-white/30 motion-reduce:hover:scale-100
      ${getCardGlow(type)}
      glass-edge
    `}>
      <CardContent className="p-3">
        <div className={`grid gap-2 text-xs ${isCommonItems ? 'grid-cols-3' : 'grid-cols-3'}`}>
          <div className="text-center group">
            <div className={`font-bold text-lg ${getOddsGradient(stats.totalDropRate * 100)} 
              transition-all duration-300 group-hover:scale-110 motion-reduce:group-hover:scale-100`}>
              {formatPercentage(stats.totalDropRate * 100)}
            </div>
            <div className="text-gray-700 text-xs font-medium">{categoryLabel} Drop Odds</div>
          </div>
          
          <div className="text-center group">
            <div className={`font-bold text-lg ${getEVGradient(stats.evContribution)}
              transition-all duration-300 group-hover:scale-110 motion-reduce:group-hover:scale-100 drop-shadow-sm`}>
              {stats.evContribution.toFixed(1)}%
            </div>
            <div className="text-gray-700 text-xs font-medium">{categoryLabel} EV Share</div>
          </div>
          
          <div className="text-center group">
            <div className={`font-bold text-lg ${getRatioGradient(stats.oddsToEvRatio)}
              transition-all duration-300 group-hover:scale-110 motion-reduce:group-hover:scale-100 drop-shadow-sm`}>
              {formatRatio(stats.oddsToEvRatio)}
            </div>
            <div className="text-gray-700 text-xs font-medium">Odds/EV Ratio</div>
          </div>
        </div>
        
        {stats.itemCount > 0 && (
          <div className="mt-3 pt-2 border-t border-white/10">
            <div className="text-center text-xs text-gray-700">
              <span className="font-medium">{categoryLabel} Value Range: <span className="text-gray-900">{formatCompactCurrency(stats.minValue)} <span className="text-gray-700">-</span> {formatCompactCurrency(stats.maxValue)}</span></span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CategoryStatsCard;
