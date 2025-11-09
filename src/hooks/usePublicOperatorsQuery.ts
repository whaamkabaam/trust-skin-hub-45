import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Operator } from '@/types';

interface OperatorFilters {
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  games?: string[];
  modes?: string[];
  verified?: boolean;
  kycRequired?: boolean | null;
}

interface PublicOperatorsData {
  operators: Operator[];
  totalCount: number;
  stats: {
    totalOperators: number;
    avgTrustScore: number;
    verifiedOperators: number;
    newThisMonth: number;
  };
}

const transformOperator = (op: any): Operator => ({
  id: op.id,
  name: op.name,
  slug: op.slug,
  logo: op.logo_url,
  logo_url: op.logo_url,
  verdict: op.verdict || '',
  overallRating: op.ratings?.overall || 0,
  feeLevel: 'Medium',
  paymentMethods: ['crypto'],
  modes: op.categories || [],
  pros: op.pros || [],
  cons: op.cons || [],
  trustScore: op.ratings?.trust || 0,
  fees: {
    deposit: 0,
    withdrawal: 0,
    trading: 0
  },
  payoutSpeed: '24 hours',
  kycRequired: op.kyc_required || false,
  countries: op.supported_countries || [],
  url: op.tracking_link || '#',
  verified: op.verification_status === 'verified',
  verification_status: op.verification_status,
  site_type: op.site_type,
  other_features: [],
  gaming_modes: [],
  games: [],
  categories: op.categories || []
});

const fetchPublicOperators = async (filters: OperatorFilters = {}): Promise<PublicOperatorsData> => {
  const { 
    search, 
    page = 1, 
    limit = 12, 
    sortBy = 'created_at',
    games = [],
    modes = [],
    verified,
    kycRequired
  } = filters;

  let query = supabase
    .from('operators')
    .select('*', { count: 'exact' })
    .eq('published', true);

  // Apply filters
  if (search) {
    query = query.ilike('name', `%${search}%`);
  }

  if (games.length > 0) {
    query = query.overlaps('categories', games);
  }

  if (modes.length > 0) {
    query = query.overlaps('categories', modes);
  }

  if (kycRequired !== null && kycRequired !== undefined) {
    query = query.eq('kyc_required', kycRequired);
  }

  // Apply sorting
  const ascending = sortBy.startsWith('-') ? false : true;
  const sortField = sortBy.startsWith('-') ? sortBy.slice(1) : sortBy;
  
  if (sortField === 'rating') {
    query = query.order('ratings->overall', { ascending, nullsFirst: false });
  } else if (sortField === 'name') {
    query = query.order('name', { ascending });
  } else {
    query = query.order(sortField, { ascending: false });
  }

  // Apply pagination
  const start = (page - 1) * limit;
  const end = start + limit - 1;
  query = query.range(start, end);

  const { data, error, count } = await query;

  if (error) throw error;

  const operators = (data || []).map(transformOperator);

  // Calculate stats (this could be optimized with a separate query or cached)
  const { data: allData, error: statsError } = await supabase
    .from('operators')
    .select('ratings, kyc_required, created_at')
    .eq('published', true);

  if (statsError) throw statsError;

  const avgRating = allData?.length > 0 
    ? allData.reduce((sum, op) => sum + ((op.ratings as any)?.trust || 0), 0) / allData.length 
    : 0;

  const newThisMonth = allData?.filter(op => {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    return new Date(op.created_at) > oneMonthAgo;
  }).length || 0;

  return {
    operators,
    totalCount: count || 0,
    stats: {
      totalOperators: count || 0,
      avgTrustScore: Number(avgRating.toFixed(1)),
      verifiedOperators: operators.filter(op => op.verified).length,
      newThisMonth
    }
  };
};

export function usePublicOperatorsQuery(filters: OperatorFilters = {}) {
  return useQuery({
    queryKey: ['publicOperators', filters],
    queryFn: () => fetchPublicOperators(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: (failureCount, error) => {
      console.error('Query failed:', error);
      if (failureCount >= 2) return false; // Reduced retries for faster fallback
      return true;
    },
    retryDelay: (attemptIndex) => Math.min(500 * 2 ** attemptIndex, 2000), // Faster retry
    refetchOnWindowFocus: false, // Prevent unnecessary refetches
    refetchOnMount: 'always' // Ensure fresh data on mount
  });
}