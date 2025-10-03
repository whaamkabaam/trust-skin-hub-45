import { useState, useEffect } from 'react';
import { useUnifiedBoxData } from './useUnifiedBoxData';
import { MysteryBox } from '@/types';
import { supabase } from '@/integrations/supabase/client';

export function useMysteryBoxesFromProviders() {
  const { boxesData, loading, error } = useUnifiedBoxData();
  const [mysteryBoxes, setMysteryBoxes] = useState<MysteryBox[]>([]);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const loadMysteryBoxes = async () => {
      if (!boxesData || boxesData.length === 0) {
        setMysteryBoxes([]);
        setTotalCount(0);
        return;
      }

      // Fetch all category overrides
      const { data: overrides } = await supabase
        .from('provider_box_category_overrides')
        .select(`
          *,
          categories (*)
        `);

      // Create a map of overrides by provider-boxId
      const overridesMap = new Map<string, any[]>();
      overrides?.forEach(override => {
        const key = `${override.provider}-${override.box_id}`;
        if (!overridesMap.has(key)) {
          overridesMap.set(key, []);
        }
        overridesMap.get(key)?.push(override.categories);
      });

      // Transform UnifiedBoxData[] to MysteryBox[] format
      const transformed: MysteryBox[] = boxesData.map((box, index) => {
        const boxKey = `${box.provider}-${index}`;
        const manualCategories = overridesMap.get(boxKey) || [];

        // Combine provider category with manual overrides
        const allCategories = [
          ...(box.category ? [{
            id: box.category,
            name: box.category,
            slug: box.category.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            display_order: 0,
            is_featured: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }] : []),
          ...manualCategories,
        ];

        return {
          id: `${box.provider}-${index}`,
          name: box.box_name,
          slug: box.box_name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          image_url: box.box_image,
          price: box.box_price,
          expected_value: box.box_price * (box.expected_value_percent_of_price / 100),
          profit_rate: box.expected_value_percent_of_price - 100,
          min_price: box.floor_rate_percent ? (box.box_price * box.floor_rate_percent / 100) : null,
          verified: true,
          provably_fair: true,
          box_type: 'digital',
          site_name: box.provider_config.displayName,
          game: 'CS2',
          odds_disclosed: 'Yes',
          rarity_mix: {
            volatility: box.volatility_bucket,
            standard_deviation: box.standard_deviation_percent,
          },
          highlights: box.jackpot_items?.slice(0, 5).map(item => ({
            name: item.name,
            rarity: item.value > 1000 ? 'legendary' : item.value > 500 ? 'epic' : 'rare',
            icon: item.image,
          })) || [],
          stats: {
            open_count: 0,
            avg_return: box.expected_value_percent_of_price,
          },
          popularity_score: Math.round(box.expected_value_percent_of_price * 10),
          release_date: new Date().toISOString(),
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          operator_id: undefined,
          categories: allCategories,
        };
      });

      setMysteryBoxes(transformed);
      setTotalCount(transformed.length);
    };

    loadMysteryBoxes();
  }, [boxesData]);

  return {
    mysteryBoxes,
    loading,
    error,
    totalCount,
  };
}
