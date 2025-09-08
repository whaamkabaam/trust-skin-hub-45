import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { usePublishingState } from '@/hooks/usePublishingState';

export interface OperatorBonus {
  id?: string;
  operator_id: string;
  bonus_type: string;
  title: string;
  description?: string;
  value?: string;
  terms?: string;
  is_active: boolean;
  order_number: number;
}

export interface OperatorPayment {
  id?: string;
  operator_id: string;
  method_type: string;
  payment_method: string;
  minimum_amount?: number;
  maximum_amount?: number;
  fee_percentage?: number;
  fee_fixed?: number;
  processing_time?: string;
  is_available: boolean;
}

export interface OperatorFeature {
  id?: string;
  operator_id: string;
  feature_type: string;
  feature_name: string;
  description?: string;
  is_highlighted: boolean;
}

export interface OperatorSecurity {
  id?: string;
  operator_id: string;
  ssl_enabled: boolean;
  ssl_provider?: string;
  license_info?: string;
  compliance_certifications: string[];
  data_protection_info?: string;
  responsible_gaming_info?: string;
  provably_fair: boolean;
  provably_fair_description?: string;
  complaints_platform?: string;
  audit_info?: string;
}

export interface OperatorFAQ {
  id?: string;
  operator_id: string;
  question: string;
  answer: string;
  category?: string;
  order_number: number;
  is_featured: boolean;
}

