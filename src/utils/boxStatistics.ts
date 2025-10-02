
interface BoxItem {
  name: string;
  value: number;
  drop_chance: number;
  image?: string;
  type?: string;
}

export interface CategoryStats {
  totalDropRate: number;
  evContribution: number;
  evContributionDollars: number;
  oddsToEvRatio: number;
  averageValue: number;
  maxValue: number;
  minValue: number;
  itemCount: number;
  breakEvenOdds?: number;
}

export const calculateBreakEvenOdds = (items: BoxItem[], boxPrice: number): number => {
  if (!items || items.length === 0 || boxPrice <= 0) return 0;
  
  // Filter items where value >= box price (break-even or profitable)
  const breakEvenItems = items.filter(item => (item.value || 0) >= boxPrice);
  
  // Sum up their drop chances
  const breakEvenChance = breakEvenItems.reduce((sum, item) => sum + (item.drop_chance || 0), 0);
  
  console.log(`Break-even items count: ${breakEvenItems.length}, Total break-even chance: ${(breakEvenChance * 100).toFixed(4)}%`);
  
  return breakEvenChance * 100; // Convert to percentage
};

export const calculateFloorRate = (items: BoxItem[], boxPrice: number): number => {
  if (!items || items.length === 0 || boxPrice <= 0) return 0;
  
  // Find the minimum item value
  const validItems = items.filter(item => item.value && item.value > 0);
  if (validItems.length === 0) return 0;
  
  const minValue = Math.min(...validItems.map(item => item.value));
  
  // Calculate floor rate as percentage of box price
  const floorRate = (minValue / boxPrice) * 100;
  
  console.log(`Floor rate calculation: Min value: $${minValue}, Box price: $${boxPrice}, Floor rate: ${floorRate.toFixed(2)}%`);
  
  return Math.min(floorRate, 100); // Cap at 100%
};

export const calculateCategoryStats = (
  items: BoxItem[],
  boxPrice: number
): CategoryStats => {
  if (!items || items.length === 0) {
    return {
      totalDropRate: 0,
      evContribution: 0,
      evContributionDollars: 0,
      oddsToEvRatio: 0,
      averageValue: 0,
      maxValue: 0,
      minValue: 0,
      itemCount: 0,
      breakEvenOdds: 0
    };
  }

  // Calculate total drop rate (sum of all individual drop chances)
  const totalDropRate = items.reduce((sum, item) => sum + (item.drop_chance || 0), 0);
  
  // Calculate EV contribution in dollars: sum(value * drop_chance)
  // This represents the expected dollar value contribution from this category
  const evContributionDollars = items.reduce((sum, item) => {
    const itemEV = (item.value || 0) * (item.drop_chance || 0);
    console.log(`Item: ${item.name}, Value: $${item.value}, Drop Rate: ${(item.drop_chance * 100).toFixed(4)}%, EV Contribution: $${itemEV.toFixed(4)}`);
    return sum + itemEV;
  }, 0);
  
  console.log(`Category EV Contribution Total: $${evContributionDollars.toFixed(4)}`);
  
  // Convert to percentage of box price
  const evContribution = boxPrice > 0 ? (evContributionDollars / boxPrice) * 100 : 0;
  
  // Calculate odds to EV ratio: totalDropRate / evContribution
  // Higher ratio = better odds relative to EV contribution
  const oddsToEvRatio = evContribution > 0 ? (totalDropRate * 100) / evContribution : 0;
  
  // Calculate value statistics
  const values = items.map(item => item.value || 0).filter(v => v > 0);
  const averageValue = values.length > 0 ? values.reduce((sum, val) => sum + val, 0) / values.length : 0;
  const maxValue = values.length > 0 ? Math.max(...values) : 0;
  const minValue = values.length > 0 ? Math.min(...values) : 0;
  
  // Calculate break-even odds
  const breakEvenOdds = calculateBreakEvenOdds(items, boxPrice);
  
  return {
    totalDropRate,
    evContribution,
    evContributionDollars,
    oddsToEvRatio,
    averageValue,
    maxValue,
    minValue,
    itemCount: items.length,
    breakEvenOdds
  };
};

