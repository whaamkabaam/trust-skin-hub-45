import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface SEOMetadata {
  id: string;
  operator_id: string;
  meta_title?: string;
  meta_description?: string;
  schema_data?: any;
  created_at: string;
  updated_at: string;
}

export interface SEOFormData {
  meta_title: string;
  meta_description: string;
  og_title?: string;
  og_description?: string;
  og_image?: string;
  twitter_title?: string;
  twitter_description?: string;
  twitter_image?: string;
  canonical_url?: string;
}

export function useSEO(operatorId: string) {
  const [metadata, setMetadata] = useState<SEOMetadata | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchSEO = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('seo_metadata')
        .select('*')
        .eq('operator_id', operatorId)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      setMetadata(data);
    } catch (error) {
      console.error('Error fetching SEO metadata:', error);
      toast({
        title: 'Error',
        description: 'Failed to load SEO metadata',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const saveSEO = async (formData: SEOFormData) => {
    try {
      const schemaData = {
        og: {
          title: formData.og_title || formData.meta_title,
          description: formData.og_description || formData.meta_description,
          image: formData.og_image,
        },
        twitter: {
          title: formData.twitter_title || formData.meta_title,
          description: formData.twitter_description || formData.meta_description,
          image: formData.twitter_image || formData.og_image,
        },
        canonical_url: formData.canonical_url,
      };

      const payload = {
        operator_id: operatorId,
        meta_title: formData.meta_title,
        meta_description: formData.meta_description,
        schema_data: schemaData,
      };

      let data;
      if (metadata) {
        const { data: updatedData, error } = await supabase
          .from('seo_metadata')
          .update(payload)
          .eq('id', metadata.id)
          .select()
          .single();
        if (error) throw error;
        data = updatedData;
      } else {
        const { data: newData, error } = await supabase
          .from('seo_metadata')
          .insert(payload)
          .select()
          .single();
        if (error) throw error;
        data = newData;
      }

      setMetadata(data);
      toast({
        title: 'Success',
        description: 'SEO metadata saved successfully',
      });

      return data;
    } catch (error) {
      console.error('Error saving SEO metadata:', error);
      toast({
        title: 'Error',
        description: 'Failed to save SEO metadata',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const generateStructuredData = (operatorName: string, operatorData: any) => {
    return {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: operatorName,
      url: operatorData.tracking_link || operatorData.url,
      logo: operatorData.logo_url,
      description: metadata?.meta_description,
      foundingDate: operatorData.launch_year ? `${operatorData.launch_year}-01-01` : undefined,
      aggregateRating: operatorData.ratings?.overall ? {
        '@type': 'AggregateRating',
        ratingValue: operatorData.ratings.overall,
        bestRating: 5,
        worstRating: 1,
      } : undefined,
    };
  };

  useEffect(() => {
    if (operatorId) {
      fetchSEO();
    }
  }, [operatorId]);

  return {
    metadata,
    loading,
    fetchSEO,
    saveSEO,
    generateStructuredData,
  };
}