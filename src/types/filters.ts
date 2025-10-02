import { type LucideIcon } from 'lucide-react';

export type BoxProvider = 'rillabox' | 'hypedrop' | 'casesgg' | 'luxdrop';

export interface FilterState {
  categories: string[];
  providers: string[]; // Add provider filtering
  priceRange: {
    min: number;
    max: number;
  };
  expectedValueRange: {
    min: number;
    max: number;
  };
  volatilityBuckets: ('Low' | 'Medium' | 'High')[];
  volatilityRange: {
    min: number;
    max: number;
  };
  floorRateRange: {
    min: number;
    max: number;
  };
  tags: string[];
  advanced: {
    jackpotValueRange: {
      min: number;
      max: number;
    };
    itemCountRange: {
      min: number;
      max: number;
    };
  };
}

export type SortOption = 
  | 'ev_desc' 
  | 'ev_asc' 
  | 'price_desc' 
  | 'price_asc' 
  | 'volatility_desc' 
  | 'volatility_asc' 
  | 'floor_desc' 
  | 'floor_asc' 
  | 'name_asc' 
  | 'name_desc';

export const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'ev_desc', label: 'Expected Value (High to Low)' },
  { value: 'ev_asc', label: 'Expected Value (Low to High)' },
  { value: 'price_desc', label: 'Price (High to Low)' },
  { value: 'price_asc', label: 'Price (Low to High)' },
  { value: 'volatility_desc', label: 'Volatility (High to Low)' },
  { value: 'volatility_asc', label: 'Volatility (Low to High)' },
  { value: 'floor_desc', label: 'Floor Rate (High to Low)' },
  { value: 'floor_asc', label: 'Floor Rate (Low to High)' },
  { value: 'name_asc', label: 'Name (A to Z)' },
  { value: 'name_desc', label: 'Name (Z to A)' },
];

// Fixed provider configuration with correct logo paths
export const PROVIDER_CONFIGS = {
  rillabox: {
    id: 'rillabox',
    tableName: 'rillabox_boxes',
    displayName: 'RillaBox',
    color: 'purple',
    gradient: 'from-purple-600 to-purple-700',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    textColor: 'text-purple-700',
    logo: '/images/998b5116-3761-4842-9a89-628f8e71c362.png',
    logoAspectRatio: 'square' as const,
    logoBackground: 'white' as const
  },
  hypedrop: {
    id: 'hypedrop',
    tableName: 'hypedrop_boxes',
    displayName: 'Hypedrop',
    color: 'blue',
    gradient: 'from-blue-600 to-blue-700',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-700',
    logo: '/images/df4efff1-2943-40f6-9a23-fc3f872ee338.png',
    logoAspectRatio: 'wide' as const,
    logoBackground: 'transparent' as const
  },
  casesgg: {
    id: 'casesgg',
    tableName: 'casesgg_boxes',
    displayName: 'Cases.GG',
    color: 'green',
    gradient: 'from-green-600 to-green-700',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    textColor: 'text-green-700',
    logo: '/images/ccc8c7f7-53cc-41ac-8e6d-0fe13f968fd3.png',
    logoAspectRatio: 'wide' as const,
    logoBackground: 'dark' as const
  },
  luxdrop: {
    id: 'luxdrop',
    tableName: 'luxdrop_boxes',
    displayName: 'Luxdrop',
    color: 'amber',
    gradient: 'from-amber-600 to-amber-700',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    textColor: 'text-amber-700',
    logo: '/images/f983540a-2e1c-47e7-bac5-99c00df75346.png',
    logoAspectRatio: 'square' as const,
    logoBackground: 'transparent' as const
  }
} as const;
