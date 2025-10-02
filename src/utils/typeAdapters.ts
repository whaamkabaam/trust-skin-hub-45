
import { RillaBoxMetricsBox, BoxItem } from '@/types';

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
  jackpot_items: BoxItem[];
  unwanted_items: BoxItem[];
  all_items: BoxItem[];
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

// Adapter to convert UnifiedBoxData to RillaBoxMetricsBox for hunt functionality
export const adaptUnifiedBoxToRillaBox = (unifiedBox: UnifiedBoxData): RillaBoxMetricsBox => {
  return {
    box_name: unifiedBox.box_name,
    box_price: unifiedBox.box_price,
    box_image: unifiedBox.box_image,
    expected_value_percent_of_price: unifiedBox.expected_value_percent_of_price,
    volatility_bucket: unifiedBox.volatility_bucket,
    standard_deviation_percent: unifiedBox.standard_deviation_percent,
    floor_rate_percent: unifiedBox.floor_rate_percent,
    category: unifiedBox.category,
    tags: unifiedBox.tags,
    jackpot_items: unifiedBox.jackpot_items,
    unwanted_items: unifiedBox.unwanted_items,
    all_items: unifiedBox.all_items,
    provider: unifiedBox.provider
  };
};

// Adapter to convert array of UnifiedBoxData to RillaBoxMetricsBox array
export const adaptUnifiedBoxesToRillaBoxes = (unifiedBoxes: UnifiedBoxData[]): RillaBoxMetricsBox[] => {
  return unifiedBoxes.map(adaptUnifiedBoxToRillaBox);
};
