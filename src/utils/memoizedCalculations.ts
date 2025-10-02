
import { useMemo } from 'react';

interface BoxItem {
  name: string;
  value: number;
  drop_chance: number;
  image?: string;
  type?: string;
}

// Memoized volatility color calculation
export const useMemoizedVolatilityColor = (volatilityPercent: number) => {
  return useMemo(() => {
    if (volatilityPercent >= 80) return 'border-purple-600 bg-purple-50/80 text-purple-700';
    if (volatilityPercent >= 50) return 'border-purple-500 bg-purple-50/60 text-purple-600';
    if (volatilityPercent >= 20) return 'border-purple-400 bg-purple-50/40 text-purple-500';
    return 'border-purple-300 bg-purple-50/20 text-purple-400';
  }, [volatilityPercent]);
};

// Memoized EV gradient calculation
export const useMemoizedEVGradient = (ev: number) => {
  return useMemo(() => {
    if (ev > 100) return 'text-green-600 font-bold';
    if (ev > 75) return 'text-green-500 font-bold';
    if (ev > 50) return 'text-orange-500 font-bold';
    return 'text-red-600 font-bold';
  }, [ev]);
};

// Memoized floor rate color calculation
export const useMemoizedFloorRateColor = (floorRate: number) => {
  return useMemo(() => {
    if (floorRate >= 80) return 'text-green-600 font-bold';
    if (floorRate >= 60) return 'text-green-500 font-bold';
    if (floorRate >= 40) return 'text-orange-500 font-bold';
    if (floorRate >= 20) return 'text-red-500 font-bold';
    return 'text-red-600 font-bold';
  }, [floorRate]);
};
