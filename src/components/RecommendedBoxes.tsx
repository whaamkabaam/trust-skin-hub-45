
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ShoppingCart, ChevronDown, ChevronUp, TrendingUp, Shield, Zap } from 'lucide-react';
import type { BoxAllocation } from '@/types';

interface RecommendedBoxesProps {
  boxes: BoxAllocation[];
  totalCost: number;
}

const RecommendedBoxes: React.FC<RecommendedBoxesProps> = ({ boxes, totalCost }) => {
  const [isOpen, setIsOpen] = useState(false);
  const totalBoxes = boxes.reduce((sum, box) => sum + box.quantity, 0);
  
  // Calculate strategy insights
  const avgEV = boxes.reduce((sum, box) => sum + (box.box.expected_value_percent_of_price || 0) * box.quantity, 0) / totalBoxes;
  const avgCostPerBox = totalCost / totalBoxes;
  const topBoxes = boxes.slice(0, 3);
  const remainingCount = Math.max(0, boxes.length - 3);
  
  // Get strategy icon based on characteristics
  const getStrategyIcon = () => {
    if (avgEV > 80) return <TrendingUp className="h-5 w-5 text-green-600" />;
    if (boxes.some(box => (box.box.floor_rate_percent || 0) > 70)) return <Shield className="h-5 w-5 text-blue-600" />;
    return <Zap className="h-5 w-5 text-purple-600" />;
  };

  const getStrategyInsight = () => {
    if (avgEV > 80) return "High-value mathematical optimization";
    if (boxes.some(box => (box.box.floor_rate_percent || 0) > 70)) return "Conservative risk-managed approach";
    return "Balanced diversification strategy";
  };

  return (
    <Card className="mb-6 border-2 border-blue-200 bg-blue-50">
      <CardHeader 
        className="pb-4 cursor-pointer hover:bg-blue-100/50 transition-colors duration-300"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-2 rounded-full bg-blue-500 text-white">
              <ShoppingCart className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-xl text-blue-800 mb-1">Recommended Box Strategy</CardTitle>
              <div className="flex items-center gap-4 text-sm">
                <span className="font-semibold text-blue-700">
                  {totalBoxes} box{totalBoxes !== 1 ? 'es' : ''} • ${totalCost.toFixed(0)} total
                </span>
                <div className="flex items-center gap-1 text-blue-600">
                  {getStrategyIcon()}
                  <span className="font-medium">{getStrategyInsight()}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-blue-600">
            <span className="text-sm font-medium">
              {isOpen ? 'Hide details' : 'Show details'}
            </span>
            <div className="transition-transform duration-300 ease-out">
              {isOpen ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </div>
          </div>
        </div>
      </CardHeader>

      {/* Collapsible Content with Pure CSS Transitions */}
      <div 
        className={`overflow-hidden transition-all duration-300 ease-out ${
          isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-96 opacity-100'
        }`}
      >
        <CardContent className="pt-0 pb-6">
          <div className={`transition-opacity duration-300 ${isOpen ? 'opacity-0' : 'opacity-100'}`}>
            {/* Preview State Content */}
            {!isOpen && (
              <div className="space-y-4">
                {/* Strategy Summary Bar */}
                <div className="bg-white rounded-lg p-4 border border-blue-200 shadow-sm">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm font-medium text-gray-600">Strategy Breakdown</span>
                    <span className="text-xs text-blue-600 font-medium">Avg Cost: ${avgCostPerBox.toFixed(0)}</span>
                  </div>
                  
                  {/* Budget Utilization Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
                      style={{ width: '100%' }}
                    />
                  </div>
                  
                  {/* Top Boxes Preview */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {topBoxes.map((box, index) => (
                      <div key={index} className="flex items-center gap-2 bg-blue-50 rounded-lg px-3 py-1.5">
                        <img 
                          src={box.box.box_image || 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=40&h=40&fit=crop'} 
                          alt={box.box.box_name}
                          className="w-6 h-6 rounded object-cover"
                        />
                        <span className="text-xs font-semibold text-blue-700">
                          {box.quantity}x {box.box.box_name.length > 15 ? box.box.box_name.substring(0, 15) + '...' : box.box.box_name}
                        </span>
                        <span className="text-xs text-gray-500">
                          ${box.cost.toFixed(0)}
                        </span>
                      </div>
                    ))}
                    {remainingCount > 0 && (
                      <div className="bg-gray-100 rounded-lg px-3 py-1.5">
                        <span className="text-xs font-medium text-gray-600">
                          +{remainingCount} more
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Key Metrics Row */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-white rounded-lg p-3 text-center border border-blue-200">
                    <div className="text-lg font-bold text-blue-600">{totalBoxes}</div>
                    <div className="text-xs text-gray-600">Total Boxes</div>
                  </div>
                  <div className="bg-white rounded-lg p-3 text-center border border-blue-200">
                    <div className="text-lg font-bold text-green-600">${avgCostPerBox.toFixed(0)}</div>
                    <div className="text-xs text-gray-600">Avg Cost</div>
                  </div>
                  <div className="bg-white rounded-lg p-3 text-center border border-blue-200">
                    <div className="text-lg font-bold text-blue-600">${totalCost.toFixed(0)}</div>
                    <div className="text-xs text-gray-600">Total Cost</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className={`transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
            {/* Details State Content */}
            {isOpen && (
              <div className="space-y-4">
                {boxes.map((box, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 bg-white rounded-lg border border-blue-200 hover:shadow-md transition-shadow duration-300 ease-out">
                    <img 
                      src={box.box.box_image || 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=60&h=60&fit=crop'} 
                      alt={box.box.box_name}
                      className="w-16 h-16 rounded-lg object-cover border border-gray-200"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="text-lg font-bold text-blue-600">
                          Buy {box.quantity}x
                        </div>
                        <div className="text-lg font-semibold text-gray-800 truncate">
                          {box.box.box_name}
                        </div>
                      </div>
                      <div className="text-sm text-gray-600 mb-2">{box.reasoning}</div>
                      <div className="flex items-center gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Box Price: </span>
                          <span className="font-semibold">${box.box.box_price}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Total Cost: </span>
                          <span className="font-semibold text-blue-600">${box.cost.toFixed(0)}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">EV: </span>
                          <span className="font-semibold">{box.box.expected_value_percent_of_price.toFixed(1)}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </div>
    </Card>
  );
};

export default RecommendedBoxes;