export const calculateLossChance = (allItems: BoxItem[], boxPrice: number): number => {
  if (!allItems || allItems.length === 0 || boxPrice <= 0) {
    console.warn('Loss chance calculation: Invalid input data');
    return 100;
  }
  
  // Enhanced validation and debugging
  console.log(`Loss chance calculation for box price: $${boxPrice}`);
  console.log(`Total items to analyze: ${allItems.length}`);
  
  // Validate drop chances and filter valid items
  const validItems = allItems.filter(item => {
    const hasValidDropChance = typeof item.drop_chance === 'number' && !isNaN(item.drop_chance) && item.drop_chance >= 0;
    const hasValidValue = typeof item.value === 'number' && !isNaN(item.value) && item.value >= 0;
    
    if (!hasValidDropChance) {
      console.warn(`Item "${item.name}" has invalid drop chance:`, item.drop_chance);
    }
    if (!hasValidValue) {
      console.warn(`Item "${item.name}" has invalid value:`, item.value);
    }
    
    return hasValidDropChance && hasValidValue;
  });
  
  console.log(`Valid items after filtering: ${validItems.length}`);
  
  if (validItems.length === 0) {
    console.warn('No valid items found for loss chance calculation');
    return 100;
  }
  
  // Calculate total drop rate for validation
  const totalDropRate = validItems.reduce((sum, item) => sum + item.drop_chance, 0);
  console.log(`Total drop rate sum: ${(totalDropRate * 100).toFixed(4)}%`);
  
  // Warn if drop rates don't sum to approximately 100%
  if (totalDropRate < 0.95 || totalDropRate > 1.05) {
    console.warn(`Warning: Drop rates sum to ${(totalDropRate * 100).toFixed(2)}%, expected ~100%`);
  }
  
  // Calculate items that cause a loss (value < box price)
  const losingItems = validItems.filter(item => item.value < boxPrice);
  const losingChance = losingItems.reduce((sum, item) => sum + item.drop_chance, 0);
  
  // Alternative calculation: profit chance = items with value >= box price
  const profitItems = validItems.filter(item => item.value >= boxPrice);
  const profitChance = profitItems.reduce((sum, item) => sum + item.drop_chance, 0);
  const alternativeLossChance = Math.max(0, totalDropRate - profitChance);
  
  console.log(`Losing items count: ${losingItems.length}`);
  console.log(`Profit items count: ${profitItems.length}`);
  console.log(`Direct loss chance: ${(losingChance * 100).toFixed(4)}%`);
  console.log(`Alternative loss chance (100% - profit): ${(alternativeLossChance * 100).toFixed(4)}%`);
  
  // Use the more conservative (lower) estimate, but validate it makes sense
  let finalLossChance = losingChance;
  
  // Data validation: if all items are profitable, loss chance should be 0
  if (profitItems.length === validItems.length && profitItems.length > 0) {
    console.log('All items are profitable, setting loss chance to 0%');
    finalLossChance = 0;
  }
  // If calculations are very different, use the alternative method
  else if (Math.abs(losingChance - alternativeLossChance) > 0.1) {
    console.warn('Large discrepancy between calculation methods, using alternative');
    finalLossChance = alternativeLossChance;
  }
  
  // Normalize if drop rates don't sum to 100%
  if (totalDropRate > 0 && (totalDropRate < 0.95 || totalDropRate > 1.05)) {
    console.log('Normalizing loss chance due to drop rate sum != 100%');
    finalLossChance = (finalLossChance / totalDropRate);
  }
  
  const result = Math.min(Math.max(finalLossChance * 100, 0), 100); // Convert to percentage, clamp 0-100%
  console.log(`Final loss chance: ${result.toFixed(2)}%`);
  
  return result;
};
