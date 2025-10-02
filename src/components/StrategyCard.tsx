
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, TrendingUp, Zap, Target, AlertTriangle } from 'lucide-react';
import RecommendedBoxes from './RecommendedBoxes';
import StrategyOutcomes from './StrategyOutcomes';
import type { PortfolioStrategy } from '@/types';

interface StrategyCardProps {
  strategy: PortfolioStrategy;
  index: number;
}

const StrategyCard: React.FC<StrategyCardProps> = ({ strategy, index }) => {
  const getStrategyIcon = (strategyName: string) => {
    switch (strategyName) {
      case 'The Grinder': return Shield;
      case 'The Value Hunter': return TrendingUp;
      case 'The Jackpot Chaser': return Zap;
      default: return Target;
    }
  };

  const getStrategyTheme = (strategyName: string) => {
    switch (strategyName) {
      case 'The Grinder': return 'border-green-200 bg-green-50';
      case 'The Value Hunter': return 'border-blue-200 bg-blue-50';
      case 'The Jackpot Chaser': return 'border-red-200 bg-red-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'Low': return 'bg-green-100 text-green-700 border-green-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'High': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Very High': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const StrategyIcon = getStrategyIcon(strategy.name);

  return (
    <Card className={`glass-edge hover:shadow-xl transition-all ${getStrategyTheme(strategy.name)}`}>
      <CardHeader>
        <div className="flex items-center gap-3 mb-2">
          <StrategyIcon className="h-6 w-6 text-gray-700" />
          <CardTitle className="text-xl text-gray-800">{strategy.name}</CardTitle>
        </div>
        <p className="text-sm text-gray-600">{strategy.description}</p>
        
        {strategy.name === 'The Jackpot Chaser' && (
          <div className="flex items-center gap-2 mt-2 p-2 bg-red-100 rounded-lg">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <span className="text-xs text-red-700 font-medium">
              High Risk: Most likely outcome is significant loss
            </span>
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Strategy Overview */}
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Total Cost:</span>
            <div className="font-semibold">${strategy.totalCost.toFixed(0)}</div>
          </div>
          <div>
            <span className="text-gray-500">Risk Level:</span>
            <div className={`inline-block px-2 py-1 rounded text-xs font-medium border ${getRiskColor(strategy.riskLevel)}`}>
              {strategy.riskLevel}
            </div>
          </div>
          <div>
            <span className="text-gray-500">Total Boxes:</span>
            <div className="font-semibold">{strategy.boxes.reduce((sum, box) => sum + box.quantity, 0)}</div>
          </div>
        </div>

        {/* Recommended Boxes - Now at the top */}
        <RecommendedBoxes 
          boxes={strategy.boxes} 
          totalCost={strategy.totalCost} 
        />

        {/* Simple Outcomes Visualization */}
        <StrategyOutcomes strategy={strategy} />
      </CardContent>
    </Card>
  );
};

export default StrategyCard;
