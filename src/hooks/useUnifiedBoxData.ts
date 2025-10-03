import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

const fixImagePath = (path: string): string => {
  const fallback = 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=300&fit=crop';
  
  if (!path) return fallback;
  
  // Validate URL format
  try {
    if (path.startsWith('http')) {
      new URL(path); // This will throw if invalid
      return path;
    }
    if (path.startsWith('/')) return path;
    return path;
  } catch (e) {
    console.warn('Invalid image URL detected:', path);
    return fallback;
  }
};

interface BoxItem {
  name: string;
  value: number;
  drop_chance: number;
  image?: string;
  type?: string;
}

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

interface UnifiedSummaryData {
  portfolio_average_ev_percent: number;
  best_box_by_ev_percent: string;
  best_box_ev_percent: number;
  worst_box_by_ev_percent: string;
  worst_box_ev_percent: number;
  portfolio_average_standard_deviation_percent: number;
  total_boxes: number;
  provider_breakdown: Record<string, number>;
}

const PROVIDER_CONFIGS = {
  rillabox: {
    tableName: 'rillabox',
    displayName: 'RillaBox',
    color: 'purple',
    gradient: 'from-purple-600 to-purple-700',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    textColor: 'text-purple-700'
  },
  hypedrop: {
    tableName: 'hypedrop',
    displayName: 'Hypedrop',
    color: 'blue',
    gradient: 'from-blue-600 to-blue-700',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-700'
  },
  casesgg: {
    tableName: 'casesgg',
    displayName: 'Cases.GG',
    color: 'green',
    gradient: 'from-green-600 to-green-700',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    textColor: 'text-green-700'
  },
  luxdrop: {
    tableName: 'luxdrop',
    displayName: 'Luxdrop',
    color: 'amber',
    gradient: 'from-amber-600 to-amber-700',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    textColor: 'text-amber-700'
  }
} as const;

const safeParseJSON = (jsonData: any): BoxItem[] => {
  if (!jsonData) return [];
  if (Array.isArray(jsonData)) {
    return jsonData.map((item) => {
      // CRITICAL FIX: Database stores drop chances as percentages, always convert to decimal
      let dropChance = 0;
      
      if (item.item_dropchance_formatted) {
        // Handle formatted percentages like "0.1000%"
        const formatted = item.item_dropchance_formatted.toString().replace('%', '');
        dropChance = parseFloat(formatted) / 100;
      } else if (item.item_dropchance !== undefined) {
        // FIXED: All database values are percentages, always divide by 100
        dropChance = parseFloat(item.item_dropchance) / 100;
      } else if (item.drop_chance !== undefined) {
        // FIXED: All database values are percentages, always divide by 100
        dropChance = parseFloat(item.drop_chance) / 100;
      }

      return {
        name: item.item_name || item.name || 'Unknown Item',
        value: parseFloat(item.item_value || item.value || item.price || 0),
        drop_chance: dropChance,
        image: fixImagePath(item.item_image || item.image || ''),
        type: item.type || item.item_type || ''
      };
    });
  }
  if (typeof jsonData === 'string') {
    try {
      const parsed = JSON.parse(jsonData);
      if (Array.isArray(parsed)) {
        return safeParseJSON(parsed);
      }
    } catch (e) {
      console.warn('Failed to parse JSON string:', e);
    }
  }
  return [];
};

const parseTagsArray = (tagsData: any): string[] => {
  if (!tagsData) return [];
  if (Array.isArray(tagsData)) {
    return tagsData.filter(tag => tag && typeof tag === 'string');
  }
  if (typeof tagsData === 'string') {
    try {
      const parsed = JSON.parse(tagsData);
      if (Array.isArray(parsed)) {
        return parsed.filter(tag => tag && typeof tag === 'string');
      }
    } catch (e) {
      return tagsData.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
    }
  }
  return [];
};

