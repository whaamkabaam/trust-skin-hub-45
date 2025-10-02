
import type { RillaBoxMetricsBox, PortfolioStrategy } from '@/types';
import { calculateEVPerDollar, buildPortfolioFromSortedBoxes } from './strategyUtils';

export const generateValueHunterStrategy = (
  boxesData: RillaBoxMetricsBox[], 
  budget: number
): PortfolioStrategy | null => {
  console.log('Generating Value Hunter strategy - focusing on mathematical edge');
  
  // Sort boxes purely by EV efficiency
  const eligibleBoxes = boxesData
    .filter(box => 
      box.box_price > 0 && 
      box.box_price <= budget &&
      (box.expected_value_percent_of_price || 0) > 60 // Minimum 60% return
    )
    .sort((a, b) => calculateEVPerDollar(b) - calculateEVPerDollar(a));

  console.log('Value Hunter eligible boxes:', eligibleBoxes.length);

  if (eligibleBoxes.length === 0) {
    console.log('No eligible boxes for Value Hunter strategy');
    return null;
  }

  const boxes = buildPortfolioFromSortedBoxes(eligibleBoxes, budget, 8); // Balanced diversification
  const totalCost = boxes.reduce((sum, item) => sum + item.cost, 0);
  const totalExpectedValue = boxes.reduce((sum, item) => {
    const boxEV = item.box.box_price * calculateEVPerDollar(item.box);
    return sum + (boxEV * item.quantity);
  }, 0);

  return {
    name: "The Value Hunter", 
    description: "Maximize mathematical expected value - for players who trust the numbers",
    boxes,
    totalCost,
    riskLevel: 'Medium',
    pros: [
      "Best mathematical expected returns",
      "Balanced risk-reward profile",
      "Data-driven optimization"
    ],
    cons: [
      "Moderate volatility",
      "No guaranteed profits",
      "Requires statistical patience"
    ],
    worstCaseScenario: `Expected value of $${totalExpectedValue.toFixed(0)} with moderate variance`,
    keyMetric: {
      label: "Expected Value",
      value: `$${totalExpectedValue.toFixed(0)}`,
      tooltip: "Mathematical expected return based on all item probabilities"
    }
  };
};
