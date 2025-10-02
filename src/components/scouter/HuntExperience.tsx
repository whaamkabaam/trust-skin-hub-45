import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Target, Search, Trophy, Medal, Award, DollarSign, Zap, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useIsMobile } from '@/hooks/use-mobile';
import ItemSearchInput from './ItemSearchInput';
import TargetItemDisplay from './TargetItemDisplay';
import MobileHuntResults from './MobileHuntResults';
import { HuntResult } from '@/types';
import { calculateExpectedMoneyLeftRange, formatDropChance } from '@/utils/huntCalculations';

interface HuntExperienceProps {
  searchQuery: string;
  searchResults: string[];
  selectedItem: string;
  huntResults: HuntResult[];
  onSearchChange: (query: string) => void;
  onItemSelect: (item: string) => void;
  onClearSearch: () => void;
  getItemImage: (itemName: string) => string;
}

const HuntExperience: React.FC<HuntExperienceProps> = ({
  searchQuery,
  searchResults,
  selectedItem,
  huntResults,
  onSearchChange,
  onItemSelect,
  onClearSearch,
  getItemImage
}) => {
  const isMobile = useIsMobile();

  const getRankingIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-6 w-6 text-yellow-500" />;
      case 2:
        return <Medal className="h-6 w-6 text-gray-400" />;
      case 3:
        return <Award className="h-6 w-6 text-amber-600" />;
      default:
        return <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-white font-bold text-sm">{rank}</div>;
    }
  };

  const getRankBadge = (rank: number) => {
    const badges = {
      1: { text: 'BEST DEAL', class: 'bg-green-500 text-white' },
      2: { text: 'GOOD', class: 'bg-blue-500 text-white' },
      3: { text: 'FAIR', class: 'bg-orange-500 text-white' },
    };
    
    const badge = badges[rank as keyof typeof badges] || { text: `#${rank}`, class: 'bg-gray-500 text-white' };
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-bold ${badge.class}`}>
        {badge.text}
      </span>
    );
  };

  const getProfitProbability = (result: HuntResult) => {
    const moneyLeftRange = calculateExpectedMoneyLeftRange(result.box, result.targetItem, result.targetingCost);
    return moneyLeftRange.profitProbability;
  };

  console.log('HuntExperience render:', {
    searchQuery,
    searchResultsCount: searchResults.length,
    selectedItem,
    huntResultsCount: huntResults.length,
    isMobile
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="mb-8"
    >
      <Card className="glass-edge border-purple-200/50 shadow-lg overflow-hidden">
        <CardContent className="p-0">
          {/* Hunt Header */}
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border-b border-purple-200/50">
            <div className={`${isMobile ? 'p-4' : 'p-6'} text-center space-y-3`}>
              <div className="flex items-center justify-center gap-3">
                <div className={`${isMobile ? 'p-2' : 'p-3'} bg-purple-100 rounded-full`}>
                  <Target className={`${isMobile ? 'h-5 w-5' : 'h-6 w-6'} text-purple-600`} />
                </div>
                <div>
                  <h2 className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold text-gray-800`}>
                    Item Hunter
                  </h2>
                  <p className={`text-gray-600 ${isMobile ? 'text-xs' : 'text-sm'}`}>
                    Find the most cost-effective boxes to win any specific item
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Search Section - Container for dropdown */}
          <div className={`${isMobile ? 'p-4' : 'p-6'} border-b border-gray-100 relative`}>
            <ItemSearchInput
              searchQuery={searchQuery}
              searchResults={searchResults}
              onSearchChange={onSearchChange}
              onItemSelect={onItemSelect}
              onClearSearch={onClearSearch}
            />
          </div>

          {/* Target Item Section */}
          {selectedItem && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="border-b border-gray-100"
            >
              <div className={`${isMobile ? 'p-4' : 'p-6'}`}>
                <TargetItemDisplay
                  selectedItem={selectedItem}
                  itemImage={getItemImage(selectedItem)}
                />
              </div>
            </motion.div>
          )}

          {/* Hunt Results Section */}
          {huntResults.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
              className={`${isMobile ? 'p-4' : 'p-6'}`}
            >
              <div className="mb-4">
                <h3 className={`${isMobile ? 'text-base' : 'text-lg'} font-bold text-gray-800 mb-2`}>
                  Hunt Analysis Results
                </h3>
                <p className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-600`}>
                  Ranked by cost-effectiveness for winning "{selectedItem}"
                </p>
              </div>
              
              {isMobile ? (
                <MobileHuntResults 
                  huntResults={huntResults}
                  selectedItem={selectedItem}
                  onClearSearch={onClearSearch}
                />
              ) : (
                <div className="space-y-6">
                  {huntResults.slice(0, 5).map((result, index) => {
                    const boxesNeeded = Math.ceil(100 / result.targetItem.drop_chance);
                    const profitProbability = getProfitProbability(result);
                    const dropChanceData = formatDropChance(result.targetItem.drop_chance);
                    const moneyLeftRange = calculateExpectedMoneyLeftRange(result.box, result.targetItem, result.targetingCost);
                    
                    return (
                      <Card key={index} className="hunt-card hover:shadow-lg transition-all border border-gray-200">
                        <CardContent className="p-6">
                          <div className="flex items-start gap-6">
                            {/* Rank Section */}
                            <div className="flex flex-col items-center gap-3 flex-shrink-0">
                              <div className="flex items-center justify-center">
                                {getRankingIcon(result.rank)}
                              </div>
                              {getRankBadge(result.rank)}
                              <div className="relative p-2 bg-white rounded-xl shadow-sm">
                                <img 
                                  src={result.box.box_image || 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=120&h=120&fit=crop'}
                                  alt={result.box.box_name}
                                  className="w-20 h-20 rounded-lg object-cover"
                                />
                              </div>
                            </div>
                            
                            {/* Main Content */}
                            <div className="flex-1 min-w-0">
                              {/* Box Info Header */}
                              <div className="mb-4">
                                <h4 className="font-bold text-xl text-gray-800 mb-1">{result.box.box_name}</h4>
                                <p className="text-sm text-gray-600">
                                  Box Price: <span className="font-semibold">${result.box.box_price.toLocaleString()}</span>
                                </p>
                              </div>
                              
                              {/* Key Metrics Grid */}
                              <div className="grid grid-cols-3 gap-4 mb-4">
                                <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
                                  <div className="flex items-center gap-2 mb-2">
                                    <DollarSign className="h-4 w-4 text-green-600" />
                                    <span className="text-sm font-medium text-green-700">Expected Cost</span>
                                  </div>
                                  <div className="text-2xl font-bold text-green-800">
                                    ${Math.round(result.targetingCost).toLocaleString()}
                                  </div>
                                  <div className="text-xs text-green-600 mt-1">
                                    to win this item
                                  </div>
                                </div>
                                
                                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
                                  <div className="flex items-center gap-2 mb-2">
                                    <Target className="h-4 w-4 text-blue-600" />
                                    <span className="text-sm font-medium text-blue-700">Drop Chance</span>
                                  </div>
                                  <div className="text-2xl font-bold text-blue-800">
                                    {dropChanceData.percentage}
                                  </div>
                                  <div className="text-xs text-blue-600 mt-1">
                                    {dropChanceData.ratio}
                                  </div>
                                </div>
                                
                                <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
                                  <div className="flex items-center gap-2 mb-2">
                                    <Zap className="h-4 w-4 text-purple-600" />
                                    <span className="text-sm font-medium text-purple-700">Profit Chance</span>
                                    <TooltipProvider delayDuration={0}>
                                      <Tooltip>
                                        <TooltipTrigger asChild>
                                          <Info className="h-3 w-3 text-purple-400 cursor-help" />
                                        </TooltipTrigger>
                                        <TooltipContent side="top" className="max-w-xs p-3">
                                          <p className="text-xs">Statistical probability that hunting for this item will be profitable, considering box value distribution and targeting cost.</p>
                                        </TooltipContent>
                                      </Tooltip>
                                    </TooltipProvider>
                                  </div>
                                  <div className={`text-2xl font-bold ${
                                    profitProbability > 50 ? 'text-green-600' : 
                                    profitProbability > 25 ? 'text-yellow-600' : 'text-red-600'
                                  }`}>
                                    {profitProbability}%
                                  </div>
                                  <div className="text-xs text-purple-600 mt-1">
                                    profitability estimate
                                  </div>
                                </div>
                              </div>
                              
                              {/* Expected Money Left Section */}
                              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
                                <div className="flex items-center gap-2 mb-3">
                                  <DollarSign className="h-4 w-4 text-gray-600" />
                                  <span className="font-semibold text-gray-800">Expected Money Left</span>
                                  <TooltipProvider delayDuration={0}>
                                    <Tooltip>
                                      <TooltipTrigger asChild>
                                        <Info className="h-3 w-3 text-gray-400 cursor-help" />
                                      </TooltipTrigger>
                                      <TooltipContent side="top" className="max-w-xs p-3">
                                        <p className="text-xs">Expected money remaining after successfully obtaining the target item, accounting for volatility and practical limitations.</p>
                                      </TooltipContent>
                                    </Tooltip>
                                  </TooltipProvider>
                                </div>
                                <div className="text-lg font-bold">
                                  <span className={moneyLeftRange.low >= 0 ? 'text-green-600' : 'text-red-600'}>
                                    {moneyLeftRange.low >= 0 ? '+' : ''}${moneyLeftRange.low.toLocaleString()}
                                  </span>
                                  <span className="text-gray-500 mx-2">to</span>
                                  <span className={moneyLeftRange.high >= 0 ? 'text-green-600' : 'text-red-600'}>
                                    {moneyLeftRange.high >= 0 ? '+' : ''}${moneyLeftRange.high.toLocaleString()}
                                  </span>
                                </div>
                                <div className="text-xs text-gray-600 mt-1">
                                  Range accounts for box value volatility
                                </div>
                              </div>
                              
                              {/* Analysis Details */}
                              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                <h5 className="font-semibold text-gray-800 mb-3">Hunt Analysis</h5>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                  <div>
                                    <span className="text-gray-600">Expected Boxes Needed:</span>
                                    <div className="font-bold text-gray-800 text-lg">~{boxesNeeded.toLocaleString()}</div>
                                  </div>
                                  <div>
                                    <span className="text-gray-600">Actual Cost Range:</span>
                                    <div className="font-bold text-gray-800 text-lg">
                                      ${moneyLeftRange.costRange.low.toLocaleString()} - ${moneyLeftRange.costRange.high.toLocaleString()}
                                    </div>
                                    <div className="text-xs text-gray-500 mt-1">
                                      Based on probability distribution
                                    </div>
                                  </div>
                                </div>
                                <div className="mt-3 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                                  <div className="text-xs text-blue-700 mb-1 font-medium">💡 Strategy Tip</div>
                                  <div className="text-sm text-blue-800">
                                    {result.rank === 1 ? 
                                      "This is your best option! Highest chance of cost-effective success." :
                                      result.rank <= 3 ?
                                      "Good alternative with reasonable cost-effectiveness." :
                                      "Consider this option only if top choices aren't available."
                                    }
                                    {profitProbability < 25 && " Note: Low profit probability - consider if this hunt is worth the risk."}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}

              {/* Clear Hunt Button - Desktop only */}
              {!isMobile && (
                <div className="mt-6 pt-4 border-t border-gray-200 text-center">
                  <button
                    onClick={onClearSearch}
                    className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors"
                  >
                    Clear Hunt
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {/* Empty State */}
          {!selectedItem && !searchQuery && (
            <div className={`${isMobile ? 'p-6' : 'p-8'} text-center`}>
              <div className={`p-4 bg-gray-50 rounded-full ${isMobile ? 'w-12 h-12' : 'w-16 h-16'} mx-auto mb-4 flex items-center justify-center`}>
                <Search className={`${isMobile ? 'h-6 w-6' : 'h-8 w-8'} text-gray-400`} />
              </div>
              <h3 className={`${isMobile ? 'text-base' : 'text-lg'} font-medium text-gray-800 mb-2`}>Start Your Hunt</h3>
              <p className={`text-gray-600 ${isMobile ? 'text-sm' : 'text-sm'}`}>
                Search for any item above to find the best boxes to win it cost-effectively
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default HuntExperience;
