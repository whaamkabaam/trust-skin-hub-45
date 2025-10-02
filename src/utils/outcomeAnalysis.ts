


import type { PortfolioStrategy, OutcomeItem, OutcomeScenario } from '@/types';

interface BoxOutcomes {
  loss: { probability: number; avgValue: number; items: OutcomeItem[] };
  profitable: { probability: number; avgValue: number; items: OutcomeItem[] };
  jackpot: { probability: number; avgValue: number; items: OutcomeItem[] };
}

export function analyzePortfolioOutcomes(strategy: PortfolioStrategy): OutcomeScenario[] {
  const totalBoxes = strategy.boxes.reduce((sum, box) => sum + box.quantity, 0);
  
  if (totalBoxes === 0) {
    return [];
  }

  // Initialize portfolio-wide buckets
  const portfolioBuckets: Record<string, { totalWeightedProbability: number; totalWeightedValue: number; items: OutcomeItem[] }> = {
    loss: { totalWeightedProbability: 0, totalWeightedValue: 0, items: [] },
    profitable: { totalWeightedProbability: 0, totalWeightedValue: 0, items: [] }, 
    jackpot: { totalWeightedProbability: 0, totalWeightedValue: 0, items: [] }
  };

  // Calculate weighted probabilities across the entire portfolio
  strategy.boxes.forEach(allocation => {
    const { box, quantity } = allocation;

    if (!box.all_items || box.all_items.length === 0) return;

    box.all_items.forEach(item => {
      const roi = item.value / box.box_price;
      const weightedChance = item.drop_chance * quantity;
      const weightedValue = item.value * weightedChance;
      
      const outcomeItem: OutcomeItem = {
        name: item.name,
        value: item.value,
        chance: item.drop_chance, // FIXED: Keep original drop chance for tooltip display
        boxName: box.box_name,
        roi: roi
      };

      // Categorize into 3 buckets
      if (roi < 1.0) {
        portfolioBuckets.loss.totalWeightedProbability += weightedChance;
        portfolioBuckets.loss.totalWeightedValue += weightedValue;
        portfolioBuckets.loss.items.push(outcomeItem);
      } else if (roi < 5.0) {
        portfolioBuckets.profitable.totalWeightedProbability += weightedChance;
        portfolioBuckets.profitable.totalWeightedValue += weightedValue;
        portfolioBuckets.profitable.items.push(outcomeItem);
      } else {
        portfolioBuckets.jackpot.totalWeightedProbability += weightedChance;
        portfolioBuckets.jackpot.totalWeightedValue += weightedValue;
        portfolioBuckets.jackpot.items.push(outcomeItem);
      }
    });
  });

  // Calculate total probability mass correctly
  const totalProbabilityMass = portfolioBuckets.loss.totalWeightedProbability + 
                               portfolioBuckets.profitable.totalWeightedProbability + 
                               portfolioBuckets.jackpot.totalWeightedProbability;

  // Sort items within each bucket for better tooltip display
  portfolioBuckets.loss.items.sort((a, b) => a.value - b.value);
  portfolioBuckets.profitable.items.sort((a, b) => b.value - a.value);
  portfolioBuckets.jackpot.items.sort((a, b) => b.value - a.value);

  // Helper function to calculate scenario metrics
  const calculateScenarioMetrics = (bucket: { totalWeightedProbability: number; totalWeightedValue: number; items: OutcomeItem[] }) => {
    if (bucket.totalWeightedProbability === 0 || totalProbabilityMass === 0) {
      return { 
        avgReturnPerBox: 0, 
        totalPortfolioReturn: 0,
        totalPortfolioProfitLoss: -strategy.totalCost,
        finalProbability: 0
      };
    }
    
    const avgReturnPerBox = bucket.totalWeightedValue / bucket.totalWeightedProbability;
    const totalPortfolioReturn = avgReturnPerBox * totalBoxes;
    const totalPortfolioProfitLoss = totalPortfolioReturn - strategy.totalCost;
    const finalProbability = (bucket.totalWeightedProbability / totalProbabilityMass) * 100;
    
    return { avgReturnPerBox, totalPortfolioReturn, totalPortfolioProfitLoss, finalProbability };
  };

  const lossMetrics = calculateScenarioMetrics(portfolioBuckets.loss);
  const profitableMetrics = calculateScenarioMetrics(portfolioBuckets.profitable);
  const jackpotMetrics = calculateScenarioMetrics(portfolioBuckets.jackpot);

  // Create scenarios with proper probabilities and portfolio-wide amounts
  const scenarios: OutcomeScenario[] = [
    {
      icon: null,
      label: "Most Likely",
      description: "Getting items worth less than you paid",
      amount: lossMetrics.totalPortfolioProfitLoss >= 0 
        ? `+$${Math.abs(lossMetrics.totalPortfolioProfitLoss).toFixed(0)}`
        : `-$${Math.abs(lossMetrics.totalPortfolioProfitLoss).toFixed(0)}`,
      probability: lossMetrics.finalProbability,
      color: 'text-red-600',
      bgColor: 'bg-red-50 border-red-200',
      calculation: {
        title: "Loss Items (ROI < 100%)",
        items: portfolioBuckets.loss.items.slice(0, 5),
        methodology: `Items worth less than box price. Shows total outcome for your $${strategy.totalCost} portfolio if this scenario occurs.`,
        totalItems: portfolioBuckets.loss.items.length,
        avgReturn: lossMetrics.avgReturnPerBox
      }
    },
    {
      icon: null,
      label: "Profitable Return",
      description: "Getting items worth more than you paid",
      amount: profitableMetrics.totalPortfolioProfitLoss >= 0 
        ? `+$${Math.abs(profitableMetrics.totalPortfolioProfitLoss).toFixed(0)}`
        : `-$${Math.abs(profitableMetrics.totalPortfolioProfitLoss).toFixed(0)}`,
      probability: profitableMetrics.finalProbability,
      color: 'text-green-600',
      bgColor: 'bg-green-50 border-green-200',
      calculation: {
        title: "Profitable Items (ROI 100-500%)",
        items: portfolioBuckets.profitable.items.slice(0, 5),
        methodology: `Items worth more than box price but less than 5x. Shows total profit for your $${strategy.totalCost} portfolio.`,
        totalItems: portfolioBuckets.profitable.items.length,
        avgReturn: profitableMetrics.avgReturnPerBox
      }
    },
    {
      icon: null,
      label: "Jackpot",
      description: "Getting the big items",
      amount: jackpotMetrics.totalPortfolioProfitLoss >= 0 
        ? `+$${Math.abs(jackpotMetrics.totalPortfolioProfitLoss).toFixed(0)}`
        : `-$${Math.abs(jackpotMetrics.totalPortfolioProfitLoss).toFixed(0)}`,
      probability: jackpotMetrics.finalProbability,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50 border-purple-200',
      calculation: {
        title: "Jackpot Items (ROI > 500%)",
        items: portfolioBuckets.jackpot.items.slice(0, 5),
        methodology: `Items worth more than 5x box price. Shows total profit for your $${strategy.totalCost} portfolio.`,
        totalItems: portfolioBuckets.jackpot.items.length,
        avgReturn: jackpotMetrics.avgReturnPerBox
      }
    }
  ];

  return scenarios;
}
