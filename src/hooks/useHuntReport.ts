
import { useMemo } from 'react';
import { generateHuntReport } from '@/utils/scouterCalculations';
import { HuntResult } from '@/types';
import { adaptUnifiedBoxesToRillaBoxes } from '@/utils/typeAdapters';

// Type for unified box data from useUnifiedBoxData
interface UnifiedBoxData {
  box_name: string;
  box_price: number;
  box_image: string;
  expected_value_percent_of_price: number;
  volatility_bucket: 'Low' | 'Medium' | 'High';
  standard_deviation_percent: number;
  floor_rate_percent: number;
  category: string;
  tags: string[];
  jackpot_items: any[];
  unwanted_items: any[];
  all_items: any[];
  provider: 'rillabox' | 'hypedrop' | 'casesgg' | 'luxdrop';
  provider_config: {
    displayName: string;
    color: string;
    gradient: string;
    bgColor: string;
    borderColor: string;
    textColor: string;
  };
}

export const useHuntReport = (boxesData: UnifiedBoxData[], selectedItem: string): HuntResult[] => {
  return useMemo(() => {
    if (!selectedItem) return [];
    // Convert unified boxes to RillaBox format for hunt report generation
    const adaptedBoxes = adaptUnifiedBoxesToRillaBoxes(boxesData);
    return generateHuntReport(adaptedBoxes, selectedItem);
  }, [boxesData, selectedItem]);
};
