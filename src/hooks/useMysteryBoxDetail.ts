import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface MysteryBoxDetail {
  id: string;
  name: string;
  slug: string;
  image_url: string | null;
  price: number;
  expected_value: number | null;
  profit_rate: number | null;
  min_price: number | null;
  game: string | null;
  verified: boolean;
  provably_fair: boolean;
  odds_disclosed: string | null;
  box_type: string;
  site_name: string | null;
  rarity_mix: any;
  highlights: any;
  stats: any;
  operator: {
    id: string;
    name: string;
    slug: string;
    logo_url: string | null;
    tracking_link: string | null;
    ratings: any;
  } | null;
  categories: Array<{
    id: string;
    name: string;
    slug: string;
  }>;
}

export function useMysteryBoxDetail(slug: string) {
  const [mysteryBox, setMysteryBox] = useState<MysteryBoxDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMysteryBox = async () => {
      if (!slug) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const { data: boxData, error: boxError } = await supabase
          .from('mystery_boxes')
          .select(`
            *,
            operator:operators (
              id,
              name,
              slug,
              logo_url,
              tracking_link,
              ratings
            )
          `)
          .eq('slug', slug)
          .eq('is_active', true)
          .single();

        if (boxError) {
          console.error('Error fetching mystery box:', boxError);
          setError('Mystery box not found');
          setLoading(false);
          return;
        }

        // Fetch categories
        const { data: categoryData } = await supabase
          .from('mystery_box_categories')
          .select(`
            category_id,
            categories (
              id,
              name,
              slug
            )
          `)
          .eq('mystery_box_id', boxData.id);

        const categories = categoryData?.map(c => (c.categories as any)) || [];

        setMysteryBox({
          ...boxData,
          operator: boxData.operator as any,
          categories
        });
      } catch (err) {
        console.error('Error:', err);
        setError('Failed to load mystery box');
        toast.error('Failed to load mystery box details');
      } finally {
        setLoading(false);
      }
    };

    fetchMysteryBox();
  }, [slug]);

  return { mysteryBox, loading, error };
}
