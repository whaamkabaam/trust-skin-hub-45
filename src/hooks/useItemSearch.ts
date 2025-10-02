
import { useState, useCallback } from 'react';
import { searchItems } from '@/utils/scouterCalculations';
import { adaptUnifiedBoxesToRillaBoxes } from '@/utils/typeAdapters';

// Type for unified box data from useUnifiedBoxData
interface UnifiedBoxData {
  box_name: string;
  box_price: number;
  box_image: string;
  expected_value_percent_of_price: number;
  volatility_bucket: 'Low' | 'Medium' | 'High';
  standard_deviation_percent: number;
  floor_rate_percent: number;
  category: string;
  tags: string[];
  jackpot_items: any[];
  unwanted_items: any[];
  all_items: any[];
  provider: 'rillabox' | 'hypedrop' | 'casesgg' | 'luxdrop';
  provider_config: {
    displayName: string;
    color: string;
    gradient: string;
    bgColor: string;
    borderColor: string;
    textColor: string;
  };
}

export const useItemSearch = (boxesData: UnifiedBoxData[]) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [selectedItem, setSelectedItem] = useState<string>('');

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    if (query.length >= 2) {
      // Convert unified boxes to RillaBox format for search
      const adaptedBoxes = adaptUnifiedBoxesToRillaBoxes(boxesData);
      const results = searchItems(adaptedBoxes, query);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [boxesData]);

  const handleItemSelect = useCallback((itemName: string) => {
    setSelectedItem(itemName);
    setSearchQuery(itemName);
    setSearchResults([]);
  }, []);

  const handleClearSearch = useCallback(() => {
    setSearchQuery('');
    setSearchResults([]);
    setSelectedItem('');
  }, []);

  return {
    searchQuery,
    searchResults,
    selectedItem,
    handleSearch,
    handleItemSelect,
    handleClearSearch
  };
};