export function useOperatorExtensions(operatorId: string) {
  const [bonuses, setBonuses] = useState<OperatorBonus[]>([]);
  const [payments, setPayments] = useState<OperatorPayment[]>([]);
  const [features, setFeatures] = useState<OperatorFeature[]>([]);
  const [security, setSecurity] = useState<OperatorSecurity | null>(null);
  const [faqs, setFaqs] = useState<OperatorFAQ[]>([]);
  const [loading, setLoading] = useState(false);
  const isMountedRef = useRef(true);
  const { isPublishing, operatorId: publishingOperatorId } = usePublishingState();

  // Fetch all extension data
  const fetchExtensionData = useCallback(async () => {
    if (!operatorId || operatorId.startsWith('temp-')) {
      if (isMountedRef.current) {
        setLoading(false);
      }
      return;
    }
    
    if (isMountedRef.current) {
      setLoading(true);
    }
    
    try {
      const [bonusesRes, paymentsRes, featuresRes, securityRes, faqsRes] = await Promise.all([
        supabase.from('operator_bonuses').select('*').eq('operator_id', operatorId).order('order_number'),
        supabase.from('operator_payments').select('*').eq('operator_id', operatorId),
        supabase.from('operator_features').select('*').eq('operator_id', operatorId),
        supabase.from('operator_security').select('*').eq('operator_id', operatorId).single(),
        supabase.from('operator_faqs').select('*').eq('operator_id', operatorId).order('order_number')
      ]);

      // Only update state if component is still mounted
      if (!isMountedRef.current) return;

      if (bonusesRes.error && bonusesRes.error.code !== 'PGRST116') throw bonusesRes.error;
      if (paymentsRes.error) throw paymentsRes.error;
      if (featuresRes.error) throw featuresRes.error;
      if (faqsRes.error) throw faqsRes.error;

      setBonuses(bonusesRes.data || []);
      setPayments(paymentsRes.data || []);
      setFeatures(featuresRes.data || []);
      setSecurity(securityRes.data || null);
      setFaqs(faqsRes.data || []);
    } catch (error) {
      if (isMountedRef.current) {
        console.error('Error fetching extension data:', error);
        toast.error('Failed to load operator details');
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [operatorId]);

  // Save bonuses with stable reference and defensive programming
  const saveBonuses = useCallback(async (bonusData: OperatorBonus[]) => {
    if (!operatorId || operatorId.startsWith('temp-')) {
      toast.error('Please save the operator first before managing bonuses');
      return;
    }
    
    try {
      console.log('Saving bonuses for operator:', operatorId, bonusData);
      
      // Delete existing bonuses
      const { error: deleteError } = await supabase
        .from('operator_bonuses')
        .delete()
        .eq('operator_id', operatorId);
      
      if (deleteError) throw deleteError;
      
      // Insert new bonuses
      if (bonusData && bonusData.length > 0) {
        const { error: insertError } = await supabase
          .from('operator_bonuses')
          .insert(bonusData);
        if (insertError) throw insertError;
      }
      
      setBonuses(bonusData || []);
      toast.success('Bonuses saved successfully');
    } catch (error) {
      console.error('Error saving bonuses:', error);
      toast.error('Failed to save bonuses');
    }
  }, [operatorId]);

  // Save payments with stable reference and defensive programming
  const savePayments = useCallback(async (paymentData: OperatorPayment[]) => {
    if (!operatorId || operatorId.startsWith('temp-')) {
      toast.error('Please save the operator first before managing payment methods');
      return;
    }
    
    try {
      console.log('Saving payments for operator:', operatorId, paymentData);
      
      // Delete existing payments
      const { error: deleteError } = await supabase
        .from('operator_payments')
        .delete()
        .eq('operator_id', operatorId);
      
      if (deleteError) throw deleteError;
      
      // Insert new payments
      if (paymentData && paymentData.length > 0) {
        const { error: insertError } = await supabase
          .from('operator_payments')
          .insert(paymentData);
        if (insertError) throw insertError;
      }
      
      setPayments(paymentData || []);
      toast.success('Payment methods saved successfully');
    } catch (error) {
      console.error('Error saving payments:', error);
      toast.error('Failed to save payment methods');
    }
  }, [operatorId]);

  // Save features
  const saveFeatures = useCallback(async (featureData: OperatorFeature[]) => {
    // Skip if currently publishing to prevent conflicts
    if (isPublishing && publishingOperatorId === operatorId) {
      console.log('Skipping features save during publishing');
      return;
    }
    
    if (!operatorId || operatorId.startsWith('temp-')) {
      toast.error('Please save the operator first before managing features');
      return;
    }
    
    try {
      // Delete existing features
      await supabase.from('operator_features').delete().eq('operator_id', operatorId);
      
      // Insert new features
      if (featureData.length > 0) {
        const { error } = await supabase.from('operator_features').insert(featureData);
        if (error) throw error;
      }
      
      setFeatures(featureData);
      toast.success('Features saved successfully');
    } catch (error) {
      console.error('Error saving features:', error);
      toast.error('Failed to save features');
    }
  }, [operatorId, isPublishing, publishingOperatorId]);

  // Save security with stable reference and defensive programming
  const saveSecurity = useCallback(async (securityData: OperatorSecurity) => {
    if (!operatorId || operatorId.startsWith('temp-')) {
      toast.error('Please save the operator first before managing security');
      return;
    }
    
    try {
      console.log('Saving security for operator:', operatorId, securityData);
      
      if (!securityData) {
        console.error('No security data provided');
        return;
      }
      
      const { error } = await supabase
        .from('operator_security')
        .upsert({ ...securityData, operator_id: operatorId });
      
      if (error) throw error;
      
      setSecurity(securityData);
      toast.success('Security settings saved successfully');
    } catch (error) {
      console.error('Error saving security:', error);
      toast.error('Failed to save security settings');
    }
  }, [operatorId]);

  // Save FAQs with stable reference and defensive programming
  const saveFaqs = useCallback(async (faqData: OperatorFAQ[]) => {
    if (!operatorId || operatorId.startsWith('temp-')) {
      toast.error('Please save the operator first before managing FAQs');
      return;
    }
    
    try {
      console.log('Saving FAQs for operator:', operatorId, faqData);
      
      // Delete existing FAQs
      const { error: deleteError } = await supabase
        .from('operator_faqs')
        .delete()
        .eq('operator_id', operatorId);
      
      if (deleteError) throw deleteError;
      
      // Insert new FAQs
      if (faqData && faqData.length > 0) {
        const { error: insertError } = await supabase
          .from('operator_faqs')
          .insert(faqData);
        if (insertError) throw insertError;
      }
      
      setFaqs(faqData || []);
      toast.success('FAQs saved successfully');
    } catch (error) {
      console.error('Error saving FAQs:', error);
      toast.error('Failed to save FAQs');
    }
  }, [operatorId]);

  useEffect(() => {
    isMountedRef.current = true;
    fetchExtensionData();
    
    // Cleanup function to mark component as unmounted
    return () => {
      isMountedRef.current = false;
    };
  }, [operatorId, fetchExtensionData]);

  return {
    bonuses,
    payments,
    features,
    security,
    faqs,
    loading,
    // Always return the same stable function references
    saveBonuses,
    savePayments,
    saveFeatures,
    saveSecurity,
    saveFaqs,
    refetchData: fetchExtensionData
  };
}