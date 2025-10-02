
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Info, TrendingDown, TrendingUp, Zap } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { analyzePortfolioOutcomes } from '@/utils/outcomeAnalysis';
import type { PortfolioStrategy } from '@/types';

interface StrategyOutcomesProps {
  strategy: PortfolioStrategy;
}

const StrategyOutcomes: React.FC<StrategyOutcomesProps> = ({ strategy }) => {
  const scenarios = analyzePortfolioOutcomes(strategy);
  
  // Only 3 icons now for the simplified 3-bucket system  
  const icons = [
    <TrendingDown className="h-5 w-5" key="trending-down" />,
    <TrendingUp className="h-5 w-5" key="trending-up" />,
    <Zap className="h-5 w-5" key="zap" />
  ];
  
  const scenariosWithIcons = scenarios.map((scenario, index) => ({
    ...scenario,
    icon: icons[index]
  }));
  
  // Calculate reality check from actual probabilities
  const lossChance = scenariosWithIcons.find(s => s.label === "Most Likely")?.probability || 0;
  const profitChance = (scenariosWithIcons.find(s => s.label === "Profitable Return")?.probability || 0) + 
                      (scenariosWithIcons.find(s => s.label === "Jackpot")?.probability || 0);

  // Calculate total items for display
  const totalBoxes = strategy.boxes.reduce((sum, box) => sum + box.quantity, 0);
  const totalUniqueItems = strategy.boxes.reduce((sum, box) => sum + (box.box.all_items?.length || 0), 0);

  // Check if probabilities seem reasonable (should sum to roughly 100%)
  const totalProbability = scenariosWithIcons.reduce((sum, scenario) => sum + scenario.probability, 0);
  const probabilitiesLookValid = totalProbability > 80 && totalProbability < 120;

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="text-lg">What Will Probably Happen</CardTitle>
        <p className="text-sm text-gray-600">
          Portfolio-wide analysis of your ${strategy.totalCost.toFixed(2)} investment across {totalBoxes} boxes
        </p>
        {!probabilitiesLookValid && (
          <div className="text-xs text-amber-600 bg-amber-50 p-2 rounded">
            ⚠️ Data quality warning: Some boxes may have incomplete item data. Results may be less accurate.
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {scenariosWithIcons.map((scenario, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border-2 ${scenario.bgColor}`}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className={scenario.color}>
                  {scenario.icon}
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-gray-800">{scenario.label}</div>
                  <div className="text-xs text-gray-600">{scenario.description}</div>
                </div>
                <TooltipProvider delayDuration={0}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button className="p-1 hover:bg-white/50 rounded-full transition-colors">
                        <Info className="h-4 w-4 text-gray-400 hover:text-blue-500" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="left" className="max-w-sm p-4 bg-white border-blue-200 shadow-xl">
                      <div className="space-y-3">
                        <div className="font-semibold text-blue-600">{scenario.calculation.title}</div>
                        <div className="text-xs text-gray-500">
                          {scenario.calculation.totalItems} items contribute to this outcome
                        </div>
                        
                        <div className="space-y-1">
                          <div className="text-xs font-medium text-gray-700">Top contributing items:</div>
                          {scenario.calculation.items.slice(0, 5).map((item, i) => (
                            <div key={i} className="text-sm flex justify-between items-center">
                              <div className="flex-1 min-w-0">
                                <div className="font-medium truncate">{item.name}</div>
                                <div className="text-xs text-gray-500">{item.boxName}</div>
                              </div>
                              <div className="text-right ml-2">
                                <div className="text-xs font-mono">{item.chance.toFixed(2)}%</div>
                                <div className="text-xs text-gray-500">${item.value}</div>
                              </div>
                            </div>
                          ))}
                          {scenario.calculation.totalItems > 5 && (
                            <div className="text-xs text-gray-500 italic">
                              ...and {scenario.calculation.totalItems - 5} more items
                            </div>
                          )}
                        </div>
                        
                        <div className="bg-blue-50 p-2 rounded text-sm">
                          <div className="font-medium text-blue-700">Average Return per Box:</div>
                          <div className="text-blue-600">${scenario.calculation.avgReturn.toFixed(0)}</div>
                        </div>
                        
                        <div className="text-xs text-gray-500 italic pt-2 border-t">
                          {scenario.calculation.methodology}
                        </div>
                      </div>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              
              <div className="flex items-center justify-between mb-3">
                <div className={`text-xl font-bold ${scenario.color}`}>
                  {scenario.amount}
                </div>
                <div className="text-right">
                  <div className={`text-lg font-semibold ${scenario.color}`}>
                    {scenario.probability.toFixed(1)}%
                  </div>
                  <div className="text-xs text-gray-500">Chance</div>
                </div>
              </div>
              
              <div className="mt-3">
                <div className="w-full bg-gray-200 rounded-full h-3 relative overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      scenario.color.includes('red') ? 'bg-red-500' :
                      scenario.color.includes('green') ? 'bg-green-500' :
                      'bg-purple-500'
                    }`}
                    style={{ width: `${Math.max(scenario.probability, 2)}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="text-sm font-medium text-gray-700 mb-2">Reality Check:</div>
          <div className="text-sm text-gray-600 space-y-1">
            <div>
              Based on your ${strategy.totalCost.toFixed(2)} portfolio investment, there's a <span className="font-semibold text-red-600">
              {lossChance.toFixed(1)}% chance</span> you'll lose money overall.
            </div>
            <div>
              There's a <span className="font-semibold text-green-600">
              {profitChance.toFixed(1)}% chance</span> of making any profit on your total investment.
            </div>
            <div className="text-xs text-gray-500 mt-2">
              Probabilities sum to {totalProbability.toFixed(1)}% • {totalBoxes} boxes • {totalUniqueItems} unique items
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StrategyOutcomes;
