import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { createClient } from '@supabase/supabase-js';

// Connect to RillaBox Supabase for mystery box data
const supabase = createClient(
  'https://qsrkzgywbcbfnmailmsp.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFzcmt6Z3l3YmNiZm5tYWlsbXNwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM1MzQ5OTcsImV4cCI6MjA1OTExMDk5N30.uqh8KDM_ks2lzo9Go-0ffCh2CFIURhQRb9qD84i6pQ0'
);
import { PROVIDER_CONFIGS } from '@/types/filters';
import { generateSlug, findBestMatches, normalizeString, calculateSimilarity } from '@/utils/slugUtils';
import { fixImagePath } from '@/lib/utils';

interface BoxItem {
  name: string;
  value: number;
  drop_chance: number;
  image?: string;
  type?: string;
}

interface BoxDetailData {
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
  provider_config: {
    displayName: string;
    color: string;
    gradient: string;
    bgColor: string;
    borderColor: string;
    textColor: string;
  };
}

const safeParseJSON = (jsonData: any): BoxItem[] => {
  if (!jsonData) return [];
  if (Array.isArray(jsonData)) {
    return jsonData.map((item) => {
      // CRITICAL FIX: Database stores drop chances as percentages (e.g., 72.92 = 72.92%)
      // We need to convert ALL values from percentage to decimal by dividing by 100
      let dropChance = 0;
      
      if (item.item_dropchance_formatted) {
        // Handle formatted percentages like "0.1000%"
        const formatted = item.item_dropchance_formatted.toString().replace('%', '');
        dropChance = parseFloat(formatted) / 100; // Convert percentage to decimal
      } else if (item.item_dropchance !== undefined) {
        // FIXED: All database values are percentages, always divide by 100
        const rawDropChance = parseFloat(item.item_dropchance);
        dropChance = rawDropChance / 100; // Convert percentage to decimal
        console.log(`Converting drop chance: ${rawDropChance}% -> ${dropChance} (decimal)`);
      } else if (item.drop_chance !== undefined) {
        // FIXED: All database values are percentages, always divide by 100
        const rawDropChance = parseFloat(item.drop_chance);
        dropChance = rawDropChance / 100; // Convert percentage to decimal
        console.log(`Converting drop chance: ${rawDropChance}% -> ${dropChance} (decimal)`);
      }
      
      // Validate drop chance is reasonable (should be between 0 and 1 as decimal)
      if (isNaN(dropChance) || dropChance < 0 || dropChance > 1) {
        console.warn(`Invalid drop chance for item "${item.item_name || item.name}": ${dropChance}, setting to 0`);
        dropChance = 0;
      }
      
      // Enhanced value parsing
      let value = 0;
      if (item.item_value !== undefined) {
        value = parseFloat(item.item_value);
      } else if (item.value !== undefined) {
        value = parseFloat(item.value);
      } else if (item.price !== undefined) {
        value = parseFloat(item.price);
      }
      
      // Use item_image for the image URL
      const image = fixImagePath(item.item_image || item.image || item.image_url || item.imageUrl || item.img || '');
      const type = item.type || item.item_type || item.itemType || '';
      
      console.log(`Processed box detail item: ${item.item_name || item.name}, value: ${value}, drop_chance: ${dropChance}, image: ${image}`);
      
      return {
        name: item.item_name || item.name || 'Unknown Item',
        value,
        drop_chance: dropChance,
        image,
        type
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

const fetchBoxDetail = async (boxSlug: string): Promise<BoxDetailData | null> => {
  console.log(`Enhanced search for box with slug: ${boxSlug} across all providers...`);

  // Normalize the search slug
  const normalizedSlug = normalizeString(boxSlug);
  console.log(`Normalized search slug: ${normalizedSlug}`);

  // Enhanced search across all provider tables with multi-stage matching
  const searchPromises = Object.entries(PROVIDER_CONFIGS).map(async ([providerId, config]) => {
    try {
      // First attempt: Get all boxes from this provider
      const { data, error } = await supabase
        .from(config.tableName)
        .select('*')
        .limit(1000); // Get more data for better matching

      if (error) {
        console.error(`Error fetching from ${config.displayName}:`, error);
        return [];
      }

      if (!data || data.length === 0) {
        console.log(`No data found in ${config.displayName}`);
        return [];
      }

      console.log(`Found ${data.length} boxes in ${config.displayName}, starting intelligent matching...`);

      // Extract box names for matching
      const boxNames = data.map(box => box.box_name).filter(Boolean);
      
      // Use enhanced matching to find best matches
      const matches = findBestMatches(normalizedSlug, boxNames);
      console.log(`${config.displayName} matches:`, matches.slice(0, 3));

      // Return matched boxes with scores
      return matches
        .filter(match => match.score > 0.4) // Only include decent matches
        .slice(0, 5) // Limit to top 5 matches per provider
        .map(match => {
          const originalBox = data.find(box => box.box_name === match.originalName);
          return {
            ...originalBox,
            provider: providerId,
            provider_config: config,
            matchScore: match.score,
            matchedSlug: match.slug
          };
        })
        .filter(Boolean);
    } catch (error) {
      console.error(`Search error in ${config.displayName}:`, error);
      return [];
    }
  });

  // Wait for all searches to complete
  const allResults = await Promise.all(searchPromises);
  
  // Flatten and sort all matches by score
  const allMatches = allResults
    .flat()
    .filter(Boolean)
    .sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0));

  console.log(`Total matches found: ${allMatches.length}`);
  if (allMatches.length > 0) {
    console.log(`Best match: ${allMatches[0].box_name} (score: ${allMatches[0].matchScore?.toFixed(3)}) from ${allMatches[0].provider_config.displayName}`);
  }

  const foundBox = allMatches[0] || null;
  
  if (!foundBox) {
    console.log(`No suitable matches found for slug: ${boxSlug}`);
    return null;
  }

  const parsedJackpotItems = safeParseJSON(foundBox.jackpot_items);
  const parsedUnwantedItems = safeParseJSON(foundBox.unwanted_items);
  const parsedAllItems = safeParseJSON(foundBox.all_items);

  // Validation: Log total drop rates to verify they sum to ~100%
  const totalDropRate = parsedAllItems.reduce((sum, item) => sum + item.drop_chance, 0);
  console.log(`Box "${foundBox.box_name}" total drop rate: ${(totalDropRate * 100).toFixed(2)}%`);
  
  if (totalDropRate < 0.95 || totalDropRate > 1.05) {
    console.warn(`Warning: Drop rates for "${foundBox.box_name}" sum to ${(totalDropRate * 100).toFixed(2)}%, expected ~100%`);
  }

  return {
    box_name: foundBox.box_name || 'Unknown Mystery Box',
    box_price: Number(foundBox.box_price) || 0,
    box_image: fixImagePath(foundBox.box_image || 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=300&fit=crop'),
    expected_value_percent_of_price: Number(foundBox.expected_value_percent) || 0,
    volatility_bucket: (foundBox.volatility_bucket as 'Low' | 'Medium' | 'High') || 'Medium',
    standard_deviation_percent: Number(foundBox.standard_deviation_percent) || 0,
    floor_rate_percent: Number(foundBox.floor_rate_percent) || 0,
    category: foundBox.category || 'Mystery Boxes',
    tags: parseTagsArray(foundBox.tags),
    jackpot_items: parsedJackpotItems,
    unwanted_items: parsedUnwantedItems,
    all_items: parsedAllItems,
    provider: foundBox.provider,
    provider_config: foundBox.provider_config
  };
};

export const useBoxDetail = (boxSlug: string) => {
  const {
    data: boxData,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['boxDetail', boxSlug],
    queryFn: () => fetchBoxDetail(boxSlug),
    enabled: Boolean(boxSlug),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (was cacheTime)
    retry: 3,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  return {
    boxData,
    loading: isLoading,
    error: error?.message || null,
    refetch
  };
};
