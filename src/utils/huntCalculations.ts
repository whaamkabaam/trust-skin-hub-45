import type { RillaBoxMetricsBox, BoxItem } from '@/types';

// Calculate expected money left after hunting for an item
export const calculateExpectedMoneyLeft = (
  box: RillaBoxMetricsBox, 
  targetItem: BoxItem, 
  targetingCost: number
): number => {
  if (!targetItem.drop_chance || targetItem.drop_chance <= 0) return 0;
  
  const boxesNeeded = Math.ceil(100 / targetItem.drop_chance);
  const expectedValue = (box.expected_value_percent_of_price || 0) / 100;
  const totalExpectedReturn = boxesNeeded * box.box_price * expectedValue;
  
  return totalExpectedReturn - targetingCost;
};

// Calculate the statistical cost range using geometric distribution
export const calculateCostRange = (
  boxPrice: number,
  dropChance: number
) => {
  if (!dropChance || dropChance <= 0) {
    return { low: 0, high: 0 };
  }

  const p = dropChance / 100; // Convert percentage to probability
  
  // For geometric distribution, calculate percentiles
  // 25th percentile: number of attempts where there's 25% chance of success by then
  const percentile25 = Math.ceil(Math.log(0.75) / Math.log(1 - p));
  // 75th percentile: number of attempts where there's 75% chance of success by then
  const percentile75 = Math.ceil(Math.log(0.25) / Math.log(1 - p));
  
  return {
    low: percentile25 * boxPrice,
    high: percentile75 * boxPrice
  };
};

// Calculate volatility-adjusted expected money left range
export const calculateExpectedMoneyLeftRange = (
  box: RillaBoxMetricsBox,
  targetItem: BoxItem,
  targetingCost: number
) => {
  if (!targetItem.drop_chance || targetItem.drop_chance <= 0) {
    return { low: 0, high: 0, profitProbability: 0, costRange: { low: 0, high: 0 } };
  }

  const baseEV = (box.expected_value_percent_of_price || 0) / 100;
  const standardDev = (box.standard_deviation_percent || 0) / 100;
  const floorRate = (box.floor_rate_percent || 0) / 100;
  const boxPrice = box.box_price;

  // Calculate actual cost range using geometric distribution
  const costRange = calculateCostRange(boxPrice, targetItem.drop_chance);
  
  // Scale-aware risk adjustments for extreme scenarios
  const isUltraRare = targetItem.drop_chance < 0.001;
  const isExpensiveHunt = targetingCost > 100000;
  const isMassiveScale = Math.ceil(100 / targetItem.drop_chance) > 50000;

  // Apply scaling penalties for extreme scenarios
  let scalingPenalty = 0;
  if (isUltraRare) scalingPenalty += 0.15;
  if (isExpensiveHunt) scalingPenalty += 0.10;
  if (isMassiveScale) scalingPenalty += Math.min(Math.ceil(100 / targetItem.drop_chance) / 500000, 0.20);

  // Adjusted effective EV accounting for practical limitations
  const effectiveEV = Math.max(0.5, baseEV - scalingPenalty);

  // Calculate expected returns for the cost range
  const conservativeMultiplier = Math.max(
    floorRate * 0.8,
    effectiveEV - (standardDev * 0.674)
  );
  const optimisticMultiplier = Math.min(
    effectiveEV + (standardDev * 0.674),
    effectiveEV + 0.15
  );

  // Calculate money left using actual cost range
  const lowReturn = (costRange.low / boxPrice) * boxPrice * conservativeMultiplier;
  const highReturn = (costRange.high / boxPrice) * boxPrice * optimisticMultiplier;
  
  const lowEstimate = lowReturn - costRange.low;
  const highEstimate = highReturn - costRange.high;

  // Recalibrated profit probability calculation
  const breakEvenMultiplier = targetingCost / (Math.ceil(100 / targetItem.drop_chance) * boxPrice);
  const adjustedZScore = (breakEvenMultiplier - effectiveEV) / Math.max(standardDev, 0.05);
  
  let baseProfitProb = Math.max(0, Math.min(100, (1 - normalCDF(adjustedZScore)) * 100));
  
  // Scale-based probability penalties
  if (isUltraRare) baseProfitProb *= 0.6;
  if (isExpensiveHunt) baseProfitProb *= 0.7;
  if (isMassiveScale) baseProfitProb *= Math.max(0.4, 1 - (Math.ceil(100 / targetItem.drop_chance) / 200000));
  
  if (lowEstimate < 0 && highEstimate < 0) {
    baseProfitProb *= 0.3;
  } else if (lowEstimate < 0) {
    baseProfitProb *= 0.75;
  }

  const profitProbability = Math.max(1, Math.min(95, baseProfitProb));

  return {
    low: Math.round(lowEstimate),
    high: Math.round(highEstimate),
    profitProbability: Math.round(profitProbability),
    costRange: {
      low: Math.round(costRange.low),
      high: Math.round(costRange.high)
    }
  };
};

