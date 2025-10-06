import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface OperatorExtensions {
  bonuses: any[];
  payments: any[];
  features: any[];
  security: any | null;
  faqs: any[];
  loading: boolean;
  error: string | null;
}

export function usePublicOperatorExtensions(slug: string): OperatorExtensions {
  const [bonuses, setBonuses] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [features, setFeatures] = useState<any[]>([]);
  const [security, setSecurity] = useState<any | null>(null);
  const [faqs, setFaqs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExtensions = async () => {
      try {
        setLoading(true);
        setError(null);

        // First get the operator to find its ID
        const { data: operator, error: operatorError } = await supabase
          .from('operators')
          .select('id')
          .eq('slug', slug)
          .eq('published', true)
          .single();

        if (operatorError || !operator) {
          setError('Operator not found');
          return;
        }

        // Fetch all extension data directly from tables
        const [
          { data: bonusesData },
          { data: paymentsData },
          { data: featuresData },
          { data: securityData },
          { data: faqsData }
        ] = await Promise.all([
          supabase.from('operator_bonuses').select('*').eq('operator_id', operator.id).order('order_number'),
          supabase
            .from('operator_payment_methods')
            .select(`
              *,
              payment_method:payment_methods(
                id,
                name,
                slug,
                logo_url,
                description_rich
              )
            `)
            .eq('operator_id', operator.id),
          supabase.from('operator_features').select('*').eq('operator_id', operator.id),
          supabase.from('operator_security').select('*').eq('operator_id', operator.id).maybeSingle(),
          supabase.from('operator_faqs').select('*').eq('operator_id', operator.id).order('order_number')
        ]);

        setBonuses(bonusesData || []);
        setPayments(paymentsData || []);
        setFeatures(featuresData || []);
        setSecurity(securityData || null);
        setFaqs(faqsData || []);

      } catch (err) {
        console.error('Error fetching operator extensions:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch extensions');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchExtensions();
    }
  }, [slug]);

  return {
    bonuses,
    payments,
    features,
    security,
    faqs,
    loading,
    error
  };
}