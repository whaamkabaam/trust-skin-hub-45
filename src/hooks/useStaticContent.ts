import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Operator } from '@/types';

interface StaticContentData {
  operator: Operator;
  bonuses: any[];
  payments: any[];
  features: any[];
  security: any | null;
  faqs: any[];
  contentSections: any[];
  mediaAssets: any[];
  seoMetadata: any | null;
}

interface PublishedContent {
  id: string;
  operator_id: string;
  slug: string;
  content_data: StaticContentData;
  seo_data: any;
  created_at: string;
  updated_at: string;
}

export function useStaticContent() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateStaticContent = async (operatorId: string): Promise<StaticContentData | null> => {
    try {
      setLoading(true);
      setError(null);

      // Fetch operator data
      const { data: operator, error: operatorError } = await supabase
        .from('operators')
        .select('*')
        .eq('id', operatorId)
        .maybeSingle();

      if (operatorError) throw operatorError;

      // Fetch all extension data in parallel
      const [
        { data: bonuses },
        { data: payments },
        { data: features },
        { data: security },
        { data: faqs },
        { data: contentSections },
        { data: mediaAssets },
        { data: seoMetadata }
      ] = await Promise.all([
        supabase.from('operator_bonuses').select('*').eq('operator_id', operatorId).order('order_number'),
        supabase.from('operator_payment_methods').select(`
          *,
          payment_method:payment_methods(
            id,
            name,
            slug,
            logo_url
          )
        `).eq('operator_id', operatorId).eq('is_available', true),
        supabase.from('operator_features').select('*').eq('operator_id', operatorId),
        supabase.from('operator_security').select('*').eq('operator_id', operatorId).maybeSingle(),
        supabase.from('operator_faqs').select('*').eq('operator_id', operatorId).order('order_number'),
        supabase.from('content_sections').select('*').eq('operator_id', operatorId).order('order_number'),
        supabase.from('media_assets').select('*').eq('operator_id', operatorId).order('order_number'),
        supabase.from('seo_metadata').select('*').eq('operator_id', operatorId).maybeSingle()
      ]);

      // Transform operator data to match interface
      const transformedOperator: Operator = {
        id: operator.id,
        name: operator.name,
        slug: operator.slug,
        logo: operator.logo_url,
        hero_image_url: operator.hero_image_url,
        verdict: '', // Deprecated: kept for card previews
        overallRating: (operator.ratings as any)?.overall || 0,
        feeLevel: 'Medium',
        paymentMethods: ['crypto'],
        modes: operator.categories || [],
        pros: operator.pros || [],
        cons: operator.cons || [],
        trustScore: (operator.ratings as any)?.trust || 0,
        fees: {
          deposit: 0,
          withdrawal: 0,
          trading: 0
        },
        payoutSpeed: '24 hours',
        kycRequired: operator.kyc_required || false,
        countries: operator.supported_countries || [],
        url: operator.tracking_link || '#',
        verified: true,
        other_features: [],
        gaming_modes: [],
        games: [],
        categories: operator.categories || [],
        launch_year: operator.launch_year,
        ratings: operator.ratings as any,
        withdrawal_time_crypto: operator.withdrawal_time_crypto,
        withdrawal_time_skins: operator.withdrawal_time_skins,
        withdrawal_time_fiat: operator.withdrawal_time_fiat,
        promo_code: operator.promo_code,
        support_channels: operator.support_channels,
        verification_status: operator.verification_status,
        site_type: operator.site_type
      };

      return {
        operator: transformedOperator,
        bonuses: bonuses || [],
        payments: payments || [],
        features: features || [],
        security: security || null,
        faqs: faqs || [],
        contentSections: contentSections || [],
        mediaAssets: mediaAssets || [],
        seoMetadata: seoMetadata || null
      };

    } catch (err) {
      console.error('Error generating static content:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate static content');
      return null;
    } finally {
      setLoading(false);
    }
  };

  const publishStaticContent = async (operatorId: string): Promise<boolean> => {
    try {
      setLoading(true);
      setError(null);

      console.log('Starting publishStaticContent for operator:', operatorId);
      
      const staticContent = await generateStaticContent(operatorId);
      if (!staticContent) {
        console.error('Failed to generate static content');
        return false;
      }

      console.log('Generated static content:', staticContent);

      // Generate SEO data
      const overviewSection = staticContent.contentSections.find(s => s.section_key === 'overview');
      const descriptionText = overviewSection?.rich_text_content 
        ? overviewSection.rich_text_content.replace(/<[^>]*>/g, '').substring(0, 150)
        : `Complete review and analysis of ${staticContent.operator.name}`;
      
      const seoData = {
        title: `${staticContent.operator.name} Review ${new Date().getFullYear()} - Complete Analysis`,
        description: `In-depth review of ${staticContent.operator.name}. Rating: ${staticContent.operator.overallRating}/10. ${descriptionText}...`,
        ogTitle: `${staticContent.operator.name} Review - ${staticContent.operator.overallRating}/10 Rating`,
        ogDescription: descriptionText,
        ogImage: staticContent.operator.hero_image_url || staticContent.operator.logo,
        structuredData: {
          "@context": "https://schema.org",
          "@type": "Review",
          "itemReviewed": {
            "@type": "Organization",
            "name": staticContent.operator.name,
            "image": staticContent.operator.logo,
            "url": staticContent.operator.url
          },
          "reviewRating": {
            "@type": "Rating",
            "ratingValue": staticContent.operator.overallRating,
            "bestRating": 10,
            "worstRating": 0
          },
          "author": {
            "@type": "Organization",
            "name": "Expert Review Team"
          },
          "reviewBody": descriptionText
        }
      };

      console.log('Generated SEO data:', seoData);

      // Upsert published content
      console.log('Upserting to published_operator_content...');
      const { error: upsertError } = await supabase
        .from('published_operator_content')
        .upsert({
          operator_id: operatorId,
          slug: staticContent.operator.slug,
          content_data: staticContent as any,
          seo_data: seoData as any
        }, {
          onConflict: 'slug'
        });

      if (upsertError) {
        console.error('Upsert error:', upsertError);
        throw upsertError;
      }

      console.log('Successfully upserted content');
      console.log('Static content publishing completed successfully');
      return true;

    } catch (err) {
      console.error('Error publishing static content:', err);
      setError(err instanceof Error ? err.message : 'Failed to publish content');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const getPublishedContent = async (slug: string): Promise<StaticContentData | null> => {
    try {
      console.log(`🔍 getPublishedContent: Fetching static content for slug: ${slug}`);
      
      const { data, error } = await supabase
        .from('published_operator_content')
        .select('content_data')
        .eq('slug', slug)
        .single();

      if (error) {
        console.log(`⚠️ getPublishedContent: Database error for slug ${slug}:`, error);
        if (error.code === 'PGRST116') {
          console.log(`📭 getPublishedContent: No published content found for slug: ${slug}`);
          return null;
        }
        console.error(`❌ getPublishedContent: Database error for slug ${slug}:`, error);
        return null; // Return null instead of throwing
      }

      if (!data?.content_data) {
        console.log(`📭 getPublishedContent: No content data found for slug: ${slug}`);
        return null;
      }

      console.log(`✅ getPublishedContent: Successfully fetched static content for slug: ${slug}`, data.content_data);
      return data.content_data as any as StaticContentData;

    } catch (err) {
      console.error(`❌ getPublishedContent: Unexpected error fetching published content for slug ${slug}:`, err);
      return null; // Always return null on error, never throw
    }
  };

  return {
    loading,
    error,
    generateStaticContent,
    publishStaticContent,
    getPublishedContent
  };
}