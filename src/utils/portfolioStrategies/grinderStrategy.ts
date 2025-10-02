
import type { RillaBoxMetricsBox, PortfolioStrategy } from '@/types';
import { calculateFloorValuePerDollar, buildPortfolioFromSortedBoxes } from './strategyUtils';

export const generateGrinderStrategy = (
  boxesData: RillaBoxMetricsBox[], 
  budget: number
): PortfolioStrategy | null => {
  console.log('Generating Grinder strategy - focusing on safety and consistency');
  
  // Filter and sort boxes by floor value efficiency + low volatility
  const eligibleBoxes = boxesData
    .filter(box => 
      box.box_price > 0 && 
      box.box_price <= budget &&
      (box.floor_rate_percent || 0) >= 3 // Minimum floor rate
    )
    .map(box => ({
      ...box,
      safetyScore: calculateFloorValuePerDollar(box) * 1000 - (box.standard_deviation_percent || 100) // Prefer low volatility
    }))
    .sort((a, b) => b.safetyScore - a.safetyScore);

  console.log('Grinder eligible boxes:', eligibleBoxes.length);

  if (eligibleBoxes.length === 0) {
    console.log('No eligible boxes for Grinder strategy');
    return null;
  }

  const boxes = buildPortfolioFromSortedBoxes(eligibleBoxes, budget, 5); // Conservative diversification
  const totalCost = boxes.reduce((sum, item) => sum + item.cost, 0);
  const portfolioFloorValue = boxes.reduce((sum, item) => {
    const floorValue = item.box.box_price * ((item.box.floor_rate_percent || 0) / 100);
    return sum + (floorValue * item.quantity);
  }, 0);

  return {
    name: "The Grinder",
    description: "Maximize safety and consistent returns - built for players who prioritize preserving capital",
    boxes,
    totalCost,
    riskLevel: 'Low',
    portfolioFloorValue,
    pros: [
      "Highest chance of making a profit",
      "Lowest risk of significant loss", 
      "Most predictable outcomes"
    ],
    cons: [
      "Limited upside potential",
      "Lower jackpot chances",
      "Conservative returns"
    ],
    worstCaseScenario: `Floor value provides approximately $${portfolioFloorValue.toFixed(0)} minimum return`,
    keyMetric: {
      label: "Safety Floor",
      value: `$${portfolioFloorValue.toFixed(0)}`,
      tooltip: "Minimum guaranteed value from this conservative portfolio"
    }
  };
};
