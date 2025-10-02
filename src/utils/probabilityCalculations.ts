
import type { RillaBoxMetricsBox, BoxItem } from '@/types';

export interface ProbabilityBucket {
  min: number;
  max: number;
  probability: number;
  label: string;
}

export interface PortfolioProbabilityData {
  buckets: ProbabilityBucket[];
  mostLikelyRange: string;
  profitProbability: number;
  totalCost: number;
}

// Simplified and more realistic probability calculation
export const calculatePortfolioProbability = (
  boxes: { box: RillaBoxMetricsBox; quantity: number; cost: number }[]
): PortfolioProbabilityData => {
  const totalCost = boxes.reduce((sum, item) => sum + item.cost, 0);
  
  // Calculate weighted averages for the portfolio
  let totalWeight = 0;
  let weightedFloorRate = 0;
  let weightedEV = 0;
  
  boxes.forEach(({ box, cost }) => {
    const weight = cost / totalCost;
    totalWeight += weight;
    weightedFloorRate += (box.floor_rate_percent || 30) * weight;
    weightedEV += box.expected_value_percent_of_price * weight;
  });
  
  // Most likely return is based on floor rates (what you typically get)
  const mostLikelyReturn = totalCost * (weightedFloorRate / 100);
  const mostLikelyLoss = totalCost - mostLikelyReturn;
  
  // Simple probability calculation based on EV and floor rates
  const profitProbability = Math.max(0, Math.min(35, (weightedEV - 50) / 2)); // Cap at 35%
  
  // Create simple buckets for the most common scenarios
  const buckets: ProbabilityBucket[] = [
    {
      min: mostLikelyReturn - mostLikelyReturn * 0.2,
      max: mostLikelyReturn + mostLikelyReturn * 0.2,
      probability: 0.7, // 70% chance of getting close to floor value
      label: `$${Math.round(mostLikelyReturn - mostLikelyReturn * 0.2)}-${Math.round(mostLikelyReturn + mostLikelyReturn * 0.2)}`
    },
    {
      min: totalCost * 0.9,
      max: totalCost * 1.1,
      probability: 0.15, // 15% chance of breaking even
      label: `$${Math.round(totalCost * 0.9)}-${Math.round(totalCost * 1.1)}`
    },
    {
      min: totalCost * 1.2,
      max: totalCost * 2,
      probability: profitProbability / 100 * 0.8, // Most of profit probability in moderate gains
      label: `$${Math.round(totalCost * 1.2)}-${Math.round(totalCost * 2)}`
    },
    {
      min: totalCost * 2,
      max: totalCost * 5,
      probability: profitProbability / 100 * 0.2, // Small chance of big wins
      label: `$${Math.round(totalCost * 2)}-${Math.round(totalCost * 5)}`
    }
  ];
  
  // Find most likely bucket
  const mostLikelyBucket = buckets.reduce((max, bucket) => 
    bucket.probability > max.probability ? bucket : max
  );
  
  return {
    buckets: buckets.filter(bucket => bucket.probability > 0.01), // Only show meaningful probabilities
    mostLikelyRange: `$${Math.round(mostLikelyReturn - mostLikelyLoss)} to $${Math.round(mostLikelyReturn + mostLikelyLoss)}`,
    profitProbability: profitProbability,
    totalCost
  };
};
