
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bookmark, Star, TrendingUp, Shield } from 'lucide-react';
import { FilterState } from '@/types/filters';

interface FilterPresetsProps {
  onApplyPreset: (presetId: string) => void;
  onSavePreset: () => void;
  currentFilters: FilterState;
}

const FilterPresets: React.FC<FilterPresetsProps> = ({
  onApplyPreset,
  onSavePreset,
  currentFilters
}) => {
  const presets = [
    {
      id: 'value-hunter',
      name: 'Value Hunter',
      description: 'High EV, low risk boxes',
      icon: TrendingUp,
      filters: {
        expectedValueRange: { min: 20, max: 200 },
        floorRateRange: { min: 70, max: 100 },
        volatilityBuckets: ['Low', 'Medium'] as ('Low' | 'Medium' | 'High')[]
      }
    },
    {
      id: 'safe-investor',
      name: 'Safe Investor',
      description: 'Conservative, stable boxes',
      icon: Shield,
      filters: {
        floorRateRange: { min: 85, max: 100 },
        volatilityBuckets: ['Low'] as ('Low' | 'Medium' | 'High')[]
      }
    },
    {
      id: 'jackpot-chaser',
      name: 'Jackpot Chaser',
      description: 'High-value jackpot potential',
      icon: Star,
      filters: {
        advanced: {
          jackpotValueRange: { min: 1000, max: 50000 }
        },
        volatilityBuckets: ['High'] as ('Low' | 'Medium' | 'High')[]
      }
    }
  ];

  const hasActiveFilters = () => {
    return currentFilters.categories.length > 0 ||
           currentFilters.tags.length > 0 ||
           currentFilters.volatilityBuckets.length > 0 ||
           currentFilters.expectedValueRange.min !== -100 ||
           currentFilters.floorRateRange.min !== 0;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-gray-700">Filter Presets</h4>
        {hasActiveFilters() && (
          <Button
            variant="outline"
            size="sm"
            onClick={onSavePreset}
            className="text-xs"
          >
            <Bookmark className="h-3 w-3 mr-1" />
            Save Current
          </Button>
        )}
      </div>
      
      <div className="grid grid-cols-1 gap-2">
        {presets.map((preset) => {
          const Icon = preset.icon;
          return (
            <Card 
              key={preset.id}
              className="cursor-pointer hover:shadow-md transition-all duration-200 hover:border-purple-300"
              onClick={() => onApplyPreset(preset.id)}
            >
              <CardContent className="p-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Icon className="h-4 w-4 text-purple-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h5 className="font-medium text-sm text-gray-900">{preset.name}</h5>
                      <Badge variant="secondary" className="text-xs">Preset</Badge>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">{preset.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default FilterPresets;
