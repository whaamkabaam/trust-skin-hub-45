import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Operator } from '@/types';
import { useStaticContent } from './useStaticContent';

interface ContentSection {
  id: string;
  heading: string;
  rich_text_content: string;
  order_number: number;
  section_key: string;
}

interface MediaAsset {
  id: string;
  url: string;
  alt_text: string;
  caption: string;
  type: string;
  order_number: number;
}

interface PaymentMethod {
  id: string;
  payment_method_id: string;
  method_type: string;
  minimum_amount: number | null;
  maximum_amount: number | null;
  fee_percentage: number;
  fee_fixed: number;
  processing_time: string;
  is_available: boolean;
  payment_method: {
    id: string;
    name: string;
    slug: string;
    logo_url: string | null;
  };
}

interface SEOMetadata {
  meta_title: string;
  meta_description: string;
  schema_data: any;
}

interface PublicOperatorData {
  operator: Operator | null;
  contentSections: ContentSection[];
  mediaAssets: MediaAsset[];
  seoMetadata: SEOMetadata | null;
  paymentMethods: PaymentMethod[];
  loading: boolean;
  error: string | null;
}

export function usePublicOperator(slug: string): PublicOperatorData {
  const [operator, setOperator] = useState<Operator | null>(null);
  const [contentSections, setContentSections] = useState<ContentSection[]>([]);
  const [mediaAssets, setMediaAssets] = useState<MediaAsset[]>([]);
  const [seoMetadata, setSeoMetadata] = useState<SEOMetadata | null>(null);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const { getPublishedContent } = useStaticContent();

  useEffect(() => {
    if (slug) {
      fetchOperatorData();
    }
  }, [slug]);

  const fetchOperatorData = async () => {
    try {
      console.log(`🔍 Starting fetchOperatorData for slug: ${slug}`);
      setLoading(true);
      setError(null);

      // Try to fetch from static content first (SEO optimized)
      console.log('📊 Attempting to fetch static content...');
      const staticContent = await getPublishedContent(slug);
      
      if (staticContent) {
        console.log('✅ Static content found:', staticContent);
        // Use pre-generated static content
        setOperator(staticContent.operator);
        setContentSections(staticContent.contentSections);
        setMediaAssets(staticContent.mediaAssets);
        setSeoMetadata(staticContent.seoMetadata);
        setPaymentMethods(staticContent.payments || []);
        console.log('🎉 Successfully loaded static content data with payment methods:', staticContent.payments?.length);
        return; // Early return, loading will be set to false in finally block
      }

      console.log('⚠️ No static content found, falling back to dynamic fetching...');
      // Fallback to dynamic fetching for preview/development
      const { data: operatorData, error: operatorError } = await supabase
        .from('operators')
        .select('*')
        .eq('slug', slug)
        .eq('published', true)
        .single();

      if (operatorError) {
        console.log('❌ Operator fetch error:', operatorError);
        if (operatorError.code === 'PGRST116') {
          setError('Operator not found');
          return;
        }
        throw operatorError;
      }

      // Transform database data to match Operator interface
      const transformedOperator: Operator = {
        id: operatorData.id,
        name: operatorData.name,
        slug: operatorData.slug,
        logo: operatorData.logo_url,
        hero_image_url: operatorData.hero_image_url,
        verdict: operatorData.verdict || '',
        overallRating: (operatorData.ratings as any)?.overall || 0,
        feeLevel: 'Medium',
        paymentMethods: ['crypto'],
        modes: operatorData.categories || [],
        pros: operatorData.pros || [],
        cons: operatorData.cons || [],
        trustScore: (operatorData.ratings as any)?.trust || 0,
        fees: {
          deposit: 0,
          withdrawal: 0,
          trading: 0
        },
        payoutSpeed: '24 hours',
        kycRequired: operatorData.kyc_required || false,
        countries: operatorData.supported_countries || [],
        url: operatorData.tracking_link || '#',
        verified: true,
        other_features: [],
        gaming_modes: [],
        games: [],
        categories: operatorData.categories || [],
        launch_year: operatorData.launch_year,
        ratings: operatorData.ratings as any,
        bonus_terms: operatorData.bonus_terms,
        fairness_info: operatorData.fairness_info
      };

      setOperator(transformedOperator);

      // Fetch content sections
      const { data: sectionsData, error: sectionsError } = await supabase
        .from('content_sections')
        .select('*')
        .eq('operator_id', operatorData.id)
        .order('order_number', { ascending: true });

      if (sectionsError) throw sectionsError;
      setContentSections(sectionsData || []);

      // Fetch media assets
      const { data: mediaData, error: mediaError } = await supabase
        .from('media_assets')
        .select('*')
        .eq('operator_id', operatorData.id)
        .order('order_number', { ascending: true });

      if (mediaError) throw mediaError;
      setMediaAssets(mediaData || []);

      // Fetch SEO metadata
      const { data: seoData, error: seoError } = await supabase
        .from('seo_metadata')
        .select('*')
        .eq('operator_id', operatorData.id)
        .maybeSingle();

      if (seoError && seoError.code !== 'PGRST116') throw seoError;
      setSeoMetadata(seoData || null);

      // Fetch payment methods with joins
      const { data: paymentsData, error: paymentsError } = await supabase
        .from('operator_payment_methods')
        .select(`
          *,
          payment_method:payment_methods(
            id,
            name,
            slug,
            logo_url
          )
        `)
        .eq('operator_id', operatorData.id)
        .eq('is_available', true);

      if (paymentsError) throw paymentsError;
      setPaymentMethods(paymentsData || []);

    } catch (err) {
      console.error('❌ Error in fetchOperatorData:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch operator data');
    } finally {
      console.log('🏁 fetchOperatorData completed, setting loading to false');
      setLoading(false);
    }
  };

  return {
    operator,
    contentSections,
    mediaAssets,
    seoMetadata,
    paymentMethods,
    loading,
    error
  };
}