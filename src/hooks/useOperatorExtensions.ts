import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { usePublishingState } from '@/hooks/usePublishingState';
import { usePublishingLock } from '@/hooks/usePublishingLock';

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
  const [isExtensionActive, setIsExtensionActive] = useState(false);
  const isMountedRef = useRef(true);
  const { isPublishing, operatorId: publishingOperatorId } = usePublishingState();
  const { isLocked } = usePublishingLock();
  
  // Removed queue system - direct saves only
  
  // Stable function references using useRef to prevent recreation
  const stableSaveRefs = useRef({
    saveBonuses: null as ((data: OperatorBonus[]) => Promise<void>) | null,
    savePayments: null as ((data: OperatorPayment[]) => Promise<void>) | null,
    saveFeatures: null as ((data: OperatorFeature[]) => Promise<void>) | null,
    saveSecurity: null as ((data: OperatorSecurity) => Promise<void>) | null,
    saveFaqs: null as ((data: OperatorFAQ[]) => Promise<void>) | null
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

  // Create stable save functions that won't change reference
  const createStableSaveBonus = useCallback(async (bonusData: OperatorBonus[]) => {
    if (!operatorId) {
      toast.error('No operator ID provided');
      return;
    }
    
    // Skip if operator is locked during publishing
    if (isLocked(operatorId)) {
      console.log('Operator is locked during publishing, skipping bonus save');
      toast.info('Changes will be saved after publishing completes');
      return;
    }
    
    // For temp operators, skip database operations entirely - localStorage handles this
    if (operatorId.startsWith('temp-')) {
      console.log('Skipping database save for temp operator bonuses - localStorage handles persistence');
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
  }, [operatorId, isExtensionActive]);

  // Store stable reference
  stableSaveRefs.current.saveBonuses = createStableSaveBonus;

  const createStableSavePayments = useCallback(async (paymentData: OperatorPayment[]) => {
    if (!operatorId) {
      toast.error('No operator ID provided');
      return;
    }
    
    // For temp operators, skip database operations entirely - localStorage handles this
    if (operatorId.startsWith('temp-')) {
      console.log('Skipping database save for temp operator payments - localStorage handles persistence');
      return;
    }
    
    // For existing operators: save immediately to database (no queuing)
    // For temp operators: localStorage handles persistence
    
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
  }, [operatorId, isExtensionActive]);

  stableSaveRefs.current.savePayments = createStableSavePayments;

  const createStableSaveFeatures = useCallback(async (featureData: OperatorFeature[]) => {
    // Skip if currently publishing to prevent conflicts
    if (isPublishing && publishingOperatorId === operatorId) {
      console.log('Skipping features save during publishing');
      return;
    }
    
    // For existing operators: save immediately to database (no queuing)
    // For temp operators: localStorage handles persistence
    
    if (!operatorId) {
      toast.error('No operator ID provided');
      return;
    }
    
    // For temp operators, skip database operations entirely - localStorage handles this
    if (operatorId.startsWith('temp-')) {
      console.log('Skipping database save for temp operator features - localStorage handles persistence');
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
  }, [operatorId, isPublishing, publishingOperatorId, isExtensionActive]);

  stableSaveRefs.current.saveFeatures = createStableSaveFeatures;

  const createStableSaveSecurity = useCallback(async (securityData: OperatorSecurity) => {
    if (!operatorId) {
      toast.error('No operator ID provided');
      return;
    }
    
    // For temp operators, skip database operations entirely - localStorage handles this
    if (operatorId.startsWith('temp-')) {
      console.log('Skipping database save for temp operator security - localStorage handles persistence');
      return;
    }
    
    // For existing operators: save immediately to database (no queuing)
    // For temp operators: localStorage handles persistence
    
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
  }, [operatorId, isExtensionActive]);

  stableSaveRefs.current.saveSecurity = createStableSaveSecurity;

  const createStableSaveFaqs = useCallback(async (faqData: OperatorFAQ[]) => {
    if (!operatorId) {
      toast.error('No operator ID provided');
      return;
    }
    
    // For temp operators, skip database operations entirely - localStorage handles this
    if (operatorId.startsWith('temp-')) {
      console.log('Skipping database save for temp operator faqs - localStorage handles persistence');
      return;
    }
    
    // For existing operators: save immediately to database (no queuing)
    // For temp operators: localStorage handles persistence
    
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
  }, [operatorId, isExtensionActive]);

  stableSaveRefs.current.saveFaqs = createStableSaveFaqs;

  // Simplified - no more queuing

  // Simplified extension activity tracking  
  const setExtensionActive = useCallback((active: boolean) => {
    console.log('Extension active state changed:', active);
    setIsExtensionActive(active);
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    fetchExtensionData();
    
    // Cleanup function to mark component as unmounted
    return () => {
      isMountedRef.current = false;
    };
  }, [operatorId, fetchExtensionData]);

  // Defensive wrapper functions that check for function existence
  const safeSaveBonuses = useCallback(async (data: OperatorBonus[]) => {
    try {
      if (stableSaveRefs.current.saveBonuses && typeof stableSaveRefs.current.saveBonuses === 'function') {
        await stableSaveRefs.current.saveBonuses(data);
      } else {
        console.error('Save bonuses function is not available');
        toast.error('Save function is not available');
      }
    } catch (error) {
      console.error('Error in safeSaveBonuses:', error);
      toast.error('Failed to save bonuses');
    }
  }, []);

  const safeSavePayments = useCallback(async (data: OperatorPayment[]) => {
    try {
      if (stableSaveRefs.current.savePayments && typeof stableSaveRefs.current.savePayments === 'function') {
        await stableSaveRefs.current.savePayments(data);
      } else {
        console.error('Save payments function is not available');
        toast.error('Save function is not available');
      }
    } catch (error) {
      console.error('Error in safeSavePayments:', error);
      toast.error('Failed to save payments');
    }
  }, []);

  const safeSaveFeatures = useCallback(async (data: OperatorFeature[]) => {
    try {
      if (stableSaveRefs.current.saveFeatures && typeof stableSaveRefs.current.saveFeatures === 'function') {
        await stableSaveRefs.current.saveFeatures(data);
      } else {
        console.error('Save features function is not available');
        toast.error('Save function is not available');
      }
    } catch (error) {
      console.error('Error in safeSaveFeatures:', error);
      toast.error('Failed to save features');
    }
  }, []);

  const safeSaveSecurity = useCallback(async (data: OperatorSecurity) => {
    try {
      if (stableSaveRefs.current.saveSecurity && typeof stableSaveRefs.current.saveSecurity === 'function') {
        await stableSaveRefs.current.saveSecurity(data);
      } else {
        console.error('Save security function is not available');
        toast.error('Save function is not available');
      }
    } catch (error) {
      console.error('Error in safeSaveSecurity:', error);
      toast.error('Failed to save security');
    }
  }, []);

  const safeSaveFaqs = useCallback(async (data: OperatorFAQ[]) => {
    try {
      if (stableSaveRefs.current.saveFaqs && typeof stableSaveRefs.current.saveFaqs === 'function') {
        await stableSaveRefs.current.saveFaqs(data);
      } else {
        console.error('Save FAQs function is not available');
        toast.error('Save function is not available');
      }
    } catch (error) {
      console.error('Error in safeSaveFaqs:', error);
      toast.error('Failed to save FAQs');
    }
  }, []);

  return {
    bonuses,
    payments,
    features,
    security,
    faqs,
    loading,
    isExtensionActive,
    // Return defensive wrapper functions with stable references
    saveBonuses: safeSaveBonuses,
    savePayments: safeSavePayments,
    saveFeatures: safeSaveFeatures,
    saveSecurity: safeSaveSecurity,
    saveFaqs: safeSaveFaqs,
    refetchData: fetchExtensionData,
    setExtensionActive
  };
}