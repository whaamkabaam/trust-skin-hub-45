import { useState, useEffect } from 'react';
import { usePublicOperator } from './usePublicOperator';
import { usePublicOperatorExtensions } from './usePublicOperatorExtensions';
import { usePublicReviews } from './usePublicReviews';
import { Database } from '@/integrations/supabase/types';

interface LegacyScores {
  overall: number;
  user: number;
  trust: number;
  fees: number;
  ux: number;
  support: number;
  speed: number;
}

interface LegacyScreenshot {
  id: string;
  url: string;
  alt: string;
}

interface LegacyOperatorData {
  operator: any | null;
  scores: LegacyScores;
  promoCode: string;
  screenshots: LegacyScreenshot[];
  faqItems: any[];
  reviews: any[];
  loading: boolean;
  error: string | null;
}

export function usePublicOperatorLegacy(slug: string): LegacyOperatorData {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { 
    operator, 
    mediaAssets, 
    loading: operatorLoading, 
    error: operatorError 
  } = usePublicOperator(slug);
  
  const { 
    faqs, 
    loading: extensionsLoading, 
    error: extensionsError 
  } = usePublicOperatorExtensions(slug);
  
  const { 
    reviews, 
    loading: reviewsLoading, 
    error: reviewsError 
  } = usePublicReviews(operator?.id || '');

  // Transform CMS data to legacy format
  const transformedData = {
    operator: operator ? {
      ...operator,
      id: operator.slug || operator.id,
      logo: operator.logo || '',
      overallRating: operator.ratings?.overall || 0,
      feeLevel: 'Medium' as const,
      paymentMethods: ['skins' as const, 'crypto' as const],
      modes: operator.categories || [],
      pros: operator.pros || [],
      cons: operator.cons || [],
      trustScore: operator.ratings?.trust || 0,
      fees: {
        deposit: 0,
        withdrawal: 2,
        trading: 3
      },
      payoutSpeed: '10-30 minutes',
      kycRequired: operator.kycRequired || false,
      countries: operator.countries || [],
      url: operator.url || '#',
      verified: operator.verified || false,
      otherFeatures: [],
      gamingModes: [],
      games: [],
      categories: operator.categories || []
    } : null,

    scores: {
      overall: operator?.ratings?.overall || 0,
      user: operator?.ratings?.overall || 0,
      trust: operator?.ratings?.trust || 0,
      fees: operator?.ratings?.value || 0,
      ux: operator?.ratings?.ux || 0,
      support: operator?.ratings?.support || 0,
      speed: operator?.ratings?.payments || 0
    },

    promoCode: 'SAVE20', // Default promo code since it's not in the Operator interface

    screenshots: mediaAssets
      ?.filter(asset => asset.type === 'screenshot')
      ?.map(asset => ({
        id: asset.id,
        url: asset.url,
        alt: asset.alt_text || 'Screenshot'
      })) || [],

    faqItems: faqs?.map(faq => ({
      id: faq.id,
      q: faq.question,
      a: faq.answer,
      category: faq.category || 'General'
    })) || [],

    reviews: reviews || []
  };

  useEffect(() => {
    const isLoading = operatorLoading || extensionsLoading || reviewsLoading;
    const hasError = operatorError || extensionsError || reviewsError;
    
    setLoading(isLoading);
    setError(hasError);
  }, [operatorLoading, extensionsLoading, reviewsLoading, operatorError, extensionsError, reviewsError]);

  return {
    ...transformedData,
    loading,
    error
  };
}