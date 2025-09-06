import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Operator } from '@/types';

interface PublicOperatorsData {
  operators: Operator[];
  loading: boolean;
  error: string | null;
  totalCount: number;
  stats: {
    totalOperators: number;
    avgTrustScore: number;
    verifiedOperators: number;
    newThisMonth: number;
  };
}

export function usePublicOperators(): PublicOperatorsData {
  const [operators, setOperators] = useState<Operator[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [stats, setStats] = useState({
    totalOperators: 0,
    avgTrustScore: 0,
    verifiedOperators: 0,
    newThisMonth: 0
  });

  useEffect(() => {
    fetchPublicOperators();
  }, []);

  const fetchPublicOperators = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch published operators only
      const { data: operatorsData, error: operatorsError, count } = await supabase
        .from('operators')
        .select('*', { count: 'exact' })
        .eq('published', true)
        .order('created_at', { ascending: false });

      if (operatorsError) throw operatorsError;

      // Transform database data to match Operator interface
      const transformedOperators: Operator[] = (operatorsData || []).map((op: any) => ({
        id: op.id,
        name: op.name,
        slug: op.slug,
        logo: op.logo_url,
        verdict: op.verdict || '',
        overallRating: op.ratings?.overall || 0,
        feeLevel: 'Medium', // Default since not in DB
        paymentMethods: ['crypto'], // Default since not in DB  
        modes: op.categories || [],
        pros: op.pros || [],
        cons: op.cons || [],
        trustScore: op.ratings?.trust || 0,
        fees: {
          deposit: 0,
          withdrawal: 0,
          trading: 0
        },
        payoutSpeed: '24 hours', // Default
        kycRequired: op.kyc_required || false,
        countries: op.supported_countries || [],
        url: op.tracking_link || '#',
        verified: true, // All published operators are verified
        otherFeatures: [],
        gamingModes: [],
        games: [],
        categories: op.categories || []
      }));

      setOperators(transformedOperators);
      setTotalCount(count || 0);

      // Calculate stats
      const avgRating = transformedOperators.length > 0 
        ? transformedOperators.reduce((sum, op) => sum + op.trustScore, 0) / transformedOperators.length 
        : 0;

      const newThisMonth = transformedOperators.filter(op => {
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        return new Date(op.launch_year ? `${op.launch_year}-01-01` : Date.now()) > oneMonthAgo;
      }).length;

      setStats({
        totalOperators: count || 0,
        avgTrustScore: Number(avgRating.toFixed(1)),
        verifiedOperators: transformedOperators.filter(op => op.verified).length,
        newThisMonth
      });

    } catch (err) {
      console.error('Error fetching public operators:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch operators');
    } finally {
      setLoading(false);
    }
  };

  return {
    operators,
    loading,
    error,
    totalCount,
    stats
  };
}