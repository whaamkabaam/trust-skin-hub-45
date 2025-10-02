
import type { RillaBoxMetricsBox, HuntResult } from '@/types';

// Search for items across all boxes
export const searchItems = (boxesData: RillaBoxMetricsBox[], query: string): string[] => {
  console.log('searchItems called with:', { query, boxesDataLength: boxesData.length });
  
  if (!query || query.length < 2) {
    console.log('Query too short or empty');
    return [];
  }
  
  const results = new Set<string>();
  const lowerQuery = query.toLowerCase();
  
  console.log('Starting search for:', lowerQuery);
  
  boxesData.forEach((box, boxIndex) => {
    if (box.all_items && Array.isArray(box.all_items)) {
      console.log(`Searching in box ${boxIndex}: ${box.box_name}, items count: ${box.all_items.length}`);
      
      box.all_items.forEach((item, itemIndex) => {
        if (item.name && item.name.toLowerCase().includes(lowerQuery)) {
          console.log(`Found matching item: ${item.name} in box: ${box.box_name}`);
          results.add(item.name);
        }
      });
    } else {
      console.log(`Box ${boxIndex} has no all_items or it's not an array:`, box.all_items);
    }
  });
  
  const finalResults = Array.from(results).slice(0, 10);
  console.log('Search completed. Found items:', finalResults);
  
  return finalResults;
};

// Generate hunt report for a specific item
export const generateHuntReport = (boxesData: RillaBoxMetricsBox[], itemName: string): HuntResult[] => {
  console.log('generateHuntReport called for item:', itemName);
  
  const results: HuntResult[] = [];
  
  boxesData.forEach(box => {
    if (box.all_items && Array.isArray(box.all_items)) {
      const targetItem = box.all_items.find(item => 
        item.name === itemName
      );
      
      if (targetItem && targetItem.drop_chance > 0) {
        const targetingCost = box.box_price / (targetItem.drop_chance / 100);
        
        console.log(`Found target item in box: ${box.box_name}, targeting cost: ${targetingCost}`);
        
        results.push({
          box,
          targetItem,
          targetingCost,
          rank: 0, // Will be set after sorting
          efficiency: targetingCost < 500 ? 'Excellent' : 
                     targetingCost < 1000 ? 'Good' : 'Poor'
        });
      }
    }
  });
  
  // Sort by targeting cost and assign ranks
  results.sort((a, b) => a.targetingCost - b.targetingCost);
  results.forEach((result, index) => {
    result.rank = index + 1;
  });
  
  console.log('Hunt report generated with', results.length, 'results');
  
  return results;
};
