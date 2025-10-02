
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Shield, Zap, Gem } from 'lucide-react';
import { FilterState } from '@/types/filters';
import { useQuickFilters } from '@/hooks/useQuickFilters';

interface QuickFiltersProps {
  onApplyQuickFilter: (filterType: string) => void;
  currentFilters: FilterState;
  initialFilters: FilterState;
}

const QuickFilters: React.FC<QuickFiltersProps> = ({
  onApplyQuickFilter,
  currentFilters,
  initialFilters
}) => {
  const { quickFilters } = useQuickFilters(initialFilters);

  const getIcon = (filterId: string) => {
    switch (filterId) {
      case 'positive-ev': return TrendingUp;
      case 'balanced-risk': return Shield;
      case 'thrill-seeker': return Zap;
      case 'jackpot-hunter': return Gem;
      default: return TrendingUp;
    }
  };

  console.log('QuickFilters render - Current filters:', currentFilters);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-gray-800">Quick Filters</h4>
        <div className="text-xs text-gray-500">Data-driven thresholds</div>
      </div>
      
      <div className="grid grid-cols-1 gap-3">
        {quickFilters.map((filter) => {
          const Icon = getIcon(filter.id);
          const isActive = filter.isActive(currentFilters, initialFilters);
          
          console.log(`Filter ${filter.id} - Active: ${isActive}`);
          
          return (
            <Button
              key={filter.id}
              variant={isActive ? "default" : "outline"}
              size="sm"
              onClick={() => {
                console.log('Clicked quick filter:', filter.id);
                onApplyQuickFilter(filter.id);
              }}
              className={`justify-start h-auto p-4 transition-all duration-200 relative overflow-hidden ${
                isActive 
                  ? 'bg-purple-600 hover:bg-purple-700 text-white shadow-md border-purple-600' 
                  : 'hover:bg-purple-50 hover:border-purple-300 hover:shadow-sm bg-white border-gray-200'
              }`}
            >
              <div className="flex items-center gap-3 w-full min-w-0">
                <div className={`flex-shrink-0 p-1.5 rounded-full ${
                  isActive ? 'bg-white/20' : 'bg-purple-100'
                }`}>
                  <Icon className={`h-4 w-4 ${
                    isActive ? 'text-white' : 'text-purple-600'
                  }`} />
                </div>
                
                <div className="text-left flex-1 min-w-0">
                  <div className={`font-semibold text-sm mb-1 ${
                    isActive ? 'text-white' : 'text-gray-800'
                  }`}>
                    {filter.label}
                  </div>
                  <div className={`text-xs leading-relaxed ${
                    isActive ? 'text-purple-100' : 'text-gray-600'
                  }`}>
                    {filter.description}
                  </div>
                </div>
                
                {isActive && (
                  <Badge 
                    variant="secondary" 
                    className="bg-white/20 text-white text-xs font-medium border-0 flex-shrink-0"
                  >
                    Active
                  </Badge>
                )}
              </div>
              
              {/* Active indicator line */}
              {isActive && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-white/40 rounded-r" />
              )}
            </Button>
          );
        })}
      </div>
      
      <div className="text-xs text-gray-500 bg-gray-50 rounded-lg p-3 border border-gray-200">
        <div className="font-medium text-gray-700 mb-1">💡 Filter Guide</div>
        <ul className="space-y-1">
          <li>• <strong>True Positive EV:</strong> 100%+ expected value (actual profit)</li>
          <li>• <strong>Balanced Risk:</strong> 40%+ floor rate with controlled volatility</li>
          <li>• <strong>Thrill Seeker:</strong> 1000%+ volatility for maximum excitement</li>
          <li>• <strong>Jackpot Hunter:</strong> $1000+ jackpot value with high volatility</li>
        </ul>
      </div>
    </div>
  );
};

export default QuickFilters;
