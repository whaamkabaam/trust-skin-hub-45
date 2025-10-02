
import type { RillaBoxMetricsBox, PortfolioStrategy } from '@/types';
import { calculateJackpotProbabilityPerDollar, getTopJackpotItem, buildPortfolioFromSortedBoxes } from './strategyUtils';

export const generateJackpotChaserStrategy = (
  boxesData: RillaBoxMetricsBox[], 
  budget: number
): PortfolioStrategy | null => {
  console.log('Generating Jackpot Chaser strategy - focusing on maximum jackpot potential');
  
  // Sort boxes by jackpot efficiency and potential
  const eligibleBoxes = boxesData
    .filter(box => 
      box.box_price > 0 && 
      box.box_price <= budget &&
      calculateJackpotProbabilityPerDollar(box) > 0 // Must have jackpot potential
    )
    .sort((a, b) => calculateJackpotProbabilityPerDollar(b) - calculateJackpotProbabilityPerDollar(a));

  console.log('Jackpot Chaser eligible boxes:', eligibleBoxes.length);

  if (eligibleBoxes.length === 0) {
    console.log('No eligible boxes for Jackpot Chaser strategy');
    return null;
  }

  const boxes = buildPortfolioFromSortedBoxes(eligibleBoxes, budget, 15); // Allow concentration for jackpots
  const totalCost = boxes.reduce((sum, item) => sum + item.cost, 0);
  
  // Find the highest value jackpot item across the entire portfolio
  let topJackpotItem: { name: string; value: number } | undefined;
  boxes.forEach(({ box }) => {
    const boxTopItem = getTopJackpotItem(box);
    if (boxTopItem && (!topJackpotItem || boxTopItem.value > topJackpotItem.value)) {
      topJackpotItem = { name: boxTopItem.name, value: boxTopItem.value };
    }
  });

  return {
    name: "The Jackpot Chaser",
    description: "⚠️ Maximum risk, maximum reward - chase the biggest prizes with acceptance of likely losses",
    boxes,
    totalCost,
    riskLevel: 'Very High',
    topJackpotItem,
    pros: [
      "Highest jackpot potential",
      "Best chance at life-changing wins", 
      "Maximum excitement factor"
    ],
    cons: [
      "Very high probability of loss",
      "Extremely volatile outcomes",
      "Not suitable for risk-averse players"
    ],
    worstCaseScenario: `High likelihood of significant loss - this is pure jackpot speculation`,
    keyMetric: {
      label: "Top Jackpot Prize",
      value: topJackpotItem ? `$${topJackpotItem.value.toLocaleString()}` : "N/A",
      tooltip: topJackpotItem ? `Biggest potential win: ${topJackpotItem.name}` : "Maximum potential prize in portfolio"
    }
  };
};
