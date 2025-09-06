import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Review {
  id: string;
  operator_id: string;
  user_id?: string;
  rating: number;
  content: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
}

export interface ReviewFormData {
  operator_id: string;
  rating: number;
  content: string;
  status?: 'pending' | 'approved' | 'rejected';
}

export function useReviews(operatorId?: string) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchReviews = async () => {
    try {
      setLoading(true);
      let query = supabase.from('reviews').select('*').order('created_at', { ascending: false });
      
      if (operatorId) {
        query = query.eq('operator_id', operatorId);
      }

      const { data, error } = await query;
      if (error) throw error;
      setReviews((data || []) as Review[]);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast({
        title: 'Error',
        description: 'Failed to load reviews',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const createReview = async (reviewData: ReviewFormData) => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .insert({
          ...reviewData,
          status: reviewData.status || 'pending',
        })
        .select()
        .single();

      if (error) throw error;

      setReviews(prev => [data as Review, ...prev]);
      toast({
        title: 'Success',
        description: 'Review created successfully',
      });

      return data;
    } catch (error) {
      console.error('Error creating review:', error);
      toast({
        title: 'Error',
        description: 'Failed to create review',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const updateReviewStatus = async (reviewId: string, status: 'pending' | 'approved' | 'rejected') => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .update({ status })
        .eq('id', reviewId)
        .select()
        .single();

      if (error) throw error;

      setReviews(prev => prev.map(review => 
        review.id === reviewId ? data as Review : review
      ));

      toast({
        title: 'Success',
        description: `Review ${status} successfully`,
      });

      return data;
    } catch (error) {
      console.error('Error updating review status:', error);
      toast({
        title: 'Error',
        description: 'Failed to update review status',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const updateReview = async (reviewId: string, updates: Partial<ReviewFormData>) => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .update(updates)
        .eq('id', reviewId)
        .select()
        .single();

      if (error) throw error;

      setReviews(prev => prev.map(review => 
        review.id === reviewId ? data as Review : review
      ));

      toast({
        title: 'Success',
        description: 'Review updated successfully',
      });

      return data;
    } catch (error) {
      console.error('Error updating review:', error);
      toast({
        title: 'Error',
        description: 'Failed to update review',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const deleteReview = async (reviewId: string) => {
    try {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', reviewId);

      if (error) throw error;

      setReviews(prev => prev.filter(review => review.id !== reviewId));
      toast({
        title: 'Success',
        description: 'Review deleted successfully',
      });
    } catch (error) {
      console.error('Error deleting review:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete review',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const bulkUpdateStatus = async (reviewIds: string[], status: 'pending' | 'approved' | 'rejected') => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .update({ status })
        .in('id', reviewIds)
        .select();

      if (error) throw error;

      setReviews(prev => prev.map(review => 
        reviewIds.includes(review.id) 
          ? { ...review, status }
          : review
      ));

      toast({
        title: 'Success',
        description: `${reviewIds.length} reviews ${status} successfully`,
      });

      return data;
    } catch (error) {
      console.error('Error bulk updating reviews:', error);
      toast({
        title: 'Error',
        description: 'Failed to update reviews',
        variant: 'destructive',
      });
      throw error;
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [operatorId]);

  return {
    reviews,
    loading,
    fetchReviews,
    createReview,
    updateReviewStatus,
    updateReview,
    deleteReview,
    bulkUpdateStatus,
  };
}