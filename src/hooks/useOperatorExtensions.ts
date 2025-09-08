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
  
  // Create stable refs for save functions to prevent crashes during publishing
  const saveFunctionsRef = useRef({
    saveBonuses: null as ((data: OperatorBonus[]) => Promise<void>) | null,
    savePayments: null as ((data: OperatorPayment[]) => Promise<void>) | null,
    saveFeatures: null as ((data: OperatorFeature[]) => Promise<void>) | null,
    saveSecurity: null as ((data: OperatorSecurity) => Promise<void>) | null,
    saveFaqs: null as ((data: OperatorFAQ[]) => Promise<void>) | null,
  });

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

  // Save bonuses
  const saveBonuses = useCallback(async (bonusData: OperatorBonus[]) => {
    if (!operatorId || operatorId.startsWith('temp-')) {
      toast.error('Please save the operator first before managing bonuses');
      return;
    }
    
    try {
      // Delete existing bonuses
      await supabase.from('operator_bonuses').delete().eq('operator_id', operatorId);
      
      // Insert new bonuses
      if (bonusData.length > 0) {
        const { error } = await supabase.from('operator_bonuses').insert(bonusData);
        if (error) throw error;
      }
      
      setBonuses(bonusData);
      toast.success('Bonuses saved successfully');
    } catch (error) {
      console.error('Error saving bonuses:', error);
      toast.error('Failed to save bonuses');
    }
  }, [operatorId]);

  // Save payments
  const savePayments = useCallback(async (paymentData: OperatorPayment[]) => {
    if (!operatorId || operatorId.startsWith('temp-')) {
      toast.error('Please save the operator first before managing payment methods');
      return;
    }
    
    try {
      // Delete existing payments
      await supabase.from('operator_payments').delete().eq('operator_id', operatorId);
      
      // Insert new payments
      if (paymentData.length > 0) {
        const { error } = await supabase.from('operator_payments').insert(paymentData);
        if (error) throw error;
      }
      
      setPayments(paymentData);
      toast.success('Payment methods saved successfully');
    } catch (error) {
      console.error('Error saving payments:', error);
      toast.error('Failed to save payment methods');
    }
  }, [operatorId]);

  // Save features
  const saveFeatures = useCallback(async (featureData: OperatorFeature[]) => {
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
  }, [operatorId]);

  // Save security
  const saveSecurity = useCallback(async (securityData: OperatorSecurity) => {
    if (!operatorId || operatorId.startsWith('temp-')) {
      toast.error('Please save the operator first before managing security');
      return;
    }
    
    try {
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

  // Save FAQs
  const saveFaqs = useCallback(async (faqData: OperatorFAQ[]) => {
    if (!operatorId || operatorId.startsWith('temp-')) {
      toast.error('Please save the operator first before managing FAQs');
      return;
    }
    
    try {
      // Delete existing FAQs
      await supabase.from('operator_faqs').delete().eq('operator_id', operatorId);
      
      // Insert new FAQs
      if (faqData.length > 0) {
        const { error } = await supabase.from('operator_faqs').insert(faqData);
        if (error) throw error;
      }
      
      setFaqs(faqData);
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

  // Update stable refs whenever functions change
  saveFunctionsRef.current.saveBonuses = saveBonuses;
  saveFunctionsRef.current.savePayments = savePayments;
  saveFunctionsRef.current.saveFeatures = saveFeatures;
  saveFunctionsRef.current.saveSecurity = saveSecurity;
  saveFunctionsRef.current.saveFaqs = saveFaqs;

  return {
    bonuses,
    payments,
    features,
    security,
    faqs,
    loading,
    // Return stable function references during publishing to prevent crashes
    saveBonuses: (isPublishing && publishingOperatorId === operatorId) 
      ? saveFunctionsRef.current.saveBonuses || saveBonuses 
      : saveBonuses,
    savePayments: (isPublishing && publishingOperatorId === operatorId) 
      ? saveFunctionsRef.current.savePayments || savePayments 
      : savePayments,
    saveFeatures: (isPublishing && publishingOperatorId === operatorId) 
      ? saveFunctionsRef.current.saveFeatures || saveFeatures 
      : saveFeatures,
    saveSecurity: (isPublishing && publishingOperatorId === operatorId) 
      ? saveFunctionsRef.current.saveSecurity || saveSecurity 
      : saveSecurity,
    saveFaqs: (isPublishing && publishingOperatorId === operatorId) 
      ? saveFunctionsRef.current.saveFaqs || saveFaqs 
      : saveFaqs,
    refetchData: fetchExtensionData
  };
}