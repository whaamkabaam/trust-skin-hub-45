
import { useState, useCallback } from 'react';
import { FilterState } from '@/types/filters';
import { useToast } from '@/hooks/use-toast';

interface FilterPreset {
  id: string;
  name: string;
  filters: Partial<FilterState>;
  createdAt: Date;
}

export const useFilterPresets = () => {
  const { toast } = useToast();
  const [savedPresets, setSavedPresets] = useState<FilterPreset[]>([]);

  const savePreset = useCallback((name: string, filters: FilterState) => {
    const preset: FilterPreset = {
      id: `preset-${Date.now()}`,
      name,
      filters,
      createdAt: new Date()
    };

    setSavedPresets(prev => [...prev, preset]);
    
    toast({
      title: "Filter preset saved",
      description: `"${name}" has been saved to your presets.`,
    });
  }, [toast]);

  const applyPreset = useCallback((presetId: string, onFiltersChange: (filters: FilterState) => void, currentFilters: FilterState) => {
    const builtInPresets: { [key: string]: Partial<FilterState> } = {
      'value-hunter': {
        expectedValueRange: { min: 100, max: 200 },
        floorRateRange: { min: 40, max: 100 },
        volatilityBuckets: ['Low', 'Medium']
      },
      'safe-investor': {
        floorRateRange: { min: 50, max: 100 },
        volatilityBuckets: ['Low']
      },
      'jackpot-hunter': {
        advanced: {
          jackpotValueRange: { min: 1000, max: 50000 },
          itemCountRange: { min: 0, max: 1000 }
        },
        volatilityBuckets: ['Medium', 'High']
      }
    };

    const preset = builtInPresets[presetId] || savedPresets.find(p => p.id === presetId)?.filters;
    
    if (preset) {
      const newFilters = { ...currentFilters, ...preset };
      onFiltersChange(newFilters);
      
      toast({
        title: "Filter preset applied",
        description: "Your filters have been updated.",
      });
    }
  }, [savedPresets, toast]);

  const deletePreset = useCallback((presetId: string) => {
    setSavedPresets(prev => prev.filter(p => p.id !== presetId));
    
    toast({
      title: "Preset deleted",
      description: "The filter preset has been removed.",
    });
  }, [toast]);

  return {
    savedPresets,
    savePreset,
    applyPreset,
    deletePreset
  };
};
