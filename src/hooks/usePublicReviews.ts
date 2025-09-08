import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface PublicReview {
  id: string;
  entityId: string;
  entityType: 'operator';
  user: string;
  verified: 'operator' | 'opener' | false;
  rating: number;
  subscores: {
    trust: number;
    fees: number;
    ux: number;
    support: number;
  };
  title: string;
  body: string;
  helpful: {
    up: number;
    down: number;
  };
  photos?: string[];
  createdAt: string;
  operatorResponse?: {
    body: string;
    createdAt: string;
  };
}

interface PublicReviewsData {
  reviews: PublicReview[];
  loading: boolean;
  error: string | null;
  stats: {
    totalReviews: number;
    averageRating: number;
    breakdown: Record<number, number>;
  };
}

export function usePublicReviews(operatorId: string): PublicReviewsData {
  const [reviews, setReviews] = useState<PublicReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalReviews: 0,
    averageRating: 0,
    breakdown: {} as Record<number, number>
  });

  useEffect(() => {
    if (operatorId) {
      fetchPublicReviews();
    }
  }, [operatorId]);

  const fetchPublicReviews = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch approved reviews only
      const { data: reviewsData, error: reviewsError } = await supabase
        .from('reviews')
        .select('*')
        .eq('operator_id', operatorId)
        .eq('status', 'approved')
        .order('created_at', { ascending: false });

      if (reviewsError) throw reviewsError;

      // Transform database reviews to match Review interface
      const transformedReviews: PublicReview[] = (reviewsData || []).map(review => ({
        id: review.id,
        entityId: review.operator_id,
        entityType: 'operator' as const,
        user: review.username || 'Anonymous',
        verified: review.verification_status === 'operator' ? 'operator' : 
                 review.verification_status === 'opener' ? 'opener' : false,
        rating: review.rating,
        subscores: (review.subscores as any) || {
          trust: review.rating,
          fees: review.rating,
          ux: review.rating,
          support: review.rating
        },
        title: review.title || 'User Review',
        body: review.content,
        helpful: (review.helpful_votes as any) || {
          up: 0,
          down: 0
        },
        photos: review.photos || undefined,
        createdAt: review.created_at,
        operatorResponse: (review.operator_response as any) || undefined
      }));

      setReviews(transformedReviews);

      // Calculate stats
      if (reviewsData && reviewsData.length > 0) {
        const totalReviews = reviewsData.length;
        const averageRating = reviewsData.reduce((sum, review) => sum + review.rating, 0) / totalReviews;
        
        // Calculate rating breakdown
        const breakdown: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        reviewsData.forEach(review => {
          breakdown[review.rating] = (breakdown[review.rating] || 0) + 1;
        });

        setStats({
          totalReviews,
          averageRating: Number(averageRating.toFixed(1)),
          breakdown
        });
      } else {
        setStats({
          totalReviews: 0,
          averageRating: 0,
          breakdown: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
        });
      }

    } catch (err) {
      console.error('Error fetching public reviews:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch reviews');
    } finally {
      setLoading(false);
    }
  };

  return {
    reviews,
    loading,
    error,
    stats
  };
}