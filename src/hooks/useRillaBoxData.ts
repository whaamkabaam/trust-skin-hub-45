
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { fixImagePath } from '@/lib/utils';

interface RillaBoxMetricsSummary {
  portfolio_average_ev_percent: number;
  best_box_by_ev_percent: string;
  best_box_ev_percent: number;
  worst_box_by_ev_percent: string;
  worst_box_ev_percent: number;
  portfolio_average_standard_deviation_percent: number;
}

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
}

const safeParseJSON = (jsonData: any): BoxItem[] => {
  console.log('Parsing JSON data:', { type: typeof jsonData, data: jsonData });
  
  if (!jsonData) {
    console.log('No data provided');
    return [];
  }
  
  // If it's already an array, process it
  if (Array.isArray(jsonData)) {
    console.log('Data is already an array:', jsonData.length, 'items');
    return jsonData.map((item, index) => {
      console.log(`Processing item ${index}:`, item);
      
      // Use the correct field names from the database
      const name = item.item_name || item.name || 'Unknown Item';
      const value = parseFloat(item.item_value || item.value || item.price || 0);
      
      // Smart drop chance parsing - prioritize formatted field, then apply intelligent conversion
      let dropChance = 0;
      if (item.item_dropchance_formatted) {
        // Use the pre-formatted percentage and convert to decimal for internal use
        const formattedValue = parseFloat(item.item_dropchance_formatted.replace('%', ''));
        dropChance = formattedValue / 100;
        console.log(`Using formatted drop chance: ${item.item_dropchance_formatted} -> ${dropChance}`);
      } else if (item.item_dropchance !== undefined) {
        const rawValue = parseFloat(item.item_dropchance || 0);
        // If the value is > 1, it's likely already a percentage, convert to decimal
        // If the value is <= 1, it's likely already a decimal
        dropChance = rawValue > 1 ? rawValue / 100 : rawValue;
        console.log(`Using raw drop chance: ${rawValue} -> ${dropChance}`);
      } else {
        // Fallback to other field names
        dropChance = parseFloat(item.drop_chance || item.dropChance || item.probability || item.drop_rate || item.dropRate || 0);
      }
      
      // Use item_image for the image URL
      const image = fixImagePath(item.item_image || item.image || item.image_url || item.imageUrl || item.img || '');
      const type = item.type || item.item_type || item.itemType || '';
      
      console.log(`Processed item: ${name}, value: ${value}, drop_chance: ${dropChance}, image: ${image}`);
      
      return {
        name,
        value,
        drop_chance: dropChance,
        image,
        type
      };
    });
  }
  
  // If it's a string, try to parse as JSON
  if (typeof jsonData === 'string') {
    console.log('Data is string, attempting to parse:', jsonData.substring(0, 200));
    try {
      const parsed = JSON.parse(jsonData);
      console.log('Successfully parsed JSON:', parsed);
      if (Array.isArray(parsed)) {
        return safeParseJSON(parsed); // Recursive call with parsed array
      }
    } catch (e) {
      console.warn('Failed to parse JSON string:', jsonData.substring(0, 100), 'Error:', e);
    }
  }
  
  // If it's an object but not array, try to extract array from common property names
  if (typeof jsonData === 'object' && jsonData !== null) {
    console.log('Data is object, checking for array properties');
    const possibleArrayKeys = ['items', 'data', 'results', 'list'];
    for (const key of possibleArrayKeys) {
      if (Array.isArray(jsonData[key])) {
        console.log(`Found array in property '${key}':`, jsonData[key]);
        return safeParseJSON(jsonData[key]);
      }
    }
  }
  
  console.warn('Could not parse data, returning empty array');
  return [];
};

const parseTagsArray = (tagsData: any): string[] => {
  console.log('Parsing tags:', { type: typeof tagsData, data: tagsData });
  
  if (!tagsData) return [];
  if (Array.isArray(tagsData)) {
    const filtered = tagsData.filter(tag => tag && typeof tag === 'string');
    console.log('Parsed tags array:', filtered);
    return filtered;
  }
  
  if (typeof tagsData === 'string') {
    try {
      const parsed = JSON.parse(tagsData);
      if (Array.isArray(parsed)) {
        const filtered = parsed.filter(tag => tag && typeof tag === 'string');
        console.log('Parsed tags from JSON string:', filtered);
        return filtered;
      }
    } catch (e) {
      // If parsing fails, split by comma
      const split = tagsData.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);
      console.log('Parsed tags by splitting:', split);
      return split;
    }
  }
  
  return [];
};

