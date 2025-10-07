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

interface UnifiedMysteryBoxCardProps {
  box: {
    id?: string;
    name: string;
    image_url: string;
    price: number;
    expected_value_percent?: number;
    floor_rate_percent?: number;
    volatility_percent?: number;
    provider?: string;
    slug?: string;
    tags?: string[];
    verified?: boolean;
    category?: string;
  };
  index?: number;
  showAnimation?: boolean;
}

export const UnifiedMysteryBoxCard = React.memo(({ 
  box, 
  index = 0, 
  showAnimation = false 
}: UnifiedMysteryBoxCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const navigate = useNavigate();
  const isScrolling = useScrollState();

  // Use memoized calculations for better performance
  const volatilityPercent = box.volatility_percent || 0;
  const volatilityColor = useMemoizedVolatilityColor(volatilityPercent);
  const evPercent = box.expected_value_percent || 0;
  const evGradient = useMemoizedEVGradient(evPercent);
  const floorRate = box.floor_rate_percent || 0;
  const floorRateColor = useMemoizedFloorRateColor(floorRate);

  // Simplified animations - only for first few items
  const shouldAnimate = showAnimation && index < 12;
  const animationDelay = shouldAnimate ? Math.min(index * 0.05, 0.6) : 0;

  // Generate slug from box name if not provided
  const boxSlug = box.slug || generateSlug(box.name);

  // Determine provider from box data
  const provider = box.provider || 'rillabox';

  const handleClick = useCallback(() => {
    // Scroll to top instantly before navigation
    window.scrollTo({ top: 0, behavior: 'instant' });
    // Navigate to mystery box detail page
    navigate(`/mystery-box/${boxSlug}`);
  }, [navigate, boxSlug]);

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
        className="group h-full"
      >
        <Card 
          className={`
            cursor-pointer transition-all duration-300 ease-out
            border-2 backdrop-blur-sm h-full overflow-hidden 
            rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] 
            shimmer-card ${isScrolling ? 'scroll-disabled' : ''} ${volatilityColor}
            glass-edge
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
                src={imageError ? 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=300&fit=crop' : box.image_url} 
                alt={box.name}
                className={`w-full h-full object-contain transition-opacity duration-300 relative z-20 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                loading={index < 12 ? "eager" : "lazy"}
                referrerPolicy="no-referrer"
                crossOrigin="anonymous"
                onLoad={() => setImageLoaded(true)}
                onError={() => {
                  console.warn(`Failed to load image for box: ${box.name}, URL: ${box.image_url}`);
                  setImageError(true);
                  setImageLoaded(true);
                }}
              />
            </div>
            <CardTitle className="text-lg font-bold truncate text-gray-800 pr-16 relative z-10">
              {box.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 relative z-10">
            {/* 3-Section Layout: Price | Provider | Volatility */}
            <div className="grid grid-cols-3 gap-2 items-center">
              <div className="text-left">
                <span className="text-xl font-bold text-gray-800">
                  {formatBoxPrice(box.price)}
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
                {evPercent.toFixed(1)}% EV
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600 font-medium">
                Floor: <span className={floorRateColor}>{floorRate.toFixed(1)}%</span>
              </div>
            </div>
            <div className="min-h-[24px] flex items-center">
              <TagDots tags={box.tags || []} maxVisibleTags={1} maxDots={4} />
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </TooltipProvider>
  );
});

UnifiedMysteryBoxCard.displayName = 'UnifiedMysteryBoxCard';
