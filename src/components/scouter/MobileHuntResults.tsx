
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronRight, DollarSign, Target, Zap, Trophy, Medal, Award, X, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { HuntResult } from '@/types';
import { calculateExpectedMoneyLeftRange, formatDropChance } from '@/utils/huntCalculations';

interface MobileHuntResultsProps {
  huntResults: HuntResult[];
  selectedItem: string;
  onClearSearch: () => void;
}

const MobileHuntResults: React.FC<MobileHuntResultsProps> = ({
  huntResults,
  selectedItem,
  onClearSearch
}) => {
  const [expandedCards, setExpandedCards] = useState<Set<number>>(new Set());

  const toggleCardDetails = (index: number) => {
    const newExpanded = new Set(expandedCards);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedCards(newExpanded);
  };

  const getRankingIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-4 w-4 text-yellow-500" />;
      case 2:
        return <Medal className="h-4 w-4 text-gray-400" />;
      case 3:
        return <Award className="h-4 w-4 text-amber-600" />;
      default:
        return <div className="w-4 h-4 rounded-full bg-gray-300 flex items-center justify-center text-white font-bold text-xs">{rank}</div>;
    }
  };

  const getRankBadge = (rank: number) => {
    const badges = {
      1: { text: 'BEST', class: 'bg-green-500 text-white' },
      2: { text: 'GOOD', class: 'bg-blue-500 text-white' },
      3: { text: 'FAIR', class: 'bg-orange-500 text-white' },
    };
    
    const badge = badges[rank as keyof typeof badges] || { text: `#${rank}`, class: 'bg-gray-500 text-white' };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-bold ${badge.class}`}>
        {badge.text}
      </span>
    );
  };

  const getProfitProbability = (result: HuntResult) => {
    const moneyLeftRange = calculateExpectedMoneyLeftRange(result.box, result.targetItem, result.targetingCost);
    return moneyLeftRange.profitProbability;
  };

  return (
    <>
      <div className="space-y-3">
        {huntResults.slice(0, 5).map((result, index) => {
          const boxesNeeded = Math.ceil(100 / result.targetItem.drop_chance);
          const profitProbability = getProfitProbability(result);
          const dropChanceData = formatDropChance(result.targetItem.drop_chance);
          const moneyLeftRange = calculateExpectedMoneyLeftRange(result.box, result.targetItem, result.targetingCost);
          const isCardExpanded = expandedCards.has(index);

          return (
            <Card key={index} className="hunt-card hover:shadow-md transition-all overflow-hidden border border-gray-200">
              <CardContent className="p-3">
                {/* Header with Rank and Box Info */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex flex-col items-center gap-1 flex-shrink-0">
                    {getRankingIcon(result.rank)}
                    {getRankBadge(result.rank)}
                  </div>
                  
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <img 
                      src={result.box.box_image || 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=60&h=60&fit=crop'}
                      alt={result.box.box_name}
                      className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-sm text-gray-800 leading-tight mb-1">
                        {result.box.box_name}
                      </h3>
                      <p className="text-xs text-gray-600">${result.box.box_price} per box</p>
                    </div>
                  </div>
                </div>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-3 gap-2 mb-3">
                  <div className="text-center p-2 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <DollarSign className="h-3 w-3 text-gray-600" />
                      <span className="text-xs text-gray-600 font-medium">Cost</span>
                    </div>
                    <div className="text-xs font-bold text-gray-800">
                      ${Math.round(result.targetingCost).toLocaleString()}
                    </div>
                  </div>
                  
                  <div className="text-center p-2 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Target className="h-3 w-3 text-gray-600" />
                      <span className="text-xs text-gray-600 font-medium">Chance</span>
                    </div>
                    <div className="text-xs font-bold text-gray-800">
                      {dropChanceData.percentage}
                    </div>
                  </div>
                  
                  <div className="text-center p-2 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-center gap-1 mb-1">
                      <Zap className="h-3 w-3 text-gray-600" />
                      <span className="text-xs text-gray-600 font-medium">Profit</span>
                    </div>
                    <div className={`text-xs font-bold ${profitProbability > 50 ? 'text-green-600' : profitProbability > 25 ? 'text-yellow-600' : 'text-red-600'}`}>
                      {profitProbability}%
                    </div>
                  </div>
                </div>

                {/* Expected Money Left Display */}
                <div className="bg-blue-50 p-2 rounded-lg border border-blue-200 mb-3">
                  <div className="flex items-center gap-1 mb-1">
                    <DollarSign className="h-3 w-3 text-blue-600" />
                    <span className="text-xs text-blue-700 font-medium">Expected Money Left</span>
                    <TooltipProvider delayDuration={0}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Info className="h-2 w-2 text-blue-400 cursor-help" />
                        </TooltipTrigger>
                        <TooltipContent side="top" className="max-w-xs p-2">
                          <p className="text-xs">Money remaining after winning the item, considering volatility.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <div className="text-sm font-bold">
                    <span className={moneyLeftRange.low >= 0 ? 'text-green-600' : 'text-red-600'}>
                      {moneyLeftRange.low >= 0 ? '+' : ''}${moneyLeftRange.low.toLocaleString()}
                    </span>
                    <span className="text-gray-500 mx-1">to</span>
                    <span className={moneyLeftRange.high >= 0 ? 'text-green-600' : 'text-red-600'}>
                      {moneyLeftRange.high >= 0 ? '+' : ''}${moneyLeftRange.high.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Expandable Details */}
                <Button
                  variant="ghost"
                  onClick={() => toggleCardDetails(index)}
                  className="w-full justify-between text-xs text-gray-600 hover:text-gray-800 h-10 px-0"
                >
                  <span>{isCardExpanded ? 'Hide Details' : 'Show Details'}</span>
                  <ChevronRight className={`h-4 w-4 transition-transform ${isCardExpanded ? 'rotate-90' : ''}`} />
                </Button>

                {isCardExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-3 pt-3 border-t border-gray-200 space-y-3"
                  >
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <span className="text-gray-600 block mb-1">Boxes Needed:</span>
                        <div className="font-semibold text-gray-800">~{boxesNeeded.toLocaleString()}</div>
                      </div>
                      <div>
                        <span className="text-gray-600 block mb-1">Drop Rate:</span>
                        <div className="font-semibold text-gray-800">{dropChanceData.ratio}</div>
                      </div>
                    </div>
                    
                    <div className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                      <div className="text-xs text-blue-700 mb-1 font-medium">Statistical Analysis</div>
                      <div className="text-xs text-blue-800 leading-relaxed">
                        This box has a <strong>{profitProbability}%</strong> statistical probability of being profitable when hunting for this item, based on box value distribution and volatility.
                      </div>
                    </div>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Floating Clear Button for Mobile */}
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={onClearSearch}
          className="bg-purple-600 hover:bg-purple-700 text-white rounded-full shadow-lg w-14 h-14 p-0"
          size="icon"
        >
          <X className="h-5 w-5" />
        </Button>
      </div>
    </>
  );
};

export default MobileHuntResults;
