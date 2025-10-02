import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Trophy, Medal, Award, ChevronDown, Info, ChevronRight, DollarSign, Target, Zap } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useIsMobile } from '@/hooks/use-mobile';
import { HuntResult } from '@/types';
import { calculateExpectedMoneyLeftRange, formatDropChance, getCostIndicator, getRangeColor } from '@/utils/huntCalculations';

interface HuntResultsProps {
  huntResults: HuntResult[];
  selectedItem: string;
  onClearHunt: () => void;
}

const HuntResults: React.FC<HuntResultsProps> = ({
  huntResults,
  selectedItem,
  onClearHunt
}) => {
  const isMobile = useIsMobile();
  const [isExpanded, setIsExpanded] = useState(!isMobile);
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
      <span className={`px-2 py-1 rounded-full text-xs font-bold ${badge.class}`}>
        {badge.text}
      </span>
    );
  };

  const getBreakEvenChance = (result: HuntResult) => {
    const moneyLeftRange = calculateExpectedMoneyLeftRange(result.box, result.targetItem, result.targetingCost);
    return moneyLeftRange.profitProbability;
  };

  if (huntResults.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      <Collapsible open={isExpanded} onOpenChange={setIsExpanded}>
        <div className={`${isMobile ? 'space-y-4' : 'flex items-center justify-between'} mb-6`}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="flex items-center gap-2 p-0 h-auto min-h-[44px]">
              <h2 className={`${isMobile ? 'text-lg' : 'text-2xl'} font-bold text-gray-800 ${isMobile ? 'break-words' : ''}`}>
                Hunt Report for "{selectedItem.length > 20 && isMobile ? `${selectedItem.substring(0, 20)}...` : selectedItem}"
              </h2>
              <ChevronDown className={`h-5 w-5 text-gray-600 transition-transform ${isExpanded ? 'rotate-180' : ''} flex-shrink-0`} />
            </Button>
          </CollapsibleTrigger>
          
          {isMobile ? (
            <div className="fixed bottom-6 right-6 z-50">
              <Button
                onClick={onClearHunt}
                className="bg-purple-600 hover:bg-purple-700 text-white rounded-full shadow-lg min-h-[56px] min-w-[56px] p-3"
                size="icon"
              >
                ✕
              </Button>
            </div>
          ) : (
            <Button
              variant="outline"
              onClick={onClearHunt}
              className="border-purple-300 hover:bg-purple-50 hover:border-purple-400 min-h-[44px]"
            >
              Clear Hunt
            </Button>
          )}
        </div>

        <CollapsibleContent className="space-y-4">
          {huntResults.slice(0, 5).map((result, index) => {
            const { formattedCost, colorClass, indicator } = getCostIndicator(result.targetingCost);
            const { percentage } = formatDropChance(result.targetItem.drop_chance);
            const boxesNeeded = Math.ceil(100 / result.targetItem.drop_chance);
            const breakEvenChance = getBreakEvenChance(result);
            const isCardExpanded = expandedCards.has(index);

            if (isMobile) {
              return (
                <Card key={index} className="hunt-card hover:shadow-lg transition-all overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex flex-col items-center gap-2">
                        {getRankingIcon(result.rank)}
                        {getRankBadge(result.rank)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3">
                          <img 
                            src={result.box.box_image || 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=60&h=60&fit=crop'}
                            alt={result.box.box_name}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-base text-gray-800 truncate">{result.box.box_name}</h3>
                            <p className="text-sm text-gray-600">${result.box.box_price} per box</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3 mb-4">
                      <div className="text-center p-2 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <DollarSign className="h-3 w-3 text-gray-600" />
                          <span className="text-xs text-gray-600 font-medium">Cost</span>
                        </div>
                        <div className="text-sm font-bold text-gray-800">{formattedCost}</div>
                      </div>
                      
                      <div className="text-center p-2 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <Target className="h-3 w-3 text-gray-600" />
                          <span className="text-xs text-gray-600 font-medium">Chance</span>
                        </div>
                        <div className="text-sm font-bold text-gray-800">{percentage}</div>
                      </div>
                      
                      <div className="text-center p-2 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-center gap-1 mb-1">
                          <Zap className="h-3 w-3 text-gray-600" />
                          <span className="text-xs text-gray-600 font-medium">Profit</span>
                        </div>
                        <div className={`text-sm font-bold ${breakEvenChance > 40 ? 'text-green-600' : breakEvenChance > 20 ? 'text-yellow-600' : 'text-red-600'}`}>
                          {breakEvenChance}%
                        </div>
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      onClick={() => toggleCardDetails(index)}
                      className="w-full justify-between text-sm text-gray-600 hover:text-gray-800 h-10"
                    >
                      <span>{isCardExpanded ? 'Hide Details' : 'Show Details'}</span>
                      <ChevronRight className={`h-4 w-4 transition-transform ${isCardExpanded ? 'rotate-90' : ''}`} />
                    </Button>

                    {isCardExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 pt-4 border-t border-gray-200 space-y-3"
                      >
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <span className="text-gray-600">Boxes Needed:</span>
                            <div className="font-semibold">~{boxesNeeded.toLocaleString()}</div>
                          </div>
                          <div>
                            <span className="text-gray-600">Drop Rate:</span>
                            <div className="font-semibold">1 in {boxesNeeded.toLocaleString()}</div>
                          </div>
                        </div>
                        
                        <div className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
                          <div className="text-xs text-blue-700 mb-1">Expected Value Analysis</div>
                          <div className="text-sm text-blue-800">
                            This box has a <strong>{breakEvenChance}%</strong> chance of being profitable when hunting for this item.
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              );
            } else {
              const moneyLeftRange = calculateExpectedMoneyLeftRange(result.box, result.targetItem, result.targetingCost);
              const rangeColor = getRangeColor(moneyLeftRange.low, moneyLeftRange.high, moneyLeftRange.profitProbability);
              
              return (
                <Card key={index} className="hunt-card hover:shadow-lg transition-all">
                  <CardContent className="p-6 relative z-10">
                    <div className="flex items-start gap-6">
                      <div className="flex flex-col items-center gap-3 flex-shrink-0">
                        <div className="flex items-center justify-center min-w-[44px] min-h-[44px]">
                          {getRankingIcon(result.rank)}
                        </div>
                        <div className="text-xs text-gray-500 font-medium">
                          {result.rank === 1 ? 'Best' : result.rank === 2 ? '2nd' : result.rank === 3 ? '3rd' : `${result.rank}th`}
                        </div>
                        <div className="relative p-2 bg-white rounded-xl shadow-sm overflow-hidden">
                          <img 
                            src={result.box.box_image || 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=120&h=120&fit=crop'}
                            alt={result.box.box_name}
                            className="w-20 h-20 rounded-lg object-cover relative z-10"
                          />
                        </div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="mb-4">
                          <div className="font-bold text-lg text-gray-800 mb-1">{result.box.box_name}</div>
                          <div className="text-sm text-gray-600">
                            Box Price: <span className="font-semibold">${result.box.box_price}</span>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-6 mb-4">
                          <div className={`p-4 rounded-lg border ${rangeColor.bgClass}`}>
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-sm font-medium text-gray-700">Expected Money Left</span>
                              <TooltipProvider delayDuration={0}>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <div className="min-w-[44px] min-h-[44px] flex items-center justify-center cursor-help">
                                      <Info className="h-4 w-4 text-gray-400 hover:text-indigo-500" />
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent side="top" className="max-w-sm p-4 z-50">
                                    <div className="space-y-2">
                                      <div className="font-semibold text-indigo-600">Scale-Adjusted Range</div>
                                      <p className="text-sm">This range accounts for volatility and practical limitations.</p>
                                    </div>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                            <div className="text-lg font-bold">
                              <span className={moneyLeftRange.low >= 0 ? 'text-green-600' : 'text-red-600'}>
                                {moneyLeftRange.low >= 0 ? '+' : ''}${moneyLeftRange.low.toLocaleString()}
                              </span>
                              <span className="text-gray-500 mx-1">to</span>
                              <span className={moneyLeftRange.high >= 0 ? 'text-green-600' : 'text-red-600'}>
                                {moneyLeftRange.high >= 0 ? '+' : ''}${moneyLeftRange.high.toLocaleString()}
                              </span>
                            </div>
                          </div>
                          
                          <div className="bg-gray-50 p-3 rounded-lg">
                            <span className="text-sm font-medium text-gray-700 block mb-2">Expected Cost to Win</span>
                            <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-full text-sm font-bold border ${colorClass} min-h-[44px]`}>
                              {indicator} {formattedCost}
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-blue-50 p-3 rounded-lg border-l-4 border-blue-400">
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-blue-700 font-medium">Drop Chance:</span>
                              <div className="font-bold text-blue-800 text-lg">{percentage}</div>
                            </div>
                            <div>
                              <span className="text-blue-700 font-medium">Avg. Boxes Needed:</span>
                              <div className="font-bold text-blue-800 text-lg">~{boxesNeeded.toLocaleString()}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            }
          })}
        </CollapsibleContent>
      </Collapsible>
    </motion.div>
  );
};

export default HuntResults;