const calculateSummaryStats = (boxes: any[]) => {
  if (!boxes || boxes.length === 0) {
    return {
      portfolio_average_ev_percent: 0,
      best_box_by_ev_percent: 'N/A',
      best_box_ev_percent: 0,
      worst_box_by_ev_percent: 'N/A',
      worst_box_ev_percent: 0,
      portfolio_average_standard_deviation_percent: 0
    };
  }

  const validBoxes = boxes.filter(box => box.expected_value_percent && !isNaN(box.expected_value_percent));
  
  if (validBoxes.length === 0) {
    return {
      portfolio_average_ev_percent: 0,
      best_box_by_ev_percent: 'N/A',
      best_box_ev_percent: 0,
      worst_box_by_ev_percent: 'N/A',
      worst_box_ev_percent: 0,
      portfolio_average_standard_deviation_percent: 0
    };
  }

  const avgEV = validBoxes.reduce((sum, box) => sum + Number(box.expected_value_percent), 0) / validBoxes.length;
  
  const bestBox = validBoxes.reduce((best, current) => 
    Number(current.expected_value_percent) > Number(best.expected_value_percent) ? current : best
  );
  
  const worstBox = validBoxes.reduce((worst, current) => 
    Number(current.expected_value_percent) < Number(worst.expected_value_percent) ? current : worst
  );

  const avgStdDev = validBoxes
    .filter(box => box.standard_deviation_percent && !isNaN(box.standard_deviation_percent))
    .reduce((sum, box, _, arr) => sum + Number(box.standard_deviation_percent) / arr.length, 0);

  return {
    portfolio_average_ev_percent: avgEV,
    best_box_by_ev_percent: bestBox.box_name,
    best_box_ev_percent: Number(bestBox.expected_value_percent),
    worst_box_by_ev_percent: worstBox.box_name,
    worst_box_ev_percent: Number(worstBox.expected_value_percent),
    portfolio_average_standard_deviation_percent: avgStdDev
  };
};

export const useRillaBoxData = () => {
  const [summaryData, setSummaryData] = useState<RillaBoxMetricsSummary | null>(null);
  const [boxesData, setBoxesData] = useState<RillaBoxMetricsBox[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching RillaBox data from Supabase...');
        
        const { data: boxesResult, error: boxesError } = await supabase
          .from('rillabox_boxes')
          .select('*')
          .order('last_updated', { ascending: false });

        if (boxesError) {
          console.error('Error fetching boxes:', boxesError);
          throw boxesError;
        }

        console.log('Raw boxes data:', {
          count: boxesResult?.length,
          sample: boxesResult?.slice(0, 1)
        });

        if (boxesResult && boxesResult.length > 0) {
          // Let's examine the first box's raw data structure
          const firstBox = boxesResult[0];
          console.log('First box raw data structure:');
          console.log('- Box name:', firstBox.box_name);
          console.log('- All items raw:', firstBox.all_items);
          console.log('- Sample all_items entry:', firstBox.all_items?.[0]);
          console.log('- Jackpot items raw:', firstBox.jackpot_items);
          console.log('- Sample jackpot_items entry:', firstBox.jackpot_items?.[0]);
          console.log('- Unwanted items raw:', firstBox.unwanted_items);
          console.log('- Tags raw:', firstBox.tags);
          
          const transformedBoxes = boxesResult.map((box, index) => {
            console.log(`\n=== Processing box ${index + 1}: ${box.box_name} ===`);
            
            // Parse all different item arrays with detailed logging
            const allItems = safeParseJSON(box.all_items);
            const jackpotItems = safeParseJSON(box.jackpot_items);
            const unwantedItems = safeParseJSON(box.unwanted_items);
            const tags = parseTagsArray(box.tags);
            
            console.log(`Final parsed results for ${box.box_name}:`);
            console.log('- All items count:', allItems.length);
            console.log('- All items sample:', allItems.slice(0, 3));
            console.log('- Jackpot items count:', jackpotItems.length);
            console.log('- Unwanted items count:', unwantedItems.length);
            console.log('- Tags:', tags);
            
            return {
              box_name: box.box_name || 'Unknown Box',
              box_price: Number(box.box_price) || 0,
              box_image: fixImagePath(box.box_image || 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=300&fit=crop'),
              expected_value_percent_of_price: Number(box.expected_value_percent) || 0,
              volatility_bucket: (box.volatility_bucket as 'Low' | 'Medium' | 'High') || 'Medium',
              standard_deviation_percent: Number(box.standard_deviation_percent) || 0,
              floor_rate_percent: Number(box.floor_rate_percent) || 0,
              category: box.category || 'General',
              tags: tags,
              jackpot_items: jackpotItems,
              unwanted_items: unwantedItems,
              all_items: allItems
            };
          });
          
          console.log('\n=== FINAL SUMMARY ===');
          console.log('Total transformed boxes:', transformedBoxes.length);
          
          // Show some stats about items with detailed logging
          const totalAllItems = transformedBoxes.reduce((sum, box) => sum + box.all_items.length, 0);
          const totalJackpotItems = transformedBoxes.reduce((sum, box) => sum + box.jackpot_items.length, 0);
          const boxesWithItems = transformedBoxes.filter(box => box.all_items.length > 0);
          
          console.log('Total all_items across all boxes:', totalAllItems);
          console.log('Total jackpot_items across all boxes:', totalJackpotItems);
          console.log('Boxes with items:', boxesWithItems.length);
          
          if (boxesWithItems.length > 0) {
            console.log('Sample box with items:', {
              name: boxesWithItems[0].box_name,
              all_items_count: boxesWithItems[0].all_items.length,
              sample_items: boxesWithItems[0].all_items.slice(0, 2)
            });
          }
          
          setBoxesData(transformedBoxes);
          const summary = calculateSummaryStats(boxesResult);
          setSummaryData(summary);
        }

        setLoading(false);
      } catch (err) {
        console.error('Error fetching RillaBox data:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { summaryData, boxesData, loading, error };
};
