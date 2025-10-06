import { useState, useEffect, useCallback } from 'react';
import type { OperatorBonus, OperatorPaymentMethod, OperatorFeature, OperatorSecurity, OperatorFAQ } from './useOperatorExtensions';

interface LocalStorageExtensions {
  bonuses: OperatorBonus[];
  payments: OperatorPaymentMethod[];
  features: OperatorFeature[];
  security: OperatorSecurity | null;
  faqs: OperatorFAQ[];
  saveBonusesToLocal: (bonuses: OperatorBonus[]) => void;
  savePaymentsToLocal: (payments: OperatorPaymentMethod[]) => void;
  saveFeaturesToLocal: (features: OperatorFeature[]) => void;
  saveSecurityToLocal: (security: OperatorSecurity | null) => void;
  saveFaqsToLocal: (faqs: OperatorFAQ[]) => void;
  clearLocalStorage: () => void;
  hasLocalData: boolean;
}

/**
 * Hook for managing extension data in localStorage for temporary operators
 */
export function useLocalStorageExtensions(tempId: string): LocalStorageExtensions {
  const [bonuses, setBonuses] = useState<OperatorBonus[]>([]);
  const [payments, setPayments] = useState<OperatorPaymentMethod[]>([]);
  const [features, setFeatures] = useState<OperatorFeature[]>([]);
  const [security, setSecurity] = useState<OperatorSecurity | null>(null);
  const [faqs, setFaqs] = useState<OperatorFAQ[]>([]);
  const [hasLocalData, setHasLocalData] = useState(false);

  // Load data from localStorage on mount
  useEffect(() => {
    const loadFromStorage = () => {
      try {
        const storedBonuses = localStorage.getItem(`temp-bonuses-${tempId}`);
        const storedPayments = localStorage.getItem(`temp-payments-${tempId}`);
        const storedFeatures = localStorage.getItem(`temp-features-${tempId}`);
        const storedSecurity = localStorage.getItem(`temp-security-${tempId}`);
        const storedFaqs = localStorage.getItem(`temp-faqs-${tempId}`);

        if (storedBonuses) {
          setBonuses(JSON.parse(storedBonuses));
          setHasLocalData(true);
        }
        if (storedPayments) {
          setPayments(JSON.parse(storedPayments));
          setHasLocalData(true);
        }
        if (storedFeatures) {
          setFeatures(JSON.parse(storedFeatures));
          setHasLocalData(true);
        }
        if (storedSecurity) {
          setSecurity(JSON.parse(storedSecurity));
          setHasLocalData(true);
        }
        if (storedFaqs) {
          setFaqs(JSON.parse(storedFaqs));
          setHasLocalData(true);
        }
      } catch (error) {
        console.error('Error loading extension data from localStorage:', error);
      }
    };

    loadFromStorage();
  }, [tempId]);

  const saveBonusesToLocal = useCallback((bonusData: OperatorBonus[]) => {
    setBonuses(bonusData);
    localStorage.setItem(`temp-bonuses-${tempId}`, JSON.stringify(bonusData));
    setHasLocalData(true);
  }, [tempId]);

  const savePaymentsToLocal = useCallback((paymentData: OperatorPaymentMethod[]) => {
    setPayments(paymentData);
    localStorage.setItem(`temp-payments-${tempId}`, JSON.stringify(paymentData));
    setHasLocalData(true);
  }, [tempId]);

  const saveFeaturesToLocal = useCallback((featureData: OperatorFeature[]) => {
    setFeatures(featureData);
    localStorage.setItem(`temp-features-${tempId}`, JSON.stringify(featureData));
    setHasLocalData(true);
  }, [tempId]);

  const saveSecurityToLocal = useCallback((securityData: OperatorSecurity | null) => {
    setSecurity(securityData);
    if (securityData) {
      localStorage.setItem(`temp-security-${tempId}`, JSON.stringify(securityData));
    } else {
      localStorage.removeItem(`temp-security-${tempId}`);
    }
    setHasLocalData(true);
  }, [tempId]);

  const saveFaqsToLocal = useCallback((faqData: OperatorFAQ[]) => {
    setFaqs(faqData);
    localStorage.setItem(`temp-faqs-${tempId}`, JSON.stringify(faqData));
    setHasLocalData(true);
  }, [tempId]);

  const clearLocalStorage = useCallback(() => {
    localStorage.removeItem(`temp-bonuses-${tempId}`);
    localStorage.removeItem(`temp-payments-${tempId}`);
    localStorage.removeItem(`temp-features-${tempId}`);
    localStorage.removeItem(`temp-security-${tempId}`);
    localStorage.removeItem(`temp-faqs-${tempId}`);
    
    setBonuses([]);
    setPayments([]);
    setFeatures([]);
    setSecurity(null);
    setFaqs([]);
    setHasLocalData(false);
  }, [tempId]);

  return {
    bonuses,
    payments,
    features,
    security,
    faqs,
    saveBonusesToLocal,
    savePaymentsToLocal,
    saveFeaturesToLocal,
    saveSecurityToLocal,
    saveFaqsToLocal,
    clearLocalStorage,
    hasLocalData
  };
}

/**
 * Get all temporary extension data for migration to database
 */
export function getTempExtensionData(tempId: string) {
  try {
    const bonuses = localStorage.getItem(`temp-bonuses-${tempId}`);
    const payments = localStorage.getItem(`temp-payments-${tempId}`);
    const features = localStorage.getItem(`temp-features-${tempId}`);
    const security = localStorage.getItem(`temp-security-${tempId}`);
    const faqs = localStorage.getItem(`temp-faqs-${tempId}`);

    return {
      bonuses: bonuses ? JSON.parse(bonuses) : [],
      payments: payments ? JSON.parse(payments) : [],
      features: features ? JSON.parse(features) : [],
      security: security ? JSON.parse(security) : null,
      faqs: faqs ? JSON.parse(faqs) : []
    };
  } catch (error) {
    console.error('Error getting temp extension data:', error);
    return {
      bonuses: [],
      payments: [],
      features: [],
      security: null,
      faqs: []
    };
  }
}