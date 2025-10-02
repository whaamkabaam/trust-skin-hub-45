
import { RillaBoxMetricsBox } from '@/types';

// Define unified box interface for better type compatibility
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
  jackpot_items: BoxItem[];
  unwanted_items: BoxItem[];
  all_items: BoxItem[];
  provider: string;
  provider_config?: any;
}

interface BoxItem {
  name: string;
  value: number;
  drop_chance: number;
  image?: string;
  type?: string;
}

export const calculateTotalItemsCount = (boxesData: (RillaBoxMetricsBox | UnifiedBoxData)[]): number => {
  if (!boxesData || boxesData.length === 0) return 0;
  
  return boxesData.reduce((total, box) => {
    if (!box.all_items || !Array.isArray(box.all_items)) return total;
    return total + box.all_items.length;
  }, 0);
};

export const formatItemCount = (count: number): string => {
  if (count < 1000) return count.toString();
  if (count < 1000000) return `${(count / 1000).toFixed(1)}K`;
  return `${(count / 1000000).toFixed(1)}M`;
};

export const formatBoxCount = (count: number): string => {
  if (count < 1000) return count.toLocaleString();
  if (count < 1000000) return `${(count / 1000).toFixed(1)}K`;
  return `${(count / 1000000).toFixed(1)}M`;
};
