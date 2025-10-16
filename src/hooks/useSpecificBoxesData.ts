import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface BoxAssignment {
  box_id: number;
  provider: string;
  box_name?: string;
  box_price?: number;
  box_image?: string;
  expected_value_percent?: number;
  floor_rate_percent?: number;
  volatility_percent?: number;
  standard_deviation_percent?: number;
  tags?: string[];
  category?: string;
}

interface EnrichedBoxData {
  id: number;
  box_name: string;
  box_price: number;
  box_image: string;
  expected_value_percent_of_price: number;
  floor_rate_percent: number;
  volatility_bucket: 'Low' | 'Medium' | 'High';
  standard_deviation_percent: number;
  category: string;
  tags: string[];
  provider: string;
}

const PROVIDER_TABLES = {
  rillabox: 'rillabox',
  hypedrop: 'hypedrop',
  casesgg: 'casesgg',
  luxdrop: 'luxdrop',
} as const;

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

const fetchSpecificBoxes = async (boxAssignments: BoxAssignment[]): Promise<EnrichedBoxData[]> => {
  if (!boxAssignments || boxAssignments.length === 0) {
    return [];
  }

  // Group boxes by provider for efficient querying
  const boxesByProvider = boxAssignments.reduce((acc, box) => {
    const provider = box.provider.toLowerCase();
    if (!acc[provider]) {
      acc[provider] = [];
    }
    acc[provider].push(box.box_id);
    return acc;
  }, {} as Record<string, number[]>);

  // Fetch from each provider table in parallel
  const fetchPromises = Object.entries(boxesByProvider).map(async ([provider, boxIds]) => {
    const tableName = PROVIDER_TABLES[provider as keyof typeof PROVIDER_TABLES];
    if (!tableName) {
      console.warn(`Unknown provider: ${provider}`);
      return [];
    }

    try {
      const { data, error } = await supabase
        .from(tableName)
        .select('id, box_name, box_price, box_image, expected_value_percent, floor_rate_percent, standard_deviation_percent, volatility_bucket, category, tags')
        .in('id', boxIds);

      if (error) {
        console.error(`Error fetching boxes from ${tableName}:`, error);
        return [];
      }

      return (data || []).map((box: any) => ({
        id: box.id,
        box_name: box.box_name,
        box_price: Number(box.box_price) || 0,
        box_image: box.box_image || 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=300&fit=crop',
        expected_value_percent_of_price: Number(box.expected_value_percent) || 0,
        floor_rate_percent: Number(box.floor_rate_percent) || 0,
        volatility_bucket: (box.volatility_bucket as 'Low' | 'Medium' | 'High') || 'Medium',
        standard_deviation_percent: Number(box.standard_deviation_percent) || 0,
        category: box.category || 'Mystery Boxes',
        tags: parseTagsArray(box.tags),
        provider,
      }));
    } catch (error) {
      console.error(`Error fetching from ${tableName}:`, error);
      return [];
    }
  });

  const results = await Promise.all(fetchPromises);
  const allBoxes = results.flat();

  // Create a map for quick lookup by provider + box_id
  const boxMap = new Map<string, EnrichedBoxData>();
  allBoxes.forEach(box => {
    boxMap.set(`${box.provider}_${box.id}`, box);
  });

  // Return boxes in the same order as requested, filtering out missing ones
  return boxAssignments
    .map(assignment => {
      const key = `${assignment.provider.toLowerCase()}_${assignment.box_id}`;
      const enrichedBox = boxMap.get(key);
      
      if (!enrichedBox) {
        console.warn(`Box not found: ${assignment.provider} ID ${assignment.box_id}`);
      }
      
      return enrichedBox;
    })
    .filter((box): box is EnrichedBoxData => box !== undefined);
};

export const useSpecificBoxesData = (boxAssignments: BoxAssignment[]) => {
  const {
    data,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['specificBoxes', boxAssignments],
    queryFn: () => fetchSpecificBoxes(boxAssignments),
    enabled: boxAssignments.length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: 2,
  });

  return {
    boxes: data || [],
    loading: isLoading,
    error: error?.message || null,
  };
};
