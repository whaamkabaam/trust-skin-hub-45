import { useState, useEffect } from 'react';
import { useStaticContent } from './useStaticContent';

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
  
  const { getPublishedContent } = useStaticContent();

  useEffect(() => {
    const fetchExtensions = async () => {
      try {
        setLoading(true);
        setError(null);

        const staticContent = await getPublishedContent(slug);
        
        if (staticContent) {
          setBonuses(staticContent.bonuses || []);
          setPayments(staticContent.payments || []);
          setFeatures(staticContent.features || []);
          setSecurity(staticContent.security || null);
          setFaqs(staticContent.faqs || []);
        } else {
          setError('Extensions not found');
        }

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
  }, [slug, getPublishedContent]);

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