import React, { useState, useMemo } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, AlertTriangle, HelpCircle, ExternalLink } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { calculateCategoryStats, calculateLossChance } from '@/utils/boxStatistics';
import CategoryStatsCard from '../CategoryStatsCard';
import { useIsMobile } from '@/hooks/use-mobile';
import { formatBoxPrice, formatCurrency } from '@/utils/priceFormatter';
import { ScrollableContainer } from '@/components/ui/ScrollableContainer';
import ProviderLogo from '../ui/ProviderLogo';
import { PROVIDER_CONFIGS } from '@/types/filters';

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
  provider?: string;
}

interface BoxDetailContentProps {
  box: RillaBoxMetricsBox;
}

// Helper function to capitalize first letter
const capitalizeFirstLetter = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const BoxDetailContent: React.FC<BoxDetailContentProps> = ({ box }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const isMobile = useIsMobile();

  // Provider link mapping
  const providerLinks: Record<string, string> = {
    'hypedrop': 'https://unpacked.gg/go/hypedrop',
    'rillabox': 'https://unpacked.gg/go/rillabox',
    'casesgg': 'https://unpacked.gg/go/cases-gg',
    'luxdrop': 'https://unpacked.gg/go/luxdrop'
  };

  // Review link mapping
  const providerReviewLinks: Record<string, string> = {
    'hypedrop': 'https://unpacked.gg/mystery-boxes/hypedrop-review/',
    'rillabox': 'https://unpacked.gg/mystery-boxes/rillabox-review/',
    'casesgg': 'https://unpacked.gg/mystery-boxes/cases-gg-review/',
    'luxdrop': 'https://unpacked.gg/mystery-boxes/luxdrop-review/'
  };

  // Enhanced volatility color coding - purple theme with risk levels
  const getVolatilityColor = (volatilityPercent: number) => {
    if (volatilityPercent >= 80) return 'border-purple-600 bg-purple-50/80 text-purple-700';
    if (volatilityPercent >= 50) return 'border-purple-500 bg-purple-50/60 text-purple-600';
    if (volatilityPercent >= 20) return 'border-purple-400 bg-purple-50/40 text-purple-500';
    return 'border-purple-300 bg-purple-50/20 text-purple-400';
  };

  // Enhanced volatility gradient - purple theme with risk levels
  const getVolatilityGradient = (volatilityPercent: number) => {
    if (volatilityPercent >= 80) return 'text-purple-700 font-bold';
    if (volatilityPercent >= 50) return 'text-purple-600 font-bold';
    if (volatilityPercent >= 20) return 'text-purple-500 font-bold';
    return 'text-purple-400 font-bold';
  };

  // Enhanced floor rate color coding - green for high (good), red for low (bad) (solid colors)
  const getFloorRateColor = (floorRate: number) => {
    if (floorRate >= 80) return 'text-green-600 font-bold';
    if (floorRate >= 60) return 'text-green-500 font-bold';
    if (floorRate >= 40) return 'text-orange-500 font-bold';
    if (floorRate >= 20) return 'text-red-500 font-bold';
    return 'text-red-600 font-bold';
  };

  // Enhanced EV gradient - green for high (good), red for low (bad) (solid colors)
  const getEVGradient = (ev: number) => {
    if (ev > 100) return 'text-green-600 font-bold';
    if (ev > 75) return 'text-green-500 font-bold';
    if (ev > 50) return 'text-orange-500 font-bold';
    return 'text-red-600 font-bold';
  };

  const formatDropRate = (dropChance: number) => {
    if (!dropChance || isNaN(dropChance)) return '0%';
    
    const percentage = dropChance * 100;
    
    let formattedValue;
    if (percentage >= 1) {
      formattedValue = percentage.toFixed(1);
    } else if (percentage >= 0.1) {
      formattedValue = percentage.toFixed(2);
    } else if (percentage >= 0.01) {
      formattedValue = percentage.toFixed(3);
    } else if (percentage >= 0.001) {
      formattedValue = percentage.toFixed(4);
    } else if (percentage >= 0.0001) {
      formattedValue = percentage.toFixed(5);
    } else {
      formattedValue = percentage.toFixed(6);
    }
    
    formattedValue = parseFloat(formattedValue).toString();
    return `${formattedValue}%`;
  };

  const volatilityPercent = box.standard_deviation_percent || 0;
  
  // Use database floor_rate_percent as the authoritative source
  const floorPercent = box.floor_rate_percent || 0;

  // Sort all items by drop rate first (ascending - lowest first), then by value (descending)
  const sortedAllItems = useMemo(() => {
    return [...box.all_items].sort((a, b) => {
      if (a.drop_chance !== b.drop_chance) {
        return a.drop_chance - b.drop_chance;
      }
      return b.value - a.value;
    });
  }, [box.all_items]);

  // Create properly filtered jackpot and common items
  const topJackpotItems = useMemo(() => {
    return [...box.all_items]
      .sort((a, b) => a.drop_chance - b.drop_chance) // Lowest drop chance first (rarest)
      .slice(0, 3);
  }, [box.all_items]);

  const topCommonItems = useMemo(() => {
    return [...box.all_items]
      .sort((a, b) => b.drop_chance - a.drop_chance) // Highest drop chance first (most common)
      .slice(0, 3);
  }, [box.all_items]);

  // Calculate statistics for each category
  const jackpotStats = useMemo(() => 
    calculateCategoryStats(topJackpotItems, box.box_price), 
    [topJackpotItems, box.box_price]
  );
  
  const commonStats = useMemo(() => 
    calculateCategoryStats(topCommonItems, box.box_price), 
    [topCommonItems, box.box_price]
  );

  const lossChance = useMemo(() => 
    calculateLossChance(box.all_items, box.box_price), 
    [box.all_items, box.box_price]
  );

  return (
    <TooltipProvider delayDuration={0}>
      <div className="space-y-6">
        {/* Header with Provider and Review */}
        <div className="text-center space-y-4">
          <h1 className={`${isMobile ? 'text-2xl' : 'text-4xl'} font-bold text-gray-800`}>
            {box.box_name}
          </h1>
          
          {/* Provider and Review buttons */}
          <div className={`flex items-center justify-center gap-3 ${isMobile ? 'flex-col' : 'flex-row'}`}>
            <button
              onClick={() => window.open(providerLinks[box.provider || 'rillabox'], '_blank')}
              className="flex items-center gap-2 hover:bg-white/10 p-2 rounded-lg transition-all duration-200 cursor-pointer group"
              title="Visit provider website"
            >
              <ProviderLogo 
                providerId={(box.provider || 'rillabox') as keyof typeof PROVIDER_CONFIGS} 
                size={isMobile ? 'sm' : 'md'}
                enhanced={true}
                className="transition-transform duration-200 hover:scale-[1.4] group-hover:scale-[1.2]"
              />
              <span className={`${isMobile ? 'text-lg' : 'text-xl'} font-bold text-purple-600 group-hover:text-purple-800 transition-colors duration-200`}>
                {PROVIDER_CONFIGS[(box.provider || 'rillabox') as keyof typeof PROVIDER_CONFIGS]?.displayName || 'RillaBox'}
              </span>
              <ExternalLink className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'} transform rotate-45 text-purple-600 group-hover:text-purple-800 group-hover:scale-110 transition-all duration-200`} />
            </button>
            
            <Button
              variant="outline"
              size={isMobile ? "sm" : "default"}
              onClick={() => window.open(providerReviewLinks[box.provider || 'rillabox'], '_blank')}
              className="gap-2 border-purple-300 text-purple-600 hover:bg-purple-50 hover:text-purple-800 hover:border-purple-400 transition-all duration-200"
            >
              <Star className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'}`} />
              <span className={isMobile ? 'text-sm' : 'text-base'}>Read Review</span>
              <ExternalLink className={`${isMobile ? 'h-3 w-3' : 'h-4 w-4'}`} />
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <div className={`grid ${isMobile ? 'grid-cols-1' : 'md:grid-cols-2'} ${isMobile ? 'gap-4' : 'gap-6'}`}>
          {/* Left side - Enhanced box info with proper pattern background */}
          <div className="space-y-4">
            <div 
              className={`w-full ${isMobile ? 'h-48' : 'h-64'} rounded-xl overflow-hidden p-4 shadow-lg border border-purple-200 relative cursor-pointer box-container-pattern`}
            >
              <div className="absolute inset-0 bg-white/70 backdrop-blur-[0.5px] rounded-xl z-10"></div>
              {!imageLoaded && <div className="w-full h-full bg-gray-200 animate-pulse rounded relative z-20" />}
              <img 
                src={box.box_image} 
                alt={box.box_name}
                className={`w-full h-full object-contain relative z-20 transition-transform duration-300 hover:scale-[1.02] transform-origin-center overflow-visible cursor-default ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                referrerPolicy="no-referrer"
                onLoad={() => setImageLoaded(true)}
                onError={(e) => {
                  console.warn('Box image failed to load:', e.currentTarget.src);
                }}
              />
            </div>
            
            <div className={`grid ${isMobile ? 'grid-cols-2' : 'grid-cols-3'} gap-4`}>
              <div className={`text-center ${isMobile ? 'p-3' : 'p-4'} rounded-xl shadow-lg border border-purple-200 bg-white`}>
                <div className={`${isMobile ? 'text-lg' : 'text-xl'} font-bold text-gray-800`}>
                  {formatBoxPrice(box.box_price)}
                </div>
                <div className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-600 font-medium`}>Mystery Box Price</div>
              </div>
              <div className={`text-center ${isMobile ? 'p-3' : 'p-4'} rounded-xl shadow-lg border border-purple-200 bg-white`}>
                <div className={`${isMobile ? 'text-lg' : 'text-xl'} ${getEVGradient(box.expected_value_percent_of_price)}`}>
                  {box.expected_value_percent_of_price.toFixed(1)}% (EV)
                </div>
                <div className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-600 font-medium flex items-center justify-center gap-1`}>
                  Expected Value
                  {!isMobile && (
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="h-3 w-3 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Statistical average return on investment</p>
                      </TooltipContent>
                    </Tooltip>
                  )}
                </div>
              </div>
              {!isMobile && (
                <div className="text-center p-4 rounded-xl shadow-lg border border-purple-200 bg-white">
                  <div className={`text-xl ${getVolatilityGradient(volatilityPercent)}`}>
                    {volatilityPercent.toFixed(1)}%
                  </div>
                  <div className="text-sm text-gray-600 font-medium flex items-center justify-center gap-1">
                    Volatility
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="h-3 w-3 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Measure of risk and unpredictability</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile volatility row */}
            {isMobile && (
              <div className="text-center p-3 rounded-xl shadow-lg border border-purple-200 bg-white">
                <div className={`text-lg ${getVolatilityGradient(volatilityPercent)}`}>
                  {volatilityPercent.toFixed(1)}% Volatility
                </div>
                <div className="text-xs text-gray-600 font-medium">Measure of risk and unpredictability</div>
              </div>
            )}

            {/* Tags and Floor Rate/Loss Chance row */}
            <div className={isMobile ? 'space-y-4' : 'flex gap-4'}>
              <div className={`${isMobile ? 'w-full' : 'flex-[2]'} ${isMobile ? 'p-3' : 'p-4'} rounded-xl shadow-lg border border-purple-200 flex flex-col bg-white`}>
                <h4 className={`${isMobile ? 'text-sm' : 'text-sm'} font-medium text-gray-700 mb-3`}>All Tags</h4>
                <ScrollableContainer
                  maxHeight={isMobile ? 'max-h-24' : 'max-h-36'}
                  className="w-full"
                  showIndicators={true}
                >
                  <div className={`${isMobile ? 'flex flex-wrap gap-2 px-1 pt-3' : 'grid grid-cols-2 gap-2 px-3 pt-3'}`}>
                    {box.tags.map(tag => (
                      <Badge 
                        key={tag} 
                        variant="outline" 
                        className={`bg-white border-purple-300 text-purple-700 ${isMobile ? 'text-xs px-2 py-1' : 'text-xs'} justify-center h-fit py-1.5`}
                      >
                        {capitalizeFirstLetter(tag)}
                      </Badge>
                    ))}
                  </div>
                </ScrollableContainer>
              </div>
              
              <div className={`${isMobile ? 'grid grid-cols-2 gap-4' : 'flex flex-col gap-4 flex-1'}`}>
                <div className={`text-center ${isMobile ? 'p-3' : 'p-4'} rounded-xl shadow-lg border border-purple-200 bg-white`}>
                  <div className={`${isMobile ? 'text-base' : 'text-lg'} ${getFloorRateColor(floorPercent)}`}>
                    {floorPercent.toFixed(1)}%
                  </div>
                  <div className={`${isMobile ? 'text-xs' : 'text-xs'} text-gray-600 font-medium flex items-center justify-center gap-1`}>
                    Floor Rate
                    {!isMobile && (
                      <Tooltip>
                        <TooltipTrigger>
                          <HelpCircle className="h-3 w-3 text-gray-400" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Lowest item value as percentage of box price</p>
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </div>
                </div>
                <div className={`text-center ${isMobile ? 'p-3' : 'p-4'} rounded-xl shadow-lg border border-purple-200 bg-white`}>
                  <div className={`${isMobile ? 'text-base' : 'text-lg'} font-bold text-red-600`}>
                    {lossChance.toFixed(1)}%
                  </div>
                  <div className={`${isMobile ? 'text-xs' : 'text-xs'} text-gray-600 font-medium flex items-center justify-center gap-1`}>
                    Loss Chance
                    {!isMobile && (
                      <Tooltip>
                        <TooltipTrigger>
                          <HelpCircle className="h-3 w-3 text-gray-400" />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Probability of getting items worth less than box price</p>
                        </TooltipContent>
                      </Tooltip>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* All items list */}
            {sortedAllItems.length > 0 && (
              <div>
                <h3 className={`${isMobile ? 'text-base' : 'text-lg'} font-semibold mb-3 text-gray-800`}>All Items (by Drop Rate & Value)</h3>
                <ScrollableContainer
                  maxHeight={isMobile ? 'max-h-60' : 'max-h-80'}
                  className="space-y-2 bg-white/40 rounded-xl p-2"
                >
                  <div className="px-2 pt-3">
                    {sortedAllItems.slice(0, 50).map((item, i) => (
                      <div 
                        key={i} 
                        className={`flex items-center gap-2 p-2 bg-white/80 rounded border border-purple-200 mb-2
                                    ${isMobile ? 'text-xs min-h-[44px] hover:scale-[1.02]' 
                                               : 'text-sm hover:scale-[1.03]'}
                                    transition-transform origin-center relative z-10 overflow-visible cursor-pointer`}
                      >
                        <div className="flex-1 min-w-0">
                          <div className={`font-medium truncate text-gray-800 ${isMobile ? 'text-xs' : ''}`}>{item.name}</div>
                        </div>
                        <div className={`text-purple-600 font-mono ${isMobile ? 'text-xs' : 'text-xs'}`}>
                          {formatDropRate(item.drop_chance)}
                        </div>
                        <div className={`text-purple-600 font-semibold ${isMobile ? 'text-xs' : 'text-xs'} min-w-0`}>
                          {formatCurrency(item.value)}
                        </div>
                      </div>
                    ))}
                    {sortedAllItems.length > 50 && (
                      <div className={`text-center text-gray-500 ${isMobile ? 'text-xs' : 'text-sm'} py-2`}>
                        ...and {sortedAllItems.length - 50} more items
                      </div>
                    )}
                  </div>
                </ScrollableContainer>
              </div>
            )}
          </div>
          
          {/* Right side - Jackpot and Common items */}
          <div className="space-y-6">
            <div>
              <h3 className={`${isMobile ? 'text-base' : 'text-lg'} font-semibold mb-3 flex items-center gap-2 text-gray-800`}>
                <Star className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'} text-purple-500`} />
                Jackpot Items
                {!isMobile && (
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-4 w-4 text-gray-400" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>High-value items with rare drop rates</p>
                    </TooltipContent>
                  </Tooltip>
                )}
              </h3>
              
              <CategoryStatsCard 
                stats={jackpotStats} 
                title="Jackpot Items" 
                type="jackpot" 
              />
              
              <ScrollableContainer
                maxHeight={topJackpotItems.length <= 3 ? 'max-h-none' : (isMobile ? 'max-h-48' : 'max-h-60')}
                className="space-y-2 bg-white/40 rounded-xl p-2"
                showIndicators={topJackpotItems.length > 3}
              >
                <div className="px-2 pt-3">
                  {topJackpotItems && topJackpotItems.length > 0 ? (
                    topJackpotItems.map((item, i) => (
                      <div 
                        key={i} 
                        className={`flex items-center gap-2 p-2 bg-purple-50/80 rounded border border-purple-200 mb-2
                                    ${isMobile ? 'min-h-[44px] hover:scale-[1.02]' : 'hover:scale-[1.03]'}
                                    transition-transform origin-center relative z-10 overflow-visible cursor-pointer`}
                    >
                      <div className={`${isMobile ? 'w-10 h-10' : 'w-12 h-12'} bg-purple-100 rounded flex items-center justify-center flex-shrink-0 p-1`}>
                        {item.image ? (
                          <img 
                            src={item.image} 
                            alt={item.name}
                            className="w-full h-full object-contain rounded"
                            loading="lazy"
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              console.warn('Jackpot item image failed to load:', e.currentTarget.src);
                            }}
                          />
                        ) : (
                          <Star className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'} text-purple-500`} />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={`font-medium ${isMobile ? 'text-xs' : 'text-sm'} truncate text-gray-800`}>{item.name}</div>
                        <div className={`${isMobile ? 'text-xs' : 'text-xs'} text-purple-600 font-mono`}>
                          Drop Rate: {formatDropRate(item.drop_chance)}
                        </div>
                      </div>
                      <div className={`text-purple-600 font-semibold ${isMobile ? 'text-xs' : 'text-sm'}`}>
                        {formatCurrency(item.value)}
                      </div>
                    </div>
                  ))
                  ) : (
                    <div className={`text-gray-500 text-center py-4 ${isMobile ? 'text-sm' : ''}`}>No jackpot items available</div>
                  )}
                </div>
              </ScrollableContainer>
            </div>
            
            <div>
              <h3 className={`${isMobile ? 'text-base' : 'text-lg'} font-semibold mb-3 flex items-center gap-2 text-gray-800`}>
                <AlertTriangle className={`${isMobile ? 'h-4 w-4' : 'h-5 w-5'} text-red-500`} />
                Common Items
                {!isMobile && (
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-4 w-4 text-gray-400" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Frequently dropped items with lower values</p>
                    </TooltipContent>
                  </Tooltip>
                )}
              </h3>
              
              <CategoryStatsCard 
                stats={commonStats} 
                title="Common Items" 
                type="common" 
              />
              
              <ScrollableContainer
                maxHeight={topCommonItems.length <= 3 ? 'max-h-none' : (isMobile ? 'max-h-48' : 'max-h-60')}
                className="space-y-2 bg-white/40 rounded-xl p-2"
                showIndicators={topCommonItems.length > 3}
              >
                <div className="px-2 pt-3">
                  {topCommonItems && topCommonItems.length > 0 ? (
                    topCommonItems.map((item, i) => (
                      <div 
                        key={i} 
                        className={`flex items-center gap-2 p-2 bg-red-50/80 rounded border border-red-200 mb-2
                                    ${isMobile ? 'min-h-[44px] hover:scale-[1.02]' : 'hover:scale-[1.03]'}
                                    transition-transform origin-center relative z-10 overflow-visible cursor-pointer`}
                    >
                      <div className={`${isMobile ? 'w-10 h-10' : 'w-12 h-12'} bg-red-100 rounded flex items-center justify-center flex-shrink-0 p-1`}>
                        {item.image ? (
                          <img 
                            src={item.image} 
                            alt={item.name}
                            className="w-full h-full object-contain rounded"
                            loading="lazy"
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                              console.warn('Common item image failed to load:', e.currentTarget.src);
                            }}
                          />
                        ) : (
                          <AlertTriangle className={`${isMobile ? 'w-3 h-3' : 'w-4 h-4'} text-red-500`} />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={`font-medium ${isMobile ? 'text-xs' : 'text-sm'} truncate text-gray-800`}>{item.name}</div>
                        <div className={`${isMobile ? 'text-xs' : 'text-xs'} text-red-600 font-mono`}>
                          Drop Rate: {formatDropRate(item.drop_chance)}
                        </div>
                      </div>
                      <div className={`text-red-600 font-semibold ${isMobile ? 'text-xs' : 'text-sm'}`}>
                        {formatCurrency(item.value)}
                      </div>
                    </div>
                  ))
                  ) : (
                    <div className={`text-gray-500 text-center py-4 ${isMobile ? 'text-sm' : ''}`}>No common items available</div>
                  )}
                </div>
              </ScrollableContainer>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default BoxDetailContent;
