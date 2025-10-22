import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface CategoryContentBlock {
  id: string;
  category_id: string;
  block_type: 'hero' | 'text' | 'mystery_boxes' | 'table' | 'image' | 'video' | 'stats' | 'comparison' | 'faq';
  block_data: any;
  order_number: number;
  is_visible: boolean;
  created_at: string;
  updated_at: string;
}

export const useCategoryContent = (categoryId: string) => {
  const [blocks, setBlocks] = useState<CategoryContentBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchBlocks = async () => {
    try {
      const { data, error } = await supabase
        .from('category_content_blocks')
        .select('*')
        .eq('category_id', categoryId)
        .order('order_number');

      if (error) throw error;
      setBlocks((data || []) as CategoryContentBlock[]);
    } catch (error) {
      console.error('Error fetching category blocks:', error);
      toast.error('Failed to load content blocks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (categoryId) {
      fetchBlocks();
    }
  }, [categoryId]);

  const saveBlock = async (block: Partial<CategoryContentBlock>, silent = false) => {
    setSaving(true);
    try {
      if (block.id) {
        const { error } = await supabase
          .from('category_content_blocks')
          .update({
            block_data: block.block_data,
            is_visible: block.is_visible,
            order_number: block.order_number,
          })
          .eq('id', block.id);

        if (error) throw error;
        
        // Update local state directly instead of refetching everything
        setBlocks(prev => prev.map(b => 
          b.id === block.id 
            ? { ...b, block_data: block.block_data, is_visible: block.is_visible, order_number: block.order_number, updated_at: new Date().toISOString() }
            : b
        ));
      } else {
        const { data, error } = await supabase
          .from('category_content_blocks')
          .insert({
            category_id: categoryId,
            block_type: block.block_type,
            block_data: block.block_data || {},
            order_number: block.order_number || blocks.length,
            is_visible: block.is_visible ?? true,
          })
          .select()
          .single();

        if (error) throw error;
        
        // Add new block to local state
        if (data) {
          setBlocks(prev => [...prev, data as CategoryContentBlock]);
        }
      }

      if (!silent) {
        toast.success('Block saved successfully');
      }
    } catch (error) {
      console.error('Error saving block:', error);
      toast.error('Failed to save block');
    } finally {
      setSaving(false);
    }
  };

  const deleteBlock = async (blockId: string) => {
    try {
      const { error } = await supabase
        .from('category_content_blocks')
        .delete()
        .eq('id', blockId);

      if (error) throw error;

      await fetchBlocks();
      toast.success('Block deleted successfully');
    } catch (error) {
      console.error('Error deleting block:', error);
      toast.error('Failed to delete block');
    }
  };

  const reorderBlocks = async (reorderedBlocks: CategoryContentBlock[]) => {
    try {
      const updates = reorderedBlocks.map((block, index) => ({
        id: block.id,
        order_number: index,
      }));

      for (const update of updates) {
        await supabase
          .from('category_content_blocks')
          .update({ order_number: update.order_number })
          .eq('id', update.id);
      }

      await fetchBlocks();
    } catch (error) {
      console.error('Error reordering blocks:', error);
      toast.error('Failed to reorder blocks');
    }
  };

  const publishCategory = async () => {
    setSaving(true);
    try {
      // Get category data
      const { data: category, error: catError } = await supabase
        .from('categories')
        .select('*')
        .eq('id', categoryId)
        .single();

      if (catError) throw catError;

      // Fetch featured box data if set
      let featuredBoxData = null;
      if (category.featured_box_id) {
        const { data: featuredOverride, error: featuredError } = await supabase
          .from('provider_box_category_overrides')
          .select('id, provider, box_id')
          .eq('id', category.featured_box_id)
          .single();

        if (!featuredError && featuredOverride) {
          const provider = featuredOverride.provider.toLowerCase();
          let boxData: any = null;

          if (provider === 'rillabox') {
            const { data } = await supabase.from('rillabox').select('*').eq('id', featuredOverride.box_id).single();
            boxData = data;
          } else if (provider === 'hypedrop') {
            const { data } = await supabase.from('hypedrop').select('*').eq('id', featuredOverride.box_id).single();
            boxData = data;
          } else if (provider === 'casesgg') {
            const { data } = await supabase.from('casesgg').select('*').eq('id', featuredOverride.box_id).single();
            boxData = data;
          } else if (provider === 'luxdrop') {
            const { data } = await supabase.from('luxdrop').select('*').eq('id', featuredOverride.box_id).single();
            boxData = data;
          }

          if (boxData) {
            featuredBoxData = {
              id: featuredOverride.id,
              box_name: boxData.box_name,
              box_image: boxData.box_image,
              box_price: Number(boxData.box_price),
              expected_value_percent_of_price: Number(boxData.expected_value_percent) || 0,
              description: category.featured_box_description || '',
              featured_items: boxData.jackpot_items ? JSON.parse(JSON.stringify(boxData.jackpot_items)).slice(0, 3) : [],
              provider: featuredOverride.provider,
              box_url: boxData.box_url
            };
          }
        }
      }

      // Enrich mystery_boxes blocks with full box data
      const enrichedBlocks = await Promise.all(
        blocks.map(async (block) => {
          if (block.block_type === 'mystery_boxes') {
            console.log('Publishing mystery_boxes block:', block.block_data);
            // Handle both old and new field names for selected boxes
            const selectedIds = block.block_data.selectedBoxIds || block.block_data.selectedBoxNames || [];
            console.log('Selected box IDs to enrich:', selectedIds);
            
            if (selectedIds.length > 0) {
            // Fetch full box details for selected IDs
            const { data: overrides, error: overridesError } = await supabase
              .from('provider_box_category_overrides')
              .select('id, provider, box_id')
              .in('id', selectedIds);

            if (overridesError) throw overridesError;

            // Group overrides by provider for batch fetching
            const providerGroups = (overrides || []).reduce((acc, override) => {
              const provider = override.provider.toLowerCase();
              if (!acc[provider]) acc[provider] = [];
              acc[provider].push({ id: override.id, box_id: override.box_id, provider: override.provider });
              return acc;
            }, {} as Record<string, Array<{ id: string; box_id: number; provider: string }>>);

            const boxesData: any[] = [];

            // Fetch complete box data from each provider table in parallel
            for (const [provider, items] of Object.entries(providerGroups)) {
              const boxIds = items.map(item => item.box_id);
              
              // Type-safe query for each provider table
              let boxes: any[] | null = null;
              let boxError: any = null;
              
              if (provider === 'rillabox') {
                const result = await supabase.from('rillabox').select('id, box_name, box_price, box_image, box_url, expected_value_percent, floor_rate_percent, standard_deviation_percent, volatility_bucket, category, tags').in('id', boxIds);
                boxes = result.data;
                boxError = result.error;
              } else if (provider === 'hypedrop') {
                const result = await supabase.from('hypedrop').select('id, box_name, box_price, box_image, box_url, expected_value_percent, floor_rate_percent, standard_deviation_percent, volatility_bucket, category, tags').in('id', boxIds);
                boxes = result.data;
                boxError = result.error;
              } else if (provider === 'casesgg') {
                const result = await supabase.from('casesgg').select('id, box_name, box_price, box_image, box_url, expected_value_percent, floor_rate_percent, standard_deviation_percent, volatility_bucket, category, tags').in('id', boxIds);
                boxes = result.data;
                boxError = result.error;
              } else if (provider === 'luxdrop') {
                const result = await supabase.from('luxdrop').select('id, box_name, box_price, box_image, box_url, expected_value_percent, floor_rate_percent, standard_deviation_percent, volatility_bucket, category, tags').in('id', boxIds);
                boxes = result.data;
                boxError = result.error;
              }
              
              if (boxError) {
                console.error(`Error fetching boxes from ${provider}:`, boxError);
              } else if (boxes) {
                // Merge with override data and enrich with full metrics
                boxes.forEach((box: any) => {
                  const override = items.find(item => item.box_id === box.id);
                  if (override) {
                    boxesData.push({
                      id: override.id,
                      box_id: box.id,
                      box_name: box.box_name,
                      box_price: Number(box.box_price) || 0,
                      box_image: box.box_image || '',
                      box_url: box.box_url || '',
                      expected_value_percent_of_price: Number(box.expected_value_percent) || 0,
                      floor_rate_percent: Number(box.floor_rate_percent) || 0,
                      standard_deviation_percent: Number(box.standard_deviation_percent) || 0,
                      volatility_bucket: box.volatility_bucket || 'Medium',
                      category: box.category || 'Mystery Boxes',
                      tags: Array.isArray(box.tags) ? box.tags : [],
                      provider: override.provider,
                    });
                  }
                });
              }
            }

            console.log(`Published ${boxesData.length} enriched boxes with full metrics:`, boxesData);
            return {
              ...block,
              block_data: {
                ...block.block_data,
                boxesData,
              },
            };
            }
          }
          return block;
        })
      );

      // Create published content snapshot with enriched data
      console.log('Publishing enriched blocks:', enrichedBlocks);
      const { error: publishError } = await supabase
        .from('published_category_content')
        .upsert({
          category_id: categoryId,
          slug: category.slug,
          content_data: { 
            blocks: enrichedBlocks,
            featuredBox: featuredBoxData 
          },
          seo_data: {
            meta_title: category.meta_title,
            meta_description: category.meta_description,
            hero_title: category.hero_title,
            hero_subtitle: category.hero_subtitle,
          },
        } as any, { onConflict: 'slug' });

      if (publishError) throw publishError;

      // Update category as published
      const { error: updateError } = await supabase
        .from('categories')
        .update({
          published: true,
          published_at: new Date().toISOString(),
        })
        .eq('id', categoryId);

      if (updateError) throw updateError;

      toast.success('Category published successfully!');
    } catch (error: any) {
      console.error('Error publishing category:', error);
      toast.error(`Failed to publish category: ${error.message || 'Unknown error'}`);
    } finally {
      setSaving(false);
    }
  };

  return {
    blocks,
    loading,
    saving,
    saveBlock,
    deleteBlock,
    reorderBlocks,
    publishCategory,
    refreshBlocks: fetchBlocks,
  };
};