// Normal cumulative distribution function approximation
const normalCDF = (z: number): number => {
  if (z < -6) return 0;
  if (z > 6) return 1;
  
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const d = 0.3989423 * Math.exp(-z * z / 2);
  let prob = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  
  return z > 0 ? 1 - prob : prob;
};

// Get range color and styling based on profit potential
export const getRangeColor = (low: number, high: number, profitProbability: number) => {
  if (low >= 0 && high >= 0) {
    return {
      colorClass: 'text-green-700 bg-green-100 border-green-300',
      label: 'Likely Profit',
      bgClass: 'bg-green-50'
    };
  } else if (low < 0 && high > 0) {
    return {
      colorClass: profitProbability > 25 ? 'text-yellow-700 bg-yellow-100 border-yellow-300' : 'text-orange-700 bg-orange-100 border-orange-300',
      label: profitProbability > 25 ? 'Mixed Outcome' : 'High Risk',
      bgClass: profitProbability > 25 ? 'bg-yellow-50' : 'bg-orange-50'
    };
  } else {
    return {
      colorClass: 'text-red-700 bg-red-100 border-red-300',
      label: 'Likely Loss',
      bgClass: 'bg-red-50'
    };
  }
};

// Format drop chance with proper mathematical precision
export const formatDropChance = (dropChance: number) => {
  if (!dropChance || isNaN(dropChance)) return { percentage: '0%', ratio: '1 in ∞ boxes' };
  
  // Convert to percentage with appropriate precision
  const percentage = dropChance;
  let percentageStr: string;
  
  if (percentage >= 1) {
    percentageStr = `${percentage.toFixed(1).replace(/\.0$/, '')}%`;
  } else if (percentage >= 0.1) {
    percentageStr = `${percentage.toFixed(2).replace(/\.?0+$/, '')}%`;
  } else if (percentage >= 0.01) {
    percentageStr = `${percentage.toFixed(3).replace(/\.?0+$/, '')}%`;
  } else if (percentage >= 0.001) {
    percentageStr = `${percentage.toFixed(4).replace(/\.?0+$/, '')}%`;
  } else if (percentage >= 0.0001) {
    percentageStr = `${percentage.toFixed(5).replace(/\.?0+$/, '')}%`;
  } else {
    // For extremely rare items, use scientific notation or very high precision
    percentageStr = `${percentage.toFixed(6).replace(/\.?0+$/, '')}%`;
  }
  
  // Calculate exact ratio without rounding for precision
  const exactRatio = Math.round(100 / percentage);
  
  return {
    percentage: percentageStr,
    ratio: `1 in ${exactRatio.toLocaleString()} boxes`
  };
};

// Format cost with proper rounding (no cents)
export const formatCost = (cost: number) => {
  return Math.round(cost);
};

// Get cost indicator with improved visual styling
export const getCostIndicator = (cost: number) => {
  const roundedCost = formatCost(cost);
  const formattedCost = `$${roundedCost.toLocaleString()}`;
  
  let colorClass = '';
  let indicator = '';
  let label = '';
  
  if (cost < 500) {
    colorClass = 'text-green-700 bg-green-100 border-green-300';
    indicator = '🟢';
    label = 'Excellent';
  } else if (cost < 2000) {
    colorClass = 'text-yellow-700 bg-yellow-100 border-yellow-300';
    indicator = '🟡';
    label = 'Good';
  } else if (cost < 10000) {
    colorClass = 'text-orange-700 bg-orange-100 border-orange-300';
    indicator = '🟠';
    label = 'Fair';
  } else {
    colorClass = 'text-red-700 bg-red-100 border-red-300';
    indicator = '🔴';
    label = 'Poor';
  }
  
  return { formattedCost, colorClass, indicator, label };
};
