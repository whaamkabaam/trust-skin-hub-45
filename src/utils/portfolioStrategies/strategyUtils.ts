
import type { RillaBoxMetricsBox, BoxAllocation } from '@/types';

// Helper function to calculate floor value per dollar
export const calculateFloorValuePerDollar = (box: RillaBoxMetricsBox): number => {
  if (box.box_price <= 0) return 0;
  return (box.floor_rate_percent || 0) / box.box_price;
};

// Helper function to calculate EV per dollar
export const calculateEVPerDollar = (box: RillaBoxMetricsBox): number => {
  if (box.box_price <= 0) return 0;
  return (box.expected_value_percent_of_price || 0) / 100;
};

// Helper function to calculate jackpot probability per dollar
export const calculateJackpotProbabilityPerDollar = (box: RillaBoxMetricsBox): number => {
  if (box.box_price <= 0 || !box.all_items) return 0;
  
  const jackpotChance = box.all_items
    .filter(item => (item.value / box.box_price) >= 5.0) // 500% ROI is jackpot
    .reduce((sum, item) => sum + item.drop_chance, 0);
    
  return jackpotChance / box.box_price;
};

// Helper function to get the highest value jackpot item in a box
export const getTopJackpotItem = (box: RillaBoxMetricsBox) => {
  if (!box.all_items) return null;
  
  const jackpotItems = box.all_items.filter(item => (item.value / box.box_price) >= 5.0);
  if (jackpotItems.length === 0) return null;
  
  return jackpotItems.reduce((max, item) => item.value > max.value ? item : max);
};

// Build portfolio from sorted boxes using greedy algorithm
export const buildPortfolioFromSortedBoxes = (
  sortedBoxes: RillaBoxMetricsBox[], 
  budget: number,
  maxQuantityPerBox: number = 10
): BoxAllocation[] => {
  const portfolio: BoxAllocation[] = [];
  let remainingBudget = budget;

  for (const box of sortedBoxes) {
    if (remainingBudget < box.box_price) continue;
    
    const maxAffordable = Math.floor(remainingBudget / box.box_price);
    const quantity = Math.min(maxAffordable, maxQuantityPerBox);
    
    if (quantity > 0) {
      const cost = quantity * box.box_price;
      portfolio.push({
        box,
        quantity,
        cost,
        reasoning: `Selected ${quantity}x for optimal strategy alignment`
      });
      remainingBudget -= cost;
    }
  }
  
  return portfolio;
};
