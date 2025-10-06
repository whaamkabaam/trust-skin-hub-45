import React, { useMemo, useState, useRef, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useNavigate } from 'react-router-dom';
import SkeletonBoxCard from './SkeletonBoxCard';
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

interface VirtualizedBoxGridProps {
  boxes: RillaBoxMetricsBox[];
  itemsPerPage: number;
  currentPage: number;
}

const BoxCard = React.memo(({ box, index, isVisible }: { box: RillaBoxMetricsBox; index: number; isVisible: boolean }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
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
    // Navigate directly to box detail without provider parameter
    navigate(`/hub/box/${boxSlug}`);
  }, [navigate, boxSlug]);

  if (!isVisible) {
    return <SkeletonBoxCard />;
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
                src={box.box_image} 
                alt={box.box_name}
                className={`w-full h-full object-contain transition-opacity duration-300 relative z-20 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                loading={index < 12 ? "eager" : "lazy"}
                referrerPolicy="no-referrer"
                onLoad={() => setImageLoaded(true)}
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

BoxCard.displayName = 'BoxCard';

const VirtualizedBoxGrid: React.FC<VirtualizedBoxGridProps> = ({ 
  boxes, 
  itemsPerPage, 
  currentPage 
}) => {
  const [visibleBoxes, setVisibleBoxes] = useState<Set<number>>(new Set());
  const gridRef = useRef<HTMLDivElement>(null);

  const paginatedBoxes = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return boxes.slice(startIndex, endIndex);
  }, [boxes, currentPage, itemsPerPage]);

  // Intersection Observer for lazy loading
  const observerCallback = useCallback((entries: IntersectionObserverEntry[]) => {
    entries.forEach((entry) => {
      const index = parseInt(entry.target.getAttribute('data-index') || '0');
      if (entry.isIntersecting) {
        setVisibleBoxes(prev => new Set([...prev, index]));
      }
    });
  }, []);

  React.useEffect(() => {
    const observer = new IntersectionObserver(observerCallback, {
      root: null,
      rootMargin: '100px',
      threshold: 0.1
    });

    const elements = gridRef.current?.querySelectorAll('[data-index]');
    elements?.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, [observerCallback, paginatedBoxes]);

  // Pre-load first 12 items
  React.useEffect(() => {
    const initialVisible = new Set<number>();
    for (let i = 0; i < Math.min(12, paginatedBoxes.length); i++) {
      initialVisible.add(i);
    }
    setVisibleBoxes(initialVisible);
  }, [paginatedBoxes]);

  return (
    <div 
      ref={gridRef}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8 min-h-[400px] px-2 md:px-0"
    >
      {paginatedBoxes.map((box, index) => (
        <div key={`${box.box_name}-${currentPage}-${index}`} data-index={index}>
          <BoxCard 
            box={box} 
            index={index} 
            isVisible={visibleBoxes.has(index)}
          />
        </div>
      ))}
    </div>
  );
};

export default VirtualizedBoxGrid;