const calculateUnifiedSummaryStats = (boxes: UnifiedBoxData[]): UnifiedSummaryData => {
  if (!boxes || boxes.length === 0) {
    return {
      portfolio_average_ev_percent: 0,
      best_box_by_ev_percent: 'N/A',
      best_box_ev_percent: 0,
      worst_box_by_ev_percent: 'N/A',
      worst_box_ev_percent: 0,
      portfolio_average_standard_deviation_percent: 0,
      total_boxes: 0,
      provider_breakdown: {}
    };
  }

  const validBoxes = boxes.filter(box => box.expected_value_percent_of_price && !isNaN(box.expected_value_percent_of_price));
  
  if (validBoxes.length === 0) {
    return {
      portfolio_average_ev_percent: 0,
      best_box_by_ev_percent: 'N/A',
      best_box_ev_percent: 0,
      worst_box_by_ev_percent: 'N/A',
      worst_box_ev_percent: 0,
      portfolio_average_standard_deviation_percent: 0,
      total_boxes: boxes.length,
      provider_breakdown: {}
    };
  }

  const avgEV = validBoxes.reduce((sum, box) => sum + Number(box.expected_value_percent_of_price), 0) / validBoxes.length;
  
  const bestBox = validBoxes.reduce((best, current) => 
    Number(current.expected_value_percent_of_price) > Number(best.expected_value_percent_of_price) ? current : best
  );
  
  const worstBox = validBoxes.reduce((worst, current) => 
    Number(current.expected_value_percent_of_price) < Number(worst.expected_value_percent_of_price) ? current : worst
  );

  const avgStdDev = validBoxes
    .filter(box => box.standard_deviation_percent && !isNaN(box.standard_deviation_percent))
    .reduce((sum, box, _, arr) => sum + Number(box.standard_deviation_percent) / arr.length, 0);

  const provider_breakdown = boxes.reduce((acc, box) => {
    acc[box.provider] = (acc[box.provider] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return {
    portfolio_average_ev_percent: avgEV,
    best_box_by_ev_percent: bestBox.box_name,
    best_box_ev_percent: Number(bestBox.expected_value_percent_of_price),
    worst_box_by_ev_percent: worstBox.box_name,
    worst_box_ev_percent: Number(worstBox.expected_value_percent_of_price),
    portfolio_average_standard_deviation_percent: avgStdDev,
    total_boxes: boxes.length,
    provider_breakdown
  };
};

const fetchUnifiedData = async (selectedProviders?: string[], limit: number = 1000): Promise<{
  allBoxes: UnifiedBoxData[];
  summaryData: UnifiedSummaryData;
}> => {
  console.log('Fetching unified mystery box data...');
  
  const allBoxes: UnifiedBoxData[] = [];
  const providersToFetch = selectedProviders?.length ? 
    selectedProviders.filter(p => p in PROVIDER_CONFIGS) : 
    Object.keys(PROVIDER_CONFIGS);

  // Fetch data for each provider in parallel for better performance
  const fetchPromises = providersToFetch.map(async (providerKey) => {
    const provider = providerKey as keyof typeof PROVIDER_CONFIGS;
    const config = PROVIDER_CONFIGS[provider];
    
    console.log(`Fetching ${config.displayName} mystery boxes...`);
    
    try {
      const { data: boxesResult, error: boxesError } = await supabase
        .from(config.tableName)
        .select(`
          box_name,
          box_price,
          box_image,
          expected_value_percent,
          volatility_bucket,
          standard_deviation_percent,
          floor_rate_percent,
          category,
          tags,
          jackpot_items,
          unwanted_items,
          all_items
        `)
        .order('box_name')
        .limit(limit); // Use configurable limit

      if (boxesError) {
        console.error(`Error fetching ${config.displayName} mystery boxes:`, boxesError);
        return [];
      }

      if (boxesResult && boxesResult.length > 0) {
        return boxesResult.map((box) => {
          const jackpotItems = safeParseJSON(box.jackpot_items);
          const unwantedItems = safeParseJSON(box.unwanted_items);
          let allItems = safeParseJSON(box.all_items);
          
          // Fix: If all_items is empty, combine jackpot_items and unwanted_items
          if (allItems.length === 0 && (jackpotItems.length > 0 || unwantedItems.length > 0)) {
            allItems = [...jackpotItems, ...unwantedItems];
            console.log(`Fixed empty all_items for box: ${box.box_name}, combined ${allItems.length} items`);
          }

          return {
            box_name: box.box_name || 'Unknown Mystery Box',
            box_price: Number(box.box_price) || 0,
            box_image: fixImagePath(box.box_image || 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=300&fit=crop'),
            expected_value_percent_of_price: Number(box.expected_value_percent) || 0,
            volatility_bucket: (box.volatility_bucket as 'Low' | 'Medium' | 'High') || 'Medium',
            standard_deviation_percent: Number(box.standard_deviation_percent) || 0,
            floor_rate_percent: Number(box.floor_rate_percent) || 0,
            category: box.category || 'Mystery Boxes',
            tags: parseTagsArray(box.tags),
            jackpot_items: jackpotItems,
            unwanted_items: unwantedItems,
            all_items: allItems,
            provider,
            provider_config: config
          };
        });
      }
      return [];
    } catch (error) {
      console.error(`Error fetching ${config.displayName} mystery boxes:`, error);
      return [];
    }
  });

  // Wait for all providers to complete
  const providerResults = await Promise.allSettled(fetchPromises);
  
  providerResults.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      allBoxes.push(...result.value);
    } else {
      console.error(`Provider ${providersToFetch[index]} failed:`, result.reason);
    }
  });

  console.log(`Total unified mystery boxes loaded: ${allBoxes.length}`);
  
  const summaryData = calculateUnifiedSummaryStats(allBoxes);
  
  return { allBoxes, summaryData };
};

export const useUnifiedBoxData = (selectedProviders?: string[], limit?: number) => {
  const {
    data,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['unifiedBoxData', selectedProviders?.sort(), limit],
    queryFn: () => fetchUnifiedData(selectedProviders, limit),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (was cacheTime)
    retry: 2,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 10000),
  });

  return {
    summaryData: data?.summaryData || null,
    boxesData: data?.allBoxes || [],
    loading: isLoading,
    error: error?.message || null,
    refetch
  };
};
