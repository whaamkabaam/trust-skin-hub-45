import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useNavigate } from 'react-router-dom';
import TagDots from './TagDots';
import ProviderLogo from './ui/ProviderLogo';
import { useScrollState } from '@/hooks/useScrollState';
import { PROVIDER_CONFIGS } from '@/types/filters';
import { 
  useMemoizedVolatilityColor, 
  useMemoizedEVGradient, 
  useMemoizedFloorRateColor 
} from '@/utils/memoizedCalculations';
import { formatBoxPrice } from '@/utils/priceFormatter';
import { generateSlug } from '@/utils/slugUtils';

export interface MysteryBoxData {
  box_name: string;
  box_price: number;
  box_image: string;
  expected_value_percent_of_price: number;
  volatility_bucket: 'Low' | 'Medium' | 'High';
  standard_deviation_percent: number;
  floor_rate_percent: number;
  category: string;
  tags: string[];
  provider?: string;
}

interface MysteryBoxCardProps {
  box: MysteryBoxData;
  index?: number;
  isVisible?: boolean;
}

export const MysteryBoxCard = React.memo(({ box, index = 0, isVisible = true }: MysteryBoxCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const navigate = useNavigate();
  const isScrolling = useScrollState();

  // Use memoized calculations for better performance
  const volatilityPercent = box.standard_deviation_percent || 0;
  const volatilityColor = useMemoizedVolatilityColor(volatilityPercent);
  const evGradient = useMemoizedEVGradient(box.expected_value_percent_of_price);
  
  // Use database floor_rate_percent as the authoritative source
  const floorRate = box.floor_rate_percent || 0;
  const floorRateColor = useMemoizedFloorRateColor(floorRate);

  // Simplified animations - only for first few items
  const shouldAnimate = index < 12;
  const animationDelay = shouldAnimate ? Math.min(index * 0.05, 0.6) : 0;

  // Convert box name to URL slug using the same function as BoxDetail
  const boxSlug = generateSlug(box.box_name);

  // Determine provider from box data
  const provider = box.provider || 'rillabox';

  const handleClick = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    navigate(`/mystery-box/${boxSlug}`, {
      state: { from: window.location.pathname }
    });
  }, [navigate, boxSlug]);

  if (!isVisible) {
    return null;
  }

  return (
    <TooltipProvider delayDuration={300}>
      <motion.div
        initial={shouldAnimate ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
        animate={{ opacity: 1, y: 0 }}
        transition={shouldAnimate ? { 
          duration: 0.4, 
          delay: animationDelay,
          ease: "easeOut"
        } : { duration: 0 }}
        className="group"
      >
        <Card 
          className={`
            cursor-pointer transition-all duration-300 ease-out
            border-2 backdrop-blur-sm h-full overflow-hidden 
            rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] 
            shimmer-card ${isScrolling ? 'scroll-disabled' : ''} ${volatilityColor}
          `}
          onClick={handleClick}
        >
          <CardHeader className="pb-2 relative">
            {/* Enhanced Provider Logo with Tooltip */}
            <div className="absolute top-3 right-3 z-10">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <ProviderLogo 
                      providerId={provider as keyof typeof PROVIDER_CONFIGS} 
                      size="lg"
                      enhanced={true}
                      className="hover:scale-[1.02] transition-transform duration-200"
                    />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{PROVIDER_CONFIGS[provider as keyof typeof PROVIDER_CONFIGS]?.displayName || provider}</p>
                </TooltipContent>
              </Tooltip>
            </div>
            
            <div 
              className="w-full h-40 rounded-lg mb-2 overflow-hidden p-2 border border-purple-200 backdrop-blur-sm relative bg-white/70 box-container-pattern"
            >
              {!imageLoaded && <div className="w-full h-full bg-gray-200 animate-pulse rounded relative z-20" />}
              <img 
                key={`${box.box_image}?retry=${retryCount}`}
                src={imageError ? 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=300&fit=crop' : box.box_image} 
                alt={box.box_name}
                className={`w-full h-full object-contain transition-opacity duration-300 relative z-20 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                loading={index < 12 ? "eager" : "lazy"}
                referrerPolicy="no-referrer"
                crossOrigin="anonymous"
                onLoad={() => setImageLoaded(true)}
                onError={() => {
                  if (retryCount < 2) {
                    setRetryCount(prev => prev + 1);
                    setImageError(false);
                  } else {
                    console.error(`Image failed to load: ${box.box_name}`, box.box_image);
                    setImageError(true);
                    setImageLoaded(true);
                  }
                }}
              />
            </div>
            <CardTitle className="text-lg font-bold truncate text-gray-800 pr-16 relative z-10">
              {box.box_name}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 relative z-10">
            {/* 3-Section Layout: Price | Provider | Volatility */}
            <div className="grid grid-cols-3 gap-2 items-center">
              <div className="text-left">
                <span className="text-xl font-bold text-gray-800">
                  {formatBoxPrice(box.box_price)}
                </span>
              </div>
              <div className="flex justify-center">
                <span className={`text-xs px-2 py-1 rounded-full font-medium text-center ${PROVIDER_CONFIGS[provider as keyof typeof PROVIDER_CONFIGS]?.bgColor} ${PROVIDER_CONFIGS[provider as keyof typeof PROVIDER_CONFIGS]?.textColor}`}>
                  {PROVIDER_CONFIGS[provider as keyof typeof PROVIDER_CONFIGS]?.displayName}
                </span>
              </div>
              <div className="flex justify-end">
                <Badge variant="outline" className={`border-current font-bold text-sm ${volatilityColor}`}>
                  {volatilityPercent.toFixed(1)}%
                </Badge>
              </div>
            </div>
            <div className="text-center">
              <div className={`text-3xl ${evGradient}`}>
                {box.expected_value_percent_of_price.toFixed(1)}% EV
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600 font-medium">
                Floor: <span className={floorRateColor}>{floorRate.toFixed(1)}%</span>
              </div>
            </div>
            <div className="min-h-[24px] flex items-center">
              <TagDots tags={box.tags} maxVisibleTags={1} maxDots={4} />
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </TooltipProvider>
  );
});

MysteryBoxCard.displayName = 'MysteryBoxCard';

export default MysteryBoxCard;

