import React, { useMemo, useState, useRef, useCallback } from 'react';
import SkeletonBoxCard from './SkeletonBoxCard';
import MysteryBoxCard from './MysteryBoxCard';

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

// BoxCard is now a standalone component - see MysteryBoxCard.tsx

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
          {visibleBoxes.has(index) ? (
            <MysteryBoxCard 
              box={box} 
              index={index} 
              isVisible={true}
            />
          ) : (
            <SkeletonBoxCard />
          )}
        </div>
      ))}
    </div>
  );
};

export default VirtualizedBoxGrid;
